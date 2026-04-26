import { ApiClient } from '../../common/network/ApiClient'
import { RequestMethod } from '../../common/network/ApiModels'
import { WanAndroidApi } from '../../common/network/WanAndroidApi'

export interface PlazaArticle {
  id: number
  userId?: number
  title: string
  author?: string
  shareUser?: string
  link: string
  niceDate?: string
}

export interface PlazaPageData {
  datas: PlazaArticle[]
  curPage: number
  pageCount: number
}

export class PlazaRepository {
  constructor(private readonly apiClient: ApiClient = new ApiClient()) {}

  loadPlaza(page: number): Promise<PlazaPageData> {
    return this.apiClient.request<PlazaPageData>({
      method: RequestMethod.GET,
      path: WanAndroidApi.plazaList(page)
    })
  }

  loadMyShare(page: number): Promise<PlazaPageData> {
    return this.apiClient.request<PlazaPageData>({
      method: RequestMethod.GET,
      path: WanAndroidApi.myShareList(page)
    })
  }

  shareArticle(title: string, link: string): Promise<string> {
    return this.apiClient.request<string>({
      method: RequestMethod.POST,
      path: WanAndroidApi.shareArticle(),
      body: { title, link }
    })
  }

  deleteSharedArticle(id: number): Promise<string> {
    return this.apiClient.request<string>({
      method: RequestMethod.POST,
      path: WanAndroidApi.deleteSharedArticle(id)
    })
  }
}
