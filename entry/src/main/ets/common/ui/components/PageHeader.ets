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
      Row() {
        if (this.showBack) {
          Text('‹')
            .fontSize(24)
            .fontColor('#FFFFFF')
            .onClick(() => {
              if (this.onBack) {
                this.onBack()
              }
            })
        } else {
          Text(' ')
            .fontSize(24)
            .fontColor('#FFFFFF')
        }

        Blank()

        Text(this.title)
          .fontSize(18)
          .fontWeight(FontWeight.Bold)
          .fontColor('#FFFFFF')
          .maxLines(1)
          .textOverflow({ overflow: TextOverflow.Ellipsis })

        Blank()

        if (this.rightText.length > 0) {
          Text(this.rightText)
            .fontSize(14)
            .fontColor('#FFFFFF')
            .onClick(() => {
              if (this.onRightClick) {
                this.onRightClick()
              }
            })
        } else {
          Text(' ')
            .fontSize(14)
            .fontColor('#FFFFFF')
        }
      }
      .width('100%')
      .height(56)
      .padding({ left: 16, right: 16 })
      .linearGradient({
        angle: 180,
        colors: [[UiTheme.BRAND_PRIMARY, 0], [UiTheme.BRAND_DEEP, 1]]
      })

      Row() {}
      .width('100%')
      .height(10)
      .backgroundColor('#EEF1F5')
    }
    .width('100%')
  }
}
