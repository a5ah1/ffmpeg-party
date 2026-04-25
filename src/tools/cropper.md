---
layout: tool.liquid
title: Visual cropper
description: Interactive visual tool for creating FFmpeg crop filter values
permalink: /tools/cropper/
toolNumber: T/05
---

<div class="basic-page">
  <div class="notice" style="margin-bottom: 28px;">
    <span class="ico" aria-hidden="true">⚠</span>
    <span>The cropper opens in a new tab and uses a full-screen interface optimized for desktop. It works best on larger screens.</span>
  </div>

  <div style="display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 36px;">
    <a href="/tools/cropper/app/" target="_blank" rel="noopener noreferrer" class="btn primary">[ launch cropper ↗ ]</a>
  </div>

  <article class="about-prose">
    <h2>What it does</h2>
    <p>Drag a frame from your video onto the canvas, position the crop region visually, and the tool emits the exact <code>-vf crop=…</code> value you can paste into any encoding command.</p>

    <h2>Features</h2>
    <ul>
      <li><b>Visual interface</b> — see exactly what you're cropping</li>
      <li><b>Drag to adjust</b> — click and drag the crop region to reposition</li>
      <li><b>Precise controls</b> — pixel-level dimension and offset inputs</li>
      <li><b>Step alignment</b> — snap dimensions to 2/4/8/16/32/64 for codec compatibility</li>
      <li><b>Customizable mask</b> — adjust mask color and opacity</li>
      <li><b>One-click copy</b> — copy the generated filter to your clipboard</li>
    </ul>

    <h2>How to use it</h2>
    <ol style="padding-left: 22px;">
      <li>Launch the cropper using the button above</li>
      <li>Drag and drop a frame from your video (or any image) onto the canvas</li>
      <li>Adjust the crop region — width/height inputs, X/Y inputs, or drag directly</li>
      <li>Choose step alignment (useful for codec requirements)</li>
      <li>Click <b>Copy</b> to get the crop filter value</li>
    </ol>

    <h2>Crop filter syntax</h2>
    <p>The FFmpeg <code>crop</code> filter removes unwanted portions of video. Basic syntax:</p>
    <p><code>crop=w=WIDTH:h=HEIGHT:x=X_OFFSET:y=Y_OFFSET</code></p>
    <p>Example: <code>ffmpeg -i input.mp4 -vf "crop=w=1920:h=800:x=0:y=140" output.mp4</code> — crops to 1920×800, removing 140 pixels from the top.</p>

    <h2>Why step alignment matters</h2>
    <p>Many video codecs work more efficiently when dimensions are divisible by 2, 8, or 16. Using step alignment can improve encoding efficiency, prevent compatibility issues, and avoid codec warnings.</p>

    <h2>Tips</h2>
    <ul>
      <li><b>Get a frame first</b> — extract one with <code>ffmpeg -i input.mp4 -ss 00:01:00 -frames:v 1 frame.png</code></li>
      <li><b>Check aspect ratio</b> — make sure your crop maintains the ratio you want</li>
      <li><b>Test on a short clip</b> before processing the full video</li>
      <li><b>Watch the borders</b> — ensure the crop doesn't include black bars or unwanted edges</li>
    </ul>
  </article>
</div>
