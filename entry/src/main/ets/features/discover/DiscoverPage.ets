import { PagedListView } from '../../common/ui/components/PagedListView'
import { PageHeader } from '../../common/ui/components/PageHeader'
import { StateView } from '../../common/ui/components/StateView'
import { DiscoverViewModel } from './DiscoverViewModel'
import { NaviGroup, ProjectCategory, ProjectItem, TreeNode } from './DiscoverRepository'

enum DiscoverTab {
  TREE = 0,
  NAVI = 1,
  PROJECT = 2
}

@Component
export struct DiscoverPage {
  @State vm: DiscoverViewModel = new DiscoverViewModel()
  @State currentTab: DiscoverTab = DiscoverTab.TREE

  aboutToAppear(): void {
    this.initPage()
  }

  private async initPage(): Promise<void> {
    await this.vm.init()
    this.vm = this.vm
  }

  private async loadMoreProject(): Promise<void> {
    await this.vm.loadMoreProjects()
    this.vm = this.vm
  }

  build() {
    Column() {
      PageHeader({ title: '发现' })

      Row({ space: 8 }) {
        this.tabButton('体系', DiscoverTab.TREE)
        this.tabButton('导航', DiscoverTab.NAVI)
        this.tabButton('项目', DiscoverTab.PROJECT)
      }
      .width('100%')
      .padding({ left: 12, right: 12, bottom: 10 })

      if (this.currentTab === DiscoverTab.TREE) {
        StateView({
          status: this.vm.treeState.status,
          message: this.vm.treeState.message,
          retryAction: () => this.vm.loadTree()
        }) {
          List({ space: 8 }) {
            ForEach(this.vm.treeState.data || [], (item: TreeNode) => {
              ListItem() {
                Column() {
                  Text(item.name)
                    .fontSize(15)
                    .fontWeight(FontWeight.Medium)
                  Text(`子分类: ${(item.children || []).length}`)
                    .fontSize(12)
                    .margin({ top: 4 })
                    .fontColor('#666666')
                }
                .width('100%')
                .padding(12)
                .backgroundColor(Color.White)
                .borderRadius(8)
              }
            }, (item: TreeNode) => item.id.toString())
          }
          .padding({ left: 12, right: 12, bottom: 12 })
        }
      } else if (this.currentTab === DiscoverTab.NAVI) {
        StateView({
          status: this.vm.naviState.status,
          message: this.vm.naviState.message,
          retryAction: () => this.vm.loadNavi()
        }) {
          List({ space: 8 }) {
            ForEach(this.vm.naviState.data || [], (item: NaviGroup) => {
              ListItem() {
                Column() {
                  Text(item.name)
                    .fontSize(15)
                    .fontWeight(FontWeight.Medium)
                  Text(`链接: ${item.articles.length}`)
                    .fontSize(12)
                    .margin({ top: 4 })
                    .fontColor('#666666')
                }
                .width('100%')
                .padding(12)
                .backgroundColor(Color.White)
                .borderRadius(8)
              }
            }, (item: NaviGroup) => item.cid.toString())
          }
          .padding({ left: 12, right: 12, bottom: 12 })
        }
      } else {
        Column() {
          Scroll() {
            Row({ space: 8 }) {
              ForEach(this.vm.projectCategories, (item: ProjectCategory) => {
                Button(item.name)
                  .type(item.id === this.vm.selectedProjectCid ? ButtonType.Capsule : ButtonType.Normal)
                  .onClick(async () => {
                    await this.vm.switchProjectCategory(item.id)
                    this.vm = this.vm
                  })
              }, (item: ProjectCategory) => item.id.toString())
            }
          }
          .scrollable(ScrollDirection.Horizontal)
          .width('100%')
          .padding({ left: 12, right: 12, bottom: 10 })

          PagedListView({
            status: this.vm.projectState.status,
            message: this.vm.projectState.message,
            retryAction: () => this.vm.switchProjectCategory(this.vm.selectedProjectCid),
            showLoadMore: this.vm.canLoadMoreProject(),
            isLoadingMore: this.vm.isLoadingMoreProject,
            loadMoreText: '加载更多项目',
            loadMoreAction: () => this.loadMoreProject()
          }) {
            ForEach(this.vm.projectState.data || [], (item: ProjectItem) => {
              ListItem() {
                Column() {
                  Text(item.title)
                    .fontSize(15)
                    .fontWeight(FontWeight.Medium)
                    .maxLines(2)
                    .textOverflow({ overflow: TextOverflow.Ellipsis })
                  Text(item.desc || '')
                    .fontSize(12)
                    .margin({ top: 5 })
                    .fontColor('#666666')
                    .maxLines(2)
                    .textOverflow({ overflow: TextOverflow.Ellipsis })
                }
                .width('100%')
                .padding(12)
                .backgroundColor(Color.White)
                .borderRadius(8)
              }
            }, (item: ProjectItem) => item.id.toString())
          }
        }
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F6F8')
  }

  @Builder
  private tabButton(label: string, tab: DiscoverTab) {
    Button(label)
      .type(this.currentTab === tab ? ButtonType.Capsule : ButtonType.Normal)
      .onClick(() => {
        this.currentTab = tab
      })
  }
}
