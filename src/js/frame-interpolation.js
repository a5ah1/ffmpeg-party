/**
 * Frame Interpolation Generator — produces a `minterpolate=...` filter
 * expression to paste into the Video filter field of any encoding wizard.
 */
(function () {
  'use strict';

  const FF = FFmpegFormGenerator;

  const elements = {
    fps: document.getElementById('fps'),
    method: document.getElementById('method'),
    mcMode: document.getElementById('mcMode'),
    meMode: document.getElementById('meMode'),
    vsbmc: document.getElementById('vsbmc'),
    searchParam: document.getElementById('searchParam'),
    scdThreshold: document.getElementById('scdThreshold'),
    output: document.getElementById('output'),
    copyButton: document.getElementById('copy'),
    copyStatus: document.getElementById('copyStatus')
  };

  const advancedSection = document.getElementById('advancedSection');

  function applyMethodVisibility() {
    if (!advancedSection) return;
    advancedSection.style.display = elements.method.value === 'mci' ? '' : 'none';
  }

  function buildFilter() {
    const fps = (elements.fps.value || '60').trim();
    const method = elements.method.value;

    if (method === 'dup' || method === 'blend') {
      return `minterpolate=fps=${fps}:mi_mode=${method}`;
    }

    const params = [
      `fps=${fps}`,
      'mi_mode=mci',
      `mc_mode=${elements.mcMode.value}`,
      `me_mode=${elements.meMode.value}`,
      `vsbmc=${elements.vsbmc.checked ? '1' : '0'}`
    ];

    const search = elements.searchParam.value.trim();
    if (search && search !== '32') params.push(`search_param=${search}`);

    const scd = elements.scdThreshold.value.trim();
    if (scd && scd !== '10') params.push(`scd_threshold=${scd}`);

    return `minterpolate=${params.join(':')}`;
  }

  function updateOutput() {
    elements.output.textContent = buildFilter();
    FF.storage.saveAllInputs(elements);
  }

  function restoreInputValues() {
    FF.storage.restoreAllInputs(elements, {
      fps: '60',
      method: 'mci',
      mcMode: 'aobmc',
      meMode: 'bidir',
      vsbmc: true,
      searchParam: '32',
      scdThreshold: '10'
    });
    applyMethodVisibility();
  }

  function setupEventListeners() {
    elements.method.addEventListener('change', applyMethodVisibility);
    FF.events.setupFormInputs(elements, updateOutput);
    FF.events.setupCopyButton(elements.copyButton, elements.output, elements.copyStatus);
  }

  function handleResetForm() {
    if (confirm('Reset all form fields? This cannot be undone.')) {
      FF.storage.clearAll();
      location.reload();
    }
  }

  function init() {
    FF.storage.setNamespace('frame-interpolation');

    const resetButton = document.getElementById('resetForm');
    if (resetButton) resetButton.addEventListener('click', handleResetForm);

    restoreInputValues();
    setupEventListeners();
    updateOutput();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
