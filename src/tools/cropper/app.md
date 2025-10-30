---
layout: tool-fullscreen.liquid
title: Visual FFmpeg Crop Filter Generator
description: Interactive tool for creating FFmpeg crop filters
customCSS: cropper.css
customJS: cropper.js
permalink: /tools/cropper/app/
---

<header class="cropper-header">
  <div class="cropper-header-content">
    <a href="/" class="return-link">ffmpeg.party</a>
    <h1>Visual FFmpeg Crop Filter Generator</h1>
  </div>
  <button id="settingsBtn" class="settings-btn" aria-label="Settings">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  </button>
</header>

<div class="preview-area">
  <canvas id="cropCanvas">Your browser needs &lt;canvas&gt; support</canvas>
  <div id="dropHint">Drag &amp; drop an image here</div>
</div>

<section class="controls">
  <label>X: <input type="number" id="cropX" value="0" step="1" /></label>
  <label>Y: <input type="number" id="cropY" value="0" step="1" /></label>
  <label>W: <input type="number" id="cropW" value="100" /></label>
  <label>H: <input type="number" id="cropH" value="100" /></label>
  <label>Step:
    <select id="stepSelector">
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="4">4</option>
      <option value="8">8</option>
      <option value="16">16</option>
      <option value="32" selected>32</option>
      <option value="64">64</option>
    </select>
  </label>
  <button id="resetBtn">Reset</button>

  <label class="filter-label">
    Filter:
    <input type="text" id="filterOutput" readonly />
  </label>
  <button id="copyFilterBtn">Copy</button>
</section>

<div id="settingsModal" class="modal hidden">
  <div class="modal-content">
    <h2>Settings</h2>
    <label>Mask Color: <input type="color" id="maskColor" value="#000000" /></label>
    <label>
      Mask Opacity:
      <input type="range" id="maskOpacity" min="0" max="1" step="0.01" value="0.6" />
      <span id="opacityVal">0.60</span>
    </label>
    <button id="closeModal">Close</button>
  </div>
</div>
