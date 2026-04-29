import { LoadStatus } from '../../common/ui/LoadState'
import { PageHeader } from '../../common/ui/components/PageHeader'
import { UiTheme } from '../../common/ui/UiTheme'
import { AuthViewModel } from '../auth/AuthViewModel'
import { MessageViewModel } from '../message/MessageViewModel'

@Component
export struct MinePage {
  onOpenLink?: (url: string) => void
  onOpenCollect?: () => void
  onRequireLogin?: () => void

  @State authVm: AuthViewModel = new AuthViewModel()
  @State messageVm: MessageViewModel = new MessageViewModel()

  aboutToAppear(): void {
    this.initPage()
  }

  private async initPage(): Promise<void> {
    this.authVm.restoreSession()
    if (this.authVm.authState.status === LoadStatus.Success) {
      await Promise.all([
        this.authVm.loadUserInfo(),
        this.messageVm.init()
      ])
    }
    this.authVm = this.authVm
    this.messageVm = this.messageVm
  }

  private async doLogout(): Promise<void> {
    await this.authVm.logout()
    this.messageVm.unreadCount = 0
    this.authVm = this.authVm
    this.messageVm = this.messageVm
  }

  build() {
    Column() {
      PageHeader({ title: '我的' })

      if (this.authVm.authState.status === LoadStatus.Success && this.authVm.authState.data) {
        this.profilePanel()
        this.menuPanel(true)
      } else {
        this.guestPanel()
        this.menuPanel(false)
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor(UiTheme.BG_PAGE)
  }

  @Builder
  private guestPanel() {
    Column({ space: 12 }) {
      Text('未登录')
        .fontSize(22)
        .fontWeight(FontWeight.Bold)
        .fontColor('#FFFFFF')
      Text('登录后可查看收藏与消息')
        .fontSize(12)
        .fontColor('#FFFFFFCC')
      Button('去登录')
        .type(ButtonType.Capsule)
        .fontColor(UiTheme.BRAND_PRIMARY)
        .backgroundColor('#FFFFFF')
        .onClick(() => {
          if (this.onRequireLogin) {
            this.onRequireLogin()
          }
        })
    }
    .alignItems(HorizontalAlign.Start)
    .width('100%')
    .padding(16)
    .backgroundColor(UiTheme.BRAND_PRIMARY)
  }

  @Builder
  private profilePanel() {
    Column() {
      Row({ space: 10 }) {
        Stack({ alignContent: Alignment.Center }) {
          Text('◉').fontSize(24).fontColor('#FFFFFFAA')
        }
        .width(64)
        .height(64)
        .borderRadius(32)
        .backgroundColor('#FFFFFF44')

        Column({ space: 4 }) {
          Text(this.authVm.authState.data ? this.authVm.authState.data.nickname : '')
            .fontSize(22)
            .fontWeight(FontWeight.Bold)
            .fontColor('#FFFFFF')
          Text(`Lv.${this.authVm.userInfoState.data ? this.authVm.userInfoState.data.coinInfo.level : 1} · 排名 #${this.authVm.userInfoState.data ? this.authVm.userInfoState.data.coinInfo.rank : '-'}`)
            .fontSize(12)
            .fontColor('#FFFFFFCC')
        }
        .alignItems(HorizontalAlign.Start)

        Blank()
      }
      .width('100%')

      Row() {
        this.statCell(this.authVm.userInfoState.data ? this.authVm.userInfoState.data.coinInfo.coinCount.toString() : '-', '积分')
        Column() {}
          .width(1)
          .height(34)
          .backgroundColor('#ECEFF3')
        this.statCell(this.authVm.userInfoState.data ? this.authVm.userInfoState.data.coinInfo.rank : '-', '排名')
        Column() {}
          .width(1)
          .height(34)
          .backgroundColor('#ECEFF3')
        this.statCell('--', '收藏')
      }
      .width('100%')
      .padding({ top: 12, bottom: 12 })
      .backgroundColor(UiTheme.BG_CARD)
      .borderRadius(14)
      .margin({ top: 12, bottom: -30 })
    }
    .width('100%')
    .padding({ left: 16, right: 16, top: 16, bottom: 30 })
    .backgroundColor(UiTheme.BRAND_PRIMARY)
  }

  @Builder
  private statCell(value: string | number, label: string) {
    Column({ space: 2 }) {
      Text(`${value}`)
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
        .fontColor(UiTheme.TEXT_PRIMARY)
      Text(label)
        .fontSize(11)
        .fontColor(UiTheme.TEXT_SECONDARY)
    }
    .layoutWeight(1)
    .alignItems(HorizontalAlign.Center)
  }

  @Builder
  private menuPanel(loggedIn: boolean) {
    Column() {
      Column({ space: 0 }) {
        this.menuRow('我的收藏', '', () => {
          if (loggedIn) {
            if (this.onOpenCollect) {
              this.onOpenCollect()
            }
          } else if (this.onRequireLogin) {
            this.onRequireLogin()
          }
        })
        this.menuRow('我的文章', '', () => {})
        this.menuRow('TODO', '5', () => {})
        this.menuRow('站内消息', `${this.messageVm.unreadCount}`, () => {})
        this.menuRow('系统设置', '', () => {})
      }
      .width('100%')
      .backgroundColor(UiTheme.BG_CARD)
      .borderRadius(16)
      .clip(true)
    }
    .width('100%')
    .padding({ top: loggedIn ? 40 : 14, left: 12, right: 12 })
    .backgroundColor(UiTheme.BG_PAGE)

    if (loggedIn) {
      Text('退出登录')
        .fontSize(20)
        .fontColor(UiTheme.TEXT_DANGER)
        .fontWeight(FontWeight.Medium)
        .margin({ top: 26 })
        .onClick(async () => {
          await this.doLogout()
        })
    }
  }

  @Builder
  private menuRow(label: string, rightValue: string, clickAction: () => void) {
    Row({ space: 12 }) {
      Row() {}
        .width(32)
        .height(32)
        .backgroundColor('#F4F6F8')
        .borderRadius(10)

      Text(label)
        .fontSize(16)
        .fontColor(UiTheme.TEXT_PRIMARY)
      Blank()
      if (rightValue.length > 0) {
        Text(rightValue)
          .fontSize(14)
          .fontColor(UiTheme.TEXT_SECONDARY)
          .margin({ right: 6 })
      }
      Text('›')
        .fontSize(18)
        .fontColor(UiTheme.TEXT_TERTIARY)
    }
    .width('100%')
    .padding({ left: 14, right: 14, top: 14, bottom: 14 })
    .backgroundColor(UiTheme.BG_CARD)
    .border({ width: { bottom: 1 }, color: '#EEF1F5' })
    .onClick(() => {
      clickAction()
    })
  }
}
