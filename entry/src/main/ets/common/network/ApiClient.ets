import { ApiException, ApiResponse, RequestMethod, SessionExpiredException } from './ApiModels'
import { NetworkError, toNetworkError } from './ErrorMessage'
import http from '@ohos.net.http'
import { WanAndroidApi } from './WanAndroidApi'
import { SessionStore } from '../storage/SessionStore'
import { SessionEventBus } from '../session/SessionEventBus'
import { ExploreLogger } from '../log/ExploreLogger'

export interface RequestOptions {
  method: RequestMethod
  path: string
  query?: Record<string, string | number>
  body?: string
  retryCount?: number
}

/**
 * 网络层骨架：
 * 1. 统一拼接 baseUrl
 * 2. 统一响应解包
 * 3. 统一处理 errorCode 与 -1001
 */
export class ApiClient {
  private static readonly MAX_LOG_LEN: number = 1200

  async request<T>(options: RequestOptions): Promise<T> {
    const totalRetry = options.retryCount ?? (options.method === RequestMethod.GET ? 1 : 0)
    let attempt = 0
    let lastError: NetworkError | null = null

    while (attempt <= totalRetry) {
      try {
        return await this.requestOnce<T>(options)
      } catch (error) {
        const typedError = toNetworkError(error)
        lastError = typedError
        if (!this.shouldRetry(typedError, options.method, attempt, totalRetry)) {
          throw new Error(typedError.message)
        }
        await this.sleep(250 * (attempt + 1))
        attempt++
      }
    }

    throw new Error(lastError?.message || '请求失败')
  }

  private async requestOnce<T>(options: RequestOptions): Promise<T> {
    const body = this.buildBody(options.body, options.method)
    const hosts: string[] = [WanAndroidApi.BASE_URL, WanAndroidApi.BACKUP_BASE_URL, WanAndroidApi.IP_BASE_URL]
    let lastError: Error | null = null

    for (let i = 0; i < hosts.length; i++) {
      const url = this.buildUrlWithHost(hosts[i], options.path, options.query)
      const request = http.createHttp()
      this.logDebug(`REQ ${options.method} ${url} body=${this.clipLog(body || '')}`)
      let response: http.HttpResponse
      try {
        response = await this.sendRequest(request, url, options.method, body)
      } catch (error) {
        const rawError = JSON.stringify(error)
        this.logDebug(`ERR ${options.method} ${url} error=${this.clipLog(rawError)}`)
        request.destroy()
        const typedError = toNetworkError(error)
        lastError = new Error(typedError.message)
        const shouldTryNextHost = options.method === RequestMethod.GET && i < hosts.length - 1
        if (shouldTryNextHost) {
          this.logDebug(`RETRY_HOST ${options.method} switch_to=${hosts[i + 1]} raw=${this.clipLog(rawError)}`)
          continue
        }
        throw lastError
      }
      request.destroy()
      const resultText = typeof response.result === 'string' ? response.result : JSON.stringify(response.result)
      this.logDebug(`RES ${options.method} ${url} code=${response.responseCode} result=${this.clipLog(resultText || '')}`)

      if (response.responseCode < 200 || response.responseCode >= 300) {
        throw new ApiException(response.responseCode, `网络请求失败: ${response.responseCode}`)
      }

      const json = JSON.parse(resultText || '{}') as ApiResponse<T>
      if (json.errorCode === 0) {
        return json.data
      }
      if (json.errorCode === -1001) {
        SessionStore.shared().clear()
        SessionEventBus.emitExpired(json.errorMsg || '登录状态失效')
        throw new SessionExpiredException(json.errorMsg || '登录状态失效')
      }
      throw new ApiException(json.errorCode, json.errorMsg || '服务端返回错误')
    }

    throw lastError || new Error('请求失败')
  }

  private buildUrlWithHost(host: string, path: string, query?: Record<string, string | number>): string {
    const fullPath = `${host}${path}`
    if (!query || Object.keys(query).length === 0) {
      return fullPath
    }
    const queryStr = Object.keys(query)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(String(query[key]))}`)
      .join('&')
    return `${fullPath}${fullPath.includes('?') ? '&' : '?'}${queryStr}`
  }

  private buildBody(body: string | undefined, method: RequestMethod): string | undefined {
    if (method !== RequestMethod.POST || !body) {
      return undefined
    }
    return body
  }

  private buildHeaders(url: string): Record<string, string> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (url.startsWith(WanAndroidApi.IP_BASE_URL)) {
      headers['Host'] = WanAndroidApi.CANONICAL_HOST
    }
    return headers
  }

  private async sendRequest(
    request: http.HttpRequest,
    url: string,
    method: RequestMethod,
    body: string | undefined
  ): Promise<http.HttpResponse> {
    return await new Promise<http.HttpResponse>((resolve, reject) => {
      request.request(url, {
        method: this.toHttpMethod(method),
        header: this.buildHeaders(url),
        extraData: body,
        connectTimeout: 60000,
        readTimeout: 60000
      }, (err: BusinessError, data: http.HttpResponse) => {
        if (err) {
          reject(err)
          return
        }
        resolve(data)
      })
    })
  }

  private toHttpMethod(method: RequestMethod): http.RequestMethod {
    if (method === RequestMethod.POST) {
      return http.RequestMethod.POST
    }
    return http.RequestMethod.GET
  }

  private logDebug(message: string): void {
    ExploreLogger.info('ApiClient', message)
  }

  private clipLog(text: string): string {
    if (text.length <= ApiClient.MAX_LOG_LEN) {
      return text
    }
    return `${text.slice(0, ApiClient.MAX_LOG_LEN)}...(truncated)`
  }

  private shouldRetry(
    error: NetworkError,
    method: RequestMethod,
    attempt: number,
    totalRetry: number
  ): boolean {
    if (attempt >= totalRetry) {
      return false
    }
    if (method !== RequestMethod.GET) {
      return false
    }
    if (error instanceof SessionExpiredException) {
      return false
    }
    if (error instanceof ApiException) {
      return error.code >= 500 || error.code === 408 || error.code === 429
    }
    if (error instanceof Error) {
      const msg = error.message || ''
      return msg.includes('Network') || msg.includes('Failed to fetch')
    }
    return false
  }
  private async sleep(ms: number): Promise<void> {
    await new Promise<void>((resolve) => {
      setTimeout(() => resolve(), ms)
    })
  }
}
