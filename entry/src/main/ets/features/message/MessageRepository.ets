import { ApiClient } from '../../common/network/ApiClient'
import { RequestMethod } from '../../common/network/ApiModels'
import { WanAndroidApi } from '../../common/network/WanAndroidApi'

export interface MessageItem {
  id: number
  title: string
  fullLink?: string
  message: string
  niceDate: string
}

export interface MessagePageData {
  datas: MessageItem[]
  curPage: number
  pageCount: number
}

export class MessageRepository {
  constructor(private readonly apiClient: ApiClient = new ApiClient()) {}

  loadUnreadCount(): Promise<number> {
    return this.apiClient.request<number>({
      method: RequestMethod.GET,
      path: WanAndroidApi.unreadMessageCount()
    })
  }

  loadUnreadList(page: number): Promise<MessagePageData> {
    return this.apiClient.request<MessagePageData>({
      method: RequestMethod.GET,
      path: WanAndroidApi.unreadMessageList(page)
    })
  }

  loadReadList(page: number): Promise<MessagePageData> {
    return this.apiClient.request<MessagePageData>({
      method: RequestMethod.GET,
      path: WanAndroidApi.readMessageList(page)
    })
  }
}
