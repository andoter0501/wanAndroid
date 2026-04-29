import { UiTheme } from '../UiTheme'

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
    Row({ space: 10 }) {
      Column({ space: 8 }) {
        Text(this.article.title)
          .fontSize(17)
          .fontWeight(FontWeight.Bold)
          .fontColor(UiTheme.TEXT_PRIMARY)
          .maxLines(2)
          .textOverflow({ overflow: TextOverflow.Ellipsis })

        Column({ space: 4 }) {
          Text(this.article.author || this.article.shareUser || '匿名')
            .fontSize(12)
            .fontColor(UiTheme.TEXT_SECONDARY)
          Text(this.article.niceDate || '')
            .fontSize(12)
            .fontColor(UiTheme.TEXT_TERTIARY)
        }
        .width('100%')
        .alignItems(HorizontalAlign.Start)
      }
      .layoutWeight(1)
      .alignItems(HorizontalAlign.Start)
      .onClick(() => {
        if (this.clickAction) {
          this.clickAction()
        }
      })

      if (this.showCollectAction) {
        Button(this.collected ? '取消收藏' : '收藏')
          .type(ButtonType.Capsule)
          .fontSize(12)
          .backgroundColor(this.collected ? '#EAF7F4' : UiTheme.BRAND_SOFT)
          .fontColor(this.collected ? UiTheme.BRAND_ACCENT : UiTheme.BRAND_PRIMARY)
          .onClick(() => {
            if (this.toggleCollectAction) {
              this.toggleCollectAction()
            }
          })
      }
    }
    .width('100%')
    .alignItems(VerticalAlign.Bottom)
    .padding(UiTheme.SPACE_MD)
    .backgroundColor(UiTheme.BG_CARD)
    .borderRadius(UiTheme.RADIUS_MD)
  }
}
