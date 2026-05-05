import { ArticleCard } from '../../common/ui/components/ArticleCard'
import { FavoriteService } from '../../common/favorite/FavoriteService'
import { parseErrorMessage } from '../../common/network/ErrorMessage'
import { SessionStore } from '../../common/storage/SessionStore'
import { PagedListView } from '../../common/ui/components/PagedListView'
import { PageHeader } from '../../common/ui/components/PageHeader'
import { UiTheme } from '../../common/ui/UiTheme'
import { StateView } from '../../common/ui/components/StateView'
import { WendaViewModel } from './WendaViewModel'
import { WendaComment, WendaItem } from './WendaRepository'

@Component
export struct WendaPage {
  onOpenLink?: (url: string) => void
  onOpenUserShare?: (userId: number, username: string) => void
  onToast?: (message: string) => void
  onRequireLogin?: () => void
  @State vm: WendaViewModel = new WendaViewModel()
  @State showComments: boolean = false
  @State selectedTitle: string = ''
  @State selectedWendaId: number = 0
  @State commentActionTip: string = ''
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

  build() {
    Column() {
      PageHeader({ title: this.showComments ? '问答评论' : '问答' })

      if (this.showComments) {
        this.commentArea()
      } else {
        this.wendaList()
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor(UiTheme.BG_PAGE)
  }

  @Builder
  private wendaList() {
    PagedListView({
      status: this.vm.wendaState.status,
      message: this.vm.wendaState.message,
      retryAction: async () => {
        await this.vm.loadWendaFirstPage()
        this.vm = this.vm
      },
      showLoadMore: this.vm.canLoadMore(),
      isLoadingMore: this.vm.isLoadingMore,
      loadMoreAction: async () => {
        await this.vm.loadMore()
        this.vm = this.vm
      }
    }) {
      ForEach(this.vm.wendaState.data || [], (item: WendaItem) => {
        ListItem() {
          Column() {
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
                if (!this.ensureLogin()) {
                  return
                }
                try {
                  const nextCollected = await FavoriteService.shared().toggle(item.id)
                  this.favoriteVersion++
                  this.showActionToast(nextCollected ? '收藏成功' : '已取消收藏')
                } catch (error) {
                  this.showActionToast(parseErrorMessage(error))
                }
              }
            })
            Button('查看评论')
              .type(ButtonType.Capsule)
              .margin({ top: 6 })
              .onClick(async () => {
                this.selectedWendaId = item.id
                this.selectedTitle = item.title
                await this.vm.loadComments(item.id)
                this.showComments = true
                this.vm = this.vm
              })
            if (item.userId && item.userId > 0) {
              Button('分享人主页')
                .type(ButtonType.Capsule)
                .margin({ top: 6 })
                .onClick(() => {
                  if (this.onOpenUserShare) {
                    this.onOpenUserShare(item.userId || 0, item.shareUser || item.author || '分享人')
                  }
                })
            }
          }
        }
      }, (item: WendaItem) => item.id.toString())
    }
  }

  @Builder
  private commentArea() {
    Column() {
      if (this.commentActionTip.length > 0) {
        Text(this.commentActionTip)
          .width('100%')
          .fontSize(12)
          .fontColor(UiTheme.TEXT_WARNING)
          .padding({ left: 12, right: 12, top: 6, bottom: 6 })
          .backgroundColor(UiTheme.BG_WARNING)
      }

      Row() {
        Button('返回列表')
          .type(ButtonType.Capsule)
          .onClick(() => {
            this.showComments = false
          })
        Text(this.selectedTitle)
          .fontSize(13)
          .maxLines(1)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
          .margin({ left: 8 })
      }
      .width('100%')
      .padding({ left: 12, right: 12, bottom: 8 })

      Row({ space: 8 }) {
        Button(this.vm.commentSortDesc ? '按点赞降序' : '按点赞升序')
          .type(ButtonType.Capsule)
          .onClick(() => {
            this.vm.toggleCommentSort()
            this.vm = this.vm
          })
        Button('刷新评论')
          .type(ButtonType.Capsule)
          .onClick(async () => {
            if (this.selectedWendaId > 0) {
              await this.vm.loadComments(this.selectedWendaId)
              this.vm = this.vm
            }
          })
      }
      .width('100%')
      .padding({ left: 12, right: 12, bottom: 8 })

      Column() {
        StateView({
          status: this.vm.commentState.status,
          message: this.vm.commentState.message
        }) {
          List({ space: 8 }) {
            ForEach(this.vm.getSortedComments(), (item: WendaComment) => {
              ListItem() {
                Column() {
                  Row() {
                    Text(item.userName)
                      .fontSize(13)
                      .fontWeight(FontWeight.Medium)
                    Blank()
                    Text(`赞 ${item.zan}`)
                      .fontSize(12)
                      .fontColor(UiTheme.TEXT_SECONDARY)
                  }
                  .width('100%')

                  Text(item.content)
                    .fontSize(14)
                    .margin({ top: 6 })

                  Text(item.niceDate)
                    .fontSize(12)
                    .fontColor(UiTheme.TEXT_TERTIARY)
                    .margin({ top: 8 })

                  Row({ space: 8 }) {
                    Button('点赞（待开放）')
                      .type(ButtonType.Capsule)
                      .onClick(() => {
                        this.showCommentActionTip('点赞', item.id)
                      })

                    Button('回复（待开放）')
                      .type(ButtonType.Capsule)
                      .onClick(() => {
                        this.showCommentActionTip('回复', item.id)
                      })
                  }
                  .margin({ top: 8 })
                }
                .width('100%')
                .padding(12)
                .backgroundColor(UiTheme.BG_CARD)
                .borderRadius(8)
              }
            }, (item: WendaComment) => item.id.toString())
          }
          .padding({ left: 12, right: 12, bottom: 12 })
        }
      }
      .layoutWeight(1)
    }
    .layoutWeight(1)
  }

  private showCommentActionTip(action: string, commentId: number): void {
    this.commentActionTip = `${action}功能规划中（评论ID: ${commentId}）`
    setTimeout(() => {
      this.commentActionTip = ''
    }, 1500)
  }

  private showActionToast(message: string): void {
    if (this.onToast) {
      this.onToast(message)
    }
  }

  private ensureLogin(): boolean {
    if (SessionStore.shared().isLogin()) {
      return true
    }
    if (this.onRequireLogin) {
      this.onRequireLogin()
    } else {
      this.showActionToast('请先登录')
    }
    return false
  }

  private isArticleCollected(articleId: number): boolean {
    this.favoriteVersion.toString()
    return FavoriteService.shared().isCollected(articleId)
  }
}
