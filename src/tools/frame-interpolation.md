---
layout: tool.liquid
title: Frame interpolation generator
description: Build FFmpeg minterpolate filter strings to smooth video frame rates
permalink: /tools/frame-interpolation/
toolNumber: T/07
useFormGenerator: true
toolScript: frame-interpolation.js
---

<div class="wizard">
  <div class="wizard__form">

    <div class="notice">
      <span class="ico" aria-hidden="true">⚠</span>
      <span>The output is a filter string, not a full command. Paste it into the <strong>video filter</strong> field of an encoding wizard.</span>
    </div>

    <div class="btn-row">
      <button type="button" id="resetForm" class="btn">[ reset ]</button>
      <a href="/tools/frame-interpolation/" target="_blank" class="btn">[ open in new tab ↗ ]</a>
    </div>

    <div class="fieldset">
      <div class="fieldset__head">
        <div class="fieldset__title"><span class="num">01</span>OUTPUT FRAME RATE</div>
        <div class="fieldset__hint">target fps · the rate after interpolation</div>
      </div>
      <div class="fieldset__body fieldset__body--single">
        <div class="field">
          <label class="field__label" for="fps">target frame rate <span class="flag">fps</span></label>
          <input id="fps" type="number" class="input" value="60" min="1" step="1" autocomplete="off">
          <div class="field__hint">common values: 24, 25, 30, 50, 60, 120</div>
        </div>
      </div>
    </div>

    <div class="fieldset">
      <div class="fieldset__head">
        <div class="fieldset__title"><span class="num">02</span>INTERPOLATION METHOD</div>
        <div class="fieldset__hint">how to fill in between frames</div>
      </div>
      <div class="fieldset__body fieldset__body--single">
        <div class="field">
          <label class="field__label" for="method">method <span class="flag">mi_mode</span></label>
          <select id="method" class="select" autocomplete="off">
            <option value="mci">motion-compensated (mci) — recommended, slow</option>
            <option value="blend">frame blending (blend) — fast, motion-blurry</option>
            <option value="dup">frame duplication (dup) — no smoothing</option>
          </select>
          <div class="field__hint">mci synthesizes new frames from motion analysis; blend cross-fades between adjacent frames; dup just retags container fps.</div>
        </div>
      </div>
    </div>

    <div class="fieldset" id="advancedSection">
      <div class="fieldset__head">
        <div class="fieldset__title"><span class="num">03</span>MOTION ESTIMATION</div>
        <div class="fieldset__hint">mci only · ignored for blend / dup</div>
      </div>
      <div class="fieldset__body">
        <div class="field">
          <label class="field__label" for="mcMode">motion compensation <span class="flag">mc_mode</span></label>
          <select id="mcMode" class="select" autocomplete="off">
            <option value="aobmc">adaptive overlapped block (aobmc) — recommended</option>
            <option value="obmc">overlapped block (obmc)</option>
          </select>
        </div>
        <div class="field">
          <label class="field__label" for="meMode">estimation direction <span class="flag">me_mode</span></label>
          <select id="meMode" class="select" autocomplete="off">
            <option value="bidir">bidirectional (bidir) — recommended</option>
            <option value="bilat">bilateral (bilat)</option>
          </select>
        </div>
        <div class="field span-2">
          <div class="check-row">
            <label class="check"><input id="vsbmc" type="checkbox" checked><span class="box"></span>variable-size block MC (vsbmc)</label>
          </div>
          <div class="field__hint">enables variable block sizes for finer motion detail · recommended on</div>
        </div>
        <div class="field">
          <label class="field__label" for="searchParam">search range <span class="flag">search_param</span></label>
          <input id="searchParam" type="number" class="input" value="32" min="4" step="1" autocomplete="off">
          <div class="field__hint">default 32 · higher = more accurate, slower</div>
        </div>
        <div class="field">
          <label class="field__label" for="scdThreshold">scene-change threshold <span class="flag">scd_threshold</span></label>
          <input id="scdThreshold" type="number" class="input" value="10" min="0" step="0.1" autocomplete="off">
          <div class="field__hint">default 10 · lower = more sensitive cut detection</div>
        </div>
      </div>
    </div>

    <details class="tool-about">
      <summary>about · option reference</summary>
      <div class="tool-about__body">
        <p><strong>What this is:</strong> the <code>minterpolate</code> filter generates new frames between existing ones using motion analysis, producing genuinely smoother motion rather than just blending or duplicating.</p>
        <p><strong>Speed warning:</strong> motion-compensated interpolation is single-threaded and slow. Long videos can take hours. For long sources, split into chunks, process in parallel, and concat the results.</p>
        <p><strong>Display caveat:</strong> a 60 fps output only looks smoother on a display capable of 60 Hz playback. On a 30 Hz or 24 Hz screen, the extra frames are wasted.</p>
        <p><strong>Recommended workflow:</strong> first encode at very low CRF (high quality) for the interpolated intermediate, then re-encode with HEVC or AV1 at your target bitrate to keep file size sane.</p>
        <h3>Option reference</h3>
        <ul>
          <li><strong>mi_mode</strong> — what happens between source frames. <code>mci</code> synthesizes new frames from motion vectors; <code>blend</code> cross-fades adjacent frames; <code>dup</code> just repeats existing frames.</li>
          <li><strong>mc_mode</strong> — how overlapping motion-compensated blocks are merged. <code>aobmc</code> adapts overlap based on local motion confidence; <code>obmc</code> uses fixed overlap.</li>
          <li><strong>me_mode</strong> — which surrounding frames are used. <code>bidir</code> looks at both previous and next frames (more robust); <code>bilat</code> uses bilateral matching (quicker but struggles in busy scenes).</li>
          <li><strong>vsbmc</strong> — variable block sizes per region. Almost always worth on.</li>
          <li><strong>search_param</strong> — how far the motion estimator looks. Default 32 covers typical motion; raise for fast pans.</li>
          <li><strong>scd_threshold</strong> — sensitivity of the built-in shot-cut detector. When a cut is detected, interpolation is skipped across it.</li>
        </ul>
        <p>Based on <a href="https://blog.programster.org/ffmpeg-create-smooth-videos-with-frame-interpolation" target="_blank" rel="noopener noreferrer">this article by Programster</a> and the <a href="https://ffmpeg.org/ffmpeg-filters.html#minterpolate" target="_blank" rel="noopener noreferrer">FFmpeg minterpolate documentation</a>.</p>
      </div>
    </details>
  </div>

  <div class="wizard__preview">
    <div class="preview">
      <div class="preview__head">
        <div class="dots" aria-hidden="true"><span></span><span></span><span></span></div>
        <span>$ minterpolate-filter</span>
      </div>
      <div class="preview__body" id="output"></div>
      <div class="preview__foot">
        <button type="button" class="btn primary" id="copy">[ copy filter ]</button>
        <span class="preview__copy-status" id="copyStatus">copied!</span>
      </div>
    </div>

    <div style="margin-top: 16px; font-family: var(--fs-mono); font-size: 11px; color: var(--ink-3); text-align: center;">
      use with:
      <a href="/tools/x264-wizard/">x264</a> ·
      <a href="/tools/x265-wizard/">x265</a> ·
      <a href="/tools/av1-wizard/">av1</a> ·
      <a href="/tools/vp9-wizard/">vp9</a>
    </div>
  </div>
</div>
