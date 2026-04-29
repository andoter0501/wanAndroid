import { ArticleCard } from '../../common/ui/components/ArticleCard'
import { FavoriteService } from '../../common/favorite/FavoriteService'
import { PagedListView } from '../../common/ui/components/PagedListView'
import { PageHeader } from '../../common/ui/components/PageHeader'
import { UiTheme } from '../../common/ui/UiTheme'
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
        ListItem() {
          Column({ space: 10 }) {
            Column() {
              Text('Flutter')
                .fontSize(16)
                .fontColor('#FFFFFFCC')
              Text(this.vm.banners.length > 0 ? this.vm.banners[0].title : 'Flutter完整实例开源')
                .fontSize(26)
                .fontWeight(FontWeight.Bold)
                .fontColor('#FFFFFF')
                .maxLines(2)
                .textOverflow({ overflow: TextOverflow.Ellipsis })
            }
            .width('100%')
            .padding(16)
            .height(180)
            .justifyContent(FlexAlign.Center)
            .backgroundColor('#6E63D6')
            .borderRadius(UiTheme.RADIUS_MD)

            Row() {
              Text('  搜索关键字...')
                .fontColor(UiTheme.TEXT_TERTIARY)
                .fontSize(14)
            }
            .width('100%')
            .height(42)
            .backgroundColor(UiTheme.BG_CARD)
            .borderRadius(22)
            .onClick(() => {
              if (this.onOpenSearch) {
                this.onOpenSearch()
              }
            })

            Flex({ direction: FlexDirection.Row, wrap: FlexWrap.Wrap }) {
              this.quickTag('问答')
              this.quickTag('专栏')
              this.quickTag('路线')
              this.quickTag('鸿蒙')
            }
            .width('100%')
          }
        }

        if (this.vm.topArticles.length > 0) {
          ListItem() {
            Column({ space: 10 }) {
              Text('置顶文章')
                .fontSize(18)
                .fontWeight(FontWeight.Bold)
                .fontColor(UiTheme.TEXT_PRIMARY)
              ForEach(this.vm.topArticles.slice(0, 3), (top: HomeArticleItem) => {
                Text(top.title)
                  .fontSize(15)
                  .fontColor(UiTheme.TEXT_SECONDARY)
                  .maxLines(1)
                  .textOverflow({ overflow: TextOverflow.Ellipsis })
              }, (top: HomeArticleItem) => top.id.toString())
            }
            .padding(14)
            .backgroundColor(UiTheme.BG_CARD)
            .borderRadius(UiTheme.RADIUS_MD)
          }
        }

        if (this.vm.harmony !== null) {
          ListItem() {
            Text('鸿蒙专栏：links / open_sources / tools')
              .fontSize(14)
              .padding(12)
              .backgroundColor(UiTheme.BG_WARNING)
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
    .backgroundColor(UiTheme.BG_PAGE)
  }

  @Builder
  private quickTag(label: string) {
    Text(label)
      .fontSize(12)
      .fontColor(UiTheme.BRAND_PRIMARY)
      .padding({ left: 10, right: 10, top: 6, bottom: 6 })
      .borderRadius(999)
      .backgroundColor(UiTheme.BRAND_SOFT)
  }
}
