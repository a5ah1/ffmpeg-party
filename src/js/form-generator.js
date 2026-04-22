/**
 * Shared utilities for ffmpeg.party command generators.
 */
const FFmpegFormGenerator = (function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // sessionStorage persistence
  // ---------------------------------------------------------------------------
  const storage = {
    namespace: '',

    setNamespace(ns) {
      this.namespace = ns || '';
      return this;
    },

    _getKey(key) {
      return this.namespace ? `${this.namespace}-${key}` : key;
    },

    save(key, value) {
      try {
        sessionStorage.setItem(this._getKey(key), value);
      } catch (e) {
        console.warn('Failed to save to sessionStorage:', e);
      }
    },

    restore(key, defaultValue = '') {
      try {
        const value = sessionStorage.getItem(this._getKey(key));
        return value !== null ? value : defaultValue;
      } catch (e) {
        console.warn('Failed to restore from sessionStorage:', e);
        return defaultValue;
      }
    },

    saveAllInputs(elements) {
      Object.entries(elements).forEach(([key, element]) => {
        if (!element) return;
        const value = (element.type === 'checkbox' || element.type === 'radio')
          ? element.checked
          : element.value;
        this.save(element.id || key, value);
      });
    },

    restoreAllInputs(elements, defaults = {}) {
      Object.entries(elements).forEach(([key, element]) => {
        if (!element) return;
        const defaultValue = defaults[key] !== undefined ? defaults[key] : '';
        const savedValue = this.restore(element.id || key, defaultValue);

        if (element.type === 'checkbox' || element.type === 'radio') {
          element.checked = savedValue === 'true' || savedValue === true;
        } else {
          element.value = savedValue;
        }
      });
    },

    clear(keys) {
      keys.forEach(key => {
        try {
          sessionStorage.removeItem(this._getKey(key));
        } catch (e) {
          console.warn('Failed to clear sessionStorage:', e);
        }
      });
    },

    clearAll() {
      if (!this.namespace) {
        console.warn('clearAll() requires a namespace to be set');
        return;
      }
      try {
        const prefix = `${this.namespace}-`;
        const keysToRemove = [];
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key && key.startsWith(prefix)) keysToRemove.push(key);
        }
        keysToRemove.forEach(key => sessionStorage.removeItem(key));
      } catch (e) {
        console.warn('Failed to clear all sessionStorage:', e);
      }
    }
  };

  // ---------------------------------------------------------------------------
  // FFmpeg command building
  // ---------------------------------------------------------------------------
  const command = {
    escapeQuotes(str) {
      return str.replace(/"/g, '\\"');
    },

    formatTime(input) {
      if (!input) return '';
      return input.replace(/;/g, ':');
    },

    buildMetadata(options = {}) {
      const parts = [];
      if (options.removeExisting) parts.push('-map_metadata -1');

      const fields = { title: 'title', description: 'description', comment: 'comment', date: 'date_released' };
      Object.entries(fields).forEach(([key, metaKey]) => {
        if (options[key] && options[key].trim()) {
          parts.push(`-metadata ${metaKey}="${this.escapeQuotes(options[key].trim())}"`);
        }
      });

      if (options.custom) {
        Object.entries(options.custom).forEach(([key, value]) => {
          if (value && value.trim()) {
            parts.push(`-metadata ${key}="${this.escapeQuotes(value.trim())}"`);
          }
        });
      }

      return parts.join(' ');
    },

    buildFilter(filterStr) {
      if (!filterStr || !filterStr.trim()) return '';
      return `-vf "${filterStr.trim()}"`;
    },

    sanitizeFilename(filename) {
      if (!filename) return '';
      return filename.trim();
    },

    buildCommonOptions(options = {}) {
      const parts = [];
      if (options.input) {
        if (options.startTime) parts.push(`-ss ${this.formatTime(options.startTime)}`);
        if (options.endTime) parts.push(`-to ${this.formatTime(options.endTime)}`);
        parts.push(`-i "${this.sanitizeFilename(options.input)}"`);
      }
      return parts.filter(Boolean).join(' ');
    }
  };

  // ---------------------------------------------------------------------------
  // AAC audio controls (shared between x264/x265 wizards)
  // ---------------------------------------------------------------------------
  const AAC_VBR_CONFIG = {
    aac:        { min: '0.1', max: '2', step: '0.1', default: '2', hint: 'Range: 0.1-2 (experimental, 2 is good quality)' },
    libfdk_aac: { min: '1',   max: '5', step: '1',   default: '3', hint: 'Range: 1-5 (1=lowest quality, 5=highest)' }
  };

  const audio = {
    applyAacVisibility(elements) {
      const isCbr = elements.audioModeCbr.checked;
      elements.audioBitrateField.style.display = isCbr ? 'block' : 'none';
      elements.audioQualityField.style.display = isCbr ? 'none' : 'block';
      if (!isCbr) this.updateAacQualityDefaults(elements);
    },

    updateAacQualityDefaults(elements) {
      const cfg = AAC_VBR_CONFIG[elements.audioCodec.value];
      if (!cfg) return;
      elements.audioQuality.min = cfg.min;
      elements.audioQuality.max = cfg.max;
      elements.audioQuality.step = cfg.step;
      if (!elements.audioQuality.value) elements.audioQuality.value = cfg.default;
      elements.audioQualityHint.textContent = cfg.hint;
    },

    buildAacOptions(elements) {
      const codec = elements.audioCodec.value;
      const parts = [`-c:a ${codec}`];

      if (elements.audioModeCbr.checked) {
        const bitrate = elements.audioBitrate.value.trim();
        if (bitrate) parts.push(`-b:a ${bitrate}`);
      } else {
        const quality = elements.audioQuality.value.trim();
        if (quality) {
          const flag = codec === 'libfdk_aac' ? '-vbr' : '-q:a';
          parts.push(`${flag} ${quality}`);
        }
      }

      return parts.join(' ');
    }
  };

  // ---------------------------------------------------------------------------
  // UI helpers
  // ---------------------------------------------------------------------------
  const ui = {
    async copyToClipboard(text, statusElement = null) {
      if (!text || text.trim() === '' || text.startsWith('Error:')) {
        return Promise.reject('Invalid text to copy');
      }
      try {
        await navigator.clipboard.writeText(text);
        if (statusElement) {
          statusElement.classList.add('show');
          setTimeout(() => statusElement.classList.remove('show'), 2000);
        }
        return Promise.resolve();
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        return Promise.reject(error);
      }
    },

    detectOS() {
      const ua = navigator.userAgent || navigator.vendor || window.opera;
      if (/Windows/i.test(ua)) return 'Windows';
      if (/Linux/i.test(ua)) return 'Linux';
      if (/Mac/i.test(ua)) return 'macOS';
      return 'Unknown';
    },

    getNullOutput(os = null) {
      return (os || this.detectOS()) === 'Windows' ? 'NUL' : '/dev/null';
    },

    showError(element, message) {
      if (element) {
        element.textContent = `Error: ${message}`;
        element.classList.add('error');
      }
    },

    clearError(element) {
      if (element) element.classList.remove('error');
    }
  };

  // ---------------------------------------------------------------------------
  // Event wiring
  // ---------------------------------------------------------------------------
  const events = {
    setupFormInputs(elements, updateCallback) {
      Object.values(elements)
        .filter(el => el && el.addEventListener)
        .forEach(element => {
          const eventType = (element.type === 'checkbox' || element.type === 'radio') ? 'change' : 'input';
          element.addEventListener(eventType, () => updateCallback && updateCallback());
        });
    },

    setupCopyButton(button, outputElement, statusElement = null) {
      if (!button || !outputElement) return;
      button.addEventListener('click', async () => {
        const text = outputElement.textContent || outputElement.innerText;
        try {
          await ui.copyToClipboard(text, statusElement);
        } catch (error) {
          console.error('Copy failed:', error);
        }
      });
    }
  };

  return { storage, command, audio, ui, events };
})();
