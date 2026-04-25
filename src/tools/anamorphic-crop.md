---
layout: base.liquid
title: Anamorphic crop calculator
description: Calculator for cropping anamorphic video with proper aspect ratio adjustments
permalink: /tools/anamorphic-crop/
customCSS: anamorphic-crop.css
---

<figure id="stage" class="stage">
  <div id="frame" class="frame">
    <div id="mask" class="mask"></div>
  </div>
  <div id="overflow-warning" class="overflow-warning">
    Over the line!
  </div>
</figure>

<div class="page-head">
  <nav class="crumbs" aria-label="Breadcrumb">
    <a href="/">~/</a><span class="sep">/</span><a href="/#tools">tools</a><span class="sep">/</span><span class="cur">anamorphic-crop</span>
  </nav>
  <div style="font-family: var(--fs-mono); font-size: 11px; color: var(--teal); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 14px;">
    [ TOOL · T/06 ]
  </div>
  <h1 class="page-title">Anamorphic <span class="accent">crop</span> calculator</h1>
  <p class="page-sub">Crop dimensions for 720×540 anamorphic video with 8/9 vertical squeeze adjustment.</p>
</div>

<form id="form" class="wizard">
  <div class="wizard__form">

    <div class="notice">
      <span class="ico" aria-hidden="true">⚠</span>
      <span>Designed for <strong>720×540 anamorphic video</strong> (typically NTSC DV). The image you upload must be exactly 720×540 pixels.</span>
    </div>

    <div class="fieldset">
      <div class="fieldset__head">
        <div class="fieldset__title"><span class="num">01</span>SOURCE FRAME</div>
        <div class="fieldset__hint">drop an image · 720×540 required</div>
      </div>
      <div class="fieldset__body fieldset__body--single">
        <div class="field">
          <div id="dropZone" class="drop-zone">
            <input id="pic" type="file" accept="image/*" class="hidden">
            <div class="drop-zone-content">
              <svg class="w-8 h-8 mb-2" style="color: var(--ink-3);" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="32" height="32">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
              </svg>
              <p style="font-family: var(--fs-mono); font-size: 12px; color: var(--ink-2); margin: 0;">drop image or click to browse</p>
              <p style="font-family: var(--fs-mono); font-size: 11px; color: var(--ink-3); margin: 4px 0 0;">720×540 pixels required</p>
            </div>
            <div class="drop-zone-filename hidden">
              <p style="font-family: var(--fs-mono); font-size: 12px; color: var(--teal); margin: 0;"></p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="fieldset">
      <div class="fieldset__head">
        <div class="fieldset__title"><span class="num">02</span>CROP REGION</div>
        <div class="fieldset__hint">width + x/y offsets in source pixels</div>
      </div>
      <div class="fieldset__body">
        <div class="field">
          <label class="field__label" for="width">width</label>
          <input id="width" type="number" class="input" min="2">
        </div>
        <div class="field">
          <label class="field__label" for="xOffset">x offset</label>
          <input id="xOffset" type="number" class="input" placeholder="0" min="0">
        </div>
        <div class="field">
          <label class="field__label" for="yOffset">y offset</label>
          <input id="yOffset" type="number" class="input" placeholder="0" min="0">
        </div>
      </div>
    </div>

    <div class="fieldset">
      <div class="fieldset__head">
        <div class="fieldset__title"><span class="num">03</span>CALCULATIONS</div>
        <div class="fieldset__hint">computed values · derived from inputs</div>
      </div>
      <div class="fieldset__body fieldset__body--single">
        <div class="ffmpeg-calculations" style="background: var(--bg-0); border: 1px solid var(--line); border-radius: 4px; padding: 14px 16px; display: flex; flex-direction: column; gap: 6px; font-family: var(--fs-mono); font-size: 13px; color: var(--ink-1);">
          <p style="margin: 0;">image size: <span id="imageWidth" style="color: var(--teal); font-weight: 500;"></span> × <span id="imageHeight" style="color: var(--teal); font-weight: 500;"></span></p>
          <p style="margin: 0;">crop width: <span id="cropWidth" style="color: var(--teal); font-weight: 500;"></span></p>
          <p style="margin: 0;">crop height: <span id="cropHeight" style="color: var(--teal); font-weight: 500;"></span> <span style="color: var(--ink-3);">= crop width × 3/4</span></p>
          <p style="margin: 0;">adjusted height: <span id="adjustedHeight" style="color: var(--teal); font-weight: 500;"></span> <span style="color: var(--ink-3);">= crop height × 8/9</span></p>
          <p style="margin: 0;">adjusted Y offset: <span id="adjustedYOffset" style="color: var(--teal); font-weight: 500;"></span> <span style="color: var(--ink-3);">= Y offset × 8/9</span></p>
        </div>
      </div>
    </div>

    <details class="tool-about">
      <summary>about · how this works</summary>
      <div class="tool-about__body">
        <h3>What is this?</h3>
        <p>A specialized calculator for cropping anamorphic video content. Anamorphic video uses non-square pixels, which means stored dimensions differ from display dimensions. This tool calculates the correct crop parameters while accounting for the pixel aspect ratio.</p>
        <h3>How to use</h3>
        <ol>
          <li>Extract a frame from your 720×540 anamorphic video</li>
          <li>Load the frame using the drop zone above</li>
          <li>Enter your desired crop width</li>
          <li>Adjust X and Y offsets to position the crop region</li>
          <li>Copy the generated crop filter and use it in your FFmpeg command</li>
        </ol>
        <h3>Background</h3>
        <p>Anamorphic video (particularly NTSC DV) is stored at 720×480 or 720×540 pixels but displays at 4:3 (640×480) or 16:9 (854×480) depending on the pixel aspect ratio. When cropping, you need to account for the vertical squeeze.</p>
        <p>This tool uses an <strong>8/9 vertical squeeze</strong> adjustment, appropriate for 4:3 DV content. Crop height is computed as width × 3/4 to maintain a 4:3 ratio, then × 8/9 to account for the anamorphic encoding.</p>
        <p>The "likely full filter" output includes <code>bwdif</code> deinterlacing (common for DV footage), the crop filter with adjustments, scaling back to 720×540, and setting the pixel aspect ratio to square (1:1) with <code>setsar=1</code>.</p>
      </div>
    </details>
  </div>

  <div class="wizard__preview">
    <div class="preview" style="margin-bottom: 16px;">
      <div class="preview__head">
        <div class="dots" aria-hidden="true"><span></span><span></span><span></span></div>
        <span>$ crop filter</span>
      </div>
      <output id="output" class="preview__body" style="user-select: all;"></output>
    </div>

    <div class="preview">
      <div class="preview__head">
        <div class="dots" aria-hidden="true"><span></span><span></span><span></span></div>
        <span>$ likely full filter</span>
      </div>
      <output id="output2" class="preview__body" style="user-select: all;"></output>
    </div>
  </div>
</form>

<script src="/js/anamorphic-crop.js"></script>
