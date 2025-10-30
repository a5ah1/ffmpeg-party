function processImage(imgData) {
  var img = new Image();

  img.onload = function () {
    // Check image dimensions
    if (img.width !== 720 || img.height !== 540) {
      alert('Image dimensions should be 720px by 540px.');
      return; // Exit from function
    }

    var div = document.getElementById('frame');
    var mask = document.getElementById('mask');

    // Set image class
    img.className = "the-image";

    // Remove existing image if it exists
    var existingImage = div.querySelector('.the-image');
    if (existingImage) {
      existingImage.remove();
    }

    // Insert the new image before the mask
    div.insertBefore(img, mask);

    // Output the image width and height
    document.getElementById('imageWidth').textContent = img.width;
    document.getElementById('imageHeight').textContent = img.height;

    // Check if there is a value in the #width input and calculate if true
    var widthInput = document.getElementById('width');
    if (widthInput.value) {
      calculate();
    }
  };

  img.src = imgData;
}


// Drop zone functionality
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('pic');
const dropZoneContent = dropZone.querySelector('.drop-zone-content');
const dropZoneFilename = dropZone.querySelector('.drop-zone-filename');

// Click to browse
dropZone.addEventListener('click', () => {
  fileInput.click();
});

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropZone.addEventListener(eventName, preventDefaults, false);
  document.body.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

// Highlight drop zone when item is dragged over it
['dragenter', 'dragover'].forEach(eventName => {
  dropZone.addEventListener(eventName, () => {
    dropZone.classList.add('drag-over');
  }, false);
});

['dragleave', 'drop'].forEach(eventName => {
  dropZone.addEventListener(eventName, () => {
    dropZone.classList.remove('drag-over');
  }, false);
});

// Handle dropped files
dropZone.addEventListener('drop', (e) => {
  const dt = e.dataTransfer;
  const files = dt.files;
  handleFiles(files);
}, false);

// Handle file input change
fileInput.addEventListener('change', function (e) {
  handleFiles(e.target.files);
});

function handleFiles(files) {
  if (files.length === 0) return;

  const file = files[0];

  // Check if the file is an image
  if (file.type.match('image.*')) {
    // Show filename
    dropZoneContent.classList.add('hidden');
    dropZoneFilename.classList.remove('hidden');
    dropZoneFilename.querySelector('p').textContent = file.name;

    var reader = new FileReader();

    reader.onload = function (e) {
      // Now just call the function:
      processImage(e.target.result);
    };

    reader.readAsDataURL(file);
  } else {
    alert('The file is not an image.');
  }
}



/**
 *
 * Calculate
 *
 */
const widthInput = document.getElementById('width');
const xOffsetInput = document.getElementById('xOffset');
const yOffsetInput = document.getElementById('yOffset');

const cropWidthOutput = document.getElementById('cropWidth');
const cropHeightOutput = document.getElementById('cropHeight');
const adjustedHeightOutput = document.getElementById('adjustedHeight');
const adjustedYOffsetOutput = document.getElementById('adjustedYOffset');

const outputElement = document.getElementById('output');
const outputElement2 = document.getElementById('output2');

// Function to calculate and update the outputs
function calculate() {
  const width = parseFloat(widthInput.value) || 0;
  const xOffset = parseFloat(xOffsetInput.value) || 0;
  const yOffset = parseFloat(yOffsetInput.value) || 0;

  const cropWidth = width;
  const cropHeight = cropWidth * 0.75;
  const adjustedHeight = cropHeight * (8 / 9);
  const adjustedYOffset = yOffset * (8 / 9);

  cropWidthOutput.textContent = cropWidth;
  cropHeightOutput.textContent = cropHeight.toFixed(3);
  adjustedHeightOutput.textContent = adjustedHeight.toFixed(3);
  adjustedYOffsetOutput.textContent = adjustedYOffset.toFixed(3);

  outputElement.textContent = `crop=${Math.round(cropWidth)}:${Math.round(adjustedHeight)}:${xOffset}:${Math.round(adjustedYOffset)}`;
  outputElement2.textContent = `"bwdif,crop=${Math.round(cropWidth)}:${Math.round(adjustedHeight)}:${xOffset}:${Math.round(adjustedYOffset)},scale=720:540:flags=lanczos,setsar=1"`;

  // Get the mask element and frame
  const mask = document.getElementById('mask');
  const frame = document.getElementById('frame');

  // Check if an image is loaded
  const imageLoaded = frame.querySelector('.the-image') !== null;

  // Set the style properties of the mask if an image is loaded
  if (imageLoaded) {
    mask.style.display = 'block';
    mask.style.width = `${width}px`;
    mask.style.height = `${cropHeight}px`;
    mask.style.left = `${xOffset - 1}px`;
    mask.style.top = `${yOffset - 1}px`;
  } else {
    mask.style.display = 'none';
  }

  // overflow warnings
  const imgWidth = 720;
  const imgHeight = 480;
  const overflowWarning = document.getElementById('overflow-warning'); // Get the overflow-warning element
  const stage = document.getElementById('stage'); // Get the stage element

  // Calculate the overflow condition for both width and height
  const isWidthOverflow = xOffset + cropWidth > imgWidth;
  const isHeightOverflow = adjustedYOffset + adjustedHeight > imgHeight;

  if (isWidthOverflow || isHeightOverflow) {
    overflowWarning.style.display = "block";
    stage.classList.add('warning');
  } else {
    overflowWarning.style.display = "none";
    stage.classList.remove('warning');
  }
}

// Add event listeners to all inputs
widthInput.addEventListener('input', calculate);
xOffsetInput.addEventListener('input', calculate);
yOffsetInput.addEventListener('input', calculate);


/**
 *
 * Save to sessionStorage before the window is closed
 *
 */
window.onbeforeunload = function () {
  var width = document.getElementById('width').value;
  var xOffset = document.getElementById('xOffset').value;
  var yOffset = document.getElementById('yOffset').value;
  var cropWidth = document.getElementById('cropWidth').textContent;

  sessionStorage.setItem('width', width);
  sessionStorage.setItem('xOffset', xOffset);
  sessionStorage.setItem('yOffset', yOffset);
  sessionStorage.setItem('cropWidth', cropWidth);

  var img = document.querySelector('.the-image');
  if (img) {
    sessionStorage.setItem('imageData', img.src);
    // Save filename if shown
    const filenameEl = dropZoneFilename.querySelector('p');
    if (filenameEl && filenameEl.textContent) {
      sessionStorage.setItem('imageFilename', filenameEl.textContent);
    }
  }
};

/**
 *
 * Load from sessionStorage after the page is loaded
 *
 */
window.onload = function () {
  var width = sessionStorage.getItem('width');
  var xOffset = sessionStorage.getItem('xOffset');
  var yOffset = sessionStorage.getItem('yOffset');
  var cropWidth = sessionStorage.getItem('cropWidth');
  var imageData = sessionStorage.getItem('imageData');
  var imageFilename = sessionStorage.getItem('imageFilename');

  document.getElementById('width').value = width || '';
  document.getElementById('xOffset').value = xOffset || '';
  document.getElementById('yOffset').value = yOffset || '';
  document.getElementById('cropWidth').textContent = cropWidth || '';

  if (imageData) {
    processImage(imageData);
    // Restore filename display
    if (imageFilename) {
      dropZoneContent.classList.add('hidden');
      dropZoneFilename.classList.remove('hidden');
      dropZoneFilename.querySelector('p').textContent = imageFilename;
    }
  }
};
