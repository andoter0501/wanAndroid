import { UiState } from '../../common/ui/LoadState'
import { parseErrorMessage } from '../../common/network/ErrorMessage'
import { SessionStore, UserSession } from '../../common/storage/SessionStore'
import { AuthRepository, UserInfoData } from './AuthRepository'

export class AuthViewModel {
  private readonly repository: AuthRepository

  authState: UiState<UserSession> = UiState.empty<UserSession>('未登录')
  userInfoState: UiState<UserInfoData> = UiState.empty<UserInfoData>('未获取用户信息')

  usernameInput: string = ''
  passwordInput: string = ''
  registerMode: boolean = false

  constructor(repository: AuthRepository = new AuthRepository()) {
    this.repository = repository
  }

  restoreSession(): void {
    const session = SessionStore.shared().getSession()
    if (session) {
      this.authState = UiState.success(session)
    } else {
      this.authState = UiState.empty<UserSession>('未登录')
    }
  }

  async loginOrRegister(): Promise<void> {
    const username = this.usernameInput.trim()
    const password = this.passwordInput.trim()
    if (!username || !password) {
      this.authState = UiState.error<UserSession>('请输入账号和密码')
      return
    }

    this.authState = UiState.loading<UserSession>()
    try {
      const data = this.registerMode
        ? await this.repository.register(username, password, password)
        : await this.repository.login(username, password)
      const session: UserSession = {
        username: data.username,
        nickname: data.nickname || data.username,
        userId: data.id,
        coinCount: data.coinCount
      }
      SessionStore.shared().save(session)
      this.authState = UiState.success(session)
    } catch (error) {
      this.authState = UiState.error<UserSession>(parseErrorMessage(error))
    }
  }

  async loadUserInfo(): Promise<void> {
    this.userInfoState = UiState.loading<UserInfoData>()
    try {
      const data = await this.repository.fetchUserInfo()
      this.userInfoState = UiState.success(data)
      const session = SessionStore.shared().getSession()
      if (session) {
        SessionStore.shared().save({
          ...session,
          nickname: data.userInfo.nickname || session.nickname,
          coinCount: data.coinInfo.coinCount
        })
        this.authState = UiState.success(SessionStore.shared().getSession() as UserSession)
      }
    } catch (error) {
      this.userInfoState = UiState.error<UserInfoData>(parseErrorMessage(error))
    }
  }

  async logout(): Promise<void> {
    try {
      await this.repository.logout()
    } catch (_) {
      // 登出失败也清理本地态，避免脏会话
    } finally {
      SessionStore.shared().clear()
      this.userInfoState = UiState.empty<UserInfoData>('未获取用户信息')
      this.authState = UiState.empty<UserSession>('未登录')
    }
  }

}
