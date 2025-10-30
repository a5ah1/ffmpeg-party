---
layout: tool.liquid
title: Duration Calculator
description: Calculate the duration between two timestamps for FFmpeg commands
permalink: /tools/duration-calculator/
useFormGenerator: true
toolScript: duration-calculator.js
---

<!-- Input Section -->
<section class="mb-10">
  <h2 class="ffmpeg-section-header">Time Range</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="ffmpeg-field">
      <label for="startTime">Start Time</label>
      <input type="text" id="startTime" placeholder="0:00:00.000" autocomplete="off">
      <p class="field-hint">Formats: HH:MM:SS.mmm, MM:SS.mmm, or SS.mmm</p>
      <div id="startDisplay" class="mt-2 text-sm text-zinc-400 font-mono"></div>
    </div>
    <div class="ffmpeg-field">
      <label for="endTime">End Time</label>
      <input type="text" id="endTime" placeholder="0:01:00.000" autocomplete="off">
      <p class="field-hint">Formats: HH:MM:SS.mmm, MM:SS.mmm, or SS.mmm</p>
      <div id="endDisplay" class="mt-2 text-sm text-zinc-400 font-mono"></div>
    </div>
  </div>
</section>

<!-- Output Section -->
<section class="mb-10">
  <h2 class="ffmpeg-section-header">Calculated Duration</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="ffmpeg-field">
      <label for="timecodeOutput">Timecode Format</label>
      <div class="relative">
        <div id="timecodeOutput" class="ffmpeg-output min-h-[4rem] flex items-center font-mono text-xl pr-12">
          00:00:00.000
        </div>
        <button id="copyTimecode" class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-teal-400 transition-colors p-2 rounded hover:bg-zinc-700/50" aria-label="Copy timecode">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy-icon lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
        </button>
      </div>
      <p class="field-hint">Standard HH:MM:SS.mmm format for video editors</p>
      <span id="copyTimecodeStatus" class="ffmpeg-copy-status">Copied!</span>
    </div>
    <div class="ffmpeg-field">
      <label for="secondsOutput">Decimal Seconds</label>
      <div class="relative">
        <div id="secondsOutput" class="ffmpeg-output min-h-[4rem] flex items-center font-mono text-xl pr-12">
          0.000
        </div>
        <button id="copySeconds" class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-teal-400 transition-colors p-2 rounded hover:bg-zinc-700/50" aria-label="Copy seconds">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy-icon lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
        </button>
      </div>
      <p class="field-hint">Decimal format for FFmpeg -t duration parameter</p>
      <span id="copySecondsStatus" class="ffmpeg-copy-status">Copied!</span>
    </div>
  </div>
</section>

<!-- Usage Notes -->
<div class="mt-8 p-6 bg-zinc-800 rounded-lg border border-zinc-700">
  <h3 class="text-lg font-semibold text-white mb-3">Usage Notes</h3>
  <ul class="text-zinc-300 space-y-2">
    <li><strong>Accepted Formats:</strong> You can use colons (:) or semicolons (;) as separators</li>
    <li><strong>Hours format:</strong> HH:MM:SS.mmm (e.g., "1:23:45.678")</li>
    <li><strong>Minutes format:</strong> MM:SS.mmm (e.g., "23:45.678")</li>
    <li><strong>Seconds format:</strong> SS.mmm (e.g., "45.678")</li>
    <li><strong>Real-time calculation:</strong> Results update as you type</li>
    <li><strong>Precision:</strong> Calculations maintain full precision (displayed to 3 decimal places)</li>
  </ul>
</div>
