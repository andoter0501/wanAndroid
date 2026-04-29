import { LoadStatus } from '../LoadState'
import { AppText } from '../AppText'
import { UiTheme } from '../UiTheme'

@Builder
function DefaultLoading() {
  Column() {
    Column({ space: 10 }) {
      Row().width('100%').height(16).backgroundColor(UiTheme.BG_SUBTLE).borderRadius(6)
      Row().width('84%').height(16).backgroundColor(UiTheme.BG_SUBTLE).borderRadius(6)
      Row().width('70%').height(16).backgroundColor(UiTheme.BG_SUBTLE).borderRadius(6)
    }
    .width('100%')

    Text(AppText.LOADING)
      .fontSize(13)
      .fontColor(UiTheme.TEXT_SECONDARY)
      .margin({ top: 10 })
  }
  .width('100%')
  .padding({ left: 16, right: 16, top: 24, bottom: 24 })
  .justifyContent(FlexAlign.Center)
}

@Builder
function DefaultEmpty(message: string) {
  Column() {
    Text(AppText.EMPTY_TITLE)
      .fontSize(16)
      .fontWeight(FontWeight.Bold)
      .fontColor(UiTheme.TEXT_PRIMARY)
    Text(message || AppText.EMPTY_DESC)
      .fontSize(13)
      .margin({ top: 6 })
      .fontColor(UiTheme.TEXT_SECONDARY)
  }
  .width('100%')
  .padding(20)
  .justifyContent(FlexAlign.Center)
}

@Builder
function DefaultError(message: string, onRetry?: () => void) {
  Column() {
    Text(AppText.ERROR_TITLE)
      .fontSize(16)
      .fontWeight(FontWeight.Bold)
      .fontColor(UiTheme.TEXT_PRIMARY)
    Text(message || AppText.ERROR_DESC)
      .fontSize(13)
      .margin({ top: 6 })
      .fontColor(UiTheme.TEXT_SECONDARY)
    Button(AppText.RETRY)
      .type(ButtonType.Capsule)
      .backgroundColor(UiTheme.BRAND_PRIMARY)
      .fontColor('#FFFFFF')
      .margin({ top: 12 })
      .onClick(() => {
        if (onRetry) {
          onRetry()
        }
      })
  }
  .width('100%')
  .padding(20)
  .justifyContent(FlexAlign.Center)
}

@Component
export struct StateView {
  @Prop status: LoadStatus = LoadStatus.Idle
  @Prop message: string = ''
  retryAction?: () => void
  @BuilderParam content: () => void

  build() {
    Column() {
      if (this.status === LoadStatus.Loading || this.status === LoadStatus.Idle) {
        DefaultLoading()
      } else if (this.status === LoadStatus.Empty) {
        DefaultEmpty(this.message)
      } else if (this.status === LoadStatus.Error) {
        DefaultError(this.message, this.retryAction)
      } else {
        this.content()
      }
    }
    .width('100%')
  }
}
