import { ApiException, SessionExpiredException } from './ApiModels'

export type NetworkError = ApiException | SessionExpiredException | Error

export function toNetworkError(error: Object): NetworkError {
  if (error instanceof SessionExpiredException) {
    return error
  }
  if (error instanceof ApiException) {
    return error
  }
  if (error instanceof Error) {
    return error
  }
  return new Error('请求失败')
}

export function parseErrorMessage(error: Object, fallback: string = '请求失败，请稍后重试'): string {
  const typedError = toNetworkError(error)
  return parseTypedErrorMessage(typedError, fallback)
}

function parseTypedErrorMessage(error: NetworkError, fallback: string): string {
  if (error instanceof SessionExpiredException) {
    return '登录已失效，请重新登录'
  }

  if (error instanceof ApiException) {
    if (error.code >= 500) {
      return '服务暂时不可用，请稍后重试'
    }
    if (error.code === 429) {
      return '请求过于频繁，请稍后再试'
    }
    if (error.code === 404) {
      return '请求资源不存在'
    }
    if (error.code === 401 || error.code === 403) {
      return '当前操作需要登录授权'
    }
    return error.message || fallback
  }

  if (error instanceof Error) {
    const message = error.message || ''
    if (message.includes('Network') || message.includes('Failed to fetch')) {
      return '网络连接异常，请检查网络后重试'
    }
    return message || fallback
  }

  return fallback
}
