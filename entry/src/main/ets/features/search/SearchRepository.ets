import { ApiClient } from '../../common/network/ApiClient'
import { RequestMethod } from '../../common/network/ApiModels'
import { WanAndroidApi } from '../../common/network/WanAndroidApi'
import { HomeArticlePage } from '../home/HomeRepository'

export interface HotKeyItem {
  id: number
  name: string
}

export class SearchRepository {
  private readonly apiClient: ApiClient

  constructor(apiClient: ApiClient = new ApiClient()) {
    this.apiClient = apiClient
  }

  loadHotKeys(): Promise<HotKeyItem[]> {
    return this.apiClient.request<HotKeyItem[]>({
      method: RequestMethod.GET,
      path: WanAndroidApi.hotKey()
    })
  }

  searchArticles(page: number, keyword: string): Promise<HomeArticlePage> {
    const body = `k=${encodeURIComponent(keyword)}`
    return this.apiClient.request<HomeArticlePage>({
      method: RequestMethod.POST,
      path: WanAndroidApi.search(page),
      body
    })
  }
}
