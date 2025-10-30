/**
 * Duration Calculator
 * Calculate duration between two timestamps for FFmpeg
 */
(function() {
  'use strict';

  // DOM element references organized by type
  const inputs = {
    startTime: document.getElementById('startTime'),
    endTime: document.getElementById('endTime')
  };

  const displays = {
    startDisplay: document.getElementById('startDisplay'),
    endDisplay: document.getElementById('endDisplay'),
    timecodeOutput: document.getElementById('timecodeOutput'),
    secondsOutput: document.getElementById('secondsOutput'),
    copyTimecodeStatus: document.getElementById('copyTimecodeStatus'),
    copySecondsStatus: document.getElementById('copySecondsStatus')
  };

  const buttons = {
    copyTimecode: document.getElementById('copyTimecode'),
    copySeconds: document.getElementById('copySeconds')
  };

  /**
   * Parse time string to total seconds
   * Supports formats: HH:MM:SS.mmm, MM:SS.mmm, SS.mmm
   * Allows both : and ; as separators
   */
  function parseTimeToSeconds(timeStr) {
    if (!timeStr || !timeStr.trim()) {
      return null;
    }

    // Normalize: replace semicolons with colons, trim whitespace
    const normalized = timeStr.trim().replace(/;/g, ':');

    // Try to parse as pure seconds first (e.g., "45.678")
    if (!normalized.includes(':')) {
      const seconds = parseFloat(normalized);
      if (!isNaN(seconds) && seconds >= 0) {
        return seconds;
      }
      return null;
    }

    // Split by colon
    const parts = normalized.split(':');

    if (parts.length === 2) {
      // MM:SS.mmm format
      const minutes = parseInt(parts[0], 10);
      const seconds = parseFloat(parts[1]);

      if (isNaN(minutes) || isNaN(seconds) || minutes < 0 || seconds < 0 || seconds >= 60) {
        return null;
      }

      return (minutes * 60) + seconds;
    } else if (parts.length === 3) {
      // HH:MM:SS.mmm format
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);
      const seconds = parseFloat(parts[2]);

      if (isNaN(hours) || isNaN(minutes) || isNaN(seconds) ||
          hours < 0 || minutes < 0 || seconds < 0 ||
          minutes >= 60 || seconds >= 60) {
        return null;
      }

      return (hours * 3600) + (minutes * 60) + seconds;
    }

    return null;
  }

  /**
   * Format seconds to HH:MM:SS.mmm timecode
   */
  function formatSecondsToTimecode(totalSeconds) {
    if (totalSeconds === null || totalSeconds < 0) {
      return null;
    }

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Format with leading zeros
    const hh = hours.toString().padStart(2, '0');
    const mm = minutes.toString().padStart(2, '0');
    const ss = seconds.toFixed(3).padStart(6, '0');

    return `${hh}:${mm}:${ss}`;
  }

  /**
   * Update display for a time input
   */
  function updateTimeDisplay(inputElement, displayElement) {
    const timeStr = inputElement.value;
    const seconds = parseTimeToSeconds(timeStr);

    if (seconds === null) {
      if (timeStr.trim()) {
        displayElement.textContent = 'Invalid time format';
        displayElement.className = 'mt-2 text-sm text-red-400 font-mono';
      } else {
        displayElement.textContent = '';
      }
      return seconds;
    }

    const timecode = formatSecondsToTimecode(seconds);
    displayElement.textContent = `= ${timecode} (${seconds.toFixed(3)}s)`;
    displayElement.className = 'mt-2 text-sm text-teal-400 font-mono';

    return seconds;
  }

  /**
   * Calculate and display duration
   */
  function calculateDuration() {
    // Update individual time displays
    const startSeconds = updateTimeDisplay(inputs.startTime, displays.startDisplay);
    const endSeconds = updateTimeDisplay(inputs.endTime, displays.endDisplay);

    // Calculate duration
    if (startSeconds === null || endSeconds === null) {
      displays.timecodeOutput.textContent = '00:00:00.000';
      displays.secondsOutput.textContent = '0.000';
      return;
    }

    const duration = endSeconds - startSeconds;

    if (duration < 0) {
      // Show negative duration
      const timecode = formatSecondsToTimecode(Math.abs(duration));
      displays.timecodeOutput.textContent = `-${timecode}`;
      displays.secondsOutput.textContent = duration.toFixed(3);
      return;
    }

    const timecode = formatSecondsToTimecode(duration);
    displays.timecodeOutput.textContent = timecode;
    displays.secondsOutput.textContent = duration.toFixed(3);
  }

  /**
   * Set up event listeners
   */
  function setupEventListeners() {
    // Setup form inputs with automatic calculation and save
    FFmpegFormGenerator.events.setupFormInputs(
      inputs,
      calculateDuration,
      saveInputValues
    );

    // Setup copy buttons with shared utility
    FFmpegFormGenerator.events.setupCopyButton(
      buttons.copyTimecode,
      displays.timecodeOutput,
      displays.copyTimecodeStatus
    );

    FFmpegFormGenerator.events.setupCopyButton(
      buttons.copySeconds,
      displays.secondsOutput,
      displays.copySecondsStatus
    );
  }

  /**
   * Restore input values from sessionStorage
   */
  function restoreInputValues() {
    // Default values keyed by element ID
    const defaults = {
      startTime: '0:00:00.000',
      endTime: '0:01:00.000'
    };

    FFmpegFormGenerator.storage.restoreAllInputs(inputs, defaults);
  }

  /**
   * Save input values to sessionStorage
   */
  function saveInputValues() {
    FFmpegFormGenerator.storage.saveAllInputs(inputs);
  }

  /**
   * Initialize application
   */
  function init() {
    restoreInputValues();
    setupEventListeners();
    calculateDuration();
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
