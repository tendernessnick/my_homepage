// ============================================================
// 全站交互：导航高亮 / 工作生活模式 / 拖拽墙 /
//          复制按钮 / 回到顶部 / 滚动渐显 / 数字跳动
// ============================================================

const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

import { DEHAZE_DEMO_URL, WEATHER_APP_URL, DATAHELPER_DEMO_URL } from "./config.js?v=40";

/* ---------- 导航高亮 ---------- */
function initNav() {
  const page = document.body.dataset.page;
  if (!page) return;
  $$("[data-nav]").forEach((a) => {
    if (a.dataset.nav === page) a.classList.add("is-active");
  });
}

/* ---------- 工作 / 生活模式切换 ---------- */
function initModeToggle() {
  const btn = $("[data-mode-toggle]");
  const work = $('[data-mode-view="work"]');
  const life = $('[data-mode-view="life"]');
  if (!btn || !work || !life) return;

  const lifeLinks = $$("[data-life-link]");
  const positions = { work: window.scrollY, life: 0 };
  let mode = document.body.classList.contains("life-mode") ? "life" : "work";

  const updateControls = () => {
    const isLife = mode === "life";
    btn.setAttribute("aria-pressed", String(isLife));
    btn.setAttribute("aria-label", isLife ? "返回工作模式" : "打开生活模式");
    const label = $("[data-mode-label]", btn);
    if (label) label.textContent = isLife ? "工作模式" : "生活模式";
    lifeLinks.forEach((a) => a.setAttribute("tabindex", isLife ? "0" : "-1"));
  };

  const apply = (nextMode, target) => {
    if (nextMode === mode) return;
    positions[mode] = window.scrollY;
    mode = nextMode;
    const isLife = mode === "life";
    document.body.classList.toggle("life-mode", isLife);
    const show = isLife ? life : work;
    const hide = isLife ? work : life;
    // 隐藏当前视图前，将焦点移到始终可见的模式按钮。
    if (hide.contains(document.activeElement)) btn.focus({ preventScroll: true });
    show.hidden = false;
    show.removeAttribute("inert");
    show.setAttribute("aria-hidden", "false");
    hide.hidden = true;
    hide.setAttribute("inert", "");
    hide.setAttribute("aria-hidden", "true");
    updateControls();
    // 视图高度不同；直接恢复位置，避免页面级 smooth 把恢复变成一段长距离动画。
    if (target) target.scrollIntoView({ behavior: "instant" });
    else window.scrollTo({ top: positions[mode], behavior: "instant" });
  };

  btn.addEventListener("click", () => apply(mode === "life" ? "work" : "life"));
  $$("[data-open-mode]").forEach((trigger) => {
    const nextMode = trigger.dataset.openMode;
    if (nextMode !== "work" && nextMode !== "life") return;
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      apply(nextMode);
    });
  });

  const revealHashTarget = () => {
    if (!location.hash) return;
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); }
    catch { return; }
    const target = document.getElementById(id);
    if (!target) return;
    if (work.contains(target)) apply("work", target);
    else if (life.contains(target)) apply("life", target);
  };
  updateControls();
  revealHashTarget();
  addEventListener("hashchange", revealHashTarget);
}

/* ---------- 拖拽横向滚动（照片墙 / 证书墙） ---------- */
function enableDrag(wall) {
  let down = false, startX = 0, startLeft = 0;

  wall.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "touch") return; // 触屏走原生滚动
    down = true;
    startX = e.clientX;
    startLeft = wall.scrollLeft;
    wall.classList.add("dragging");
    wall.setPointerCapture(e.pointerId);
  });
  wall.addEventListener("pointermove", (e) => {
    if (!down) return;
    wall.scrollLeft = startLeft - (e.clientX - startX);
  });
  ["pointerup", "pointercancel"].forEach((ev) =>
    wall.addEventListener(ev, () => {
      down = false;
      wall.classList.remove("dragging");
    })
  );
  // 拖拽时避免误触链接
  wall.addEventListener("click", (e) => {
    if (Math.abs(wall.scrollLeft - startLeft) > 6) {
      const link = e.target.closest("a");
      if (link) e.preventDefault();
    }
  }, true);
}
function initWalls() {
  $$(".drag-wall").forEach(enableDrag);
}

/* ---------- 复制按钮 ---------- */
function initCopy() {
  $$("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      const old = btn.textContent;
      btn.textContent = "已复制";
      btn.classList.add("is-copied");
      setTimeout(() => {
        btn.textContent = old;
        btn.classList.remove("is-copied");
      }, 1400);
    });
  });
}

/* ---------- 滚动进度线 ---------- */
function initScrollProgress() {
  if (reducedMotion) return;
  const bar = document.createElement("div");
  bar.className = "scroll-progress";
  document.body.appendChild(bar);
  let ticking = false;
  const update = () => {
    ticking = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    bar.style.transform = `scaleX(${p})`;
  };
  addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
}

/* ---------- 回到顶部 ---------- */
function initBackTop() {
  const btn = $("[data-back-top]");
  if (!btn) return;
  const onScroll = () => btn.classList.toggle("is-show", window.scrollY > 560);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  btn.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" })
  );
}

