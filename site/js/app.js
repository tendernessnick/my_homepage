// ============================================================
// 全站交互：导航高亮 / 开场遮罩 / 工作生活模式 / 拖拽墙 /
//          复制按钮 / 回到顶部 / 滚动渐显 / 数字跳动
// ============================================================

const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- 导航高亮 ---------- */
function initNav() {
  const page = document.body.dataset.page;
  if (!page) return;
  $$("[data-nav]").forEach((a) => {
    if (a.dataset.nav === page) a.classList.add("is-active");
  });
}

/* ---------- 主页开场遮罩 ---------- */
function initIntro() {
  const intro = $("[data-work-intro]");
  if (!intro) return;

  const seen = sessionStorage.getItem("hr-intro-seen");
  const hasHash = !!location.hash;
  if (seen || hasHash || reducedMotion) {
    intro.remove();
    return;
  }

  document.body.classList.add("intro-open");
  let done = false;
  const dismiss = (scrollTarget) => {
    if (done) return;
    done = true;
    sessionStorage.setItem("hr-intro-seen", "1");
    intro.classList.add("is-done");
    document.body.classList.remove("intro-open");
    setTimeout(() => intro.remove(), 750);
    if (scrollTarget) {
      document.getElementById(scrollTarget)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 任意向下滚动即进入：触控板单次增量可能只有 1~3，需累计判断
  let wheelSum = 0;
  const onWheel = (e) => {
    if (e.deltaY <= 0) return;
    wheelSum += e.deltaY;
    if (e.deltaY >= 2 || wheelSum >= 12) dismiss();
  };
  window.addEventListener("wheel", onWheel, { passive: true });
  window.addEventListener("touchmove", () => dismiss(), { passive: true, once: true });
  addEventListener("keydown", (e) => {
    if (e.key === "Escape" || e.key === "ArrowDown" || e.key === " " || e.key === "Enter") dismiss();
  });
  // 点击遮罩空白处（非按钮）也可进入
  intro.addEventListener("click", (e) => {
    if (e.target.closest(".wi-btn")) return;
    dismiss();
  });
  $(".wi-close", intro)?.addEventListener("click", () => dismiss());

  $$(".wi-btn, .wi-hint", intro).forEach((el) => {
    el.addEventListener("click", (e) => {
      const href = el.getAttribute("href") || "";
      if (href.startsWith("#")) {
        e.preventDefault();
        dismiss(href.slice(1));
      } else {
        dismiss();
      }
    });
  });
}

/* ---------- 工作 / 生活模式切换 ---------- */
function initModeToggle() {
  const btn = $("[data-mode-toggle]");
  const work = $('[data-mode-view="work"]');
  const life = $('[data-mode-view="life"]');
  if (!btn || !work || !life) return;

  const lifeLinks = $$('[data-life-link]');

  const apply = (isLife) => {
    document.body.classList.toggle("life-mode", isLife);
    btn.setAttribute("aria-pressed", String(isLife));
    $("[data-mode-label]").textContent = isLife ? "工作模式" : "生活模式";
    const show = isLife ? life : work;
    const hide = isLife ? work : life;
    show.hidden = false;
    show.removeAttribute("inert");
    show.setAttribute("aria-hidden", "false");
    hide.hidden = true;
    hide.setAttribute("inert", "");
    hide.setAttribute("aria-hidden", "true");
    lifeLinks.forEach((a) => a.setAttribute("tabindex", isLife ? "0" : "-1"));
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  };

  btn.addEventListener("click", () => apply(!document.body.classList.contains("life-mode")));
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
      setTimeout(() => (btn.textContent = old), 1400);
    });
  });
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
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("is-revealed");
          io.unobserve(en.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );
  els.forEach((el) => io.observe(el));
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

/* ---------- 生活区兴趣标签页 ---------- */
function initSignalTabs() {
  const board = $("[data-signal-board]");
  if (!board) return;
  const tabs = $$("[data-signal-tab]", board);
  const copy = $("[data-signal-copy]", board);
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.toggle("is-active", t === tab));
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

/* ---------- 页脚年份 ---------- */
function initYear() {
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
}

initNav();
initIntro();
initModeToggle();
initWalls();
initCopy();
initBackTop();
initReveal();
initCountUp();
initSignalTabs();
initRandomPhoto();
initYear();
