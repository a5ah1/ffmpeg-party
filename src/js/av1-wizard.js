/**
 * AV1 Wizard
 * Generate FFmpeg commands for creating AV1 files with SVT-AV1 encoder
 * Uses single-pass encoding
 */
(function() {
  'use strict';

  // DOM element references
  const elements = {
    inPoint: document.getElementById('inPoint'),
    inputFile: document.getElementById('inputFile'),
    outPoint: document.getElementById('outPoint'),
    crf: document.getElementById('crf'),
    preset: document.getElementById('preset'),
    tune: document.getElementById('tune'),
    scm: document.getElementById('scm'),
    keyframeInterval: document.getElementById('keyframeInterval'),
    videoFilter: document.getElementById('videoFilter'),
    audioBitrate: document.getElementById('audioBitrate'),
    extraParams: document.getElementById('extraParams'),
    additionalOptions: document.getElementById('additionalOptions'),
    outputFilename: document.getElementById('outputFilename'),
    output: document.getElementById('output'),
    copyButton: document.getElementById('copy'),
    copyStatus: document.getElementById('copyStatus'),
    enableOverlays: document.getElementById('enableOverlays'),
    scd: document.getElementById('scd'),
    removeMetadata: document.getElementById('removeMetadata'),
    metadataTitle: document.getElementById('metadataTitle'),
    metadataDescription: document.getElementById('metadataDescription'),
    metadataCommentOverride: document.getElementById('metadataCommentOverride'),
    metadataDate: document.getElementById('metadataDate')
  };

  /**
   * Build SVT-AV1 encoding parameters string
   */
  function buildSvtAv1Params() {
    const params = [];

    // CRF
    params.push(`crf=${elements.crf.value || '30'}`);

    // Preset
    params.push(`preset=${elements.preset.value}`);

    // Tune
    params.push(`tune=${elements.tune.value}`);

    // Screen content mode
    if (elements.scm.value !== '0') {
      params.push(`scm=${elements.scm.value}`);
    }

    // Keyframe interval
    if (elements.keyframeInterval.value.trim()) {
      params.push(`keyint=${elements.keyframeInterval.value.trim()}`);
    }

    // Enable overlays
    if (elements.enableOverlays.checked) {
      params.push('enable-overlays=1');
    }

    // Scene change detection
    if (elements.scd.checked) {
      params.push('scd=1');
    }

    // Additional parameters
    if (elements.extraParams.value.trim()) {
      let extra = elements.extraParams.value.trim();
      // Remove leading/trailing colons
      extra = extra.replace(/^:+|:+$/g, '');
      if (extra) {
        params.push(extra);
      }
    }

    return params.join(':');
  }

  /**
   * Generate encoding metadata comment
   */
  function generateEncodingComment() {
    const encodingInfo = [];

    encodingInfo.push(`SVT-AV1 CRF${elements.crf.value || '30'}`);
    encodingInfo.push(`preset ${elements.preset.value}`);

    if (elements.extraParams.value.trim()) {
      let extra = elements.extraParams.value.trim().replace(/^:+|:+$/g, '');
      if (extra) {
        encodingInfo.push(`params: ${extra}`);
      }
    }

    return 'Encoded with ' + encodingInfo.join(', ');
  }

  /**
   * Build metadata options
   */
  function buildMetadataOptions() {
    const metadata = {};

    if (elements.metadataTitle.value.trim()) {
      metadata.title = elements.metadataTitle.value;
    }

    if (elements.metadataDescription.value.trim()) {
      metadata.description = elements.metadataDescription.value;
    }

    // Use comment override if provided, otherwise auto-generate encoding info
    if (elements.metadataCommentOverride.value.trim()) {
      metadata.comment = elements.metadataCommentOverride.value;
    } else {
      metadata.comment = generateEncodingComment();
    }

    const custom = {};
    if (elements.metadataDate.value.trim()) {
      custom.date_released = elements.metadataDate.value.trim();
    }

    return FFmpegFormGenerator.command.buildMetadata({
      removeExisting: elements.removeMetadata.checked,
      title: metadata.title,
      description: metadata.description,
      comment: metadata.comment,
      custom: Object.keys(custom).length > 0 ? custom : null
    });
  }

  /**
   * Update FFmpeg command
   */
  function updateCommand() {
    const inPointValue = FFmpegFormGenerator.command.formatTime(elements.inPoint.value);
    const outPointValue = FFmpegFormGenerator.command.formatTime(elements.outPoint.value);

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

    // Build command parts
    const commandParts = ['ffmpeg'];

    // Input timing
    if (inPointValue) {
      commandParts.push(`-ss ${inPointValue}`);
    }
    if (outPointValue) {
      commandParts.push(`-to ${outPointValue}`);
    }

    // Input file
    commandParts.push(`-i "${elements.inputFile.value}"`);

    // Video codec and SVT-AV1 parameters
    commandParts.push(`-c:v libsvtav1`);
    commandParts.push(`-svtav1-params "${buildSvtAv1Params()}"`);

    // Video filter
    if (elements.videoFilter.value.trim()) {
      commandParts.push(`-vf "${elements.videoFilter.value.trim()}"`);
    }

    // Audio
    if (elements.audioBitrate.value !== '' && elements.audioBitrate.value !== '0') {
      commandParts.push(`-c:a libopus -b:a ${elements.audioBitrate.value}k`);
    } else {
      commandParts.push('-an');
    }

    // Metadata
    const metadata = buildMetadataOptions();
    if (metadata) {
      commandParts.push(metadata);
    }

    // Additional options
    if (elements.additionalOptions.value.trim()) {
      commandParts.push(elements.additionalOptions.value.trim());
    }

    // Output file
    commandParts.push(`"${elements.outputFilename.value}"`);

    const fullCommand = commandParts.join(' ');
    elements.output.textContent = fullCommand;

    // Save state
    FFmpegFormGenerator.storage.saveAllInputs(elements);
  }

  /**
   * Restore input values from sessionStorage
   */
  function restoreInputValues() {
    const defaults = {
      crf: '30',
      preset: '6',
      tune: '0',
      scm: '0',
      enableOverlays: true,
      scd: true
    };

    FFmpegFormGenerator.storage.restoreAllInputs(elements, defaults);
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
    FFmpegFormGenerator.storage.setNamespace('av1-wizard');

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
