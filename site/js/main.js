/* ==========================================================================
   Core Site Runtime: Service Links, Copy Feedback, Mobile Drawer,
   Command Search Palette, Works/Lens Filters, Anchor Disclosure Auto-Open
   ========================================================================== */

import { resolveServiceUrl } from "./config.js";

const SEARCH_INDEX = [
  { title: "Data Helper · 数据分析小助手", desc: "Excel/CSV 体检、清洗预览确认、回溯与 DuckDB SQL（在线应用）", url: "works.html#data-helper", tag: "产品 / 作品", kw: "data helper excel csv sql duckdb uci 清洗 体检" },
  { title: "Data Helper 数据判断案例：为什么清洗后评分下降？", desc: "UCI Online Retail II 1,067,371 → 805,549 行，83.4 → 77.5 分深度拆解", url: "data-case.html", tag: "深度案例", kw: "data case 83.4 77.5 重复 投影 口径 uci online retail" },
  { title: "NYC Taxi 纽约出租车运营分析（CityU IS6335）", desc: "4,145,257 → 3,801,542 行程；JFK 2.73% 行程 / 10.12% 票面毛收入", url: "works.html#nyc-taxi", tag: "数据分析", kw: "nyc taxi is6335 jfk 2.73 10.12 r python tableau 出租车" },
  { title: "Weather Helper · 香港网球天气助手", desc: "香港 57 公共网球场，启发式降雨风险指数、事前快照与双轨验证", url: "works.html#weather-helper", tag: "产品 / 作品", kw: "weather helper 网球 天气 香港 57 球场 swirls" },
  { title: "NoticeMe · 待办、提醒与日记", desc: "Windows 版已发布；本地优先、自然语言记任务、可选本机 AI 预览确认", url: "works.html#noticeme", tag: "桌面工具", kw: "noticeme windows electron 待办 提醒 日记" },
  { title: "MailHelper · 校园邮件管家", desc: "七类/P0-P3 分级、人工纠错沉淀规则、Canvas 模板截止提取", url: "works.html#mail-helper", tag: "桌面工具", kw: "mailhelper 邮件 canvas ddl wpf avalonia" },
  { title: "SE-CGAN 单幅图像去雾（毕业设计）", desc: "真实预生成雾图/去雾拖动对比 + CloudBase 在线推理演示入口", url: "dehaze.html", tag: "视觉研究", kw: "dehaze se-cgan 去雾 pytorch fastapi 256px 128kb" },
  { title: "实习经历：深圳和宏（战略与投资部 · 在岗）", desc: "2026.10–至今 · 消费电子产业链、竞品对标与战略研究职责方向", url: "experience.html#hehong", tag: "在岗实习", kw: "和宏 战略 投资 深圳 消费电子 实习" },
  { title: "实习经历：北京外企德科（业务数据分析）", desc: "900 条 AI 招聘运营明细转化分析、257 人面试协调、批量归档工具链", url: "experience.html#waifuyuan", tag: "实习案例", kw: "外企德科 fesco adecco 900 257 漏斗 转化" },
  { title: "实习经历：海南钰泰私募（投资经理助理）", desc: "651 只股票多因子打分、股指期权 5 步回测流水线、Fama-French 复现", url: "experience.html#yutai", tag: "量化实习", kw: "钰泰 私募 651 多因子 期权 covered call fama french" },
  { title: "实习经历：睿鑫信息 & 江苏今点软件", desc: "ARM 开发板调试与文档管理；政务平台 APP 功能修改与接口测试", url: "experience.html#ruixin", tag: "工程实习", kw: "睿鑫 今点 arm 嵌入式 测试 文档" },
  { title: "在线简历与中英文 PDF 下载", desc: "完整教育背景、五段实习、六项项目、证书荣誉与可打印版本", url: "cv.html", tag: "简历 CV", kw: "cv resume 简历 pdf 下载 雅思 7.0 gpa 4.1" },
  { title: "关于胡睿杰（教育背景与方法论）", desc: "常州大学计算机本科 GPA 4.1/5 × 香港城市大学 MSc AIB 硕士在读", url: "about.html", tag: "关于我", kw: "about 关于 城市大学 cityu 常州大学 华罗庚" },
  { title: "摄影、网球与书影音档案", desc: "12 帧摄影作品、网球协会社长经历、电影/番剧/书籍与歌单", url: "life.html", tag: "生活档案", kw: "life 摄影 照片 网球 电影 书影音 歌单" },
  { title: "联系方式（邮箱 / 电话 / 微信 / GitHub）", desc: "921458257@qq.com · 18916647173 · nick921458257", url: "contact.html", tag: "联系", kw: "contact 联系 邮箱 电话 微信 github" },
  { title: "English Overview / 英文精炼入口", desc: "Concise English profile, products, internships & CV downloads", url: "en.html", tag: "EN", kw: "english en summary profile" }
];

