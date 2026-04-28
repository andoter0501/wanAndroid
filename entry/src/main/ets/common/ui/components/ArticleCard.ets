export interface ArticleCardData {
  id: number
  title: string
  author?: string
  shareUser?: string
  niceDate?: string
}

@Component
export struct ArticleCard {
  @Prop article: ArticleCardData
  @Prop collected: boolean = false
  @Prop showCollectAction: boolean = false
  clickAction?: () => void
  toggleCollectAction?: () => void

  build() {
    Column() {
      Text(this.article.title)
        .fontSize(16)
        .fontWeight(FontWeight.Medium)
        .maxLines(2)
        .textOverflow({ overflow: TextOverflow.Ellipsis })

      Row() {
        Text(this.article.author || this.article.shareUser || '匿名')
          .fontSize(12)
          .fontColor('#666666')
        Blank()
        Text(this.article.niceDate || '')
          .fontSize(12)
          .fontColor('#999999')
      }
      .width('100%')
      .margin({ top: 10 })

      if (this.showCollectAction) {
        Row() {
          Blank()
          Button(this.collected ? '取消收藏' : '收藏')
            .type(ButtonType.Capsule)
              .onClick(() => {
              if (this.toggleCollectAction) {
                this.toggleCollectAction()
              }
            })
        }
        .width('100%')
        .margin({ top: 10 })
      }
    }
    .width('100%')
    .padding(14)
    .backgroundColor(Color.White)
    .borderRadius(10)
    .onClick(() => {
      if (this.clickAction) {
        this.clickAction()
      }
    })
  }
}