/* ---------- 滚动渐显 ---------- */
function initReveal() {
  const els = $$(".reveal");
  if (!els.length) return;
  if (reducedMotion || !("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-revealed"));
    return;
  }
  let io;
  try {
    io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("is-revealed");
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: "0px 0px -32px 0px", threshold: 0.01 }
    );
    els.forEach((el) => {
      const rect = el.getBoundingClientRect();
      // 先成功注册观察，再启用隐藏态。首屏与已读区域始终直接显示。
      if (!el.getClientRects().length || rect.top >= window.innerHeight) {
        io.observe(el);
        el.classList.add("reveal-ready");
      } else {
        el.classList.add("is-revealed");
      }
    });
  } catch {
    io?.disconnect();
    els.forEach((el) => {
      el.classList.remove("reveal-ready");
      el.classList.add("is-revealed");
    });
  }
}

/* ---------- 数字跳动 ---------- */
function initCountUp() {
  const els = $$("[data-count]");
  if (!els.length) return;
  const animate = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    if (reducedMotion) { el.textContent = target.toFixed(decimals); return; }
    const dur = 1100;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (!("IntersectionObserver" in window)) { els.forEach(animate); return; }
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => {
      if (en.isIntersecting) { animate(en.target); io.unobserve(en.target); }
    }),
    { threshold: 0.6 }
  );
  els.forEach((el) => io.observe(el));
}

/* ---------- 生活区兴趣按钮组 ---------- */
function initSignalTabs() {
  const board = $("[data-signal-board]");
  if (!board) return;
  const tabs = $$("[data-signal-tab]", board);
  const copy = $("[data-signal-copy]", board);
  if (!copy) return;
  tabs.forEach((tab) => {
    tab.setAttribute("aria-pressed", String(tab.classList.contains("is-active")));
    tab.addEventListener("click", () => {
      tabs.forEach((t) => {
        t.classList.toggle("is-active", t === tab);
        t.setAttribute("aria-pressed", String(t === tab));
      });
      copy.textContent = tab.dataset.signalText;
    });
  });
}

/* ---------- 随机生活照 ---------- */
function initRandomPhoto() {
  const img = $("[data-random-life-photo]");
  if (!img) return;
  const pool = (img.dataset.photoPool || "").split(",").filter(Boolean);
  if (!pool.length) return;
  img.src = pool[Math.floor(Math.random() * pool.length)];
}

/* ---------- 去雾在线演示入口 ---------- */
/* DEHAZE_DEMO_URL（js/config.js）已填：全站入口新标签直跳后端演示页；
   未填：入口保持指向站内介绍页 dehaze.html，其演示卡呈「部署后开放」态。 */
function initDemoLinks() {
  const cta = $("[data-demo-cta]");

  if (DEHAZE_DEMO_URL) {
    const attrs = { target: "_blank", rel: "noreferrer noopener" };
    $$("[data-dehaze-demo]").forEach((a) => {
      a.href = DEHAZE_DEMO_URL;
      Object.entries(attrs).forEach(([k, v]) => a.setAttribute(k, v));
    });
    if (cta) {
      cta.href = DEHAZE_DEMO_URL;
      Object.entries(attrs).forEach(([k, v]) => cta.setAttribute(k, v));
    }
    return;
  }

  if (cta) {
    cta.textContent = "演示服务部署中 · 部署完成后自动开放";
    cta.classList.add("is-pending");
    cta.setAttribute("aria-disabled", "true");
    cta.removeAttribute("href");
    cta.addEventListener("click", (e) => e.preventDefault());
    $("[data-demo-note]")?.removeAttribute("hidden");
  }
}

/* ---------- 外部在线入口（config 驱动：已填直跳，未填待开放） ---------- */
function initConfigEntry(url, attr, pendingText) {
  const cta = $(`[data-${attr}-cta]`);
  const links = $$(`[data-${attr}-app], [data-${attr}-cta]`);

  if (url) {
    const attrs = { target: "_blank", rel: "noreferrer noopener" };
    links.forEach((a) => {
      a.href = url;
      Object.entries(attrs).forEach(([k, v]) => a.setAttribute(k, v));
    });
    return;
  }

  links.forEach((a) => a.addEventListener("click", (e) => e.preventDefault()));
  if (cta) {
    cta.textContent = pendingText;
    cta.classList.add("is-pending");
    cta.setAttribute("aria-disabled", "true");
    cta.removeAttribute("href");
  }
}

function initWeatherLinks() {
  initConfigEntry(WEATHER_APP_URL, "weather", "上线地址待填入 · 见 GitHub 仓库");
}

function initDataHelperLinks() {
  initConfigEntry(DATAHELPER_DEMO_URL, "datahelper", "在线体验部署中 · 稍后开放");
}

/* ---------- 页脚年份 ---------- */
function initYear() {
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
}

/* ---------- 页内锚点导览（渐进增强：scrollIntoView 顺滑且不受浏览器碎片滚动差异影响） ---------- */
function initSectionNav() {
  $$(".section-nav a[href^='#'], a[data-section-jump][href^='#']").forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.getElementById(a.getAttribute("href").slice(1));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: a.hasAttribute("data-section-jump") ? "instant" : reducedMotion ? "auto" : "smooth" });
      if (a.hasAttribute("data-section-jump")) {
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
      history.replaceState(null, "", a.getAttribute("href"));
    });
  });
}

initNav();
initModeToggle();
initWalls();
initCopy();
initScrollProgress();
initBackTop();
initReveal();
initCountUp();
initSignalTabs();
initRandomPhoto();
initDemoLinks();
initWeatherLinks();
initDataHelperLinks();
initYear();
initSectionNav();
