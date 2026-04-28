import { ArticleCard } from '../../common/ui/components/ArticleCard'
import { FavoriteService } from '../../common/favorite/FavoriteService'
import { PagedListView } from '../../common/ui/components/PagedListView'
import { PageHeader } from '../../common/ui/components/PageHeader'
import { HomeViewModel } from './HomeViewModel'
import { HomeArticleItem } from './HomeRepository'

@Component
export struct HomePage {
  onOpenSearch?: () => void
  onOpenLink?: (url: string) => void
  @State vm: HomeViewModel = new HomeViewModel()
  @State favoriteVersion: number = 0
  private readonly favoriteListener = (): void => {
    this.favoriteVersion++
  }

  aboutToAppear(): void {
    FavoriteService.shared().subscribe(this.favoriteListener)
    this.initPage()
  }

  aboutToDisappear(): void {
    FavoriteService.shared().unsubscribe(this.favoriteListener)
  }

  private async initPage(): Promise<void> {
    await this.vm.init()
    this.vm = this.vm
  }

  private async onRetry(): Promise<void> {
    await this.vm.refresh()
    this.vm = this.vm
  }

  private async onLoadMore(): Promise<void> {
    await this.vm.loadMore()
    this.vm = this.vm
  }

  build() {
    Column() {
      PageHeader({
        title: '首页',
        rightText: '搜索',
        onRightClick: () => {
          if (this.onOpenSearch) {
            this.onOpenSearch()
          }
        }
      })

      PagedListView({
        status: this.vm.state.status,
        message: this.vm.state.message,
        retryAction: () => this.onRetry(),
        showLoadMore: this.vm.canLoadMore(),
        isLoadingMore: this.vm.isLoadingMore,
        loadMoreAction: () => this.onLoadMore()
      }) {
        if (this.vm.banners.length > 0) {
          ListItem() {
            Text(`Banner：${this.vm.banners.length} 条`)
              .fontSize(14)
              .padding(12)
              .backgroundColor('#EAF2FF')
              .borderRadius(8)
          }
        }

        if (this.vm.topArticles.length > 0) {
          ListItem() {
            Text(`置顶：${this.vm.topArticles.length} 条`)
              .fontSize(14)
              .padding(12)
              .backgroundColor('#F3F7E8')
              .borderRadius(8)
          }
        }

        if (this.vm.harmony !== null) {
          ListItem() {
            Text('鸿蒙专栏：links / open_sources / tools')
              .fontSize(14)
              .padding(12)
              .backgroundColor('#FFF6E5')
              .borderRadius(8)
          }
        }

        ForEach(this.vm.state.data || [], (item: HomeArticleItem) => {
          ListItem() {
            ArticleCard({
              article: {
                id: item.id,
                title: item.title,
                author: item.author,
                shareUser: item.shareUser,
                niceDate: item.niceDate
              },
              collected: FavoriteService.shared().isCollected(item.id),
              showCollectAction: true,
              clickAction: () => {
                if (this.onOpenLink) {
                  this.onOpenLink(item.link)
                }
              },
              toggleCollectAction: async () => {
                await FavoriteService.shared().toggle(item.id)
                this.favoriteVersion++
              }
            })
          }
        }, (item: HomeArticleItem) => item.id.toString())
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F6F8')
  }
}
