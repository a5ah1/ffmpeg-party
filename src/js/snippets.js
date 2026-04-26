/**
 * Snippet enhancement: wraps markdown <pre><code> blocks in .guide-prose
 * (and any standalone <div class="snippet"><pre><code>...) with a copy bar.
 *
 * Label resolution: data-label on the wrapper > markdown language class > "$".
 * Authors who want a richer label add data-label on the .snippet wrapper.
 */
(function () {
  'use strict';

  const init = () => {
    const targets = new Set();
    document.querySelectorAll('.guide-prose pre').forEach((pre) => targets.add(pre));
    document.querySelectorAll('.snippet > pre').forEach((pre) => targets.add(pre));

    targets.forEach(upgrade);
  };

  const upgrade = (pre) => {
    const code = pre.querySelector('code');
    if (!code) return;

    let wrapper = pre.parentElement;
    if (!wrapper.classList.contains('snippet')) {
      wrapper = document.createElement('div');
      wrapper.className = 'snippet';
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);
    }
    if (wrapper.querySelector(':scope > .snippet__bar')) return;

    const label = resolveLabel(wrapper, code);

    const bar = document.createElement('div');
    bar.className = 'snippet__bar';

    const labelEl = document.createElement('span');
    labelEl.textContent = label;

    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'snippet__copy';
    copyBtn.textContent = '⧉ copy';
    copyBtn.addEventListener('click', () => copy(code, copyBtn));

    bar.appendChild(labelEl);
    bar.appendChild(copyBtn);
    wrapper.insertBefore(bar, pre);
  };

  const resolveLabel = (wrapper, code) => {
    const explicit = wrapper.getAttribute('data-label');
    if (explicit) return `$ ${explicit}`;
    const langMatch = (code.className || '').match(/language-(\S+)/);
    if (langMatch) return `$ ${langMatch[1]}`;
    return '$';
  };

  const copy = (code, btn) => {
    const text = (code.textContent || '').replace(/\s+$/, '');
    writeClipboard(text).then(() => {
      btn.textContent = '✓ copied';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = '⧉ copy';
        btn.classList.remove('copied');
      }, 1500);
    }).catch(() => {
      btn.textContent = '✗ failed';
      setTimeout(() => { btn.textContent = '⧉ copy'; }, 1500);
    });
  };

  // navigator.clipboard is undefined on insecure contexts (LAN IP, file://);
  // fall back to a hidden textarea + execCommand for those.
  const writeClipboard = (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise((resolve, reject) => {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.top = '-9999px';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy') ? resolve() : reject(new Error('execCommand copy failed'));
      } catch (err) {
        reject(err);
      } finally {
        document.body.removeChild(ta);
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
