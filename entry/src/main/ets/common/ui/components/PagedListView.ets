import { LoadStatus } from '../LoadState'
import { AppText } from '../AppText'
import { StateView } from './StateView'
import { UiTheme } from '../UiTheme'

@Component
export struct PagedListView {
  @Prop status: LoadStatus = LoadStatus.Idle
  @Prop message: string = ''
  @Prop isLoadingMore: boolean = false
  @Prop showLoadMore: boolean = true
  @Prop loadMoreText: string = AppText.LOAD_MORE
  @State refreshing: boolean = false
  retryAction?: () => void
  refreshAction?: () => Promise<void>
  loadMoreAction?: () => void
  @BuilderParam content: () => void

  build() {
    Column() {
      Refresh({ refreshing: $$this.refreshing, offset: 64 }) {
        StateView({
          status: this.status,
          message: this.message,
          retryAction: this.retryAction
        }) {
          List({ space: 10 }) {
            this.content()
            if (this.status === LoadStatus.Success && this.showLoadMore) {
              ListItem() {
                Button(this.isLoadingMore ? AppText.LOADING : this.loadMoreText)
                  .width('100%')
                  .enabled(!this.isLoadingMore)
                  .type(ButtonType.Capsule)
                  .backgroundColor(UiTheme.BRAND_PRIMARY)
                  .fontColor('#FFFFFF')
                  .onClick(() => {
                    if (this.loadMoreAction) {
                      this.loadMoreAction()
                    }
                  })
              }
            }
          }
          .padding({ left: 12, right: 12, bottom: 12 })
        }
      }
      .onRefreshing(() => {
        this.runRefresh()
      })
    }
    .layoutWeight(1)
  }

  private async runRefresh(): Promise<void> {
    if (!this.refreshAction) {
      this.refreshing = false
      return
    }
    try {
      await this.refreshAction()
    } finally {
      this.refreshing = false
    }
  }
}
