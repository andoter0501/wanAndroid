import { ArticleCard } from '../../common/ui/components/ArticleCard'
import { FavoriteService } from '../../common/favorite/FavoriteService'
import { PagedListView } from '../../common/ui/components/PagedListView'
import { PageHeader } from '../../common/ui/components/PageHeader'
import { UiTheme } from '../../common/ui/UiTheme'
import { StateView } from '../../common/ui/components/StateView'
import { SearchViewModel } from './SearchViewModel'
import { HomeArticleItem } from '../home/HomeRepository'
import { HotKeyItem } from './SearchRepository'

@Component
export struct SearchPage {
  onBack?: () => void
  onOpenLink?: (url: string) => void
  @State vm: SearchViewModel = new SearchViewModel()
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

  private async doSearch(): Promise<void> {
    await this.vm.search(this.vm.keyword)
    this.vm = this.vm
  }

  private async onLoadMore(): Promise<void> {
    await this.vm.loadMore()
    this.vm = this.vm
  }

  build() {
    Column() {
      PageHeader({
        title: '搜索',
        showBack: true,
        onBack: () => {
          if (this.onBack) {
            this.onBack()
          }
        }
      })

      Row({ space: 8 }) {
        TextInput({ placeholder: '输入关键词', text: this.vm.keyword })
          .layoutWeight(1)
          .height(40)
          .borderRadius(20)
          .backgroundColor(UiTheme.BG_CARD)
          .onChange((value: string) => {
            this.vm.keyword = value
            this.vm = this.vm
          })
        Button('取消')
          .type(ButtonType.Normal)
          .backgroundColor(UiTheme.BG_PAGE)
          .fontColor(UiTheme.BRAND_PRIMARY)
          .onClick(() => {
            if (this.onBack) {
              this.onBack()
            }
          })
        Button('搜索')
          .type(ButtonType.Capsule)
          .onClick(() => this.doSearch())
      }
      .padding(12)

      this.hotKeySection()
      this.historySection()
      this.commonSitesSection()

      PagedListView({
        status: this.vm.resultState.status,
        message: this.vm.resultState.message,
        retryAction: () => this.doSearch(),
        showLoadMore: this.vm.canLoadMore(),
        isLoadingMore: this.vm.isLoadingMore,
        loadMoreAction: () => this.onLoadMore()
      }) {
        ForEach(this.vm.resultState.data || [], (item: HomeArticleItem) => {
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
  private hotKeySection() {
    StateView({
      status: this.vm.hotKeysState.status,
      message: this.vm.hotKeysState.message,
      retryAction: () => this.initPage()
    }) {
      Column() {
        Text('热词')
          .fontSize(13)
          .fontWeight(FontWeight.Medium)
          .width('100%')
          .padding({ left: 12, right: 12, top: 4, bottom: 6 })
        Scroll() {
          Row({ space: 8 }) {
            ForEach(this.vm.hotKeysState.data || [], (item: HotKeyItem) => {
              Button(item.name)
                .type(ButtonType.Capsule)
                .onClick(async () => {
                  this.vm.keyword = item.name
                  await this.doSearch()
                })
            }, (item: HotKeyItem) => item.id.toString())
          }
          .padding({ left: 12, right: 12, bottom: 8 })
        }
        .scrollable(ScrollDirection.Horizontal)
      }
    }
  }

  @Builder
  private historySection() {
    if (this.vm.history.length > 0) {
      Column() {
        Text('历史搜索')
          .fontSize(13)
          .fontWeight(FontWeight.Medium)
          .width('100%')
          .padding({ left: 12, right: 12, top: 4, bottom: 6 })
        Scroll() {
          Row({ space: 8 }) {
            ForEach(this.vm.history, (item: string) => {
              Button(item)
                .type(ButtonType.Capsule)
                .onClick(async () => {
                  this.vm.keyword = item
                  await this.doSearch()
                })
            }, (item: string) => item)
          }
          .padding({ left: 12, right: 12, bottom: 8 })
        }
        .scrollable(ScrollDirection.Horizontal)
      }
    }
  }

  @Builder
  private commonSitesSection() {
    Column({ space: 8 }) {
      Text('常用网站')
        .fontSize(16)
        .fontWeight(FontWeight.Medium)
        .width('100%')
        .padding({ left: 12, right: 12, top: 6 })
      Row({ space: 10 }) {
        this.siteCard('官方文档', 'Android / Flutter')
        this.siteCard('社区', '掘金 / SegmentFault')
      }
      .width('100%')
      .padding({ left: 12, right: 12, bottom: 8 })
    }
  }

  @Builder
  private siteCard(title: string, subtitle: string) {
    Column({ space: 8 }) {
      Text(title)
        .fontSize(15)
        .fontWeight(FontWeight.Medium)
        .fontColor(UiTheme.TEXT_PRIMARY)
      Text(subtitle)
        .fontSize(12)
        .fontColor(UiTheme.TEXT_SECONDARY)
    }
    .layoutWeight(1)
    .alignItems(HorizontalAlign.Start)
    .padding(12)
    .backgroundColor(UiTheme.BG_CARD)
    .borderRadius(UiTheme.RADIUS_MD)
  }
}
