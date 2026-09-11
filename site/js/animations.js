// ============================================================
// 页面动效：入场 / 滚动浮现 / 视差 / 数字滚动 / 导航状态
// 依赖：全局 gsap + ScrollTrigger（main.js 中已注册插件）
// ============================================================

import { prefersReducedMotion } from './scroll.js';

export function initAnimations() {
  if (prefersReducedMotion) {
    // 尊重系统"减少动态"设置：全部直接显示（保留内联样式以覆盖 CSS 初始态）
    document.documentElement.classList.add('no-anim');
    return;
  }

  initHeroEntrance();
  initProgressBar();
  initNavState();
  initReveals();
  initParallax();
  initCounters();
}

/* ---------- 首屏入场 ---------- */
function initHeroEntrance() {
  const items = gsap.utils.toArray('[data-hero]');
  if (!items.length) return;
  gsap.set(items, { opacity: 0, y: 36 });
  gsap.to(items, {
    opacity: 1,
    y: 0,
    duration: 1.05,
    ease: 'power3.out',
    stagger: 0.1,
    delay: 0.25,
  });
}

/* ---------- 顶部滚动进度条 ---------- */
function initProgressBar() {
  const bar = document.getElementById('progress');
  if (!bar) return;
  ScrollTrigger.create({
    start: 0,
    end: () => ScrollTrigger.maxScroll(window),
    onUpdate: (self) => {
      bar.style.transform = `scaleX(${self.progress})`;
    },
  });
}

/* ---------- 导航：滚动加深背景 + 当前分区高亮 ---------- */
function initNavState() {
  const nav = document.getElementById('siteNav');
  // 原生 scroll 监听最可靠（Lenis 平滑滚动也会触发原生 scroll 事件）
  const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  document.querySelectorAll('.nav-links a[data-section]').forEach((link) => {
    const target = document.getElementById(link.dataset.section);
    if (!target) return;
    ScrollTrigger.create({
      trigger: target,
      start: 'top 45%',
      end: 'bottom 45%',
      onToggle: (self) => link.classList.toggle('active', self.isActive),
    });
  });
}

/* ---------- 区块浮现 ---------- */
function initReveals() {
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 42 },
      {
        opacity: 1,
        y: 0,
        duration: 0.95,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      }
    );
  });
}

/* ---------- 视差层（data-speed：>1 快于滚动，<1 慢于滚动） ---------- */
function initParallax() {
  gsap.utils.toArray('[data-speed]').forEach((el) => {
    const speed = parseFloat(el.dataset.speed) || 1;
    gsap.to(el, {
      yPercent: (1 - speed) * 55,
      ease: 'none',
      scrollTrigger: {
        trigger: el.closest('section') || el,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  });

  // 首屏内容随滚动轻微上浮淡出，制造纵深
  const heroInner = document.querySelector('.hero-inner');
  if (heroInner) {
    gsap.to(heroInner, {
      yPercent: -14,
      opacity: 0.15,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom 25%',
        scrub: true,
      },
    });
  }
}

/* ---------- 数字滚动 ---------- */
function initCounters() {
  gsap.utils.toArray('[data-count]').forEach((el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimal || '0', 10);
    const obj = { val: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = obj.val.toFixed(decimals);
          },
        });
      },
    });
  });
}
