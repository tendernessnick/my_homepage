# 胡睿杰个人主页 · 静态站点目录（`site/`）

本目录为胡睿杰个人主页 2026-11-20 独立全量重设计版本（原生 HTML5 / CSS / ES Modules，零构建步骤），可直接作为静态目录发布托管（如 CloudBase 静态网站托管），原 `assets/` 素材与部署元数据（`CNAME`、`.surgeignore`）均按原字节保留。

## 本地预览

在仓库根目录或 `site/` 目录执行任意静态 HTTP 服务即可预览，例如：

```powershell
python -m http.server 8080 -d "F:\AICoding\my_homepage\site"
```

启动后访问 `http://127.0.0.1:8080/index.html`。

## 单一服务配置文件

外部应用与交互展示入口统一维护在 `site/js/config.js`：

- `DEHAZE_DEMO_URL`：SE-CGAN 独立去雾演示页（本站保持纯静态，不接管上传与推理）
- `WEATHER_APP_URL`：香港网球天气助手入口
- `DATAHELPER_DEMO_URL`：Data Helper 在线工作台入口
- `TAXI_TABLEAU_URL`：NYC Taxi（CityU IS6335）Tableau 交互展示入口；当前留空，全站中英文相关位置自动显示不可点击的“待接入”状态，填入有效 `http(s)://` 地址后自动统一激活。

## 页面分组（共 11 个独立路由）

| 路由 | 说明 |
| --- | --- |
| `index.html` | 首页（工作与生活全貌 + 视角切换 + 速览档案） |
| `about.html` | 关于本人、工作方法与按场景划分的工具箱 |
| `experience.html` | 五段实习（区分和宏在岗职责方向与已完成实习）、校园经历与工程落地 |
| `works.html` | 六项代表作品筛选、8 篇公众号代表推文与 12 张证书原件墙 |
| `cv.html` | 在线简历、打印优化与中英文 PDF 下载 |
| `life.html` | 12 帧摄影作品与花絮灯箱、网球/剪辑及片单书架歌单 |
| `contact.html` | 邮箱、电话、微信（含一键复制与失败提示）及材料下载 |
| `dehaze.html` | SE-CGAN 去雾对比实验、离线/在线规格说明与 API 契约 |
| `data-case.html` | Data Helper 评分下降深度数据判断案例（UCI Online Retail II） |
| `en.html` | 精炼英文总览入口（非全站逐字双语） |
| `404.html` | 可返回站内核心入口的错误页 |

## 设计与交付文档

完整设计取舍、数据口径核对、验收报告及新站截图归档于：
`docs/gemini-independent-redesign-20261120/`
