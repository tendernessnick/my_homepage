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
├── css/style.css       # 全部样式（设计令牌在 :root）
├── js/
│   ├── app.js          # 全局交互：导航/遮罩/模式切换/拖拽墙/复制/渐显
│   ├── config.js       # ★ 去雾 API 地址等配置，部署前必改
│   └── dehaze.js       # 去雾 Demo（上传→推理→前后对比滑块）
└── assets/
    ├── profile-hero.jpg / intro-hero.jpg   # 主页头像与开场大图
    ├── life/           # 生活照墙 life-01~12 + 随机竖照 life-p1~4
    ├── wx/             # 推文封面 w1~w8
    ├── certs/          # 证书原件（证件号已打码）
    ├── sample_hazy.jpg / sample_dehazed.png  # 去雾前后示例
    └── resume.docx     # 2026 版简历（下载按钮指向这里）
```

## 内容修改

- 文字内容分布在各 `*.html`，按板块就近修改
- 照片墙：替换 `assets/life/` 下同名文件即可
- 简历：替换 `assets/resume.docx`（建议后续提供 PDF）

## 配置去雾 API（毕业设计对接）

在 `js/config.js` 中填入腾讯云 CloudBase 云托管给 dehaze-api 分配的公网地址：

```js
export const DEHAZE_API_BASE = 'https://你的服务域名';
```

- 接口约定：`POST /dehaze`（multipart，字段名 `image`，PNG/JPG ≤10MB，返回 PNG）+ `GET /health` 预热
- 服务冷启动（最小实例数为 0 时）首次请求约 10–40 秒，页面已做预热（Demo 滚入视口时自动 ping `/health`）与计时提示
- `X-Processing-Time` 响应头已由后端 expose，前端会显示"推理耗时 Xs"

## 部署

- **腾讯云 CloudBase 静态托管**：把 `site/` 目录整体上传（控制台"静态网站托管"或 `cloudbase framework deploy`），默认域名即可访问
- **Surge**（快速预览）：`cd site && npx surge`
