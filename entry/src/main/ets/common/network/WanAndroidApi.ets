export class WanAndroidApi {
  static readonly BASE_URL: string = 'https://wanandroid.com'

  // 首页
  static homeArticles(page: number): string {
    return `/article/list/${page}/json`
  }
  static banners(): string {
    return '/banner/json'
  }
  static topArticles(): string {
    return '/article/top/json'
  }
  static popularWenda(): string {
    return '/popular/wenda/json'
  }
  static popularColumn(): string {
    return '/popular/column/json'
  }
  static popularRoute(): string {
    return '/popular/route/json'
  }
  static harmonyIndex(): string {
    return '/harmony/index/json'
  }

  // 发现
  static tree(): string {
    return '/tree/json'
  }
  static articlesByCid(page: number, cid: number): string {
    return `/article/list/${page}/json?cid=${cid}`
  }
  static navi(): string {
    return '/navi/json'
  }
  static projectTree(): string {
    return '/project/tree/json'
  }
  static projectList(page: number, cid: number): string {
    return `/project/list/${page}/json?cid=${cid}`
  }

  // 搜索
  static hotKey(): string {
    return '/hotkey/json'
  }
  static search(page: number): string {
    return `/article/query/${page}/json`
  }

  // 账号
  static login(): string {
    return '/user/login'
  }
  static register(): string {
    return '/user/register'
  }
  static logout(): string {
    return '/user/logout/json'
  }
  static userInfo(): string {
    return '/user/lg/userinfo/json'
  }

  // 收藏
  static collectList(page: number): string {
    return `/lg/collect/list/${page}/json`
  }
  static collectArticle(id: number): string {
    return `/lg/collect/${id}/json`
  }
  static uncollectArticle(id: number): string {
    return `/lg/uncollect_originId/${id}/json`
  }
  static uncollectInMine(id: number): string {
    return `/lg/uncollect/${id}/json`
  }

  // 广场 / 问答 / 消息
  static plazaList(page: number): string {
    return `/user_article/list/${page}/json`
  }
  static myShareList(page: number): string {
    return `/user/lg/private_articles/${page}/json`
  }
  static userShareArticles(userId: number, page: number): string {
    return `/user/${userId}/share_articles/${page}/json`
  }
  static shareArticle(): string {
    return '/lg/user_article/add/json'
  }
  static deleteSharedArticle(id: number): string {
    return `/lg/user_article/delete/${id}/json`
  }

  static wendaList(page: number): string {
    return `/wenda/list/${page}/json`
  }
  static wendaComments(id: number): string {
    return `/wenda/comments/${id}/json`
  }

  static unreadMessageCount(): string {
    return '/message/lg/count_unread/json'
  }
  static readMessageList(page: number): string {
    return `/message/lg/readed_list/${page}/json`
  }
  static unreadMessageList(page: number): string {
    return `/message/lg/unread_list/${page}/json`
  }
}
