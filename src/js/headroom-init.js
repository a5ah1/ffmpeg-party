/**
 * Headroom.js initialization
 * Makes the sticky header hide when scrolling down and reappear when scrolling up
 */
(function() {
  'use strict';

  // Initialize headroom when DOM is ready
  function initHeadroom() {
    const nav = document.querySelector('nav');

    if (nav && typeof Headroom !== 'undefined') {
      const headroom = new Headroom(nav, {
        offset: 100,  // Start hiding after scrolling 100px
        tolerance: {
          up: 10,     // Show header when scrolling up by 10px
          down: 5     // Hide header when scrolling down by 5px
        }
      });

      headroom.init();
    }
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeadroom);
  } else {
    initHeadroom();
  }
})();
