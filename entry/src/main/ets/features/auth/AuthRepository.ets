import { ApiClient } from '../../common/network/ApiClient'
import { RequestMethod } from '../../common/network/ApiModels'
import { WanAndroidApi } from '../../common/network/WanAndroidApi'

export interface UserInfoData {
  coinInfo: UserCoinInfo
  userInfo: UserInfoProfile
}

export interface UserCoinInfo {
  coinCount: number
  level: number
  rank: string
  userId: number
  username: string
  nickname: string
}

export interface UserInfoProfile {
  id: number
  username: string
  nickname: string
  email?: string
}

export interface LoginData {
  id: number
  username: string
  nickname: string
  coinCount?: number
}

export class AuthRepository {
  private readonly apiClient: ApiClient

  constructor(apiClient: ApiClient = new ApiClient()) {
    this.apiClient = apiClient
  }

  login(username: string, password: string): Promise<LoginData> {
    const body = `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
    return this.apiClient.request<LoginData>({
      method: RequestMethod.POST,
      path: WanAndroidApi.login(),
      body
    })
  }

  register(username: string, password: string, repassword: string): Promise<LoginData> {
    const body = `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&repassword=${encodeURIComponent(repassword)}`
    return this.apiClient.request<LoginData>({
      method: RequestMethod.POST,
      path: WanAndroidApi.register(),
      body
    })
  }

  logout(): Promise<string> {
    return this.apiClient.request<string>({
      method: RequestMethod.GET,
      path: WanAndroidApi.logout()
    })
  }

  fetchUserInfo(): Promise<UserInfoData> {
    return this.apiClient.request<UserInfoData>({
      method: RequestMethod.GET,
      path: WanAndroidApi.userInfo()
    })
  }
}
