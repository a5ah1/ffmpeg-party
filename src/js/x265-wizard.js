/**
 * x265 Wizard — generates FFmpeg commands for CRF-based H.265 encoding.
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

  const frameRateParams = {
    '24': 'no-open-gop=1:keyint=240:gop-lookahead=12:bframes=6:weightb=1:hme=1:strong-intra-smoothing=0:rect=0:aq-mode=4',
    '25': 'no-open-gop=1:keyint=250:gop-lookahead=12:bframes=6:weightb=1:hme=1:strong-intra-smoothing=0:rect=0:aq-mode=4',
    '30': 'no-open-gop=1:keyint=300:gop-lookahead=12:bframes=6:weightb=1:hme=1:strong-intra-smoothing=0:rect=0:aq-mode=4',
    '50': 'no-open-gop=1:keyint=500:gop-lookahead=11:bframes=7:weightb=1:hme=1:strong-intra-smoothing=0:rect=0:aq-mode=4',
    '60': 'no-open-gop=1:keyint=600:gop-lookahead=11:bframes=7:weightb=1:hme=1:strong-intra-smoothing=0:rect=0:aq-mode=4'
  };

  function handleFrameRateChange() {
    const fps = elements.frameRate.value;
    elements.x265Params.value = fps && frameRateParams[fps] ? frameRateParams[fps] : '';
  }

  function handleAudioCodecChange() {
    if (elements.audioModeVbr.checked) FF.audio.updateAacQualityDefaults(elements);
  }

  function buildMetadataOptions() {
    return FF.command.buildMetadata({
      removeExisting: elements.removeMetadata.checked,
      title: elements.metadataTitle.value,
      description: elements.metadataDescription.value,
      comment: elements.metadataComment.value,
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

    parts.push('-c:v libx265');
    parts.push(`-crf ${elements.crf.value || '28'}`);
    parts.push(`-preset ${elements.preset.value}`);

    if (elements.pixelFormat.value) parts.push(`-pix_fmt ${elements.pixelFormat.value}`);
    if (elements.x265Params.value.trim()) parts.push(`-x265-params "${elements.x265Params.value.trim()}"`);

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
      crf: '28',
      preset: 'medium',
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
    FF.storage.setNamespace('x265-wizard');

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
