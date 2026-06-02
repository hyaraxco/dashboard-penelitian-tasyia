/**
 * Animations
 * Handles counting animation and other visual effects
 */

/**
 * Animate stat numbers counting up
 */
function animateCountUp() {
  const statElements = document.querySelectorAll(".stat-lg[data-count]");
  
  statElements.forEach((el, index) => {
    const target = parseInt(el.getAttribute("data-count"));
    const format = el.getAttribute("data-format");
    const duration = 1500;
    const startTime = performance.now() + (index * 100);
    
    function updateCount(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (easeOutCubic)
      const eased = 1 - Math.pow(1 - progress, 3);
      
      const current = Math.floor(eased * target);
      
      if (format === "thousands") {
        el.textContent = current.toLocaleString("id-ID").replace(",", ".");
      } else {
        el.textContent = current;
      }
      
      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        // Final value
        if (format === "thousands") {
          el.textContent = target.toLocaleString("id-ID").replace(",", ".");
        } else {
          el.textContent = target;
        }
      }
    }
    
    requestAnimationFrame(updateCount);
  });
}
