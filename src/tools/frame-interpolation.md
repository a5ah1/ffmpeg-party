---
layout: tool.liquid
title: Frame Interpolation Generator
description: Build FFmpeg minterpolate filter strings to smooth video frame rates
permalink: /tools/frame-interpolation/
useFormGenerator: true
toolScript: frame-interpolation.js
---

<!-- Utility Buttons -->
<div class="flex justify-end gap-3 mb-8">
  <button id="resetForm" class="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md border border-zinc-700 transition-colors">
    Reset Form
  </button>
  <a href="/tools/frame-interpolation/" target="_blank" class="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md border border-zinc-700 transition-colors inline-block">
    Open in New Tab
  </a>
</div>

<!-- Output Frame Rate -->
<section class="mb-10">
  <h2 class="ffmpeg-section-header">Output Frame Rate</h2>
  <div class="ffmpeg-field">
    <label for="fps">Target frame rate</label>
    <input id="fps" type="number" value="60" min="1" step="1" autocomplete="off">
    <p class="field-hint">Common values: 24, 25, 30, 50, 60, 120</p>
  </div>
</section>

<!-- Method -->
<section class="mb-10">
  <h2 class="ffmpeg-section-header">Interpolation Method</h2>
  <div class="ffmpeg-field">
    <label for="method">Method</label>
    <select id="method" autocomplete="off">
      <option value="mci">Motion-compensated interpolation (mci) &mdash; recommended, slow</option>
      <option value="blend">Frame blending (blend) &mdash; fast, motion-blurry</option>
      <option value="dup">Frame duplication (dup) &mdash; no smoothing, just changes container fps</option>
    </select>
    <p class="field-hint">mci synthesizes new frames from motion analysis; blend cross-fades between adjacent frames; dup just changes the container framerate without generating anything new.</p>
  </div>
</section>

<!-- Advanced (mci only) -->
<section class="mb-10" id="advancedSection">
  <h2 class="ffmpeg-section-header">Motion Estimation <span class="text-zinc-500 text-base font-normal">(mci only)</span></h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="ffmpeg-field">
      <label for="mcMode">Motion compensation mode</label>
      <select id="mcMode" autocomplete="off">
        <option value="aobmc">Adaptive overlapped block (aobmc) &mdash; recommended</option>
        <option value="obmc">Overlapped block (obmc)</option>
      </select>
    </div>
    <div class="ffmpeg-field">
      <label for="meMode">Motion estimation direction</label>
      <select id="meMode" autocomplete="off">
        <option value="bidir">Bidirectional (bidir) &mdash; recommended</option>
        <option value="bilat">Bilateral (bilat)</option>
      </select>
    </div>
    <div class="ffmpeg-field">
      <label class="inline-flex items-center gap-2 cursor-pointer">
        <input id="vsbmc" type="checkbox" checked>
        <span>Variable-size block motion compensation (vsbmc)</span>
      </label>
      <p class="field-hint">Enables variable block sizes for finer motion detail. Recommended on.</p>
    </div>
    <div class="ffmpeg-field">
      <label for="searchParam">Search range (search_param)</label>
      <input id="searchParam" type="number" value="32" min="4" step="1" autocomplete="off">
      <p class="field-hint">Default 32. Higher = more accurate motion estimation, slower.</p>
    </div>
    <div class="ffmpeg-field">
      <label for="scdThreshold">Scene change threshold (scd_threshold)</label>
      <input id="scdThreshold" type="number" value="10" min="0" step="0.1" autocomplete="off">
      <p class="field-hint">Default 10. Lower = more aggressive scene-cut detection (skips interpolation across cuts).</p>
    </div>
  </div>
</section>

<!-- Output -->
<section class="mb-10">
  <h2 class="ffmpeg-section-header">Filter String</h2>
  <p class="text-zinc-400 text-sm mb-4">Paste this into the <strong>Video filter</strong> field of any encoding wizard.</p>
  <div class="ffmpeg-output" id="output"></div>
  <div class="ffmpeg-copy-wrapper">
    <button id="copy" class="ffmpeg-copy-button">Copy Filter</button>
    <span id="copyStatus" class="ffmpeg-copy-status">Copied!</span>
  </div>

  <div class="mt-6 text-sm text-zinc-400">
    Use with:
    <a href="/tools/x264-wizard/" class="text-teal-400 hover:text-teal-300">x264</a>,
    <a href="/tools/x265-wizard/" class="text-teal-400 hover:text-teal-300">x265</a>,
    <a href="/tools/av1-wizard/" class="text-teal-400 hover:text-teal-300">AV1</a>,
    <a href="/tools/vp9-wizard/" class="text-teal-400 hover:text-teal-300">VP9</a>
  </div>
</section>

