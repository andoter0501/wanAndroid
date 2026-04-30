import { ArticleCard } from '../../common/ui/components/ArticleCard'
import { FavoriteService } from '../../common/favorite/FavoriteService'
import { parseErrorMessage } from '../../common/network/ErrorMessage'
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
  onToast?: (message: string) => void
  @State vm: SearchViewModel = new SearchViewModel()
  @State favoriteVersion: number = 0
  @State hasSubmittedSearch: boolean = false
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
    this.hasSubmittedSearch = this.vm.keyword.trim().length > 0
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

      Row({ space: 6 }) {
        Row({ space: 6 }) {
          Text('⌕')
            .fontSize(15)
            .fontColor(UiTheme.TEXT_TERTIARY)
          TextInput({ placeholder: '搜索文章/项目...', text: this.vm.keyword })
            .layoutWeight(1)
            .height(38)
            .fontSize(14)
            .fontColor(UiTheme.TEXT_PRIMARY)
            .placeholderColor(UiTheme.TEXT_TERTIARY)
            .backgroundColor('#00000000')
            .padding({ left: 0, right: 0 })
            .onSubmit(() => {
              this.doSearch()
            })
            .onChange((value: string) => {
              this.vm.keyword = value
              if (value.length === 0) {
                this.hasSubmittedSearch = false
              }
              this.vm = this.vm
            })
        }
        .layoutWeight(1)

        Text('取消')
          .fontSize(14)
          .fontColor(UiTheme.BRAND_PRIMARY)
          .padding({ left: 8, right: 0, top: 8, bottom: 8 })
          .onClick(() => {
            if (this.onBack) {
              this.onBack()
            }
          })
      }
      .height(42)
      .padding({ left: 14, right: 14 })
      .margin({ left: 12, right: 12, top: 10, bottom: 10 })
      .borderRadius(999)
      .backgroundColor(UiTheme.BG_CARD)
      .border({ width: 1, color: '#E5E6EB' })

      if (this.hasSubmittedSearch) {
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
                collected: this.isArticleCollected(item.id),
                showCollectAction: true,
                clickAction: () => {
                  if (this.onOpenLink) {
                    this.onOpenLink(item.link)
                  }
                },
                toggleCollectAction: async () => {
                  try {
                    const nextCollected = await FavoriteService.shared().toggle(item.id)
                    this.favoriteVersion++
                    this.showActionToast(nextCollected ? '收藏成功' : '已取消收藏')
                  } catch (error) {
                    this.showActionToast(parseErrorMessage(error))
                  }
                }
              })
            }
          }, (item: HomeArticleItem) => item.id.toString())
        }
      } else {
        Scroll() {
          Column({ space: 10 }) {
            this.historyCard()
            this.hotKeyCard()
            this.commonSitesSection()
          }
          .width('100%')
          .padding({ left: 12, right: 12, bottom: 18 })
        }
        .layoutWeight(1)
        .scrollBar(BarState.Off)
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor(UiTheme.BG_PAGE)
  }

  @Builder
  private hotKeyCard() {
    StateView({
      status: this.vm.hotKeysState.status,
      message: this.vm.hotKeysState.message,
      retryAction: () => this.initPage()
    }) {
      Column({ space: 8 }) {
        Text('热门搜索')
          .fontSize(15)
          .fontWeight(FontWeight.Medium)
          .fontColor(UiTheme.TEXT_PRIMARY)
          .width('100%')
          .padding({ left: 0, right: 0 })
        Scroll() {
          Row({ space: 8 }) {
            ForEach(this.vm.hotKeysState.data || [], (item: HotKeyItem) => {
              Text(item.name)
                .fontSize(13)
                .fontColor(UiTheme.BRAND_DEEP)
                .padding({ left: 12, right: 12, top: 6, bottom: 6 })
                .backgroundColor(UiTheme.BRAND_SOFT)
                .borderRadius(999)
                .onClick(async () => {
                  this.vm.keyword = item.name
                  await this.doSearch()
                })
            }, (item: HotKeyItem) => item.id.toString())
          }
        }
        .scrollable(ScrollDirection.Horizontal)
      }
      .width('100%')
      .padding(11)
      .backgroundColor(UiTheme.BG_CARD)
      .borderRadius(UiTheme.RADIUS_MD)
    }
  }

  @Builder
  private historyCard() {
    Column({ space: 8 }) {
      Row() {
        Text('搜索历史')
          .fontSize(15)
          .fontWeight(FontWeight.Medium)
          .fontColor(UiTheme.TEXT_PRIMARY)
        Blank()
        if (this.vm.history.length > 0) {
          Text('清空')
            .fontSize(13)
            .fontColor(UiTheme.BRAND_PRIMARY)
            .onClick(() => {
              this.vm.clearHistory()
              this.vm = this.vm
            })
        }
      }
      .width('100%')
      .padding({ left: 0, right: 0 })

      if (this.vm.history.length > 0) {
        Scroll() {
          Row({ space: 8 }) {
            ForEach(this.vm.history, (item: string) => {
              Text(item)
                .fontSize(13)
                .fontColor(UiTheme.BRAND_DEEP)
                .padding({ left: 12, right: 12, top: 6, bottom: 6 })
                .backgroundColor(UiTheme.BRAND_SOFT)
                .borderRadius(999)
                .onClick(async () => {
                  this.vm.keyword = item
                  await this.doSearch()
                })
            }, (item: string) => item)
          }
        }
        .scrollable(ScrollDirection.Horizontal)
      } else {
        Row({ space: 8 }) {
          this.suggestChip('Flutter')
          this.suggestChip('Kotlin')
          this.suggestChip('Jetpack')
          this.suggestChip('Compose')
        }
      }
    }
    .width('100%')
    .padding(11)
    .backgroundColor(UiTheme.BG_CARD)
    .borderRadius(UiTheme.RADIUS_MD)
  }

  @Builder
  private commonSitesSection() {
    Column({ space: 10 }) {
      Row({ space: 10 }) {
        this.siteCard('官方文档', 'Android / Flutter')
        this.siteCard('社区', '掘金 / SegmentFault')
      }
      .width('100%')
    }
  }

  @Builder
  private suggestChip(label: string) {
    Text(label)
      .fontSize(13)
      .fontColor(UiTheme.BRAND_DEEP)
      .padding({ left: 12, right: 12, top: 6, bottom: 6 })
      .backgroundColor(UiTheme.BRAND_SOFT)
      .borderRadius(999)
      .onClick(async () => {
        this.vm.keyword = label
        await this.doSearch()
      })
  }

  @Builder
  private siteCard(title: string, subtitle: string) {
    Column({ space: 7 }) {
      Text(title)
        .fontSize(15)
        .fontWeight(FontWeight.Medium)
        .fontColor(UiTheme.TEXT_PRIMARY)
      Text(subtitle)
        .fontSize(11)
        .fontColor(UiTheme.TEXT_SECONDARY)
    }
    .layoutWeight(1)
    .alignItems(HorizontalAlign.Start)
    .padding(11)
    .backgroundColor(UiTheme.BG_CARD)
    .borderRadius(UiTheme.RADIUS_MD)
  }

  private showActionToast(message: string): void {
    if (this.onToast) {
      this.onToast(message)
    }
  }

  private isArticleCollected(articleId: number): boolean {
    this.favoriteVersion.toString()
    return FavoriteService.shared().isCollected(articleId)
  }
}
