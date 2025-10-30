---
layout: tool.liquid
title: AV1 Wizard
description: AV1 command generator for creating AV1-encoded files with SVT-AV1
permalink: /tools/av1-wizard/
useFormGenerator: true
toolScript: av1-wizard.js
---

<!-- Utility Buttons -->
<div class="flex justify-end gap-3 mb-8">
  <button id="resetForm" class="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md border border-zinc-700 transition-colors">
    Reset Form
  </button>
  <a href="/tools/av1-wizard/" target="_blank" class="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md border border-zinc-700 transition-colors inline-block">
    Open in New Tab
  </a>
</div>

<!-- Input/Output Section -->
<section class="mb-10">
  <h2 class="ffmpeg-section-header">Input & Output</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="ffmpeg-field">
      <label for="inputFile">Input filename</label>
      <input id="inputFile" type="text" autocomplete="off" placeholder="input.mp4">
    </div>
    <div class="ffmpeg-field">
      <label for="outputFilename">Output filename</label>
      <input id="outputFilename" type="text" autocomplete="off" placeholder="output.webm">
      <p class="field-hint">Recommended: .webm or .mkv containers. MP4 works but requires AAC audio instead of Opus.</p>
    </div>
  </div>
</section>

<!-- Timing Section -->
<section class="mb-10">
  <h2 class="ffmpeg-section-header">Timing</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="ffmpeg-field">
      <label for="inPoint">In point</label>
      <input id="inPoint" type="text" autocomplete="off" placeholder="1:30 or 90">
      <p class="field-hint">Optional. Time format (1:30, 00:01:30) or seconds (90)</p>
    </div>
    <div class="ffmpeg-field">
      <label for="outPoint">Out point</label>
      <input id="outPoint" type="text" autocomplete="off" placeholder="2:45 or 165">
      <p class="field-hint">Optional. Time format (2:45, 00:02:45) or seconds (165)</p>
    </div>
  </div>
</section>

<!-- Video Encoding Options -->
<section class="mb-10">
  <h2 class="ffmpeg-section-header">Video Encoding</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="ffmpeg-field">
      <label for="crf">CRF (quality)</label>
      <input id="crf" type="number" value="30" step="0.5" min="1" max="63" autocomplete="off">
      <p class="field-hint">Default: 30. Lower = better quality/larger file</p>
    </div>
    <div class="ffmpeg-field">
      <label for="preset">Preset</label>
      <select id="preset">
        <option value="0">0 - Slowest/Best quality</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6" selected>6 - Default</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10 - Fastest</option>
      </select>
      <p class="field-hint">Speed/quality tradeoff. Lower = slower but better quality</p>
    </div>
    <div class="ffmpeg-field">
      <label for="tune">Tune</label>
      <select id="tune">
        <option value="0" selected>0 - VQ (visual quality)</option>
        <option value="1">1 - PSNR</option>
        <option value="2">2 - SSIM</option>
      </select>
    </div>
    <div class="ffmpeg-field">
      <label for="scm">Screen-content mode</label>
      <select id="scm">
        <option value="0" selected>0 - Off</option>
        <option value="1">1 - On</option>
        <option value="2">2 - Strong for screen content</option>
      </select>
      <p class="field-hint">Optimize for screen recordings/slides</p>
    </div>
    <div class="ffmpeg-field">
      <label for="keyframeInterval">Keyframe interval</label>
      <input id="keyframeInterval" type="text" autocomplete="off" placeholder="10s or 300" pattern="\d+(ms|s)">
      <p class="field-hint">Must include time unit: 's' for seconds or 'ms' for milliseconds</p>
    </div>
    <div class="ffmpeg-field">
      <label for="videoFilter">Video filter</label>
      <input id="videoFilter" type="text" autocomplete="off" placeholder="scale=1280:720">
      <p class="field-hint">Optional. Example: scale=1280:720</p>
    </div>
    <div class="ffmpeg-field md:col-span-2">
      <span class="pseudo-label">SVT-AV1 Options</span>
      <div class="ffmpeg-checkbox-group">
        <div class="ffmpeg-checkbox-option">
          <input type="checkbox" id="enableOverlays" checked>
          <label for="enableOverlays">Enable overlays</label>
        </div>
        <div class="ffmpeg-checkbox-option">
          <input type="checkbox" id="scd" checked>
          <label for="scd">Scene change detection</label>
        </div>
      </div>
    </div>
    <div class="ffmpeg-field md:col-span-2">
      <label for="extraParams">Additional SVT-AV1 parameters</label>
      <input id="extraParams" type="text" autocomplete="off" placeholder="bit-depth=10:tile-columns=1">
      <p class="field-hint">Colon-separated format. Example: bit-depth=10:tile-columns=1</p>
    </div>
  </div>
</section>

