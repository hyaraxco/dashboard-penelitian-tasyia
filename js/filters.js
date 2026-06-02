/**
 * Filters & Pagination
 * Handles data filtering, sorting, and pagination
 */

// Pagination state
let currentPage = 1;
let itemsPerPage = 10;
let previousItemsPerPage = 10;
let currentFilteredData = [];
let showAllMode = false;

function syncItemsPerPageSelect() {
  const select = document.getElementById("itemsPerPageSelect");
  if (select) select.value = String(itemsPerPage);
}

function getEffectiveItemsPerPage(totalItems) {
  if (showAllMode) {
    return Math.max(totalItems, 1);
  }

  return itemsPerPage;
}

function createMobileShowAllButton() {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "pagination-btn pagination-btn--toggle" + (showAllMode ? " active" : "");
  button.textContent = showAllMode ? "Halaman" : "Semua";
  button.setAttribute("aria-pressed", showAllMode ? "true" : "false");
  button.setAttribute(
    "aria-label",
    showAllMode ? "Kembali ke tampilan halaman" : "Tampilkan semua data"
  );
  button.title = showAllMode ? "Kembali ke tampilan halaman" : "Tampilkan semua data";
  button.addEventListener("click", toggleShowAllMode);
  return button;
}

/**
 * Apply all filters and update table
 */
function applyFilters() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const jurusan = document.getElementById("filterJurusan").value;
  const kecemasan = document.getElementById("filterKecemasan").value;
  const stereotip = document.getElementById("filterStereotip").value;
  const sort = document.getElementById("sortBy").value;

  // Show/hide clear buttons based on filter state
  const hasSearch = search.length > 0;
  const hasFilters = jurusan !== "all" || kecemasan !== "all" || stereotip !== "all" || sort !== "id";
  document.getElementById("clearSearchBtn").classList.toggle("hidden", !hasSearch);
  document.getElementById("clearAllBtn").classList.toggle("hidden", !(hasSearch || hasFilters));

  let filtered = PERSONAS.filter((p) => {
    if (search) {
      const matchNama = p.nama.toLowerCase().includes(search);
      const matchKeluarga = p.luar.keluarga.toLowerCase().includes(search);
      // Safely handle potential undefined p.luar.sosial field to prevent type errors
      const matchSosial = p.luar.sosial ? p.luar.sosial.toLowerCase().includes(search) : false;
      if (!matchNama && !matchKeluarga && !matchSosial) {
        return false;
      }
    }
    if (jurusan !== "all" && p.jurusan !== jurusan) return false;
    if (kecemasan === "low" && p.kecemasan >= 2.3) return false;
    if (kecemasan === "mid" && (p.kecemasan < 2.3 || p.kecemasan >= 2.6)) return false;
    if (kecemasan === "high" && p.kecemasan < 2.6) return false;
    if (stereotip === "low" && p.stereotip >= 2.3) return false;
    if (stereotip === "mid" && (p.stereotip < 2.3 || p.stereotip >= 2.6)) return false;
    if (stereotip === "high" && p.stereotip < 2.6) return false;
    return true;
  });

  // Sort
  if (sort === "nama") filtered.sort((a, b) => a.nama.localeCompare(b.nama));
  else if (sort === "kecemasan-desc") filtered.sort((a, b) => b.kecemasan - a.kecemasan);
  else if (sort === "kecemasan-asc") filtered.sort((a, b) => a.kecemasan - b.kecemasan);
  else if (sort === "stereotip-desc") filtered.sort((a, b) => b.stereotip - a.stereotip);
  else if (sort === "stereotip-asc") filtered.sort((a, b) => a.stereotip - b.stereotip);

  currentFilteredData = filtered;
  currentPage = 1;
  renderTablePaginated();
}

/**
 * Render table with pagination
 */
function renderTablePaginated() {
  const data = currentFilteredData;
  const pageSize = getEffectiveItemsPerPage(data.length);
  const totalPages = Math.ceil(data.length / pageSize);
  
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const displayData = data.slice(startIndex, endIndex);

  renderTable(displayData);
  renderPaginationControls(data.length, totalPages, pageSize);
}

/**
 * Render pagination controls
 */
