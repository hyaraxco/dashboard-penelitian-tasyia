/**
 * Rankings Display
 * Creates ranking lists for Kecemasan and Stereotip
 */

function createRankings() {
  const colorsMap = new Map(Object.entries(COLORS));
  const shortMap = new Map(Object.entries(SHORT));
  const jurusanAvg = new Map();

  Array.from(colorsMap.keys()).forEach((j) => {
    const p = PERSONAS.filter((p2) => p2.jurusan === j);
    jurusanAvg.set(j, {
      kecemasan: parseFloat((p.reduce((a, p3) => a + p3.kecemasan, 0) / p.length).toFixed(2)),
      stereotip: parseFloat((p.reduce((a, p3) => a + p3.stereotip, 0) / p.length).toFixed(2)),
    });
  });

  const renderRank = (sorted, key, containerId) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.textContent = ""; // Clear existing secure

    sorted.forEach(([j, d], i) => {
      const val = key === "kecemasan" ? d.kecemasan : d.stereotip;
      const badge = val >= 2.6 ? "high" : val >= 2.3 ? "mid" : "low";

      const item = document.createElement("div");
      item.style.display = "flex";
      item.style.alignItems = "center";
      item.style.gap = "12px";
      item.style.padding = "12px 0";
      if (i < sorted.length - 1) {
        item.style.borderBottom = "1px solid var(--inset-border)";
      }

      const numDiv = document.createElement("div");
      numDiv.className = "mono";
      numDiv.style.fontSize = "18px";
      numDiv.style.fontWeight = "600";
      numDiv.style.color = "var(--text-muted)";
      numDiv.style.width = "24px";
      numDiv.textContent = (i + 1).toString();
      item.appendChild(numDiv);

      const contentDiv = document.createElement("div");
      contentDiv.style.flex = "1";

      const titleDiv = document.createElement("div");
      titleDiv.style.fontSize = "13px";
      titleDiv.style.fontWeight = "500";
      titleDiv.textContent = shortMap.get(j) || j;
      contentDiv.appendChild(titleDiv);

      const valDiv = document.createElement("div");
      valDiv.className = "mono";
      valDiv.style.fontSize = "16px";
      valDiv.style.fontWeight = "600";
      valDiv.style.color = colorsMap.get(j) || "";
      valDiv.textContent = val.toFixed(2);
      contentDiv.appendChild(valDiv);

      item.appendChild(contentDiv);

      const badgeSpan = document.createElement("span");
      badgeSpan.className = `badge badge-${badge}`;
      badgeSpan.textContent = badge === "high" ? "Tinggi" : badge === "mid" ? "Sedang" : "Rendah";
      item.appendChild(badgeSpan);

      container.appendChild(item);
    });
  };

  renderRank(
    Array.from(jurusanAvg.entries()).sort((a, b) => b[1].kecemasan - a[1].kecemasan),
    "kecemasan",
    "rankingKecemasan"
  );

  renderRank(
    Array.from(jurusanAvg.entries()).sort((a, b) => b[1].stereotip - a[1].stereotip),
    "stereotip",
    "rankingStereotip"
  );
}