<!-- Audio Encoding Options -->
<section class="mb-10">
  <h2 class="ffmpeg-section-header">Audio Encoding</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="ffmpeg-field">
      <label for="audioBitrate">Audio bitrate (kb/s)</label>
      <input id="audioBitrate" type="number" min="0" autocomplete="off" placeholder="128">
      <p class="field-hint">Optional. Leave empty or 0 for no audio</p>
    </div>
  </div>
</section>

<!-- Metadata Section -->
<section class="mb-10">
  <h2 class="ffmpeg-section-header">Metadata</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="ffmpeg-field md:col-span-2">
      <p class="field-hint mb-4">
        <strong>Note:</strong> These metadata fields are optimized for WebM/MKV containers, which have excellent metadata support. MP4 has limited support and only accepts year (not full dates).
      </p>
      <div class="ffmpeg-checkbox-group">
        <div class="ffmpeg-checkbox-option">
          <input type="checkbox" id="removeMetadata">
          <label for="removeMetadata">Remove existing metadata</label>
        </div>
      </div>
    </div>
    <div class="ffmpeg-field">
      <label for="metadataTitle">Title</label>
      <input id="metadataTitle" type="text" autocomplete="off" placeholder="My Video">
    </div>
    <div class="ffmpeg-field">
      <label for="metadataDescription">Description</label>
      <input id="metadataDescription" type="text" autocomplete="off" placeholder="A description">
    </div>
    <div class="ffmpeg-field">
      <label for="metadataCommentOverride">Comment override</label>
      <input id="metadataCommentOverride" type="text" autocomplete="off" placeholder="Custom comment">
      <p class="field-hint">Overrides auto-generated encoding info if provided</p>
    </div>
    <div class="ffmpeg-field">
      <label for="metadataDate">Date released</label>
      <input id="metadataDate" type="text" autocomplete="off" placeholder="YYYY-MM-DD" pattern="\d{4}-\d{2}-\d{2}">
      <p class="field-hint">Format: YYYY-MM-DD (e.g., 2025-01-15)</p>
    </div>
  </div>
</section>

<!-- Advanced Options -->
<section class="mb-10">
  <h2 class="ffmpeg-section-header">Advanced Options</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="ffmpeg-field md:col-span-2">
      <label for="additionalOptions">Additional FFmpeg options</label>
      <input id="additionalOptions" type="text" autocomplete="off" placeholder="-threads 4">
      <p class="field-hint">Optional. Custom FFmpeg parameters</p>
    </div>
  </div>
</section>

<!-- Generated Command -->
<section class="ffmpeg-output-wrapper">
  <label>FFmpeg Command</label>
  <div class="ffmpeg-output" id="output"></div>
  <div class="ffmpeg-copy-wrapper">
    <button id="copy" class="ffmpeg-copy-button">Copy Command</button>
    <span id="copyStatus" class="ffmpeg-copy-status">Copied!</span>
  </div>
</section>

<!-- About Content -->
<script>
document.addEventListener('DOMContentLoaded', function() {
  const aboutAside = document.querySelector('.ffmpeg-about');
  if (aboutAside) {
    const aboutContent = `
      <p>This tool generates FFmpeg commands for creating high-quality AV1 files using the SVT-AV1 encoder. Only input and output filenames are required—all other settings are optional with sensible defaults.</p>

      <p><strong>Key Features:</strong> CRF-based quality control (default 30), configurable presets and tuning, screen-content optimization, and automatic encoding metadata embedding. The tool saves your settings and generates single-pass encoding commands.</p>

      <p><strong>Time Format:</strong> In/out points accept either time format (1:30, 00:01:30) or seconds (90). Use semicolons instead of colons if needed—they'll be converted automatically.</p>

      <p><strong>Keyframe Interval:</strong> Must include time unit 's' for seconds or 'ms' for milliseconds (e.g., '10s' or '500ms').</p>

      <p><strong>Metadata:</strong> Encoding parameters (CRF, preset, and custom parameters) are automatically embedded in the comment field unless you provide a comment override. Check "Remove existing metadata" to strip source file metadata before adding new fields. Date format should be YYYY-MM-DD.</p>

      <p><strong>Additional Parameters:</strong> Use colon-separated format for SVT-AV1 specific options (e.g., 'bit-depth=10:tile-columns=1'). Leading/trailing colons are handled automatically.</p>

      <h3>References</h3>
      <ol>
        <li><a href="https://gitlab.com/AOMediaCodec/SVT-AV1/-/blob/master/Docs/CommonQuestions.md" target="_blank" rel="noopener noreferrer">SVT-AV1 Presets</a></li>
        <li><a href="https://gitlab.com/AOMediaCodec/SVT-AV1/-/blob/master/Docs/Parameters.md" target="_blank" rel="noopener noreferrer">SVT-AV1 Parameters</a></li>
        <li><a href="https://trac.ffmpeg.org/wiki/Encode/AV1" target="_blank" rel="noopener noreferrer">FFmpeg AV1 Encoding Guide</a></li>
      </ol>
    `;
    aboutAside.querySelector('.about-content').innerHTML = aboutContent;
  }
});
</script>
