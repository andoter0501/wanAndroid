import { PageHeader } from '../../common/ui/components/PageHeader'
import { UiTheme } from '../../common/ui/UiTheme'

interface KnowCategory {
  name: string
  tags: string[]
}

@Component
export struct KnowPage {
  private readonly categories: KnowCategory[] = [
    { name: '开发环境', tags: ['Android Studio', 'Gradle', 'Kotlin'] },
    { name: 'UI 框架', tags: ['Jetpack Compose', 'Flutter', 'ArkUI'] },
    { name: '架构设计', tags: ['MVVM', 'Clean Architecture', 'MVI'] },
    { name: '性能优化', tags: ['启动优化', '内存优化', '渲染性能'] }
  ]

  build() {
    Column() {
      PageHeader({ title: '体系' })

      List({ space: 10 }) {
        ForEach(this.categories, (category: KnowCategory) => {
          ListItem() {
            Column({ space: 10 }) {
              Text(category.name)
                .fontSize(17)
                .fontWeight(FontWeight.Bold)
                .fontColor(UiTheme.TEXT_PRIMARY)
                .width('100%')

              Flex({ direction: FlexDirection.Row, wrap: FlexWrap.Wrap }) {
                ForEach(category.tags, (tag: string) => {
                  Text(tag)
                    .fontSize(12)
                    .fontColor(UiTheme.BRAND_PRIMARY)
                    .padding({ left: 10, right: 10, top: 6, bottom: 6 })
                    .borderRadius(999)
                    .backgroundColor(UiTheme.BRAND_SOFT)
                }, (tag: string) => tag)
              }
              .width('100%')
            }
            .width('100%')
            .padding(14)
            .backgroundColor(UiTheme.BG_CARD)
            .borderRadius(UiTheme.RADIUS_MD)
          }
        }, (category: KnowCategory) => category.name)
      }
      .layoutWeight(1)
      .padding({ left: 12, right: 12, top: 10, bottom: 10 })
    }
    .width('100%')
    .height('100%')
    .backgroundColor(UiTheme.BG_PAGE)
  }
}
