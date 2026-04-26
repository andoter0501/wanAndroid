import { ApiClient } from '../../common/network/ApiClient'
import { RequestMethod } from '../../common/network/ApiModels'
import { WanAndroidApi } from '../../common/network/WanAndroidApi'
import { HomeArticlePage } from '../home/HomeRepository'

export interface TreeNode {
  id: number
  name: string
  children?: TreeNode[]
}

export interface NaviGroup {
  cid: number
  name: string
  articles: {
    id: number
    title: string
    link: string
  }[]
}

export interface ProjectCategory {
  id: number
  name: string
}

export interface ProjectItem {
  id: number
  title: string
  desc?: string
  author?: string
  niceDate?: string
  link: string
}

export interface ProjectPage {
  datas: ProjectItem[]
  curPage: number
  pageCount: number
}

export class DiscoverRepository {
  constructor(private readonly apiClient: ApiClient = new ApiClient()) {}

  loadTree(): Promise<TreeNode[]> {
    return this.apiClient.request<TreeNode[]>({
      method: RequestMethod.GET,
      path: WanAndroidApi.tree()
    })
  }

  loadNavi(): Promise<NaviGroup[]> {
    return this.apiClient.request<NaviGroup[]>({
      method: RequestMethod.GET,
      path: WanAndroidApi.navi()
    })
  }

  loadProjectCategories(): Promise<ProjectCategory[]> {
    return this.apiClient.request<ProjectCategory[]>({
      method: RequestMethod.GET,
      path: WanAndroidApi.projectTree()
    })
  }

  loadProjects(page: number, cid: number): Promise<ProjectPage> {
    return this.apiClient.request<ProjectPage>({
      method: RequestMethod.GET,
      path: WanAndroidApi.projectList(page, cid)
    })
  }

  loadArticlesByCid(page: number, cid: number): Promise<HomeArticlePage> {
    return this.apiClient.request<HomeArticlePage>({
      method: RequestMethod.GET,
      path: WanAndroidApi.articlesByCid(page, cid)
    })
  }
}
