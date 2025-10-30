/**
 * x265 Wizard
 * Generate FFmpeg commands for creating x265/H.265 files
 * Uses CRF-based single-pass encoding
 */
(function() {
  'use strict';

  // DOM element references
  const elements = {
    inputFile: document.getElementById('inputFile'),
    outputFilename: document.getElementById('outputFilename'),
    inPoint: document.getElementById('inPoint'),
    outPoint: document.getElementById('outPoint'),
    crf: document.getElementById('crf'),
    preset: document.getElementById('preset'),
    frameRate: document.getElementById('frameRate'),
    pixelFormat: document.getElementById('pixelFormat'),
    x265Params: document.getElementById('x265Params'),
    videoFilter: document.getElementById('videoFilter'),
    audioCodec: document.getElementById('audioCodec'),
    audioModeCbr: document.getElementById('audioModeCbr'),
    audioModeVbr: document.getElementById('audioModeVbr'),
    audioBitrate: document.getElementById('audioBitrate'),
    audioBitrateField: document.getElementById('audioBitrateField'),
    audioQuality: document.getElementById('audioQuality'),
    audioQualityField: document.getElementById('audioQualityField'),
    audioQualityHint: document.getElementById('audioQualityHint'),
    removeMetadata: document.getElementById('removeMetadata'),
    metadataTitle: document.getElementById('metadataTitle'),
    metadataDescription: document.getElementById('metadataDescription'),
    metadataComment: document.getElementById('metadataComment'),
    metadataYear: document.getElementById('metadataYear'),
    additionalOptions: document.getElementById('additionalOptions'),
    output: document.getElementById('output'),
    copyButton: document.getElementById('copy'),
    copyStatus: document.getElementById('copyStatus')
  };

  // Frame rate to x265 parameters mapping
  const frameRateParams = {
    '24': 'no-open-gop=1:keyint=240:gop-lookahead=12:bframes=6:weightb=1:hme=1:strong-intra-smoothing=0:rect=0:aq-mode=4',
    '25': 'no-open-gop=1:keyint=250:gop-lookahead=12:bframes=6:weightb=1:hme=1:strong-intra-smoothing=0:rect=0:aq-mode=4',
    '30': 'no-open-gop=1:keyint=300:gop-lookahead=12:bframes=6:weightb=1:hme=1:strong-intra-smoothing=0:rect=0:aq-mode=4',
    '50': 'no-open-gop=1:keyint=500:gop-lookahead=11:bframes=7:weightb=1:hme=1:strong-intra-smoothing=0:rect=0:aq-mode=4',
    '60': 'no-open-gop=1:keyint=600:gop-lookahead=11:bframes=7:weightb=1:hme=1:strong-intra-smoothing=0:rect=0:aq-mode=4'
  };

  /**
   * Handle frame rate selection - auto-populate x265 parameters
   */
  function handleFrameRateChange() {
    const selectedFps = elements.frameRate.value;
    if (selectedFps && frameRateParams[selectedFps]) {
      elements.x265Params.value = frameRateParams[selectedFps];
    } else if (!selectedFps) {
      // Clear when "Custom/None" is selected
      elements.x265Params.value = '';
    }
    updateCommand();
  }

  /**
   * Handle audio mode change - show/hide appropriate fields
   */
  function handleAudioModeChange() {
    const isCbr = elements.audioModeCbr.checked;
    const isVbr = elements.audioModeVbr.checked;

    // Show/hide fields based on mode
    elements.audioBitrateField.style.display = isCbr ? 'block' : 'none';
    elements.audioQualityField.style.display = isVbr ? 'block' : 'none';

    // Update quality field defaults and hints based on codec
    if (isVbr) {
      updateAudioQualityDefaults();
    }

    updateCommand();
  }

  /**
   * Update audio quality field based on selected codec
   */
  function updateAudioQualityDefaults() {
    const codec = elements.audioCodec.value;

    if (codec === 'aac') {
      elements.audioQuality.min = '0.1';
      elements.audioQuality.max = '2';
      elements.audioQuality.step = '0.1';
      if (!elements.audioQuality.value) {
        elements.audioQuality.value = '2';
      }
      elements.audioQualityHint.textContent = 'Range: 0.1-2 (experimental, 2 is good quality)';
    } else if (codec === 'libfdk_aac') {
      elements.audioQuality.min = '1';
      elements.audioQuality.max = '5';
      elements.audioQuality.step = '1';
      if (!elements.audioQuality.value) {
        elements.audioQuality.value = '3';
      }
      elements.audioQualityHint.textContent = 'Range: 1-5 (1=lowest quality, 5=highest)';
    }
  }

  /**
   * Handle audio codec change
   */
  function handleAudioCodecChange() {
    // Update VBR quality defaults if in VBR mode
    if (elements.audioModeVbr.checked) {
      updateAudioQualityDefaults();
    }
    updateCommand();
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

    // Only use comment if user provides one
    if (elements.metadataComment.value.trim()) {
      metadata.comment = elements.metadataComment.value;
    }

    const custom = {};
    if (elements.metadataYear.value.trim()) {
      custom.year = elements.metadataYear.value.trim();
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
   * Build audio encoding options
   */
  function buildAudioOptions() {
    const parts = [];
    const codec = elements.audioCodec.value;
    const isCbr = elements.audioModeCbr.checked;

    parts.push(`-c:a ${codec}`);

    if (isCbr) {
      // CBR mode - use bitrate
      const bitrate = elements.audioBitrate.value.trim();
      if (bitrate) {
        parts.push(`-b:a ${bitrate}`);
      }
    } else {
      // VBR mode
      const quality = elements.audioQuality.value.trim();
      if (quality) {
        if (codec === 'aac') {
          parts.push(`-q:a ${quality}`);
        } else if (codec === 'libfdk_aac') {
          parts.push(`-vbr ${quality}`);
        }
      }
    }

    return parts.join(' ');
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

    // Video codec
    commandParts.push('-c:v libx265');

    // CRF
    commandParts.push(`-crf ${elements.crf.value || '28'}`);

    // Preset
    commandParts.push(`-preset ${elements.preset.value}`);

    // Pixel format (optional)
    if (elements.pixelFormat.value) {
      commandParts.push(`-pix_fmt ${elements.pixelFormat.value}`);
    }

    // x265 parameters (optional)
    if (elements.x265Params.value.trim()) {
      commandParts.push(`-x265-params "${elements.x265Params.value.trim()}"`);
    }

    // Video filter (optional)
    if (elements.videoFilter.value.trim()) {
      commandParts.push(`-vf "${elements.videoFilter.value.trim()}"`);
    }

    // Audio encoding
    const audioOptions = buildAudioOptions();
    if (audioOptions) {
      commandParts.push(audioOptions);
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
      crf: '28',
      preset: 'medium',
      frameRate: '',
      pixelFormat: '',
      audioCodec: 'aac',
      audioModeCbr: true,
      audioBitrate: '192k',
      audioQuality: '2'
    };

    FFmpegFormGenerator.storage.restoreAllInputs(elements, defaults);

    // Set initial visibility of audio fields
    handleAudioModeChange();
  }

  /**
   * Set up event listeners
   */
  function setupEventListeners() {
    // Frame rate dropdown - special handler for auto-population
    elements.frameRate.addEventListener('change', handleFrameRateChange);

    // Audio mode radio buttons
    elements.audioModeCbr.addEventListener('change', handleAudioModeChange);
    elements.audioModeVbr.addEventListener('change', handleAudioModeChange);

    // Audio codec dropdown
    elements.audioCodec.addEventListener('change', handleAudioCodecChange);

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
    FFmpegFormGenerator.storage.setNamespace('x265-wizard');

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
