/**
 * VP9 Wizard
 * Generate FFmpeg commands for creating VP9-encoded videos with Opus audio
 * Uses 2-pass encoding for optimal quality
 */
(function() {
  'use strict';

  // DOM element references
  const elements = {
    inPoint: document.getElementById('inPoint'),
    inputFile: document.getElementById('inputFile'),
    outPoint: document.getElementById('outPoint'),
    crf: document.getElementById('crf'),
    keyframeInterval: document.getElementById('keyframeInterval'),
    videoFilter: document.getElementById('videoFilter'),
    audioBitrate: document.getElementById('audioBitrate'),
    additionalOptions: document.getElementById('additionalOptions'),
    additionalOptions2: document.getElementById('additionalOptions2'),
    outputFilename: document.getElementById('outputFilename'),
    output: document.getElementById('output'),
    nullOutputWindows: document.getElementById('nullOutputWindows'),
    nullOutputLinux: document.getElementById('nullOutputLinux'),
    copyButton: document.getElementById('copy'),
    copyStatus: document.getElementById('copyStatus'),
    removeMetadata: document.getElementById('removeMetadata'),
    metadataTitle: document.getElementById('metadataTitle'),
    metadataDescription: document.getElementById('metadataDescription'),
    metadataComment: document.getElementById('metadataComment'),
    metadataDate: document.getElementById('metadataDate')
  };

  /**
   * Build metadata options for second pass
   */
  function buildMetadataOptions() {
    return FFmpegFormGenerator.command.buildMetadata({
      removeExisting: elements.removeMetadata.checked,
      title: elements.metadataTitle.value,
      description: elements.metadataDescription.value,
      comment: elements.metadataComment.value,
      custom: elements.metadataDate.value ? {
        date_released: elements.metadataDate.value.trim()
      } : null
    });
  }

  /**
   * Update FFmpeg command
   */
  function updateCommand() {
    const inPointValue = FFmpegFormGenerator.command.formatTime(elements.inPoint.value);
    const outPointValue = FFmpegFormGenerator.command.formatTime(elements.outPoint.value);

    const options = {
      inPoint: inPointValue ? `-ss ${inPointValue}` : '',
      outPoint: outPointValue ? `-to ${outPointValue}` : '',
      inputFile: elements.inputFile.value ? `-i "${elements.inputFile.value}"` : '',
      crf: `-crf ${elements.crf.value || '32'}`,
      keyframeInterval: elements.keyframeInterval.value ? `-g ${elements.keyframeInterval.value}` : '',
      videoFilter: elements.videoFilter.value ? `-vf "${elements.videoFilter.value}"` : '',
      audioBitrate: elements.audioBitrate.value !== '' && elements.audioBitrate.value !== '0'
        ? `-c:a libopus -b:a ${elements.audioBitrate.value}k`
        : '-an',
      additionalOptions: elements.additionalOptions.value || '',
      additionalOptions2: elements.additionalOptions2.value || '',
      outputFilename: elements.outputFilename.value ? `"${elements.outputFilename.value}"` : '',
      metadata: buildMetadataOptions()
    };

    // Validation
    let errorMessage = '';
    if (!elements.inputFile.value) {
      errorMessage = 'Please specify an input file.';
    } else if (!elements.outputFilename.value) {
      errorMessage = 'Please specify an output file.';
    }

    if (errorMessage) {
      FFmpegFormGenerator.ui.showError(elements.output, errorMessage);
      return;
    }

    FFmpegFormGenerator.ui.clearError(elements.output);

    // Get selected null output
    const selectedNullOutput = document.querySelector('input[name="nullOutput"]:checked').value;

    // Build pass 1 command
    const pass1Options = [
      options.inPoint,
      options.outPoint,
      options.inputFile,
      '-c:v libvpx-vp9',
      options.crf,
      '-b:v 0',
      options.keyframeInterval,
      options.videoFilter,
      '-an',
      options.additionalOptions,
      '-pass 1',
      `-f null ${selectedNullOutput}`
    ].filter(Boolean);

    // Build pass 2 command
    const pass2Options = [
      options.inPoint,
      options.outPoint,
      options.inputFile,
      '-c:v libvpx-vp9',
      options.crf,
      '-b:v 0',
      options.keyframeInterval,
      options.videoFilter,
      options.audioBitrate,
      options.metadata,
      options.additionalOptions,
      options.additionalOptions2,
      '-pass 2',
      options.outputFilename
    ].filter(Boolean);

    const pass1Command = `ffmpeg ${pass1Options.join(' ')}`;
    const pass2Command = `ffmpeg ${pass2Options.join(' ')}`;

    const fullCommand = `${pass1Command} && ${pass2Command}`;
    elements.output.textContent = fullCommand;

    // Save state
    saveInputValues();
  }

  /**
   * Save input values to session storage
   */
  function saveInputValues() {
    FFmpegFormGenerator.storage.saveAllInputs(elements);

    // Save null output selection
    const selectedNullOutput = document.querySelector('input[name="nullOutput"]:checked')?.value;
    if (selectedNullOutput) {
      FFmpegFormGenerator.storage.save('nullOutput', selectedNullOutput);
    }
  }

  /**
   * Restore input values from sessionStorage
   */
  function restoreInputValues() {
    const defaults = {
      crf: '32'
    };

    FFmpegFormGenerator.storage.restoreAllInputs(elements, defaults);

    // Restore null output with OS detection
    const storedNullOutput = FFmpegFormGenerator.storage.restore('nullOutput');

    if (storedNullOutput) {
      if (storedNullOutput === 'NUL') {
        elements.nullOutputWindows.checked = true;
      } else if (storedNullOutput === '/dev/null') {
        elements.nullOutputLinux.checked = true;
      }
    } else {
      // Auto-detect OS
      const detectedOS = FFmpegFormGenerator.ui.detectOS();
      if (detectedOS === 'Windows') {
        elements.nullOutputWindows.checked = true;
      } else {
        elements.nullOutputLinux.checked = true;
      }
    }
  }

  /**
   * Set up event listeners
   */
  function setupEventListeners() {
    // Set up all form inputs to trigger command update and save
    FFmpegFormGenerator.events.setupFormInputs(
      elements,
      updateCommand,
      null  // We handle saving in updateCommand
    );

    // Set up copy button
    FFmpegFormGenerator.events.setupCopyButton(
      elements.copyButton,
      elements.output,
      elements.copyStatus
    );
  }

  /**
   * Handle reset form button
   */
  function handleResetForm() {
    if (confirm('Reset all form fields? This cannot be undone.')) {
      FFmpegFormGenerator.storage.clearAll();
      location.reload();
    }
  }

  /**
   * Initialize application
   */
  function init() {
    // Set namespace for storage isolation
    FFmpegFormGenerator.storage.setNamespace('vp9-wizard');

    // Set up reset button
    const resetButton = document.getElementById('resetForm');
    if (resetButton) {
      resetButton.addEventListener('click', handleResetForm);
    }

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
