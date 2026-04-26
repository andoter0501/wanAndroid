import { LocalCacheStore } from './LocalCacheStore'

export interface UserSession {
  username: string
  nickname: string
  userId: number
  coinCount?: number
}

/**
 * 会话状态骨架。
 * 后续可替换为 Preferences/kvStore 持久化实现。
 */
export class SessionStore {
  private static readonly CACHE_KEY = 'user_session'
  private static instance?: SessionStore
  private currentSession: UserSession | null = null

  static shared(): SessionStore {
    if (!SessionStore.instance) {
      SessionStore.instance = new SessionStore()
      SessionStore.instance.restore()
    }
    return SessionStore.instance
  }

  save(session: UserSession): void {
    this.currentSession = session
    LocalCacheStore.shared().setString(SessionStore.CACHE_KEY, JSON.stringify(session))
  }

  clear(): void {
    this.currentSession = null
    LocalCacheStore.shared().setString(SessionStore.CACHE_KEY, '')
  }

  isLogin(): boolean {
    return this.currentSession !== null
  }

  getSession(): UserSession | null {
    return this.currentSession
  }

  private restore(): void {
    const raw = LocalCacheStore.shared().getString(SessionStore.CACHE_KEY)
    if (!raw) {
      this.currentSession = null
      return
    }
    try {
      const parsed = JSON.parse(raw) as UserSession
      if (parsed && typeof parsed.userId === 'number' && parsed.username) {
        this.currentSession = parsed
      } else {
        this.currentSession = null
      }
    } catch (_) {
      this.currentSession = null
    }
  }
}
