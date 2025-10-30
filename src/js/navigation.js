/**
 * Navigation functionality
 * Handles desktop dropdowns, mobile menu, and mobile accordions
 */
(function() {
  'use strict';

  // ===================================================================
  // Desktop Dropdown Navigation
  // ===================================================================

  const dropdowns = document.querySelectorAll('.dropdown');
  let currentOpenDropdown = null;

  /**
   * Open a dropdown menu
   */
  function openDropdown(dropdown) {
    // Close any currently open dropdown
    if (currentOpenDropdown && currentOpenDropdown !== dropdown) {
      closeDropdown(currentOpenDropdown);
    }

    dropdown.classList.add('open');
    const trigger = dropdown.querySelector('.dropdown-trigger');
    if (trigger) {
      trigger.setAttribute('aria-expanded', 'true');
    }
    currentOpenDropdown = dropdown;
  }

  /**
   * Close a dropdown menu
   */
  function closeDropdown(dropdown) {
    dropdown.classList.remove('open');
    const trigger = dropdown.querySelector('.dropdown-trigger');
    if (trigger) {
      trigger.setAttribute('aria-expanded', 'false');
    }
    if (currentOpenDropdown === dropdown) {
      currentOpenDropdown = null;
    }
  }

  /**
   * Toggle a dropdown menu
   */
  function toggleDropdown(dropdown) {
    if (dropdown.classList.contains('open')) {
      closeDropdown(dropdown);
    } else {
      openDropdown(dropdown);
    }
  }

  // Set up desktop dropdown behavior
  dropdowns.forEach(dropdown => {
    const trigger = dropdown.querySelector('.dropdown-trigger');

    if (!trigger) return;

    // Click to toggle
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleDropdown(dropdown);
    });

    // Hover to open (desktop only)
    if (window.innerWidth >= 768) {
      dropdown.addEventListener('mouseenter', () => {
        openDropdown(dropdown);
      });

      dropdown.addEventListener('mouseleave', () => {
        closeDropdown(dropdown);
      });
    }

    // Keyboard navigation
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleDropdown(dropdown);
      } else if (e.key === 'Escape') {
        closeDropdown(dropdown);
        trigger.focus();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        openDropdown(dropdown);
        // Focus first link in dropdown
        const firstLink = dropdown.querySelector('.dropdown-menu a');
        if (firstLink) firstLink.focus();
      }
    });

    // Handle keyboard navigation within dropdown
    const menu = dropdown.querySelector('.dropdown-menu');
    if (menu) {
      const links = menu.querySelectorAll('a');
      links.forEach((link, index) => {
        link.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextLink = links[index + 1];
            if (nextLink) nextLink.focus();
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (index === 0) {
              trigger.focus();
            } else {
              const prevLink = links[index - 1];
              if (prevLink) prevLink.focus();
            }
          } else if (e.key === 'Escape') {
            e.preventDefault();
            closeDropdown(dropdown);
            trigger.focus();
          }
        });
      });
    }
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (currentOpenDropdown && !currentOpenDropdown.contains(e.target)) {
      closeDropdown(currentOpenDropdown);
    }
  });

  // Close dropdowns on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && currentOpenDropdown) {
      closeDropdown(currentOpenDropdown);
    }
  });

  // ===================================================================
  // Mobile Menu
  // ===================================================================

  const menuButton = document.getElementById('mobile-menu-button');
  const closeButton = document.getElementById('mobile-menu-close');
  const overlay = document.getElementById('mobile-menu-overlay');
  const menu = document.getElementById('mobile-menu');

  /**
   * Open mobile menu
   */
  function openMobileMenu() {
    menu.classList.remove('translate-x-full');
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  /**
   * Close mobile menu
   */
  function closeMobileMenu() {
    menu.classList.add('translate-x-full');
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
  }

  // Mobile menu event listeners
  if (menuButton) {
    menuButton.addEventListener('click', openMobileMenu);
  }

  if (closeButton) {
    closeButton.addEventListener('click', closeMobileMenu);
  }

  if (overlay) {
    overlay.addEventListener('click', closeMobileMenu);
  }

  // Close menu when a direct link is clicked (not accordion triggers)
  if (menu) {
    const menuLinks = menu.querySelectorAll('nav > a');
    menuLinks.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu && !menu.classList.contains('translate-x-full')) {
      closeMobileMenu();
    }
  });

  // ===================================================================
  // Mobile Accordions
  // ===================================================================

  const accordions = document.querySelectorAll('.mobile-accordion');

  /**
   * Toggle mobile accordion
   */
  function toggleAccordion(accordion) {
    const isOpen = accordion.classList.contains('open');

    if (isOpen) {
      accordion.classList.remove('open');
    } else {
      accordion.classList.add('open');
    }
  }

  // Set up mobile accordion behavior
  accordions.forEach(accordion => {
    const trigger = accordion.querySelector('.mobile-accordion-trigger');

    if (!trigger) return;

    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      toggleAccordion(accordion);
    });
  });

  // ===================================================================
  // Resize Handler
  // ===================================================================

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Close mobile menu if window is resized to desktop
      if (window.innerWidth >= 768 && menu && !menu.classList.contains('translate-x-full')) {
        closeMobileMenu();
      }

      // Close desktop dropdowns if window is resized to mobile
      if (window.innerWidth < 768 && currentOpenDropdown) {
        closeDropdown(currentOpenDropdown);
      }
    }, 250);
  });
})();
