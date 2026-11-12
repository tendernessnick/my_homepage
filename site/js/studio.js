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
      lab.style.setProperty("--focus-position", `${value}%`);
      range.setAttribute("aria-valuetext", `对比分界 ${value}%`);
      if (output) output.textContent = `${value}%`;
    };
    range.addEventListener("input", update);
    range.addEventListener("change", update);
    update();
    range.disabled = false;
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
