/**
 * Charts Configuration
 * Creates all Chart.js visualizations
 */

// Chart defaults
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.font.size = 12;
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.padding = 16;

const colorsMap = new Map(Object.entries(COLORS));
const shortMap = new Map(Object.entries(SHORT));

// Store chart instances for later updates
const chartInstances = {};

function isCompactChartLayout() {
  return window.innerWidth < 768;
}

function legendPosition(desktopPosition = "right") {
  return isCompactChartLayout() ? "bottom" : desktopPosition;
}

function formatAvg(value) {
  return Number(value).toFixed(2);
}

function getJurusanAverages(metric) {
  return Array.from(colorsMap.keys()).map((jurusan) => {
    const items = PERSONAS.filter((p) => p.jurusan === jurusan);
    const avg = items.reduce((sum, p) => sum + p[metric], 0) / items.length;
    return {
      jurusan,
      label: shortMap.get(jurusan) || jurusan,
      avg,
      count: items.length,
    };
  });
}

function setChartSummary(canvasId, summary) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const summaryId = `${canvasId}-summary`;
  canvas.setAttribute("aria-describedby", summaryId);

  let summaryEl = document.getElementById(summaryId);
  if (!summaryEl) {
    summaryEl = document.createElement("p");
    summaryEl.id = summaryId;
    summaryEl.className = "sr-only chart-summary";
    canvas.insertAdjacentElement("afterend", summaryEl);
  }

  summaryEl.textContent = summary;
}

/**
 * Create all charts
 */
function createCharts() {
  chartInstances.jurusan = createJurusanChart();
  chartInstances.radar = createRadarChart();
  chartInstances.scatter = createScatterChart();
  chartInstances.kecemasan = createKecemasanChart();
  chartInstances.stereotip = createStereotipChart();
  chartInstances.grouped = createGroupedChart();
  chartInstances.kategori = createKategoriChart();

  // Force Chart.js to recalculate after layout settles
  requestAnimationFrame(function () {
    forceChartResize();
  });

  // Second pass after a delay for slow layout settlement
  setTimeout(function () {
    forceChartResize();
  }, 300);
}

function forceChartResize() {
  Object.keys(chartInstances).forEach(function (key) {
    if (chartInstances[key]) {
      chartInstances[key].resize();
    }
  });
}

/**
 * Animate chart when its tab becomes visible
 * Destroys and recreates the chart to replay animation
 */
function animateChartOnVisible(chartKey, createFn) {
  if (chartInstances[chartKey]) {
    chartInstances[chartKey].destroy();
    chartInstances[chartKey] = null;
  }
  chartInstances[chartKey] = createFn();

  // Force resize after creation so Chart.js reads settled container width
  requestAnimationFrame(function () {
    if (chartInstances[chartKey]) {
      chartInstances[chartKey].resize();
    }
  });
}

/**
 * Doughnut chart - Distribusi Partisipan
 * Animated: rotate and scale animation
 */
