---
layout: tool.liquid
title: WebM from image sequence
description: Generate two-pass FFmpeg commands to convert image sequences into WebM video
permalink: /tools/webm-from-image-sequence/
toolNumber: T/09
useFormGenerator: true
toolScript: webm-from-image-sequence.js
---

<div class="wizard">
  <div class="wizard__form">

    <div class="notice">
      <span class="ico" aria-hidden="true">⚠</span>
      <span>Legacy tool. For new projects consider the <a href="/tools/av1-wizard/" style="color: inherit; text-decoration: underline;">AV1 wizard</a> for better compression.</span>
    </div>

    <div class="fieldset">
      <div class="fieldset__head">
        <div class="fieldset__title"><span class="num">01</span>IMAGE SEQUENCE</div>
        <div class="fieldset__hint">numbered files in a directory</div>
      </div>
      <div class="fieldset__body">
        <div class="field">
          <label class="field__label" for="fps">frames per second</label>
          <input type="number" id="fps" class="input" min="1" max="60" step="1" value="8" autocomplete="off">
        </div>
        <div class="field">
          <label class="field__label" for="suffix">filename suffix</label>
          <input type="text" id="suffix" class="input" placeholder="-frame.png" autocomplete="off">
          <div class="field__hint">combined with <code style="color: var(--teal);">%05d</code> · e.g. 00001-frame.png</div>
        </div>
      </div>
    </div>

    <div class="fieldset">
      <div class="fieldset__head">
        <div class="fieldset__title"><span class="num">02</span>VIDEO ENCODING</div>
        <div class="fieldset__hint">vp9 · 2-pass</div>
      </div>
      <div class="fieldset__body fieldset__body--single">
        <div class="field">
          <label class="field__label" for="crf">crf <span class="flag">-crf</span></label>
          <input type="number" id="crf" class="input" min="0" max="59" step="1" value="31" autocomplete="off">
          <div class="field__hint">default 31 · lower = better quality / larger file</div>
        </div>
      </div>
    </div>

    <div class="fieldset">
      <div class="fieldset__head">
        <div class="fieldset__title"><span class="num">03</span>OUTPUT</div>
        <div class="fieldset__hint">filename + null target</div>
      </div>
      <div class="fieldset__body">
        <div class="field">
          <label class="field__label" for="outputFile">output filename</label>
          <input type="text" id="outputFile" class="input" placeholder="output.webm" autocomplete="off">
        </div>
        <div class="field">
          <div class="field__label">operating system</div>
          <div class="check-row">
            <label class="radio"><input type="radio" id="osWindows" name="os" value="windows" checked><span class="box"></span>Windows (NUL)</label>
            <label class="radio"><input type="radio" id="osLinux" name="os" value="linux"><span class="box"></span>Linux/macOS (/dev/null)</label>
          </div>
        </div>
      </div>
    </div>

    <div class="fieldset">
      <div class="fieldset__head">
        <div class="fieldset__title"><span class="num">04</span>OPTIONAL</div>
        <div class="fieldset__hint">custom pattern · thread queue</div>
      </div>
      <div class="fieldset__body">
        <div class="field">
          <label class="field__label" for="customPattern">custom filename pattern</label>
          <input type="text" id="customPattern" class="input" placeholder="img-%03d.png" autocomplete="off">
          <div class="field__hint">overrides suffix if files don't follow %05d + suffix</div>
        </div>
        <div class="field">
          <label class="field__label" for="threadQueue">thread queue size</label>
          <input type="number" id="threadQueue" class="input" min="1" placeholder="1" autocomplete="off">
          <div class="field__hint">helps suppress warnings during encoding</div>
        </div>
      </div>
    </div>

    <details class="tool-about">
      <summary>about · usage</summary>
      <div class="tool-about__body">
        <p>Generates a two-pass FFmpeg command to convert image sequences into WebM videos using the VP9 codec. Originally created to simplify video generation from Stable Diffusion outputs and other image-sequence workflows.</p>
        <h3>How to use</h3>
        <ol>
          <li>Place all your images in a single directory with sequential numbering (00001, 00002, etc.)</li>
          <li>Enter the filename suffix (e.g. <code>-frame.png</code> for files like <code>00001-frame.png</code>)</li>
          <li>Configure frame rate, quality (CRF), and output filename above</li>
          <li>Copy the generated command</li>
          <li>Navigate to your image directory in a terminal</li>
          <li>Paste and execute the command</li>
        </ol>
        <h3>Filename examples</h3>
        <ul>
          <li>suffix <code>-frame.png</code> → <code>00001-frame.png</code>, <code>00002-frame.png</code>, …</li>
          <li>suffix <code>.jpg</code> → <code>00001.jpg</code>, <code>00002.jpg</code>, …</li>
          <li>custom <code>img-%03d.png</code> → <code>img-001.png</code>, <code>img-002.png</code>, …</li>
        </ul>
      </div>
    </details>
  </div>

  <div class="wizard__preview">
    <div class="preview">
      <div class="preview__head">
        <div class="dots" aria-hidden="true"><span></span><span></span><span></span></div>
        <span>$ ffmpeg-command</span>
      </div>
      <div class="preview__body" id="output">please use the controls to generate the ffmpeg command</div>
      <div class="preview__foot">
        <button type="button" class="btn primary" id="copy">[ copy command ]</button>
        <span class="preview__copy-status" id="copyStatus">copied!</span>
      </div>
    </div>
  </div>
</div>
