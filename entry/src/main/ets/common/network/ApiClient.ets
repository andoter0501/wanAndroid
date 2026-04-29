import { ApiException, ApiResponse, RequestMethod, SessionExpiredException } from './ApiModels'
import { NetworkError, toNetworkError } from './ErrorMessage'
import http from '@ohos.net.http'
import { WanAndroidApi } from './WanAndroidApi'
import { SessionStore } from '../storage/SessionStore'
import { LocalCacheStore } from '../storage/LocalCacheStore'
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
  private static readonly COOKIE_KEY: string = 'wan_cookie'

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
      this.persistCookies(response.header as Record<string, string | string[]>)
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
        LocalCacheStore.shared().setString(ApiClient.COOKIE_KEY, '')
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

  private buildHeaders(url: string, method: RequestMethod, body: string | undefined): Record<string, string> {
    const headers: Record<string, string> = {}
    if (method === RequestMethod.POST && body && body.length > 0) {
      headers['Content-Type'] = 'application/x-www-form-urlencoded'
    } else {
      headers['Content-Type'] = 'application/json'
    }
    if (url.startsWith(WanAndroidApi.IP_BASE_URL)) {
      headers['Host'] = WanAndroidApi.CANONICAL_HOST
    }
    const cookie = LocalCacheStore.shared().getString(ApiClient.COOKIE_KEY)
    if (cookie.length > 0) {
      headers['Cookie'] = cookie
    }
    return headers
  }

  private persistCookies(headers: Record<string, string | string[]>): void {
    const setCookie = this.findHeader(headers, 'set-cookie')
    if (!setCookie || setCookie.length === 0) {
      return
    }

    const cookieMap = this.parseCookieString(LocalCacheStore.shared().getString(ApiClient.COOKIE_KEY))
    setCookie.forEach((raw) => {
      const parts = raw.split(';')
      if (parts.length === 0) {
        return
      }
      const pair = parts[0].trim()
      const index = pair.indexOf('=')
      if (index <= 0) {
        return
      }
      const name = pair.slice(0, index)
      const value = pair.slice(index + 1)
      const lower = raw.toLowerCase()
      if (lower.includes('max-age=0') || lower.includes('expires=thu, 01 jan 1970')) {
        cookieMap.delete(name)
      } else {
        cookieMap.set(name, value)
      }
    })

    const nextCookie = Array.from(cookieMap.entries())
      .map((entry) => `${entry[0]}=${entry[1]}`)
      .join('; ')
    LocalCacheStore.shared().setString(ApiClient.COOKIE_KEY, nextCookie)
  }

  private findHeader(headers: Record<string, string | string[]>, name: string): string[] {
    const keys = Object.keys(headers)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      if (key.toLowerCase() === name) {
        const value = headers[key]
        if (Array.isArray(value)) {
          return value
        }
        return this.splitSetCookie(value)
      }
    }
    return []
  }

  private splitSetCookie(value: string): string[] {
    if (value.length === 0) {
      return []
    }
    return value.split(/,(?=\\s*[^;,\\s]+=)/).map((item) => item.trim()).filter((item) => item.length > 0)
  }

  private parseCookieString(cookie: string): Map<string, string> {
    const map = new Map<string, string>()
    if (cookie.length === 0) {
      return map
    }
    cookie.split(';').forEach((part) => {
      const pair = part.trim()
      const index = pair.indexOf('=')
      if (index > 0) {
        map.set(pair.slice(0, index), pair.slice(index + 1))
      }
    })
    return map
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
        header: this.buildHeaders(url, method, body),
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
