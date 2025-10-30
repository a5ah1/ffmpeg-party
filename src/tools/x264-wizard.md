---
layout: tool.liquid
title: x264 Wizard
description: x264 command generator for H.264/AVC encoding with optimized settings
permalink: /tools/x264-wizard/
useFormGenerator: true
toolScript: x264-wizard.js
aboutContent: |
  Generate x264 (H.264/AVC) encoding commands with recommended settings for high-quality video compression. Perfect for broad compatibility across devices and platforms.
---

<!-- Utility Buttons -->
<div class="flex justify-end gap-3 mb-8">
  <button id="resetForm" class="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md border border-zinc-700 transition-colors">
    Reset Form
  </button>
  <a href="/tools/x264-wizard/" target="_blank" class="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md border border-zinc-700 transition-colors inline-block">
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
      <input id="outputFilename" type="text" autocomplete="off" placeholder="output.mp4">
      <p class="field-hint">Recommended: .mp4 container for broad compatibility</p>
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
      <input id="crf" type="number" value="23" step="1" min="0" max="51" autocomplete="off">
      <p class="field-hint">Default: 23. Lower = better quality/larger file (0-51)</p>
    </div>
    <div class="ffmpeg-field">
      <label for="preset">Preset</label>
      <select id="preset">
        <option value="ultrafast">ultrafast - Fastest</option>
        <option value="superfast">superfast</option>
        <option value="veryfast">veryfast</option>
        <option value="faster">faster</option>
        <option value="fast">fast</option>
        <option value="medium" selected>medium - Default</option>
        <option value="slow">slow</option>
        <option value="slower">slower</option>
        <option value="veryslow">veryslow</option>
        <option value="placebo">placebo - Slowest</option>
      </select>
      <p class="field-hint">Speed/quality tradeoff. Slower = better compression</p>
    </div>
    <div class="ffmpeg-field">
      <label for="tune">Tune</label>
      <select id="tune">
        <option value="" selected>None</option>
        <option value="film">film - Live-action content</option>
        <option value="animation">animation - Animated content</option>
        <option value="grain">grain - Preserve film grain</option>
      </select>
      <p class="field-hint">Optimize for specific content type</p>
    </div>
    <div class="ffmpeg-field">
      <label for="frameRate">Frame rate presets</label>
      <select id="frameRate">
        <option value="" selected>Custom/None</option>
        <option value="24">24 fps</option>
        <option value="25">25 fps</option>
        <option value="30">30 fps</option>
        <option value="50">50 fps</option>
        <option value="60">60 fps</option>
      </select>
      <p class="field-hint">Auto-populates optimized x264 parameters below</p>
    </div>
    <div class="ffmpeg-field">
      <label for="pixelFormat">Pixel format (bit depth)</label>
      <select id="pixelFormat">
        <option value="" selected>No change (use source)</option>
        <option value="yuv420p">yuv420p - 8-bit 4:2:0</option>
        <option value="yuv420p10le">yuv420p10le - 10-bit 4:2:0</option>
      </select>
      <p class="field-hint">Set color format and bit depth. 8-bit for compatibility, 10-bit for quality.</p>
    </div>
    <div class="ffmpeg-field md:col-span-2">
      <label for="x264Params">x264 parameters</label>
      <input id="x264Params" type="text" autocomplete="off" placeholder="keyint=300:bframes=6:ref=4:me=umh:subme=9">
      <p class="field-hint">Auto-filled from frame rate selection, but editable. Colon-separated format.</p>
    </div>
    <div class="ffmpeg-field md:col-span-2">
      <label for="videoFilter">Video filter</label>
      <input id="videoFilter" type="text" autocomplete="off" placeholder="scale=1280:720">
      <p class="field-hint">Optional. Example: scale=1280:720 or crop=1920:800:0:140</p>
    </div>
  </div>
</section>

