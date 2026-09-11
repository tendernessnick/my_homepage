// ============================================================
// 去雾 Demo 组件
// 流程：上传/示例图 → 本地预缩放(≤512) → POST /dehaze → 前后对比滑块
// 说明：服务为 CPU 推理，最小实例数为 0 时冷启动约 10–40 秒，
//       因此进入视口时会先请求 /health 预热，并在加载态显示计时。
// ============================================================

import { DEHAZE_API_BASE, SAMPLE_IMAGE } from './config.js';

const MAX_BYTES = 10 * 1024 * 1024; // 与后端限制一致
const LONG_EDGE = 512;              // 后端内部也会缩到 512，这里提前做省流量

export function initDehaze() {
  const $ = (id) => document.getElementById(id);
  const dz = $('dz');
  if (!dz) return;

  const input = $('dzInput');
  const btnSample = $('dzSample');
  const loading = $('dzLoading');
  const loadingTitle = $('dzLoadingTitle');
  const loadingSub = $('dzLoadingSub');
  const timerEl = $('dzTimer');
  const compare = $('compare');
  const frame = $('compareFrame');
  const afterWrap = $('compareAfter');
  const divider = $('compareDivider');
  const imgBefore = $('imgBefore');
  const imgAfter = $('imgAfter');
  const caption = $('compareCaption');
  const errorEl = $('dzError');
  const btnRetry = $('btnRetry');
  const btnSample2 = $('btnSample2');

  let timer = null;
  let urlBefore = null;
  let urlAfter = null;
  let healthPinged = false;

  /* ---------- 视图切换 ---------- */
  function show(view) {
    dz.hidden = view !== 'drop';
    loading.hidden = view !== 'loading';
    compare.hidden = view !== 'compare';
    if (view !== 'error') errorEl.hidden = true;
  }

  function showError(msg) {
    stopTimer();
    errorEl.innerHTML = msg;
    errorEl.hidden = false;
    dz.hidden = false;
    loading.hidden = true;
    compare.hidden = true;
  }

  /* ---------- 计时与冷启动提示 ---------- */
  function startTimer() {
    stopTimer();
    const t0 = performance.now();
    timer = setInterval(() => {
      const s = (performance.now() - t0) / 1000;
      timerEl.textContent = s.toFixed(1);
      if (s > 15) {
        loadingTitle.textContent = '仍在处理中，请稍候…';
        loadingSub.textContent = 'CPU 推理或服务冷启动都比平时慢一点，通常不会超过 40 秒';
      }
    }, 100);
  }
  function stopTimer() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  /* ---------- 服务预热：Demo 区块进入视口时 ping 一次 /health ---------- */
  function warmUp() {
    if (!DEHAZE_API_BASE || healthPinged) return;
    healthPinged = true;
    fetch(`${DEHAZE_API_BASE}/health`, { mode: 'cors' }).catch(() => {});
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(
      (entries, obs) => {
        if (entries.some((e) => e.isIntersecting)) {
          warmUp();
          obs.disconnect();
        }
      },
      { rootMargin: '600px 0px' }
    ).observe(dz);
  }

  /* ---------- 图片入口：选择 / 拖拽 / 示例 ---------- */
  dz.addEventListener('click', () => input.click());
  dz.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); }
  });
  input.addEventListener('change', () => {
    if (input.files?.[0]) handleFile(input.files[0]);
    input.value = '';
  });

  ['dragenter', 'dragover'].forEach((ev) =>
    dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.add('dragover'); })
  );
  ['dragleave', 'drop'].forEach((ev) =>
    dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.remove('dragover'); })
  );
  dz.addEventListener('drop', (e) => {
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFile(file);
  });

  btnSample.addEventListener('click', (e) => { e.stopPropagation(); useSample(); });
  btnSample2.addEventListener('click', () => useSample());
  btnRetry.addEventListener('click', reset);

  async function useSample() {
    show('loading');
    loadingTitle.textContent = '正在载入示例图…';
    loadingSub.textContent = '';
    startTimer();
    try {
      const res = await fetch(SAMPLE_IMAGE);
      if (!res.ok) throw new Error('sample');
      const blob = await res.blob();
      stopTimer();
      handleFile(new File([blob], 'sample_hazy.jpg', { type: 'image/jpeg' }));
    } catch {
      showError('示例图加载失败，请直接上传一张本地图片试试。');
    }
  }

  /* ---------- 校验 → 预缩放 → 上传 ---------- */
  async function handleFile(file) {
    if (!/^image\/(png|jpeg)$/.test(file.type)) {
      showError('仅支持 PNG / JPG 格式的图片。');
      return;
    }
    if (file.size > MAX_BYTES) {
      showError('图片超过 10MB 限制，请压缩后再试。');
      return;
    }
    if (!DEHAZE_API_BASE) {
      showError(
        '尚未配置去雾服务地址：部署后把腾讯云 CloudBase 云托管的域名填入 <code>js/config.js</code> 的 ' +
        '<code>DEHAZE_API_BASE</code>，本区块即可使用。'
      );
      return;
    }

    show('loading');
    loadingTitle.textContent = '正在去雾…';
    loadingSub.textContent = '模型启动中：首次请求需要唤醒服务器，约 10–40 秒';
    startTimer();

    try {
      const sendBlob = await maybeDownscale(file);
      if (urlBefore) URL.revokeObjectURL(urlBefore);
      if (urlAfter) URL.revokeObjectURL(urlAfter);
      urlBefore = URL.createObjectURL(file);

      const fd = new FormData();
      fd.append('image', sendBlob, 'upload.jpg'); // 后端字段名固定为 image

      const res = await fetch(`${DEHAZE_API_BASE}/dehaze`, { method: 'POST', body: fd });
      if (!res.ok) {
        let detail = `服务返回 ${res.status}`;
        try {
          const j = await res.json();
          if (j?.detail) detail = j.detail;
        } catch { /* 非 JSON 错误体，保留状态码信息 */ }
        throw new Error(detail);
      }

      const blob = await res.blob();
      urlAfter = URL.createObjectURL(blob);
      imgBefore.src = urlBefore;
      imgAfter.src = urlAfter;

      let extra = '';
      const pt = res.headers.get('X-Processing-Time'); // 需后端 expose_headers 才可读
      if (pt) extra = ` · 推理耗时 ${pt}s`;
      caption.textContent = `拖动分割线对比效果${extra}`;

      show('compare');
      setDivider(0.5);
      stopTimer();
    } catch (err) {
      const msg = err instanceof TypeError
        ? '无法连接去雾服务：可能正在冷启动或地址有误，请稍后重试。'
        : `去雾失败：${err.message}`;
      showError(msg);
    }
  }

  /* ---------- 本地预缩放：最长边压到 512，与后端行为一致 ---------- */
  async function maybeDownscale(file) {
    try {
      const bmp = await createImageBitmap(file);
      const long = Math.max(bmp.width, bmp.height);
      if (long <= LONG_EDGE) return file;
      const scale = LONG_EDGE / long;
      const w = Math.round(bmp.width * scale);
      const h = Math.round(bmp.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(bmp, 0, 0, w, h);
      bmp.close?.();
      return await new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b || file), 'image/jpeg', 0.92)
      );
    } catch {
      return file; // 缩放失败就直接传原图（后端也会自己缩）
    }
  }

  /* ---------- 前后对比滑块 ---------- */
  function setDivider(p) {
    p = Math.min(1, Math.max(0, p));
    divider.style.left = `${p * 100}%`;
    afterWrap.style.clipPath = `inset(0 0 0 ${p * 100}%)`;
  }

  let scrubbing = false;
  const moveTo = (clientX) => {
    const rect = frame.getBoundingClientRect();
    setDivider((clientX - rect.left) / rect.width);
  };
  frame.addEventListener('pointerdown', (e) => {
    scrubbing = true;
    frame.setPointerCapture(e.pointerId);
    moveTo(e.clientX);
  });
  frame.addEventListener('pointermove', (e) => { if (scrubbing) moveTo(e.clientX); });
  ['pointerup', 'pointercancel'].forEach((ev) =>
    frame.addEventListener(ev, () => { scrubbing = false; })
  );

  /* ---------- 复位 ---------- */
  function reset() {
    show('drop');
    stopTimer();
    if (urlBefore) { URL.revokeObjectURL(urlBefore); urlBefore = null; }
    if (urlAfter) { URL.revokeObjectURL(urlAfter); urlAfter = null; }
    imgBefore.removeAttribute('src');
    imgAfter.removeAttribute('src');
  }
}
