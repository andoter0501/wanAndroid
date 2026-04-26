import { ArticleCard } from '../../common/ui/components/ArticleCard'
import { FavoriteService } from '../../common/favorite/FavoriteService'
import { PageHeader } from '../../common/ui/components/PageHeader'
import { PagedListView } from '../../common/ui/components/PagedListView'
import { UserShareViewModel } from './UserShareViewModel'

@Component
export struct UserSharePage {
  @Prop userId: number = 0
  @Prop username: string = '分享人'
  onBack?: () => void
  onOpenLink?: (url: string) => void

  @State vm: UserShareViewModel = new UserShareViewModel()
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
    await this.vm.loadFirstPage(this.userId)
    this.vm = this.vm
  }

  build() {
    Column() {
      PageHeader({
        title: `${this.username} 的分享`,
        showBack: true,
        onBack: () => {
          if (this.onBack) {
            this.onBack()
          }
        }
      })

      if (this.vm.coinInfo) {
        this.userInfoCard()
      }

      PagedListView({
        status: this.vm.state.status,
        message: this.vm.state.message,
        retryAction: async () => {
          await this.vm.loadFirstPage(this.userId)
          this.vm = this.vm
        },
        isLoadingMore: this.vm.isLoadingMore,
        loadMoreAction: async () => {
          await this.vm.loadMore(this.userId)
          this.vm = this.vm
        }
      }) {
        ForEach(this.vm.state.data || [], (item) => {
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
          }
        }, (item) => item.id.toString())
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F6F8')
  }

  @Builder
  private userInfoCard() {
    const info = this.vm.coinInfo!
    Column({ space: 6 }) {
      Text(info.username || this.username)
        .fontSize(16)
        .fontWeight(FontWeight.Medium)
      Text(`用户ID：${info.userId}`)
        .fontSize(12)
        .fontColor('#666666')
      Text(`积分：${info.coinCount}  排名：${info.rank}`)
        .fontSize(12)
        .fontColor('#333333')
    }
    .width('100%')
    .padding(12)
    .margin({ left: 12, right: 12, bottom: 8 })
    .backgroundColor(Color.White)
    .borderRadius(10)
  }
}
