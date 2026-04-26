import { ApiClient } from '../../common/network/ApiClient'
import { RequestMethod } from '../../common/network/ApiModels'
import { WanAndroidApi } from '../../common/network/WanAndroidApi'

export interface WendaItem {
  id: number
  userId?: number
  title: string
  author?: string
  shareUser?: string
  link: string
  niceDate?: string
}

export interface WendaPageData {
  datas: WendaItem[]
  curPage: number
  pageCount: number
}

export interface WendaComment {
  id: number
  userName: string
  content: string
  niceDate: string
  zan: number
}

export class WendaRepository {
  constructor(private readonly apiClient: ApiClient = new ApiClient()) {}

  loadWenda(page: number): Promise<WendaPageData> {
    return this.apiClient.request<WendaPageData>({
      method: RequestMethod.GET,
      path: WanAndroidApi.wendaList(page)
    })
  }

  loadComments(id: number): Promise<WendaComment[]> {
    return this.apiClient.request<WendaComment[]>({
      method: RequestMethod.GET,
      path: WanAndroidApi.wendaComments(id)
    })
  }
}
