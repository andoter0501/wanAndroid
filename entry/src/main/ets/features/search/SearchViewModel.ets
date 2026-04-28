import { UiState } from '../../common/ui/LoadState'
import { parseErrorMessage } from '../../common/network/ErrorMessage'
import { LocalCacheStore } from '../../common/storage/LocalCacheStore'
import { HomeArticleItem } from '../home/HomeRepository'
import { HotKeyItem, SearchRepository } from './SearchRepository'

export class SearchViewModel {
  private static readonly HISTORY_KEY = 'search_history'
  private readonly repository: SearchRepository

  hotKeysState: UiState<HotKeyItem[]> = UiState.loading<HotKeyItem[]>()
  resultState: UiState<HomeArticleItem[]> = UiState.empty<HomeArticleItem[]>('请输入关键词后搜索')

  keyword: string = ''
  history: string[] = []

  private page: number = 0
  private hasMore: boolean = false
  isLoadingMore: boolean = false

  constructor(repository: SearchRepository = new SearchRepository()) {
    this.repository = repository
  }

  async init(): Promise<void> {
    this.history = LocalCacheStore.shared().getStringList(SearchViewModel.HISTORY_KEY)
    this.hotKeysState = UiState.loading<HotKeyItem[]>()
    try {
      const data = await this.repository.loadHotKeys()
      this.hotKeysState = data.length > 0 ? UiState.success(data) : UiState.empty('暂无热词')
    } catch (error) {
      this.hotKeysState = UiState.error<HotKeyItem[]>(parseErrorMessage(error))
    }
  }

  async search(keyword: string): Promise<void> {
    const trimmed = keyword.trim()
    this.keyword = trimmed
    if (!trimmed) {
      this.resultState = UiState.empty<HomeArticleItem[]>('请输入关键词后搜索')
      return
    }

    this.resultState = UiState.loading<HomeArticleItem[]>()
    try {
      const pageData = await this.repository.searchArticles(0, trimmed)
      const items = pageData.datas || []
      this.page = 0
      this.hasMore = pageData.curPage < pageData.pageCount
      this.resultState = items.length > 0 ? UiState.success(items) : UiState.empty('没有搜索到结果')
      this.pushHistory(trimmed)
    } catch (error) {
      this.resultState = UiState.error<HomeArticleItem[]>(parseErrorMessage(error))
    }
  }

  async loadMore(): Promise<void> {
    if (!this.keyword || this.isLoadingMore || !this.hasMore || !this.resultState.data) {
      return
    }
    this.isLoadingMore = true
    try {
      const nextPage = this.page + 1
      const pageData = await this.repository.searchArticles(nextPage, this.keyword)
      this.resultState = UiState.success(this.resultState.data.concat(pageData.datas || []))
      this.page = nextPage
      this.hasMore = pageData.curPage < pageData.pageCount
    } catch (_) {
      // 保持当前结果列表
    } finally {
      this.isLoadingMore = false
    }
  }

  canLoadMore(): boolean {
    return this.hasMore
  }

  private pushHistory(keyword: string): void {
    const next = this.history.filter((item) => item !== keyword)
    next.unshift(keyword)
    this.history = next.slice(0, 10)
    LocalCacheStore.shared().setStringList(SearchViewModel.HISTORY_KEY, this.history)
  }

}
