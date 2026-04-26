export interface UrlCheckResult {
  allow: boolean
  reason: string
}

/**
 * 简单 URL 安全策略：
 * 1. 仅允许 http/https
 * 2. 拦截常见广告/电商跳转域名
 * 3. 支持按域名白名单放行
 */
export class UrlSecurityGuard {
  private static readonly BLOCKED_HOST_KEYWORDS: string[] = [
    'taobao.com',
    'tmall.com',
    'tb.cn',
    'jd.com'
  ]

  private static readonly DEFAULT_ALLOW_HOSTS: string[] = [
    'wanandroid.com',
    'www.wanandroid.com',
    'github.com',
    'gitee.com'
  ]

  static check(url: string, allowHosts: string[] = UrlSecurityGuard.DEFAULT_ALLOW_HOSTS): UrlCheckResult {
    if (!url || url.trim().length === 0) {
      return { allow: false, reason: '链接为空' }
    }
    if (!(url.startsWith('https://') || url.startsWith('http://'))) {
      return { allow: false, reason: '仅支持 http/https 链接' }
    }

    const host = UrlSecurityGuard.extractHost(url)
    if (!host) {
      return { allow: false, reason: '链接格式非法' }
    }

    const blocked = UrlSecurityGuard.BLOCKED_HOST_KEYWORDS.some((item) => host.includes(item))
    if (blocked) {
      return { allow: false, reason: '检测到可疑跳转域名，已拦截' }
    }

    const isAllow = allowHosts.some((item) => host === item || host.endsWith(`.${item}`))
    if (!isAllow) {
      // 对非白名单域名仅做弱放行：不直接拒绝，交由页面二次提示。
      return { allow: true, reason: '外部站点，请注意链接安全' }
    }
    return { allow: true, reason: '' }
  }

  static shouldBlockRedirect(targetUrl: string): boolean {
    const result = UrlSecurityGuard.check(targetUrl)
    return !result.allow
  }

  private static extractHost(url: string): string {
    const noScheme = url.replace(/^https?:\/\//, '')
    const index = noScheme.indexOf('/')
    const hostPart = index >= 0 ? noScheme.substring(0, index) : noScheme
    return hostPart.trim().toLowerCase()
  }
}
