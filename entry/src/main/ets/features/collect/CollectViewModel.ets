import { FavoriteService } from '../../common/favorite/FavoriteService'
import { UiState } from '../../common/ui/LoadState'
import { parseErrorMessage } from '../../common/network/ErrorMessage'
import { CollectItem, CollectRepository } from './CollectRepository'

export class CollectViewModel {
  private readonly repository: CollectRepository

  state: UiState<CollectItem[]> = UiState.empty<CollectItem[]>('请先登录')
  private page: number = 0
  private hasMore: boolean = false
  isLoadingMore: boolean = false

  constructor(repository: CollectRepository = new CollectRepository()) {
    this.repository = repository
  }

  async loadFirstPage(): Promise<void> {
    this.state = UiState.loading<CollectItem[]>()
    try {
      const pageData = await this.repository.loadCollectList(0)
      const items = pageData.datas || []
      this.page = 0
      this.hasMore = pageData.curPage < pageData.pageCount
      FavoriteService.shared().markBatch(
        items.map((item) => item.originId).filter((id) => id > 0),
        true
      )
      this.state = items.length > 0 ? UiState.success(items) : UiState.empty('暂无收藏内容')
    } catch (error) {
      this.state = UiState.error<CollectItem[]>(parseErrorMessage(error))
    }
  }

  async loadMore(): Promise<void> {
    if (this.isLoadingMore || !this.hasMore || !this.state.data) {
      return
    }
    this.isLoadingMore = true
    try {
      const nextPage = this.page + 1
      const pageData = await this.repository.loadCollectList(nextPage)
      FavoriteService.shared().markBatch(
        (pageData.datas || []).map((item) => item.originId).filter((id) => id > 0),
        true
      )
      this.state = UiState.success(this.state.data.concat(pageData.datas || []))
      this.page = nextPage
      this.hasMore = pageData.curPage < pageData.pageCount
    } catch (_) {
      // 保留当前数据
    } finally {
      this.isLoadingMore = false
    }
  }

  async uncollect(itemId: number): Promise<void> {
    try {
      if (this.state.data) {
        const target = this.state.data.find((item) => item.id === itemId)
        await this.repository.uncollectFromMine(itemId, target?.originId ?? -1)
        if (target && target.originId > 0) {
          FavoriteService.shared().mark(target.originId, false)
        }
        const next = this.state.data.filter((item) => item.id !== itemId)
        this.state = next.length > 0 ? UiState.success(next) : UiState.empty('暂无收藏内容')
      }
    } catch (_) {
      // 保持当前列表
    }
  }

  canLoadMore(): boolean {
    return this.hasMore
  }

}
