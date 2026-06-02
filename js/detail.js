/**
 * Detail Panel
 * Handles persona detail display and tabs
 */

let currentDetailTab = "kampus";

/**
 * Show detail for a persona
 */
function showDetail(id) {
  const p = PERSONAS.find((p2) => p2.id === id);
  if (!p) return;
  currentDetailTab = "kampus";
  renderDetail(p);
  document.getElementById("personaDetail").classList.remove("hidden");
  document.getElementById("personaDetail").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/**
 * Render detail content
 */
function renderDetail(p) {
  const colorsMap = new Map(Object.entries(COLORS));
  const color = colorsMap.get(p.jurusan) || "";

  const container = document.getElementById("personaDetailContent");
  if (!container) return;
  container.textContent = ""; // Clear existing securely

  // 1. Header Section
  const headerDiv = document.createElement("div");
  headerDiv.style.display = "flex";
  headerDiv.style.alignItems = "start";
  headerDiv.style.justifyContent = "space-between";
  headerDiv.style.marginBottom = "20px";

  // 1a. Left Column (Name & Jurusan/Usia)
  const leftCol = document.createElement("div");

  const nameDiv = document.createElement("div");
  nameDiv.style.fontSize = "18px";
  nameDiv.style.fontWeight = "600";
  nameDiv.textContent = p.nama;
  leftCol.appendChild(nameDiv);

  const infoDiv = document.createElement("div");
  infoDiv.style.fontSize = "13px";
  infoDiv.style.color = "var(--text-secondary)";
  infoDiv.style.marginTop = "4px";
  infoDiv.textContent = `${p.jurusan} · ${p.usia} tahun`;
  leftCol.appendChild(infoDiv);

  headerDiv.appendChild(leftCol);

  // 1b. Right Column (Kecemasan & Stereotip scores)
  const rightCol = document.createElement("div");
  rightCol.style.display = "flex";
  rightCol.style.gap = "8px";

  const makeScoreCard = (label, val) => {
    const card = document.createElement("div");
    card.style.padding = "8px 16px";
    card.style.background = `${color}15`;
    card.style.borderRadius = "8px";

    const labelDiv = document.createElement("div");
    labelDiv.style.fontSize = "11px";
    labelDiv.style.color = "var(--text-tertiary)";
    labelDiv.style.marginBottom = "4px";
    labelDiv.textContent = label;
    card.appendChild(labelDiv);

    const valDiv = document.createElement("div");
    valDiv.className = "mono";
    valDiv.style.fontSize = "20px";
    valDiv.style.fontWeight = "700";
    valDiv.style.color = color;
    valDiv.textContent = val.toFixed(2);
    card.appendChild(valDiv);

    return card;
  };

  rightCol.appendChild(makeScoreCard("Kecemasan", p.kecemasan));
  rightCol.appendChild(makeScoreCard("Stereotip", p.stereotip));
  headerDiv.appendChild(rightCol);
  container.appendChild(headerDiv);

  // 2. Tabs Section
  const tabsDiv = document.createElement("div");
  tabsDiv.style.display = "flex";
  tabsDiv.style.gap = "4px";
  tabsDiv.style.marginBottom = "16px";
  tabsDiv.style.borderBottom = "1px solid var(--border)";
  tabsDiv.style.paddingBottom = "8px";

  const btnKampus = document.createElement("button");
  btnKampus.className = `detail-tab ${currentDetailTab === "kampus" ? "active" : ""}`;
  btnKampus.textContent = "Faktor Kampus";
  btnKampus.addEventListener("click", () => {
    switchDetailTab("kampus", p.id);
  });
  tabsDiv.appendChild(btnKampus);

  const btnLuar = document.createElement("button");
  btnLuar.className = `detail-tab ${currentDetailTab === "luar" ? "active" : ""}`;
  btnLuar.textContent = "Faktor Luar Kampus";
  btnLuar.addEventListener("click", () => {
    switchDetailTab("luar", p.id);
  });
  tabsDiv.appendChild(btnLuar);
  container.appendChild(tabsDiv);

  // 3. Factors Grid
  const gridDiv = document.createElement("div");
  gridDiv.style.display = "grid";
  gridDiv.style.gridTemplateColumns = "repeat(3, 1fr)";
  gridDiv.style.gap = "12px";

  const kampusFactors = [
    { label: "IPK", value: p.kampus.ipk },
    { label: "Organisasi", value: p.kampus.organisasi },
    { label: "Magang", value: p.kampus.magang },
    { label: "Prestasi", value: p.kampus.prestasi },
    { label: "Dosen Pembimbing", value: p.kampus.dosen_pembimbing },
    { label: "Mata Kuliah Favorit", value: p.kampus.mata_kuliah_favorit },
  ];

  const luarFactors = [
    { label: "Keluarga", value: p.luar.keluarga },
    { label: "Ekonomi", value: p.luar.ekonomi },
    { label: "Daerah Asal", value: p.luar.daerah },
    { label: "Kepribadian", value: p.luar.kepribadian },
    { label: "Hobi", value: p.luar.hobi },
  ];

  const factors = currentDetailTab === "kampus" ? kampusFactors : luarFactors;
  factors.forEach((f) => {
    const factorCard = document.createElement("div");
    factorCard.className = "factor-card";

    const labelDiv = document.createElement("div");
    labelDiv.className = "factor-label";
    labelDiv.textContent = f.label;
    factorCard.appendChild(labelDiv);

    const valDiv = document.createElement("div");
    valDiv.className = "factor-value";
    valDiv.textContent = f.value;
    factorCard.appendChild(valDiv);

    gridDiv.appendChild(factorCard);
  });
  container.appendChild(gridDiv);
}

/**
 * Switch detail tab
 */
function switchDetailTab(tab, id) {
  currentDetailTab = tab;
  const p = PERSONAS.find((p2) => p2.id === id);
  if (p) renderDetail(p);
}
