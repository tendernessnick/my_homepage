# 四个工具项目的简历改写

2026-11-19 用户要求改善简历中四个 Vibe Coding 项目的表达，用实际场景、功能与有价值的发现替代工程、测试数量和部署平台说明。

## 已完成

- 指定中文 PDF 中补入原先缺少的 NoticeMe，四个工具分别为 NoticeMe、MailHelper、Data Helper、Weather Helper；保留 IS6335 与 VR 项目，共六项。
- 四个工具各两条：使用场景与功能，以及真实案例、反馈机制或分析判断。标题保留独立开发、AI 辅助及交付状态。
- 中文 PDF 页眉和技能中的项目数更新为四个；保持两页、原字号和行距。其他教育、实习、校园、荣誉及现有出租车/VR 内容未改。
- 同步本地 `site/cv.html` 对应四项文字及 `site/assets/resume.pdfx` 中文下载资产。英文 PDF 仍为原版本。未提交、推送或部署。
- 完整文案保存在 `我的cv/四个工具项目_简历文案_20261119.md`；排版源为 `我的cv/_build/resume.html`。修改前文件保存在 `我的cv/_build/backup_20261119_vibecoding/`。

## 依据与表述边界

- Data Helper：当前 README 与 `backend/app/api.py` 支持清洗预览、确认应用、回溯和复检。`examples/ecommerce/results/00_upload_meta.json` 记录 1,067,371 行，`02_health_check_clean.json` 记录筛选后 805,549 行。`scripts/run_ecommerce_analysis.py` 按客户标识非空、数量/单价为正、排除取消单等条件筛选并分析。这是交易明细的业务口径筛选，不是订单数、清洗准确率或质量评分提升。
- Weather Helper：当前 README、`backend/app/services/verification.py` 与 `docs/optimization-20261114/VALIDATION.md` 支持 57 球场、具体场次风险、时段选场、事前快照与双轨验证；融合值为启发式风险指数，不能称为已验证的降雨概率或准确率提升。
- MailHelper：当前 README、`FeedbackService.cs`、`CanvasDdlExtractor.cs` 支持七类/P0-P3、待确认与反馈规则、Canvas 模板截止事项及提醒。不能扩展为任意邮件的通用截止识别。
- NoticeMe：当前 README、`QuickAdd.tsx`、`JournalView.tsx` 支持任务、今日计划、日记、重复提醒、规则式自然语言及可选本地 AI；AI 提议预览确认后保存。沿用 Windows 版已发布标签，不推断 macOS 发布状态。

本次核查本地当前资料、代码与保存的案例结果，未重新执行产品的完整测试或在线可用性验证，没有加入用户数、提效百分比或收益提升等缺乏证据的指标。

## 验证

两页逐页渲染检查与独立视觉复核通过；项目外文案仅有项目数量相关更正，出租车与 VR 原块保留。最终 PDF 与中文下载资产哈希一致；验收记录在 `我的cv/_build/vibecoding_20261119/validation.json`。
