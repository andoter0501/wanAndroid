import { parseErrorMessage } from '../../common/network/ErrorMessage'
import { UiState } from '../../common/ui/LoadState'
import { UserCoinInfo, UserShareArticle, UserShareRepository } from './UserShareRepository'

export class UserShareViewModel {
  private readonly repository: UserShareRepository

  state: UiState<UserShareArticle[]> = UiState.loading<UserShareArticle[]>()
  coinInfo: UserCoinInfo | null = null
  private page: number = 1
  private hasMore: boolean = false
  isLoadingMore: boolean = false

  constructor(repository: UserShareRepository = new UserShareRepository()) {
    this.repository = repository
  }

  async loadFirstPage(userId: number): Promise<void> {
    this.state = UiState.loading<UserShareArticle[]>()
    try {
      const data = await this.repository.loadUserShare(userId, 1)
      this.coinInfo = data.coinInfo
      const items = data.datas || []
      this.page = 1
      this.hasMore = data.curPage < data.pageCount
      this.state = items.length > 0 ? UiState.success(items) : UiState.empty('该分享人暂无文章')
    } catch (error) {
      this.state = UiState.error<UserShareArticle[]>(parseErrorMessage(error))
    }
  }

  async loadMore(userId: number): Promise<void> {
    if (this.isLoadingMore || !this.hasMore || !this.state.data) {
      return
    }
    this.isLoadingMore = true
    try {
      const nextPage = this.page + 1
      const data = await this.repository.loadUserShare(userId, nextPage)
      this.coinInfo = data.coinInfo
      this.state = UiState.success(this.state.data.concat(data.datas || []))
      this.page = nextPage
      this.hasMore = data.curPage < data.pageCount
    } catch (_) {
      // 保持当前列表
    } finally {
      this.isLoadingMore = false
    }
  }

  canLoadMore(): boolean {
    return this.hasMore
  }
}
