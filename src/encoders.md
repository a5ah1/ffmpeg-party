---
layout: page.liquid
title: Encoder Generator
description: Build ffmpeg encoding commands with ease
---

<div class="not-prose">
  <!-- Input Section -->
  <section class="mb-12">
    <h2 class="text-2xl font-bold text-white mb-6">Input Configuration</h2>
    <div class="bg-zinc-800 p-6 rounded-lg border border-zinc-700 space-y-4">
      <div>
        <label for="input-file" class="block text-sm font-medium text-zinc-300 mb-2">
          Input File
        </label>
        <input
          type="text"
          id="input-file"
          placeholder="input.mp4"
          class="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>
    </div>
  </section>

  <!-- Encoder Options -->
  <section class="mb-12">
    <h2 class="text-2xl font-bold text-white mb-6">Encoder Options</h2>
    <div class="bg-zinc-800 p-6 rounded-lg border border-zinc-700 space-y-6">
      <!-- Video Codec -->
      <div>
        <label for="video-codec" class="block text-sm font-medium text-zinc-300 mb-2">
          Video Codec
        </label>
        <select
          id="video-codec"
          class="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="libx264">H.264 (libx264)</option>
          <option value="libx265">H.265/HEVC (libx265)</option>
          <option value="libvpx-vp9">VP9 (libvpx-vp9)</option>
          <option value="libaom-av1">AV1 (libaom-av1)</option>
          <option value="copy">Copy (no re-encoding)</option>
        </select>
        <p class="text-sm text-zinc-500 mt-2">
          Choose the video codec for encoding. H.264 offers best compatibility, H.265 better compression.
        </p>
      </div>

      <!-- Audio Codec -->
      <div>
        <label for="audio-codec" class="block text-sm font-medium text-zinc-300 mb-2">
          Audio Codec
        </label>
        <select
          id="audio-codec"
          class="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="aac">AAC</option>
          <option value="libmp3lame">MP3</option>
          <option value="libopus">Opus</option>
          <option value="libvorbis">Vorbis</option>
          <option value="copy">Copy (no re-encoding)</option>
        </select>
      </div>

      <!-- Quality/Bitrate -->
      <div>
        <label for="quality" class="block text-sm font-medium text-zinc-300 mb-2">
          Quality (CRF)
        </label>
        <input
          type="range"
          id="quality"
          min="0"
          max="51"
          value="23"
          class="w-full"
        />
        <div class="flex justify-between text-sm text-zinc-500 mt-1">
          <span>Better quality (0)</span>
          <span id="quality-value" class="text-teal-400">23</span>
          <span>Smaller file (51)</span>
        </div>
        <p class="text-sm text-zinc-500 mt-2">
          Lower values = better quality and larger files. 18-28 is typical range.
        </p>
      </div>
    </div>
  </section>

  <!-- Output Section -->
  <section class="mb-12">
    <h2 class="text-2xl font-bold text-white mb-6">Output Configuration</h2>
    <div class="bg-zinc-800 p-6 rounded-lg border border-zinc-700 space-y-4">
      <div>
        <label for="output-file" class="block text-sm font-medium text-zinc-300 mb-2">
          Output File
        </label>
        <input
          type="text"
          id="output-file"
          placeholder="output.mp4"
          class="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>
    </div>
  </section>

  <!-- Generated Command -->
  <section class="mb-12">
    <h2 class="text-2xl font-bold text-white mb-6">Generated Command</h2>
    <div class="bg-zinc-900 p-6 rounded-lg border border-zinc-700">
      <div class="flex justify-between items-center mb-4">
        <span class="text-sm text-zinc-400">Copy and paste this command:</span>
        <button
          id="copy-button"
          class="bg-teal-500 hover:bg-teal-600 text-white text-sm px-4 py-2 rounded transition-colors"
        >
          Copy
        </button>
      </div>
      <pre class="bg-black p-4 rounded overflow-x-auto"><code id="command-output" class="text-teal-400 text-sm">ffmpeg -i input.mp4 -c:v libx264 -crf 23 -c:a aac output.mp4</code></pre>
    </div>
  </section>
</div>

<script src="/js/encoder-generator.js"></script>
