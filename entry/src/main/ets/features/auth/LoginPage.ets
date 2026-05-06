import { LoadStatus } from '../../common/ui/LoadState'
import { PageHeader } from '../../common/ui/components/PageHeader'
import { UiTheme } from '../../common/ui/UiTheme'
import { AuthViewModel } from './AuthViewModel'

@Component
export struct LoginPage {
  onBack?: () => void
  onSuccess?: () => void

  @State authVm: AuthViewModel = new AuthViewModel()

  build() {
    Column() {
      PageHeader({
        title: this.authVm.registerMode ? '注册' : '登录',
        showBack: true,
        onBack: () => {
          if (this.onBack) {
            this.onBack()
          }
        }
      })

      Column({ space: 12 }) {
        Stack() {
          Text('W')
            .fontSize(42)
            .fontColor('#FFFFFF')
        }
        .width(84)
        .height(84)
        .backgroundColor(UiTheme.BRAND_PRIMARY)
        .borderRadius(22)
        .align(Alignment.Center)
        .margin({ top: 16, bottom: 8 })

        Text(this.authVm.registerMode ? '欢迎加入' : '欢迎回来')
          .fontSize(32)
          .fontWeight(FontWeight.Bold)
          .fontColor(UiTheme.TEXT_PRIMARY)
          .width('100%')
          .textAlign(TextAlign.Center)

        Text(this.authVm.registerMode ? '注册玩Android账号' : '登录玩Android账号')
          .fontSize(12)
          .fontColor(UiTheme.TEXT_SECONDARY)
          .width('100%')
          .textAlign(TextAlign.Center)
          .margin({ bottom: 12 })

        this.inputField('用户名', this.authVm.usernameInput, false, (value: string) => {
          this.authVm.usernameInput = value
          this.authVm = this.authVm
        })

        this.inputField('密码', this.authVm.passwordInput, true, (value: string) => {
          this.authVm.passwordInput = value
          this.authVm = this.authVm
        })

        Button(this.authVm.registerMode ? '注册' : '登录')
          .width('100%')
          .height(52)
          .borderRadius(16)
          .fontSize(18)
          .fontColor('#FFFFFF')
          .backgroundColor(UiTheme.BRAND_PRIMARY)
          .onClick(async () => {
            await this.authVm.loginOrRegister()
            if (this.authVm.authState.status === LoadStatus.Success) {
              await this.authVm.loadUserInfo()
            }
            this.authVm = this.authVm
            if (this.authVm.authState.status === LoadStatus.Success && this.onSuccess) {
              this.onSuccess()
            }
          })

        Row() {
          Text(this.authVm.registerMode ? '返回登录' : '注册账号')
            .fontSize(14)
            .fontColor(UiTheme.BRAND_PRIMARY)
            .onClick(() => {
              this.authVm.registerMode = !this.authVm.registerMode
              this.authVm = this.authVm
            })
          Blank()
          Text('忘记密码')
            .fontSize(14)
            .fontColor(UiTheme.BRAND_PRIMARY)
        }
        .width('100%')

        if (this.authVm.authState.status === LoadStatus.Error) {
          Text(this.authVm.authState.message)
            .width('100%')
            .fontSize(12)
            .fontColor(UiTheme.TEXT_DANGER)
        }
      }
      .padding({ left: 20, right: 20, top: 4 })
    }
    .width('100%')
    .height('100%')
    .backgroundColor(UiTheme.BG_PAGE)
  }

  @Builder
  private inputField(label: string, value: string, isPassword: boolean, onChange: (next: string) => void) {
    Column({ space: 6 }) {
      Text(label)
        .fontSize(15)
        .fontWeight(FontWeight.Medium)
        .fontColor(UiTheme.TEXT_SECONDARY)
        .width('100%')

      TextInput({ placeholder: `请输入${label}`, text: value })
        .type(isPassword ? InputType.Password : InputType.Normal)
        .height(52)
        .borderRadius(16)
        .fontSize(14)
        .padding({ left: 12, right: 12 })
        .backgroundColor(UiTheme.BG_CARD)
        .border({ width: 1, color: '#DCE1E8' })
        .onChange((next: string) => {
          onChange(next)
        })
    }
    .width('100%')
  }
}