/* Toast Helper */
export function showToast(message, isError = false) {
  let region = document.getElementById("toast-region");
  if (!region) {
    region = document.createElement("div");
    region.id = "toast-region";
    region.className = "toast-region";
    region.setAttribute("role", "status");
    region.setAttribute("aria-live", "polite");
    document.body.appendChild(region);
  }
  const el = document.createElement("div");
  el.className = isError ? "toast toast--error" : "toast";
  el.textContent = message;
  region.appendChild(el);
  window.setTimeout(() => {
    el.remove();
  }, 3400);
}

/* Hydrate Dynamic Service Links from config.js */
function hydrateServiceLinks() {
  document.querySelectorAll("[data-service-slot]").forEach((slot) => {
    const key = slot.getAttribute("data-service-slot");
    const url = resolveServiceUrl(key);
    const activeLabel = slot.getAttribute("data-active-label") || "打开在线体验 ↗";
    const pendingLabel = slot.getAttribute("data-pending-label") || "交互展示待接入";
    const linkClass = slot.getAttribute("data-link-class") || "btn btn--primary btn--sm";

    if (url) {
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.className = linkClass;
      a.textContent = activeLabel;
      slot.replaceChildren(a);
    } else {
      const span = document.createElement("span");
      span.className = "service-pending";
      span.setAttribute("aria-disabled", "true");
      span.textContent = pendingLabel;
      slot.replaceChildren(span);
    }
  });

  document.querySelectorAll("[data-service-status]").forEach((node) => {
    const key = node.getAttribute("data-service-status");
    const url = resolveServiceUrl(key);
    const activeText = node.getAttribute("data-active-text");
    const pendingText = node.getAttribute("data-pending-text");
    if (url && activeText) {
      node.textContent = activeText;
    } else if (!url && pendingText) {
      node.textContent = pendingText;
    }
  });
}

/* Copy Buttons with Clipboard API + ExecCommand Fallback + Explicit Failure Notice */
function initCopyButtons() {
  document.querySelectorAll("[data-copy-text]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const value = btn.getAttribute("data-copy-text") || "";
      const label = btn.getAttribute("data-copy-label") || "内容";
      const originalText = btn.textContent;
      let copied = false;

      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(value);
          copied = true;
        } catch {
          copied = false;
        }
      }

      if (!copied) {
        try {
          const ta = document.createElement("textarea");
          ta.value = value;
          ta.setAttribute("readonly", "");
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.focus();
          ta.select();
          copied = document.execCommand("copy");
          ta.remove();
        } catch {
          copied = false;
        }
      }

      if (copied) {
        btn.textContent = btn.getAttribute("data-copied-text") || "已复制";
        showToast(`已复制${label}：${value}`);
        window.setTimeout(() => {
          btn.textContent = originalText;
        }, 2000);
      } else {
        const failMsg = btn.getAttribute("data-fail-text") || `复制失败，请手动选中：${value}`;
        showToast(failMsg, true);
      }
    });
  });
}

/* Mobile Drawer with Focus Trap & Esc Close */
function initMobileDrawer() {
  const toggle = document.querySelector("[data-drawer-open]");
  const drawer = document.getElementById("mobile-drawer");
  if (!toggle || !drawer) return;

  const closeBtns = drawer.querySelectorAll("[data-drawer-close]");
  let lastTrigger = null;

  const open = () => {
    lastTrigger = document.activeElement;
    drawer.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    const first = drawer.querySelector("button, a");
    if (first) first.focus();
  };

  const close = () => {
    if (drawer.hidden) return;
    drawer.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    if (lastTrigger && typeof lastTrigger.focus === "function") {
      lastTrigger.focus();
    }
  };

  toggle.addEventListener("click", open);
  closeBtns.forEach((b) => b.addEventListener("click", close));
  drawer.addEventListener("click", (e) => {
    if (e.target === drawer) close();
  });
  drawer.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !drawer.hidden) {
      e.preventDefault();
      close();
    }
  });
}

