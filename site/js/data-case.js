/* ==========================================================================
   Data Case Interactive Schema Projection Simulator (data-case.html)
   Fictional 2-row demo strictly illustrating how removing StockCode & Description
   makes two distinct line items identical across output columns without deleting rows.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("projection-sim");
  if (!root) return;

  const btnRaw = root.querySelector('[data-sim-mode="raw"]');
  const btnProj = root.querySelector('[data-sim-mode="projected"]');
  const tableHead = root.querySelector("#sim-head");
  const tableBody = root.querySelector("#sim-body");
  const verdict = root.querySelector("#sim-verdict");

  const renderMode = (mode) => {
    const isProjected = mode === "projected";
    btnRaw.setAttribute("aria-pressed", String(!isProjected));
    btnProj.setAttribute("aria-pressed", String(isProjected));

    if (!isProjected) {
      tableHead.innerHTML = `
        <tr>
          <th>订单</th>
          <th>商品码</th>
          <th>商品说明</th>
          <th class="num">数量</th>
          <th class="num">单价</th>
          <th class="num">金额</th>
        </tr>
      `;
      tableBody.innerHTML = `
        <tr>
          <td class="mono">DEMO-01</td>
          <td class="mono"><strong>A</strong></td>
          <td>虚构商品 A</td>
          <td class="num">2</td>
          <td class="num">10.00</td>
          <td class="num">20.00</td>
        </tr>
        <tr>
          <td class="mono">DEMO-01</td>
          <td class="mono"><strong>B</strong></td>
          <td>虚构商品 B</td>
          <td class="num">2</td>
          <td class="num">10.00</td>
          <td class="num">20.00</td>
        </tr>
      `;
      verdict.textContent = "完整字段状态（2 行 · 0 条完全重复行）：商品码与商品说明不同，引擎识别为两条不同记录。";
    } else {
      tableHead.innerHTML = `
        <tr>
          <th>订单 (InvoiceNo)</th>
          <th class="num">数量 (Quantity)</th>
          <th class="num">单价 (Price)</th>
          <th class="num">派生金额 (Amount)</th>
        </tr>
      `;
      tableBody.innerHTML = `
        <tr class="demo-row-match">
          <td class="mono">DEMO-01</td>
          <td class="num">2</td>
          <td class="num">10.00</td>
          <td class="num">20.00</td>
        </tr>
        <tr class="demo-row-match">
          <td class="mono">DEMO-01</td>
          <td class="num">2</td>
          <td class="num">10.00</td>
          <td class="num">20.00</td>
        </tr>
      `;
      verdict.textContent = "移除商品字段后（仍保留 2 行 · 引擎判为 1 条完全重复行）：未删除行，但当前全部输出列完全一致。";
    }
  };

  btnRaw.addEventListener("click", () => renderMode("raw"));
  btnProj.addEventListener("click", () => renderMode("projected"));
  renderMode("raw");
});
