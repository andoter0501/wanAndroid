import { ArticleCard } from '../../common/ui/components/ArticleCard'
import { PagedListView } from '../../common/ui/components/PagedListView'
import { PageHeader } from '../../common/ui/components/PageHeader'
import { UiTheme } from '../../common/ui/UiTheme'
import { CollectItem } from './CollectRepository'
import { CollectViewModel } from './CollectViewModel'

@Component
export struct CollectPage {
  onBack?: () => void
  onOpenLink?: (url: string) => void

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

      PagedListView({
        status: this.vm.state.status,
        message: this.vm.state.message,
        retryAction: () => this.loadFirst(),
        showLoadMore: this.vm.canLoadMore(),
        isLoadingMore: this.vm.isLoadingMore,
        loadMoreAction: () => this.loadMore()
      }) {
        ForEach(this.vm.state.data || [], (item: CollectItem) => {
          ListItem() {
            Column({ space: 8 }) {
              ArticleCard({
                article: {
                  id: item.id,
                  title: item.title,
                  author: item.author,
                  niceDate: item.niceDate
                },
                clickAction: () => {
                  if (this.onOpenLink) {
                    this.onOpenLink(item.link)
                  }
                }
              })

              Button('取消收藏')
                .type(ButtonType.Capsule)
                .fontSize(12)
                .fontColor(UiTheme.TEXT_DANGER)
                .backgroundColor('#FFF1EF')
                .onClick(async () => {
                  await this.vm.uncollect(item.id)
                  this.vm = this.vm
                })
            }
          }
        }, (item: CollectItem) => item.id.toString())
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor(UiTheme.BG_PAGE)
  }
}
