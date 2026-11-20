/* ==========================================================================
   Accessible Image Lightbox (Photos, Certificates, Product Screenshots)
   Supports Esc close, Left/Right navigation, and trigger focus restoration
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const triggers = Array.from(document.querySelectorAll("[data-lightbox-group]"));
  if (!triggers.length) return;

  const modal = document.createElement("div");
  modal.className = "lightbox";
  modal.hidden = true;
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-label", "大图预览");
  modal.innerHTML = `
    <div class="lightbox__bar">
      <span class="lightbox__counter" id="lb-counter"></span>
      <div class="btn-group">
        <button type="button" class="lightbox__btn" id="lb-prev" aria-label="上一张">← 上一张</button>
        <button type="button" class="lightbox__btn" id="lb-next" aria-label="下一张">下一张 →</button>
        <button type="button" class="lightbox__btn" id="lb-close" aria-label="关闭预览">关闭 Esc</button>
      </div>
    </div>
    <div class="lightbox__stage" id="lb-stage"></div>
    <div class="lightbox__foot">
      <span class="lightbox__caption" id="lb-caption"></span>
      <a class="lightbox__btn" id="lb-raw" target="_blank" rel="noopener noreferrer">新标签查看原图 ↗</a>
    </div>
  `;
  document.body.appendChild(modal);

  const stageEl = modal.querySelector("#lb-stage");
  const capEl = modal.querySelector("#lb-caption");
  const cntEl = modal.querySelector("#lb-counter");
  const rawEl = modal.querySelector("#lb-raw");
  const prevBtn = modal.querySelector("#lb-prev");
  const nextBtn = modal.querySelector("#lb-next");
  const closeBtn = modal.querySelector("#lb-close");

  let groupItems = [];
  let currentIndex = 0;
  let lastTrigger = null;

  const render = () => {
    const item = groupItems[currentIndex];
    if (!item) return;
    const src = item.getAttribute("data-lightbox-src");
    const cap = item.getAttribute("data-lightbox-caption") || "";
    const imgEl = document.createElement("img");
    imgEl.className = "lightbox__img";
    imgEl.id = "lb-img";
    imgEl.src = src;
    imgEl.alt = cap;
    stageEl.replaceChildren(imgEl);
    capEl.textContent = cap;
    rawEl.href = src;
    cntEl.textContent = `${String(currentIndex + 1).padStart(2, "0")} / ${String(groupItems.length).padStart(2, "0")}`;
    const single = groupItems.length <= 1;
    prevBtn.hidden = single;
    nextBtn.hidden = single;
  };

  const open = (trigger) => {
    const groupName = trigger.getAttribute("data-lightbox-group");
    groupItems = triggers.filter((t) => t.getAttribute("data-lightbox-group") === groupName);
    currentIndex = Math.max(0, groupItems.indexOf(trigger));
    lastTrigger = trigger;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    render();
    closeBtn.focus();
  };

  const close = () => {
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.style.overflow = "";
    if (lastTrigger && typeof lastTrigger.focus === "function") {
      lastTrigger.focus();
    }
  };

  const step = (delta) => {
    if (groupItems.length <= 1) return;
    currentIndex = (currentIndex + delta + groupItems.length) % groupItems.length;
    render();
  };

  triggers.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      open(btn);
    });
  });

  prevBtn.addEventListener("click", () => step(-1));
  nextBtn.addEventListener("click", () => step(1));
  closeBtn.addEventListener("click", close);

  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.classList.contains("lightbox__stage")) {
      close();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (modal.hidden) return;
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    }
  });
});
