import { parseErrorMessage } from '../../common/network/ErrorMessage'
import { PageHeader } from '../../common/ui/components/PageHeader'
import { StateView } from '../../common/ui/components/StateView'
import { UiTheme } from '../../common/ui/UiTheme'
import { CollectItem } from './CollectRepository'
import { CollectViewModel } from './CollectViewModel'

@Component
export struct CollectPage {
  onBack?: () => void
  onOpenLink?: (url: string) => void
  onToast?: (message: string) => void

  @State vm: CollectViewModel = new CollectViewModel()

  aboutToAppear(): void {
    this.loadFirst()
  }

  private async loadFirst(): Promise<void> {
    await this.vm.loadFirstPage()
    this.vm = this.vm
  }

  private async loadMore(): Promise<void> {
    await this.vm.loadMore()
    this.vm = this.vm
  }

  build() {
    Column() {
      PageHeader({
        title: '我的收藏',
        showBack: true,
        onBack: () => {
          if (this.onBack) {
            this.onBack()
          }
        }
      })

      Column() {
        StateView({
          status: this.vm.state.status,
          message: this.vm.state.message,
          retryAction: () => this.loadFirst()
        }) {
          List({ space: 10 }) {
            ForEach(this.vm.state.data || [], (item: CollectItem) => {
              ListItem() {
                this.collectCard(item)
              }
            }, (item: CollectItem) => item.id.toString())

            if (this.vm.canLoadMore()) {
              ListItem() {
                Text(this.vm.isLoadingMore ? '加载中...' : '加载更多')
                  .width('100%')
                  .textAlign(TextAlign.Center)
                  .fontSize(12)
                  .fontColor(UiTheme.TEXT_SECONDARY)
                  .padding({ top: 9, bottom: 9 })
                  .onClick(() => {
                    this.loadMore()
                  })
              }
            }
          }
          .layoutWeight(1)
        }
      }
      .layoutWeight(1)
      .width('100%')
      .padding({ left: 12, right: 12, top: 8, bottom: 10 })
    }
    .width('100%')
    .height('100%')
    .backgroundColor(UiTheme.BG_PAGE)
  }

  @Builder
  private collectCard(item: CollectItem) {
    Column({ space: 9 }) {
      Row() {
        Text(this.collectTypeText(item))
          .fontSize(11)
          .fontWeight(FontWeight.Medium)
          .fontColor(UiTheme.BRAND_DEEP)
          .padding({ left: 8, right: 8, top: 3, bottom: 3 })
          .backgroundColor(UiTheme.BRAND_SOFT)
          .borderRadius(6)
        Blank()
        Text('取消收藏')
          .fontSize(12)
          .fontColor(UiTheme.TEXT_DANGER)
          .padding({ left: 8, right: 0, top: 4, bottom: 4 })
          .onClick(async () => {
            try {
              await this.vm.uncollect(item.id)
              this.vm = this.vm
              this.showActionToast('已取消收藏')
            } catch (error) {
              this.showActionToast(parseErrorMessage(error))
            }
          })
      }
      .width('100%')

      Text(item.title)
        .width('100%')
        .fontSize(15)
        .fontWeight(FontWeight.Medium)
        .fontColor(UiTheme.TEXT_PRIMARY)
        .lineHeight(20)
        .textAlign(TextAlign.Start)
        .maxLines(2)
        .textOverflow({ overflow: TextOverflow.Ellipsis })
        .onClick(() => {
          if (this.onOpenLink) {
            this.onOpenLink(item.link)
          }
        })

      Row({ space: 8 }) {
        Text(this.collectMetaText(item))
          .layoutWeight(1)
          .fontSize(11)
          .fontColor(UiTheme.TEXT_TERTIARY)
          .textAlign(TextAlign.Start)
          .maxLines(1)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
        Text(item.niceDate || '')
          .fontSize(11)
          .fontColor(UiTheme.TEXT_TERTIARY)
      }
      .width('100%')
    }
    .width('100%')
    .alignItems(HorizontalAlign.Start)
    .padding({ left: 12, right: 12, top: 14, bottom: 14 })
    .backgroundColor(UiTheme.BG_CARD)
    .borderRadius(UiTheme.RADIUS_MD)
  }

  private collectTypeText(item: CollectItem): string {
    const chapter = item.chapterName || ''
    const superChapter = item.superChapterName || ''
    if (chapter.length > 0 && superChapter.length > 0) {
      return `${superChapter} / ${chapter}`
    }
    if (chapter.length > 0) {
      return chapter
    }
    if (item.originId <= 0) {
      return '站外'
    }
    return '文章'
  }

  private collectMetaText(item: CollectItem): string {
    return item.author || '作者'
  }

  private showActionToast(message: string): void {
    if (this.onToast) {
      this.onToast(message)
    }
  }
}
