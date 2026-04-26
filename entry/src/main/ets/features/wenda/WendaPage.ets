import { ArticleCard } from '../../common/ui/components/ArticleCard'
import { FavoriteService } from '../../common/favorite/FavoriteService'
import { PagedListView } from '../../common/ui/components/PagedListView'
import { PageHeader } from '../../common/ui/components/PageHeader'
import { StateView } from '../../common/ui/components/StateView'
import { WendaViewModel } from './WendaViewModel'

@Component
export struct WendaPage {
  onOpenLink?: (url: string) => void
  onOpenUserShare?: (userId: number, username: string) => void
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
    .backgroundColor('#F5F6F8')
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
      isLoadingMore: this.vm.isLoadingMore,
      loadMoreAction: async () => {
        await this.vm.loadMore()
        this.vm = this.vm
      }
    }) {
      ForEach(this.vm.wendaState.data || [], (item) => {
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
              collected: FavoriteService.shared().isCollected(item.id),
              showCollectAction: true,
              onClick: () => {
                if (this.onOpenLink) {
                  this.onOpenLink(item.link)
                }
              },
              onToggleCollect: async () => {
                await FavoriteService.shared().toggle(item.id)
                this.favoriteVersion++
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
      }, (item) => item.id.toString())
    }
  }

  @Builder
  private commentArea() {
    Column() {
      if (this.commentActionTip.length > 0) {
        Text(this.commentActionTip)
          .width('100%')
          .fontSize(12)
          .fontColor('#C97A00')
          .padding({ left: 12, right: 12, top: 6, bottom: 6 })
          .backgroundColor('#FFF6E5')
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

      StateView({
        status: this.vm.commentState.status,
        message: this.vm.commentState.message
      }) {
        List({ space: 8 }) {
          ForEach(this.vm.getSortedComments(), (item) => {
            ListItem() {
              Column() {
                Row() {
                  Text(item.userName)
                    .fontSize(13)
                    .fontWeight(FontWeight.Medium)
                  Blank()
                  Text(`赞 ${item.zan}`)
                    .fontSize(12)
                    .fontColor('#666666')
                }
                .width('100%')

                Text(item.content)
                  .fontSize(14)
                  .margin({ top: 6 })

                Text(item.niceDate)
                  .fontSize(12)
                  .fontColor('#999999')
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
              .backgroundColor(Color.White)
              .borderRadius(8)
            }
          }, (item) => item.id.toString())
        }
        .padding({ left: 12, right: 12, bottom: 12 })
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
}
