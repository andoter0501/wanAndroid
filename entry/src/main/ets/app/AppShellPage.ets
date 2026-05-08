import { HomePage } from '../features/home/HomePage'
import { LoginPage } from '../features/auth/LoginPage'
import { CollectPage } from '../features/collect/CollectPage'
import { MinePage } from '../features/mine/MinePage'
import { PlazaPage } from '../features/plaza/PlazaPage'
import { KnowPage } from '../features/know/KnowPage'
import { ProjectPage } from '../features/project/ProjectPage'
import { SearchPage } from '../features/search/SearchPage'
import { SettingsPage } from '../features/settings/SettingsPage'
import { UserSharePage } from '../features/user/UserSharePage'
import { WebDetailPage } from '../features/web/WebDetailPage'
import { UrlSecurityGuard } from '../common/web/UrlSecurityGuard'
import { FavoriteService } from '../common/favorite/FavoriteService'
import { SessionEventBus, SessionEventType } from '../common/session/SessionEventBus'
import { UiTheme } from '../common/ui/UiTheme'

enum MainTab {
  HOME = 0,
  KNOW = 1,
  PROJECT = 2,
  PLAZA = 3,
  MINE = 4
}

@Component
export struct AppShellPage {
  @State currentTab: MainTab = MainTab.HOME
  @State showSearch: boolean = false
  @State showWeb: boolean = false
  @State showUserShare: boolean = false
  @State showLogin: boolean = false
  @State showCollect: boolean = false
  @State showSettings: boolean = false
  @State loginReturnToMine: boolean = false
  @State homeVisited: boolean = true
  @State knowVisited: boolean = false
  @State projectVisited: boolean = false
  @State plazaVisited: boolean = false
  @State mineVisited: boolean = false
  @State currentUrl: string = ''
  @State currentUserId: number = 0
  @State currentUsername: string = ''
  @State toastMessage: string = ''
  private toastTimerId: number = -1
  private readonly sessionListener = (event: SessionEventType, message: string): void => {
    if (event === SessionEventType.EXPIRED) {
      this.showSearch = false
      this.showWeb = false
      this.showUserShare = false
      this.showLogin = false
      this.showCollect = false
      this.showSettings = false
      this.loginReturnToMine = false
      FavoriteService.shared().clear()
      this.markTabVisited(MainTab.MINE)
      this.currentTab = MainTab.MINE
      this.showToast(message || '登录已失效，请重新登录')
    }
  }

  aboutToAppear(): void {
    SessionEventBus.subscribe(this.sessionListener)
  }

  aboutToDisappear(): void {
    SessionEventBus.unsubscribe(this.sessionListener)
    this.clearToastTimer()
  }

  build() {
    Stack({ alignContent: Alignment.Center }) {
      Column() {
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
              },
              onToast: (message: string) => {
                this.showToast(message)
              },
              onRequireLogin: () => {
                this.openLogin(false)
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
              },
              onToast: (message: string) => {
                this.showToast(message)
              },
              onRequireLogin: () => {
                this.openLogin(false)
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
          } else if (this.showLogin) {
            LoginPage({
              onBack: () => {
                animateTo({ duration: 160, curve: Curve.EaseInOut }, () => {
                  this.showLogin = false
                  this.loginReturnToMine = false
                })
              },
              onSuccess: () => {
                animateTo({ duration: 160, curve: Curve.EaseInOut }, () => {
                  this.showLogin = false
                  if (this.loginReturnToMine) {
                    this.markTabVisited(MainTab.MINE)
                    this.currentTab = MainTab.MINE
                  }
                  this.loginReturnToMine = false
                })
              },
              onOpenPasswordRecovery: (url: string) => {
                this.openLink(url)
              }
            })
          } else if (this.showCollect) {
            CollectPage({
              onBack: () => {
                animateTo({ duration: 160, curve: Curve.EaseInOut }, () => {
                  this.showCollect = false
                })
              },
              onOpenLink: (url: string) => {
                this.openLink(url)
              },
              onToast: (message: string) => {
                this.showToast(message)
              }
            })
          } else if (this.showSettings) {
            SettingsPage({
              onBack: () => {
                animateTo({ duration: 160, curve: Curve.EaseInOut }, () => {
                  this.showSettings = false
                })
              },
              onOpenLink: (url: string) => {
                this.openLink(url)
              },
              onToast: (message: string) => {
                this.showToast(message)
              }
            })
          } else {
            this.mainTabs()
          }
        }
        .layoutWeight(1)
        .width('100%')

        if (!this.showSearch && !this.showWeb && !this.showUserShare && !this.showLogin && !this.showCollect && !this.showSettings) {
          Row() {
            this.tabItem('首页', MainTab.HOME)
            this.tabItem('体系', MainTab.KNOW)
            this.tabItem('项目', MainTab.PROJECT)
            this.tabItem('广场', MainTab.PLAZA)
            this.tabItem('我的', MainTab.MINE)
          }
          .width('100%')
          .height(58)
          .justifyContent(FlexAlign.SpaceAround)
          .border({ width: { top: 1 }, color: '#E5E6EB' })
          .backgroundColor(UiTheme.BG_CARD)
        }
      }
      .width('100%')
      .height('100%')

