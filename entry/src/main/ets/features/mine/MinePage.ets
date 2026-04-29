import { LoadStatus, UiState } from '../../common/ui/LoadState'
import { ArticleCard } from '../../common/ui/components/ArticleCard'
import { PagedListView } from '../../common/ui/components/PagedListView'
import { PageHeader } from '../../common/ui/components/PageHeader'
import { UiTheme } from '../../common/ui/UiTheme'
import { AuthViewModel } from '../auth/AuthViewModel'
import { CollectViewModel } from '../collect/CollectViewModel'
import { CollectItem } from '../collect/CollectRepository'
import { MessageViewModel } from '../message/MessageViewModel'
import { MessageItem } from '../message/MessageRepository'

enum MineTab {
  COLLECT = 0,
  UNREAD_MSG = 1,
  READ_MSG = 2
}

@Component
export struct MinePage {
  onOpenLink?: (url: string) => void

  @State authVm: AuthViewModel = new AuthViewModel()
  @State collectVm: CollectViewModel = new CollectViewModel()
  @State messageVm: MessageViewModel = new MessageViewModel()
  @State tab: MineTab = MineTab.COLLECT

  aboutToAppear(): void {
    this.initPage()
  }

  private async initPage(): Promise<void> {
    this.authVm.restoreSession()
    if (this.authVm.authState.status === LoadStatus.Success) {
      await Promise.all([
        this.authVm.loadUserInfo(),
        this.collectVm.loadFirstPage(),
        this.messageVm.init()
      ])
    }
    this.authVm = this.authVm
    this.collectVm = this.collectVm
    this.messageVm = this.messageVm
  }

  private async loginOrRegister(): Promise<void> {
    await this.authVm.loginOrRegister()
    if (this.authVm.authState.status === LoadStatus.Success) {
      await Promise.all([
        this.authVm.loadUserInfo(),
        this.collectVm.loadFirstPage(),
        this.messageVm.init()
      ])
    }
    this.authVm = this.authVm
    this.collectVm = this.collectVm
    this.messageVm = this.messageVm
  }

  private async logout(): Promise<void> {
    await this.authVm.logout()
    this.collectVm.state = UiState.empty('请先登录')
    this.messageVm.unreadCount = 0
    this.messageVm.unreadState = UiState.empty('请先登录')
    this.messageVm.readState = UiState.empty('请先登录')
    this.authVm = this.authVm
    this.collectVm = this.collectVm
    this.messageVm = this.messageVm
  }

  private async loadMoreCollect(): Promise<void> {
    await this.collectVm.loadMore()
    this.collectVm = this.collectVm
  }

