import { LoadStatus } from '../../common/ui/LoadState'
import { WanAndroidApi } from '../../common/network/WanAndroidApi'
import { PageHeader } from '../../common/ui/components/PageHeader'
import { UiTheme } from '../../common/ui/UiTheme'
import { AuthViewModel } from './AuthViewModel'

@Component
export struct LoginPage {
  onBack?: () => void
  onSuccess?: () => void
  onOpenPasswordRecovery?: (url: string) => void

  @State authVm: AuthViewModel = new AuthViewModel()
  @State showPasswordHelp: boolean = false

  build() {
    Stack() {
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
            if (!this.authVm.registerMode) {
              Text('忘记密码')
                .fontSize(14)
                .fontColor(UiTheme.BRAND_PRIMARY)
                .onClick(() => {
                  this.showPasswordHelp = true
                })
            }
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

      if (this.showPasswordHelp) {
        this.passwordHelpDialog()
      }
    }
    .width('100%')
    .height('100%')
  }

  @Builder
  private passwordHelpDialog() {
    Column() {
      Blank()
      Column({ space: 14 }) {
        Text('找回密码')
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
          .fontColor(UiTheme.TEXT_PRIMARY)
          .width('100%')
          .textAlign(TextAlign.Center)

        Text('WanAndroid 当前没有开放密码找回接口，App 内无法直接重置密码。你可以向官方反馈账号问题，或重新注册一个账号。')
          .fontSize(14)
          .fontColor(UiTheme.TEXT_SECONDARY)
          .lineHeight(22)
          .width('100%')

        Button('反馈给官方')
          .width('100%')
          .height(44)
          .borderRadius(14)
          .fontSize(16)
          .fontColor('#FFFFFF')
          .backgroundColor(UiTheme.BRAND_PRIMARY)
          .onClick(() => {
            this.showPasswordHelp = false
            if (this.onOpenPasswordRecovery) {
              this.onOpenPasswordRecovery(WanAndroidApi.officialIssuesPage())
            }
          })

        Button('注册新账号')
          .width('100%')
          .height(44)
          .borderRadius(14)
          .fontSize(16)
          .fontColor(UiTheme.BRAND_PRIMARY)
          .backgroundColor('#EEF5FF')
          .onClick(() => {
            this.showPasswordHelp = false
            this.authVm.registerMode = true
            this.authVm = this.authVm
          })

        Text('知道了')
          .fontSize(14)
          .fontColor(UiTheme.TEXT_SECONDARY)
          .height(32)
          .width('100%')
          .textAlign(TextAlign.Center)
          .onClick(() => {
            this.showPasswordHelp = false
          })
      }
      .width('86%')
      .padding({ left: 20, right: 20, top: 22, bottom: 18 })
      .backgroundColor(UiTheme.BG_CARD)
      .borderRadius(20)

      Blank()
    }
    .width('100%')
    .height('100%')
    .padding({ left: 20, right: 20 })
    .backgroundColor('#00000066')
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
