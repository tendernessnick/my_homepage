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

## 2026-11-13 子页改版（v41）

- 统一子页的暖纸底、墨色文字、电蓝交互、细线分隔、导航当前态、页内目录与上下篇入口，延续首页的个人手记与产品实验室设计。
- About围绕真实背景、工作方法与场景工具箱；Contact以邮箱为主，保留电话/微信/复制与全部材料入口。
- Works提供五项索引、提前体验与下载按钮，技术记录用原生details收纳，推文与证书保留；经历页区分在岗职责与已完成案例，完整过程可展开。
- CV保留全部正文，增加桌面/手机目录、按时间扫读与浏览器打印入口；下载PDF仍为现有通用版本，在线记录已额外加入NoticeMe。
- Life合并重复照片展示为12张接触印样，保留10项书影音和3首歌曲；原生dialog提供大图、前后翻页、Esc关闭与焦点返回，无JS时打开原图。
- 去雾页先展示真实对比滑杆，再说明独立演示、128KB/256px规格、离线指标与工程链路；404也采用同一语言。API契约与后端不变。
- 新增css/folio.css（公共），folio-profile.css（About/Contact），folio-records.css（作品/经历/CV），folio-life.css（生活）；新增js/folio.js（目录/打印/折叠定位）与gallery.js（相册）。
- 后续材料可补：包含NoticeMe的新版中英文简历PDF；和宏实际完成且可公开的成果；附时间/基准/费用口径的量化回测图；Weather/Mail脱敏真实界面或短录屏；照片真实地点/日期/拍摄手记、网球实拍或公开视频。现版没有依赖这些素材的空占位。

## 2026-11-13 体验完善（v42）

- 首页生活模式改为3帧精选与档案入口，完整12图/10项书影音/3首歌只在Life页维护，地点统一为上海出发、现于深圳实习。新增css/life-preview.css，模式保持各自阅读位置与减少动态效果支持。
- 首页与去雾页可直接在画面中拖动对比分界；原生滑杆保留键盘/读屏操作。Pointer横拖、纵向滚动、取消捕获各自处理，图片原生拖拽禁用。
- 手机首页重要说明约14.5–15px、操作文字13px；底栏实际目标至少44px高，极窄320px宽度也保留约44px宽。演示卡按内容撑开。手机作品索引改一行可滚，支持键盘与滚动吸附。
- WebP响应式图源位于assets/dehaze/，源雾图1024²、去雾结果512²，未伪放大。480对图合计160864B（比原始967973B少83.4%）；960/512高档合计321136B（少66.8%）。这代表文件体积变化，线上CloudBase加载耗时尚需部署后实测。原始JPG/PNG保留并可从去雾页打开。
- 复制按钮固定原标签、处理并发点击与单一计时器；后备复制检查返回值，失败时给真实提示，并恢复焦点/选区/滚动位置。
- 验收：45次页面/宽度组合（9页×320/390/768/1280/1536）无横向溢出或主要文字/组件裁切。390px作品索引107px，首预览598px；320px底栏入口约44.28×44px，四个演示卡无内容裁切。浏览器实测首页图内拖至80%/20%、键盘100%、去雾页75%，复制连点后恢复原文案；触摸横/纵与取消边界做事件序列测试，未作为真机测试或线上测速结果。

## 2026-11-14 进化版（v43）

- 首页主张改为“把复杂的事，做得清楚”，暗墨实验台、酸绿强调与纸白阅读区配合。保留真实去雾对比，作品采用完整舞台与并置预览，新增筛选和设计取舍。
- `css/evolution.css` / `js/evolution.js`：全站设计、快捷搜索（Ctrl / Command + K）、静态语言导航的增强、首页筛选与阅读定位。模式开关进入首页导航，不遮挡正文。
- `css/evolution-pages.css`：About人物、Works作品索引、Life摄影展、Contact邮件入口以及经历/CV/去雾/404的差异化布局。
- `data-case.html` / `css/evolution-case.css` / `js/evolution-case.js`：基于公开留存记录的 Data Helper 解释案例；附源数据署名、SQL与字段投影示意。案例未在本轮重跑，示意数据明确虚构，投影不删除行。
- `en.html` / `css/evolution-en.css`：精炼英文招聘入口，深度材料继续链接中文页，不承诺整站双语。现有PDF未改，新版PDF材料同步后再替换。
- `assets/og-cover.png`：1200×630分享封面；`assets/avatar-96.webp` 与 `assets/previews/*-640.webp` / `data-workbench-1280.webp` 为响应式预览，原图链接保留。
- Works天气项目改用真实公共首页截图 `assets/previews/weather-current.webp`，采于2026-11-14 13:09 HKT；图中数值属于历史快照，不是当前天气。首页小样继续使用明确标注的固定样例。
- Weather统一入口已据仓库迁移文档和HTTP验证更新为CloudBase。前端和演示后端仍分离；去雾API契约未变，不操作独立后端或发布控制台。
- 维护细节、研究依据、素材优先级与验收边界见仓库根 `docs/evolution-20261114/README.md`。资源查询版本统一v43；发布根仍为`site/`，无新构建或线上依赖，Surge暂停更新。
