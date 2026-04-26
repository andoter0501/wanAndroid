import { ArticleCard } from '../../common/ui/components/ArticleCard'
import { FavoriteService } from '../../common/favorite/FavoriteService'
import { PagedListView } from '../../common/ui/components/PagedListView'
import { PageHeader } from '../../common/ui/components/PageHeader'
import { SessionStore } from '../../common/storage/SessionStore'
import { PlazaViewModel } from './PlazaViewModel'

enum PlazaTab {
  PLAZA = 0,
  MY_SHARE = 1
}

@Component
export struct PlazaPage {
  onOpenLink?: (url: string) => void
  onOpenUserShare?: (userId: number, username: string) => void

  @State vm: PlazaViewModel = new PlazaViewModel()
  @State tab: PlazaTab = PlazaTab.PLAZA
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
    if (SessionStore.shared().isLogin()) {
      await this.vm.loadMyShareFirstPage()
    }
    this.vm = this.vm
  }

  build() {
    Column() {
      PageHeader({ title: '广场' })

      Row({ space: 8 }) {
        this.tabBtn('广场动态', PlazaTab.PLAZA)
        this.tabBtn('我的分享', PlazaTab.MY_SHARE)
      }
      .width('100%')
      .padding({ left: 12, right: 12, bottom: 10 })

      if (this.tab === PlazaTab.PLAZA) {
        this.plazaList()
      } else {
        this.myShareArea()
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F6F8')
  }

  @Builder
  private tabBtn(label: string, tab: PlazaTab) {
    Button(label)
      .type(this.tab === tab ? ButtonType.Capsule : ButtonType.Normal)
      .onClick(async () => {
        this.tab = tab
        if (tab === PlazaTab.MY_SHARE && SessionStore.shared().isLogin()) {
          await this.vm.loadMyShareFirstPage()
          this.vm = this.vm
        }
      })
  }

  @Builder
  private plazaList() {
    PagedListView({
      status: this.vm.plazaState.status,
      message: this.vm.plazaState.message,
      retryAction: async () => {
        await this.vm.loadPlazaFirstPage()
        this.vm = this.vm
      },
      isLoadingMore: this.vm.isLoadingMorePlaza,
      loadMoreAction: async () => {
        await this.vm.loadMorePlaza()
        this.vm = this.vm
      }
    }) {
      ForEach(this.vm.plazaState.data || [], (item) => {
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
  private myShareArea() {
    if (!SessionStore.shared().isLogin()) {
      Column() {
        Text('请先登录后使用分享能力')
          .fontSize(14)
          .fontColor('#666666')
      }
      .layoutWeight(1)
      .justifyContent(FlexAlign.Center)
    } else {
      Column() {
        Column({ space: 8 }) {
          TextInput({ placeholder: '分享标题', text: this.vm.shareTitleInput })
            .onChange((value: string) => {
              this.vm.shareTitleInput = value
              this.vm = this.vm
            })
          TextInput({ placeholder: '分享链接', text: this.vm.shareLinkInput })
            .onChange((value: string) => {
              this.vm.shareLinkInput = value
              this.vm = this.vm
            })
          Button('发布分享')
            .width('100%')
            .onClick(async () => {
              await this.vm.submitShare()
              this.vm = this.vm
            })
          if (this.vm.shareMessage.length > 0) {
            Text(this.vm.shareMessage)
              .fontSize(12)
              .fontColor('#666666')
          }
        }
        .padding(12)
        .margin({ left: 12, right: 12, bottom: 8 })
        .backgroundColor(Color.White)
        .borderRadius(10)

        PagedListView({
          status: this.vm.myShareState.status,
          message: this.vm.myShareState.message,
          retryAction: async () => {
            await this.vm.loadMyShareFirstPage()
            this.vm = this.vm
          },
          isLoadingMore: this.vm.isLoadingMoreMyShare,
          loadMoreAction: async () => {
            await this.vm.loadMoreMyShare()
            this.vm = this.vm
          }
        }) {
          ForEach(this.vm.myShareState.data || [], (item) => {
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
                Button('删除')
                  .type(ButtonType.Capsule)
                  .margin({ top: 6 })
                  .onClick(async () => {
                    await this.vm.deleteMyShare(item.id)
                    this.vm = this.vm
                  })
              }
            }
          }, (item) => item.id.toString())
        }
      }
      .layoutWeight(1)
    }
  }
}
