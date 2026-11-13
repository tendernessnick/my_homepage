// 个人实验台：全部使用页面内的预生成图片与虚构样例，不发起网络请求。
const $ = (selector, root) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function initFocusLabs() {
  $$("[data-focus-lab]").forEach((lab) => {
    const range = $("[data-focus-range]", lab);
    const output = $("[data-focus-value]", lab);
    if (!range) return;
    const update = () => {
      const value = Math.round(Math.min(100, Math.max(0, Number(range.value) || 0)));
      range.value = String(value);
      lab.style.setProperty("--focus-position", `${value}%`);
      range.setAttribute("aria-valuetext", `对比分界 ${value}%`);
      if (output) output.textContent = `${value}%`;
    };
    range.addEventListener("input", update);
    range.addEventListener("change", update);
    update();
    range.disabled = false;

    // 原生 range 仍负责键盘与读屏；画面只是同一数值的指针操作区域。
    const surface = $("[data-focus-surface], .focus-image, .compare-image", lab);
    if (!surface || !("PointerEvent" in window)) return;
    let pointer = null;

    const setFromPoint = (clientX) => {
      const bounds = surface.getBoundingClientRect();
      if (bounds.width <= 0) return;
      range.value = String(Math.round(Math.min(100, Math.max(0, (clientX - bounds.left) / bounds.width * 100))));
      update();
    };
    const endDrag = (event, cancelled = false) => {
      if (!pointer || event.pointerId !== pointer.id) return;
      const previous = pointer;
      pointer = null;
      // 轻点也可定位；已判定为纵向滚动或被系统取消的手势不改值。
      if (!cancelled && previous.axis !== "vertical") setFromPoint(event.clientX);
      lab.classList.remove("is-focus-dragging");
      surface.classList.remove("is-focus-dragging");
      try {
        if (surface.hasPointerCapture?.(previous.id)) surface.releasePointerCapture(previous.id);
      } catch { /* 指针可能已由浏览器滚动或页面切换释放。 */ }
    };

    $$("img", surface).forEach((image) => { image.draggable = false; });
    surface.addEventListener("dragstart", (event) => event.preventDefault());
    surface.addEventListener("pointerdown", (event) => {
      if (pointer || event.isPrimary === false || event.button !== 0) return;
      const isTouch = event.pointerType === "touch";
      pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, axis: isTouch ? null : "horizontal" };
      try { surface.setPointerCapture(event.pointerId); } catch { /* 无捕获能力时仍可在画面内操作。 */ }
      if (!isTouch) {
        event.preventDefault();
        lab.classList.add("is-focus-dragging");
        surface.classList.add("is-focus-dragging");
        setFromPoint(event.clientX);
      }
    });
    surface.addEventListener("pointermove", (event) => {
      if (!pointer || event.pointerId !== pointer.id) return;
      if (!pointer.axis) {
        const dx = Math.abs(event.clientX - pointer.x);
        const dy = Math.abs(event.clientY - pointer.y);
        if (Math.max(dx, dy) < 6) return;
        pointer.axis = dx > dy ? "horizontal" : "vertical";
        if (pointer.axis === "horizontal") {
          lab.classList.add("is-focus-dragging");
          surface.classList.add("is-focus-dragging");
        }
      }
      if (pointer.axis !== "horizontal") return;
      if (event.cancelable) event.preventDefault();
      setFromPoint(event.clientX);
    }, { passive: false });
    surface.addEventListener("pointerup", (event) => endDrag(event));
    surface.addEventListener("pointercancel", (event) => endDrag(event, true));
    surface.addEventListener("lostpointercapture", (event) => endDrag(event, true));
    lab.classList.add("is-focus-ready");
    surface.classList.add("is-focus-ready");
  });
}

function initCleanLabs() {
  $$("[data-clean-lab]").forEach((lab) => {
    const button = $("[data-clean-toggle]", lab);
    if (!button) return;
    const status = $("[data-clean-status]", lab);
    const issues = $("[data-clean-issues]", lab);
    const missing = $$("[data-clean-missing]", lab);
    const duplicates = $$("[data-clean-duplicate]", lab);
    const originalText = new Map(missing.map((cell) => [cell, cell.textContent]));
    const originalHidden = new Map(duplicates.map((row) => [row, row.hidden]));
    let clean = false;
    const update = () => {
      lab.classList.toggle("is-clean", clean);
      missing.forEach((cell) => {
        cell.textContent = clean ? (cell.dataset.cleanMissing || "上海") : originalText.get(cell);
      });
      duplicates.forEach((row) => { row.hidden = clean || originalHidden.get(row); });
      if (status) status.textContent = clean ? "样例已修复" : "发现缺失值与重复行";
      if (issues) issues.textContent = clean ? "0 个问题" : "2 个问题";
      button.textContent = clean ? "还原样例" : "修复样例";
      button.setAttribute("aria-pressed", String(clean));
    };
    button.addEventListener("click", () => {
      clean = !clean;
      update();
    });
    update();
    button.disabled = false;
  });
}

function initWeatherLabs() {
  $$("[data-weather-lab]").forEach((lab) => {
    const buttons = $$("[data-weather-slot]", lab);
    const value = $("[data-weather-value]", lab);
    const verdict = $("[data-weather-verdict]", lab);
    if (!buttons.length) return;
    const select = (selected) => {
      buttons.forEach((button) => {
        button.classList.toggle("is-active", button === selected);
        button.setAttribute("aria-pressed", String(button === selected));
      });
      const rain = Number(selected.dataset.weatherRain);
      if (value && Number.isFinite(rain)) value.textContent = `${Math.min(100, Math.max(0, rain))}%`;
      if (verdict) verdict.textContent = selected.dataset.weatherVerdict || "查看示例建议";
      lab.dataset.level = selected.dataset.weatherSlot;
    };
    buttons.forEach((button) => {
      button.addEventListener("click", () => select(button));
      button.disabled = false;
    });
    select(buttons.find((button) => button.getAttribute("aria-pressed") === "true") || buttons[0]);
  });
}

function initMailLabs() {
  $$("[data-mail-lab]").forEach((lab) => {
    const button = $("[data-mail-toggle]", lab);
    const status = $("[data-mail-status]", lab);
    if (!button) return;
    const categories = $$("[data-mail-category]", lab);
    const originalText = new Map(categories.map((item) => [item, item.textContent]));
    let sorted = false;
    const update = () => {
      lab.classList.toggle("is-sorted", sorted);
      categories.forEach((item) => {
        item.textContent = sorted ? (item.dataset.mailCategory || "其他") : originalText.get(item);
      });
      if (status) status.textContent = sorted ? "归类完成" : "等待归类";
      button.textContent = sorted ? "还原样例" : "整理样例";
      button.setAttribute("aria-pressed", String(sorted));
    };
    button.addEventListener("click", () => {
      sorted = !sorted;
      update();
    });
    update();
    button.disabled = false;
  });
}

initFocusLabs();
initCleanLabs();
initWeatherLabs();
initMailLabs();
