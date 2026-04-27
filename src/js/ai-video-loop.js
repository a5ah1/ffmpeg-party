/**
 * Drives the "Seamless AI video loops" guide: substitutes input field values
 * into [data-loop-snippet] code shells and [data-loop-fill] inline spans.
 */
(function () {
  'use strict';

  const NS = 'ai-video-loop';

  const TEMPLATES = {
    'extract-end':
      'ffmpeg -sseof -3 -i "__V1__" -update 1 -q:v 2 "__END_FRAME__"',

    'extract-end-short':
      'ffmpeg -sseof -0.1 -i "__V1__" -update 1 -q:v 2 "__END_FRAME__"',

    'extract-first':
      'ffmpeg -i "__V1__" -frames:v 1 -q:v 2 "__FIRST_FRAME__"',

    'splice-bash': [
      '#!/usr/bin/env bash',
      'set -euo pipefail',
      '',
      '# 1. Read exact frame counts',
      'FRAMES1=$(ffprobe -v error -select_streams v:0 -count_frames -show_entries stream=nb_read_frames -of csv=p=0 "__V1__")',
      'FRAMES2=$(ffprobe -v error -select_streams v:0 -count_frames -show_entries stream=nb_read_frames -of csv=p=0 "__V2__")',
      '',
      'echo "clip 1: $FRAMES1 frames -> trimming to $((FRAMES1-1))"',
      'echo "clip 2: $FRAMES2 frames -> trimming to $((FRAMES2-1))"',
      '',
      '# 2. Trim the last frame from each clip (lossless stream-copy)',
      'ffmpeg -i "__V1__" -frames:v $((FRAMES1-1)) -c copy _trimmed1.mp4',
      'ffmpeg -i "__V2__" -frames:v $((FRAMES2-1)) -c copy _trimmed2.mp4',
      '',
      '# 3. Build a concat list',
      'cat > _concat_list.txt <<EOF',
      "file '_trimmed1.mp4'",
      "file '_trimmed2.mp4'",
      'EOF',
      '',
      '# 4. Concatenate into the final loop',
      'ffmpeg -f concat -safe 0 -i _concat_list.txt __CODEC__ "__OUT__"',
      '',
      '# 5. Cleanup',
      'rm _trimmed1.mp4 _trimmed2.mp4 _concat_list.txt',
      '',
      'echo "Done -> __OUT__"'
    ].join('\n'),

    'splice-cmd': [
      '@echo off',
      'setlocal enabledelayedexpansion',
      '',
      ':: =============================================',
      ':: Configuration',
      ':: =============================================',
      'set "input1=__V1__"',
      'set "input2=__V2__"',
      'set "output=__OUT__"',
      '',
      ':: Temporary files (prefixed with _ for easy cleanup)',
      'set "trimmed1=_trimmed1.mp4"',
      'set "trimmed2=_trimmed2.mp4"',
      'set "listfile=_concat_list.txt"',
      '',
      'echo Reading frame counts...',
      '',
      'for /f %%F in (\'ffprobe -v error -select_streams v:0 -count_frames -show_entries stream=nb_read_frames -of csv=p=0 "%input1%"\') do set "frames1=%%F"',
      'for /f %%F in (\'ffprobe -v error -select_streams v:0 -count_frames -show_entries stream=nb_read_frames -of csv=p=0 "%input2%"\') do set "frames2=%%F"',
      '',
      'echo clip 1: !frames1! frames -^> trimming last frame',
      'echo clip 2: !frames2! frames -^> trimming last frame',
      '',
      'set /a keep1=!frames1!-1',
      'set /a keep2=!frames2!-1',
      '',
      ':: Trim last frame from each clip (lossless)',
      'ffmpeg -i "%input1%" -frames:v !keep1! -c copy "%trimmed1%"',
      'ffmpeg -i "%input2%" -frames:v !keep2! -c copy "%trimmed2%"',
      '',
      ':: Build concat list',
      '(',
      "  echo file '%trimmed1%'",
      "  echo file '%trimmed2%'",
      ') > "%listfile%"',
      '',
      ':: Concatenate into the final loop',
      'ffmpeg -f concat -safe 0 -i "%listfile%" __CODEC__ "%output%"',
      '',
      ':: Cleanup',
      'del "%trimmed1%" "%trimmed2%" "%listfile%"',
      '',
      'echo.',
      'echo Done. Final loop saved as: %output%',
      '',
      'endlocal',
      'pause'
    ].join('\r\n')
  };

  const DEFAULTS = {
    clip1: 'video1.mp4',
    clip2: 'video2.mp4',
    outputFile: 'final_loop.mp4',
    videoCodec: '',
    audioCodec: '',
    omitAudio: false
  };

  // When only one side is set, fill the other with -c:v copy / -c:a copy so
  // users re-encoding video don't accidentally lose their audio (and vice versa).
  const computeCodec = (video, audio, omit) => {
    const v = video.trim();
    const a = audio.trim();
    if (omit) return v ? `${v} -an` : '-c:v copy -an';
    if (!v && !a) return '-c copy';
    if (v && !a)  return `${v} -c:a copy`;
    if (!v && a)  return `-c:v copy ${a}`;
    return `${v} ${a}`;
  };

  const stripExt = (name) => name.replace(/\.[^./\\]+$/, '') || name;

  const init = () => {
    const inputs = {
      clip1: document.getElementById('clip1'),
      clip2: document.getElementById('clip2'),
      outputFile: document.getElementById('outputFile'),
      videoCodec: document.getElementById('videoCodec'),
      audioCodec: document.getElementById('audioCodec'),
      omitAudio: document.getElementById('omitAudio')
    };

    if (!inputs.clip1) return;

    const storage = FFmpegFormGenerator.storage.setNamespace(NS);
    storage.restoreAllInputs(inputs, DEFAULTS);

    const snippetTargets = Array.from(document.querySelectorAll('[data-loop-snippet]'))
      .map((el) => ({
        tmpl: TEMPLATES[el.getAttribute('data-loop-snippet')],
        code: el.querySelector('code')
      }))
      .filter((t) => t.tmpl && t.code);

    const fillTargets = Array.from(document.querySelectorAll('[data-loop-fill]'))
      .map((el) => ({ key: el.getAttribute('data-loop-fill'), el }));

    const render = () => {
      const v1 = inputs.clip1.value.trim() || DEFAULTS.clip1;
      const v2 = inputs.clip2.value.trim() || DEFAULTS.clip2;
      const out = inputs.outputFile.value.trim() || DEFAULTS.outputFile;
      const codec = computeCodec(
        inputs.videoCodec.value,
        inputs.audioCodec.value,
        inputs.omitAudio.checked
      );
      inputs.audioCodec.disabled = inputs.omitAudio.checked;
      const stem = stripExt(v1);
      const endFrame = `${stem}_end_frame.png`;
      const firstFrame = `${stem}_first_frame.png`;

      const tokens = { V1: v1, V2: v2, OUT: out, CODEC: codec, END_FRAME: endFrame, FIRST_FRAME: firstFrame };
      const fills  = { clip1: v1, clip2: v2, output: out, endFrame, firstFrame };

      snippetTargets.forEach(({ tmpl, code }) => {
        code.textContent = tmpl.replace(/__([A-Z0-9_]+)__/g, (_, k) => tokens[k] ?? '');
      });
      fillTargets.forEach(({ key, el }) => {
        if (key in fills) el.textContent = fills[key];
      });
    };

    FFmpegFormGenerator.events.setupFormInputs(inputs, () => {
      storage.saveAllInputs(inputs);
      render();
    });

    render();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
