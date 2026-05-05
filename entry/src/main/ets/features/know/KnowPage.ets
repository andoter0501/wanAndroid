import { ArticleCard } from '../../common/ui/components/ArticleCard'
import { PagedListView } from '../../common/ui/components/PagedListView'
import { PageHeader } from '../../common/ui/components/PageHeader'
import { StateView } from '../../common/ui/components/StateView'
import { UiTheme } from '../../common/ui/UiTheme'
import { HomeArticleItem } from '../home/HomeRepository'
import { DiscoverViewModel } from '../discover/DiscoverViewModel'
import { TreeNode } from '../discover/DiscoverRepository'

@Component
export struct KnowPage {
  onOpenLink?: (url: string) => void
  @State vm: DiscoverViewModel = new DiscoverViewModel()

  aboutToAppear(): void {
    this.initPage()
  }

  private async initPage(): Promise<void> {
    await this.vm.loadTree()
    this.vm = this.vm
  }

  build() {
    Column() {
      PageHeader({
        title: this.pageTitle(),
        showBack: true,
        onBack: () => {
          this.handleBack()
        }
      })

      if (this.vm.selectedArticleCid > 0) {
        this.articleList()
      } else {
        Column() {
          StateView({
            status: this.vm.treeState.status,
            message: this.vm.treeState.message,
            retryAction: () => this.initPage()
          }) {
            List({ space: 10 }) {
              ForEach(this.vm.treeState.data || [], (item: TreeNode) => {
                ListItem() {
                  this.categoryCard(item)
                }
              }, (item: TreeNode) => item.id.toString())
            }
            .layoutWeight(1)
            .padding({ left: 12, right: 12, top: 12, bottom: 12 })
          }
        }
        .layoutWeight(1)
        .width('100%')
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor(UiTheme.BG_PAGE)
  }

  @Builder
  private categoryCard(item: TreeNode) {
    Column({ space: 8 }) {
      Text(item.name)
        .fontSize(15)
        .fontWeight(FontWeight.Medium)
        .fontColor(UiTheme.TEXT_PRIMARY)
        .width('100%')
        .maxLines(1)
        .textOverflow({ overflow: TextOverflow.Ellipsis })

      Flex({ direction: FlexDirection.Row, wrap: FlexWrap.Wrap }) {
        ForEach(item.children || [], (child: TreeNode) => {
          Text(child.name)
            .fontSize(12)
            .fontColor(UiTheme.BRAND_DEEP)
            .maxLines(1)
            .textOverflow({ overflow: TextOverflow.Ellipsis })
            .padding({ left: 12, right: 12, top: 6, bottom: 6 })
            .margin({ right: 8, bottom: 8 })
            .borderRadius(999)
            .backgroundColor(UiTheme.BRAND_SOFT)
            .onClick(async () => {
              await this.vm.loadArticlesFirstPage(child.id, child.name)
              this.vm = this.vm
            })
        }, (child: TreeNode) => child.id.toString())
      }
      .width('100%')
    }
    .width('100%')
    .padding(11)
    .backgroundColor(UiTheme.BG_CARD)
    .borderRadius(UiTheme.RADIUS_MD)
  }

  @Builder
  private articleList() {
    PagedListView({
      status: this.vm.articleState.status,
      message: this.vm.articleState.message,
      retryAction: () => this.reloadSelectedArticles(),
      showLoadMore: this.vm.canLoadMoreArticle(),
      isLoadingMore: this.vm.isLoadingMoreArticle,
      loadMoreAction: () => this.loadMoreArticles()
    }) {
      ForEach(this.vm.articleState.data || [], (item: HomeArticleItem) => {
        ListItem() {
          ArticleCard({
            article: {
              id: item.id,
              title: item.title,
              author: item.author,
              shareUser: item.shareUser,
              niceDate: item.niceDate
            },
            clickAction: () => {
              if (this.onOpenLink) {
                this.onOpenLink(item.link)
              }
            }
          })
        }
      }, (item: HomeArticleItem) => item.id.toString())
    }
  }

  private async reloadSelectedArticles(): Promise<void> {
    if (this.vm.selectedArticleCid <= 0) {
      return
    }
    await this.vm.loadArticlesFirstPage(this.vm.selectedArticleCid, this.vm.selectedArticleTitle)
    this.vm = this.vm
  }

  private async loadMoreArticles(): Promise<void> {
    await this.vm.loadMoreArticles()
    this.vm = this.vm
  }

  private handleBack(): void {
    if (this.vm.selectedArticleCid > 0) {
      this.vm.clearSelectedArticleCategory()
      this.vm = this.vm
    }
  }

  private pageTitle(): string {
    if (this.vm.selectedArticleCid > 0 && this.vm.selectedArticleTitle.length > 0) {
      return this.vm.selectedArticleTitle
    }
    return '体系'
  }
}
