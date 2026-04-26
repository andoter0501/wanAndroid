import { LoadStatus } from '../LoadState'
import { AppText } from '../AppText'
import { StateView } from './StateView'

@Component
export struct PagedListView {
  @Prop status: LoadStatus = LoadStatus.Idle
  @Prop message: string = ''
  @Prop isLoadingMore: boolean = false
  @Prop showLoadMore: boolean = true
  @Prop loadMoreText: string = AppText.LOAD_MORE
  retryAction?: () => void
  loadMoreAction?: () => void
  @BuilderParam content: () => void

  build() {
    StateView({
      status: this.status,
      message: this.message,
      retryAction: this.retryAction
    }) {
      List({ space: 8 }) {
        this.content()
        if (this.status === LoadStatus.Success && this.showLoadMore) {
          ListItem() {
            Button(this.isLoadingMore ? AppText.LOADING : this.loadMoreText)
              .width('100%')
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
    .layoutWeight(1)
  }
}
