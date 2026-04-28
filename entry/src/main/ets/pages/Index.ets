import { AppShellPage } from '../app/AppShellPage'

@Entry
@Component
struct Index {
  build() {
    Column() {
      AppShellPage()
    }
    .width('100%')
    .height('100%')
  }
}
