import { ApiClient } from '../../common/network/ApiClient'
import { RequestMethod } from '../../common/network/ApiModels'
import { WanAndroidApi } from '../../common/network/WanAndroidApi'

export interface UserInfoData {
  coinInfo: {
    coinCount: number
    level: number
    rank: string
    userId: number
    username: string
    nickname: string
  }
  userInfo: {
    id: number
    username: string
    nickname: string
    email?: string
  }
}

export interface LoginData {
  id: number
  username: string
  nickname: string
  coinCount?: number
}

export class AuthRepository {
  constructor(private readonly apiClient: ApiClient = new ApiClient()) {}

  login(username: string, password: string): Promise<LoginData> {
    return this.apiClient.request<LoginData>({
      method: RequestMethod.POST,
      path: WanAndroidApi.login(),
      body: {
        username,
        password
      }
    })
  }

  register(username: string, password: string, repassword: string): Promise<LoginData> {
    return this.apiClient.request<LoginData>({
      method: RequestMethod.POST,
      path: WanAndroidApi.register(),
      body: {
        username,
        password,
        repassword
      }
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
