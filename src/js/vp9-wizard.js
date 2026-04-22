/**
 * VP9 Wizard — generates 2-pass FFmpeg commands for VP9 + Opus in WebM/MKV.
 */
(function () {
  'use strict';

  const FF = FFmpegFormGenerator;

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

  function buildMetadataOptions() {
    return FF.command.buildMetadata({
      removeExisting: elements.removeMetadata.checked,
      title: elements.metadataTitle.value,
      description: elements.metadataDescription.value,
      comment: elements.metadataComment.value,
      custom: elements.metadataDate.value.trim()
        ? { date_released: elements.metadataDate.value.trim() }
        : null
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

    const common = FF.command.buildCommonOptions({
      input: elements.inputFile.value,
      startTime: elements.inPoint.value,
      endTime: elements.outPoint.value
    });

    const crf = `-crf ${elements.crf.value || '32'}`;
    const keyframe = elements.keyframeInterval.value ? `-g ${elements.keyframeInterval.value}` : '';
    const videoFilter = FF.command.buildFilter(elements.videoFilter.value);
    const audio = elements.audioBitrate.value !== '' && elements.audioBitrate.value !== '0'
      ? `-c:a libopus -b:a ${elements.audioBitrate.value}k`
      : '-an';
    const nullOutput = elements.nullOutputWindows.checked ? 'NUL' : '/dev/null';
    const extra1 = elements.additionalOptions.value || '';
    const extra2 = elements.additionalOptions2.value || '';

    const pass1 = [
      'ffmpeg', common, '-c:v libvpx-vp9', crf, '-b:v 0', keyframe, videoFilter,
      '-an', extra1, '-pass 1', `-f null ${nullOutput}`
    ].filter(Boolean).join(' ');

    const pass2 = [
      'ffmpeg', common, '-c:v libvpx-vp9', crf, '-b:v 0', keyframe, videoFilter,
      audio, buildMetadataOptions(), extra1, extra2, '-pass 2', `"${elements.outputFilename.value}"`
    ].filter(Boolean).join(' ');

    elements.output.textContent = `${pass1} && ${pass2}`;
    FF.storage.saveAllInputs(elements);
  }

  function restoreInputValues() {
    const isWindows = FF.ui.detectOS() === 'Windows';
    FF.storage.restoreAllInputs(elements, {
      crf: '32',
      nullOutputWindows: isWindows,
      nullOutputLinux: !isWindows
    });
  }

  function setupEventListeners() {
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
    FF.storage.setNamespace('vp9-wizard');

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
