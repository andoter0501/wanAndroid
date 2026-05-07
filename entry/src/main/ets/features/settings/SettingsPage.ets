import { FavoriteService } from '../../common/favorite/FavoriteService'
import { LocalCacheStore } from '../../common/storage/LocalCacheStore'
import { UiTheme } from '../../common/ui/UiTheme'

@Component
export struct SettingsPage {
  onBack?: () => void
  onOpenLink?: (url: string) => void
  onToast?: (message: string) => void

  build() {
    Column() {
      this.compactHeader()

      List({ space: 12 }) {
        ListItem() {
          this.localDataSection()
        }
        ListItem() {
          this.aboutSection()
        }
        ListItem() {
          this.sourceSection()
        }
        ListItem() {
          this.privacySection()
        }
        ListItem() {
          this.contactSection()
        }
      }
      .layoutWeight(1)
      .width('100%')
      .padding({ left: 12, right: 12, top: 0, bottom: 18 })
      .scrollBar(BarState.Off)
    }
    .width('100%')
    .height('100%')
    .backgroundColor(UiTheme.BG_PAGE)
  }

  @Builder
  private compactHeader() {
    Row() {
      Text('‹')
        .fontSize(24)
        .fontColor('#FFFFFF')
        .onClick(() => {
          if (this.onBack) {
            this.onBack()
          }
        })

      Blank()

      Text('系统设置')
        .fontSize(18)
        .fontWeight(FontWeight.Bold)
        .fontColor('#FFFFFF')
        .maxLines(1)
        .textOverflow({ overflow: TextOverflow.Ellipsis })

      Blank()

      Text(' ')
        .fontSize(14)
        .fontColor('#FFFFFF')
    }
    .width('100%')
    .height(56)
    .padding({ left: 16, right: 16 })
    .linearGradient({
      angle: 180,
      colors: [[UiTheme.BRAND_PRIMARY, 0], [UiTheme.BRAND_DEEP, 1]]
    })
  }

  @Builder
  private localDataSection() {
    Column({ space: 0 }) {
      this.sectionTitle('本地数据')
      this.actionRow('清除本地缓存', '清除搜索历史和本地收藏状态', () => {
        this.clearLocalCache()
      })
    }
    .width('100%')
    .backgroundColor(UiTheme.BG_CARD)
    .borderRadius(UiTheme.RADIUS_MD)
    .clip(true)
  }

  @Builder
  private aboutSection() {
    Column({ space: 0 }) {
      this.sectionTitle('关于')
      this.infoRow('应用名称', '玩Android')
      this.infoRow('数据来源', 'wanandroid.com')
      this.infoRow('应用说明', '基于玩Android开放 API 的 HarmonyOS 客户端')
    }
    .width('100%')
    .backgroundColor(UiTheme.BG_CARD)
    .borderRadius(UiTheme.RADIUS_MD)
    .clip(true)
  }

  @Builder
  private sourceSection() {
    Column({ space: 0 }) {
      this.sectionTitle('源代码')
      this.linkRow('GitHub', 'https://github.com/andoter0501/wanAndroid')
    }
    .width('100%')
    .backgroundColor(UiTheme.BG_CARD)
    .borderRadius(UiTheme.RADIUS_MD)
    .clip(true)
  }

  @Builder
  private privacySection() {
    Column({ space: 0 }) {
      this.sectionTitle('隐私协议')
      this.linkRow('隐私协议', 'https://agreement-drcn.hispace.dbankcloud.cn/index.html?lang=zh&agreementId=1944829454714933888')
    }
    .width('100%')
    .backgroundColor(UiTheme.BG_CARD)
    .borderRadius(UiTheme.RADIUS_MD)
    .clip(true)
  }

  @Builder
  private contactSection() {
    Column({ space: 0 }) {
      this.sectionTitle('个人联系方式')
      this.infoRow('微信', 'rich92me')
    }
    .width('100%')
    .backgroundColor(UiTheme.BG_CARD)
    .borderRadius(UiTheme.RADIUS_MD)
    .clip(true)
  }

  @Builder
  private sectionTitle(title: string) {
    Text(title)
      .width('100%')
      .fontSize(13)
      .fontWeight(FontWeight.Medium)
      .fontColor(UiTheme.TEXT_SECONDARY)
      .padding({ left: 12, right: 12, top: 12, bottom: 6 })
  }

  @Builder
  private actionRow(title: string, desc: string, clickAction: () => void) {
    Row({ space: 10 }) {
      Column({ space: 4 }) {
        Text(title)
          .width('100%')
          .fontSize(15)
          .fontWeight(FontWeight.Medium)
          .fontColor(UiTheme.TEXT_PRIMARY)
        Text(desc)
          .width('100%')
          .fontSize(11)
          .fontColor(UiTheme.TEXT_SECONDARY)
          .maxLines(1)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
      }
      .layoutWeight(1)
      .alignItems(HorizontalAlign.Start)

      Text('清除')
        .fontSize(13)
        .fontColor(UiTheme.BRAND_PRIMARY)
        .padding({ left: 12, right: 12, top: 5, bottom: 5 })
        .backgroundColor(UiTheme.BRAND_SOFT)
        .borderRadius(999)
    }
    .width('100%')
    .padding({ left: 12, right: 12, top: 12, bottom: 12 })
    .border({ width: { top: 1 }, color: '#E5E6EB' })
    .onClick(() => {
      clickAction()
    })
  }

  @Builder
  private infoRow(label: string, value: string) {
    Row({ space: 12 }) {
      Text(label)
        .fontSize(14)
        .fontColor(UiTheme.TEXT_SECONDARY)
      Text(value)
        .layoutWeight(1)
        .fontSize(14)
        .fontColor(UiTheme.TEXT_PRIMARY)
        .textAlign(TextAlign.End)
        .maxLines(2)
        .textOverflow({ overflow: TextOverflow.Ellipsis })
    }
    .width('100%')
    .padding({ left: 12, right: 12, top: 12, bottom: 12 })
    .border({ width: { top: 1 }, color: '#E5E6EB' })
  }

  @Builder
  private linkRow(label: string, url: string) {
    Row({ space: 12 }) {
      Text(label)
        .fontSize(14)
        .fontColor(UiTheme.TEXT_SECONDARY)
      Text(url)
        .layoutWeight(1)
        .fontSize(13)
        .fontColor(UiTheme.BRAND_DEEP)
        .textAlign(TextAlign.End)
        .maxLines(1)
        .textOverflow({ overflow: TextOverflow.Ellipsis })
      Text('›')
        .fontSize(18)
        .fontColor(UiTheme.TEXT_TERTIARY)
    }
    .width('100%')
    .padding({ left: 12, right: 12, top: 12, bottom: 12 })
    .border({ width: { top: 1 }, color: '#E5E6EB' })
    .onClick(() => {
      if (this.onOpenLink) {
        this.onOpenLink(url)
      }
    })
  }

  private clearLocalCache(): void {
    LocalCacheStore.shared().clearStringLists()
    FavoriteService.shared().clear()
    if (this.onToast) {
      this.onToast('本地缓存已清除')
    }
  }
}
