---
layout: tool.liquid
title: x264 wizard
description: Generate FFmpeg commands for H.264/AVC encoding with the x264 encoder
permalink: /tools/x264-wizard/
toolNumber: T/03
useFormGenerator: true
toolScript: x264-wizard.js
---

<div class="wizard">
  <div class="wizard__form">

    <div class="notice">
      <span class="ico" aria-hidden="true">⚠</span>
      <span>Always read commands before running them. Verify paths and output filenames.</span>
    </div>

    <div class="btn-row">
      <button type="button" id="resetForm" class="btn">[ reset ]</button>
      <a href="/tools/x264-wizard/" target="_blank" class="btn">[ open in new tab ↗ ]</a>
    </div>

    <div class="fieldset">
      <div class="fieldset__head">
        <div class="fieldset__title"><span class="num">01</span>SOURCE / OUTPUT</div>
        <div class="fieldset__hint">filenames + time range</div>
      </div>
      <div class="fieldset__body">
        <div class="field">
          <label class="field__label" for="inputFile">input <span class="flag">-i</span></label>
          <input id="inputFile" type="text" class="input" autocomplete="off" placeholder="input.mp4">
        </div>
        <div class="field">
          <label class="field__label" for="outputFilename">output</label>
          <input id="outputFilename" type="text" class="input" autocomplete="off" placeholder="output.mp4">
          <div class="field__hint">.mp4 recommended for broad compatibility</div>
        </div>
        <div class="field">
          <label class="field__label" for="inPoint">in point <span class="flag">-ss</span></label>
          <input id="inPoint" type="text" class="input" autocomplete="off" placeholder="1:30 or 90">
          <div class="field__hint">optional · accepts hh:mm:ss or seconds</div>
        </div>
        <div class="field">
          <label class="field__label" for="outPoint">out point <span class="flag">-to</span></label>
          <input id="outPoint" type="text" class="input" autocomplete="off" placeholder="2:45 or 165">
          <div class="field__hint">optional · accepts hh:mm:ss or seconds</div>
        </div>
      </div>
    </div>

    <div class="fieldset">
      <div class="fieldset__head">
        <div class="fieldset__title"><span class="num">02</span>VIDEO ENCODING</div>
        <div class="fieldset__hint">libx264 · CRF mode</div>
      </div>
      <div class="fieldset__body">
        <div class="field">
          <label class="field__label" for="crf">crf <span class="flag">-crf</span></label>
          <input id="crf" type="number" class="input" value="23" step="1" min="0" max="51" autocomplete="off">
          <div class="field__hint">default 23 · range 0–51 · lower = better quality</div>
        </div>
        <div class="field">
          <label class="field__label" for="preset">preset <span class="flag">-preset</span></label>
          <select id="preset" class="select">
            <option value="ultrafast">ultrafast — fastest</option>
            <option value="superfast">superfast</option>
            <option value="veryfast">veryfast</option>
            <option value="faster">faster</option>
            <option value="fast">fast</option>
            <option value="medium" selected>medium — default</option>
            <option value="slow">slow</option>
            <option value="slower">slower</option>
            <option value="veryslow">veryslow</option>
            <option value="placebo">placebo — slowest</option>
          </select>
          <div class="field__hint">slower = better compression</div>
        </div>
        <div class="field">
          <label class="field__label" for="tune">tune <span class="flag">-tune</span></label>
          <select id="tune" class="select">
            <option value="" selected>none</option>
            <option value="film">film — live action</option>
            <option value="animation">animation</option>
            <option value="grain">grain — preserve film grain</option>
          </select>
        </div>
        <div class="field">
          <label class="field__label" for="frameRate">frame rate preset</label>
          <select id="frameRate" class="select">
            <option value="" selected>custom / none</option>
            <option value="24">24 fps</option>
            <option value="25">25 fps</option>
            <option value="30">30 fps</option>
            <option value="50">50 fps</option>
            <option value="60">60 fps</option>
          </select>
          <div class="field__hint">auto-populates x264 params below</div>
        </div>
        <div class="field">
          <label class="field__label" for="pixelFormat">pixel format <span class="flag">-pix_fmt</span></label>
          <select id="pixelFormat" class="select">
            <option value="" selected>no change (use source)</option>
            <option value="yuv420p">yuv420p — 8-bit 4:2:0</option>
            <option value="yuv420p10le">yuv420p10le — 10-bit 4:2:0</option>
          </select>
        </div>
        <div class="field">
          <label class="field__label" for="videoFilter">video filter <span class="flag">-vf</span></label>
          <input id="videoFilter" type="text" class="input" autocomplete="off" placeholder="scale=1280:720">
          <div class="field__hint">optional</div>
        </div>
        <div class="field span-2">
          <label class="field__label" for="x264Params">x264 params <span class="flag">-x264-params</span></label>
          <input id="x264Params" type="text" class="input" autocomplete="off" placeholder="keyint=300:bframes=6:ref=4:me=umh:subme=9">
          <div class="field__hint">colon-separated · auto-filled by frame-rate preset, editable</div>
        </div>
      </div>
    </div>

    <div class="fieldset">
      <div class="fieldset__head">
        <div class="fieldset__title"><span class="num">03</span>AUDIO</div>
        <div class="fieldset__hint">aac / libfdk_aac · cbr or vbr</div>
      </div>
      <div class="fieldset__body">
        <div class="field">
          <label class="field__label" for="audioCodec">codec <span class="flag">-c:a</span></label>
          <select id="audioCodec" class="select">
            <option value="aac" selected>aac — native FFmpeg</option>
            <option value="libfdk_aac">libfdk_aac — high quality (external)</option>
          </select>
        </div>
        <div class="field">
          <div class="field__label">mode</div>
          <div class="check-row">
            <label class="radio"><input type="radio" id="audioModeCbr" name="audioMode" value="cbr" checked><span class="box"></span>CBR</label>
            <label class="radio"><input type="radio" id="audioModeVbr" name="audioMode" value="vbr"><span class="box"></span>VBR</label>
          </div>
        </div>
        <div class="field" id="audioBitrateField">
          <label class="field__label" for="audioBitrate">bitrate <span class="flag">-b:a</span></label>
          <input id="audioBitrate" type="text" class="input" autocomplete="off" value="192k" placeholder="192k">
          <div class="field__hint">128k mono · 192k stereo · 384k 5.1</div>
        </div>
        <div class="field" id="audioQualityField" style="display: none;">
          <label class="field__label" for="audioQuality">vbr quality</label>
          <input id="audioQuality" type="number" class="input" step="0.1" autocomplete="off">
          <div class="field__hint" id="audioQualityHint">quality setting for VBR mode</div>
        </div>
      </div>
    </div>

    <div class="fieldset">
      <div class="fieldset__head">
        <div class="fieldset__title"><span class="num">04</span>METADATA</div>
        <div class="fieldset__hint">mp4 container · limited support in others</div>
      </div>
      <div class="fieldset__body">
        <div class="field span-2">
          <div class="check-row">
            <label class="check"><input type="checkbox" id="removeMetadata"><span class="box"></span>strip existing metadata first</label>
          </div>
        </div>
        <div class="field">
          <label class="field__label" for="metadataTitle">title</label>
          <input id="metadataTitle" type="text" class="input" autocomplete="off" placeholder="My video">
        </div>
        <div class="field">
          <label class="field__label" for="metadataDescription">description</label>
          <input id="metadataDescription" type="text" class="input" autocomplete="off" placeholder="A description">
        </div>
        <div class="field">
          <label class="field__label" for="metadataCommentOverride">comment</label>
          <input id="metadataCommentOverride" type="text" class="input" autocomplete="off" placeholder="Optional comment">
          <div class="field__hint">x264 records encoding info automatically</div>
        </div>
        <div class="field">
          <label class="field__label" for="metadataYear">year</label>
          <input id="metadataYear" type="text" class="input" autocomplete="off" placeholder="2025" pattern="\d{4}">
        </div>
      </div>
    </div>

    <div class="fieldset">
      <div class="fieldset__head">
        <div class="fieldset__title"><span class="num">05</span>ADVANCED</div>
        <div class="fieldset__hint">extra ffmpeg flags</div>
      </div>
      <div class="fieldset__body fieldset__body--single">
        <div class="field">
          <label class="field__label" for="additionalOptions">additional ffmpeg options</label>
          <input id="additionalOptions" type="text" class="input" autocomplete="off" placeholder="-threads 4">
          <div class="field__hint">optional · custom parameters appended</div>
        </div>
      </div>
    </div>

    <details class="tool-about">
      <summary>about · references</summary>
      <div class="tool-about__body">
        <p><strong>Note —</strong> this is an opinionated wizard focused on CRF-based quality encoding. It does not support bitrate (ABR) mode.</p>
        <p>Generates FFmpeg commands for H.264/AVC files using the x264 encoder. Only input and output filenames are required.</p>
        <p><strong>Frame-rate presets</strong> auto-populate optimized x264 parameters (<code>keyint</code>, <code>bframes</code>, <code>ref</code>, motion estimation) based on the recommendations in the <a href="/guides/x264/">x264 guide</a>. Edit them after if needed.</p>
        <p><strong>Audio:</strong> native FFmpeg AAC or libfdk_aac (higher quality, requires custom build). CBR uses constant bitrate (~192k stereo); VBR uses quality-based encoding (0.1–2 for native AAC, 1–5 for libfdk).</p>
        <p><strong>Time format:</strong> in/out points accept time format (<code>1:30</code>, <code>00:01:30</code>) or seconds (<code>90</code>). Semicolons get converted to colons automatically.</p>
        <p><strong>Metadata fields</strong> are tuned for MP4. Other containers (MKV, WebM) have inconsistent support.</p>
        <h3>References</h3>
        <ul>
          <li><a href="/guides/x264/">x264 encoder guide</a> — recommendations and CRF tables</li>
          <li><a href="https://trac.ffmpeg.org/wiki/Encode/H.264" target="_blank" rel="noopener noreferrer">FFmpeg H.264 encoding guide</a></li>
          <li><a href="https://trac.ffmpeg.org/wiki/Encode/AAC" target="_blank" rel="noopener noreferrer">FFmpeg AAC encoding guide</a></li>
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
      <div class="preview__body" id="output"></div>
      <div class="preview__foot">
        <button type="button" class="btn primary" id="copy">[ copy command ]</button>
        <span class="preview__copy-status" id="copyStatus">copied!</span>
      </div>
    </div>
  </div>
</div>
