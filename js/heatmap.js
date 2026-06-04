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
  dimHeader.style.fontSize = "var(--type-2xs)";
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
    th.style.fontSize = "var(--type-2xs)";
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
    tdDim.style.fontSize = "var(--type-sm)";
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
      div.style.fontSize = "var(--type-xs)";
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
}
