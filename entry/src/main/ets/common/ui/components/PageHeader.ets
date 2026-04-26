@Component
export struct PageHeader {
  @Prop title: string = ''
  @Prop showBack: boolean = false
  @Prop rightText: string = ''
  onBack?: () => void
  onRightClick?: () => void

  build() {
    Row({ space: 8 }) {
      if (this.showBack) {
        Button('返回')
          .type(ButtonType.Capsule)
          .onClick(() => {
            if (this.onBack) {
              this.onBack()
            }
          })
      }

      Text(this.title)
        .fontSize(22)
        .fontWeight(FontWeight.Bold)
        .maxLines(1)
        .textOverflow({ overflow: TextOverflow.Ellipsis })

      Blank()

      if (this.rightText.length > 0) {
        Button(this.rightText)
          .type(ButtonType.Capsule)
          .onClick(() => {
            if (this.onRightClick) {
              this.onRightClick()
            }
          })
      }
    }
    .width('100%')
    .padding({ left: 16, right: 16, top: 14, bottom: 8 })
    .backgroundColor(Color.White)
  }
}
