import { UiState } from '../../common/ui/LoadState'
import { parseErrorMessage } from '../../common/network/ErrorMessage'
import { MessageItem, MessageRepository } from './MessageRepository'

export class MessageViewModel {
  private readonly repository: MessageRepository

  unreadCount: number = 0
  unreadState: UiState<MessageItem[]> = UiState.empty<MessageItem[]>('暂无未读消息')
  readState: UiState<MessageItem[]> = UiState.empty<MessageItem[]>('暂无已读消息')
  isLoadingMoreUnread: boolean = false
  isLoadingMoreRead: boolean = false
  private unreadPage: number = 1
  private unreadHasMore: boolean = false
  private readPage: number = 1
  private readHasMore: boolean = false

  constructor(repository: MessageRepository = new MessageRepository()) {
    this.repository = repository
  }

  async init(): Promise<void> {
    await this.loadUnreadCount()
    await this.loadUnreadFirstPage()
    await this.loadReadFirstPage()
  }

  async loadUnreadCount(): Promise<void> {
    try {
      this.unreadCount = await this.repository.loadUnreadCount()
    } catch (_) {
      this.unreadCount = 0
    }
  }

  async loadUnreadFirstPage(): Promise<void> {
    this.unreadState = UiState.loading<MessageItem[]>()
    try {
      const data = await this.repository.loadUnreadList(1)
      const items = data.datas || []
      this.unreadPage = 1
      this.unreadHasMore = data.curPage < data.pageCount
      this.unreadState = items.length > 0 ? UiState.success(items) : UiState.empty('暂无未读消息')
    } catch (error) {
      this.unreadState = UiState.error<MessageItem[]>(parseErrorMessage(error))
    }
  }

  async loadReadFirstPage(): Promise<void> {
    this.readState = UiState.loading<MessageItem[]>()
    try {
      const data = await this.repository.loadReadList(1)
      const items = data.datas || []
      this.readPage = 1
      this.readHasMore = data.curPage < data.pageCount
      this.readState = items.length > 0 ? UiState.success(items) : UiState.empty('暂无已读消息')
    } catch (error) {
      this.readState = UiState.error<MessageItem[]>(parseErrorMessage(error))
    }
  }

  async loadMoreUnread(): Promise<void> {
    if (this.isLoadingMoreUnread || !this.unreadHasMore || !this.unreadState.data) {
      return
    }
    this.isLoadingMoreUnread = true
    try {
      const nextPage = this.unreadPage + 1
      const data = await this.repository.loadUnreadList(nextPage)
      this.unreadState = UiState.success(this.unreadState.data.concat(data.datas || []))
      this.unreadPage = nextPage
      this.unreadHasMore = data.curPage < data.pageCount
    } catch (_) {
      // 保持当前未读列表
    } finally {
      this.isLoadingMoreUnread = false
    }
  }

  async loadMoreRead(): Promise<void> {
    if (this.isLoadingMoreRead || !this.readHasMore || !this.readState.data) {
      return
    }
    this.isLoadingMoreRead = true
    try {
      const nextPage = this.readPage + 1
      const data = await this.repository.loadReadList(nextPage)
      this.readState = UiState.success(this.readState.data.concat(data.datas || []))
      this.readPage = nextPage
      this.readHasMore = data.curPage < data.pageCount
    } catch (_) {
      // 保持当前已读列表
    } finally {
      this.isLoadingMoreRead = false
    }
  }

}