<!-- Audio Encoding Options -->
<section class="mb-10">
  <h2 class="ffmpeg-section-header">Audio Encoding</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="ffmpeg-field">
      <label for="audioCodec">Audio codec</label>
      <select id="audioCodec">
        <option value="aac" selected>aac - Native FFmpeg AAC</option>
        <option value="libfdk_aac">libfdk_aac - High quality (requires external library)</option>
      </select>
    </div>
    <div class="ffmpeg-field md:col-span-2">
      <span class="pseudo-label">Audio mode</span>
      <div class="ffmpeg-radio-group">
        <div class="ffmpeg-radio-option">
          <input type="radio" id="audioModeCbr" name="audioMode" value="cbr" checked>
          <label for="audioModeCbr">CBR (Constant Bitrate)</label>
        </div>
        <div class="ffmpeg-radio-option">
          <input type="radio" id="audioModeVbr" name="audioMode" value="vbr">
          <label for="audioModeVbr">VBR (Variable Bitrate)</label>
        </div>
      </div>
    </div>
    <div class="ffmpeg-field" id="audioBitrateField">
      <label for="audioBitrate">Audio bitrate</label>
      <input id="audioBitrate" type="text" autocomplete="off" value="192k" placeholder="192k">
      <p class="field-hint">Recommended: 128k (mono), 192k (stereo), 384k (5.1)</p>
    </div>
    <div class="ffmpeg-field" id="audioQualityField" style="display: none;">
      <label for="audioQuality">VBR quality</label>
      <input id="audioQuality" type="number" step="0.1" autocomplete="off">
      <p class="field-hint" id="audioQualityHint">Quality setting for VBR mode</p>
    </div>
  </div>
</section>

<!-- Metadata Section -->
<section class="mb-10">
  <h2 class="ffmpeg-section-header">Metadata</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="ffmpeg-field md:col-span-2">
      <p class="field-hint mb-4">
        <strong>Note:</strong> These metadata fields are optimized for MP4 container. If using a different container (MKV, WebM), consider omitting metadata as support varies.
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
      <label for="metadataCommentOverride">Comment</label>
      <input id="metadataCommentOverride" type="text" autocomplete="off" placeholder="Optional comment">
      <p class="field-hint">Optional. x264 already records encoding information automatically.</p>
    </div>
    <div class="ffmpeg-field">
      <label for="metadataYear">Year</label>
      <input id="metadataYear" type="text" autocomplete="off" placeholder="2025" pattern="\d{4}">
      <p class="field-hint">Format: YYYY (e.g., 2025)</p>
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
      <p><strong>Note:</strong> This is an opinionated wizard focused on CRF-based quality encoding. It does not support bitrate (ABR) mode—only Constant Rate Factor for consistent visual quality.</p>

      <p>This tool generates FFmpeg commands for creating high-quality H.264/AVC files using the x264 encoder. Only input and output filenames are required—all other settings are optional with sensible defaults.</p>

      <p><strong>Key Features:</strong> CRF-based quality control (default 23), configurable presets and tuning, frame rate presets that auto-populate optimized parameters, and AAC audio with both CBR and VBR modes.</p>

      <p><strong>Frame Rate Presets:</strong> Select a common frame rate to automatically populate optimized x264 parameters (keyint, bframes, ref, motion estimation, etc.) based on recommendations from the <a href="/x264/">x264 guide</a>. You can edit these parameters manually if needed.</p>

      <p><strong>Audio Encoding:</strong> Choose between native FFmpeg AAC (built-in) or libfdk_aac (higher quality, requires compilation). CBR mode uses constant bitrate (recommended: 192k for stereo). VBR mode uses quality-based encoding—for native AAC use 0.1-2 range (experimental), for libfdk_aac use 1-5 scale.</p>

      <p><strong>Time Format:</strong> In/out points accept either time format (1:30, 00:01:30) or seconds (90). Use semicolons instead of colons if needed—they'll be converted automatically.</p>

      <p><strong>Metadata:</strong> These fields (title, description, comment, year) are optimized for MP4 container. Other containers like MKV or WebM have limited metadata support. Note that x264 automatically records encoding information, so the comment field is optional. Check "Remove existing metadata" to strip source file metadata before adding new fields.</p>

      <h3>References</h3>
      <ol>
        <li><a href="/x264/">x264 Encoder Guide</a> - Detailed recommendations and CRF values</li>
        <li><a href="https://trac.ffmpeg.org/wiki/Encode/H.264" target="_blank" rel="noopener noreferrer">FFmpeg H.264 Encoding Guide</a></li>
        <li><a href="https://trac.ffmpeg.org/wiki/Encode/AAC" target="_blank" rel="noopener noreferrer">FFmpeg AAC Encoding Guide</a></li>
      </ol>
    `;
    aboutAside.querySelector('.about-content').innerHTML = aboutContent;
  }
});
</script>
