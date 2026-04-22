/**
 * x264 Wizard — generates FFmpeg commands for CRF-based H.264 encoding.
 */
(function () {
  'use strict';

  const FF = FFmpegFormGenerator;

  const elements = {
    inputFile: document.getElementById('inputFile'),
    outputFilename: document.getElementById('outputFilename'),
    inPoint: document.getElementById('inPoint'),
    outPoint: document.getElementById('outPoint'),
    crf: document.getElementById('crf'),
    preset: document.getElementById('preset'),
    tune: document.getElementById('tune'),
    frameRate: document.getElementById('frameRate'),
    pixelFormat: document.getElementById('pixelFormat'),
    x264Params: document.getElementById('x264Params'),
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
    metadataCommentOverride: document.getElementById('metadataCommentOverride'),
    metadataYear: document.getElementById('metadataYear'),
    additionalOptions: document.getElementById('additionalOptions'),
    output: document.getElementById('output'),
    copyButton: document.getElementById('copy'),
    copyStatus: document.getElementById('copyStatus')
  };

  const frameRateParams = {
    '24': 'keyint=240:bframes=6:ref=4:me=umh:subme=9:no-fast-pskip=1:b-adapt=2:aq-mode=2',
    '25': 'keyint=250:bframes=6:ref=4:me=umh:subme=9:no-fast-pskip=1:b-adapt=2:aq-mode=2',
    '30': 'keyint=300:bframes=6:ref=4:me=umh:subme=9:no-fast-pskip=1:b-adapt=2:aq-mode=2',
    '50': 'keyint=500:bframes=7:ref=4:me=umh:subme=9:no-fast-pskip=1:b-adapt=2:aq-mode=2',
    '60': 'keyint=600:bframes=7:ref=4:me=umh:subme=9:no-fast-pskip=1:b-adapt=2:aq-mode=2'
  };

  function handleFrameRateChange() {
    const fps = elements.frameRate.value;
    elements.x264Params.value = fps && frameRateParams[fps] ? frameRateParams[fps] : '';
  }

  function handleAudioCodecChange() {
    if (elements.audioModeVbr.checked) FF.audio.updateAacQualityDefaults(elements);
  }

  function buildMetadataOptions() {
    // x264 already records encoding info, so only set comment if user provides an override.
    return FF.command.buildMetadata({
      removeExisting: elements.removeMetadata.checked,
      title: elements.metadataTitle.value,
      description: elements.metadataDescription.value,
      comment: elements.metadataCommentOverride.value,
      custom: elements.metadataYear.value.trim() ? { year: elements.metadataYear.value.trim() } : null
    });
  }

  function updateCommand() {
    if (!elements.inputFile.value) {
      FF.ui.showError(elements.output, 'Please specify an input file.');
      return;
    }
    if (!elements.outputFilename.value) {
      FF.ui.showError(elements.output, 'Please specify an output file.');
      return;
    }
    FF.ui.clearError(elements.output);

    const parts = ['ffmpeg'];

    parts.push(FF.command.buildCommonOptions({
      input: elements.inputFile.value,
      startTime: elements.inPoint.value,
      endTime: elements.outPoint.value
    }));

    parts.push('-c:v libx264');
    parts.push(`-crf ${elements.crf.value || '23'}`);
    parts.push(`-preset ${elements.preset.value}`);

    if (elements.tune.value) parts.push(`-tune ${elements.tune.value}`);
    if (elements.pixelFormat.value) parts.push(`-pix_fmt ${elements.pixelFormat.value}`);
    if (elements.x264Params.value.trim()) parts.push(`-x264-params "${elements.x264Params.value.trim()}"`);

    parts.push(FF.command.buildFilter(elements.videoFilter.value));
    parts.push(FF.audio.buildAacOptions(elements));
    parts.push(buildMetadataOptions());

    if (elements.additionalOptions.value.trim()) parts.push(elements.additionalOptions.value.trim());

    parts.push(`"${elements.outputFilename.value}"`);

    elements.output.textContent = parts.filter(Boolean).join(' ');
    FF.storage.saveAllInputs(elements);
  }

  function restoreInputValues() {
    FF.storage.restoreAllInputs(elements, {
      crf: '23',
      preset: 'medium',
      tune: '',
      frameRate: '',
      pixelFormat: '',
      audioCodec: 'aac',
      audioModeCbr: true,
      audioBitrate: '192k',
      audioQuality: '2'
    });
    FF.audio.applyAacVisibility(elements);
  }

  function setupEventListeners() {
    elements.frameRate.addEventListener('change', handleFrameRateChange);
    elements.audioModeCbr.addEventListener('change', () => FF.audio.applyAacVisibility(elements));
    elements.audioModeVbr.addEventListener('change', () => FF.audio.applyAacVisibility(elements));
    elements.audioCodec.addEventListener('change', handleAudioCodecChange);

    FF.events.setupFormInputs(elements, updateCommand);
    FF.events.setupCopyButton(elements.copyButton, elements.output, elements.copyStatus);
  }

  function handleResetForm() {
    if (confirm('Reset all form fields? This cannot be undone.')) {
      FF.storage.clearAll();
      location.reload();
    }
  }

  function init() {
    FF.storage.setNamespace('x264-wizard');

    const resetButton = document.getElementById('resetForm');
    if (resetButton) resetButton.addEventListener('click', handleResetForm);

    restoreInputValues();
    setupEventListeners();
    updateCommand();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
