import { DiscoverPage } from '../features/discover/DiscoverPage'
import { HomePage } from '../features/home/HomePage'
import { MinePage } from '../features/mine/MinePage'
import { PlazaPage } from '../features/plaza/PlazaPage'
import { SearchPage } from '../features/search/SearchPage'
import { UserSharePage } from '../features/user/UserSharePage'
import { WendaPage } from '../features/wenda/WendaPage'
import { WebDetailPage } from '../features/web/WebDetailPage'
import { UrlSecurityGuard } from '../common/web/UrlSecurityGuard'
import { SessionEventBus, SessionEventType } from '../common/session/SessionEventBus'
import { UiTheme } from '../common/ui/UiTheme'

enum MainTab {
  HOME = 0,
  DISCOVER = 1,
  PLAZA = 2,
  WENDA = 3,
  MINE = 4
}

@Component
export struct AppShellPage {
  @State currentTab: MainTab = MainTab.HOME
  @State showSearch: boolean = false
  @State showWeb: boolean = false
  @State showUserShare: boolean = false
  @State currentUrl: string = ''
  @State currentUserId: number = 0
  @State currentUsername: string = ''
  @State warning: string = ''
  private readonly sessionListener = (event: SessionEventType, message: string): void => {
    if (event === SessionEventType.EXPIRED) {
      this.showSearch = false
      this.showWeb = false
      this.showUserShare = false
      this.currentTab = MainTab.MINE
      this.warning = message || '登录已失效，请重新登录'
    }
  }

  aboutToAppear(): void {
    SessionEventBus.subscribe(this.sessionListener)
  }

  aboutToDisappear(): void {
    SessionEventBus.unsubscribe(this.sessionListener)
  }

  build() {
    Column() {
      if (this.showSearch) {
        SearchPage({
          onBack: () => {
            animateTo({ duration: 160, curve: Curve.EaseInOut }, () => {
              this.showSearch = false
            })
          },
          onOpenLink: (url: string) => {
            this.openLink(url)
          }
        })
      } else if (this.showUserShare) {
        UserSharePage({
          userId: this.currentUserId,
          username: this.currentUsername,
          onBack: () => {
            animateTo({ duration: 160, curve: Curve.EaseInOut }, () => {
              this.showUserShare = false
            })
          },
          onOpenLink: (url: string) => {
            this.openLink(url)
          }
        })
      } else if (this.showWeb) {
        WebDetailPage({
          url: this.currentUrl,
          onBack: () => {
            animateTo({ duration: 160, curve: Curve.EaseInOut }, () => {
              this.showWeb = false
            })
          }
        })
      } else {
        if (this.currentTab === MainTab.HOME) {
          HomePage({
            onOpenSearch: () => {
              animateTo({ duration: 160, curve: Curve.EaseInOut }, () => {
                this.showSearch = true
              })
            },
            onOpenLink: (url: string) => {
              this.openLink(url)
            }
          })
        } else if (this.currentTab === MainTab.DISCOVER) {
          DiscoverPage()
        } else if (this.currentTab === MainTab.PLAZA) {
          PlazaPage({
            onOpenLink: (url: string) => {
              this.openLink(url)
            },
            onOpenUserShare: (userId: number, username: string) => {
              this.openUserShare(userId, username)
            }
          })
        } else if (this.currentTab === MainTab.WENDA) {
          WendaPage({
            onOpenLink: (url: string) => {
              this.openLink(url)
            },
            onOpenUserShare: (userId: number, username: string) => {
              this.openUserShare(userId, username)
            }
          })
        } else {
          MinePage({
            onOpenLink: (url: string) => {
              this.openLink(url)
            }
          })
        }
      }

      if (this.warning.length > 0 && !this.showSearch && !this.showWeb && !this.showUserShare) {
        Text(this.warning)
          .width('100%')
          .fontSize(12)
          .fontColor(UiTheme.TEXT_WARNING)
          .padding({ left: 12, right: 12, top: 6, bottom: 6 })
          .backgroundColor(UiTheme.BG_WARNING)
      }

      if (!this.showSearch && !this.showWeb && !this.showUserShare) {
        Row() {
          this.tabItem('首页', MainTab.HOME)
          this.tabItem('发现', MainTab.DISCOVER)
          this.tabItem('广场', MainTab.PLAZA)
          this.tabItem('问答', MainTab.WENDA)
          this.tabItem('我的', MainTab.MINE)
        }
        .width('100%')
        .height(56)
        .justifyContent(FlexAlign.SpaceAround)
        .backgroundColor(UiTheme.BG_CARD)
      }
    }
    .width('100%')
    .height('100%')
  }

  private openLink(url: string): void {
    const result = UrlSecurityGuard.check(url)
    if (!result.allow) {
      this.warning = result.reason
      return
    }
    this.warning = result.reason
    this.currentUrl = url
    animateTo({ duration: 180, curve: Curve.EaseInOut }, () => {
      this.showWeb = true
    })
  }

  private openUserShare(userId: number, username: string): void {
    if (userId <= 0) {
      this.warning = '该分享人信息无效'
      return
    }
    this.currentUserId = userId
    this.currentUsername = username || '分享人'
    animateTo({ duration: 180, curve: Curve.EaseInOut }, () => {
      this.showUserShare = true
    })
  }

  private switchTab(tab: MainTab): void {
    animateTo({ duration: 160, curve: Curve.EaseInOut }, () => {
      this.currentTab = tab
    })
  }

  @Builder
  private tabItem(label: string, tab: MainTab) {
    Column({ space: 2 }) {
      Text(this.tabIcon(tab))
        .fontSize(18)
        .fontColor(this.currentTab === tab ? UiTheme.BRAND_PRIMARY : UiTheme.TEXT_SECONDARY)
      Text(label)
        .fontSize(11)
        .fontColor(this.currentTab === tab ? UiTheme.BRAND_PRIMARY : UiTheme.TEXT_SECONDARY)
    }
    .padding({ top: 4, bottom: 4, left: 6, right: 6 })
    .borderRadius(10)
    .backgroundColor(this.currentTab === tab ? UiTheme.BRAND_SOFT : UiTheme.BG_CARD)
    .onClick(() => {
      this.switchTab(tab)
    })
  }

  private tabIcon(tab: MainTab): string {
    if (tab === MainTab.HOME) {
      return '⌂'
    }
    if (tab === MainTab.DISCOVER) {
      return '▦'
    }
    if (tab === MainTab.PLAZA) {
      return '▤'
    }
    if (tab === MainTab.WENDA) {
      return '◍'
    }
    return '◉'
  }

}
