# v43 个人主页进化版

这一轮围绕 **“把复杂的事，做得清楚”** 重排视觉和内容。首页以真实去雾对比建立记忆，作品用完整舞台与并置预览交替呈现；人物、摄影、联系和履历各自保留适合的阅读方式。

## 先看这些

- [素材补充清单](素材补充清单.md)：你需要准备什么、优先级、最小数量与接入位置。
- [设计研究](design-research.md)：实际阅读的作者官网、开源项目，以及本站的原创转译。
- [案例证据建议](案例证据建议.md)：四个产品怎样从功能介绍走向可核对的取舍记录。
- [后续内容路线](后续内容路线.md)：下一批内容的三次迭代，不重复搭建缺正文的栏目。
- [招聘路径审查](招聘路径审查.md)：内容保留、英文术语、公开范围及外链核查。
- [验收记录](验收记录.md)：本地验证、已知边界与发布前要核对的事项。

静态预览：[桌面首页](preview-home-desktop.webp) · [手机首页](preview-home-mobile.webp) · [生活封面](preview-life.webp) · [数据案例](preview-data-case.webp) · [联系页](preview-contact.webp)。

## 新增的实际入口

- `site/data-case.html`：解释 Data Helper 留存电商示例里评分为何下降，附原始来源、SQL、同尺度比例图与可操作的字段投影示意。真实记录与虚构教学示意明确分开。
- `site/en.html`：面向英文读者的精炼介绍、产品、实习、教育和联系；不是全站逐页英文翻译。项目详情仍可进入中文页。
- 全站搜索：点击导航的搜索按钮，或按 **Ctrl / Command + K**。支持中英文关键词、方向键、Enter、Esc；中文输入法候选确认保留输入行为。
- 首页作品筛选和每项“一个设计取舍”；已有去雾滑杆、生活模式、相册、复制与双语简历下载保留。
- 横版分享封面 `site/assets/og-cover.png` 和统一 favicon；正式主域确认后再设置绝对分享地址、canonical、hreflang 与 sitemap，不预填相对地址作为搜索语言标记。

## 预览与发布

在仓库根运行：

```powershell
python -m http.server 8765 --directory site
```

浏览器打开 `http://localhost:8765/`。使用 HTTP，避免直接双击 HTML 时 ES Modules 无法加载。

本轮交付仍是纯静态 HTML / CSS / JavaScript，没有增加线上依赖、安装步骤或构建流程。CloudBase 的静态发布根目录仍为 `site/`。这次不操作 CloudBase 控制台或 Surge；发布前请先浏览完整页面和现有简历文件。

## 已建立的回退点

- 旧版提交：`5d38ac459ea5d4394299371add6e9084ee2a24cc`（v42）。
- 注释标签：`frontend-v42-backup-20261114`。
- 该标签已同步到 GitHub，独立于本轮新代码保留。
- 离线完整历史：`F:\AICoding\_backups\my_homepage-before-evolution-20261114.bundle`，已通过 `git bundle verify`。
- 改造分支：`codex/homepage-evolution-20261114`。

工作区干净时，以下命令用于查看旧版，不重写任何分支：

```powershell
git switch --detach frontend-v42-backup-20261114
# 查看旧版后回到新版
git switch codex/homepage-evolution-20261114
```

如果以后要正式恢复旧版，先保存之后的新改动，再从备份标签建立恢复分支。无需使用会丢弃工作区内容的 `reset --hard`。

## 维护约定

页面继续以 HTML 为事实来源；`evolution*.css` 是这轮的设计层，`evolution.js` 负责搜索、语言入口、作品筛选和阅读定位。新案例的小实验由 `evolution-case.js` 独立负责。

新增或改变身份、学校、实习、产品平台、部署入口时，同时核对首页、Works、CV、About 和英文页。下载 PDF 仍是已有通用版本，在线页面已明确版本边界；取得新版源文件后，先同步中英文 DOCX/PDF，再更新网站资产。

外部应用地址集中在 `site/js/config.js`；HTML 的备用链接也需要同步，确保无 JavaScript 时可访问。改资源后统一更新查询版本号，本轮为 `v=43`。
