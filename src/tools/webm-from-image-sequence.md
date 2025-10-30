---
layout: tool.liquid
title: WebM from Image Sequence (Legacy)
description: Generate WebM videos from image sequences using FFmpeg
permalink: /tools/webm-from-image-sequence/
useFormGenerator: true
toolScript: webm-from-image-sequence.js
aboutContent: |
  This tool generates a two-pass FFmpeg command to convert image sequences into WebM videos using the VP9 codec.

  Originally created to simplify video generation from Stable Diffusion outputs and other image sequence workflows. The tool uses VP9 codec with optimized settings for web compatibility.

  **Note:** This is considered a legacy tool. For new projects, consider using the modern AV1 Wizard for better compression efficiency.
---

<!-- Image Sequence Settings -->
<section class="mb-10">
  <h2 class="ffmpeg-section-header">Image Sequence Settings</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="ffmpeg-field">
      <label for="fps">Frames per Second</label>
      <input type="number" id="fps" min="1" max="60" step="1" value="8" autocomplete="off">
    </div>
    <div class="ffmpeg-field">
      <label for="suffix">Image filenames suffix</label>
      <input type="text" id="suffix" placeholder="-frame.png" autocomplete="off">
      <p class="field-hint">Will be combined with %05d (e.g., 00001-frame.png, 00002-frame.png...)</p>
    </div>
  </div>
</section>

<!-- Video Encoding Settings -->
<section class="mb-10">
  <h2 class="ffmpeg-section-header">Video Encoding</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="ffmpeg-field">
      <label for="crf">CRF value</label>
      <input type="number" id="crf" min="0" max="59" step="1" value="31" autocomplete="off">
      <p class="field-hint">Lower = better quality/larger file</p>
    </div>
  </div>
</section>

<!-- Output Settings -->
<section class="mb-10">
  <h2 class="ffmpeg-section-header">Output Settings</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="ffmpeg-field">
      <label for="outputFile">Output filename</label>
      <input type="text" id="outputFile" placeholder="output.webm" autocomplete="off">
    </div>
    <div class="ffmpeg-field">
      <span class="pseudo-label">Operating system</span>
      <div class="ffmpeg-radio-group">
        <div class="ffmpeg-radio-option">
          <input type="radio" id="osWindows" name="os" value="windows" checked>
          <label for="osWindows">Windows</label>
        </div>
        <div class="ffmpeg-radio-option">
          <input type="radio" id="osLinux" name="os" value="linux">
          <label for="osLinux">Linux</label>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Optional Settings -->
<section class="mb-10">
  <h2 class="ffmpeg-section-header">Optional</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="ffmpeg-field">
      <label for="customPattern">Custom filename pattern</label>
      <input type="text" id="customPattern" placeholder="Overrides filename suffix" autocomplete="off">
      <p class="field-hint">Use this if your files don't follow the standard %05d + suffix pattern</p>
    </div>
    <div class="ffmpeg-field">
      <label for="threadQueue">Thread queue size</label>
      <input type="number" id="threadQueue" min="1" placeholder="1" autocomplete="off">
      <p class="field-hint">Helps suppress warnings during encoding</p>
    </div>
  </div>
</section>

<!-- Generated Command -->
<section class="ffmpeg-output-wrapper">
  <label>FFmpeg Command</label>
  <div class="ffmpeg-output" id="output">please use the controls above to generate the ffmpeg command</div>
  <div class="ffmpeg-copy-wrapper">
    <button id="copy" class="ffmpeg-copy-button">Copy Command</button>
    <span id="copyStatus" class="ffmpeg-copy-status">Copied!</span>
  </div>
</section>

<!-- Usage Instructions -->
<div class="mt-8 p-6 bg-zinc-800 rounded-lg border border-zinc-700">
  <h3 class="text-lg font-semibold text-white mb-3">Usage Instructions</h3>
  <ol class="text-zinc-300 space-y-2 list-decimal list-inside">
    <li>Place all your images in a single directory with sequential numbering (00001, 00002, etc.)</li>
    <li>Enter the filename suffix (e.g., "-frame.png" for files like 00001-frame.png)</li>
    <li>Configure the frame rate, quality (CRF), and output filename above</li>
    <li>Copy the generated command</li>
    <li>Navigate to your image directory in a terminal</li>
    <li>Paste and execute the command</li>
  </ol>

  <div class="mt-4 p-4 bg-zinc-900 rounded border border-zinc-700">
    <h4 class="text-sm font-semibold text-teal-400 mb-2">Filename Examples:</h4>
    <ul class="text-sm text-zinc-400 space-y-1 font-mono">
      <li>Suffix <code>-frame.png</code> → 00001-frame.png, 00002-frame.png, 00003-frame.png...</li>
      <li>Suffix <code>.jpg</code> → 00001.jpg, 00002.jpg, 00003.jpg...</li>
      <li>Custom pattern <code>img-%03d.png</code> → img-001.png, img-002.png, img-003.png...</li>
    </ul>
  </div>
</div>
