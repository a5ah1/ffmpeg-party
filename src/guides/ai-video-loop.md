---
layout: guide.liquid
title: Seamless AI video loops
description: Splice two AI-generated clips into a perfectly looping video using FFmpeg
permalink: /guides/ai-video-loop/
guideNumber: G/04
useFormGenerator: true
guideScript: ai-video-loop.js
---

<div class="fieldset" id="loopVars">
  <div class="fieldset__head">
    <div class="fieldset__title"><span class="num">00</span>FILENAMES</div>
    <div class="fieldset__hint">set once · substituted into every command on this page</div>
  </div>
  <div class="fieldset__body">
    <div class="field">
      <label class="field__label" for="clip1">first clip <span class="flag">video1</span></label>
      <input id="clip1" type="text" class="input" value="video1.mp4" autocomplete="off" spellcheck="false">
      <div class="field__hint">the clip generated from your source image or text prompt</div>
    </div>
    <div class="field">
      <label class="field__label" for="clip2">second clip <span class="flag">video2</span></label>
      <input id="clip2" type="text" class="input" value="video2.mp4" autocomplete="off" spellcheck="false">
      <div class="field__hint">the clip that bridges back to your starting frame</div>
    </div>
    <div class="field span-2">
      <label class="field__label" for="outputFile">final output <span class="flag">output</span></label>
      <input id="outputFile" type="text" class="input" value="final_loop.mp4" autocomplete="off" spellcheck="false">
      <div class="field__hint">the seamlessly-looping result</div>
    </div>
  </div>
</div>

<div class="fieldset" id="loopOutput">
  <div class="fieldset__head">
    <div class="fieldset__title"><span class="num">01</span>OUTPUT CODEC</div>
    <div class="fieldset__hint">advanced · leave blank for a lossless <code>-c copy</code> concat</div>
  </div>
  <div class="fieldset__body">
    <div class="field">
      <label class="field__label" for="videoCodec">video codec args <span class="flag">optional</span></label>
      <input id="videoCodec" type="text" class="input" value="" placeholder="-c:v copy" autocomplete="off" spellcheck="false">
      <div class="field__hint">full ffmpeg flags · e.g. <code>-c:v libx264 -crf 18 -preset slow</code></div>
    </div>
    <div class="field">
      <label class="field__label" for="audioCodec">audio codec args <span class="flag">optional</span></label>
      <input id="audioCodec" type="text" class="input" value="" placeholder="-c:a copy" autocomplete="off" spellcheck="false">
      <div class="field__hint">full ffmpeg flags · e.g. <code>-c:a aac -b:a 192k</code></div>
    </div>
    <div class="field span-2">
      <div class="check-row">
        <label class="check"><input id="omitAudio" type="checkbox"><span class="box"></span>omit audio (<code>-an</code>)</label>
      </div>
      <div class="field__hint">strips the audio track entirely · overrides the audio codec field above</div>
    </div>
  </div>
</div>

## How it works

Modern image-to-video models (Runway, Kling, Hailuo, Luma, and friends) accept a start frame and an end frame to "guide" generation toward a seamless loop. In practice, this rarely produces a clean result — at the time of writing (April 2026), most models respond to identical start and end frames by generating little or no motion at all, defeating the entire point of the loop.

A more reliable approach: **split the loop into two halves and generate each half as a single, one-directional clip.**

1. Use your source image (or text prompt) to generate **clip 1** — the model only has to satisfy the starting frame.
2. Take the **last frame** of clip 1 and the **first frame** of clip 1, and use those as the start and end of **clip 2** — the model now has a concrete "go from here to there" target with no original-image baggage.
3. Splice the two clips together. When the result loops, the seam between clip 2's end and clip 1's start lines up exactly, because they're the same frame.

### Why we drop one frame from each clip

Clip 1 ends on the same frame that clip 2 begins (clip-1's last frame = clip-2's start frame). Clip 2 ends on the same frame that clip 1 begins (clip-1's first frame = clip-2's end frame). If you concat the two clips naively, the seam has a duplicate frame — and so does the loop point — producing a visible stutter on every cycle.

The fix: lop off the last frame of each clip before concatenating.

```
clip 1:            A B C D E
clip 2:            E F G H A

naive concat:      A B C D E E F G H A   ← E and A are duplicated
trim last of each: A B C D | E F G H
final:             A B C D E F G H       ← seamless; H → A loops cleanly
```

Total frame count after trim + concat is `(N1 − 1) + (N2 − 1)` — useful as a sanity check.

## Generate the first clip

