// 子页增强：无脚本时保留所有目录、内容与下载入口。
const links = [...document.querySelectorAll('.section-nav a[href^="#"], .work-index a[href^="#"], .resume-nav a[href^="#"]')];
const entries = links.map((link) => ({ link, target: document.getElementById(link.hash.slice(1)) })).filter((entry) => entry.target);

if (entries.length) {
  let scheduled = false;
  const update = () => {
    scheduled = false;
    let active = entries[0];
    for (const entry of entries) {
      if (entry.target.getBoundingClientRect().top <= 160) active = entry;
    }
    entries.forEach(({ link }) => {
      if (link === active.link) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
  }, { passive: true });
  addEventListener('hashchange', update);
  update();
}

document.querySelectorAll('[data-print-cv]').forEach((button) => {
  button.addEventListener('click', () => window.print());
  button.disabled = false;
  button.hidden = false;
});

// 直接访问折叠材料内的锚点时，先展开祖先，再让浏览器定位。
function openHashArchive() {
  if (!location.hash) return;
  let target;
  try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); }
  catch { return; }
  if (!target) return;
  let ancestor = target;
  let changed = false;
  while (ancestor) {
    if (ancestor.tagName === 'DETAILS' && !ancestor.open) { ancestor.open = true; changed = true; }
    ancestor = ancestor.parentElement;
  }
  if (changed) requestAnimationFrame(() => target.scrollIntoView({ behavior: 'instant', block: 'start' }));
}
openHashArchive();
addEventListener('hashchange', openHashArchive);