/* Quick Site Search Command Palette */
function initCommandPalette() {
  const triggers = document.querySelectorAll("[data-cmd-open]");
  if (!triggers.length) return;

  let backdrop = document.getElementById("cmd-backdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.id = "cmd-backdrop";
    backdrop.className = "cmd-backdrop";
    backdrop.hidden = true;
    backdrop.setAttribute("role", "dialog");
    backdrop.setAttribute("aria-modal", "true");
    backdrop.setAttribute("aria-label", "站内快速索引");
    backdrop.innerHTML = `
      <div class="cmd-dialog">
        <div class="cmd-input-row">
          <span class="mono" aria-hidden="true">/</span>
          <input type="search" class="cmd-input" id="cmd-search-input" placeholder="搜索项目、实习、简历或案例（如：Data Helper、IS6335、和宏、去雾）…" autocomplete="off" />
          <button type="button" class="icon-btn" data-cmd-close aria-label="关闭搜索">Esc</button>
        </div>
        <div class="cmd-results" id="cmd-results" role="listbox"></div>
        <div class="cmd-foot">
          <span>输入关键词即时筛选</span>
          <span class="mono">↑ ↓ 选择 · Enter 跳转 · Esc 关闭</span>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);
  }

  const input = backdrop.querySelector("#cmd-search-input");
  const list = backdrop.querySelector("#cmd-results");
  const closeBtn = backdrop.querySelector("[data-cmd-close]");
  let lastTrigger = null;
  let activeIndex = 0;

  const render = (query = "") => {
    const q = query.trim().toLowerCase();
    const matches = q
      ? SEARCH_INDEX.filter((item) =>
          `${item.title} ${item.desc} ${item.tag} ${item.kw}`.toLowerCase().includes(q)
        )
      : SEARCH_INDEX;

    activeIndex = 0;
    if (!matches.length) {
      list.innerHTML = `<div style="padding:1.25rem;text-align:center;color:var(--ink-muted);font-size:0.875rem;">未找到匹配条目，可尝试搜索“简历”“实习”“Data Helper”或“去雾”。</div>`;
      return;
    }

    list.innerHTML = matches
      .map(
        (m, idx) => `
          <a class="cmd-item" href="${m.url}" role="option" aria-selected="${idx === 0 ? "true" : "false"}">
            <span>
              <span class="cmd-item__title">${m.title}</span>
              <span class="cmd-item__desc">${m.desc}</span>
            </span>
            <span class="cmd-item__tag">${m.tag}</span>
          </a>`
      )
      .join("");
  };

  const open = () => {
    lastTrigger = document.activeElement;
    backdrop.hidden = false;
    document.body.style.overflow = "hidden";
    render("");
    input.value = "";
    input.focus();
  };

  const close = () => {
    if (backdrop.hidden) return;
    backdrop.hidden = true;
    document.body.style.overflow = "";
    if (lastTrigger && typeof lastTrigger.focus === "function") {
      lastTrigger.focus();
    }
  };

  triggers.forEach((btn) => btn.addEventListener("click", open));
  closeBtn.addEventListener("click", close);
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) close();
  });

  input.addEventListener("input", () => render(input.value));
  input.addEventListener("keydown", (e) => {
    const items = Array.from(list.querySelectorAll(".cmd-item"));
    if (!items.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeIndex = (activeIndex + 1) % items.length;
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIndex = (activeIndex - 1 + items.length) % items.length;
    } else if (e.key === "Enter") {
      e.preventDefault();
      items[activeIndex].click();
      close();
      return;
    } else {
      return;
    }
    items.forEach((el, i) => el.setAttribute("aria-selected", i === activeIndex ? "true" : "false"));
    items[activeIndex].scrollIntoView({ block: "nearest" });
  });

  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (backdrop.hidden) open();
      else close();
    } else if (e.key === "Escape" && !backdrop.hidden) {
      e.preventDefault();
      close();
    }
  });
}

/* Home Lens Filter (All / Work / Life) & Works Category Filter */
function initFilterGroups() {
  document.querySelectorAll("[data-filter-group]").forEach((group) => {
    const targetSelector = group.getAttribute("data-filter-target");
    const buttons = Array.from(group.querySelectorAll("[data-filter-value]"));
    const items = Array.from(document.querySelectorAll(targetSelector));
    const statusEl = group.getAttribute("data-filter-status")
      ? document.querySelector(group.getAttribute("data-filter-status"))
      : null;

    if (!buttons.length || !items.length) return;

    const apply = (val) => {
      let visibleCount = 0;
      buttons.forEach((btn) => {
        btn.setAttribute("aria-pressed", btn.getAttribute("data-filter-value") === val ? "true" : "false");
      });
      items.forEach((item) => {
        const cats = (item.getAttribute("data-category") || "").split(/\s+/);
        const show = val === "all" || cats.includes(val);
        item.classList.toggle("is-lens-hidden", !show);
        if (show) visibleCount += 1;
      });
      if (statusEl) {
        const tpl = statusEl.getAttribute("data-template") || "当前显示 {n} 项";
        statusEl.textContent = tpl.replace("{n}", String(visibleCount));
      }
    };

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => apply(btn.getAttribute("data-filter-value")));
    });
  });
}

/* Auto-open <details> if hash points inside it, and ensure hidden lens reveals target */
function revealHashTarget() {
  const hash = window.location.hash;
  if (!hash || hash.length < 2) return;
  const target = document.getElementById(decodeURIComponent(hash.slice(1)));
  if (!target) return;

  // Reveal if hidden by filter
  let cur = target;
  while (cur && cur !== document.body) {
    if (cur.classList && cur.classList.contains("is-lens-hidden")) {
      cur.classList.remove("is-lens-hidden");
      const allBtn = document.querySelector('[data-filter-value="all"]');
      if (allBtn) allBtn.click();
    }
    if (cur.tagName === "DETAILS") {
      cur.open = true;
    }
    cur = cur.parentElement;
  }
}

/* Print Button on CV */
function initPrintButtons() {
  document.querySelectorAll("[data-print-page]").forEach((btn) => {
    btn.addEventListener("click", () => window.print());
  });
}

/* Init */
document.addEventListener("DOMContentLoaded", () => {
  hydrateServiceLinks();
  initCopyButtons();
  initMobileDrawer();
  initCommandPalette();
  initFilterGroups();
  initPrintButtons();
  revealHashTarget();
});

window.addEventListener("hashchange", revealHashTarget);