function renderPaginationControls(totalItems, totalPages, pageSize) {
  const filterCountEl = document.getElementById("filterCount");
  const paginationEl = document.getElementById("paginationControls");
  const isMobile = window.innerWidth <= 480;
  const shouldShowToggle = isMobile && (showAllMode || totalItems > itemsPerPage);
  
  // Update filter count
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);
  filterCountEl.textContent = `${startItem}-${endItem} dari ${totalItems} partisipan`;

  // Build pagination controls
  paginationEl.innerHTML = ""; // Clear existing
  if (totalPages <= 1) {
    if (shouldShowToggle) {
      paginationEl.appendChild(createMobileShowAllButton());
    }
    return;
  }

  // Helper for buttons
  const createButton = (text, pageNum, isDisabled = false) => {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.className = "pagination-btn" + (pageNum === currentPage ? " active" : "");
    if (isDisabled) btn.disabled = true;
    if (pageNum === currentPage) btn.setAttribute("aria-current", "page");
    btn.addEventListener("click", () => {
      if (!isDisabled && pageNum) goToPage(pageNum);
    });
    return btn;
  };

  // Previous button
  const btnPrev = createButton("‹ Prev", currentPage - 1, currentPage === 1);
  paginationEl.appendChild(btnPrev);

  // Determine which pages to show
  const maxVisible = isMobile ? 3 : 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);
  
  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  // First page + ellipsis
  if (startPage > 1) {
    paginationEl.appendChild(createButton("1", 1));
    if (startPage > 2) {
      const ellipsis = document.createElement("span");
      ellipsis.className = "pagination-ellipsis";
      ellipsis.textContent = "…";
      paginationEl.appendChild(ellipsis);
    }
  }

  // Page numbers
  for (let i = startPage; i <= endPage; i++) {
    paginationEl.appendChild(createButton(i.toString(), i));
  }

  // Last page + ellipsis
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      const ellipsis = document.createElement("span");
      ellipsis.className = "pagination-ellipsis";
      ellipsis.textContent = "…";
      paginationEl.appendChild(ellipsis);
    }
    paginationEl.appendChild(createButton(totalPages.toString(), totalPages));
  }

  if (shouldShowToggle) {
    paginationEl.appendChild(createMobileShowAllButton());
  }

  // Next button
  const btnNext = createButton("Next ›", currentPage + 1, currentPage === totalPages);
  paginationEl.appendChild(btnNext);
}

/**
 * Go to specific page
 */
function goToPage(page) {
  const pageSize = getEffectiveItemsPerPage(currentFilteredData.length);
  const totalPages = Math.ceil(currentFilteredData.length / pageSize);
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  renderTablePaginated();
  document.getElementById("personaTable").scrollIntoView({ behavior: "smooth", block: "nearest" });
}


/**
 * Change items per page
 */
function changeItemsPerPage(value) {
  const nextValue = parseInt(value, 10);
  if (Number.isFinite(nextValue) && nextValue > 0) {
    itemsPerPage = nextValue;
    previousItemsPerPage = nextValue;
  } else {
    itemsPerPage = 10;
    previousItemsPerPage = 10;
  }

  showAllMode = false;
  currentPage = 1;
  syncItemsPerPageSelect();
  renderTablePaginated();
}

function toggleShowAllMode() {
  const showingAll = showAllMode || currentFilteredData.length <= itemsPerPage;

  if (showingAll) {
    showAllMode = false;
    itemsPerPage = previousItemsPerPage || 10;
  } else {
    previousItemsPerPage = itemsPerPage;
    showAllMode = true;
  }

  currentPage = 1;
  syncItemsPerPageSelect();
  renderTablePaginated();
}

/**
 * Clear search input only
 */
function clearSearchInput() {
  document.getElementById("searchInput").value = "";
  document.getElementById("clearSearchBtn").classList.add("hidden");
  applyFilters();
}

/**
 * Clear all filters
 */
function clearAllFilters() {
  document.getElementById("searchInput").value = "";
  document.getElementById("filterJurusan").value = "all";
  document.getElementById("filterKecemasan").value = "all";
  document.getElementById("filterStereotip").value = "all";
  document.getElementById("sortBy").value = "id";
  showAllMode = false;
  syncItemsPerPageSelect();
  applyFilters();
}
