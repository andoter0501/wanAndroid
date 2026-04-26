/**
 * 轻量本地缓存骨架。
 * 当前为内存实现，后续可替换为 Preferences/kvStore。
 */
export class LocalCacheStore {
  private static instance?: LocalCacheStore
  private stringListMap: Map<string, string[]> = new Map<string, string[]>()
  private stringMap: Map<string, string> = new Map<string, string>()

  static shared(): LocalCacheStore {
    if (!LocalCacheStore.instance) {
      LocalCacheStore.instance = new LocalCacheStore()
    }
    return LocalCacheStore.instance
  }

  getStringList(key: string): string[] {
    return this.stringListMap.get(key) || []
  }

  setStringList(key: string, value: string[]): void {
    this.stringListMap.set(key, value)
  }

  getString(key: string): string {
    return this.stringMap.get(key) || ''
  }

  setString(key: string, value: string): void {
    this.stringMap.set(key, value)
  }
}
