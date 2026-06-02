/**
 * Theme Management
 * Handles dark/light mode toggle and persistence
 */

function toggleTheme() {
  document.documentElement.classList.toggle("dark");
  const isDark = document.documentElement.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  document.getElementById("icon-light").classList.toggle("hidden", isDark);
  document.getElementById("icon-dark").classList.toggle("hidden", !isDark);
  updateChartsTheme();
}

function initTheme() {
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (saved === "dark" || (!saved && prefersDark)) {
    document.documentElement.classList.add("dark");
    document.getElementById("icon-light").classList.add("hidden");
    document.getElementById("icon-dark").classList.remove("hidden");
  }
}

function updateChartsTheme() {
  const isDark = document.documentElement.classList.contains("dark");
  // Fixed copy-paste error where Chart.defaults.color was hardcoded to "#9e9eb0" for both themes.
  Chart.defaults.color = isDark ? "#9e9eb0" : "#4b5563";
  Chart.defaults.borderColor = isDark ? "#2a2a38" : "#f0f0f5";
}
