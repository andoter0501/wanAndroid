import { ApiClient } from '../../common/network/ApiClient'
import { RequestMethod } from '../../common/network/ApiModels'
import { WanAndroidApi } from '../../common/network/WanAndroidApi'

export interface CollectItem {
  id: number
  originId: number
  title: string
  author?: string
  link: string
  niceDate?: string
  chapterName?: string
  superChapterName?: string
}

export interface CollectPage {
  datas: CollectItem[]
  curPage: number
  pageCount: number
}

export class CollectRepository {
  private readonly apiClient: ApiClient

  constructor(apiClient: ApiClient = new ApiClient()) {
    this.apiClient = apiClient
  }

  loadCollectList(page: number): Promise<CollectPage> {
    return this.apiClient.request<CollectPage>({
      method: RequestMethod.GET,
      path: WanAndroidApi.collectList(page)
    })
  }

  collectArticle(id: number): Promise<string> {
    return this.apiClient.request<string>({
      method: RequestMethod.POST,
      path: WanAndroidApi.collectArticle(id)
    })
  }

  uncollectArticle(id: number): Promise<string> {
    return this.apiClient.request<string>({
      method: RequestMethod.POST,
      path: WanAndroidApi.uncollectArticle(id)
    })
  }

  uncollectFromMine(id: number, originId: number): Promise<string> {
    const body = `originId=${encodeURIComponent(String(originId))}`
    return this.apiClient.request<string>({
      method: RequestMethod.POST,
      path: WanAndroidApi.uncollectInMine(id),
      body
    })
  }
}