This step happens in your AI video service of choice. Feed it your source image (image-to-video) or your text prompt (text-to-video) and let it produce the first clip. Save the result as **video1.mp4** — or whatever you set in the filenames panel above.

A note for **text-to-video** users: you don't have a "source image", but you also don't need one. We're going to extract clip 1's first frame in the next step and use it as the loop-back point, which works the same regardless of how clip 1 was generated.

A note for **image-to-video** users: don't assume the first frame of clip 1 is identical to your source image. Most models lightly modify the input frame (compression, upscaling, slight latent-space drift). Always extract clip 1's first frame from the rendered video — don't reuse the original image file.

## Extract the bridging frames

Two single-frame extractions from clip 1. Run both before generating clip 2.

**End frame of clip 1** — this becomes the *start* frame of clip 2.

<div class="snippet" data-label="bash" data-loop-snippet="extract-end"><pre><code></code></pre></div>

The `-sseof -3` flag seeks to 3 seconds before the end of the file; `-update 1` tells the encoder to overwrite a single PNG until the stream ends, leaving the final decoded frame in the output file. If your clip is shorter than ~3 seconds (or `-sseof -3` produces an early frame for some other reason), use this variant instead:

<div class="snippet" data-label="bash" data-loop-snippet="extract-end-short"><pre><code></code></pre></div>

**First frame of clip 1** — this becomes the *end* frame of clip 2.

<div class="snippet" data-label="bash" data-loop-snippet="extract-first"><pre><code></code></pre></div>

You'll end up with two PNG files in your working directory: <code data-loop-fill="endFrame"></code> and <code data-loop-fill="firstFrame"></code>.

## Generate the second clip

Back in your AI service, generate a second clip with:

- **Start frame** = <code data-loop-fill="endFrame"></code> (the last frame of clip 1)
- **End frame** = <code data-loop-fill="firstFrame"></code> (the first frame of clip 1)

Save the result as **video2.mp4**. The model now has a clear directional target: take us from where clip 1 ended back to where clip 1 started.

Use the same model, same resolution, and same generation length as clip 1 — the splice step relies on both clips having matching codec parameters.

## Trim and splice

Drop one frame from each clip and concatenate. Pick the script that matches your shell.

**Bash** (macOS, Linux, WSL, Git Bash):

<div class="snippet" data-label="loop.sh" data-loop-snippet="splice-bash"><pre><code></code></pre></div>

**Windows CMD** (the script the author has actually used):

<div class="snippet" data-label="loop.bat" data-loop-snippet="splice-cmd"><pre><code></code></pre></div>

Both scripts:

1. Use `ffprobe` to read the exact frame count of each clip.
2. Trim the last frame of each clip with `ffmpeg -frames:v N -c copy` (lossless — no re-encoding).
3. Build a concat list and join the trimmed clips into the final loop.
4. Clean up the intermediate files.

If your clips have audio, the default `-c copy` preserves it as-is. AI clips are usually silent, so this rarely matters — but the *output codec* fieldset above includes an "omit audio" toggle and an audio codec input if you need finer control.

## Notes &amp; caveats

**Lossless concat needs matching codec parameters.** The default `-c copy` only works when both clips use the same codec, resolution, pixel format, and a few other low-level encoding parameters. Clips generated back-to-back from the same AI service almost always match. If you've re-encoded one of the clips through a different pipeline first, the concat will fail or produce a broken file — re-export both clips through the same path before splicing.

**Need a different output codec?** Use the *output codec* fieldset at the top. The video and audio codec inputs accept full ffmpeg flag syntax (e.g. `-c:v libx264 -crf 18 -preset slow` and `-c:a aac -b:a 192k`), and either input may be left blank — empty fields fall back to `-c:v copy` or `-c:a copy` so you don't accidentally lose audio when re-encoding video. The trim steps stay lossless either way (they always use `-c copy` to keep intermediates pristine); only the final concat is re-encoded. For most workflows, the default lossless concat is the right choice — re-encoding to a delivery format is a separate concern.

**B-frame edge case.** Stream-copy trim works cleanly when the clip's last frame in display order matches its last frame in decode order. AI-generated clips typically use simple GOP structures where this holds, but if you see visible glitches at the splice point, re-export the clip through a known encoder first (any of the [encoder wizards](/#tools)) before running the splice script.

**Loop length.** Clip lengths in current AI services tend to land in the 5–10 second range, giving you a 10–20 second loop after splice. If the loop feels too short, generate clip 1 and clip 2 at the maximum length your service supports — there's no need to keep them equal-length, just matching codec parameters.
