import { ArticleCard } from '../../common/ui/components/ArticleCard'
import { FavoriteService } from '../../common/favorite/FavoriteService'
import { parseErrorMessage } from '../../common/network/ErrorMessage'
import { PagedListView } from '../../common/ui/components/PagedListView'
import { PageHeader } from '../../common/ui/components/PageHeader'
import { UiTheme } from '../../common/ui/UiTheme'
import { HomeViewModel } from './HomeViewModel'
import { HomeArticleItem } from './HomeRepository'

@Component
export struct HomePage {
  onOpenSearch?: () => void
  onOpenLink?: (url: string) => void
  onQuickNavigate?: (target: string) => void
  onRequireLogin?: () => void
  @State vm: HomeViewModel = new HomeViewModel()
  @State favoriteVersion: number = 0
  @State bannerIndex: number = 0
  @State actionMessage: string = ''
  private actionTimerId: number = -1
  private bannerTimerId: number = -1
  private readonly favoriteListener = (): void => {
    this.favoriteVersion++
  }

  aboutToAppear(): void {
    FavoriteService.shared().subscribe(this.favoriteListener)
    this.initPage()
    this.startBannerAutoPlay()
  }

  aboutToDisappear(): void {
    FavoriteService.shared().unsubscribe(this.favoriteListener)
    this.stopBannerAutoPlay()
    this.clearActionTimer()
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

  private startBannerAutoPlay(): void {
    this.stopBannerAutoPlay()
    this.bannerTimerId = setInterval(() => {
      const size = this.vm.banners.length
      if (size > 0) {
        this.bannerIndex = (this.bannerIndex + 1) % size
      }
    }, 3200)
  }

  private stopBannerAutoPlay(): void {
    if (this.bannerTimerId >= 0) {
      clearInterval(this.bannerTimerId)
      this.bannerTimerId = -1
    }
  }

  build() {
    Stack({ alignContent: Alignment.Center }) {
      Column() {
        PageHeader({
          title: '玩安卓',
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
              this.heroBanner()

              Row() {
                Text('搜索关键字...')
                  .fontColor(UiTheme.TEXT_TERTIARY)
                  .fontSize(14)
              }
              .width('100%')
              .height(42)
              .backgroundColor(UiTheme.BG_CARD)
              .padding({ left: 16, right: 12 })
              .borderRadius(22)
              .onClick(() => {
                if (this.onOpenSearch) {
                  this.onOpenSearch()
                }
              })

              Flex({ direction: FlexDirection.Row, wrap: FlexWrap.Wrap }) {
                this.quickTag('问答', () => this.handleQuickNavigate('plaza'))
                this.quickTag('专栏', () => this.handleQuickNavigate('know'))
                this.quickTag('路线', () => this.handleQuickNavigate('project'))
                this.quickTag('鸿蒙', () => {
                  if (this.onOpenLink) {
                    this.onOpenLink('https://wanandroid.com/harmony/index')
                  }
                })
              }
              .width('100%')
            }
          }

          if (this.vm.topArticles.length > 0) {
            ListItem() {
              this.topArticlesCard()
            }
          }

          if (this.vm.harmony !== null) {
            ListItem() {
              Text('鸿蒙专栏：links / open_sources / tools')
                .fontSize(14)
                .fontColor(UiTheme.TEXT_WARNING)
                .padding(12)
                .backgroundColor(UiTheme.BG_WARNING)
                .borderRadius(12)
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
                    const message = parseErrorMessage(error)
                    this.showActionToast(message)
                    if (message.includes('登录') && this.onRequireLogin) {
                      this.onRequireLogin()
                    }
                  }
                }
              })
            }
          }, (item: HomeArticleItem) => item.id.toString())
        }
      }
      .width('100%')
      .height('100%')

      if (this.actionMessage.length > 0) {
        Text(this.actionMessage)
          .fontSize(14)
          .fontColor('#FFFFFF')
          .padding({ left: 18, right: 18, top: 10, bottom: 10 })
          .backgroundColor('#000000CC')
          .borderRadius(22)
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor(UiTheme.BG_PAGE)
  }

  @Builder
  private heroBanner() {
    Stack({ alignContent: Alignment.Bottom }) {
      Column({ space: 8 }) {
        Text('Flutter')
          .fontSize(16)
          .fontColor('#FFFFFFCC')
        Text(this.vm.banners.length > 0 ? this.vm.banners[this.bannerIndex % this.vm.banners.length].title : 'Flutter完整实例开源')
          .fontSize(32)
          .fontWeight(FontWeight.Bold)
          .fontColor('#FFFFFF')
          .maxLines(2)
          .textAlign(TextAlign.Center)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
      }
      .width('100%')
      .alignItems(HorizontalAlign.Center)
      .margin({ top: 20 })

      Row({ space: 6 }) {
        ForEach(this.dotIndexes(), (dot: number) => {
          Row() {}
            .width(dot === (this.bannerIndex % this.dotIndexes().length) ? 16 : 8)
            .height(8)
            .borderRadius(99)
            .backgroundColor(dot === (this.bannerIndex % this.dotIndexes().length) ? '#FFFFFF' : '#FFFFFF77')
            .onClick(() => {
              this.bannerIndex = dot
            })
        }, (dot: number) => dot.toString())
      }
      .margin({ bottom: 10 })
    }
    .width('100%')
    .padding(16)
    .height(200)
    .backgroundColor('#6E63D6')
    .borderRadius(UiTheme.RADIUS_MD)
    .onClick(() => {
      const size = this.vm.banners.length
      if (size > 0 && this.onOpenLink) {
        const banner = this.vm.banners[this.bannerIndex % size]
        this.onOpenLink(banner.url)
      }
    })
  }

  @Builder
  private topArticlesCard() {
    Column({ space: 10 }) {
      Row({ space: 8 }) {
        Column() {}
          .width(4)
          .height(18)
          .borderRadius(2)
          .backgroundColor(UiTheme.BRAND_PRIMARY)
        Text('置顶文章')
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
          .fontColor(UiTheme.TEXT_PRIMARY)
      }

      ForEach(this.vm.topArticles.slice(0, 3), (top: HomeArticleItem, index: number) => {
        Column({ space: 10 }) {
          Row({ space: 10 }) {
            Text((index + 1).toString())
              .width(28)
              .height(28)
              .textAlign(TextAlign.Center)
              .fontSize(13)
              .fontWeight(FontWeight.Bold)
              .fontColor('#FFFFFF')
              .backgroundColor(index === 0 ? '#FF5B26' : '#2F98E8')
              .borderRadius(6)
            Text(top.title)
              .layoutWeight(1)
              .fontSize(15)
              .fontColor(UiTheme.TEXT_PRIMARY)
              .maxLines(1)
              .textOverflow({ overflow: TextOverflow.Ellipsis })
          }
          .onClick(() => {
            if (this.onOpenLink) {
              this.onOpenLink(top.link)
            }
          })
          if (index < 2) {
            Column() {}
              .width('100%')
              .height(1)
              .backgroundColor('#EEF1F5')
          }
        }
      }, (top: HomeArticleItem) => top.id.toString())
    }
    .padding(14)
    .backgroundColor(UiTheme.BG_CARD)
    .borderRadius(UiTheme.RADIUS_MD)
  }

  @Builder
  private quickTag(label: string, clickAction: () => void) {
    Text(label)
      .fontSize(12)
      .fontColor(UiTheme.BRAND_PRIMARY)
      .padding({ left: 10, right: 10, top: 6, bottom: 6 })
      .margin({ right: 8, bottom: 8 })
      .borderRadius(999)
      .backgroundColor(UiTheme.BRAND_SOFT)
      .onClick(() => {
        clickAction()
      })
  }

  private dotIndexes(): number[] {
    const size = this.vm.banners.length
    if (size >= 3) {
      return [0, 1, 2]
    }
    if (size === 2) {
      return [0, 1]
    }
    return [0]
  }

  private handleQuickNavigate(target: string): void {
    if (this.onQuickNavigate) {
      this.onQuickNavigate(target)
    } else {
      this.showActionToast('该入口暂不可用')
    }
  }

  private showActionToast(message: string): void {
    if (message.length === 0) {
      return
    }
    this.actionMessage = message
    this.clearActionTimer()
    this.actionTimerId = setTimeout(() => {
      this.actionMessage = ''
      this.actionTimerId = -1
    }, 2000)
  }

  private clearActionTimer(): void {
    if (this.actionTimerId >= 0) {
      clearTimeout(this.actionTimerId)
      this.actionTimerId = -1
    }
  }

  private isArticleCollected(articleId: number): boolean {
    this.favoriteVersion.toString()
    return FavoriteService.shared().isCollected(articleId)
  }
}
