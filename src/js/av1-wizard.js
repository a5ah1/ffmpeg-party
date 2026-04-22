/**
 * AV1 Wizard — generates FFmpeg commands using the SVT-AV1 encoder.
 */
(function () {
  'use strict';

  const FF = FFmpegFormGenerator;

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

  const stripColons = (s) => s.replace(/^:+|:+$/g, '');

  function getExtraParams() {
    return stripColons(elements.extraParams.value.trim());
  }

  function buildSvtAv1Params() {
    const params = [
      `crf=${elements.crf.value || '30'}`,
      `preset=${elements.preset.value}`,
      `tune=${elements.tune.value}`
    ];

    if (elements.scm.value !== '0') params.push(`scm=${elements.scm.value}`);
    if (elements.keyframeInterval.value.trim()) params.push(`keyint=${elements.keyframeInterval.value.trim()}`);
    if (elements.enableOverlays.checked) params.push('enable-overlays=1');
    if (elements.scd.checked) params.push('scd=1');

    const extra = getExtraParams();
    if (extra) params.push(extra);

    return params.join(':');
  }

  function generateEncodingComment() {
    const info = [`SVT-AV1 CRF${elements.crf.value || '30'}`, `preset ${elements.preset.value}`];
    const extra = getExtraParams();
    if (extra) info.push(`params: ${extra}`);
    return 'Encoded with ' + info.join(', ');
  }

  function buildMetadataOptions() {
    const commentOverride = elements.metadataCommentOverride.value.trim();
    return FF.command.buildMetadata({
      removeExisting: elements.removeMetadata.checked,
      title: elements.metadataTitle.value,
      description: elements.metadataDescription.value,
      comment: commentOverride || generateEncodingComment(),
      custom: elements.metadataDate.value.trim() ? { date_released: elements.metadataDate.value.trim() } : null
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

    parts.push('-c:v libsvtav1');
    parts.push(`-svtav1-params "${buildSvtAv1Params()}"`);

    parts.push(FF.command.buildFilter(elements.videoFilter.value));

    const audioBitrate = elements.audioBitrate.value;
    parts.push(audioBitrate !== '' && audioBitrate !== '0' ? `-c:a libopus -b:a ${audioBitrate}k` : '-an');

    parts.push(buildMetadataOptions());

    if (elements.additionalOptions.value.trim()) parts.push(elements.additionalOptions.value.trim());

    parts.push(`"${elements.outputFilename.value}"`);

    elements.output.textContent = parts.filter(Boolean).join(' ');
    FF.storage.saveAllInputs(elements);
  }

  function restoreInputValues() {
    FF.storage.restoreAllInputs(elements, {
      crf: '30',
      preset: '6',
      tune: '0',
      scm: '0',
      enableOverlays: true,
      scd: true
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
    FF.storage.setNamespace('av1-wizard');

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
