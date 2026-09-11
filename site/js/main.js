// ============================================================
// 入口：初始化滚动、动效、导航、照片墙与去雾 Demo
// ============================================================

import { initScroll, closeMobileNav } from './scroll.js';
import { initAnimations } from './animations.js';
import { initGallery } from './gallery.js';
import { initDehaze } from './dehaze.js';

// GSAP 未加载成功（如部署路径错误）时，兜底显示所有动画元素
let lenis = null;
if (!window.gsap || !window.ScrollTrigger) {
  document.documentElement.classList.add('gsap-failed');
} else {
  gsap.registerPlugin(ScrollTrigger);
  lenis = initScroll();
  initAnimations();
}

initGallery();
initDehaze();

// ---------- 移动端菜单 ----------
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});

// 点击任意链接后收起菜单（锚点滚动本身由 scroll.js 接管）
navLinks?.addEventListener('click', (e) => {
  if (e.target.closest('a')) closeMobileNav();
});

// Escape 收起菜单
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMobileNav();
});

// ---------- 回到顶部 ----------
const toTop = document.getElementById('toTop');
const onScrollForTop = () => toTop?.classList.toggle('visible', window.scrollY > 640);
window.addEventListener('scroll', onScrollForTop, { passive: true });
onScrollForTop();

toTop?.addEventListener('click', () => {
  if (lenis) lenis.scrollTo(0, { duration: 1.4 });
  else window.scrollTo({ top: 0, behavior: 'smooth' });
});
