---
layout: tool.liquid
title: VP9 Wizard
description: VP9 command generator for creating VP9-encoded videos in WebM/MKV containers
permalink: /tools/vp9-wizard/
useFormGenerator: true
toolScript: vp9-wizard.js
---

<!-- Utility Buttons -->
<div class="flex justify-end gap-3 mb-8">
  <button id="resetForm" class="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md border border-zinc-700 transition-colors">
    Reset Form
  </button>
  <a href="/tools/vp9-wizard/" target="_blank" class="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md border border-zinc-700 transition-colors inline-block">
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
      <p class="field-hint">Recommended: .webm or .mkv containers for VP9 video. Other formats work too.</p>
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
      <input id="crf" type="number" value="32" step="0.5" min="0" max="63" autocomplete="off">
      <p class="field-hint">Default: 32. Lower = better quality/larger file</p>
    </div>
    <div class="ffmpeg-field">
      <label for="keyframeInterval">Keyframe interval</label>
      <input id="keyframeInterval" type="number" step="1" min="1" autocomplete="off" placeholder="240">
      <p class="field-hint">Optional. Controls GOP size</p>
    </div>
    <div class="ffmpeg-field md:col-span-2">
      <label for="videoFilter">Video filter</label>
      <input id="videoFilter" type="text" autocomplete="off" placeholder="scale=1280:720">
      <p class="field-hint">Optional. Example: scale=1280:720, crop=1920:800:0:140</p>
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
      <label for="metadataComment">Comment</label>
      <input id="metadataComment" type="text" autocomplete="off" placeholder="Additional comment">
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
    <div class="ffmpeg-field">
      <label for="additionalOptions">Additional options (both passes)</label>
      <input id="additionalOptions" type="text" autocomplete="off" placeholder="-threads 4">
      <p class="field-hint">Optional. Applied to both encoding passes</p>
    </div>
    <div class="ffmpeg-field">
      <label for="additionalOptions2">Additional options (2nd pass only)</label>
      <input id="additionalOptions2" type="text" autocomplete="off" placeholder="-metadata artist='Artist Name'">
      <p class="field-hint">Optional. Applied only to final pass</p>
    </div>
    <div class="ffmpeg-field md:col-span-2">
      <span class="pseudo-label">Null output</span>
      <div class="ffmpeg-radio-group">
        <div class="ffmpeg-radio-option">
          <input type="radio" id="nullOutputWindows" name="nullOutput" value="NUL" checked>
          <label for="nullOutputWindows">Windows (NUL)</label>
        </div>
        <div class="ffmpeg-radio-option">
          <input type="radio" id="nullOutputLinux" name="nullOutput" value="/dev/null">
          <label for="nullOutputLinux">Linux/macOS (/dev/null)</label>
        </div>
      </div>
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

<!-- About Content (rendered in tool.liquid template) -->
<script>
// Store about content to be displayed in the aside
document.addEventListener('DOMContentLoaded', function() {
  const aboutAside = document.querySelector('.ffmpeg-about');
  if (aboutAside) {
    const aboutContent = `
      <p>This tool generates FFmpeg commands for creating high-quality VP9-encoded videos with Opus audio using 2-pass encoding. Output to WebM or MKV containers. Only input and output filenames are required—all other settings are optional with sensible defaults.</p>

      <p><strong>Key Features:</strong> CRF-based quality control (default 32), optional audio encoding, video filtering support, and metadata embedding. The tool automatically saves your settings and detects your operating system for proper null output handling.</p>

      <p><strong>Time Format:</strong> In/out points accept either time format (1:30, 00:01:30) or seconds (90). Use semicolons instead of colons if needed—they'll be converted automatically.</p>

      <p><strong>Metadata:</strong> All metadata fields are added only to the second pass. Check "Remove existing metadata" to strip source file metadata before adding new fields. Date format should be YYYY-MM-DD.</p>

      <p><strong>Additional Options:</strong> The first field applies to both encoding passes, while the second applies only to the final pass. Use these for custom FFmpeg parameters like thread count or additional metadata.</p>

      <p><strong>Output:</strong> Choose .webm or .mkv extension as needed. The tool generates a complete 2-pass command ready to copy and execute in your terminal.</p>
    `;
    aboutAside.querySelector('.about-content').innerHTML = aboutContent;
  }
});
</script>
