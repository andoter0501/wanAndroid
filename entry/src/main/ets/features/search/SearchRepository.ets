import { ApiClient } from '../../common/network/ApiClient'
import { RequestMethod } from '../../common/network/ApiModels'
import { WanAndroidApi } from '../../common/network/WanAndroidApi'
import { HomeArticlePage } from '../home/HomeRepository'

export interface HotKeyItem {
  id: number
  name: string
}

export class SearchRepository {
  constructor(private readonly apiClient: ApiClient = new ApiClient()) {}

  loadHotKeys(): Promise<HotKeyItem[]> {
    return this.apiClient.request<HotKeyItem[]>({
      method: RequestMethod.GET,
      path: WanAndroidApi.hotKey()
    })
  }

  searchArticles(page: number, keyword: string): Promise<HomeArticlePage> {
    return this.apiClient.request<HomeArticlePage>({
      method: RequestMethod.POST,
      path: WanAndroidApi.search(page),
      body: {
        k: keyword
      }
    })
  }
}
