# wanAndroid 鸿蒙客户端接口映射与架构草案

## 1. 技术架构分层

模块边界：
- `network`：HTTP 客户端、Cookie 持久化、统一响应解析。
- `domain`：用例（UseCase）、实体模型、分页聚合逻辑。
- `ui`：页面、组件、状态机（加载/成功/空/失败）。
- `storage`：用户会话、搜索历史、本地偏好。

统一响应模型：
```ts
interface ApiResponse<T> {
  data: T
  errorCode: number
  errorMsg: string
}
```

统一规则：
- `errorCode === 0`：成功。
- `errorCode !== 0`：失败。
- `errorCode === -1001`：登录失效，触发会话清理与登录重定向。

## 2. 功能到接口映射（核心）

### 首页
- 文章列表：`GET /article/list/{page}/json`（page 从 0 开始）
- Banner：`GET /banner/json`
- 置顶：`GET /article/top/json`
- 热门板块：
  - `GET /popular/wenda/json`
  - `GET /popular/column/json`
  - `GET /popular/route/json`
- 鸿蒙专栏：`GET /harmony/index/json`

### 发现
- 体系：`GET /tree/json`
- 体系文章：`GET /article/list/{page}/json?cid={cid}`（page 从 0 开始）
- 按作者：`GET /article/list/{page}/json?author={author}`（精确匹配）
- 导航：`GET /navi/json`
- 项目分类：`GET /project/tree/json`
- 项目列表：`GET /project/list/{page}/json?cid={cid}`（page 从 1 开始）

### 搜索
- 热词：`GET /hotkey/json`
- 搜索：`POST /article/query/{page}/json`（参数 `k`，page 从 0 开始）

### 登录与用户
- 登录：`POST /user/login`
- 注册：`POST /user/register`
- 退出：`GET /user/logout/json`
- 个人信息：`GET /user/lg/userinfo/json`
- 个人积分：`GET /lg/coin/userinfo/json`
- 积分列表：`GET /lg/coin/list/{page}/json`（page 从 1 开始）

### 收藏
- 收藏列表：`GET /lg/collect/list/{page}/json`（page 从 0 开始）
- 收藏站内文章：`POST /lg/collect/{id}/json`
- 收藏站外文章：`POST /lg/collect/add/json`
- 编辑收藏文章：`POST /lg/collect/user_article/update/{id}/json`
- 取消收藏（文章流）：`POST /lg/uncollect_originId/{id}/json`
- 取消收藏（我的收藏）：`POST /lg/uncollect/{id}/json`（带 `originId`）
- 收藏网站列表：`GET /lg/collect/usertools/json`
- 收藏网址：`POST /lg/collect/addtool/json`
- 编辑收藏网址：`POST /lg/collect/updatetool/json`
- 删除收藏网址：`POST /lg/collect/deletetool/json`

### 广场
- 广场列表：`GET /user_article/list/{page}/json`（page 从 0 开始）
- 分享人文章：`GET /user/{id}/share_articles/{page}/json`（page 从 1 开始）
- 我的分享：`GET /user/lg/private_articles/{page}/json`（page 从 1 开始）
- 删除分享：`POST /lg/user_article/delete/{id}/json`
- 分享文章：`POST /lg/user_article/add/json`

### 问答与消息
- 问答列表：`GET /wenda/list/{page}/json`（page 从 1 开始）
- 问答评论：`GET /wenda/comments/{id}/json`
- 未读数量：`GET /message/lg/count_unread/json`
- 已读列表：`GET /message/lg/readed_list/{page}/json`（page 从 1 开始）
- 未读列表：`GET /message/lg/unread_list/{page}/json`（page 从 1 开始）

## 3. 状态与错误处理

- 网络错误：进入 `Error` 状态，支持重试。
- 空数据：进入 `Empty` 状态。
- 登录失效（`-1001`）：
1. 清理内存态用户信息。
2. 清理本地 Cookie 与用户缓存。
3. 若当前页面需要登录，跳转登录页。
4. 非强依赖页面显示轻提示后继续浏览。

## 4. 分页策略（避免踩坑）
- 每个接口维护独立分页配置，不做全局统一。
- 对支持 `page_size` 的接口：一旦使用，后续同接口请求都带同值。
- 分页结束判定：以服务端返回分页字段为准，不依赖本地猜测。

## 5. 鉴权与会话策略
- 使用 Cookie 维持会话，登录成功后持久化。
- App 冷启动时先恢复 Cookie，再拉用户信息。
- 登出成功后立刻清 Cookie 与用户态。

## 6. 推荐目录结构（HarmonyOS）

```text
entry/src/main/ets/
  common/
    network/
    storage/
    model/
  features/
    home/
    discover/
    plaza/
    wenda/
    mine/
    search/
    auth/
  router/
  app/
```