  build() {
    Column() {
      PageHeader({ title: '我的' })

      if (this.authVm.authState.status !== LoadStatus.Success || !this.authVm.authState.data) {
        this.loginPanel()
      } else {
        this.userPanel()
        this.contentPanel()
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor(UiTheme.BG_PAGE)
  }

  @Builder
  private loginPanel() {
    Column({ space: 10 }) {
      TextInput({ placeholder: '账号', text: this.authVm.usernameInput })
        .onChange((value: string) => {
          this.authVm.usernameInput = value
          this.authVm = this.authVm
        })

      TextInput({ placeholder: '密码', text: this.authVm.passwordInput })
        .type(InputType.Password)
        .onChange((value: string) => {
          this.authVm.passwordInput = value
          this.authVm = this.authVm
        })

      Row({ space: 8 }) {
        Text(this.authVm.registerMode ? '注册模式' : '登录模式')
          .fontSize(13)
          .fontColor(UiTheme.TEXT_SECONDARY)
        Button('切换')
          .type(ButtonType.Capsule)
          .onClick(() => {
            this.authVm.registerMode = !this.authVm.registerMode
            this.authVm = this.authVm
          })
      }
      .width('100%')

      Button(this.authVm.registerMode ? '注册并登录' : '登录')
        .width('100%')
        .onClick(() => this.loginOrRegister())

      if (this.authVm.authState.status === LoadStatus.Error) {
        Text(this.authVm.authState.message)
          .fontSize(12)
          .fontColor(UiTheme.TEXT_DANGER)
      }
    }
    .padding(16)
    .margin({ left: 12, right: 12, top: 8 })
    .backgroundColor(UiTheme.BG_CARD)
    .borderRadius(10)
  }

  @Builder
  private userPanel() {
    if (this.authVm.authState.data) {
      Column({ space: 10 }) {
        Column({ space: 6 }) {
          Text(this.authVm.authState.data.nickname)
            .fontSize(28)
            .fontWeight(FontWeight.Bold)
            .fontColor('#FFFFFF')
          Text(`Lv.${this.authVm.userInfoState.data ? this.authVm.userInfoState.data.coinInfo.level : 1} · 排名 #${this.authVm.userInfoState.data ? this.authVm.userInfoState.data.coinInfo.rank : '-'}`)
            .fontSize(13)
            .fontColor('#FFFFFFCC')
        }
        .width('100%')
        .padding(18)
        .backgroundColor(UiTheme.BRAND_PRIMARY)
        .borderRadius(UiTheme.RADIUS_MD)

        Row() {
          this.statCell(this.authVm.userInfoState.data ? this.authVm.userInfoState.data.coinInfo.coinCount.toString() : '-', '积分')
          this.statCell(this.authVm.userInfoState.data ? this.authVm.userInfoState.data.coinInfo.rank : '-', '排名')
          this.statCell(this.messageVm.unreadCount.toString(), '消息')
        }
        .width('100%')
        .padding(12)
        .backgroundColor(UiTheme.BG_CARD)
        .borderRadius(UiTheme.RADIUS_MD)

        Button('退出登录')
          .type(ButtonType.Capsule)
          .backgroundColor('#FFFFFF')
          .fontColor(UiTheme.TEXT_DANGER)
          .onClick(() => this.logout())
      }
      .width('100%')
      .padding(12)
      .margin({ left: 12, right: 12, top: 8, bottom: 8 })
    }
  }

  @Builder
  private statCell(value: string | number, label: string) {
    Column({ space: 2 }) {
      Text(`${value}`)
        .fontSize(22)
        .fontWeight(FontWeight.Bold)
        .fontColor(UiTheme.TEXT_PRIMARY)
      Text(label)
        .fontSize(12)
        .fontColor(UiTheme.TEXT_SECONDARY)
    }
    .layoutWeight(1)
  }

  @Builder
  private contentPanel() {
    Row({ space: 8 }) {
      this.tabButton('收藏', MineTab.COLLECT)
      this.tabButton('未读消息', MineTab.UNREAD_MSG)
      this.tabButton('已读消息', MineTab.READ_MSG)
    }
    .width('100%')
    .padding({ left: 12, right: 12, top: 4, bottom: 8 })

    if (this.tab === MineTab.COLLECT) {
      this.collectListPanel()
    } else if (this.tab === MineTab.UNREAD_MSG) {
      this.messageListPanel('未读消息', this.messageVm.unreadState, true)
    } else {
      this.messageListPanel('已读消息', this.messageVm.readState, false)
    }
  }

  @Builder
  private collectListPanel() {
    Text('我的收藏')
      .fontSize(16)
      .fontWeight(FontWeight.Medium)
      .width('100%')
      .padding({ left: 16, right: 16, top: 2, bottom: 6 })

    PagedListView({
      status: this.collectVm.state.status,
      message: this.collectVm.state.message,
      retryAction: async () => {
        await this.collectVm.loadFirstPage()
        this.collectVm = this.collectVm
      },
      showLoadMore: this.collectVm.canLoadMore(),
      isLoadingMore: this.collectVm.isLoadingMore,
      loadMoreAction: () => this.loadMoreCollect()
    }) {
      ForEach(this.collectVm.state.data || [], (item: CollectItem) => {
        ListItem() {
          Column() {
            ArticleCard({
              article: {
                id: item.id,
                title: item.title,
                author: item.author,
                niceDate: item.niceDate
              },
              clickAction: () => {
                if (this.onOpenLink) {
                  this.onOpenLink(item.link)
                }
              }
            })
            Button('取消收藏')
              .type(ButtonType.Capsule)
              .margin({ top: 6 })
              .onClick(async () => {
                await this.collectVm.uncollect(item.id)
                this.collectVm = this.collectVm
              })
          }
        }
        }, (item: CollectItem) => item.id.toString())
    }
  }

  @Builder
  private messageListPanel(title: string, state: UiState<MessageItem[]>, unread: boolean) {
    Text(title)
      .fontSize(16)
      .fontWeight(FontWeight.Medium)
      .width('100%')
      .padding({ left: 16, right: 16, top: 2, bottom: 6 })

    PagedListView({
      status: state.status,
      message: state.message,
      retryAction: async () => {
        await this.messageVm.init()
        this.messageVm = this.messageVm
      },
      showLoadMore: unread ? this.messageVm.canLoadMoreUnread() : this.messageVm.canLoadMoreRead(),
      isLoadingMore: unread ? this.messageVm.isLoadingMoreUnread : this.messageVm.isLoadingMoreRead,
      loadMoreAction: async () => {
        if (unread) {
          await this.messageVm.loadMoreUnread()
        } else {
          await this.messageVm.loadMoreRead()
        }
        this.messageVm = this.messageVm
      }
    }) {
      ForEach(state.data || [], (item: MessageItem) => {
        ListItem() {
          Column() {
            Text(item.title)
              .fontSize(14)
              .fontWeight(FontWeight.Medium)
            Text(item.message)
              .fontSize(13)
              .fontColor(UiTheme.TEXT_SECONDARY)
              .margin({ top: 6 })
            Text(item.niceDate)
              .fontSize(12)
              .fontColor(UiTheme.TEXT_TERTIARY)
              .margin({ top: 8 })
            if (item.fullLink && this.onOpenLink) {
              Button('查看链接')
                .type(ButtonType.Capsule)
                .margin({ top: 6 })
                .onClick(() => {
                  if (this.onOpenLink) {
                    this.onOpenLink(item.fullLink || '')
                  }
                })
            }
          }
          .width('100%')
          .padding(12)
          .backgroundColor(UiTheme.BG_CARD)
          .borderRadius(8)
        }
        }, (item: MessageItem) => item.id.toString())
    }
  }

  @Builder
  private tabButton(label: string, tab: MineTab) {
    Button(label)
      .type(this.tab === tab ? ButtonType.Capsule : ButtonType.Normal)
      .backgroundColor(this.tab === tab ? UiTheme.BRAND_PRIMARY : UiTheme.BG_CARD)
      .fontColor(this.tab === tab ? '#FFFFFF' : UiTheme.TEXT_SECONDARY)
      .onClick(() => {
        this.tab = tab
      })
  }
}
