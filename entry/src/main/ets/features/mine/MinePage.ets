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
    Column({ space: 10 }) {
      Text('未登录')
        .fontSize(20)
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
    .padding({ left: 14, right: 14, top: 16, bottom: 68 })
    .linearGradient({
      angle: 135,
      colors: [['#2EA0F8', 0], ['#1F83DF', 1]]
    })
  }

  @Builder
  private profilePanel() {
    Column() {
      Row({ space: 10 }) {
        Stack({ alignContent: Alignment.Center }) {
          Text('◉').fontSize(30).fontColor('#FFFFFFCC')
        }
        .width(64)
        .height(64)
        .borderRadius(32)
        .backgroundColor('#FFFFFF44')

        Column({ space: 4 }) {
          Text(this.authVm.authState.data ? this.authVm.authState.data.nickname : '')
            .fontSize(20)
            .fontWeight(FontWeight.Bold)
            .fontColor('#FFFFFF')
          Text(`Lv.${this.authVm.userInfoState.data ? this.authVm.userInfoState.data.coinInfo.level : 1} · 排名 #${this.authVm.userInfoState.data ? this.authVm.userInfoState.data.coinInfo.rank : '-'}`)
            .fontSize(13)
            .fontColor('#FFFFFFE6')
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
      .padding({ left: 8, right: 8, top: 12, bottom: 12 })
      .backgroundColor(UiTheme.BG_CARD)
      .borderRadius(14)
      .margin({ top: 16, bottom: -98 })
    }
    .width('100%')
    .padding({ left: 14, right: 14, top: 16, bottom: 68 })
    .linearGradient({
      angle: 135,
      colors: [['#2EA0F8', 0], ['#1F83DF', 1]]
    })
  }

  @Builder
  private statCell(value: string | number, label: string) {
    Column({ space: 2 }) {
      Text(`${value}`)
        .fontSize(22)
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
    .padding({ top: loggedIn ? 56 : 14, left: 12, right: 12 })
    .backgroundColor(UiTheme.BG_PAGE)

    if (loggedIn) {
      Text('退出登录')
        .width('100%')
        .textAlign(TextAlign.Center)
        .fontSize(15)
        .fontColor(UiTheme.TEXT_DANGER)
        .fontWeight(FontWeight.Bold)
        .margin({ top: 8 })
        .onClick(async () => {
          await this.doLogout()
        })
    }
  }

  @Builder
  private menuRow(label: string, rightValue: string, clickAction: () => void) {
    Row() {
      Text(label)
        .fontSize(15)
        .fontColor(UiTheme.TEXT_PRIMARY)
      Blank()
      if (rightValue.length > 0) {
        Text(rightValue)
          .fontSize(11)
          .fontColor(label === 'TODO' ? '#FFFFFF' : UiTheme.TEXT_SECONDARY)
          .textAlign(TextAlign.Center)
          .padding({ left: 6, right: 6, top: 2, bottom: 2 })
          .backgroundColor(label === 'TODO' ? '#F53F3F' : '#00000000')
          .borderRadius(999)
          .margin({ right: label === 'TODO' ? 0 : 6 })
      } else {
        Text('›')
          .fontSize(18)
          .fontColor(UiTheme.TEXT_TERTIARY)
      }
    }
    .width('100%')
    .padding({ left: 2, right: 2, top: 12, bottom: 12 })
    .backgroundColor(UiTheme.BG_CARD)
    .border({ width: { bottom: 1 }, color: '#E5E6EB' })
    .onClick(() => {
      clickAction()
    })
  }
}
