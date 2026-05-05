import { CollectRepository } from '../../features/collect/CollectRepository'

type FavoriteListener = () => void

/**
 * 全局收藏状态中心：
 * 1. 管理文章收藏状态缓存
 * 2. 提供收藏/取消收藏统一入口
 * 3. 支持跨页面状态同步
 */
export class FavoriteService {
  private static instance?: FavoriteService
  private readonly repository: CollectRepository = new CollectRepository()
  private readonly cache: Map<number, boolean> = new Map<number, boolean>()
  private listeners: FavoriteListener[] = []

  static shared(): FavoriteService {
    if (!FavoriteService.instance) {
      FavoriteService.instance = new FavoriteService()
    }
    return FavoriteService.instance
  }

  subscribe(listener: FavoriteListener): void {
    this.listeners.push(listener)
  }

  unsubscribe(listener: FavoriteListener): void {
    this.listeners = this.listeners.filter((item) => item !== listener)
  }

  isCollected(articleId: number): boolean {
    return this.cache.get(articleId) === true
  }

  mark(articleId: number, collected: boolean): void {
    this.cache.set(articleId, collected)
    this.emit()
  }

  markBatch(articleIds: number[], collected: boolean): void {
    articleIds.forEach((id) => this.cache.set(id, collected))
    this.emit()
  }

  clear(): void {
    this.cache.clear()
    this.emit()
  }

  async toggle(articleId: number): Promise<boolean> {
    const current = this.isCollected(articleId)
    if (current) {
      await this.repository.uncollectArticle(articleId)
      this.cache.set(articleId, false)
    } else {
      await this.repository.collectArticle(articleId)
      this.cache.set(articleId, true)
    }
    this.emit()
    return !current
  }

  private emit(): void {
    this.listeners.forEach((listener) => listener())
  }
}
