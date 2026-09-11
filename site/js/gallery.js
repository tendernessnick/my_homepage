// ============================================================
// 照片墙：鼠标拖拽横向滚动（触摸设备走原生滚动）
// ============================================================

export function initGallery() {
  const wall = document.getElementById('photoWall');
  if (!wall) return;

  let down = false;
  let startX = 0;
  let startLeft = 0;

  wall.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'touch') return; // 触屏用原生滚动
    down = true;
    startX = e.clientX;
    startLeft = wall.scrollLeft;
    wall.classList.add('dragging');
    wall.setPointerCapture(e.pointerId);
  });

  wall.addEventListener('pointermove', (e) => {
    if (!down) return;
    wall.scrollLeft = startLeft - (e.clientX - startX);
  });

  ['pointerup', 'pointercancel'].forEach((ev) =>
    wall.addEventListener(ev, () => {
      down = false;
      wall.classList.remove('dragging');
    })
  );
}
