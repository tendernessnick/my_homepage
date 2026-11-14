// Signal → System：查找、筛选与阅读定位。无追踪、无外部请求。
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const english = document.documentElement.lang.toLowerCase().startsWith('en');
const language = (zh, en) => english ? en : zh;

function initLanguageSwitch() {
  const navigation = $('.nav-wrap');
  if (!navigation) return;
  if ($('.site-language', navigation)) return;
  if (english && $('.top-nav a[lang="zh-CN"]', navigation)) return;
  const link = document.createElement('a');
  link.className = 'site-language';
  link.href = english ? 'index.html' : 'en.html';
  link.lang = english ? 'zh-CN' : 'en';
  link.textContent = english ? '中文' : 'EN';
  link.setAttribute('aria-label', english ? '中文 — 阅读中文主页' : 'EN — Read the English overview');
  navigation.append(link);
}

function initSearch() {
  if (typeof HTMLDialogElement === 'undefined' || typeof HTMLDialogElement.prototype.showModal !== 'function' || !$('.nav-wrap')) return;
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'site-search';
  trigger.setAttribute('aria-haspopup', 'dialog');
  trigger.setAttribute('aria-controls', 'site-command');
  trigger.setAttribute('aria-expanded', 'false');
  const shortcut = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘ K' : 'Ctrl K';
  trigger.setAttribute('aria-label', `${language('搜索','Search')} ${shortcut} — ${language('查找页面与项目','Find pages and projects')}`);
  trigger.setAttribute('aria-keyshortcuts', /Mac|iPhone|iPad/.test(navigator.platform) ? 'Meta+K' : 'Control+K');
  trigger.innerHTML = `<span class="e-search-icon" aria-hidden="true"></span><span>${language('搜索','Search')}</span> <kbd aria-hidden="true">${shortcut}</kbd>`;
  $('.nav-wrap').append(trigger);
  const dialog = document.createElement('dialog');
  dialog.className = 'e-command';
  dialog.id = 'site-command';
  dialog.setAttribute('aria-labelledby', 'command-title');
  dialog.innerHTML = `<div class="e-command-head"><span id="command-title">${language('INDEX / 快速抵达','INDEX / FIND YOUR WAY')}</span><button type="button" class="e-command-close" aria-label="${language('Esc — 关闭搜索','Esc — Close search')}">ESC</button></div><label for="command-query">${language('你想看什么？','What would you like to explore?')}</label><input id="command-query" type="search" placeholder="${language('试试：天气、简历、摄影、实习…','Try weather, CV, photography, experience…')}" autocomplete="off" spellcheck="false" aria-controls="command-results" /><div class="e-command-results" id="command-results"></div><div class="e-command-foot" role="status" aria-live="polite"></div>`;
  document.body.append(dialog);
  const query = $('input', dialog);
  const results = $('.e-command-results', dialog);
  const footer = $('.e-command-foot', dialog);
  const pages = [
    { title:'首页 / 胡睿杰', desc:'个人概况、四个产品与交互小样', href:'index.html', keys:'home ruijie hu 首页 主页' },
    { title:'关于我', desc:'计算机科学 × 商业人工智能，做事方式与工具', href:'about.html', keys:'about 关于 城大 香港城市大学 背景' },
    { title:'实习与案例', desc:'五段实习，数据、量化、战略与开发', href:'experience.html', keys:'cases experience 实习 研究 和宏 德科 钰泰 量化' },
    { title:'作品集', desc:'四个独立产品与去雾毕业设计', href:'works.html', keys:'work projects 作品 项目 产品' },
    { title:'NoticeMe', desc:'本地优先的待办、提醒与日记工具', href:'works.html#noticeme', keys:'noticeme 提醒 待办 日记 桌面 本地' },
    { title:'Data Helper', desc:'导入、体检、清洗、SQL 与可视化', href:'works.html#data-helper', keys:'data helper 数据 表格 清洗 分析 SQL 图表 看板' },
    { title:'Weather Helper', desc:'香港 57 个公共网球场的降雨决策', href:'works.html#weather-helper', keys:'weather helper 天气 网球 球场 下雨 香港' },
    { title:'MailHelper', desc:'校园邮件归类、优先级与通知', href:'works.html#mail-helper', keys:'mailhelper 邮件 邮箱 Outlook Canvas' },
    { title:'SE-CGAN 图像去雾', desc:'真实样例对比、毕业设计与在线推理入口', href:'dehaze.html', keys:'se cgan dehaze 去雾 深度学习 毕业设计 论文 模型' },
    { title:'数据案例：评分为什么下降？', desc:'UCI 电商留存示例，解释样本、字段与重复项口径', href:'data-case.html', keys:'data case 分数 评分 数据 案例 清洗 电商 UCI 观察 手记' },
    { title:'在线履历 / CV', desc:'教育、实习、项目与中英文简历下载', href:'cv.html', keys:'cv resume 简历 履历 下载 英文 中文 招聘 教育' },
    { title:'摄影与生活', desc:'十二帧生活照片、网球与书影音', href:'life.html', keys:'life photo 生活 相册 摄影 照片 网球 电影 音乐 书' },
    { title:'联系我', desc:'邮箱、电话、微信与 GitHub', href:'contact.html', keys:'contact 联系 邮箱 电话 微信 email github' },
    { title:'English overview / 英文入口', desc:'A quick introduction, projects, experience and contact', href:'en.html', keys:'en english 英文 英语 国际 overview' },
  ];
  if (english) {
    const translations = [
      ['Home / Ruijie Hu','Chinese homepage and interactive product samples'],
      ['About','Background, working methods and tools (Chinese)'],
      ['Experience','Five internships across data, research and development (Chinese)'],
      ['Projects','Four independent products and a dehazing research project (Chinese)'],
      ['NoticeMe','Local-first tasks, reminders and journaling (Chinese detail page)'],
      ['Data Helper','Import, inspect, clean, query and visualize data (Chinese detail page)'],
      ['Weather Helper','Rain decisions for 57 Hong Kong tennis courts (Chinese detail page)'],
      ['MailHelper','Campus email categories, priorities and notifications (Chinese detail page)'],
      ['SE-CGAN dehazing','Real image comparison and an online inference entry (Chinese)'],
      ['Data case: why did the score drop?','A retail example about changing rows, fields and duplicate rules (Chinese)'],
      ['Full CV','Chinese online CV with Chinese / English PDF downloads'],
      ['Photography & life','Twelve photos, tennis, books, films and music (Chinese)'],
      ['Contact','Email, phone, WeChat and GitHub (Chinese page)'],
      ['English overview','Introduction, selected projects, experience and contact'],
    ];
    pages.forEach((page,index) => { [page.title,page.desc] = translations[index]; });
  }
  let returnFocus = null;
  let previousOverflow = '';
  let scrollPosition = 0;
  let locked = false;
  let composing = false;
  const restore = () => {
    if (!locked) return;
    locked = false;
    composing = false;
    document.documentElement.style.overflow = previousOverflow;
    window.scrollTo({ top:scrollPosition, behavior:'instant' });
    trigger.setAttribute('aria-expanded', 'false');
    if (returnFocus?.isConnected) returnFocus.focus({ preventScroll:true });
  };
  const close = () => {
    if (!dialog.open) return;
    dialog.close();
    restore();
  };
  const render = () => {
    const terms = query.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    const matching = pages.filter((page) => terms.every((term) => `${page.title} ${page.desc} ${page.keys}`.toLocaleLowerCase().includes(term)));
    results.replaceChildren();
    matching.forEach((page) => {
      const link = document.createElement('a');
      link.className = 'e-command-result';
      link.href = page.href;
      const copy = document.createElement('span');
      copy.append(document.createTextNode(page.title));
      const description = document.createElement('small');
      description.textContent = page.desc;
      copy.append(description);
      const arrow = document.createElement('b');
      arrow.textContent = '↗';
      arrow.setAttribute('aria-hidden', 'true');
      link.append(copy, arrow);
      link.addEventListener('click', close);
      results.append(link);
    });
    if (!matching.length) {
      const empty = document.createElement('p');
      empty.className = 'e-command-empty';
      empty.textContent = language('暂时没有匹配项，换个关键词试试。','No matches yet. Try a different keyword.');
      results.append(empty);
    }
    footer.textContent = language(`${matching.length} 个入口 · ↑ ↓ 选择 · Enter 打开 · Esc 关闭`, `${matching.length} results · ↑ ↓ choose · Enter open · Esc close`);
  };
  const open = () => {
    if (dialog.open) return;
    returnFocus = document.activeElement;
    previousOverflow = document.documentElement.style.overflow;
    scrollPosition = window.scrollY;
    query.value = '';
    render();
    dialog.showModal();
    document.documentElement.style.overflow = 'hidden';
    locked = true;
    trigger.setAttribute('aria-expanded', 'true');
    query.focus({ preventScroll:true });
  };
  // close 事件异步派发；快速关闭后已重开的新对话框保留自己的锁定状态。
  dialog.addEventListener('close', () => { if (!dialog.open) restore(); });
  dialog.addEventListener('cancel', (event) => { event.preventDefault(); if (!composing) close(); });
  $('.e-command-close', dialog).addEventListener('click', close);
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
  });
  query.addEventListener('input', render);
  query.addEventListener('compositionstart', () => { composing = true; });
  query.addEventListener('compositionend', () => { composing = false; render(); });
  dialog.addEventListener('keydown', (event) => {
    if (composing || event.isComposing || event.keyCode === 229) return;
    // search 输入框原生 Esc 会先清除查询；在此明确关闭模态层。
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      close();
      return;
    }
    const links = $$('a', results);
    if (!links.length) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const current = links.indexOf(document.activeElement);
      let index;
      if (current < 0) index = event.key === 'ArrowDown' ? 0 : links.length - 1;
      else index = (current + (event.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length;
      links[index].focus();
    } else if (event.key === 'Enter' && document.activeElement === query) {
      event.preventDefault();
      links[0].click();
    }
  });
  trigger.addEventListener('click', open);
  document.addEventListener('keydown', (event) => {
    if (composing || event.isComposing || event.keyCode === 229) return;
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k' && !event.altKey) {
      // 其他交互（如相册）已经占用模态层时不抢焦点。
      if ($('dialog[open]') && !dialog.open) return;
      event.preventDefault();
      if (event.repeat) return;
      if (dialog.open) close(); else open();
    }
  });
}

