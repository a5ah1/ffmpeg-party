/**
 * FFmpeg Form Generator - Shared utilities for ffmpeg.party tools
 *
 * This module provides common functionality used across all FFmpeg command generators:
 * - Session storage management for input persistence
 * - Command building utilities
 * - UI helpers (copy to clipboard, OS detection, etc.)
 * - Event handling setup
 */

const FFmpegFormGenerator = (function() {
  'use strict';

  /**
   * Session Storage Management
   */
  const storage = {
    namespace: '', // Optional namespace prefix for storage keys

    /**
     * Set the namespace for this storage instance
     * @param {string} ns - Namespace prefix (e.g., 'vp9-wizard')
     */
    setNamespace(ns) {
      this.namespace = ns || '';
      return this; // Allow chaining
    },

    /**
     * Get the namespaced key
     * @private
     */
    _getKey(key) {
      return this.namespace ? `${this.namespace}-${key}` : key;
    },

    /**
     * Save a single key-value pair to sessionStorage
     */
    save(key, value) {
      try {
        sessionStorage.setItem(this._getKey(key), value);
      } catch (e) {
        console.warn('Failed to save to sessionStorage:', e);
      }
    },

    /**
     * Restore a value from sessionStorage with optional default
     */
    restore(key, defaultValue = '') {
      try {
        const value = sessionStorage.getItem(this._getKey(key));
        return value !== null ? value : defaultValue;
      } catch (e) {
        console.warn('Failed to restore from sessionStorage:', e);
        return defaultValue;
      }
    },

    /**
     * Save all input values from a collection of elements
     * @param {Object} elements - Object with element references (e.g., {inputFile: elem, crf: elem})
     */
    saveAllInputs(elements) {
      Object.entries(elements).forEach(([key, element]) => {
        if (!element) return;

        let value;
        if (element.type === 'checkbox') {
          value = element.checked;
        } else if (element.type === 'radio') {
          // For radio buttons, save if this one is checked
          if (element.checked) {
            value = element.value;
          } else {
            return; // Skip unchecked radio buttons
          }
        } else {
          value = element.value;
        }

        this.save(element.id || key, value);
      });
    },

    /**
     * Restore all input values to a collection of elements
     * @param {Object} elements - Object with element references
     * @param {Object} defaults - Optional default values
     */
    restoreAllInputs(elements, defaults = {}) {
      Object.entries(elements).forEach(([key, element]) => {
        if (!element) return;

        const defaultValue = defaults[key] || '';
        const savedValue = this.restore(element.id || key, defaultValue);

        if (element.type === 'checkbox') {
          element.checked = savedValue === 'true' || savedValue === true;
        } else if (element.type === 'radio') {
          if (element.value === savedValue) {
            element.checked = true;
          }
        } else {
          element.value = savedValue;
        }
      });
    },

    /**
     * Clear all stored values for specific keys
     */
    clear(keys) {
      keys.forEach(key => {
        try {
          sessionStorage.removeItem(this._getKey(key));
        } catch (e) {
          console.warn('Failed to clear sessionStorage:', e);
        }
      });
    },

    /**
     * Clear all stored values for current namespace
     * Useful for "Reset Form" functionality
     */
    clearAll() {
      if (!this.namespace) {
        console.warn('clearAll() requires a namespace to be set');
        return;
      }

      try {
        const keysToRemove = [];
        const prefix = `${this.namespace}-`;

        // Find all keys with this namespace
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key && key.startsWith(prefix)) {
            keysToRemove.push(key);
          }
        }

        // Remove them
        keysToRemove.forEach(key => sessionStorage.removeItem(key));
      } catch (e) {
        console.warn('Failed to clear all sessionStorage:', e);
      }
    }
  };

  /**
   * Command Building Utilities
   */
  const command = {
    /**
     * Escape double quotes in strings for FFmpeg commands
     */
    escapeQuotes(str) {
      return str.replace(/"/g, '\\"');
    },

    /**
     * Convert time format (handles both "1:30" and "90" formats)
     * Converts semicolons to colons
     */
    formatTime(input) {
      if (!input) return '';
      return input.replace(/;/g, ':');
    },

    /**
     * Build metadata options string for FFmpeg
     * @param {Object} options - Metadata options
     * @param {boolean} options.removeExisting - Strip existing metadata
     * @param {string} options.title - Video title
     * @param {string} options.description - Description
     * @param {string} options.comment - Comment
     * @param {string} options.date - Release date
     * @param {Object} options.custom - Custom metadata key-value pairs
     */
    buildMetadata(options = {}) {
      const parts = [];

      // Remove existing metadata
      if (options.removeExisting) {
        parts.push('-map_metadata -1');
      }

      // Standard metadata fields
      const fields = {
        title: 'title',
        description: 'description',
        comment: 'comment',
        date: 'date_released'
      };

      Object.entries(fields).forEach(([key, metaKey]) => {
        if (options[key] && options[key].trim()) {
          parts.push(`-metadata ${metaKey}="${this.escapeQuotes(options[key].trim())}"`);
        }
      });

      // Custom metadata
      if (options.custom) {
        Object.entries(options.custom).forEach(([key, value]) => {
          if (value && value.trim()) {
            parts.push(`-metadata ${key}="${this.escapeQuotes(value.trim())}"`);
          }
        });
      }

      return parts.join(' ');
    },

    /**
     * Build video filter string
     */
    buildFilter(filterStr) {
      if (!filterStr || !filterStr.trim()) return '';
      return `-vf "${filterStr.trim()}"`;
    },

    /**
     * Clean and validate filename
     */
    sanitizeFilename(filename) {
      if (!filename) return '';
      return filename.trim();
    },

    /**
     * Build common FFmpeg options
     * @param {Object} options - Common options
     */
    buildCommonOptions(options = {}) {
      const parts = [];

      // Input file
      if (options.input) {
        if (options.startTime) {
          parts.push(`-ss ${this.formatTime(options.startTime)}`);
        }
        if (options.endTime) {
          parts.push(`-to ${this.formatTime(options.endTime)}`);
        }
        parts.push(`-i "${this.sanitizeFilename(options.input)}"`);
      }

      return parts.filter(Boolean).join(' ');
    }
  };

  /**
   * UI Utilities
   */
  const ui = {
    /**
     * Copy text to clipboard with visual feedback
     * @param {string} text - Text to copy
     * @param {HTMLElement} statusElement - Optional status element to show feedback
     * @returns {Promise}
     */
    async copyToClipboard(text, statusElement = null) {
      if (!text || text.trim() === '' || text.startsWith('Error:')) {
        return Promise.reject('Invalid text to copy');
      }

      try {
        await navigator.clipboard.writeText(text);

        if (statusElement) {
          statusElement.classList.add('show');
          setTimeout(() => {
            statusElement.classList.remove('show');
          }, 2000);
        }

        return Promise.resolve();
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        return Promise.reject(error);
      }
    },

    /**
     * Detect operating system
     * @returns {string} 'Windows', 'Linux', 'macOS', or 'Unknown'
     */
    detectOS() {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;

      if (/Windows/i.test(userAgent)) {
        return 'Windows';
      } else if (/Linux/i.test(userAgent)) {
        return 'Linux';
      } else if (/Mac/i.test(userAgent)) {
        return 'macOS';
      } else {
        return 'Unknown';
      }
    },

    /**
     * Get null output path based on OS
     * @param {string} os - Operating system ('Windows', 'Linux', 'macOS')
     */
    getNullOutput(os = null) {
      const detectedOS = os || this.detectOS();
      return detectedOS === 'Windows' ? 'NUL' : '/dev/null';
    },

    /**
     * Show error message in output element
     */
    showError(element, message) {
      if (element) {
        element.textContent = `Error: ${message}`;
        element.classList.add('error');
      }
    },

    /**
     * Clear error state from output element
     */
    clearError(element) {
      if (element) {
        element.classList.remove('error');
      }
    }
  };

  /**
   * Event Handling
   */
  const events = {
    /**
     * Set up input event listeners for form elements
     * @param {Object} elements - Elements to watch
     * @param {Function} updateCallback - Function to call when inputs change
     * @param {Function} saveCallback - Optional function to save state
     */
    setupFormInputs(elements, updateCallback, saveCallback = null) {
      const inputElements = Object.values(elements).filter(el => el && el.addEventListener);

      inputElements.forEach(element => {
        const eventType = (element.type === 'checkbox' || element.type === 'radio')
          ? 'change'
          : 'input';

        element.addEventListener(eventType, () => {
          if (updateCallback) updateCallback();
          if (saveCallback) saveCallback();
        });
      });
    },

    /**
     * Set up copy button
     * @param {HTMLElement} button - Copy button element
     * @param {HTMLElement} outputElement - Output element containing text to copy
     * @param {HTMLElement} statusElement - Optional status element for feedback
     */
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
    },

    /**
     * Set up keyboard shortcuts
     * @param {Object} shortcuts - Object mapping key combinations to callbacks
     */
    setupKeyboardShortcuts(shortcuts = {}) {
      document.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        const combo = [
          e.ctrlKey && 'ctrl',
          e.shiftKey && 'shift',
          e.altKey && 'alt',
          e.metaKey && 'meta',
          key
        ].filter(Boolean).join('+');

        if (shortcuts[combo]) {
          e.preventDefault();
          shortcuts[combo](e);
        }
      });
    }
  };

  /**
   * Validation utilities
   */
  const validate = {
    /**
     * Check if a value is a valid number
     */
    isNumber(value) {
      return !isNaN(parseFloat(value)) && isFinite(value);
    },

    /**
     * Check if a value is within a range
     */
    inRange(value, min, max) {
      const num = parseFloat(value);
      return this.isNumber(num) && num >= min && num <= max;
    },

    /**
     * Validate time format (supports HH:MM:SS, MM:SS, or seconds)
     */
    isValidTime(value) {
      if (!value) return true; // Empty is valid (optional field)

      // Check if it's a number (seconds)
      if (this.isNumber(value)) return true;

      // Check if it's a time format (HH:MM:SS, MM:SS, H:MM, etc.)
      return /^(\d+:)?[0-5]?\d:[0-5]\d$/.test(value) || /^\d+:\d+$/.test(value);
    },

    /**
     * Validate required fields
     */
    required(value) {
      return value !== null && value !== undefined && value.trim() !== '';
    }
  };

  // Public API
  return {
    storage,
    command,
    ui,
    events,
    validate,
    version: '1.0.0'
  };
})();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FFmpegFormGenerator;
}
