/**
 * 轻量本地缓存。
 * 使用 AppStorage + PersistentStorage 保存简单字符串，保证应用重启后可恢复。
 */
export class LocalCacheStore {
  private static instance?: LocalCacheStore
  private stringListMap: Map<string, string[]> = new Map<string, string[]>()
  private stringMap: Map<string, string> = new Map<string, string>()
  private persistedKeys: Set<string> = new Set<string>()

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

  clearStringLists(): void {
    this.stringListMap.clear()
  }

  getString(key: string): string {
    const cached = this.stringMap.get(key)
    if (cached !== undefined) {
      return cached
    }
    this.ensurePersisted(key)
    const stored = AppStorage.Get<string>(key)
    const value = stored || ''
    this.stringMap.set(key, value)
    return value
  }

  setString(key: string, value: string): void {
    this.ensurePersisted(key)
    this.stringMap.set(key, value)
    AppStorage.SetOrCreate<string>(key, value)
  }

  private ensurePersisted(key: string): void {
    if (this.persistedKeys.has(key)) {
      return
    }
    PersistentStorage.PersistProp<string>(key, '')
    this.persistedKeys.add(key)
  }
}