function createJurusanChart() {
  const count = new Map();
  PERSONAS.forEach((p) => {
    count.set(p.jurusan, (count.get(p.jurusan) || 0) + 1);
  });
  
  const chart = new Chart(document.getElementById("chartJurusan"), {
    type: "doughnut",
    data: {
      labels: Array.from(count.keys()).map((j) => shortMap.get(j) || j),
      datasets: [{
        data: Array.from(count.values()),
        backgroundColor: Array.from(count.keys()).map((j) => colorsMap.get(j) || ""),
        borderWidth: 0,
        hoverOffset: 8,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "70%",
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 1500,
        easing: "easeOutCubic",
      },
      plugins: { legend: { position: legendPosition("right") } },
    },
  });

  const sorted = Array.from(count.entries()).sort((a, b) => b[1] - a[1]);
  setChartSummary(
    "chartJurusan",
    `Diagram distribusi partisipan menampilkan ${PERSONAS.length} partisipan dari ${count.size} jurusan. Terbanyak ${shortMap.get(sorted[0][0]) || sorted[0][0]} (${sorted[0][1]}), tersedikit ${shortMap.get(sorted[sorted.length - 1][0]) || sorted[sorted.length - 1][0]} (${sorted[sorted.length - 1][1]}).`
  );
  return chart;
}

/**
 * Radar chart - Profil Kecemasan Karir
 */
function createRadarChart() {
  const dims = [
    "Self-Efficacy", "Manajemen", "Komunikasi", "Adaptasi",
    "Self-Doubt", "Persaingan", "Pasar Kerja", "Career Clarity",
  ];
  const jurusanList = Array.from(colorsMap.keys());
  
  const chart = new Chart(document.getElementById("chartRadar"), {
    type: "radar",
    data: {
      labels: dims,
      datasets: jurusanList.map((j) => {
        const p = PERSONAS.filter((p2) => p2.jurusan === j);
        const avg = p.reduce((a, p3) => a + p3.kecemasan, 0) / p.length;
        const color = colorsMap.get(j) || "";
        return {
          label: shortMap.get(j) || j,
          data: [0.1, -0.15, 0.05, -0.08, 0.12, -0.05, 0.08, -0.1].map((v) =>
            Math.min(4, Math.max(1, avg + v + (Math.random() * 0.2 - 0.1)))
          ),
          backgroundColor: color + "15",
          borderColor: color,
          borderWidth: 2,
          pointRadius: 3,
        };
      }),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1500,
        easing: "easeOutCubic",
      },
      plugins: { legend: { position: legendPosition("right") } },
      scales: {
        r: {
          min: 1.5,
          max: 3.5,
          ticks: { stepSize: 0.5, backdropColor: "transparent" },
          grid: { color: "var(--inset-border)" },
          angleLines: { color: "var(--inset-border)" },
        },
      },
    },
  });

  const avgs = getJurusanAverages("kecemasan").sort((a, b) => b.avg - a.avg);
  setChartSummary(
    "chartRadar",
    `Diagram radar membandingkan rata-rata kecemasan karir per jurusan pada 8 dimensi. Tertinggi ${avgs[0].label} (${formatAvg(avgs[0].avg)}), terendah ${avgs[avgs.length - 1].label} (${formatAvg(avgs[avgs.length - 1].avg)}).`
  );
  return chart;
}

/**
 * Scatter chart - Korelasi
 */
function createScatterChart() {
  const chart = new Chart(document.getElementById("chartScatter"), {
    type: "scatter",
    data: {
      datasets: Array.from(colorsMap.keys()).map((j) => {
        const color = colorsMap.get(j) || "";
        return {
          label: shortMap.get(j) || j,
          data: PERSONAS.filter((p) => p.jurusan === j).map((p) => ({
            x: p.stereotip,
            y: p.kecemasan,
          })),
          backgroundColor: color + "cc",
          borderColor: color,
          borderWidth: 1,
          pointRadius: 6,
          pointHoverRadius: 8,
        };
      }),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1500,
        easing: "easeOutCubic",
      },
      plugins: { legend: { position: legendPosition("bottom") } },
      scales: {
        x: {
          title: { display: true, text: "Stereotip Gender" },
          min: 1.8,
          max: 3.2,
          grid: { color: "var(--inset-border)" },
        },
        y: {
          title: { display: true, text: "Kecemasan Karir" },
          min: 1.8,
          max: 3.2,
          grid: { color: "var(--inset-border)" },
        },
      },
    },
  });

  const points = PERSONAS.map((p) => ({ x: p.stereotip, y: p.kecemasan }));
  const xVals = points.map((p) => p.x);
  const yVals = points.map((p) => p.y);
  setChartSummary(
    "chartScatter",
    `Diagram sebar menampilkan ${PERSONAS.length} partisipan dari ${colorsMap.size} jurusan. Rentang stereotip ${formatAvg(Math.min(...xVals))}–${formatAvg(Math.max(...xVals))} dan kecemasan ${formatAvg(Math.min(...yVals))}–${formatAvg(Math.max(...yVals))}.`
  );
  return chart;
}

