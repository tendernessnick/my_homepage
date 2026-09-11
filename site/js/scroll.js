// ============================================================
// 平滑滚动体系：Lenis + GSAP ScrollTrigger 同步
// ============================================================

export const prefersReducedMotion =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initScroll() {
  if (prefersReducedMotion || !window.Lenis) return null;

  const lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on('scroll', () => {
    if (window.ScrollTrigger) ScrollTrigger.update();
  });
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // 挂到 window 上，方便控制台调试（window.__lenis.scrollTo(target)）
  window.__lenis = lenis;

  // 锚点导航走 lenis.scrollTo，保证平滑
  document.querySelectorAll('[data-scroll]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        lenis.scrollTo(href, { offset: -64, duration: 1.4 });
        // 若移动端菜单开着，滚动后收起
        closeMobileNav();
      }
    });
  });

  return lenis;
}

export function closeMobileNav() {
  const links = document.getElementById('navLinks');
  const toggle = document.getElementById('navToggle');
  if (links && links.classList.contains('open')) {
    links.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  }
}
