import { PageHeader } from '../../common/ui/components/PageHeader'
import { UrlSecurityGuard } from '../../common/web/UrlSecurityGuard'
import { webview } from '@kit.ArkWeb'

@Component
export struct WebDetailPage {
  @Prop url: string
  onBack?: () => void

  @State tip: string = ''
  @State block: boolean = false
  @State safeUrl: string = ''
  private controller: webview.WebviewController = new webview.WebviewController()

  aboutToAppear(): void {
    const result = UrlSecurityGuard.check(this.url)
    this.block = !result.allow
    this.tip = result.reason
    this.safeUrl = result.allow ? this.url : ''
  }

  build() {
    Column() {
      PageHeader({
        title: '网页详情',
        showBack: true,
        onBack: () => {
          if (this.onBack) {
            this.onBack()
          }
        }
      })

      if (this.tip.length > 0) {
        Text(this.tip)
          .fontSize(12)
          .fontColor(this.block ? '#C0392B' : '#C97A00')
          .width('100%')
          .padding({ left: 12, right: 12, top: 8, bottom: 8 })
          .backgroundColor('#FFF6E5')
      }

      if (this.block) {
        Column() {
          Text('链接已被安全策略拦截')
            .fontSize(16)
            .fontWeight(FontWeight.Medium)
          Text(this.url)
            .fontSize(12)
            .margin({ top: 8 })
            .fontColor('#666666')
            .maxLines(2)
            .textOverflow({ overflow: TextOverflow.Ellipsis })
        }
        .layoutWeight(1)
        .width('100%')
        .justifyContent(FlexAlign.Center)
        .padding(20)
      } else {
        Web({
          src: this.safeUrl,
          controller: this.controller
        })
          .layoutWeight(1)
          .width('100%')
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F6F8')
  }
}
