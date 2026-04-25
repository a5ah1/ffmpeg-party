---
layout: tool.liquid
title: Duration calculator
description: Calculate the duration between two timestamps for FFmpeg commands
permalink: /tools/duration-calculator/
toolNumber: T/08
useFormGenerator: true
toolScript: duration-calculator.js
---

<div class="wizard">
  <div class="wizard__form">

    <div class="notice">
      <span class="ico" aria-hidden="true">⚠</span>
      <span>Calculates duration between two timestamps. Use the result with FFmpeg's <code style="color: inherit;">-t</code> or <code style="color: inherit;">-to</code> flags.</span>
    </div>

    <div class="fieldset">
      <div class="fieldset__head">
        <div class="fieldset__title"><span class="num">01</span>TIME RANGE</div>
        <div class="fieldset__hint">accepts hh:mm:ss · mm:ss · ss</div>
      </div>
      <div class="fieldset__body">
        <div class="field">
          <label class="field__label" for="startTime">start time</label>
          <input type="text" id="startTime" class="input" placeholder="0:00:00.000" autocomplete="off">
          <div id="startDisplay" class="field__hint" style="font-size: 12px;"></div>
        </div>
        <div class="field">
          <label class="field__label" for="endTime">end time</label>
          <input type="text" id="endTime" class="input" placeholder="0:01:00.000" autocomplete="off">
          <div id="endDisplay" class="field__hint" style="font-size: 12px;"></div>
        </div>
      </div>
    </div>

    <details class="tool-about">
      <summary>about · format reference</summary>
      <div class="tool-about__body">
        <p>Real-time calculation as you type. Both colons (<code>:</code>) and semicolons (<code>;</code>) work as separators. Outputs maintain full precision (displayed to 3 decimal places).</p>
        <ul>
          <li><strong>Hours format:</strong> <code>HH:MM:SS.mmm</code> · e.g. <code>1:23:45.678</code></li>
          <li><strong>Minutes format:</strong> <code>MM:SS.mmm</code> · e.g. <code>23:45.678</code></li>
          <li><strong>Seconds format:</strong> <code>SS.mmm</code> · e.g. <code>45.678</code></li>
        </ul>
      </div>
    </details>
  </div>

  <div class="wizard__preview">
    <div class="preview" style="margin-bottom: 16px;">
      <div class="preview__head">
        <div class="dots" aria-hidden="true"><span></span><span></span><span></span></div>
        <span>timecode · HH:MM:SS.mmm</span>
      </div>
      <div class="preview__body" id="timecodeOutput" style="min-height: 60px; font-size: 18px; display: flex; align-items: center;">00:00:00.000</div>
      <div class="preview__foot">
        <button type="button" class="btn primary" id="copyTimecode">[ copy ]</button>
        <span class="preview__copy-status" id="copyTimecodeStatus">copied!</span>
      </div>
    </div>

    <div class="preview">
      <div class="preview__head">
        <div class="dots" aria-hidden="true"><span></span><span></span><span></span></div>
        <span>seconds · -t value</span>
      </div>
      <div class="preview__body" id="secondsOutput" style="min-height: 60px; font-size: 18px; display: flex; align-items: center;">0.000</div>
      <div class="preview__foot">
        <button type="button" class="btn primary" id="copySeconds">[ copy ]</button>
        <span class="preview__copy-status" id="copySecondsStatus">copied!</span>
      </div>
    </div>
  </div>
</div>
