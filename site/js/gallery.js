// 生活照片原图浏览：只有 dialog 可用时才增强，静态链接始终有效。
const links = [...document.querySelectorAll("a[data-gallery-item]")];

if (links.length && typeof HTMLDialogElement !== "undefined" &&
    typeof HTMLDialogElement.prototype.showModal === "function") {
  const dialog = document.createElement("dialog");
  dialog.className = "gallery-dialog";
  dialog.setAttribute("aria-label", "生活照片大图");
  dialog.setAttribute("aria-describedby", "gallery-help");
  dialog.innerHTML = `
    <div class="gallery-content">
      <div class="gallery-toolbar"><span>FIELD NOTES / RUIJIE HU</span><button class="gallery-close" type="button" aria-label="关闭大图">关闭 <span aria-hidden="true">ESC</span></button></div>
      <figure class="gallery-view"><img class="gallery-image" alt="" /><p class="gallery-error" role="status" hidden>这张照片暂时未能加载，可关闭后打开原图链接重试。</p></figure>
      <div class="gallery-caption" aria-live="polite" aria-atomic="true"><div><strong class="gallery-title"></strong><small class="gallery-description"></small></div><span class="gallery-counter"></span></div>
      <div class="gallery-controls"><button class="gallery-step gallery-prev" type="button" aria-label="上一张照片"><span aria-hidden="true">←</span> 上一张</button><p id="gallery-help">左右方向键翻看<br>Esc 返回照片墙</p><button class="gallery-step gallery-next" type="button" aria-label="下一张照片">下一张 <span aria-hidden="true">→</span></button></div>
    </div>`;
  document.body.appendChild(dialog);

  const image = dialog.querySelector(".gallery-image");
  const title = dialog.querySelector(".gallery-title");
  const description = dialog.querySelector(".gallery-description");
  const counter = dialog.querySelector(".gallery-counter");
  const error = dialog.querySelector(".gallery-error");
  const closeButton = dialog.querySelector(".gallery-close");
  let current = 0;
  let returnFocus = null;

  const showPhoto = (index) => {
    current = (index + links.length) % links.length;
    const link = links[current];
    const thumbnail = link.querySelector("img");
    const caption = link.dataset.galleryCaption || thumbnail?.alt || "生活照片";
    title.textContent = caption;
    description.textContent = thumbnail?.alt || "";
    counter.textContent = `${String(current + 1).padStart(2, "0")} / ${String(links.length).padStart(2, "0")}`;
    dialog.setAttribute("aria-label", `生活照片：${caption}，第 ${current + 1} 张，共 ${links.length} 张`);
    error.hidden = true;
    image.hidden = false;
    image.alt = thumbnail?.alt || caption;
    image.src = link.href;
  };

  links.forEach((link, index) => {
    link.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      try {
        returnFocus = link;
        showPhoto(index);
        dialog.showModal();
      } catch {
        return; // 增强层无法打开时保留链接的默认行为。
      }
      event.preventDefault();
      document.documentElement.classList.add("gallery-open");
      closeButton.focus({ preventScroll: true });
    });
  });

  image.addEventListener("error", () => {
    error.hidden = false;
    image.hidden = true;
  });
  closeButton.addEventListener("click", () => dialog.close());
  dialog.querySelector(".gallery-prev").addEventListener("click", () => showPhoto(current - 1));
  dialog.querySelector(".gallery-next").addEventListener("click", () => showPhoto(current + 1));
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      showPhoto(current + (event.key === "ArrowLeft" ? -1 : 1));
    }
  });
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener("close", () => {
    document.documentElement.classList.remove("gallery-open");
    if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
  });
}
