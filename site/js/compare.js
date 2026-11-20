/* ==========================================================================
   SE-CGAN Optical Before/After Comparator
   Pointer + Touch (preserves vertical page scroll) + Keyboard + 0-100 Clamped
   ========================================================================== */

function initComparator(root) {
  const stage = root.querySelector("[data-compare-stage]");
  const range = root.querySelector("[data-compare-range]");
  const readout = root.querySelector("[data-compare-readout]");
  if (!stage || !range) return;

  let value = Number(range.value) || 50;
  let pointerActive = false;
  let startX = 0;
  let startY = 0;
  let dragLocked = false;

  const setPos = (next) => {
    value = Math.max(0, Math.min(100, Math.round(next)));
    stage.style.setProperty("--pos", `${value}%`);
    range.value = String(value);
    range.setAttribute("aria-valuenow", String(value));
    if (readout) {
      readout.textContent = `对比分割线 ${value}%`;
    }
  };

  const clientXToPercent = (clientX) => {
    const rect = stage.getBoundingClientRect();
    if (!rect.width) return value;
    return ((clientX - rect.left) / rect.width) * 100;
  };

  range.addEventListener("input", () => setPos(Number(range.value)));

  stage.addEventListener("pointerdown", (e) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    pointerActive = true;
    dragLocked = e.pointerType === "mouse";
    startX = e.clientX;
    startY = e.clientY;
    if (dragLocked) {
      stage.setPointerCapture(e.pointerId);
      setPos(clientXToPercent(e.clientX));
    }
  });

  stage.addEventListener("pointermove", (e) => {
    if (!pointerActive) return;
    if (!dragLocked) {
      const dx = Math.abs(e.clientX - startX);
      const dy = Math.abs(e.clientY - startY);
      if (dy > dx && dy > 6) {
        // User is scrolling vertically; yield immediately
        pointerActive = false;
        return;
      }
      if (dx > 6) {
        dragLocked = true;
        stage.setPointerCapture(e.pointerId);
      } else {
        return;
      }
    }
    setPos(clientXToPercent(e.clientX));
  });

  const endDrag = (e) => {
    if (pointerActive && dragLocked && stage.hasPointerCapture(e.pointerId)) {
      stage.releasePointerCapture(e.pointerId);
    }
    pointerActive = false;
    dragLocked = false;
  };

  stage.addEventListener("pointerup", endDrag);
  stage.addEventListener("pointercancel", endDrag);

  setPos(value);
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-compare-root]").forEach(initComparator);
});
