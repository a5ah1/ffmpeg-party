// main.js
(() => {
  // DOM refs
  const previewArea = document.querySelector('.preview-area');
  const canvas = document.getElementById('cropCanvas');
  const ctx = canvas.getContext('2d');
  const hint = document.getElementById('dropHint');

  const inpX = document.getElementById('cropX');
  const inpY = document.getElementById('cropY');
  const inpW = document.getElementById('cropW');
  const inpH = document.getElementById('cropH');
  const resetBtn = document.getElementById('resetBtn');

  const filterOutput = document.getElementById('filterOutput');
  const copyBtn = document.getElementById('copyFilterBtn');

  const modal = document.getElementById('settingsModal');
  const settingsBtn = document.getElementById('settingsBtn');
  const closeModal = document.getElementById('closeModal');
  const colorPicker = document.getElementById('maskColor');
  const opacityIn = document.getElementById('maskOpacity');
  const opacityVal = document.getElementById('opacityVal');

  const stepSelector = document.getElementById('stepSelector');

  // State
  let img = new Image();
  let imgLoaded = false;
  let naturalW = 0, naturalH = 0;

  let maskColor = '#000000';
  let maskOpacity = 0.6;
  let stepSize = +stepSelector.value;

  let isDragging = false;
  let dragOffsetX = 0, dragOffsetY = 0;

  // Helpers
  const clamp = (v, min, max) => (v < min ? min : v > max ? max : v);

  // Calculate the largest step-aligned value that fits within the constraint
  function getMaxSteppedValue(maxValue, stepSize) {
    if (stepSize <= 1) return maxValue;
    return Math.floor(maxValue / stepSize) * stepSize;
  }

  function draw() {
    if (!imgLoaded) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      filterOutput.value = '';
      return;
    }
    canvas.width = naturalW;
    canvas.height = naturalH;
    ctx.drawImage(img, 0, 0);

    const x = clamp(+inpX.value, 0, naturalW);
    const y = clamp(+inpY.value, 0, naturalH);
    const wRaw = +inpW.value;
    const hRaw = +inpH.value;
    const w = clamp(wRaw, 1, naturalW - x);
    const h = clamp(hRaw, 1, naturalH - y);

    // mask outside selected rect
    ctx.save();
    ctx.fillStyle = maskColor;
    ctx.globalAlpha = maskOpacity;
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.rect(x, y, w, h);
    ctx.fill('evenodd');
    ctx.restore();

    // 1px border drawn outside the crop area
    ctx.save();
    ctx.strokeStyle = maskColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 0.5, y - 0.5, w + 1, h + 1);
    ctx.restore();

    filterOutput.value = `crop=w=${w}:h=${h}:x=${x}:y=${y}`;
  }

  function resetCrop() {
    inpX.value = 0;
    inpY.value = 0;
    inpW.value = getMaxSteppedValue(naturalW, stepSize);
    inpH.value = getMaxSteppedValue(naturalH, stepSize);
    draw();
  }

  function coerceCurrentValues() {
    // Update width field
    const currentX = clamp(+inpX.value, 0, naturalW);
    const maxW = naturalW - currentX;
    const maxSteppedW = getMaxSteppedValue(maxW, stepSize);
    const currentW = +inpW.value;

    if (currentW > maxSteppedW) {
      inpW.value = Math.max(maxSteppedW, stepSize);
    } else if (stepSize > 1) {
      // Snap to nearest step if we're using stepping
      const snapped = Math.round(currentW / stepSize) * stepSize;
      if (snapped >= stepSize && snapped <= maxSteppedW) {
        inpW.value = snapped;
      } else if (snapped > maxSteppedW) {
        inpW.value = maxSteppedW;
      } else {
        inpW.value = stepSize;
      }
    }

    // Update height field
    const currentY = clamp(+inpY.value, 0, naturalH);
    const maxH = naturalH - currentY;
    const maxSteppedH = getMaxSteppedValue(maxH, stepSize);
    const currentH = +inpH.value;

    if (currentH > maxSteppedH) {
      inpH.value = Math.max(maxSteppedH, stepSize);
    } else if (stepSize > 1) {
      // Snap to nearest step if we're using stepping
      const snapped = Math.round(currentH / stepSize) * stepSize;
      if (snapped >= stepSize && snapped <= maxSteppedH) {
        inpH.value = snapped;
      } else if (snapped > maxSteppedH) {
        inpH.value = maxSteppedH;
      } else {
        inpH.value = stepSize;
      }
    }
  }

  function handleStepChange() {
    stepSize = +stepSelector.value;
    [inpW, inpH].forEach(field => {
      // enforce no smaller than one step
      field.min = stepSize;
      // spinner increment = stepSize (remove for 1)
      if (stepSize === 1) {
        field.removeAttribute('step');
      } else {
        field.step = stepSize;
      }
    });
    coerceCurrentValues();
    draw();
  }

  function snapDimension(e) {
    let raw = parseInt(e.target.value, 10);
    if (isNaN(raw) || raw < 1) {
      raw = stepSize;
    } else if (stepSize > 1) {
      raw = Math.round(raw / stepSize) * stepSize;
      if (raw < stepSize) raw = stepSize;
    }

    // Apply frame constraints
    if (e.target === inpW) {
      const currentX = clamp(+inpX.value, 0, naturalW);
      const maxW = naturalW - currentX;
      const maxSteppedW = getMaxSteppedValue(maxW, stepSize);
      raw = Math.min(raw, maxSteppedW);
    } else if (e.target === inpH) {
      const currentY = clamp(+inpY.value, 0, naturalH);
      const maxH = naturalH - currentY;
      const maxSteppedH = getMaxSteppedValue(maxH, stepSize);
      raw = Math.min(raw, maxSteppedH);
    }

    e.target.value = raw;
    draw();
  }

  // — Drag & drop —
  ['dragenter', 'dragover'].forEach(ev =>
    previewArea.addEventListener(ev, e => {
      e.preventDefault();
      hint.textContent = 'Release to drop';
    })
  );
  previewArea.addEventListener('dragleave', e => {
    e.preventDefault();
    hint.textContent = 'Drag & drop an image here';
  });
  previewArea.addEventListener('drop', e => {
    e.preventDefault();
    hint.textContent = '';
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    img.onload = () => {
      imgLoaded = true;
      naturalW = img.naturalWidth;
      naturalH = img.naturalHeight;
      resetCrop();
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });

  // — Controls wiring —
  inpX.addEventListener('input', () => {
    coerceCurrentValues();
    draw();
  });
  inpY.addEventListener('input', () => {
    coerceCurrentValues();
    draw();
  });
  inpW.addEventListener('input', () => {
    coerceCurrentValues();
    draw();
  });
  inpH.addEventListener('input', () => {
    coerceCurrentValues();
    draw();
  });
  [inpW, inpH].forEach(i => {
    i.addEventListener('blur', snapDimension);
  });
  resetBtn.addEventListener('click', resetCrop);

  // — Copy filter —
  copyBtn.addEventListener('click', () => {
    if (filterOutput.value) {
      navigator.clipboard.writeText(filterOutput.value);
      const originalText = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.textContent = originalText;
      }, 1000);
    }
  });

  // — Settings modal —
  settingsBtn.addEventListener('click', () => modal.classList.remove('hidden'));
  closeModal.addEventListener('click', () => modal.classList.add('hidden'));
  colorPicker.addEventListener('input', e => { maskColor = e.target.value; draw(); });
  opacityIn.addEventListener('input', e => {
    maskOpacity = +e.target.value;
    opacityVal.textContent = maskOpacity.toFixed(2);
    draw();
  });

  // — Step selector —
  stepSelector.addEventListener('change', handleStepChange);

  // Initialize step behavior on load
  handleStepChange();

  // — Drag to move rectangle —
  canvas.addEventListener('mousedown', e => {
    if (!imgLoaded) return;
    const rect = canvas.getBoundingClientRect();
    const offsetX = Math.round((e.clientX - rect.left) * (canvas.width / rect.width));
    const offsetY = Math.round((e.clientY - rect.top) * (canvas.height / rect.height));
    const x = clamp(+inpX.value, 0, naturalW);
    const y = clamp(+inpY.value, 0, naturalH);
    const w = clamp(+inpW.value, 1, naturalW - x);
    const h = clamp(+inpH.value, 1, naturalH - y);

    if (offsetX >= x && offsetX <= x + w && offsetY >= y && offsetY <= y + h) {
      isDragging = true;
      dragOffsetX = offsetX - x;
      dragOffsetY = offsetY - y;
      canvas.style.cursor = 'grabbing';
    }
  });
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    const offsetX = Math.round((e.clientX - rect.left) * (canvas.width / rect.width));
    const offsetY = Math.round((e.clientY - rect.top) * (canvas.height / rect.height));

    if (isDragging) {
      let newX = offsetX - dragOffsetX;
      let newY = offsetY - dragOffsetY;
      const w = clamp(+inpW.value, 1, naturalW);
      const h = clamp(+inpH.value, 1, naturalH);
      newX = clamp(newX, 0, naturalW - w);
      newY = clamp(newY, 0, naturalH - h);
      inpX.value = newX;
      inpY.value = newY;
      draw();
    } else {
      const x = clamp(+inpX.value, 0, naturalW);
      const y = clamp(+inpY.value, 0, naturalH);
      const w = clamp(+inpW.value, 1, naturalW - x);
      const h = clamp(+inpH.value, 1, naturalH - y);
      if (offsetX >= x && offsetX <= x + w && offsetY >= y && offsetY <= y + h) {
        canvas.style.cursor = 'grab';
      } else {
        canvas.style.cursor = 'default';
      }
    }
  });
  ['mouseup', 'mouseleave'].forEach(evt =>
    canvas.addEventListener(evt, () => {
      isDragging = false;
      canvas.style.cursor = 'default';
    })
  );

  // initial draw
  draw();
})();
