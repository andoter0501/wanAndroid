export interface ApiResponse<T> {
  data: T
  errorCode: number
  errorMsg: string
}

export class ApiException extends Error {
  public readonly code: number

  constructor(code: number, message: string) {
    super(message)
    this.name = 'ApiException'
    this.code = code
  }
}

export class SessionExpiredException extends ApiException {
  constructor(message: string = '登录已失效，请重新登录') {
    super(-1001, message)
    this.name = 'SessionExpiredException'
  }
}

export enum RequestMethod {
  GET = 'GET',
  POST = 'POST'
}