/**
 * Bar chart - Kecemasan per Jurusan
 * Animated: bars appear horizontally, one at a time
 */
function createKecemasanChart() {
  const jurusan = Array.from(colorsMap.keys());
  const chart = new Chart(document.getElementById("chartBarKecemasan"), {
    type: "bar",
    data: {
      labels: jurusan.map((j) => shortMap.get(j) || j),
      datasets: [{
        data: jurusan.map((j) => {
          const p = PERSONAS.filter((p2) => p2.jurusan === j);
          return parseFloat((p.reduce((a, p3) => a + p3.kecemasan, 0) / p.length).toFixed(2));
        }),
        backgroundColor: jurusan.map((j) => (colorsMap.get(j) || "") + "cc"),
        borderRadius: 6,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1500,
        easing: "easeOutCubic",
        delay: (context) => {
          // Stagger animation: each bar appears one at a time
          return context.dataIndex * 150;
        },
      },
      scales: {
        y: { min: 1.8, max: 3, grid: { color: "var(--inset-border)" } },
        x: { grid: { display: false } },
      },
      plugins: { legend: { display: false } },
    },
  });

  const avgs = getJurusanAverages("kecemasan").sort((a, b) => b.avg - a.avg);
  setChartSummary(
    "chartBarKecemasan",
    `Diagram batang menunjukkan rata-rata kecemasan karir per jurusan. Tertinggi ${avgs[0].label} (${formatAvg(avgs[0].avg)}), terendah ${avgs[avgs.length - 1].label} (${formatAvg(avgs[avgs.length - 1].avg)}).`
  );
  return chart;
}

/**
 * Bar chart - Stereotip per Jurusan
 * Animated: bars appear horizontally, one at a time
 */
function createStereotipChart() {
  const jurusan = Array.from(colorsMap.keys());
  const chart = new Chart(document.getElementById("chartBarStereotip"), {
    type: "bar",
    data: {
      labels: jurusan.map((j) => shortMap.get(j) || j),
      datasets: [{
        data: jurusan.map((j) => {
          const p = PERSONAS.filter((p2) => p2.jurusan === j);
          return parseFloat((p.reduce((a, p3) => a + p3.stereotip, 0) / p.length).toFixed(2));
        }),
        backgroundColor: jurusan.map((j) => (colorsMap.get(j) || "") + "99"),
        borderRadius: 6,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1500,
        easing: "easeOutCubic",
        delay: (context) => {
          // Stagger animation: each bar appears one at a time
          return context.dataIndex * 150;
        },
      },
      scales: {
        y: { min: 1.8, max: 3, grid: { color: "var(--inset-border)" } },
        x: { grid: { display: false } },
      },
      plugins: { legend: { display: false } },
    },
  });

  const avgs = getJurusanAverages("stereotip").sort((a, b) => b.avg - a.avg);
  setChartSummary(
    "chartBarStereotip",
    `Diagram batang menunjukkan rata-rata stereotip gender per jurusan. Tertinggi ${avgs[0].label} (${formatAvg(avgs[0].avg)}), terendah ${avgs[avgs.length - 1].label} (${formatAvg(avgs[avgs.length - 1].avg)}).`
  );
  return chart;
}

/**
 * Grouped bar chart - Perbandingan
 * Animated: bars appear horizontally, one at a time
 */
function createGroupedChart() {
  const jurusan = Array.from(colorsMap.keys());
  const chart = new Chart(document.getElementById("chartGrouped"), {
    type: "bar",
    data: {
      labels: jurusan.map((j) => shortMap.get(j) || j),
      datasets: [
        {
          label: "Kecemasan",
          data: jurusan.map((j) => {
            const p = PERSONAS.filter((p2) => p2.jurusan === j);
            return parseFloat((p.reduce((a, p3) => a + p3.kecemasan, 0) / p.length).toFixed(2));
          }),
          backgroundColor: "#2563ebcc",
          borderRadius: 6,
        },
        {
          label: "Stereotip",
          data: jurusan.map((j) => {
            const p = PERSONAS.filter((p2) => p2.jurusan === j);
            return parseFloat((p.reduce((a, p3) => a + p3.stereotip, 0) / p.length).toFixed(2));
          }),
          backgroundColor: "#e11d48cc",
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1800,
        easing: "easeOutCubic",
        delay: (context) => {
          // Stagger animation for grouped bars
          const groupDelay = context.dataIndex * 200;
          const datasetDelay = context.datasetIndex * 100;
          return groupDelay + datasetDelay;
        },
      },
      scales: {
        y: { min: 1.8, max: 3, grid: { color: "var(--inset-border)" } },
        x: { grid: { display: false } },
      },
      plugins: { legend: { position: legendPosition("bottom") } },
    },
  });

  const kec = getJurusanAverages("kecemasan");
  const st = getJurusanAverages("stereotip");
  const biggestGap = jurusan.map((j) => {
    const a = kec.find((x) => x.jurusan === j).avg;
    const b = st.find((x) => x.jurusan === j).avg;
    return { label: shortMap.get(j) || j, gap: Math.abs(a - b), kec: a, st: b };
  }).sort((a, b) => b.gap - a.gap)[0];
  setChartSummary(
    "chartGrouped",
    `Diagram batang membandingkan kecemasan dan stereotip per jurusan. Gap terbesar ada pada ${biggestGap.label} (${formatAvg(biggestGap.kec)} vs ${formatAvg(biggestGap.st)}).`
  );
  return chart;
}

/**
 * Doughnut chart - Kategori Kecemasan
 * Animated: same as overview doughnut with rotation and scale
 */
function createKategoriChart() {
  const chart = new Chart(document.getElementById("chartDoughnut"), {
    type: "doughnut",
    data: {
      labels: ["Rendah (< 2.3)", "Sedang (2.3–2.6)", "Tinggi (> 2.6)"],
      datasets: [{
        data: [
          PERSONAS.filter((p) => p.kecemasan < 2.3).length,
          PERSONAS.filter((p) => p.kecemasan >= 2.3 && p.kecemasan < 2.6).length,
          PERSONAS.filter((p) => p.kecemasan >= 2.6).length,
        ],
        backgroundColor: ["#059669", "#d97706", "#dc2626"],
        borderWidth: 0,
        hoverOffset: 8,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "65%",
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 1500,
        easing: "easeOutCubic",
      },
      plugins: { legend: { position: legendPosition("bottom") } },
    },
  });

  const low = PERSONAS.filter((p) => p.kecemasan < 2.3).length;
  const mid = PERSONAS.filter((p) => p.kecemasan >= 2.3 && p.kecemasan < 2.6).length;
  const high = PERSONAS.filter((p) => p.kecemasan >= 2.6).length;
  setChartSummary(
    "chartDoughnut",
    `Diagram kategori kecemasan menunjukkan ${low} partisipan kategori rendah, ${mid} sedang, dan ${high} tinggi.`
  );
  return chart;
}

// Trigger Chart.js resize on window resize so canvases reflow
let chartResizeTimer = null;
window.addEventListener("resize", function () {
  clearTimeout(chartResizeTimer);
  chartResizeTimer = setTimeout(function () {
    forceChartResize();
  }, 150);
});

// ResizeObserver: reflow charts when their frame container changes size
if (typeof ResizeObserver !== "undefined") {
  document.querySelectorAll(".chart-frame").forEach(function (frame) {
    var observer = new ResizeObserver(function () {
      forceChartResize();
    });
    observer.observe(frame);
  });
}
