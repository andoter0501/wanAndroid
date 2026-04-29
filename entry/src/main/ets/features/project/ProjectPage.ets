import { PageHeader } from '../../common/ui/components/PageHeader'
import { UiTheme } from '../../common/ui/UiTheme'

interface ProjectCardItem {
  title: string
  desc: string
  link: string
}

@Component
export struct ProjectPage {
  onOpenLink?: (url: string) => void
  @State selectedCategory: string = '热门'

  private readonly categories: string[] = ['热门', 'Android', 'Kotlin', 'Flutter', '鸿蒙']
  private readonly projects: ProjectCardItem[] = [
    {
      title: 'Compose 实战：列表性能优化',
      desc: '从重组与状态提升切入，整理真实项目中的卡顿优化路径。',
      link: 'https://www.wanandroid.com/'
    },
    {
      title: 'Flutter 架构升级清单',
      desc: '模块拆分、状态管理与路由治理的完整升级路线。',
      link: 'https://www.wanandroid.com/'
    },
    {
      title: 'HarmonyOS ArkUI 组件实践',
      desc: '总结 ArkUI 页面骨架、状态视图与网络层协作方案。',
      link: 'https://www.wanandroid.com/'
    }
  ]

  build() {
    Column() {
      PageHeader({ title: '项目' })

      Scroll() {
        Row({ space: 8 }) {
          ForEach(this.categories, (item: string) => {
            Button(item)
              .type(ButtonType.Capsule)
              .fontSize(13)
              .backgroundColor(this.selectedCategory === item ? UiTheme.BRAND_PRIMARY : UiTheme.BG_CARD)
              .fontColor(this.selectedCategory === item ? '#FFFFFF' : UiTheme.TEXT_SECONDARY)
              .onClick(() => {
                this.selectedCategory = item
              })
          }, (item: string) => item)
        }
        .padding({ left: 12, right: 12, top: 10, bottom: 10 })
      }
      .scrollable(ScrollDirection.Horizontal)

      List({ space: 10 }) {
        ForEach(this.projects, (project: ProjectCardItem) => {
          ListItem() {
            Column({ space: 8 }) {
              Text(project.title)
                .fontSize(16)
                .fontWeight(FontWeight.Bold)
                .fontColor(UiTheme.TEXT_PRIMARY)
                .maxLines(2)
                .textOverflow({ overflow: TextOverflow.Ellipsis })

              Text(project.desc)
                .fontSize(13)
                .fontColor(UiTheme.TEXT_SECONDARY)
                .maxLines(2)
                .textOverflow({ overflow: TextOverflow.Ellipsis })
            }
            .width('100%')
            .padding(14)
            .backgroundColor(UiTheme.BG_CARD)
            .borderRadius(UiTheme.RADIUS_MD)
            .onClick(() => {
              if (this.onOpenLink) {
                this.onOpenLink(project.link)
              }
            })
          }
        }, (project: ProjectCardItem) => project.title)
      }
      .layoutWeight(1)
      .padding({ left: 12, right: 12, bottom: 10 })
    }
    .width('100%')
    .height('100%')
    .backgroundColor(UiTheme.BG_PAGE)
  }
}
