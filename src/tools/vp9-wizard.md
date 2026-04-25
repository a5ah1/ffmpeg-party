---
layout: tool.liquid
title: VP9 wizard
description: Generate FFmpeg commands for VP9 encoding using 2-pass libvpx-vp9
permalink: /tools/vp9-wizard/
toolNumber: T/01
useFormGenerator: true
toolScript: vp9-wizard.js
---

<div class="wizard">
  <div class="wizard__form">

    <div class="notice">
      <span class="ico" aria-hidden="true">⚠</span>
      <span>Always read commands before running them. Verify paths and output filenames.</span>
    </div>

    <div class="btn-row">
      <button type="button" id="resetForm" class="btn">[ reset ]</button>
      <a href="/tools/vp9-wizard/" target="_blank" class="btn">[ open in new tab ↗ ]</a>
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
          <div class="field__hint">.webm or .mkv preferred for VP9</div>
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
        <div class="fieldset__hint">libvpx-vp9 · 2-pass · CRF mode</div>
      </div>
      <div class="fieldset__body">
        <div class="field">
          <label class="field__label" for="crf">crf <span class="flag">-crf</span></label>
          <input id="crf" type="number" class="input" value="32" step="0.5" min="0" max="63" autocomplete="off">
          <div class="field__hint">default 32 · range 0–63 · lower = better quality</div>
        </div>
        <div class="field">
          <label class="field__label" for="keyframeInterval">keyframe interval <span class="flag">-g</span></label>
          <input id="keyframeInterval" type="number" class="input" step="1" min="1" autocomplete="off" placeholder="240">
          <div class="field__hint">optional · GOP size in frames</div>
        </div>
        <div class="field span-2">
          <label class="field__label" for="videoFilter">video filter <span class="flag">-vf</span></label>
          <input id="videoFilter" type="text" class="input" autocomplete="off" placeholder="scale=1280:720">
          <div class="field__hint">optional · e.g. scale=1280:720, crop=1920:800:0:140</div>
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
        <div class="fieldset__hint">webm/mkv · added on second pass only</div>
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
          <label class="field__label" for="metadataComment">comment</label>
          <input id="metadataComment" type="text" class="input" autocomplete="off" placeholder="Additional comment">
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
      <div class="fieldset__body">
        <div class="field">
          <label class="field__label" for="additionalOptions">extra options (both passes)</label>
          <input id="additionalOptions" type="text" class="input" autocomplete="off" placeholder="-threads 4">
          <div class="field__hint">applied to both encoding passes</div>
        </div>
        <div class="field">
          <label class="field__label" for="additionalOptions2">extra options (2nd pass only)</label>
          <input id="additionalOptions2" type="text" class="input" autocomplete="off" placeholder="-metadata artist='Artist Name'">
          <div class="field__hint">applied only to the final pass</div>
        </div>
        <div class="field span-2">
          <div class="field__label">null output target</div>
          <div class="check-row">
            <label class="radio"><input type="radio" id="nullOutputWindows" name="nullOutput" value="NUL" checked><span class="box"></span>Windows (NUL)</label>
            <label class="radio"><input type="radio" id="nullOutputLinux" name="nullOutput" value="/dev/null"><span class="box"></span>Linux/macOS (/dev/null)</label>
          </div>
        </div>
      </div>
    </div>

    <details class="tool-about">
      <summary>about · references</summary>
      <div class="tool-about__body">
        <p>Generates FFmpeg commands for high-quality VP9-encoded videos with Opus audio using <strong>2-pass</strong> encoding. Outputs to WebM or MKV containers.</p>
        <p><strong>Why 2-pass:</strong> VP9 benefits significantly from a first analysis pass. The output of the first pass goes to a null target (<code>NUL</code> on Windows, <code>/dev/null</code> elsewhere). Pick the right target above.</p>
        <p><strong>Time format:</strong> in/out points accept time format (<code>1:30</code>, <code>00:01:30</code>) or seconds (<code>90</code>). Semicolons get converted to colons automatically.</p>
        <p><strong>Metadata:</strong> all fields are added only on the second pass. Check "strip existing metadata" to clear source metadata first. Date format is <code>YYYY-MM-DD</code>.</p>
        <p><strong>Extra options:</strong> the first field applies to both passes, the second only to the final pass. Use these for thread count or extra metadata.</p>
        <h3>References</h3>
        <ul>
          <li><a href="https://developers.google.com/media/vp9/settings/vod" target="_blank" rel="noopener noreferrer">Google's VP9 VOD recommendations</a></li>
          <li><a href="https://trac.ffmpeg.org/wiki/Encode/VP9" target="_blank" rel="noopener noreferrer">FFmpeg VP9 encoding guide</a></li>
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
