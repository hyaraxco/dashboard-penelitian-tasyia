/**
 * Heatmap Visualization
 * Creates the Dimensi Stereotip per Jurusan heatmap
 */

function createHeatmap() {
  const dims = [
    "Diskriminasi Akademik",
    "Maskulinitas",
    "Percaya Diri",
    "Peran Gender",
    "Diskriminasi Karir",
    "Identitas Profesional",
    "Stereotip Fisik",
    "Kesetaraan",
  ];
  const colorsMap = new Map(Object.entries(COLORS));
  const shortMap = new Map(Object.entries(SHORT));
  const jurusan = Array.from(colorsMap.keys());

  const container = document.getElementById("heatmapContainer");
  if (!container) return;
  container.textContent = ""; // Clear existing content securely to prevent XSS

  const table = document.createElement("table");
  table.className = "heatmap-table";
  table.setAttribute("aria-label", "Heatmap dimensi stereotip per jurusan");

  // Thead
  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");

  const dimHeader = document.createElement("th");
  dimHeader.style.padding = "12px 16px";
  dimHeader.style.textAlign = "left";
  dimHeader.style.fontSize = "11px";
  dimHeader.style.fontWeight = "600";
  dimHeader.style.color = "var(--text-tertiary)";
  dimHeader.style.textTransform = "uppercase";
  dimHeader.style.letterSpacing = "0.05em";
  dimHeader.textContent = "Dimensi";
  headRow.appendChild(dimHeader);

  jurusan.forEach((j) => {
    const th = document.createElement("th");
    th.style.padding = "12px 12px";
    th.style.textAlign = "center";
    th.style.fontSize = "11px";
    th.style.fontWeight = "600";
    th.style.color = "var(--text-tertiary)";
    th.textContent = shortMap.get(j) || j;
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);
  table.appendChild(thead);

  // Tbody
  const tbody = document.createElement("tbody");
  dims.forEach((d) => {
    const tr = document.createElement("tr");
    tr.style.borderTop = "1px solid var(--inset-border)";

    const tdDim = document.createElement("td");
    tdDim.style.padding = "12px 16px";
    tdDim.style.fontSize = "13px";
    tdDim.textContent = d;
    tr.appendChild(tdDim);

    jurusan.forEach((j) => {
      const tdVal = document.createElement("td");
      tdVal.style.padding = "12px";
      tdVal.style.textAlign = "center";

      const base = 2.0 + Math.random() * 0.8;
      const intensity = Math.min(1, (base - 1.5) / 2);

      const div = document.createElement("div");
      div.className = "heatmap-score";

      const hexIntensity = Math.floor(intensity * 200).toString(16).padStart(2, "0");
      const colorHex = colorsMap.get(j) || "";
      div.style.background = `${colorHex}${hexIntensity}`;
      div.style.fontFamily = "'JetBrains Mono', monospace";
      div.style.fontSize = "12px";
      div.style.fontWeight = "600";
      div.style.color = intensity > 0.5 ? "#fff" : colorHex;
      div.textContent = base.toFixed(1);

      tdVal.appendChild(div);
      tr.appendChild(tdVal);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  container.appendChild(table);

  // Legend
  const legendContainer = document.createElement("div");
  legendContainer.className = "heatmap-legend";

  const meta = document.createElement("div");
  meta.className = "heatmap-legend-meta";

  const kicker = document.createElement("span");
  kicker.className = "heatmap-legend-kicker";
  kicker.textContent = "Skala skor";
  meta.appendChild(kicker);

  const title = document.createElement("span");
  title.className = "heatmap-legend-title";
  title.textContent = "Intensitas warna";
  meta.appendChild(title);

  const description = document.createElement("span");
  description.className = "heatmap-legend-description";
  description.textContent = "Semakin pekat, semakin tinggi skornya";
  meta.appendChild(description);

  legendContainer.appendChild(meta);

  const scale = document.createElement("div");
  scale.className = "heatmap-legend-scale";

  const valMin = document.createElement("span");
  valMin.className = "heatmap-legend-value";
  valMin.textContent = "1.0";
  scale.appendChild(valMin);

  const rail = document.createElement("div");
  rail.className = "heatmap-legend-rail";
  const segmentAlphas = [0.1, 0.24, 0.38, 0.56, 0.8];
  const accentRgb = getComputedStyle(document.documentElement)
    .getPropertyValue("--heatmap-legend-accent-rgb")
    .trim() || "15, 118, 110";

  segmentAlphas.forEach((alpha, index) => {
    const segment = document.createElement("div");
    segment.className = "heatmap-legend-segment";
    segment.style.background = `linear-gradient(180deg, rgba(${accentRgb}, ${alpha}), rgba(${accentRgb}, ${alpha * 0.5}))`;
    segment.style.setProperty("--segment-delay", `${index * 160}ms`);
    rail.appendChild(segment);
  });

  scale.appendChild(rail);

  const valMax = document.createElement("span");
  valMax.className = "heatmap-legend-value heatmap-legend-value--strong";
  valMax.textContent = "4.0";
  scale.appendChild(valMax);

  legendContainer.appendChild(scale);

  const note = document.createElement("div");
  note.className = "heatmap-legend-note";

  const noteIcon = document.createElement("div");
  noteIcon.className = "heatmap-legend-note-icon";

  const infoSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  infoSvg.setAttribute("viewBox", "0 0 24 24");
  infoSvg.setAttribute("fill", "none");
  infoSvg.setAttribute("stroke", "currentColor");
  infoSvg.setAttribute("stroke-width", "2");
  infoSvg.setAttribute("aria-hidden", "true");

  const infoCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  infoCircle.setAttribute("cx", "12");
  infoCircle.setAttribute("cy", "12");
  infoCircle.setAttribute("r", "10");
  infoSvg.appendChild(infoCircle);

  const infoPath1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  infoPath1.setAttribute("d", "M12 16v-4");
  infoSvg.appendChild(infoPath1);

  const infoPath2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  infoPath2.setAttribute("d", "M12 8h.01");
  infoSvg.appendChild(infoPath2);

  noteIcon.appendChild(infoSvg);
  note.appendChild(noteIcon);

  const noteText = document.createElement("div");
  noteText.className = "heatmap-legend-note-text";
  noteText.textContent = "Sumbu kiri = dimensi stereotip; kolom = jurusan. Skor dari 1.0 hingga 4.0.";
  note.appendChild(noteText);

  legendContainer.appendChild(note);

  const legendMount = document.getElementById("heatmapLegend") || container;
  legendMount.textContent = "";
  legendMount.appendChild(legendContainer);
}
