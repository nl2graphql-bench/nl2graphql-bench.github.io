/* NL2GraphQL Bench — front-end logic: hero graph, sortable heatmap matrix, radar compare, dataset bars. */

(function () {
  "use strict";

  /* ---------- nav scroll shadow ---------- */
  const nav = document.getElementById("nav");
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 8);
  });

  /* ---------- hero graph decoration ---------- */
  (function drawHeroGraph() {
    const el = document.getElementById("heroGraph");
    const W = 1400, H = 460;
    const nodes = [];
    const cols = 9, rows = 4;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        if (Math.random() > 0.62) continue;
        nodes.push({
          x: (i / (cols - 1)) * W + (Math.random() - 0.5) * 60,
          y: (j / (rows - 1)) * H + (Math.random() - 0.5) * 60,
        });
      }
    }
    let edges = "";
    for (let a = 0; a < nodes.length; a++) {
      for (let b = a + 1; b < nodes.length; b++) {
        const dx = nodes[a].x - nodes[b].x, dy = nodes[a].y - nodes[b].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 190) {
          edges += `<line x1="${nodes[a].x.toFixed(1)}" y1="${nodes[a].y.toFixed(1)}" x2="${nodes[b].x.toFixed(1)}" y2="${nodes[b].y.toFixed(1)}" />`;
        }
      }
    }
    let dots = "";
    nodes.forEach((n, i) => {
      const r = i % 5 === 0 ? 4.5 : 2.6;
      dots += `<circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="${r}" />`;
    });
    el.innerHTML = `
      <svg viewBox="0 0 ${W} ${H}" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;">
        <defs>
          <linearGradient id="fadeMask" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#faf9fc" stop-opacity="0" />
            <stop offset="100%" stop-color="#faf9fc" stop-opacity="1" />
          </linearGradient>
        </defs>
        <g stroke="#e10098" stroke-opacity="0.16" stroke-width="1">${edges}</g>
        <g fill="#8a0a5b" fill-opacity="0.28">${dots}</g>
        <rect x="0" y="0" width="${W}" height="${H}" fill="url(#fadeMask)" />
      </svg>`;
  })();

  /* ---------- task example ---------- */
  document.getElementById("exSchema").textContent = TASK_EXAMPLE.schema;
  document.getElementById("exNL").textContent = "“" + TASK_EXAMPLE.nl + "”";
  document.getElementById("exQuery").textContent = TASK_EXAMPLE.query;

  /* ---------- color scale for the matrix ---------- */
  const COLD = [253, 230, 243]; // pale pink
  const HOT = [138, 10, 91];    // deep magenta

  function lerpColor(t) {
    t = Math.max(0, Math.min(1, t));
    const c = COLD.map((v, i) => Math.round(v + (HOT[i] - v) * t));
    return `rgb(${c[0]},${c[1]},${c[2]})`;
  }

  function textColorFor(t) {
    return t > 0.55 ? "#fbe9f5" : "#3a0f2b";
  }

  (function renderLegend() {
    const el = document.getElementById("legendScale");
    let html = "";
    for (let i = 0; i <= 8; i++) {
      html += `<span style="background:${lerpColor(i / 8)}"></span>`;
    }
    el.innerHTML = html;
  })();

  /* ---------- leaderboard matrix ---------- */
  const MEDALS = ["🥇", "🥈", "🥉"];

  let sortKey = "overall";
  let sortDir = "desc";
  let sizeTab = "all";
  let detailed = false;

  const headEl = document.getElementById("matrixHead");
  const bodyEl = document.getElementById("matrixBody");
  const footEl = document.getElementById("matrixFootnote");
  const detailToggle = document.getElementById("detailToggle");
  const legendWrap = document.getElementById("legendWrap");

  function columnBounds(rows, key) {
    const vals = rows.map((r) => r[key]);
    return { min: Math.min(...vals), max: Math.max(...vals) };
  }

  function currentRows() {
    if (sizeTab === "all") return LEADERBOARD_ENTRIES;
    return LEADERBOARD_ENTRIES.filter((r) => r.sizeBucket === sizeTab);
  }

  function renderMatrixHead() {
    const cols = [
      { key: "model", label: "Model" },
      { key: "params", label: "Params" },
      ...(detailed ? CATEGORY_KEYS.map((k) => ({ key: k, label: CATEGORY_LABELS[k] })) : []),
      { key: "overall", label: "Overall" },
    ];
    headEl.innerHTML =
      `<th>Rank</th>` +
      cols
        .map((c) => {
          const sortable = c.key !== "model" && c.key !== "params";
          const sortedClass = sortKey === c.key ? "sorted" : "";
          const arrow = sortKey === c.key ? `<span class="arrow">${sortDir === "desc" ? "▼" : "▲"}</span>` : "";
          return `<th class="${sortedClass}" ${sortable ? `data-key="${c.key}"` : ""}>${c.label}${arrow}</th>`;
        })
        .join("");
  }

  function renderMatrixBody() {
    const rows = currentRows();
    footEl.textContent = "Accuracy is execution-grounded via semantic-equivalence scoring, not exact string match. Fine-tuned settings, baselines, and closed-weight models are all shown as ranked, competing entries.";
    legendWrap.style.display = detailed ? "flex" : "none";

    const sorted = rows.slice().sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      return sortDir === "desc" ? bv - av : av - bv;
    });

    const bounds = {};
    if (detailed) CATEGORY_KEYS.forEach((k) => (bounds[k] = columnBounds(rows, k)));

    function rowHtml(r, rank) {
      const cells = detailed
        ? CATEGORY_KEYS.map((k) => {
            const { min, max } = bounds[k];
            const t = max > min ? (r[k] - min) / (max - min) : 0.5;
            return `<td class="cell" style="background:${lerpColor(t)};color:${textColorFor(t)}">${r[k].toFixed(2)}</td>`;
          }).join("")
        : "";
      const medal = rank <= 3 ? MEDALS[rank - 1] : rank;
      const weightBadge = r.weightClass === "closed" ? '<span class="badge-weight closed">closed-weight</span>' : '<span class="badge-weight open">open-weight</span>';
      return `
        <tr class="${rank <= 3 ? "top top-" + rank : ""}">
          <td class="rank">${medal}</td>
          <td class="model-cell">
            <span class="model-name">${r.model}</span>
            <span class="model-setting">${r.setting} ${weightBadge}</span>
          </td>
          <td class="params-cell">${r.params}</td>
          ${cells}
          <td class="overall">${r.overall.toFixed(2)}<span class="pct">%</span></td>
        </tr>`;
    }

    bodyEl.innerHTML = sorted.map((r, i) => rowHtml(r, i + 1)).join("");
  }

  function renderMatrix() {
    renderMatrixHead();
    renderMatrixBody();
  }

  headEl.addEventListener("click", (e) => {
    const th = e.target.closest("th[data-key]");
    if (!th) return;
    const key = th.dataset.key;
    if (sortKey === key) {
      sortDir = sortDir === "desc" ? "asc" : "desc";
    } else {
      sortKey = key;
      sortDir = "desc";
    }
    renderMatrix();
  });

  document.querySelectorAll(".size-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".size-tab").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      sizeTab = btn.dataset.size;
      renderMatrix();
    });
  });

  detailToggle.addEventListener("click", () => {
    detailed = !detailed;
    detailToggle.textContent = detailed ? "Hide category breakdown ▲" : "Show category breakdown ▾";
    renderMatrix();
  });

  renderMatrix();

  /* ---------- compare / radar chart ---------- */
  const PALETTE = ["#e10098", "#6a3df5", "#f6b93b", "#1f9d6b"];
  const ALL_MODELS = LEADERBOARD_ENTRIES;

  const pickerEl = document.getElementById("modelPicker");
  const radarSvg = document.getElementById("radarSvg");
  const legendEl = document.getElementById("radarLegend");
  const MAX_PICKS = 4;
  let selected = ["claude-sonnet-4-5", "llama-3.1-8b-a"];

  function renderPicker() {
    pickerEl.innerHTML = ALL_MODELS.map((m) => {
      const checked = selected.includes(m.id);
      const disabled = !checked && selected.length >= MAX_PICKS;
      const colorIdx = selected.indexOf(m.id);
      const swatch = checked ? PALETTE[colorIdx % PALETTE.length] : "#d8d5e2";
      return `
        <label class="pick-item ${disabled ? "disabled" : ""}">
          <input type="checkbox" data-id="${m.id}" ${checked ? "checked" : ""} ${disabled ? "disabled" : ""} />
          <span class="swatch" style="background:${swatch}"></span>
          <span>
            <span class="name">${m.model}</span><br/>
            <span class="sub">${m.setting}</span>
          </span>
        </label>`;
    }).join("");

    pickerEl.querySelectorAll("input").forEach((inp) => {
      inp.addEventListener("change", () => {
        const id = inp.dataset.id;
        if (inp.checked) {
          if (selected.length < MAX_PICKS) selected.push(id);
        } else {
          selected = selected.filter((s) => s !== id);
        }
        renderPicker();
        renderRadar();
      });
    });
  }

  function renderRadar() {
    const size = 440, cx = size / 2, cy = size / 2, R = 160;
    const n = CATEGORY_KEYS.length;
    const angle = (i) => -Math.PI / 2 + (i * 2 * Math.PI) / n;

    function pt(i, value) {
      const r = (value / 100) * R;
      return [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))];
    }

    let grid = "";
    [0.25, 0.5, 0.75, 1].forEach((f) => {
      const pts = CATEGORY_KEYS.map((_, i) => pt(i, f * 100).join(",")).join(" ");
      grid += `<polygon points="${pts}" fill="none" stroke="#e6e3ee" stroke-width="1" />`;
    });

    let axes = "";
    let labels = "";
    CATEGORY_KEYS.forEach((k, i) => {
      const [x, y] = pt(i, 100);
      axes += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#e6e3ee" stroke-width="1" />`;
      const [lx, ly] = pt(i, 118);
      labels += `<text x="${lx}" y="${ly}" font-size="10.5" fill="#514f5e" text-anchor="middle" dominant-baseline="middle" font-family="Inter, sans-serif">${CATEGORY_LABELS[k]}</text>`;
    });

    let polys = "";
    selected.forEach((id, si) => {
      const m = ALL_MODELS.find((mm) => mm.id === id);
      if (!m) return;
      const color = PALETTE[si % PALETTE.length];
      const pts = CATEGORY_KEYS.map((k, i) => pt(i, m[k]).join(",")).join(" ");
      polys += `<polygon points="${pts}" fill="${color}" fill-opacity="0.14" stroke="${color}" stroke-width="2" />`;
      CATEGORY_KEYS.forEach((k, i) => {
        const [x, y] = pt(i, m[k]);
        polys += `<circle cx="${x}" cy="${y}" r="2.6" fill="${color}" />`;
      });
    });

    radarSvg.innerHTML = grid + axes + polys + labels;

    legendEl.innerHTML = selected
      .map((id, si) => {
        const m = ALL_MODELS.find((mm) => mm.id === id);
        if (!m) return "";
        const color = PALETTE[si % PALETTE.length];
        return `<span class="item"><span class="swatch" style="background:${color}"></span>${m.model} — ${m.overall.toFixed(1)}% overall</span>`;
      })
      .join("");
  }

  renderPicker();
  renderRadar();

  /* ---------- dataset section ---------- */
  document.getElementById("splitCards").innerHTML = CORPUS_SPLITS.map(
    (s) => `
      <div class="split-card">
        <div>
          <div>${s.split}</div>
          <div class="note">${s.note}</div>
        </div>
        <div class="n">${s.instances.toLocaleString()}</div>
      </div>`
  ).join("");

  const maxCategoryTrain = Math.max(...CATEGORY_DISTRIBUTION.map((c) => c.train));
  document.getElementById("categoryBars").innerHTML = CATEGORY_DISTRIBUTION.map((c) => {
    const pct = (c.train / maxCategoryTrain) * 100;
    return `
      <div class="bar-row">
        <div>${c.name}</div>
        <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
        <div class="val">${c.train + c.test}</div>
      </div>`;
  }).join("");

  document.getElementById("domainBars").innerHTML = DOMAIN_DISTRIBUTION.map((d) => `
      <div class="bar-row">
        <div>${d.name}</div>
        <div class="bar-track"><div class="bar-fill" style="width:${d.pct}%"></div></div>
        <div class="val">${d.pct}%</div>
      </div>`).join("");
})();
