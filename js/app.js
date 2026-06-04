/**
 * Main Application
 * Initializes all components on page load
 */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize theme
  initTheme();
  
  // Show default section (overview)
  showSection("overview");

  // Reveal hero stats independently of tab content animations
  setTimeout(() => {
    document.querySelectorAll(".stats-grid .fade-in").forEach((el) => {
      el.classList.add("visible");
    });
  }, 100);
  
  // Create overview charts (other charts will be created when their tab is shown)
  chartInstances.jurusan = createJurusanChart();
  chartInstances.radar = createRadarChart();
  chartInstances.scatter = createScatterChart();
  
  // Create rankings
  createRankings();
  
  // Create heatmap
  createHeatmap();
  
  // Initialize filters
  applyFilters();
  
  // Trigger counting animation after a short delay
  setTimeout(animateCountUp, 300);
});
