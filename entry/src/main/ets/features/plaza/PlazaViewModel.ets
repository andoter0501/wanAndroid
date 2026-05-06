import { UiState } from '../../common/ui/LoadState'
import { parseErrorMessage } from '../../common/network/ErrorMessage'
import { PlazaArticle, PlazaRepository } from './PlazaRepository'

export class PlazaViewModel {
  private readonly repository: PlazaRepository

  plazaState: UiState<PlazaArticle[]> = UiState.loading<PlazaArticle[]>()
  myShareState: UiState<PlazaArticle[]> = UiState.empty<PlazaArticle[]>('请先登录查看我的分享')

  shareTitleInput: string = ''
  shareLinkInput: string = ''
  shareMessage: string = ''

  private plazaPage: number = 0
  private plazaHasMore: boolean = false
  isLoadingMorePlaza: boolean = false

  private mySharePage: number = 1
  private myShareHasMore: boolean = false
  isLoadingMoreMyShare: boolean = false

  constructor(repository: PlazaRepository = new PlazaRepository()) {
    this.repository = repository
  }

  async init(): Promise<void> {
    await this.loadPlazaFirstPage()
  }

  async loadPlazaFirstPage(): Promise<void> {
    this.plazaState = UiState.loading<PlazaArticle[]>()
    try {
      const data = await this.repository.loadPlaza(0)
      const items = data.datas || []
      this.plazaPage = 0
      this.plazaHasMore = data.curPage < data.pageCount
      this.plazaState = items.length > 0 ? UiState.success(items) : UiState.empty('广场暂无内容')
    } catch (error) {
      this.plazaState = UiState.error<PlazaArticle[]>(parseErrorMessage(error))
    }
  }

  async loadMorePlaza(): Promise<void> {
    if (this.isLoadingMorePlaza || !this.plazaHasMore || !this.plazaState.data) {
      return
    }
    this.isLoadingMorePlaza = true
    try {
      const nextPage = this.plazaPage + 1
      const data = await this.repository.loadPlaza(nextPage)
      this.plazaState = UiState.success(this.plazaState.data.concat(data.datas || []))
      this.plazaPage = nextPage
      this.plazaHasMore = data.curPage < data.pageCount
    } catch (error) {
      parseErrorMessage(error)
      // 保留当前列表
    } finally {
      this.isLoadingMorePlaza = false
    }
  }

  async loadMyShareFirstPage(): Promise<void> {
    this.myShareState = UiState.loading<PlazaArticle[]>()
    try {
      const data = await this.repository.loadMyShare(1)
      const items = data.datas || []
      this.mySharePage = 1
      this.myShareHasMore = data.curPage < data.pageCount
      this.myShareState = items.length > 0 ? UiState.success(items) : UiState.empty('你还没有分享文章')
    } catch (error) {
      this.myShareState = UiState.error<PlazaArticle[]>(parseErrorMessage(error))
    }
  }

  async loadMoreMyShare(): Promise<void> {
    if (this.isLoadingMoreMyShare || !this.myShareHasMore || !this.myShareState.data) {
      return
    }
    this.isLoadingMoreMyShare = true
    try {
      const nextPage = this.mySharePage + 1
      const data = await this.repository.loadMyShare(nextPage)
      this.myShareState = UiState.success(this.myShareState.data.concat(data.datas || []))
      this.mySharePage = nextPage
      this.myShareHasMore = data.curPage < data.pageCount
    } catch (error) {
      parseErrorMessage(error)
      // 保留当前列表
    } finally {
      this.isLoadingMoreMyShare = false
    }
  }

  canLoadMorePlaza(): boolean {
    return this.plazaHasMore
  }

  canLoadMoreMyShare(): boolean {
    return this.myShareHasMore
  }

  async submitShare(): Promise<void> {
    const title = this.shareTitleInput.trim()
    const link = this.shareLinkInput.trim()
    if (!title || !link) {
      this.shareMessage = '请输入标题和链接'
      return
    }

    try {
      await this.repository.shareArticle(title, link)
      this.shareMessage = '分享成功'
      this.shareTitleInput = ''
      this.shareLinkInput = ''
      await this.loadMyShareFirstPage()
      await this.loadPlazaFirstPage()
    } catch (error) {
      this.shareMessage = parseErrorMessage(error)
    }
  }

  async deleteMyShare(id: number): Promise<void> {
    try {
      await this.repository.deleteSharedArticle(id)
      this.shareMessage = '删除成功'
      await this.loadMyShareFirstPage()
    } catch (error) {
      this.shareMessage = parseErrorMessage(error)
    }
  }
}
