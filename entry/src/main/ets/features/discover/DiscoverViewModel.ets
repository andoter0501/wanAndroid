import { UiState } from '../../common/ui/LoadState'
import { parseErrorMessage } from '../../common/network/ErrorMessage'
import {
  DiscoverRepository,
  NaviGroup,
  ProjectCategory,
  ProjectItem,
  TreeNode
} from './DiscoverRepository'

export class DiscoverViewModel {
  private readonly repository: DiscoverRepository

  treeState: UiState<TreeNode[]> = UiState.loading<TreeNode[]>()
  naviState: UiState<NaviGroup[]> = UiState.loading<NaviGroup[]>()
  projectState: UiState<ProjectItem[]> = UiState.loading<ProjectItem[]>()

  projectCategories: ProjectCategory[] = []
  selectedProjectCid: number = 0

  private projectPage: number = 1
  private hasMoreProject: boolean = true
  isLoadingMoreProject: boolean = false

  constructor(repository: DiscoverRepository = new DiscoverRepository()) {
    this.repository = repository
  }

  async init(): Promise<void> {
    await Promise.all([
      this.loadTree(),
      this.loadNavi(),
      this.loadProjectInitial()
    ])
  }

  async loadTree(): Promise<void> {
    this.treeState = UiState.loading<TreeNode[]>()
    try {
      const data = await this.repository.loadTree()
      this.treeState = data.length > 0 ? UiState.success(data) : UiState.empty('暂无体系数据')
    } catch (error) {
      this.treeState = UiState.error<TreeNode[]>(parseErrorMessage(error))
    }
  }

  async loadNavi(): Promise<void> {
    this.naviState = UiState.loading<NaviGroup[]>()
    try {
      const data = await this.repository.loadNavi()
      this.naviState = data.length > 0 ? UiState.success(data) : UiState.empty('暂无导航数据')
    } catch (error) {
      this.naviState = UiState.error<NaviGroup[]>(parseErrorMessage(error))
    }
  }

  async loadProjectInitial(): Promise<void> {
    this.projectState = UiState.loading<ProjectItem[]>()
    try {
      const categories = await this.repository.loadProjectCategories()
      this.projectCategories = categories
      if (categories.length === 0) {
        this.projectState = UiState.empty<ProjectItem[]>('暂无项目分类')
        return
      }
      this.selectedProjectCid = categories[0].id
      this.projectPage = 1
      const pageData = await this.repository.loadProjects(this.projectPage, this.selectedProjectCid)
      const items = pageData.datas || []
      this.hasMoreProject = pageData.curPage < pageData.pageCount
      this.projectState = items.length > 0 ? UiState.success(items) : UiState.empty('暂无项目数据')
    } catch (error) {
      this.projectState = UiState.error<ProjectItem[]>(parseErrorMessage(error))
    }
  }

  async switchProjectCategory(cid: number): Promise<void> {
    if (cid === this.selectedProjectCid) {
      return
    }
    this.selectedProjectCid = cid
    this.projectPage = 1
    this.projectState = UiState.loading<ProjectItem[]>()
    try {
      const pageData = await this.repository.loadProjects(1, cid)
      const items = pageData.datas || []
      this.hasMoreProject = pageData.curPage < pageData.pageCount
      this.projectState = items.length > 0 ? UiState.success(items) : UiState.empty('该分类暂无项目')
    } catch (error) {
      this.projectState = UiState.error<ProjectItem[]>(parseErrorMessage(error))
    }
  }

  async loadMoreProjects(): Promise<void> {
    if (this.isLoadingMoreProject || !this.hasMoreProject || !this.projectState.data) {
      return
    }
    this.isLoadingMoreProject = true
    try {
      const nextPage = this.projectPage + 1
      const pageData = await this.repository.loadProjects(nextPage, this.selectedProjectCid)
      this.projectState = UiState.success(this.projectState.data.concat(pageData.datas || []))
      this.projectPage = nextPage
      this.hasMoreProject = pageData.curPage < pageData.pageCount
    } catch (_) {
      // 保持当前项目列表
    } finally {
      this.isLoadingMoreProject = false
    }
  }

}
