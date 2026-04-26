## <font style="color:rgb(51, 51, 51);">注意</font>
<font style="color:rgb(51, 51, 51);">为了满足大家开发小程序等需求，目前本站完全迁移到https下，如果你是开源项目开发者，请尽快迁移 base url 为 https。</font>

<font style="color:rgb(51, 51, 51);">目前已知问题：</font>

1. <font style="color:rgb(51, 51, 51);">http 下登录、注册无法使用 -> 请使用https</font>

<font style="color:rgb(51, 51, 51);">baseurl 请使用：</font>

```plain
https://wanandroid.com
```

<font style="color:rgb(51, 51, 51);">请优先使用wanandroid.com，不要带www，近期部分地区www的完整域名访问异常，暂未排查到原因。</font>

**将所有的 http 改为https，即完全支持！**

<font style="color:rgb(102, 102, 102);background-color:rgb(248, 248, 248);">更新一些接口变化的地方，具体看对应章节。有问题请在</font>[<font style="color:rgb(39, 130, 239);background-color:rgb(248, 248, 248);">https://github.com/hongyangAndroid/wanandroid/issues</font>](https://github.com/hongyangAndroid/wanandroid/issues)<font style="color:rgb(102, 102, 102);background-color:rgb(248, 248, 248);">反馈。</font>

### <font style="color:rgb(51, 51, 51);">注意事项</font>
1. <font style="color:rgb(51, 51, 51);">增加 logout 退出接口，见5.3；</font>
2. <font style="color:rgb(51, 51, 51);">修改未登录的错误码为-1001，其他错误码为-1，成功为0，建议对errorCode 判断当不为0的时候，均为错误。</font>

---

<font style="color:rgb(102, 102, 102);background-color:rgb(248, 248, 248);">由于早期开放的一些API页码为0开始，后期接口修改为从1开始，为了兼顾之前的开放API，故无法统一。</font>

<font style="color:rgb(102, 102, 102);background-color:rgb(248, 248, 248);">对于POST接口建议使用postman模拟</font>

<font style="color:rgb(51, 51, 51);">在编写过程中如果遇到一些问题，也有一些参考项目，这里针对Java和Kotlin各自选择了一款：</font>

+ <font style="color:rgb(51, 51, 51);">java版本开源：</font>[<font style="color:rgb(39, 130, 239);">wanandroid开源客户端Java版本</font>](https://www.wanandroid.com/blog/show/2075)
+ <font style="color:rgb(51, 51, 51);">kotlin版本开源：</font>[<font style="color:rgb(39, 130, 239);">wanandroid开源客户端kotlin版本</font>](https://www.wanandroid.com/blog/show/2029)
+ <font style="color:rgb(51, 51, 51);">flutter版本开源：</font>[<font style="color:rgb(39, 130, 239);">wanandroid开源flutter版本</font>](https://github.com/hurshi/wanandroid)

<font style="color:rgb(102, 102, 102);background-color:rgb(248, 248, 248);">开源项目或多或少包含一些问题，仅供参考，最好自己写一个啦~  
</font><font style="color:rgb(102, 102, 102);background-color:rgb(248, 248, 248);">如果你想装一个使用，建议下载kotlin那个版本，我一直在使用，较为稳定。</font>

<font style="color:rgb(51, 51, 51);">当然你也可以在github上</font>[<font style="color:rgb(39, 130, 239);">搜索wanandroid</font>](https://github.com/search?q=wanandroid)<font style="color:rgb(51, 51, 51);">。</font>

<font style="color:rgb(51, 51, 51);">返回数据结构定义:</font>

```plain
{
    "data": ...,
    "errorCode": 0,
    "errorMsg": ""
}
```

<font style="color:rgb(51, 51, 51);">所有的返回结构均为上述，其中errorCode如果为负数则认为错误，此时errorMsg会包含错误信息。data为Object，返回数据根据不同的接口而变化。</font>

1. <font style="color:rgb(51, 51, 51);">errorCode = 0 代表执行成功，不建议依赖任何非0的 errorCode.</font>
2. <font style="color:rgb(51, 51, 51);">errorCode = -1001 代表登录失效，需要重新登录。</font>

<font style="color:rgb(102, 102, 102);background-color:rgb(248, 248, 248);">如果遇到接口错误，请及时通过</font>[<font style="color:rgb(39, 130, 239);background-color:rgb(248, 248, 248);">https://github.com/hongyangAndroid/wanandroid</font>](https://github.com/hongyangAndroid/wanandroid)<font style="color:rgb(102, 102, 102);background-color:rgb(248, 248, 248);">反馈。</font>

<font style="color:rgb(51, 51, 51);">对于需要登录访问的接口，强烈建议阅读下：</font>

+ [<font style="color:rgb(39, 130, 239);">Postman 模拟带 cookie 的请求</font>](https://www.wanandroid.com/blog/show/2268)

## <font style="color:rgb(51, 51, 51);">【2024-5-26】新增 API</font>
### <font style="color:rgb(51, 51, 51);">1. 鸿蒙专栏</font>
```plain
https://wanandroid.com/harmony/index/json

方法：GET
```

<font style="color:rgb(51, 51, 51);">返回格式：</font>

```plain
{
    "data": {
        "links": {
         },
        "open_sources": {
		},
        "tools": {
        }
    },
    "errorCode": 0,
    "errorMsg": ""
}
```

<font style="color:rgb(51, 51, 51);">分别对应常用链接、开源项目、常用工具。</font>

<font style="color:rgb(102, 102, 102);background-color:rgb(248, 248, 248);">最终对象可以复用Chapter、Article bean。</font>

### <font style="color:rgb(51, 51, 51);">2. 首页最受欢迎板块</font>
<font style="color:rgb(51, 51, 51);">问答：  
</font>[<font style="color:rgb(39, 130, 239);">https://wanandroid.com/popular/wenda/json</font>](https://wanandroid.com/popular/wenda/json)<font style="color:rgb(51, 51, 51);">  
</font><font style="color:rgb(51, 51, 51);">专栏  
</font>[<font style="color:rgb(39, 130, 239);">https://wanandroid.com/popular/column/json</font>](https://wanandroid.com/popular/column/json)<font style="color:rgb(51, 51, 51);">  
</font><font style="color:rgb(51, 51, 51);">路线：  
</font>[<font style="color:rgb(39, 130, 239);">https://wanandroid.com/popular/route/json</font>](https://wanandroid.com/popular/route/json)

<font style="color:rgb(102, 102, 102);background-color:rgb(248, 248, 248);">最终对象可以复用Chapter bean。</font>

## <font style="color:rgb(51, 51, 51);">1.首页相关</font>
### <font style="color:rgb(51, 51, 51);">1.1 首页文章列表</font>
```plain
https://www.wanandroid.com/article/list/0/json

方法：GET
参数：页码，拼接在连接中，从0开始。
```

**很多 H5 页面会恶意跳转淘宝等，可以在 webview 的 shouldOverrideUrlLoading 中做一下拦截，非常影响用户体验。**

<font style="color:rgb(51, 51, 51);">可直接点击查看示例：</font>[<font style="color:rgb(39, 130, 239);">https://www.wanandroid.com/article/list/1/json</font>](https://www.wanandroid.com/article/list/1/json)<font style="color:rgb(51, 51, 51);">。</font>

<font style="color:rgb(51, 51, 51);">注意：页码从0开始，拼接在链接上。</font>

<font style="color:rgb(51, 51, 51);">注：该接口支持传入 page_size 控制分页数量，取值为[1-40]，不传则使用默认值，一旦传入了 page_size，后续该接口分页都需要带上，否则会造成分页读取错误。</font>

<font style="color:rgb(51, 51, 51);">其中有两个易混淆的字段:</font>

```plain
"superChapterId": 153, 
"superChapterName": "framework", // 一级分类的名称
```

<font style="color:rgb(51, 51, 51);">superChapterId其实不是一级分类id，因为要拼接跳转url，内容实际都挂在二级分类下，所以该id实际上是一级分类的第一个子类目的id，拼接后故可正常跳转。</font>

<font style="color:rgb(51, 51, 51);">有两个字段比较容易混淆：</font>

<font style="color:rgb(51, 51, 51);">author 与 shareUser</font>

<font style="color:rgb(51, 51, 51);">网站上的文章可能是某位作者author的，也可能是某位分享人shareUser分享的。</font>

<font style="color:rgb(51, 51, 51);">如果是分享人分享的，author 为 null。</font>

**注意：除了文字标题，链接，其他字段都可能为null，一定要注意布局下发 null 时的显示情况。**

### <font style="color:rgb(51, 51, 51);">1.2 首页banner</font>
```plain
https://www.wanandroid.com/banner/json

方法：GET
参数：无
```

<font style="color:rgb(51, 51, 51);">可直接点击查看示例：</font>[<font style="color:rgb(39, 130, 239);">https://www.wanandroid.com/banner/json</font>](https://www.wanandroid.com/banner/json)

### <font style="color:rgb(51, 51, 51);">1.3 常用网站</font>
```plain
https://www.wanandroid.com/friend/json

方法：GET
参数：无
```

<font style="color:rgb(51, 51, 51);">可直接点击查看示例：</font>[<font style="color:rgb(39, 130, 239);">https://www.wanandroid.com/friend/json</font>](https://www.wanandroid.com/friend/json)

### <font style="color:rgb(51, 51, 51);">1.4 搜索热词</font>
<font style="color:rgb(51, 51, 51);">即目前搜索最多的关键词。</font>

```plain
https://www.wanandroid.com//hotkey/json

方法：GET
参数：无
```

<font style="color:rgb(51, 51, 51);">可直接点击查看示例：</font>[<font style="color:rgb(39, 130, 239);">https://www.wanandroid.com/hotkey/json</font>](https://www.wanandroid.com//hotkey/json)

### <font style="color:rgb(51, 51, 51);">1.5 置顶文章</font>
```plain
https://www.wanandroid.com/article/top/json
```

## <font style="color:rgb(51, 51, 51);">2. 体系</font>
### <font style="color:rgb(51, 51, 51);">2.1 体系数据</font>
```plain
https://www.wanandroid.com/tree/json

方法：GET
参数：无
```

<font style="color:rgb(51, 51, 51);">可直接点击查看示例：</font>[<font style="color:rgb(39, 130, 239);">https://www.wanandroid.com/tree/json</font>](https://www.wanandroid.com/tree/json)

<font style="color:rgb(51, 51, 51);">主要标识的网站内容的体系结构，二级目录。部分数据参考：</font>

```java
{
    "children": [
        {
            "children": [],
            "courseId": 13,
            "id": 60, // id会在查看该目录下所有文章时有用
            "name": "Android Studio相关", // 子名称
            "order": 1000,
            "parentChapterId": 150,
            "visible": 1
        },...
    ],
    "courseId": 13,
    "id": 150,
    "name": "开发环境", // 一级的名称
    "order": 1,
    "parentChapterId": 0,
    "visible": 1
}
```

### <font style="color:rgb(51, 51, 51);">2.2 知识体系下的文章</font>
```plain
https://www.wanandroid.com/article/list/0/json?cid=60

方法：GET
参数：
	cid 分类的id，上述二级目录的id
	页码：拼接在链接上，从0开始。
```

<font style="color:rgb(51, 51, 51);">注：该接口支持传入 page_size 控制分页数量，取值为[1-40]，不传则使用默认值，一旦传入了 page_size，后续该接口分页都需要带上，否则会造成分页读取错误。</font>

<font style="color:rgb(51, 51, 51);">例如查看类别：Android Studio下所有的文章：</font>[<font style="color:rgb(39, 130, 239);">https://www.wanandroid.com/article/list/0/json?cid=60</font>](https://www.wanandroid.com/article/list/0/json?cid=60)

### <font style="color:rgb(51, 51, 51);">2.3 按照作者昵称搜索文章</font>
```plain
https://wanandroid.com/article/list/0/json?author=鸿洋

	方法:GET
	页码：拼接在链接上，从0开始。
	author：作者昵称，不支持模糊匹配。
```

<font style="color:rgb(51, 51, 51);">注：该接口支持传入 page_size 控制分页数量，取值为[1-40]，不传则使用默认值，一旦传入了 page_size，后续该接口分页都需要带上，否则会造成分页读取错误。</font>

## <font style="color:rgb(51, 51, 51);">3. 导航</font>
### <font style="color:rgb(51, 51, 51);">3.1 导航数据</font>
```plain
https://www.wanandroid.com/navi/json

方法：GET
参数：无
```

<font style="color:rgb(51, 51, 51);">可直接点击查看示例：</font>[<font style="color:rgb(39, 130, 239);">https://www.wanandroid.com/navi/json</font>](https://www.wanandroid.com/navi/json)

## <font style="color:rgb(51, 51, 51);">4. 项目</font>
### <font style="color:rgb(51, 51, 51);">4.1 项目分类</font>
```plain
https://www.wanandroid.com/project/tree/json

方法： GET
参数： 无
```

<font style="color:rgb(51, 51, 51);">项目为包含一个分类，该接口返回整个分类。</font>

```java
[
    {
        "children": [],
        "courseId": 13, 
        "id": 294, // 该id在获取该分类下项目时需要用到
        "name": "完整项目", // 该分类名称
        "order": 145000,
        "parentChapterId": 293,
        "visible": 0
    }
]
```

<font style="color:rgb(51, 51, 51);">可以直接访问：</font>[<font style="color:rgb(39, 130, 239);">https://www.wanandroid.com/project/tree/json</font>](https://www.wanandroid.com/project/tree/json)

### <font style="color:rgb(51, 51, 51);">4.2 项目列表数据</font>
<font style="color:rgb(51, 51, 51);">某一个分类下项目列表数据，分页展示</font>

```plain
https://www.wanandroid.com/project/list/1/json?cid=294

方法：GET
参数：
	cid 分类的id，上面项目分类接口
	页码：拼接在链接中，从1开始。
```

<font style="color:rgb(51, 51, 51);">注：该接口支持传入 page_size 控制分页数量，取值为[1-40]，不传则使用默认值，一旦传入了 page_size，后续该接口分页都需要带上，否则会造成分页读取错误。</font>

<font style="color:rgb(51, 51, 51);">可以直接访问：</font>[<font style="color:rgb(39, 130, 239);">https://www.wanandroid.com/project/list/1/json?cid=294</font>](https://www.wanandroid.com/project/list/1/json?cid=294)

## <font style="color:rgb(51, 51, 51);">5. 登录与注册</font>
### <font style="color:rgb(51, 51, 51);">5.1 登录</font>
```plain
https://www.wanandroid.com/user/login

方法：POST
参数：
	username，password
```

<font style="color:rgb(51, 51, 51);">登录后会在cookie中返回账号密码，只要在客户端做cookie持久化存储即可自动登录验证。</font>

### <font style="color:rgb(51, 51, 51);">5.2 注册</font>
```plain
https://www.wanandroid.com/user/register

方法：POST
参数
	username,password,repassword
```

### <font style="color:rgb(51, 51, 51);">5.3 退出</font>
```plain
https://www.wanandroid.com/user/logout/json

方法：GET
```

<font style="color:rgb(51, 51, 51);">访问了 logout 后，服务端会让客户端清除 Cookie（即cookie max-Age=0），如果客户端 Cookie 实现合理，可以实现自动清理，如果本地做了用户账号密码和保存，及时清理。</font>

<font style="color:rgb(102, 102, 102);background-color:rgb(248, 248, 248);">如果需要特殊的errorCode 来支持清除数据，请反馈。</font>

## <font style="color:rgb(51, 51, 51);">6. 收藏</font>
<font style="color:rgb(102, 102, 102);background-color:rgb(248, 248, 248);">注意所有收藏相关都需要登录操作，建议登录将返回的cookie（其中包含账号、密码）持久化到本地即可。</font>

<font style="color:rgb(51, 51, 51);">对于需要登录访问的接口，强烈建议阅读下：</font>

+ [<font style="color:rgb(39, 130, 239);">Postman 模拟带 cookie 的请求</font>](https://www.wanandroid.com/blog/show/2268)

### <font style="color:rgb(51, 51, 51);">6.1 收藏文章列表</font>
```plain
https://www.wanandroid.com/lg/collect/list/0/json

方法：GET
参数： 页码：拼接在链接中，从0开始。
```

<font style="color:rgb(51, 51, 51);">注：该接口支持传入 page_size 控制分页数量，取值为[1-40]，不传则使用默认值，一旦传入了 page_size，后续该接口分页都需要带上，否则会造成分页读取错误。</font>

<font style="color:rgb(51, 51, 51);">在网站上登录后，可以直接访问</font>[<font style="color:rgb(39, 130, 239);">https://www.wanandroid.com/lg/collect/list/0/json</font>](https://www.wanandroid.com/lg/collect/list/0/json)<font style="color:rgb(51, 51, 51);">查看自己收藏的文章。</font>

### <font style="color:rgb(51, 51, 51);">6.2 收藏站内文章</font>
```plain
https://www.wanandroid.com/lg/collect/1165/json

方法：POST
参数： 文章id，拼接在链接中。
```

<font style="color:rgb(51, 51, 51);">注意链接中的数字，为需要收藏的id.</font>

### <font style="color:rgb(51, 51, 51);">6.3 收藏站外文章</font>
```plain
https://www.wanandroid.com/lg/collect/add/json

方法：POST
参数：
	title，author，link
```

### <font style="color:rgb(51, 51, 51);">[新增] 编辑收藏的文章，支持站内，站外</font>
<font style="color:rgb(102, 102, 102);background-color:rgb(248, 248, 248);">更新日期 2021-08-22</font>

```plain
https://wanandroid.com/lg/collect/user_article/update/ 文章 id/json
方法：POST请求
参数
	文章 id:拼接在 url 上
	title: 文章标题
	link: 文章 url
	author: 作者
```

<font style="color:rgb(51, 51, 51);">注意：调用此接口，一定要带上 title,link,author，否则会认为想设置为""。</font>

### <font style="color:rgb(51, 51, 51);">6.4 取消收藏</font>
<font style="color:rgb(51, 51, 51);">取消收藏一共有两个地方可以触发：</font>

#### <font style="color:rgb(51, 51, 51);">6.4.1 文章列表</font>
```plain
https://www.wanandroid.com/lg/uncollect_originId/2333/json

方法：POST
参数：
	id:拼接在链接上
```

<font style="color:rgb(51, 51, 51);">id传入的是列表中文章的id。</font>

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/362266/1777130385454-a4393aed-71cc-421e-8161-f6fdb962cc5b.png)

#### <font style="color:rgb(51, 51, 51);">6.4.2 我的收藏页面（该页面包含自己录入的内容）</font>
```plain
https://www.wanandroid.com/lg/uncollect/2805/json

方法：POST
参数：
	id:拼接在链接上
	originId:列表页下发，无则为-1
```

<font style="color:rgb(51, 51, 51);">如下图：id=2766，originId=2324</font>

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/362266/1777130385416-d43b2cf9-ea5e-4f31-ad8f-53e039dc9e2c.png)

<font style="color:rgb(102, 102, 102);background-color:rgb(248, 248, 248);">originId 代表的是你收藏之前的那篇文章本身的id； 但是收藏支持主动添加，这种情况下，没有originId则为-1</font>

### <font style="color:rgb(51, 51, 51);">6.5 收藏网站列表</font>
```plain
https://www.wanandroid.com/lg/collect/usertools/json

方法：GET
参数：无
```

### <font style="color:rgb(51, 51, 51);">6.6 收藏网址</font>
```plain
https://www.wanandroid.com/lg/collect/addtool/json

方法：POST
参数：
	name,link
```

### <font style="color:rgb(51, 51, 51);">6.7 编辑收藏网站</font>
```plain
https://www.wanandroid.com/lg/collect/updatetool/json

方法：POST
参数：
	id,name,link
```

### <font style="color:rgb(51, 51, 51);">6.8 删除收藏网站</font>
```plain
https://www.wanandroid.com/lg/collect/deletetool/json

方法：POST
参数：
	id
```

## <font style="color:rgb(51, 51, 51);">7. 搜索</font>
### <font style="color:rgb(51, 51, 51);">7.1 搜索</font>
```plain
https://www.wanandroid.com/article/query/0/json

方法：POST
参数：
	页码：拼接在链接上，从0开始。
	k ： 搜索关键词
```

<font style="color:rgb(51, 51, 51);">注：该接口支持传入 page_size 控制分页数量，取值为[1-40]，不传则使用默认值，一旦传入了 page_size，后续该接口分页都需要带上，否则会造成分页读取错误。</font>

<font style="color:rgb(51, 51, 51);">注意：支持多个关键词，用空格隔开</font>

## <font style="color:rgb(51, 51, 51);">8. TODO 工具</font>
<font style="color:rgb(51, 51, 51);">最新的 v2版本已经更新，建议使用：</font>[<font style="color:rgb(39, 130, 239);">玩 Android TODO Open API v2</font>](https://www.wanandroid.com/blog/show/2442)<font style="color:rgb(51, 51, 51);">，老接口依然支持，但是已经不再推荐使用。</font>

<font style="color:rgb(102, 102, 102);background-color:rgb(248, 248, 248);">注意所有TODO相关都需要登录操作，建议登录将返回的cookie（其中包含账号、密码）持久化到本地即可。</font>

<font style="color:rgb(51, 51, 51);">对于需要登录访问的接口，强烈建议阅读下：</font>

+ [<font style="color:rgb(39, 130, 239);">Postman 模拟带 cookie 的请求</font>](https://www.wanandroid.com/blog/show/2268)

## <font style="color:rgb(51, 51, 51);">9.积分 API 2019-08-25</font>
### <font style="color:rgb(51, 51, 51);">积分排行榜接口</font>
[<font style="color:rgb(39, 130, 239);">https://www.wanandroid.com/coin/rank/1/json</font>](https://www.wanandroid.com/coin/rank/1/json)

### <font style="color:rgb(51, 51, 51);">获取个人积分，需要登录后访问</font>
[<font style="color:rgb(39, 130, 239);">https://www.wanandroid.com/lg/coin/userinfo/json</font>](https://www.wanandroid.com/lg/coin/userinfo/json)

```plain
{
    "data": {
        "coinCount": 451, //总积分
        "rank": 7, //当前排名
        "userId": 2,
        "username": "x**oyang"
    },
    "errorCode": 0,
    "errorMsg": ""
}
```

### <font style="color:rgb(51, 51, 51);">获取个人积分获取列表，需要登录后访问</font>
[<font style="color:rgb(39, 130, 239);">https://www.wanandroid.com//lg/coin/list/1/json</font>](https://www.wanandroid.com//lg/coin/list/1/json)

## <font style="color:rgb(51, 51, 51);">10. 广场 2019-10-02</font>
### <font style="color:rgb(51, 51, 51);">10.1 广场列表数据</font>
```plain
https://wanandroid.com/user_article/list/页码/json
GET请求
页码拼接在url上从0开始
```

<font style="color:rgb(51, 51, 51);">注：该接口支持传入 page_size 控制分页数量，取值为[1-40]，不传则使用默认值，一旦传入了 page_size，后续该接口分页都需要带上，否则会造成分页读取错误。</font>

<font style="color:rgb(51, 51, 51);">示例：</font>

[<font style="color:rgb(39, 130, 239);">https://wanandroid.com/user_article/list/0/json</font>](https://wanandroid.com/user_article/list/0/json)

<font style="color:rgb(51, 51, 51);">可能出现返回列表数据<每页数据，因为有自见的文章被过滤掉了。</font>

### <font style="color:rgb(51, 51, 51);">10.2 分享人对应列表数据</font>
<font style="color:rgb(51, 51, 51);">这个展示的文章数据都是审核通过的，一般是点击分享人然后展示的列表。</font>

<font style="color:rgb(51, 51, 51);">就像：</font>[<font style="color:rgb(39, 130, 239);">https://wanandroid.com/user/2/articles/1</font>](https://wanandroid.com/user/2/articles/1)

```plain
https://www.wanandroid.com/user/2/share_articles/页码/json

GET请求
参数：
	用户id: 拼接在url上
	页码拼接在url上从1开始
```

<font style="color:rgb(51, 51, 51);">返回数据：</font>

```plain
{
    "data": {
        "coinInfo": { // 该用户积分信息
            "coinCount": 20, // 积分总数
            "rank": 1, // 排名
            "userId": 2,
            "username": "x**oyang"
        },
        "shareArticles": { // 该用户分享文章分页信息
			}
		}
    },
    "errorCode": 0,
    "errorMsg": ""
}
```

<font style="color:rgb(51, 51, 51);">示例：</font>

[<font style="color:rgb(39, 130, 239);">https://www.wanandroid.com/user/2/share_articles/1/json</font>](https://www.wanandroid.com/user/2/share_articles/1/json)

<font style="color:rgb(51, 51, 51);">可能出现返回列表数据<每页数据，因为有自见的文章被过滤掉了。</font>

### <font style="color:rgb(51, 51, 51);">10.3 自己的分享的文章列表</font>
```plain
https://wanandroid.com/user/lg/private_articles/1/json
方法：
	GET
参数：
	页码，从1开始
```

<font style="color:rgb(51, 51, 51);">注：该接口支持传入 page_size 控制分页数量，取值为[1-40]，不传则使用默认值，一旦传入了 page_size，后续该接口分页都需要带上，否则会造成分页读取错误。</font>

<font style="color:rgb(51, 51, 51);">如果你登陆了，可以直接点击查看自己分享的列表：  
</font>[<font style="color:rgb(39, 130, 239);">https://wanandroid.com/user/lg/private_articles/1/json</font>](https://wanandroid.com/user/lg/private_articles/1/json)

### <font style="color:rgb(51, 51, 51);">10.4 删除自己分享的文章</font>
```plain
https://wanandroid.com/lg/user_article/delete/9475/json
请求:POST
参数：文章id，拼接在链接上
```

<font style="color:rgb(51, 51, 51);">建议测试方式：登陆网站后，自己分享一篇文章在广场，然后与删除按钮，打开chrome调试模式，查看Network里面有请求。</font>

### <font style="color:rgb(51, 51, 51);">10.5 分享文章</font>
```plain
https://www.wanandroid.com/lg/user_article/add/json

请求：POST
参数：
	title:
	link
```

<font style="color:rgb(51, 51, 51);">注意需要登录后查看，如果为CSDN，简书等链接会直接通过审核，在对外的分享文章列表中展示。</font>

<font style="color:rgb(51, 51, 51);">否则只能在自己的分享文章列表查看，见10.3。</font>

## <font style="color:rgb(51, 51, 51);">11. 问答</font>
```plain
https://wanandroid.com/wenda/list/1/json 

请求:GET

参数：
	pageId,拼接在链接上，例如上面的1
```

<font style="color:rgb(51, 51, 51);">pageId从 1 开始。</font>

<font style="color:rgb(51, 51, 51);">注：该接口支持传入 page_size 控制分页数量，取值为[1-40]，不传则使用默认值，一旦传入了 page_size，后续该接口分页都需要带上，否则会造成分页读取错误。</font>

## <font style="color:rgb(51, 51, 51);">12. 个人信息接口</font>
<font style="color:rgb(102, 102, 102);background-color:rgb(248, 248, 248);">更新日期 2021-08-22</font>

<font style="color:rgb(51, 51, 51);">接口：</font>

[<font style="color:rgb(39, 130, 239);">https://wanandroid.com//user/lg/userinfo/json</font>](https://wanandroid.com//user/lg/userinfo/json)

<font style="color:rgb(51, 51, 51);">返回：</font>

```plain
{
    "data": {
        "coinInfo": { // 积分和排名可能不是实时的，每天更新
            "coinCount": 36662, // 可用
            "level": 367, // 可用
            "nickname": "",
            "rank": "3", // 可用
            "userId": 2, // 可用
            "username": "x**oyang"
        },
        "userInfo": {
            "admin": false,
            "chapterTops": [],
            "coinCount": 36662, // 可用
            "collectIds": [ // 可用
            ],
            "email": "623565791@qq.com", // 可用
            "icon": "", 
            "id": 2, // 可用
            "nickname": "鸿洋",// 可用
            "password": "",
            "publicName": "鸿洋", 
            "token": "",
            "type": 0,
            "username": "xiaoyang"// 可用
        }
    },
    "errorCode": 0,
    "errorMsg": ""
}
```

## <font style="color:rgb(51, 51, 51);">13. 问答评论列表 | 2021-06-27 更新</font>
<font style="color:rgb(51, 51, 51);">返回问答的评论列表，默认以点赞数倒序排列，如果当前用户登录，则本人评论会置顶。</font>

```plain
api: 
	https://wanandroid.com/wenda/comments/问答id/json
	问答 id，可以通过问答列表获取
方法：GET
```

<font style="color:rgb(51, 51, 51);">注意拿到的对象中id，称之为评论 id，未来回复、删除都会依赖。</font>

<font style="color:rgb(51, 51, 51);">示例：</font>

[<font style="color:rgb(39, 130, 239);">https://wanandroid.com/wenda/comments/14500/json</font>](https://wanandroid.com/wenda/comments/14500/json)

## <font style="color:rgb(51, 51, 51);">14. 站内消息列表 | 2021-06-27 更新</font>
### <font style="color:rgb(51, 51, 51);">14.1 未读消息数量</font>
<font style="color:rgb(51, 51, 51);">格式：</font>

```plain
api: 
	https://wanandroid.com/message/lg/count_unread/json
方法：GET
```

<font style="color:rgb(51, 51, 51);">返回当前登录用户未读消息数量。  
</font><font style="color:rgb(51, 51, 51);">注意：此需要登录。</font>

<font style="color:rgb(51, 51, 51);">案例：</font>

[<font style="color:rgb(39, 130, 239);">https://wanandroid.com/message/lg/count_unread/json</font>](https://wanandroid.com/message/lg/count_unread/json)

### <font style="color:rgb(51, 51, 51);">14.2 已读消息列表</font>
<font style="color:rgb(51, 51, 51);">格式：</font>

```plain
api: 
	https://wanandroid.com/message/lg/readed_list/页码/json
	注意页码从 1 开始
方法：GET
```

<font style="color:rgb(51, 51, 51);">返回当前已经登录用户已读消息列表，分页展示。  
</font><font style="color:rgb(51, 51, 51);">注意：此接口需要登录</font>

<font style="color:rgb(51, 51, 51);">注：该接口支持传入 page_size 控制分页数量，取值为[1-40]，不传则使用默认值，一旦传入了 page_size，后续该接口分页都需要带上，否则会造成分页读取错误。</font>

<font style="color:rgb(51, 51, 51);">案例：</font>

[<font style="color:rgb(39, 130, 239);">https://wanandroid.com/message/lg/readed_list/1/json</font>](https://wanandroid.com/message/lg/readed_list/1/json)

### <font style="color:rgb(51, 51, 51);">14.3 未读消息列表</font>
<font style="color:rgb(51, 51, 51);">格式：</font>

```plain
api: 
	https://wanandroid.com/message/lg/unread_list/页码/json
	注意页码从 1 开始
方法：GET
```

<font style="color:rgb(51, 51, 51);">返回当前登录用户未读消息列表，分页展示。</font>

+ <font style="color:rgb(51, 51, 51);">注意1：此接口需要登录。</font>
+ <font style="color:rgb(51, 51, 51);">注意 2：此接口一旦访问，则所有该用户的消息都会被认为已读，即第二次只能从已读消息列表获取，想获取未读数量不要访问此接口。</font>

<font style="color:rgb(51, 51, 51);">注：该接口支持传入 page_size 控制分页数量，取值为[1-40]，不传则使用默认值，一旦传入了 page_size，后续该接口分页都需要带上，否则会造成分页读取错误。</font>

<font style="color:rgb(51, 51, 51);">案例：</font>

[<font style="color:rgb(39, 130, 239);">https://wanandroid.com/message/lg/unread_list/1/json</font>](https://wanandroid.com/message/lg/unread_list/1/json)

