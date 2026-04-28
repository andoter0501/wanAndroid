# Harmony 完整构建链路（本仓库执行版）

## 1. 工程结构（已补齐）
- 根工程：`AppScope/app.json5`、`build-profile.json5`、`hvigorfile.ts`、`hvigor/hvigor-config.json5`、`oh-package.json5`
- entry 模块：`entry/build-profile.json5`、`entry/hvigorfile.ts`、`entry/oh-package.json5`、`entry/src/main/module.json5`
- 入口链路：
  - `entry/src/main/ets/entryability/EntryAbility.ets`
  - `entry/src/main/ets/pages/Index.ets`
  - `entry/src/main/ets/app/AppShellPage.ets`（作为页面壳组件）

## 2. 首次导入配置
1. 使用 DevEco Studio 打开仓库根目录。
2. 同步依赖（IDE 会提示或手动执行 `ohpm install`）。
3. 在 `build-profile.json5` 中补全签名配置 `app.signingConfigs[0].material`：
   - `storeFile`
   - `storePassword`
   - `keyAlias`
   - `keyPassword`
   - `profile`
   - `certpath`

说明：当前仓库内签名字段为空占位，不填签名无法产出可安装包。

## 3. 构建命令
- 调试包（HAP）：
  - IDE: `Build > Build Hap(s)`
  - CLI: `./hvigorw assembleHap`
- 发布包（APP）：
  - IDE: `Build > Build APP`
  - CLI: `./hvigorw assembleApp`

## 4. 真机安装验证
1. `hdc list targets` 确认可连接设备。
2. 安装 HAP：`hdc install -r <hap文件绝对路径>`
3. 启动后回归：
   - 首页 / 发现 / 搜索 / 广场 / 问答 / 我的
   - 登录-收藏-消息主链路
   - 外链安全拦截

## 5. 发布前检查
- 按 `docs/tests/release-quality-checklist.md` 逐项回归。
- 再执行 `scripts/smoke/api_smoke_check.sh` 校验公网接口可用性。