      if (this.toastMessage.length > 0) {
        Row() {
          Text(this.toastMessage)
            .fontSize(14)
            .fontColor('#FFFFFF')
            .maxLines(2)
            .textAlign(TextAlign.Center)
            .padding({ left: 18, right: 18, top: 10, bottom: 10 })
            .backgroundColor('#000000CC')
            .borderRadius(22)
        }
        .width('100%')
        .justifyContent(FlexAlign.Center)
        .padding({ left: 24, right: 24 })
      }
    }
    .width('100%')
    .height('100%')
  }

  private openLink(url: string): void {
    const result = UrlSecurityGuard.check(url)
    if (!result.allow) {
      this.showToast(result.reason)
      return
    }
    this.currentUrl = url
    animateTo({ duration: 180, curve: Curve.EaseInOut }, () => {
      this.showWeb = true
    })
  }

  private openUserShare(userId: number, username: string): void {
    if (userId <= 0) {
      this.showToast('该分享人信息无效')
      return
    }
    this.currentUserId = userId
    this.currentUsername = username || '分享人'
    animateTo({ duration: 180, curve: Curve.EaseInOut }, () => {
      this.showUserShare = true
    })
  }

  private switchTab(tab: MainTab): void {
    this.markTabVisited(tab)
    animateTo({ duration: 160, curve: Curve.EaseInOut }, () => {
      this.currentTab = tab
    })
  }

  private markTabVisited(tab: MainTab): void {
    if (tab === MainTab.HOME) {
      this.homeVisited = true
    } else if (tab === MainTab.KNOW) {
      this.knowVisited = true
    } else if (tab === MainTab.PROJECT) {
      this.projectVisited = true
    } else if (tab === MainTab.PLAZA) {
      this.plazaVisited = true
    } else if (tab === MainTab.MINE) {
      this.mineVisited = true
    }
  }

  @Builder
  private mainTabs() {
    Stack() {
      if (this.homeVisited) {
        HomePage({
          onOpenSearch: () => {
            animateTo({ duration: 160, curve: Curve.EaseInOut }, () => {
              this.showSearch = true
            })
          },
          onOpenLink: (url: string) => {
            this.openLink(url)
          },
          onQuickNavigate: (target: string) => {
            if (target === 'plaza') {
              this.switchTab(MainTab.PLAZA)
            } else if (target === 'know') {
              this.switchTab(MainTab.KNOW)
            } else if (target === 'project') {
              this.switchTab(MainTab.PROJECT)
            }
          },
          onRequireLogin: () => {
            this.openLogin(false)
          }
        })
          .visibility(this.currentTab === MainTab.HOME ? Visibility.Visible : Visibility.Hidden)
      }

      if (this.knowVisited) {
        KnowPage({
          onOpenLink: (url: string) => {
            this.openLink(url)
          }
        })
          .visibility(this.currentTab === MainTab.KNOW ? Visibility.Visible : Visibility.Hidden)
      }

      if (this.projectVisited) {
        ProjectPage({
          onOpenLink: (url: string) => {
            this.openLink(url)
          }
        })
          .visibility(this.currentTab === MainTab.PROJECT ? Visibility.Visible : Visibility.Hidden)
      }

      if (this.plazaVisited) {
        PlazaPage({
          onOpenLink: (url: string) => {
            this.openLink(url)
          },
          onOpenUserShare: (userId: number, username: string) => {
            this.openUserShare(userId, username)
          },
          onToast: (message: string) => {
            this.showToast(message)
          },
          onRequireLogin: () => {
            this.openLogin(false)
          }
        })
          .visibility(this.currentTab === MainTab.PLAZA ? Visibility.Visible : Visibility.Hidden)
      }

      if (this.mineVisited) {
        MinePage({
          onOpenLink: (url: string) => {
            this.openLink(url)
          },
          onOpenCollect: () => {
            animateTo({ duration: 160, curve: Curve.EaseInOut }, () => {
              this.showCollect = true
            })
          },
          onOpenSettings: () => {
            animateTo({ duration: 160, curve: Curve.EaseInOut }, () => {
              this.showSettings = true
            })
          },
          onRequireLogin: () => {
            this.openLogin(true)
          }
        })
          .visibility(this.currentTab === MainTab.MINE ? Visibility.Visible : Visibility.Hidden)
      }
    }
    .width('100%')
    .height('100%')
  }

  private openLogin(returnToMine: boolean): void {
    this.loginReturnToMine = returnToMine
    animateTo({ duration: 160, curve: Curve.EaseInOut }, () => {
      this.showLogin = true
    })
  }

  private showToast(message: string): void {
    if (message.length === 0) {
      return
    }
    this.toastMessage = message
    this.clearToastTimer()
    this.toastTimerId = setTimeout(() => {
      this.toastMessage = ''
      this.toastTimerId = -1
    }, 2000)
  }

  private clearToastTimer(): void {
    if (this.toastTimerId >= 0) {
      clearTimeout(this.toastTimerId)
      this.toastTimerId = -1
    }
  }

  @Builder
  private tabItem(label: string, tab: MainTab) {
    Column({ space: 3 }) {
      Text(this.tabIcon(tab))
        .width(24)
        .height(20)
        .textAlign(TextAlign.Center)
        .fontSize(16)
        .fontColor(this.currentTab === tab ? UiTheme.BRAND_PRIMARY : UiTheme.TEXT_SECONDARY)
      Text(label)
        .height(14)
        .textAlign(TextAlign.Center)
        .fontSize(11)
        .fontColor(this.currentTab === tab ? UiTheme.BRAND_PRIMARY : UiTheme.TEXT_SECONDARY)
    }
    .width(56)
    .height(50)
    .justifyContent(FlexAlign.Center)
    .alignItems(HorizontalAlign.Center)
    .onClick(() => {
      this.switchTab(tab)
    })
  }

  private tabIcon(tab: MainTab): string {
    if (tab === MainTab.HOME) {
      return '◆'
    }
    if (tab === MainTab.KNOW) {
      return '▦'
    }
    if (tab === MainTab.PROJECT) {
      return '▤'
    }
    if (tab === MainTab.PLAZA) {
      return '◍'
    }
    return '◉'
  }

}
