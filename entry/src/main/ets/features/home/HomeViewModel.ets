import { UiState } from '../../common/ui/LoadState'
import { parseErrorMessage } from '../../common/network/ErrorMessage'
import {
  BannerItem,
  ChapterItem,
  HarmonyIndexData,
  HomeArticleItem,
  HomeRepository
} from './HomeRepository'

export class HomeViewModel {
  private readonly repository: HomeRepository

  state: UiState<HomeArticleItem[]> = UiState.loading<HomeArticleItem[]>()
  banners: BannerItem[] = []
  topArticles: HomeArticleItem[] = []
  popularWenda: ChapterItem[] = []
  popularColumn: ChapterItem[] = []
  popularRoute: ChapterItem[] = []
  harmony: HarmonyIndexData | null = null

  private page: number = 0
  private hasMore: boolean = true
  isLoadingMore: boolean = false

  constructor(repository: HomeRepository = new HomeRepository()) {
    this.repository = repository
  }

  async init(): Promise<void> {
    this.state = UiState.loading<HomeArticleItem[]>()
    try {
      const pageData = await this.repository.loadArticlePage(0)

      // 辅助数据失败不阻塞首页主列表渲染
      const sideResults = await Promise.allSettled([
        this.repository.loadBanners(),
        this.repository.loadTopArticles(),
        this.repository.loadPopularWenda(),
        this.repository.loadPopularColumn(),
        this.repository.loadPopularRoute(),
        this.repository.loadHarmonyIndex()
      ])

      this.banners = sideResults[0].status === 'fulfilled' ? sideResults[0].value : []
      this.topArticles = sideResults[1].status === 'fulfilled' ? sideResults[1].value : []
      this.popularWenda = sideResults[2].status === 'fulfilled' ? sideResults[2].value : []
      this.popularColumn = sideResults[3].status === 'fulfilled' ? sideResults[3].value : []
      this.popularRoute = sideResults[4].status === 'fulfilled' ? sideResults[4].value : []
      this.harmony = sideResults[5].status === 'fulfilled' ? sideResults[5].value : null

      const articles = pageData.datas || []
      this.page = 0
      this.hasMore = pageData.curPage < pageData.pageCount
      this.state = articles.length > 0 ? UiState.success(articles) : UiState.empty('首页暂无文章')
    } catch (error) {
      this.state = UiState.error<HomeArticleItem[]>(parseErrorMessage(error))
    }
  }

  async refresh(): Promise<void> {
    await this.init()
  }

  async loadMore(): Promise<void> {
    if (this.isLoadingMore || !this.hasMore || !this.state.data) {
      return
    }
    this.isLoadingMore = true
    try {
      const nextPage = this.page + 1
      const pageData = await this.repository.loadArticlePage(nextPage)
      const merged = this.state.data.concat(pageData.datas || [])
      this.state = UiState.success(merged)
      this.page = nextPage
      this.hasMore = pageData.curPage < pageData.pageCount
    } catch (_) {
      // 分页失败不覆盖主状态，只终止本次加载
    } finally {
      this.isLoadingMore = false
    }
  }

  canLoadMore(): boolean {
    return this.hasMore
  }

}
