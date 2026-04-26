export enum SessionEventType {
  EXPIRED = 'EXPIRED'
}

export type SessionListener = (event: SessionEventType, message: string) => void

export class SessionEventBus {
  private static listeners: SessionListener[] = []

  static subscribe(listener: SessionListener): void {
    SessionEventBus.listeners.push(listener)
  }

  static unsubscribe(listener: SessionListener): void {
    SessionEventBus.listeners = SessionEventBus.listeners.filter((item) => item !== listener)
  }

  static emitExpired(message: string = '登录已失效，请重新登录'): void {
    SessionEventBus.listeners.forEach((listener) => {
      listener(SessionEventType.EXPIRED, message)
    })
  }
}
