import { ApiException, ApiResponse, RequestMethod, SessionExpiredException } from './ApiModels'
import { WanAndroidApi } from './WanAndroidApi'
import { SessionStore } from '../storage/SessionStore'
import { SessionEventBus } from '../session/SessionEventBus'

export interface RequestOptions {
  method: RequestMethod
  path: string
  query?: Record<string, string | number>
  body?: Record<string, string | number>
  headers?: Record<string, string>
  retryCount?: number
}

/**
 * 网络层骨架：
 * 1. 统一拼接 baseUrl
 * 2. 统一响应解包
 * 3. 统一处理 errorCode 与 -1001
 */
export class ApiClient {
  async request<T>(options: RequestOptions): Promise<T> {
    const totalRetry = options.retryCount ?? (options.method === RequestMethod.GET ? 1 : 0)
    let attempt = 0
    let lastError: unknown = null

    while (attempt <= totalRetry) {
      try {
        return await this.requestOnce<T>(options)
      } catch (error) {
        lastError = error
        if (!this.shouldRetry(error, options.method, attempt, totalRetry)) {
          throw error
        }
        await this.sleep(250 * (attempt + 1))
        attempt++
      }
    }

    throw lastError
  }

  private async requestOnce<T>(options: RequestOptions): Promise<T> {
    const url: string = this.buildUrl(options.path, options.query)
    const response: Response = await fetch(url, {
      method: options.method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...options.headers
      },
      body: this.buildBody(options.body, options.method)
    })

    if (!response.ok) {
      throw new ApiException(response.status, `网络请求失败: ${response.status}`)
    }

    const json = await response.json() as ApiResponse<T>
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

  private buildUrl(path: string, query?: Record<string, string | number>): string {
    const fullPath = `${WanAndroidApi.BASE_URL}${path}`
    if (!query || Object.keys(query).length === 0) {
      return fullPath
    }
    const queryStr = Object.keys(query)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(String(query[key]))}`)
      .join('&')
    return `${fullPath}${fullPath.includes('?') ? '&' : '?'}${queryStr}`
  }

  private buildBody(body: Record<string, string | number> | undefined, method: RequestMethod): string | undefined {
    if (method !== RequestMethod.POST || !body) {
      return undefined
    }
    return Object.keys(body)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(String(body[key]))}`)
      .join('&')
  }

  private shouldRetry(
    error: unknown,
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
