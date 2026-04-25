/**
 * Chrome navigation: desktop dropdowns + mobile drawer.
 * Targets the new design (data-nav-* selectors).
 */
(function () {
  'use strict';

  const dropdowns = document.querySelectorAll('[data-nav-dropdown]');
  let openDropdown = null;
  const isCoarsePointer = window.matchMedia('(hover: none)').matches;

  function close(d) {
    if (!d) return;
    d.classList.remove('open');
    const trigger = d.querySelector('.nav__item');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
    if (openDropdown === d) openDropdown = null;
  }

  function open(d) {
    if (openDropdown && openDropdown !== d) close(openDropdown);
    d.classList.add('open');
    const trigger = d.querySelector('.nav__item');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    openDropdown = d;
  }

  dropdowns.forEach((d) => {
    const trigger = d.querySelector('.nav__item');
    if (!trigger) return;

    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      d.classList.contains('open') ? close(d) : open(d);
    });

    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        close(d);
        trigger.focus();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        open(d);
        const first = d.querySelector('.nav__menu a');
        if (first) first.focus();
      }
    });

    if (!isCoarsePointer) {
      d.addEventListener('mouseleave', () => close(d));
    }
  });

  document.addEventListener('click', (e) => {
    if (openDropdown && !openDropdown.contains(e.target)) close(openDropdown);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && openDropdown) close(openDropdown);
  });

  // Mobile drawer
  const burger = document.querySelector('[data-nav-burger]');
  const drawer = document.querySelector('[data-nav-drawer]');
  const drawerClose = document.querySelector('[data-nav-drawer-close]');

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    if (burger) burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    if (burger) burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (burger) burger.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawer) {
    drawer.addEventListener('click', (e) => {
      if (e.target.closest('a')) closeDrawer();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  // Skip Headroom under prefers-reduced-motion (animated transform).
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const topbar = document.querySelector('.topbar');
  if (topbar && window.Headroom && !reduceMotion) {
    const headroom = new window.Headroom(topbar, {
      offset: 80,
      tolerance: { up: 5, down: 5 },
    });
    headroom.init();
  }
})();
