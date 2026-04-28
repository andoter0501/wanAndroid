import { ApiClient } from '../../common/network/ApiClient'
import { RequestMethod } from '../../common/network/ApiModels'
import { WanAndroidApi } from '../../common/network/WanAndroidApi'

export interface UserShareArticle {
  id: number
  title: string
  link: string
  author?: string
  shareUser?: string
  niceDate?: string
}

export interface UserCoinInfo {
  coinCount: number
  rank: number | string
  userId: number
  username: string
}

interface UserShareData {
  coinInfo: UserCoinInfo
  shareArticles: UserShareArticlePage
}

interface UserShareArticlePage {
  datas: UserShareArticle[]
  curPage: number
  pageCount: number
}

export interface UserSharePage {
  coinInfo: UserCoinInfo
  datas: UserShareArticle[]
  curPage: number
  pageCount: number
}

export class UserShareRepository {
  private readonly apiClient: ApiClient

  constructor(apiClient: ApiClient = new ApiClient()) {
    this.apiClient = apiClient
  }

  async loadUserShare(userId: number, page: number): Promise<UserSharePage> {
    const data = await this.apiClient.request<UserShareData>({
      method: RequestMethod.GET,
      path: WanAndroidApi.userShareArticles(userId, page)
    })
    return {
      coinInfo: data.coinInfo,
      datas: data.shareArticles.datas || [],
      curPage: data.shareArticles.curPage,
      pageCount: data.shareArticles.pageCount
    }
  }
}
