/**
 * Table Rendering
 * Handles table display and row generation
 */

/**
 * Render table rows
 */
function renderTable(data) {
  const colorsMap = new Map(Object.entries(COLORS));
  const shortMap = new Map(Object.entries(SHORT));
  const startIndex = (currentPage - 1) * itemsPerPage;

  const tbody = document.getElementById("personaTable");
  if (!tbody) return;
  tbody.textContent = ""; // Clear existing securely

  data.forEach((p, index) => {
    const kecBadge = p.kecemasan >= 2.6 ? "high" : p.kecemasan >= 2.3 ? "mid" : "low";
    const stBadge = p.stereotip >= 2.6 ? "high" : p.stereotip >= 2.3 ? "mid" : "low";
    const color = colorsMap.get(p.jurusan) || "";
    const rowNumber = startIndex + index + 1;

    const tr = document.createElement("tr");
    tr.className = "table-row";
    tr.tabIndex = 0;
    tr.setAttribute("role", "button");
    tr.setAttribute("aria-label", `Lihat detail partisipan ${p.nama}`);
    tr.addEventListener("click", () => {
      showDetail(p.id);
    });
    tr.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        showDetail(p.id);
      }
    });

    // 1. Row Number
    const tdNum = document.createElement("td");
    tdNum.className = "table-cell table-cell--muted";
    tdNum.style.textAlign = "center";
    tdNum.textContent = rowNumber.toString();
    tr.appendChild(tdNum);

    // 2. Name
    const tdName = document.createElement("td");
    tdName.className = "table-cell table-cell--medium";
    tdName.textContent = p.nama;
    tr.appendChild(tdName);

    // 3. Jurusan
    const tdJur = document.createElement("td");
    tdJur.className = "table-cell";

    const divJur = document.createElement("div");
    divJur.className = "table-jurusan";

    const indicator = document.createElement("div");
    indicator.style.width = "8px";
    indicator.style.height = "8px";
    indicator.style.borderRadius = "50%";
    indicator.style.background = color;
    divJur.appendChild(indicator);

    const spanJur = document.createElement("span");
    spanJur.className = "table-cell--secondary";
    spanJur.textContent = shortMap.get(p.jurusan) || p.jurusan;
    divJur.appendChild(spanJur);

    tdJur.appendChild(divJur);
    tr.appendChild(tdJur);

    // 4. Usia
    const tdAge = document.createElement("td");
    tdAge.className = "table-cell table-cell--secondary";
    tdAge.style.textAlign = "center";
    tdAge.textContent = p.usia.toString();
    tr.appendChild(tdAge);

    // 5. Kecemasan
    const tdKec = document.createElement("td");
    tdKec.className = "table-cell";
    tdKec.style.textAlign = "center";

    const spanKecVal = document.createElement("span");
    spanKecVal.className = "mono";
    spanKecVal.style.fontWeight = "600";
    spanKecVal.textContent = p.kecemasan.toFixed(2);
    tdKec.appendChild(spanKecVal);

    const space1 = document.createTextNode(" ");
    tdKec.appendChild(space1);

    const badgeKec = document.createElement("span");
    badgeKec.className = `badge badge-${kecBadge}`;
    badgeKec.textContent = kecBadge === "high" ? "H" : kecBadge === "mid" ? "M" : "L";
    tdKec.appendChild(badgeKec);

    tr.appendChild(tdKec);

    // 6. Stereotip
    const tdSt = document.createElement("td");
    tdSt.className = "table-cell";
    tdSt.style.textAlign = "center";

    const spanStVal = document.createElement("span");
    spanStVal.className = "mono";
    spanStVal.style.fontWeight = "600";
    spanStVal.textContent = p.stereotip.toFixed(2);
    tdSt.appendChild(spanStVal);

    const space2 = document.createTextNode(" ");
    tdSt.appendChild(space2);

    const badgeSt = document.createElement("span");
    badgeSt.className = `badge badge-${stBadge}`;
    badgeSt.textContent = stBadge === "high" ? "H" : stBadge === "mid" ? "M" : "L";
    tdSt.appendChild(badgeSt);

    tr.appendChild(tdSt);

    // 7. Faktor Kampus
    const tdKampus = document.createElement("td");
    tdKampus.className = "table-cell table-cell--campus";
    tdKampus.textContent = `${p.kampus.organisasi}, IPK ${p.kampus.ipk}`;
    tr.appendChild(tdKampus);

    // 8. Faktor Luar
    const tdLuar = document.createElement("td");
    tdLuar.className = "table-cell table-cell--outside";

    const luarText = p.luar.keluarga;
    tdLuar.textContent = luarText.length > 40 ? `${luarText.substring(0, 40)}...` : luarText;
    tr.appendChild(tdLuar);

    tbody.appendChild(tr);
  });
}
