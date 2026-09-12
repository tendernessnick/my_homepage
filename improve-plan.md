# 主页打磨清单（2026-09-13 凌晨批次）

> 目标：分模块对个人主页「缝缝补补」，继续对标参考站 lizongqian-anime-hr.surge.sh。
> 执行方式：每小时一个定时任务，**每轮只做一个条目**，做完即提交推送，7:00 前结束。
> 进度标记：完成一条就把 `[ ]` 勾成 `[x]`（也可用 `git log --oneline` 里的 `polish(N:` 前缀判断进度）。

## 通用规则（每轮都适用）

- 大框架不动：导航、主页双模式结构、开场遮罩、各页骨架一律不改。
- 设计语言沿用 `site/css/style.css` 现有令牌与组件（浅灰纸张 + 墨色描边 + 硬偏移阴影 / 主页 Apple 白卡）。
- **不得编造个人资料**：书影音、歌单、旅行国家等保持现有占位，只使用仓库与简历中已有的事实。
- 改了 CSS/JS 就把全站版本号 `?v=N` 统一 +1（HTML 引用 + `app.js` 的 config import 同步）；纯 HTML 改动不 bump。
- 验收：`python -m http.server 8137 --directory site` 起服务，浏览器截图（桌面 1280 + 移动 390）确认无溢出无破图，测完关停。
- 收尾：本文件勾选 + `AGENTS.md` 协同日志追加一条 + `git add -A` 提交（`polish(N: 模块): 一句描述`）+ `git push`。

## 清单

- [x] **polish 1 · contact.html**（参考 [contact 页](https://lizongqian-anime-hr.surge.sh/contact.html)）
  PHONE/EMAIL/WECHAT 三行拆成三张独立联系方式卡（参考站为三卡结构），行内动作保留 拨打+复制 / 写信+复制；Quick Links 增加一条 GitHub 外链卡（`https://github.com/tendernessnick`，用户真实账号，git remote 可查证）；页头辅助语微调。
- [x] **polish 2 · cv.html**（参考 [cv 页](https://lizongqian-anime-hr.surge.sh/cv.html)）
  `contact-stack` 的电话加 `tel:`、邮箱加 `mailto:` 链接（参考站为纯文本，我们做成可点击更好用）；核对打印样式（@media print）下 CV 正文完整、按钮导航隐藏；「校园经历」「荣誉」两条与对应 works 锚点链接的有效性检查。
- [x] **polish 3 · index.html 工作区**（参考 [首页](https://lizongqian-anime-hr.surge.sh/)）
  `profile-actions` 增加「下载简历」按钮（`assets/resume.docx` + download 属性，对齐参考站 hero 的「查看经历/下载简历」双按钮结构，与开场遮罩按钮一致）；hero 数据条与「求职意向」条间距排版微调；**不动**双模式与遮罩逻辑。
- [ ] **polish 4 · life.html**（参考 [life 页](https://lizongqian-anime-hr.surge.sh/life.html) 锚点标签组）
  页头下新增参考站式分类锚点标签（如 网球·创作 / 片单书架 / 镜头·足迹，跳到对应 section），为缺 id 的目标 section 补 id；移动端锚点换行检查。
- [ ] **polish 5 · dehaze.html**（参考 [works 页](https://lizongqian-anime-hr.surge.sh/works.html) 的纯排版面板）
  介绍区补一组指标卡（PSNR 28.05 / SSIM 0.9707 / 输入最长边 256 / 云端 CPU 秒级推理——全部为简历与后端契约已有事实）；「技术细节」三卡下补「工程链路」`output-panel`（桌面演示→服务化→容器化→上云，文案与 experience.html Case 05 保持一致）；演示卡外链两态逻辑不动。
- [ ] **polish 6 · works.html + 全站回归**（参考 works 页 Flagship 主推标记）
  Flagship 01 加「主推」徽章（参考站 `Flagship 01 · 主推` 样式）；随后全站走查一遍（8 个页面 × 桌面+移动），修发现的小问题（溢出/破图/死链/版本号遗漏/书影音占位标记缺失），无问题则以页脚签名一致性检查收尾。