<!-- Option Reference -->
<div class="mt-8 p-6 bg-zinc-800 rounded-lg border border-zinc-700">
  <h3 class="text-lg font-semibold text-white mb-3">Option Reference</h3>
  <ul class="text-zinc-300 space-y-3 text-sm">
    <li>
      <strong class="text-zinc-100">Method (<code class="px-1.5 py-0.5 bg-zinc-900 text-teal-400 rounded text-xs">mi_mode</code>):</strong>
      what happens between source frames.
      <code class="text-teal-400">mci</code> synthesizes new frames from motion vectors (genuinely smoother motion, much slower);
      <code class="text-teal-400">blend</code> cross-fades adjacent frames (fast, but every frame ends up softer/motion-blurred);
      <code class="text-teal-400">dup</code> just repeats existing frames (no smoothing &mdash; useful only when you need to retag a file at a higher container fps).
    </li>
    <li>
      <strong class="text-zinc-100">Motion compensation (<code class="px-1.5 py-0.5 bg-zinc-900 text-teal-400 rounded text-xs">mc_mode</code>):</strong>
      how overlapping motion-compensated blocks are merged.
      <code class="text-teal-400">obmc</code> uses fixed overlap to soften blocking artifacts at block edges;
      <code class="text-teal-400">aobmc</code> adapts the overlap based on local motion confidence, usually producing cleaner results at the cost of some speed.
    </li>
    <li>
      <strong class="text-zinc-100">Motion estimation direction (<code class="px-1.5 py-0.5 bg-zinc-900 text-teal-400 rounded text-xs">me_mode</code>):</strong>
      which surrounding frames are used to estimate motion for a new in-between frame.
      <code class="text-teal-400">bidir</code> looks at both the previous and next frame (more robust on fast or complex motion);
      <code class="text-teal-400">bilat</code> uses bilateral matching, which can be quicker but tends to struggle in busy scenes.
    </li>
    <li>
      <strong class="text-zinc-100">Variable-size block MC (<code class="px-1.5 py-0.5 bg-zinc-900 text-teal-400 rounded text-xs">vsbmc</code>):</strong>
      lets the encoder pick block sizes per region instead of a fixed grid, so detail-heavy areas get finer motion vectors. Almost always worth leaving on; turn off only if you can see it making things worse.
    </li>
    <li>
      <strong class="text-zinc-100">Search range (<code class="px-1.5 py-0.5 bg-zinc-900 text-teal-400 rounded text-xs">search_param</code>):</strong>
      how far (in pixels) the motion estimator looks when matching blocks between frames. Default 32 covers typical motion; raise for very fast pans or large movements, lower to trade quality for speed.
    </li>
    <li>
      <strong class="text-zinc-100">Scene change threshold (<code class="px-1.5 py-0.5 bg-zinc-900 text-teal-400 rounded text-xs">scd_threshold</code>):</strong>
      sensitivity of the built-in shot-cut detector. When a cut is detected, interpolation is skipped across it (otherwise you get glitchy morphs between unrelated shots). Lower = more sensitive. Default 10 works for most content &mdash; raise if real interpolation is being skipped, lower if you see morphing across cuts.
    </li>
  </ul>
</div>

<!-- Usage Notes -->
<div class="mt-8 p-6 bg-zinc-800 rounded-lg border border-zinc-700">
  <h3 class="text-lg font-semibold text-white mb-3">Usage Notes</h3>
  <ul class="text-zinc-300 space-y-2">
    <li><strong>What this is:</strong> the <code class="px-1.5 py-0.5 bg-zinc-900 text-teal-400 rounded text-xs">minterpolate</code> filter generates new frames between existing ones using motion analysis, producing genuinely smoother motion rather than just blending or duplicating.</li>
    <li><strong>Speed warning:</strong> motion-compensated interpolation is single-threaded and slow. Long videos can take hours. For long sources, consider splitting into chunks, processing in parallel, and concatenating the results.</li>
    <li><strong>Display caveat:</strong> a 60fps output only looks smoother on a display capable of 60Hz playback. On a 30Hz or 24Hz display, the extra frames are wasted.</li>
    <li><strong>Recommended workflow:</strong> first encode at very low CRF (high quality) for the interpolated intermediate, then re-encode with HEVC or AV1 at your target bitrate to keep file size sane.</li>
    <li><strong>Source:</strong> based on <a href="https://blog.programster.org/ffmpeg-create-smooth-videos-with-frame-interpolation" target="_blank" rel="noopener noreferrer" class="text-teal-400 hover:text-teal-300">this article by Programster</a> and the <a href="https://ffmpeg.org/ffmpeg-filters.html#minterpolate" target="_blank" rel="noopener noreferrer" class="text-teal-400 hover:text-teal-300">FFmpeg minterpolate documentation</a>.</li>
  </ul>
</div>
