/**
 * WebM from Image Sequence
 * Generate FFmpeg commands for creating WebM videos from image sequences
 * Uses 2-pass VP9 encoding
 */
(function() {
  'use strict';

  // DOM element references
  const elements = {
    fps: document.getElementById('fps'),
    crf: document.getElementById('crf'),
    suffix: document.getElementById('suffix'),
    customPattern: document.getElementById('customPattern'),
    threadQueue: document.getElementById('threadQueue'),
    outputFile: document.getElementById('outputFile'),
    osWindows: document.getElementById('osWindows'),
    osLinux: document.getElementById('osLinux'),
    output: document.getElementById('output'),
    copyButton: document.getElementById('copy'),
    copyStatus: document.getElementById('copyStatus')
  };

  /**
   * Get selected operating system
   */
  function getSelectedOS() {
    return elements.osWindows.checked ? 'windows' : 'linux';
  }

  /**
   * Update FFmpeg command
   */
  function updateCommand() {
    // Determine input filename pattern
    let inputFilename;

    if (elements.suffix.value === '' && elements.customPattern.value === '') {
      elements.output.textContent = 'please enter a filename suffix or a custom filename pattern';
      return;
    } else if (elements.customPattern.value !== '') {
      inputFilename = elements.customPattern.value;
    } else {
      inputFilename = '%05d' + elements.suffix.value;
    }

    // Validate output filename
    if (elements.outputFile.value === '') {
      elements.output.textContent = 'please enter an output filename';
      return;
    }

    const fps = elements.fps.value || '8';
    const crf = elements.crf.value || '31';
    const output = elements.outputFile.value;
    const os = getSelectedOS();
    const nullOutput = os === 'windows' ? 'NUL' : '/dev/null';

    // Calculate keyframe interval (10x the framerate)
    const keyint = parseInt(fps, 10) * 10;

    // Thread queue size string (only add if value > 1)
    const threadQueueValue = parseInt(elements.threadQueue.value, 10);
    const threadQueueString = threadQueueValue > 1 ? ` -thread_queue_size ${threadQueueValue}` : '';

    // Build pass 1 command
    let cmd = `ffmpeg${threadQueueString} -r ${fps} -i "${inputFilename}" -c:v libvpx-vp9 -b:v 0 -crf ${crf} -pix_fmt yuv420p -g ${keyint} -pass 1 -an -f null ${nullOutput}`;

    // Add pass 2 command
    cmd += ` && ffmpeg${threadQueueString} -r ${fps} -i "${inputFilename}" -c:v libvpx-vp9 -b:v 0 -crf ${crf} -pix_fmt yuv420p -g ${keyint} -pass 2 -an "${output}"`;

    elements.output.textContent = cmd;

    // Save state
    saveInputValues();
  }

  /**
   * Restore input values from sessionStorage
   */
  function restoreInputValues() {
    const defaults = {
      fps: '8',
      crf: '31',
      suffix: '',
      customPattern: '',
      threadQueue: '',
      outputFile: ''
    };

    FFmpegFormGenerator.storage.restoreAllInputs(elements, defaults);

    // Restore OS selection
    const savedOS = FFmpegFormGenerator.storage.restore('os', 'windows');
    if (savedOS === 'windows') {
      elements.osWindows.checked = true;
    } else {
      elements.osLinux.checked = true;
    }
  }

  /**
   * Save input values to sessionStorage
   */
  function saveInputValues() {
    FFmpegFormGenerator.storage.saveAllInputs(elements);
    FFmpegFormGenerator.storage.save('os', getSelectedOS());
  }

  /**
   * Set up event listeners
   */
  function setupEventListeners() {
    // Set up all form inputs to trigger command update
    FFmpegFormGenerator.events.setupFormInputs(
      elements,
      updateCommand,
      null  // We handle saving in updateCommand
    );

    // OS selection
    elements.osWindows.addEventListener('change', updateCommand);
    elements.osLinux.addEventListener('change', updateCommand);

    // Set up copy button
    FFmpegFormGenerator.events.setupCopyButton(
      elements.copyButton,
      elements.output,
      elements.copyStatus
    );
  }

  /**
   * Initialize application
   */
  function init() {
    restoreInputValues();
    setupEventListeners();
    updateCommand();
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
