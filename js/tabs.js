/**
 * Tab Navigation
 * Handles section switching and tab styling
 */

function showSection(section) {
  // Hide all sections
  document.querySelectorAll(".content-section").forEach((s) => s.classList.add("hidden"));
  
  // Reset all tabs
  document.querySelectorAll(".btn-tab").forEach((b) => {
    b.classList.remove("btn-tab-active");
    b.classList.add("btn-tab-inactive");
  });
  
  // Show selected section
  document.getElementById("section-" + section).classList.remove("hidden");
  
  // Activate selected tab
  const tab = document.getElementById("tab-" + section);
  tab.classList.remove("btn-tab-inactive");
  tab.classList.add("btn-tab-active");
  document.querySelectorAll('.btn-tab').forEach((btn) => {
    btn.setAttribute('aria-selected', btn.id === 'tab-' + section ? 'true' : 'false');
  });
  
  // Trigger fade-in animations
  setTimeout(() => {
    document.querySelectorAll(".fade-in").forEach((el) => el.classList.add("visible"));
  }, 50);
  
  // Animate charts when their tab becomes visible
  if (section === "distribution") {
    setTimeout(() => {
      animateChartOnVisible("kecemasan", createKecemasanChart);
      animateChartOnVisible("stereotip", createStereotipChart);
      animateChartOnVisible("grouped", createGroupedChart);
      setTimeout(forceChartResize, 120);
    }, 200);
  } else if (section === "analysis") {
    setTimeout(() => {
      animateChartOnVisible("kategori", createKategoriChart);
      setTimeout(forceChartResize, 120);
    }, 200);
  } else if (section === "overview") {
    setTimeout(() => {
      animateChartOnVisible("jurusan", createJurusanChart);
      animateChartOnVisible("radar", createRadarChart);
      animateChartOnVisible("scatter", createScatterChart);
      setTimeout(forceChartResize, 120);
    }, 200);
  }
}
