# 胡睿杰 · 个人主页

多子页档案式求职个人主页（布局参考 lizongqian-anime-hr.surge.sh）。纯静态 HTML/CSS/JS，无框架、无构建步骤，动效为原生 CSS + IntersectionObserver。

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
├── index.html          # 主页：开场遮罩（外滩暮色大图）+ 工作区/生活区双模式
├── about.html          # 关于我：做事方式 + 数据快照
├── experience.html     # 经历：四段实习拆解 + 校园经历
├── works.html          # 作品：3 个项目 + 8 篇推文墙 + 12 张证书墙
├── cv.html             # 在线履历（内容与 2026 版简历一致，可打印）
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
    ├── resume.pdf      # 2026 版简历 · 中文（下载按钮指向这里）
    └── resume-en.pdf   # 2026 版简历 · 英文（Resume 下载入口指向这里）
```

## 内容修改

- 文字内容分布在各 `*.html`，按板块就近修改
- 照片墙：替换 `assets/life/` 下同名文件即可
- 简历：中文替换 `assets/resume.pdf`、英文替换 `assets/resume-en.pdf`（文件名不变则无需改 HTML，全站 5 页 11 处下载入口——中文 6 处 + 英文 5 处——自动生效）

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

## 部署

### Surge（免费子域名，https://surge.sh）

发布的是**执行命令时所在的目录**——请务必先进入 `site/`，不要在仓库根目录执行（否则会把整个仓库传上去）：

```bash
cd site
npx surge
```

1. 首次运行按提示**注册/登录**（邮箱 + 密码，免费；也可先在 surge.sh 网页注册，账号通用）
2. 确认项目路径为当前目录（`site/`）
3. 输入子域名（先到先得，例如 `huruijie-home.surge.sh`），回车完成发布
4. 打开 `https://<你的子域名>.surge.sh` 验证（surge.sh 子域名自带 HTTPS）

- **后续更新**：改完内容重跑 `cd site && npx surge --domain <你的子域名>.surge.sh` 即覆盖发布
- **上传范围**：只有 `site/` 目录（约 7MB，全部为网页本体的图片/简历/代码）；仓库根的 `毕业设计/`、`photo/`、`我的cv/` 等本地素材不在其中
- `.surgeignore` 会把 `README.md` 排除在发布之外；`404.html` 由 Surge 自动承接所有不存在路径
- 想绑自定义域名：在 `site/` 放一个内容为域名的 `CNAME` 文件再发布，并到域名服务商配 DNS；免费版自定义域名仅 HTTP，HTTPS 需 Surge Pro

### 腾讯云 CloudBase 静态托管（国内访问更快）

把 `site/` 目录整体上传（控制台"静态网站托管"或 `cloudbase framework deploy`），默认域名即可访问，可作为国内主站与 Surge 并存。
