import { PageHeader } from '../../common/ui/components/PageHeader'
import { StateView } from '../../common/ui/components/StateView'
import { UiTheme } from '../../common/ui/UiTheme'
import { DiscoverViewModel } from '../discover/DiscoverViewModel'
import { ProjectCategory, ProjectItem } from '../discover/DiscoverRepository'

@Component
export struct ProjectPage {
  onOpenLink?: (url: string) => void
  @State vm: DiscoverViewModel = new DiscoverViewModel()

  aboutToAppear(): void {
    this.initPage()
  }

  private async initPage(): Promise<void> {
    await this.vm.loadProjectInitial()
    this.vm = this.vm
  }

  private async loadMoreProject(): Promise<void> {
    await this.vm.loadMoreProjects()
    this.vm = this.vm
  }

  build() {
    Column() {
      PageHeader({ title: '项目' })

      Column() {
        Scroll() {
          Row({ space: 8 }) {
            ForEach(this.vm.projectCategories, (item: ProjectCategory) => {
              this.categoryChip(item)
            }, (item: ProjectCategory) => item.id.toString())
          }
          .padding({ bottom: 10 })
        }
        .scrollable(ScrollDirection.Horizontal)
        .scrollBar(BarState.Off)
        .width('100%')

        StateView({
          status: this.vm.projectState.status,
          message: this.vm.projectState.message,
          retryAction: () => this.initPage()
        }) {
          List({ space: 10 }) {
            ForEach(this.vm.projectState.data || [], (item: ProjectItem) => {
              ListItem() {
                this.projectCard(item)
              }
            }, (item: ProjectItem) => item.id.toString())

            if (this.vm.canLoadMoreProject()) {
              ListItem() {
                Text(this.vm.isLoadingMoreProject ? '加载中...' : '加载更多')
                  .width('100%')
                  .textAlign(TextAlign.Center)
                  .fontSize(12)
                  .fontColor(UiTheme.TEXT_SECONDARY)
                  .padding({ top: 9, bottom: 9 })
                  .onClick(() => {
                    this.loadMoreProject()
                  })
              }
            }
          }
          .layoutWeight(1)
        }
      }
      .layoutWeight(1)
      .width('100%')
      .padding({ left: 12, right: 12, top: 12, bottom: 10 })
    }
    .width('100%')
    .height('100%')
    .backgroundColor(UiTheme.BG_PAGE)
  }

  @Builder
  private categoryChip(item: ProjectCategory) {
    Text(item.name)
      .fontSize(12)
      .fontColor(item.id === this.vm.selectedProjectCid ? '#FFFFFF' : UiTheme.BRAND_DEEP)
      .padding({ left: 12, right: 12, top: 6, bottom: 6 })
      .backgroundColor(item.id === this.vm.selectedProjectCid ? UiTheme.BRAND_PRIMARY : UiTheme.BRAND_SOFT)
      .borderRadius(999)
      .onClick(async () => {
        await this.vm.switchProjectCategory(item.id)
        this.vm = this.vm
      })
  }

  @Builder
  private projectCard(item: ProjectItem) {
    Column({ space: 7 }) {
      Text(item.title)
        .width('100%')
        .fontSize(15)
        .fontWeight(FontWeight.Medium)
        .fontColor(UiTheme.TEXT_PRIMARY)
        .lineHeight(20)
        .textAlign(TextAlign.Start)
        .maxLines(2)
        .textOverflow({ overflow: TextOverflow.Ellipsis })

      Text(item.desc || `${item.author || '项目作者'} · ${item.niceDate || ''}`)
        .width('100%')
        .fontSize(11)
        .fontColor(UiTheme.TEXT_SECONDARY)
        .lineHeight(16)
        .textAlign(TextAlign.Start)
        .maxLines(2)
        .textOverflow({ overflow: TextOverflow.Ellipsis })
    }
    .width('100%')
    .alignItems(HorizontalAlign.Start)
    .padding(11)
    .backgroundColor(UiTheme.BG_CARD)
    .borderRadius(UiTheme.RADIUS_MD)
    .onClick(() => {
      if (this.onOpenLink) {
        this.onOpenLink(item.link)
      }
    })
  }
}
