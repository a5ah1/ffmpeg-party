---
layout: base.liquid
title: Anamorphic Crop Calculator
description: Calculator for cropping anamorphic video with proper aspect ratio adjustments
customCSS: anamorphic-crop.css
customJS: anamorphic-crop.js
---

<link rel="stylesheet" href="/css/anamorphic-crop.css">

<figure id="stage" class="stage">
  <div id="frame" class="frame">
    <div id="mask" class="mask"></div>
  </div>

  <div id="overflow-warning" class="overflow-warning">
    Over the line!
  </div>
</figure>

<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12 mb-48">
  <header class="mb-8">
    <h1 class="text-3xl font-bold text-zinc-100 mb-2">FFmpeg Anamorphic Crop Calculator</h1>
    <p class="text-zinc-400">Calculate proper crop dimensions for anamorphic video (720×540) with 4:3 aspect ratio and 8/9 vertical squeeze adjustment.</p>
  </header>

  <div class="bg-zinc-900 border border-zinc-700 rounded-lg p-4 mb-6">
    <p class="text-sm text-zinc-300">
      <strong class="text-teal-400">Note:</strong> This tool is specifically designed for 720×540 anamorphic video. The image you upload must be exactly 720×540 pixels.
    </p>
  </div>

  <form id="form" class="space-y-8">
    <!-- Form Inputs -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <!-- Drop Zone -->
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-2">Image file:</label>
        <div id="dropZone" class="drop-zone">
          <input id="pic" type="file" accept="image/*" class="hidden">
          <div class="drop-zone-content">
            <svg class="w-8 h-8 text-zinc-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
            <p class="text-sm text-zinc-400">Drop image or click to browse</p>
            <p class="text-xs text-zinc-500 mt-1">720×540 pixels required</p>
          </div>
          <div class="drop-zone-filename hidden">
            <p class="text-sm text-teal-400 truncate"></p>
          </div>
        </div>
      </div>
      <!-- Width -->
      <div>
        <label for="width" class="block text-sm font-medium text-zinc-300 mb-2">Width:</label>
        <input id="width" type="number" class="block w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-zinc-100 text-sm font-mono focus:outline-none focus:border-teal-500" min="2">
      </div>
      <!-- X Offset -->
      <div>
        <label for="xOffset" class="block text-sm font-medium text-zinc-300 mb-2">X offset:</label>
        <input id="xOffset" type="number" class="block w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-zinc-100 text-sm font-mono focus:outline-none focus:border-teal-500" placeholder="0" min="0">
      </div>
      <!-- Y Offset -->
      <div>
        <label for="yOffset" class="block text-sm font-medium text-zinc-300 mb-2">Y offset:</label>
        <input id="yOffset" type="number" class="block w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-zinc-100 text-sm font-mono focus:outline-none focus:border-teal-500" placeholder="0" min="0">
      </div>
    </div>

    <!-- Form Output -->
    <div class="space-y-6">
      <!-- Calculations -->
      <div>
        <label class="block text-sm font-medium text-zinc-300 mb-3">Calculations:</label>
        <div class="ml-4 space-y-1 font-mono text-sm text-zinc-200">
          <p>Image size: <span id="imageWidth" class="font-bold text-teal-400"></span> × <span id="imageHeight" class="font-bold text-teal-400"></span></p>
          <p>Crop width: <span id="cropWidth" class="font-bold text-teal-400"></span></p>
          <p>Crop height: <span id="cropHeight" class="font-bold text-teal-400"></span> <span class="text-zinc-500">= crop width × 3/4</span></p>
          <p>Adjusted height: <span id="adjustedHeight" class="font-bold text-teal-400"></span> <span class="text-zinc-500">= crop height × 8/9</span></p>
          <p>Adjusted Y offset: <span id="adjustedYOffset" class="font-bold text-teal-400"></span> <span class="text-zinc-500">= Y offset × 8/9</span></p>
        </div>
      </div>

      <!-- Crop Filter Output -->
      <div>
        <label for="output" class="block text-sm font-medium text-zinc-300 mb-2">Crop filter:</label>
        <output id="output" class="block w-full px-6 py-4 bg-zinc-800 border border-zinc-700 rounded text-zinc-100 font-mono text-sm select-all"></output>
      </div>

      <!-- Full Filter Output -->
      <div>
        <label for="output2" class="block text-sm font-medium text-zinc-300 mb-2">Likely full filter:</label>
        <output id="output2" class="block w-full px-6 py-4 bg-zinc-800 border border-zinc-700 rounded text-zinc-100 font-mono text-sm select-all whitespace-pre-wrap break-all"></output>
      </div>
    </div>
  </form>

  <!-- About Section -->
  <section id="about" class="mt-16 pt-8 border-t border-zinc-800">
    <header class="mb-6">
      <h2 class="text-2xl font-bold text-zinc-100">About</h2>
    </header>

    <div class="prose prose-invert prose-zinc max-w-none">
      <h3 class="text-xl font-semibold text-zinc-200 mt-6 mb-3">What is this?</h3>
      <p class="text-zinc-300 leading-relaxed mb-4">
        This is a specialized calculator for cropping anamorphic video content. Anamorphic video uses non-square pixels, which means the stored dimensions differ from the display dimensions. This tool helps you calculate the correct crop parameters while accounting for the pixel aspect ratio.
      </p>

      <h3 class="text-xl font-semibold text-zinc-200 mt-6 mb-3">How to use:</h3>
      <ol class="list-decimal list-inside text-zinc-300 space-y-2 mb-4">
        <li>Extract a frame from your 720×540 anamorphic video</li>
        <li>Load the frame using the "Image file" input</li>
        <li>Enter your desired crop width</li>
        <li>Adjust X and Y offsets to position the crop region</li>
        <li>The calculator will show you the proper crop filter with aspect ratio adjustments applied</li>
        <li>Copy the generated filter and use it in your FFmpeg command</li>
      </ol>

      <h3 class="text-xl font-semibold text-zinc-200 mt-6 mb-3">Background:</h3>
      <p class="text-zinc-300 leading-relaxed mb-4">
        Anamorphic video (particularly in NTSC DV format) is stored at 720×480 or 720×540 pixels but displays at 4:3 (640×480) or 16:9 (854×480) depending on the pixel aspect ratio. When cropping this content, you need to account for the vertical squeeze factor.
      </p>
      <p class="text-zinc-300 leading-relaxed mb-4">
        This tool uses an 8/9 vertical squeeze adjustment, which is appropriate for 4:3 DV content. The crop height is calculated as width × 3/4 to maintain a 4:3 aspect ratio, then multiplied by 8/9 to account for the anamorphic encoding.
      </p>
      <p class="text-zinc-300 leading-relaxed">
        The "likely full filter" output includes <code class="px-1.5 py-0.5 bg-zinc-800 text-teal-400 rounded text-xs">bwdif</code> deinterlacing (common for DV footage), the crop filter with adjustments, scaling back to 720×540, and setting the pixel aspect ratio to square (1:1) with <code class="px-1.5 py-0.5 bg-zinc-800 text-teal-400 rounded text-xs">setsar=1</code>.
      </p>
    </div>
  </section>
</main>

<script src="/js/anamorphic-crop.js"></script>
