---
layout: tool.liquid
title: AV1 wizard
description: Generate FFmpeg commands for AV1 encoding using the SVT-AV1 encoder
permalink: /tools/av1-wizard/
toolNumber: T/02
useFormGenerator: true
toolScript: av1-wizard.js
---

<div class="wizard">
  <div class="wizard__form">

    <div class="notice">
      <span class="ico" aria-hidden="true">⚠</span>
      <span>Always read commands before running them. Verify paths and output filenames.</span>
    </div>

    <div class="btn-row">
      <button type="button" id="resetForm" class="btn">[ reset ]</button>
      <a href="/tools/av1-wizard/" target="_blank" class="btn">[ open in new tab ↗ ]</a>
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
          <input id="outputFilename" type="text" class="input" autocomplete="off" placeholder="output.webm">
          <div class="field__hint">.webm / .mkv preferred. .mp4 works but needs AAC instead of Opus.</div>
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
        <div class="fieldset__hint">libsvtav1 · CRF mode</div>
      </div>
      <div class="fieldset__body">
        <div class="field">
          <label class="field__label" for="crf">crf <span class="flag">-crf</span></label>
          <input id="crf" type="number" class="input" value="30" step="0.5" min="1" max="63" autocomplete="off">
          <div class="field__hint">default 30 · lower = better quality / larger file</div>
        </div>
        <div class="field">
          <label class="field__label" for="preset">preset <span class="flag">-preset</span></label>
          <select id="preset" class="select">
            <option value="0">0 — slowest / best</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6" selected>6 — default</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10 — fastest</option>
          </select>
          <div class="field__hint">speed/quality tradeoff</div>
        </div>
        <div class="field">
          <label class="field__label" for="tune">tune</label>
          <select id="tune" class="select">
            <option value="0" selected>0 — VQ (visual quality)</option>
            <option value="1">1 — PSNR</option>
            <option value="2">2 — SSIM</option>
          </select>
        </div>
        <div class="field">
          <label class="field__label" for="scm">screen-content mode</label>
          <select id="scm" class="select">
            <option value="0" selected>0 — off</option>
            <option value="1">1 — on</option>
            <option value="2">2 — strong (slides/recordings)</option>
          </select>
        </div>
        <div class="field">
          <label class="field__label" for="keyframeInterval">keyframe interval</label>
          <input id="keyframeInterval" type="text" class="input" autocomplete="off" placeholder="10s or 300" pattern="\d+(ms|s)">
          <div class="field__hint">must include unit · e.g. 10s, 500ms</div>
        </div>
        <div class="field">
          <label class="field__label" for="videoFilter">video filter <span class="flag">-vf</span></label>
          <input id="videoFilter" type="text" class="input" autocomplete="off" placeholder="scale=1280:720">
          <div class="field__hint">optional</div>
        </div>
        <div class="field span-2">
          <div class="field__label">SVT-AV1 toggles</div>
          <div class="check-row">
            <label class="check"><input type="checkbox" id="enableOverlays" checked><span class="box"></span>enable overlays</label>
            <label class="check"><input type="checkbox" id="scd" checked><span class="box"></span>scene change detection</label>
          </div>
        </div>
        <div class="field span-2">
          <label class="field__label" for="extraParams">extra svt-av1 params</label>
          <input id="extraParams" type="text" class="input" autocomplete="off" placeholder="bit-depth=10:tile-columns=1">
          <div class="field__hint">colon-separated · e.g. bit-depth=10:tile-columns=1</div>
        </div>
      </div>
    </div>

    <div class="fieldset">
      <div class="fieldset__head">
        <div class="fieldset__title"><span class="num">03</span>AUDIO</div>
        <div class="fieldset__hint">opus by default in webm/mkv</div>
      </div>
      <div class="fieldset__body fieldset__body--single">
        <div class="field">
          <label class="field__label" for="audioBitrate">audio bitrate (kb/s)</label>
          <input id="audioBitrate" type="number" class="input" min="0" autocomplete="off" placeholder="128">
          <div class="field__hint">leave empty or 0 for no audio</div>
        </div>
      </div>
    </div>

    <div class="fieldset">
      <div class="fieldset__head">
        <div class="fieldset__title"><span class="num">04</span>METADATA</div>
        <div class="fieldset__hint">webm/mkv · mp4 limited support</div>
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
          <label class="field__label" for="metadataCommentOverride">comment override</label>
          <input id="metadataCommentOverride" type="text" class="input" autocomplete="off" placeholder="Custom comment">
          <div class="field__hint">overrides auto-generated encoding info</div>
        </div>
        <div class="field">
          <label class="field__label" for="metadataDate">date released</label>
          <input id="metadataDate" type="text" class="input" autocomplete="off" placeholder="YYYY-MM-DD" pattern="\d{4}-\d{2}-\d{2}">
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
          <div class="field__hint">optional · custom parameters appended to the command</div>
        </div>
      </div>
    </div>

    <details class="tool-about">
      <summary>about · references</summary>
      <div class="tool-about__body">
        <p>This tool generates FFmpeg commands for high-quality AV1 files using the SVT-AV1 encoder. Only input and output filenames are required — all other settings are optional with sensible defaults.</p>
        <p><strong>Time format:</strong> in/out points accept either time format (1:30, 00:01:30) or seconds (90). Semicolons get converted to colons automatically.</p>
        <p><strong>Keyframe interval:</strong> must include a time unit, <code>s</code> for seconds or <code>ms</code> for milliseconds (e.g. <code>10s</code> or <code>500ms</code>).</p>
        <p><strong>Metadata:</strong> encoding parameters (CRF, preset, custom params) are auto-embedded in the comment field unless you provide a comment override. Check "strip existing metadata first" to clear source metadata before adding new fields. Date format is <code>YYYY-MM-DD</code>.</p>
        <p><strong>Extra params:</strong> colon-separated SVT-AV1 options (e.g. <code>bit-depth=10:tile-columns=1</code>). Leading/trailing colons are handled.</p>
        <h3>References</h3>
        <ul>
          <li><a href="https://gitlab.com/AOMediaCodec/SVT-AV1/-/blob/master/Docs/CommonQuestions.md" target="_blank" rel="noopener noreferrer">SVT-AV1 presets</a></li>
          <li><a href="https://gitlab.com/AOMediaCodec/SVT-AV1/-/blob/master/Docs/Parameters.md" target="_blank" rel="noopener noreferrer">SVT-AV1 parameters</a></li>
          <li><a href="https://trac.ffmpeg.org/wiki/Encode/AV1" target="_blank" rel="noopener noreferrer">FFmpeg AV1 encoding guide</a></li>
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
