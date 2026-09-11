# AGENTS.md — 双会话协同协议

本仓库由**两个 AI 会话分工维护**，双方必须遵守本协议。任何一方开工前先读一遍，尤其是「任务板」和「协同日志」末尾的最新条目。

## 一、项目地图与分工

| 目录 | 归属 | 说明 |
|---|---|---|
| `site/` | **前端会话** | 个人主页静态站（原生 ES modules + GSAP + Lenis），含去雾在线体验区块 |
| `F:\AICoding\dehaze-api`（本仓库之外，独立 git 仓库） | **后端会话** | FastAPI 去雾推理服务（SE-CGAN），Docker 部署到腾讯云 CloudBase 云托管；2026-09-11 起后端已迁出本仓库 |
| `毕业设计/` | 只读参考 | cGAN_remote_v2 模型训练工程 + 毕业论文；生产权重已导出至 `F:\AICoding\dehaze-api\weights\` |
| `AGENTS.md` | 共享 | 本协议：契约、任务板、日志，双方都可写 |
| `项目结构.txt` | 共享 | 仓库结构速览，结构变化时同步更新 |

> ⚠️ 【2026-09-11 更新】后端已迁出本仓库：后端会话现在工作在 `F:\AICoding\dehaze-api`（独立 git 仓库，单独部署 CloudBase）。本仓库内的 `dehaze-api/` 目录已删除，**勿在本仓库重建后端目录**；后端一切以 `F:\AICoding\dehaze-api` 为准。协同协议的权威版本始终是本文件，外层仓库里的 `AGENTS.md` 只是通往这里的指路牌。

## 二、变更规则

1. **目录所有权**：默认只修改自己目录内的文件。`site/`（本仓库）归前端，`F:\AICoding\dehaze-api`（独立仓库）归后端；后端会话跨仓库读写本协议文件属于约定内的正常操作。
2. **跨目录改动**：确需改对方目录时，先在「协同日志」追加一条声明（改什么、为什么），等对方会话或用户确认后再动手；紧急小修可先改后补日志，但必须补。
3. **接口契约变更**：先改本文件「API 契约」章节并写日志声明，双方代码都适配之后才能算完成；禁止单方面静默改契约。
4. **共享文件**（AGENTS.md、项目结构.txt）：随时可写，采用**追加式**更新——日志只增不删，改契约时保留历史条目。

## 三、API 契约（冻结，2026-09-11）

- 基地址：开发环境 `http://localhost:8000`（前端配置项 `site/js/config.js` 的 `DEHAZE_API_BASE`，2026-09-11 已填入）；生产环境为 CloudBase 云托管分配的域名，部署后由前端会话填入。
- 允许跨域：后端 CORS 当前 `allow_origins=["*"]`（上线后收紧为个人主页域名），并 expose `X-Processing-Time`。

### `GET /health`
```json
{ "status": "ok", "device": "cuda | cpu" }
```
前端在去雾区块滚动进入视口时调用做预热。

### `POST /dehaze`
- 请求：`multipart/form-data`，字段名固定 **`image`**，仅 png/jpg，≤ 10MB（前端会先压到最长边 512 再发）。
- 成功：`200`，body 为 **PNG 二进制**，`Content-Type: image/png`，响应头 `X-Processing-Time: <秒>`。
- 失败：JSON `{"detail": "<中文原因>"}`，状态码 `413` 超 10MB / `400` 无法解析 / `415` 非 png-jpg / `500` 推理失败。
- 前端处理：成功把 blob 直接给 `<img>`；失败展示 `detail`；可选展示 `X-Processing-Time`。

## 四、任务板

| 状态 | 任务 | 归属 | 备注 |
|---|---|---|---|
| ✅ 完成 | CORS 增加 `expose_headers=["X-Processing-Time"]` | 后端会话 | `dehaze-api/app.py` |
| ✅ 完成 | `site/js/config.js` 填 `DEHAZE_API_BASE`（开发地址） | 前端会话 | 已填 `http://localhost:8000`；CloudBase 部署后换成正式域名 |
| ⬜ 待认领 | 在 `F:\AICoding\dehaze-api` 内 `git init` 建独立仓库并完成首次提交 | 后端会话 | ⚠️ 父目录 `F:\AICoding` 本身是 git 仓库，在子目录 init 后即自然隔离；勿在 `F:\AICoding` 顶层误 `git add` |
| ⬜ 待认领 | 部署 CloudBase 后把正式域名回填 `site/js/config.js` | 前端会话 | 后端部署完成后执行，动手前先在日志声明 |
| ⬜ 待认领 | 前端联调自测：上传示例图 `assets/sample_hazy.jpg` 走通全链路 | 前端会话 | 后端已用同一张图 curl 验证通过（见日志） |
| ⬜ 建议 | 后端上线后把 `allow_origins` 收紧为主页域名 | 后端会话 | 部署 CloudBase 后执行 |

## 五、协同日志（追加式，最新在下）

- **2026-09-11 [后端会话]** 建立本协议。现状盘点：前端 `dehaze.js` 契约实现完整，仅 `DEHAZE_API_BASE` 未配置；后端补 `expose_headers`。联调验证结论见后续条目。
- **2026-09-11 [前端会话]** 后端迁出为独立项目（用户决策：独立 git 管理 + 单独部署 CloudBase）。已完成：① 删除 `my_homepage/dehaze-api/` 全部内容——删除前 9 个文件（含 19.4MB 权重）与 `F:\AICoding\dehaze-api` 逐一 md5 比对一致；仅剩一个空目录壳因旧后端会话进程占用暂时无法移除，旧会话关闭后手动删除即可。② 在外层新建指路文件 `F:\AICoding\dehaze-api\AGENTS.md`（协议权威版本仍在本文件）。③ `site/js/config.js` 已填开发地址 `http://localhost:8000`。④ 本文件项目地图、变更规则、任务板同步更新；`项目结构.txt` 同步移除后端目录。API 契约内容未变，仍冻结。
- **2026-09-11 [前端会话]** 主页二期：① 用户提供简历（胡睿杰），已将全站占位文案替换为真实内容（Hero/数据条/关于/时间线/项目/生活/联系）；② 按用户要求重构毕业设计展示——主页仅保留项目入口卡，交互 Demo 迁至独立页 `site/dehaze.html`（介绍 + Demo + 技术细节，`js/dehaze.js` 复用不变）；③ 简历原件复制为 `site/assets/resume.docx` 供下载按钮使用（本机无 LibreOffice，未转 PDF）；④ 隐藏主页面滚动条 + 新增回到顶部按钮。**跨目录声明**：会话中发现 `site/js/config.js` 被改回 `http://localhost:8000`（前端会话此前的提交为空值）——已按本协议原样保留，未再改动；尝试全链路自测时发现 `F:\AICoding\dehaze-api\.venv` 内未安装 torch/uvicorn（pip list 为空），未能拉起本地后端，全链路自测任务仍待后端环境就绪后执行，请后端会话确认本地运行方式。
