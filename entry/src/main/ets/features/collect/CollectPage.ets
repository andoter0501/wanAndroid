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
            ForEach(this.vm.state.data || [], (item: CollectItem, index: number) => {
              ListItem() {
                this.collectCard(item, index)
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
  private collectCard(item: CollectItem, index: number) {
    Column({ space: 10 }) {
      Text(this.labelText(index))
        .fontSize(11)
        .fontWeight(FontWeight.Bold)
        .fontColor('#FFFFFF')
        .padding({ left: 9, right: 9, top: 3, bottom: 3 })
        .backgroundColor(this.labelColor(index))
        .borderRadius(6)

      Text(item.title)
        .fontSize(15)
        .fontWeight(FontWeight.Medium)
        .fontColor(UiTheme.TEXT_PRIMARY)
        .lineHeight(20)
        .maxLines(2)
        .textOverflow({ overflow: TextOverflow.Ellipsis })
        .onClick(() => {
          if (this.onOpenLink) {
            this.onOpenLink(item.link)
          }
        })

      Row() {
        Text(`○ ${item.author || '作者'}`)
          .fontSize(11)
          .fontColor(UiTheme.TEXT_TERTIARY)
          .maxLines(1)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
          .layoutWeight(1)
        Text(item.niceDate || '')
          .fontSize(11)
          .fontColor(UiTheme.TEXT_TERTIARY)
        Text('取消')
          .fontSize(11)
          .fontColor(UiTheme.TEXT_DANGER)
          .padding({ left: 10 })
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
    }
    .width('100%')
    .padding({ left: 12, right: 12, top: 14, bottom: 14 })
    .backgroundColor(UiTheme.BG_CARD)
    .borderRadius(15)
  }

  private labelText(index: number): string {
    if (index % 3 === 1) {
      return '项目'
    }
    if (index % 3 === 2) {
      return '问答'
    }
    return '新'
  }

  private labelColor(index: number): string {
    if (index % 3 === 1) {
      return '#4CAF50'
    }
    if (index % 3 === 2) {
      return '#8E24AA'
    }
    return '#FF5B26'
  }

  private showActionToast(message: string): void {
    if (this.onToast) {
      this.onToast(message)
    }
  }
}
