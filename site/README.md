# 林霁 · 个人主页

视差滚动式求职个人主页。纯静态 HTML/CSS/JS，无框架、无构建步骤，动效基于 GSAP + ScrollTrigger + Lenis（均已下载到 `vendor/` 本地，不依赖外网 CDN）。

## 本地预览

```bash
cd site
python -m http.server 8765
# 打开 http://localhost:8765
```

> 必须通过 HTTP 访问（ES Modules 不支持 file:// 直开）。

## 目录结构

```
site/
├── index.html          # 主页（所有区块内容在这里改）
├── dehaze.html         # 毕业设计独立体验页（介绍 + 在线 Demo）
├── css/style.css       # 主题变量在 :root，双区氛围（暗色工作区 / 暖色生活区）
├── js/
│   ├── config.js       # ★ 去雾 API 地址等配置，部署前必改
│   ├── main.js         # 入口
│   ├── scroll.js       # Lenis 平滑滚动 + 锚点导航
│   ├── animations.js   # 入场/视差/浮现/数字滚动/导航状态
│   ├── dehaze.js       # 去雾 Demo（上传→推理→前后对比滑块）
│   └── gallery.js      # 照片墙拖拽横滑
├── vendor/             # gsap / ScrollTrigger / lenis 本地库
└── assets/             # 简历(docx)、示例雾图、favicon、照片墙占位图
```

## 填充真实素材（替换占位内容）

文字内容（姓名/经历/项目/联系方式）已按简历填充。还需要：

1. **简历 PDF**：下载按钮目前指向 `assets/resume.docx`，建议导出一份 PDF 放到 `assets/resume.pdf` 并把 `index.html` 里的链接改为 `.pdf`
2. **照片墙**：把 `assets/photos/p1.svg ~ p8.svg` 换成真实照片（建议同名 `jpg` 并同步改 `<img>` 的 `src`），说明文字在 `figcaption`
3. **在读/观影清单**：生活区"在动/在创作"两列如有更新直接改 `index.html`

## 配置去雾 API（毕业设计对接）

在 `js/config.js` 中填入腾讯云 CloudBase 云托管给 dehaze-api 分配的公网地址：

```js
export const DEHAZE_API_BASE = 'https://你的服务域名';
```

- 接口约定：`POST /dehaze`（multipart，字段名 `image`，PNG/JPG ≤10MB，返回 PNG）+ `GET /health` 预热
- 服务冷启动（最小实例数为 0 时）首次请求约 10–40 秒，页面已做预热（Demo 滚入视口时自动 ping `/health`）与计时提示
- 可选的后端一行改动：`app.py` 的 CORS 中间件加 `expose_headers=["X-Processing-Time"]`，前端即可显示"推理耗时 Xs"；上线后建议把 `allow_origins` 收紧为主页域名

## 部署

- **腾讯云 CloudBase 静态托管**：把 `site/` 目录整体上传（控制台"静态网站托管"或 `cloudbase framework deploy`），默认域名即可访问
- **Surge**（快速预览）：`cd site && npx surge`