function initProjectFilter() {
  const group = $('.project-filter');
  const projects = $$('.studio-project[data-project-type]');
  if (!group || !projects.length) return;
  const buttons = $$('[data-project-filter]', group);
  group.hidden = false;
  buttons.forEach((button) => button.addEventListener('click', () => {
    const filter = button.dataset.projectFilter;
    let count = 0;
    projects.forEach((project) => {
      project.hidden = filter !== 'all' && project.dataset.projectType !== filter;
      if (!project.hidden) count++;
    });
    buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    $('[data-project-count]', group).textContent = `${count} 件作品 / SELECTED 2026`;
  }));
}

function initReadingRail() {
  if (!document.body.classList.contains('studio-home')) return;
  const entries = [ ['intro','开场'], ['selected-work','作品'], ['experience','经历'], ['off-clock','生活'] ];
  const nav = document.createElement('nav');
  nav.className = 'e-section-rail';
  nav.setAttribute('aria-label', '首页段落目录');
  entries.forEach(([id,label], index) => {
    const link = document.createElement('a');
    link.href = `#${id}`;
    link.textContent = `0${index + 1}`;
    link.setAttribute('aria-label', `0${index + 1} ${label}`);
    link.title = label;
    nav.append(link);
  });
  document.body.append(nav);
  let queued = false;
  const update = () => {
    queued = false;
    nav.hidden = document.body.classList.contains('life-mode');
    let current = entries[0][0];
    entries.forEach(([id]) => { if (document.getElementById(id)?.getBoundingClientRect().top <= 200) current = id; });
    $$('a', nav).forEach((link) => {
      if (link.hash === `#${current}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  const schedule = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  addEventListener('scroll', schedule, { passive:true });
  new MutationObserver(schedule).observe(document.body, { attributes:true, attributeFilter:['class'] });
  update();
}

function initFooter() {
  const footer = $('.footer .container');
  if (!footer) return;
  const top = document.createElement('div');
  top.className = 'e-footer-top';
  top.innerHTML = `<span>GOOD QUESTIONS. USEFUL THINGS.</span><a href="${english ? 'en.html#contact' : 'contact.html'}">${language('从一个想法开始 ↗','Start with an idea ↗')}</a>`;
  const name = document.createElement('span');
  name.className = 'e-footer-name';
  name.textContent = 'RUIJIE HU';
  name.setAttribute('aria-hidden', 'true');
  footer.prepend(top, name);
  const bottom = document.createElement('div');
  bottom.className = 'e-footer-bottom';
  bottom.innerHTML = `<span>${language('数据 · 产品 · 日常观察','DATA · PRODUCTS · EVERYDAY CURIOSITY')}</span><a href="https://github.com/tendernessnick" target="_blank" rel="noopener noreferrer">GITHUB ↗</a><a href="${english ? 'en.html' : 'index.html'}">BACK TO INDEX ↑</a>`;
  footer.append(bottom);
}

initLanguageSwitch();
initSearch();
initProjectFilter();
initReadingRail();
initFooter();
