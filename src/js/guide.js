/**
 * Guide page: auto-generate TOC and § numbers for h2 sections.
 * Runs after DOMContentLoaded; scans `.guide-prose h2`, slugifies missing
 * IDs, sets data-num for the §-marker, and populates the TOC sidebar.
 * Adds an IntersectionObserver-based scrollspy.
 */
(function () {
  'use strict';

  const slugify = (s) =>
    s.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

  const init = () => {
    const headings = document.querySelectorAll('.guide-prose h2');
    const target = document.querySelector('[data-toc-target]');
    if (!target || !headings.length) return;

    const ul = document.createElement('ul');
    ul.style.listStyle = 'none';
    ul.style.padding = '0';
    ul.style.margin = '0';
    const links = [];
    const usedIds = new Set();

    headings.forEach((h, i) => {
      const num = String(i + 1).padStart(2, '0');
      h.setAttribute('data-num', num);

      if (!h.id) {
        const base = slugify(h.textContent || '') || `section-${num}`;
        let id = base;
        let n = 2;
        while (usedIds.has(id) || document.getElementById(id)) {
          id = `${base}-${n++}`;
        }
        h.id = id;
      }
      usedIds.add(h.id);

      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${h.id}`;
      const numSpan = document.createElement('span');
      numSpan.textContent = `[${num}]`;
      a.appendChild(numSpan);
      a.appendChild(document.createTextNode(h.textContent));
      li.appendChild(a);
      ul.appendChild(li);
      links.push(a);
    });

    target.appendChild(ul);

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const id = entry.target.id;
              links.forEach((a) =>
                a.classList.toggle('active', a.getAttribute('href') === `#${id}`)
              );
            }
          });
        },
        { rootMargin: '-20% 0px -70% 0px' }
      );
      headings.forEach((h) => observer.observe(h));
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
