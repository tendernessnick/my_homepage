# 胡睿杰 · 个人主页

个人观察手记与产品实验室，多子页求职主页。纯静态 HTML/CSS/JS，无框架、无构建步骤，动效为原生 CSS + IntersectionObserver。

## 本地预览

```bash
cd site
python -m http.server 8765
# 打开 http://localhost:8765
```

> 必须通过 HTTP 访问（ES Modules 不支持 file:// 直开）。

## 页面结构

```
site/
├── index.html          # 主页：去雾签名交互 + 四产品实验台 + 工作/生活双模式
├── about.html          # 关于我：做事方式 + 数据快照
├── experience.html     # 经历：五段实习（含在岗职责方向）+ 校园经历
├── works.html          # 作品：四个自研产品 + 去雾毕业设计 + 8 篇推文 + 12 张证书
├── cv.html             # 在线履历（新版通用简历 + 用户补充项目，可打印）
├── life.html           # 生活：照片墙 + 爱好
├── contact.html        # 联系方式 + 快捷入口
├── dehaze.html         # 毕业设计独立体验页（介绍 + 在线 Demo）
├── 404.html            # 找不到页面提示（Surge 托管时自动承接所有 404 路径）
├── .surgeignore        # Surge 发布排除清单（语法同 .gitignore，当前排除 README.md）
├── css/style.css       # 全部样式（设计令牌在 :root）
├── js/
│   ├── app.js          # 全局交互：导航/遮罩/模式切换/拖拽墙/复制/渐显/演示入口注入
│   ├── config.js       # ★ 站点配置：DEHAZE_DEMO_URL（去雾演示页地址，部署后必填）
│   └── dehaze.js       # 去雾 Demo 参考实现（仅本地联调，页面未引用；契约见 AGENTS.md）
└── assets/
    ├── profile-hero.jpg / intro-hero.jpg   # 主页头像与开场大图
    ├── life/           # 生活照墙 life-01~12 + 随机竖照 life-p1~4
    ├── wx/             # 推文封面 w1~w8
    ├── certs/          # 证书原件（证件号已打码）
    ├── media/          # 片单/书架海报与歌曲封面
    ├── sample_hazy.jpg / sample_dehazed.png  # 去雾前后示例
    ├── resume.pdfx     # 2026 版简历 · 中文（实为 PDF；Surge 拦截 .pdf 扩展名，详见下）
    └── resume-en.pdfx  # 2026 版简历 · 英文（同上）
```

## 内容修改

- 文字内容分布在各 `*.html`，按板块就近修改
- 照片墙：替换 `assets/life/` 下同名文件即可
- 简历：中文替换 `assets/resume.pdfx`、英文替换 `assets/resume-en.pdfx`（文件名不变则无需改 HTML，全站 5 页 11 处下载入口——中文 6 处 + 英文 5 处——自动生效）
- ⚠️ **Surge 托管注意**：Surge 服务端拦截一切 `.pdf` 扩展名的文件（任何大小/命名都返回 404，与内容无关），故简历文件以 `.pdfx` 扩展名上传——页面下载按钮均带 `download` 属性，访客保存下来的文件名仍是「胡睿杰-简历-2026.pdf / HuRuijie-Resume-2026.pdf」，体验无差别。若换用其他不拦 .pdf 的托管（如 CloudBase），把文件改回 `.pdf` 并同步 HTML 里的 href 即可。

## 配置去雾在线演示（毕业设计对接）

在线演示由 dehaze-api 服务自带的演示页承载（同源调用，无 CORS 依赖）。在 `js/config.js` 中填入腾讯云 CloudBase 云托管分配的服务域名：

```js
export const DEHAZE_DEMO_URL = 'https://你的服务域名';
```

- 填好后，全站所有「在线体验 / 去雾演示」入口自动改为**新标签直跳**该演示页
- 留空时，入口指向站内介绍页 `dehaze.html`，演示卡显示「部署后开放」并附回填说明
- 服务冷启动（最小实例数为 0 时）首次访问约 10–40 秒，之后秒级返回
- `DEHAZE_API_BASE` 仅本地联调 `js/dehaze.js`（契约参考实现）时使用，线上不依赖
- 接口契约（`POST /dehaze`、`GET /health`）见仓库根目录 `AGENTS.md` 第三节

## 部署：CloudBase

当前仅更新腾讯云 CloudBase，Surge 自 2026-11-12 起暂停更新。

- 发布内容目录：`site/`；无依赖安装、无构建步骤，入口为 `index.html`。
- 如果使用 Git 来源，选择本仓库 `master` 分支，发布目录填写 `site`；如果手动上传，上传 `site/` 内的网页与资源，确保部署根目录直接包含 `index.html`。
- 不要上传仓库根目录的本地素材、毕业设计或工具文件。
- 发布后重点检查首页去雾滑杆、NoticeMe 作品与下载入口、手机布局、中英文简历下载。
- `CNAME` 和 `.surgeignore` 保留为历史兼容文件，不执行 Surge 发布，不影响 CloudBase 的静态页面内容。

## Git 版本与回退

改版前的 v39 已保存为远程标签 `frontend-v39-backup-20261112`，对应提交 `bffd93559e1f582ef6901e6119522a6578b061db`。该标签包含改版前完整的 `site/`，不混入新版未提交内容。

如需单独检查旧版，可创建独立检视分支（先保存当前工作区）：

```bash
git switch -c codex/review-frontend-v39 frontend-v39-backup-20261112
```

若要让发布分支撤销本轮改版，使用本轮改版提交的 `git revert <提交号>` 生成回退提交，再推送并在 CloudBase 发布。不要重置或强推共享分支历史。

## 2026-11-12 首页改版（v40）

- 新增 `css/studio.css`：暖纸底、墨色排版、电蓝强调的首页设计；新增 `css/project-previews.css`：作品页真实截图与界面示意。
- 新增 `js/studio.js`：去雾滑杆、清洗样例、天气时段、邮件归类；示例均为本地交互，天气不是实时预报，去雾为预生成真实结果。
- `assets/previews/` 保存 Data Helper 真实工作台和 NoticeMe 演示任务截图节选；不包含真实邮件或用户任务。NoticeMe 当前入口为 Windows 版下载与源码。
- 最新中英文通用 PDF 沿用 `resume.pdfx` / `resume-en.pdfx` URL，保存名仍为 `.pdf`；在线履历额外包含用户本轮提供的 NoticeMe。
- 五段实习包含和宏在岗经历，职责方向不作为已完成成果。四个独立产品包含两在线应用、MailHelper 和 NoticeMe，图像去雾作为毕业设计单列。
- 主体内容默认可读，脚本就绪后才增强滚动入场；两个模式分别保留阅读位置，支持减少动态效果偏好。
