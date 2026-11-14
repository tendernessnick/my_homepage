// 字段投影机制示意：只显隐列，始终保留两条虚构明细，不读取或改变真实案例。
document.querySelectorAll('[data-projection-demo]').forEach((demo) => {
  const button = demo.querySelector('[data-projection-toggle]');
  const status = demo.querySelector('[data-projection-status]');
  if (!button || !status) return;
  const productCells = [...demo.querySelectorAll('[data-demo-product]')];
  const amountCells = [...demo.querySelectorAll('[data-demo-amount]')];
  let projected = false;
  button.addEventListener('click', () => {
    projected = !projected;
    productCells.forEach((cell) => { cell.hidden = projected; });
    amountCells.forEach((cell) => { cell.hidden = !projected; });
    demo.classList.toggle('is-projected', projected);
    button.setAttribute('aria-pressed', String(projected));
    button.textContent = projected ? '还原完整字段 ↶' : '只保留分析字段 ↗';
    status.textContent = projected
      ? '投影完成：两行在展示字段上相同，仍保留 2 行。没有执行去重。'
      : '完整字段：商品码与说明不同；两行都在。';
  });
  button.disabled = false;
  button.hidden = false;
});
