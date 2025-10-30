// Mobile menu functionality
(function() {
  const menuButton = document.getElementById('mobile-menu-button');
  const closeButton = document.getElementById('mobile-menu-close');
  const overlay = document.getElementById('mobile-menu-overlay');
  const menu = document.getElementById('mobile-menu');

  function openMenu() {
    menu.classList.remove('translate-x-full');
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menu.classList.add('translate-x-full');
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
  }

  // Open menu when button is clicked
  menuButton.addEventListener('click', openMenu);

  // Close menu when close button is clicked
  closeButton.addEventListener('click', closeMenu);

  // Close menu when overlay is clicked
  overlay.addEventListener('click', closeMenu);

  // Close menu when a link is clicked
  const menuLinks = menu.querySelectorAll('a');
  menuLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });
})();
