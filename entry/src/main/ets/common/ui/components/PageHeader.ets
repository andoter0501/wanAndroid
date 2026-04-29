import { UiTheme } from '../UiTheme'

@Component
export struct PageHeader {
  @Prop title: string = ''
  @Prop showBack: boolean = false
  @Prop rightText: string = ''
  onBack?: () => void
  onRightClick?: () => void

  build() {
    Column() {
      Row({ space: 10 }) {
        if (this.showBack) {
          Button('返回')
            .type(ButtonType.Capsule)
            .fontSize(12)
            .backgroundColor('#FFFFFF22')
            .fontColor('#FFFFFF')
            .onClick(() => {
              if (this.onBack) {
                this.onBack()
              }
            })
        }

        Text(this.title)
          .fontSize(23)
          .fontWeight(FontWeight.Bold)
          .fontColor('#FFFFFF')
          .maxLines(1)
          .textOverflow({ overflow: TextOverflow.Ellipsis })

        Blank()

        if (this.rightText.length > 0) {
          Button(this.rightText)
            .type(ButtonType.Capsule)
            .fontSize(12)
            .backgroundColor('#FFFFFF22')
            .fontColor('#FFFFFF')
            .onClick(() => {
              if (this.onRightClick) {
                this.onRightClick()
              }
            })
        }
      }
      .width('100%')
      .padding({ left: 16, right: 16, top: 12, bottom: 14 })
    }
    .width('100%')
    .backgroundColor(UiTheme.BRAND_PRIMARY)
  }
}
