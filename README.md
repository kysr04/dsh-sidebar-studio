# dsh-sidebar-studio

DeepSeek Harness 侧栏的一体化改造：毛玻璃皮肤 + 会话活动胶囊 + 一键复制会话 ID + 基于本地日志的 token 用量面板。

不改结构、不改业务逻辑，全部落在官方扩展席位上，卸载即还原。

```bash
dsh plugin add github:kysr/dsh-sidebar-studio
```

## 能力

| 能力 | 落点 | 说明 |
|---|---|---|
| 四套皮肤（毛玻璃默认） | `theme.overrideTokens` + 注入样式表 | `glass` 半透明表面 + 渐变底 + `backdrop-filter`；另有 `slate` / `paper` / `ink` |
| 活动胶囊 | `shell.overlay` | 左下角固定：有会话等待回答时橙色「N 待回答」，否则有会话运行中显示蓝色「N 运行中」，都没有则不渲染 |
| 复制会话 ID | `sidebar.workspaces.session.row.action` | 会话行悬停时多一枚按钮，点一下复制完整 Session ID |
| 会话 tok 徽标 | `sidebar.session.row.trailing` | 会话行时间标签后显示累计 token，<5M 灰、5–50M 常规、≥50M 警示橙 |
| 用量面板 | `sidebar.panellist` + `main` | 累计/今日、按会话/按工作区、缓存命中率、导出 CSV；点行直接打开会话 |

## 安装

```bash
# GitHub 直装
dsh plugin add github:kysr/dsh-sidebar-studio

# 本地开发（链接目录）
dsh plugin add link:/absolute/path/to/dsh-sidebar-studio
```

安装后**重启一次** DeepSeek Harness：皮肤走宿主启动时的注入表，客户端模块在页面加载后注册。

要求：DeepSeek Harness 桌面版或 Web 版；Node ≥ 20（运行时自带的 Node 会被用于读取日志，见下文）。

## 皮肤

默认 `glass`。刷新后在浏览器控制台切换，立即生效、不落盘：

```js
__YG_SIDEBAR_SKIN__.list()       // ['paper', 'slate', 'ink', 'glass']
__YG_SIDEBAR_SKIN__.use('slate')
__YG_SIDEBAR_SKIN__.current()
```

临时改单个 token（同样立即生效）：

```js
__YG_SIDEBAR_SKIN__.apply({
  '--dsw-specific-sidebar-fill': { light: 'rgba(255,255,255,0.55)', dark: 'rgba(24,31,40,0.55)' },
})
__YG_SIDEBAR_SKIN__.dump()       // 导出当前整套值，便于写回文件
```

固定默认皮肤：改 `lib/skins.json` 的 `default` 字段，重启生效。

### 四套配色

| 名字 | 观感 | 强调色（浅/深） |
|---|---|---|
| `glass`（默认） | 半透明表面 + 渐变底 + 模糊 | `#3E7BC4` / `#7FB0E8` |
| `slate` | 冷灰蓝实色 | `#4B6A8F` / `#8FB2D6` |
| `paper` | 暖纸面 + 黄铜 | `#B8892B` / `#E3B45C` |
| `ink` | 高对比黑白 + 朱红 | `#C0392B` / `#E05C4B` |

每套覆盖 16 个 alias token：画布/浮层/抬升面、两级描边、三级文字、行 hover 与按下、当前导航行及其强调色、菜单表面、侧栏滚动条。

## 用量面板

数据来自本地会话日志，不联网、不上传：

```
$DSH_HOME/sessions/<workspace>/<session-id>/session.v4.jsonl.zstd
```

- 日志是**多帧拼接**的 zstd；Electron 宿主自带的 Node 只能解第一帧，因此解析在 DSH 运行时自带的 Node 下执行（`$DSH_HOME/dsh-runtimes/dsh-primary-runtime/dependencies/node`），可用 `DSH_NODE` 指定其它可执行文件
- 逐帧解压后累加 `data.usage` 的 `inputTokens` / `outputTokens` / `cacheReadTokens` / `cacheWriteTokens` / `totalTokens`，读取 `session/title` 与首条记录的 `cwd`，并按本地零点切出今日数据
- 文件级缓存按 `mtime + size + 当日零点` 复用（`$DSH_HOME/yg-usage-cache.json`），宿主内存 20 秒 TTL；本机 64 个日志冷读约 1.7 秒、热读约 50 毫秒
- 面板每 60 秒刷新；面板与行徽标共用同一次请求
- 导出：面板右上「导出 CSV」，或直接访问 `GET /yg-usage.json?format=csv`（14 列，含今日三列）

口径提醒：`totalTokens` 含缓存读取，是账单口径的输入规模，不是"实际新算的 token"。

## 实现

```
index.js           宿主半：注入皮肤样式表 + /yg-usage.json 路由
lib/client.js      客户端半：token 覆盖、会话行按钮、活动胶囊、用量面板
lib/skins.json     四套皮肤的 token 表（宿主与客户端共用）
lib/usage.mjs      日志解析器（在 DSH 运行时 Node 下执行）
cordis.patch.yml   插件行
locale/*.json      插件管理器里的标题与描述
```

- 皮肤有两条投递通道：宿主注入的 `<style>`（用 `!important` 覆盖两套配色，不依赖客户端模块图）与 `ctx.theme.overrideTokens`（同一组值，跟随主题重绘）。两者写同一份数据，不冲突
- 客户端模块必须位于 `lib/client.js`：宿主按 `./client` 导出解析，缺这个路径约定时整包不会进 boot graph

## 已知限制

- Windows 桌面版会移除收起的侧栏轨道（`data-windows-titlebar`），所以 `sidebar.toggle.badge` 那个席位在 Windows 上没有落点；活动信息改用 `shell.overlay` 的常驻胶囊
- 毛玻璃的 `backdrop-filter` 挂在 ui-sidebar 的根类名 `.wtg9ga_root` 上；DSH 升级若改类名，模糊会失效，半透明配色仍然有效
- 会话行 tok 徽标在悬停/聚焦时按官方行为自动隐藏（让位给操作按钮）
- 用量统计只读取已落盘的日志；当前正在进行中的对话可能还没写盘

## License

MIT