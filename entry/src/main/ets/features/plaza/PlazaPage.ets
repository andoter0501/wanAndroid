import { FavoriteService } from '../../common/favorite/FavoriteService'
import { parseErrorMessage } from '../../common/network/ErrorMessage'
import { PageHeader } from '../../common/ui/components/PageHeader'
import { StateView } from '../../common/ui/components/StateView'
import { UiTheme } from '../../common/ui/UiTheme'
import { PlazaArticle } from './PlazaRepository'
import { PlazaViewModel } from './PlazaViewModel'

@Component
export struct PlazaPage {
  onOpenLink?: (url: string) => void
  onOpenUserShare?: (userId: number, username: string) => void
  onToast?: (message: string) => void

  @State vm: PlazaViewModel = new PlazaViewModel()
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
    await this.vm.loadPlazaFirstPage()
    this.vm = this.vm
  }

  private async loadMorePlaza(): Promise<void> {
    await this.vm.loadMorePlaza()
    this.vm = this.vm
  }

  build() {
    Column() {
      PageHeader({ title: '广场' })

      Column() {
        StateView({
          status: this.vm.plazaState.status,
          message: this.vm.plazaState.message,
          retryAction: () => this.initPage()
        }) {
          List({ space: 10 }) {
            ForEach(this.vm.plazaState.data || [], (item: PlazaArticle) => {
              ListItem() {
                this.plazaCard(item)
              }
            }, (item: PlazaArticle) => item.id.toString())

            if (this.vm.canLoadMorePlaza()) {
              ListItem() {
                Text(this.vm.isLoadingMorePlaza ? '加载中...' : '加载更多')
                  .width('100%')
                  .textAlign(TextAlign.Center)
                  .fontSize(12)
                  .fontColor(UiTheme.TEXT_SECONDARY)
                  .padding({ top: 9, bottom: 9 })
                  .onClick(() => {
                    this.loadMorePlaza()
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
  private plazaCard(item: PlazaArticle) {
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
        .onClick(() => {
          if (this.onOpenLink) {
            this.onOpenLink(item.link)
          }
        })

      Row() {
        Text(`作者: ${this.authorName(item)} · ${item.niceDate || ''}`)
          .width('100%')
          .fontSize(11)
          .fontColor(UiTheme.TEXT_SECONDARY)
          .textAlign(TextAlign.Start)
          .maxLines(1)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
          .layoutWeight(1)
          .onClick(() => {
            if (item.userId && item.userId > 0 && this.onOpenUserShare) {
              this.onOpenUserShare(item.userId, this.authorName(item))
            }
          })

        Text(this.isArticleCollected(item.id) ? '已收藏' : '收藏')
          .fontSize(11)
          .fontColor(this.isArticleCollected(item.id) ? UiTheme.BRAND_PRIMARY : UiTheme.TEXT_TERTIARY)
          .padding({ left: 10 })
          .onClick(async () => {
            try {
              const nextCollected = await FavoriteService.shared().toggle(item.id)
              this.favoriteVersion++
              this.showActionToast(nextCollected ? '收藏成功' : '已取消收藏')
            } catch (error) {
              this.showActionToast(parseErrorMessage(error))
            }
          })
      }
      .width('100%')
    }
    .width('100%')
    .alignItems(HorizontalAlign.Start)
    .padding(11)
    .backgroundColor(UiTheme.BG_CARD)
    .borderRadius(UiTheme.RADIUS_MD)
  }

  private authorName(item: PlazaArticle): string {
    return item.shareUser || item.author || '分享人'
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
