import { LoadStatus } from '../../common/ui/LoadState'
import { PageHeader } from '../../common/ui/components/PageHeader'
import { UiTheme } from '../../common/ui/UiTheme'
import { AuthViewModel } from '../auth/AuthViewModel'
import { MessageViewModel } from '../message/MessageViewModel'

@Component
export struct MinePage {
  onOpenLink?: (url: string) => void
  onOpenCollect?: () => void
  onOpenSettings?: () => void
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
          Text(this.profileName())
            .fontSize(20)
            .fontWeight(FontWeight.Bold)
            .fontColor('#FFFFFF')
          Text(this.profileMetaText())
            .fontSize(13)
            .fontColor('#FFFFFFE6')
        }
        .alignItems(HorizontalAlign.Start)

        Blank()
      }
      .width('100%')
      .margin({ bottom: 16 })

      Row() {
        this.summaryStat(this.coinText(), '积分')
        this.summaryDivider()
        this.summaryStat(this.rankText(), '排名')
        this.summaryDivider()
        this.summaryStat(this.collectCountText(), '收藏')
      }
      .width('100%')
      .height(82)
      .padding({ left: 8, right: 8 })
      .backgroundColor(UiTheme.BG_CARD)
      .borderRadius(14)
      .shadow({ radius: 12, color: '#00000010', offsetX: 0, offsetY: 4 })
      .margin({ bottom: -42 })
    }
    .width('100%')
    .padding({ left: 14, right: 14, top: 16, bottom: 42 })
    .linearGradient({
      angle: 135,
      colors: [['#2EA0F8', 0], ['#1F83DF', 1]]
    })
  }

  @Builder
  private summaryStat(value: string, label: string) {
    Column({ space: 3 }) {
      Text(value)
        .fontSize(22)
        .fontWeight(FontWeight.Bold)
        .fontColor('#000000')
        .maxLines(1)
        .textOverflow({ overflow: TextOverflow.Ellipsis })
        .textAlign(TextAlign.Center)
      Text(label)
        .fontSize(12)
        .fontColor('#202124')
        .textAlign(TextAlign.Center)
    }
    .layoutWeight(1)
    .height('100%')
    .justifyContent(FlexAlign.Center)
    .alignItems(HorizontalAlign.Center)
  }

  @Builder
  private summaryDivider() {
    Column() {}
      .width(1)
      .height(44)
      .backgroundColor('#E0E0E0')
  }

  private profileName(): string {
    if (this.authVm.userInfoState.data) {
      const profile = this.authVm.userInfoState.data.userInfo
      return profile.nickname || profile.publicName || profile.username
    }
    return this.authVm.authState.data ? this.authVm.authState.data.nickname : ''
  }

  private profileMetaText(): string {
    const level = this.levelText()
    const rank = this.rankText()
    if (level === '-' && rank === '-') {
      return '玩Android账号'
    }
    if (level === '-') {
      return `排名 #${rank}`
    }
    if (rank === '-') {
      return `Lv.${level}`
    }
    return `Lv.${level} · 排名 #${rank}`
  }

  private levelText(): string {
    if (this.authVm.userInfoState.data) {
      const level = this.authVm.userInfoState.data.coinInfo?.level ?? this.authVm.userInfoState.data.userInfo.level
      return level !== undefined ? level.toString() : '-'
    }
    if (this.authVm.authState.data && this.authVm.authState.data.level !== undefined) {
      return this.authVm.authState.data.level.toString()
    }
    return '-'
  }

  private coinText(): string {
    if (this.authVm.userInfoState.data) {
      const coinCount = this.authVm.userInfoState.data.coinInfo?.coinCount ?? this.authVm.userInfoState.data.userInfo.coinCount
      return coinCount !== undefined ? coinCount.toString() : '-'
    }
    if (this.authVm.authState.data && this.authVm.authState.data.coinCount !== undefined) {
      return this.authVm.authState.data.coinCount.toString()
    }
    return '-'
  }

  private rankText(): string {
    if (this.authVm.userInfoState.data) {
      const rank = this.authVm.userInfoState.data.coinInfo?.rank ?? this.authVm.userInfoState.data.userInfo.rank
      return rank !== undefined && rank.length > 0 ? rank : '-'
    }
    if (this.authVm.authState.data && this.authVm.authState.data.rank && this.authVm.authState.data.rank.length > 0) {
      return this.authVm.authState.data.rank
    }
    return '-'
  }

  private collectCountText(): string {
    if (this.authVm.userInfoState.data) {
      const collectArticleInfo = this.authVm.userInfoState.data.collectArticleInfo
      if (collectArticleInfo) {
        return collectArticleInfo.count.toString()
      }
      const collectIds = this.authVm.userInfoState.data.userInfo.collectIds || []
      return collectIds.length.toString()
    }
    if (this.authVm.authState.data && this.authVm.authState.data.collectCount !== undefined) {
      return this.authVm.authState.data.collectCount.toString()
    }
    return '-'
  }

  @Builder
  private menuPanel(loggedIn: boolean) {
    Column() {
      Column({ space: 0 }) {
        this.menuRow('我的收藏', '♥', '', () => {
          if (loggedIn) {
            if (this.onOpenCollect) {
              this.onOpenCollect()
            }
          } else if (this.onRequireLogin) {
            this.onRequireLogin()
          }
        })
        this.menuRow('我的文章', '▤', '', () => {})
        this.menuRow('站内消息', '✉', `${this.messageVm.unreadCount}`, () => {})
        this.menuRow('系统设置', '⚙', '', () => {
          if (this.onOpenSettings) {
            this.onOpenSettings()
          }
        })
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
  private menuRow(label: string, icon: string, rightValue: string, clickAction: () => void) {
    Row({ space: 12 }) {
      Stack({ alignContent: Alignment.Center }) {
        Text(icon)
          .fontSize(18)
          .fontColor(UiTheme.BRAND_PRIMARY)
          .fontWeight(FontWeight.Bold)
      }
      .width(44)
      .height(44)
      .borderRadius(12)
      .backgroundColor('#F7F9FB')

      Text(label)
        .fontSize(15)
        .fontWeight(FontWeight.Medium)
        .fontColor('#202124')
      Blank()
      if (rightValue.length > 0) {
        Text(rightValue)
          .fontSize(11)
          .fontColor(UiTheme.TEXT_SECONDARY)
          .textAlign(TextAlign.Center)
          .padding({ left: 6, right: 6, top: 2, bottom: 2 })
          .backgroundColor('#00000000')
          .borderRadius(999)
          .margin({ right: 6 })
      } else {
        Text('›')
          .fontSize(20)
          .fontColor('#BDBDBD')
      }
    }
    .width('100%')
    .height(68)
    .padding({ left: 20, right: 20 })
    .backgroundColor(UiTheme.BG_CARD)
    .border({ width: { bottom: 1 }, color: '#E0E0E0' })
    .onClick(() => {
      clickAction()
    })
  }
}
