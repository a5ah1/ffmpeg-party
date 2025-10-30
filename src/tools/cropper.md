---
layout: page.liquid
title: Cropper
description: Visual tool for creating FFmpeg crop filters
---

# Visual FFmpeg Crop Filter Generator

An interactive tool for visually creating FFmpeg crop filters. Load an image, drag to adjust the crop region, and get the exact `crop` filter parameters you need.

<div class="my-8">
  <a href="/tools/cropper/app/" target="_blank" rel="noopener noreferrer" class="tool-launch-button">
    Launch Cropper (Opens in New Tab)
  </a>
</div>

<div class="bg-zinc-900 border border-zinc-700 rounded-lg p-4 my-6">
  <p class="text-sm text-zinc-300 !mb-0">
    <strong>Note:</strong> The cropper opens in a new tab and uses a full-screen interface optimized for desktop use. It works best on larger screens.
  </p>
</div>

## Features

- **Visual Interface**: See exactly what you're cropping
- **Drag to Adjust**: Click and drag the crop region to reposition
- **Precise Controls**: Set exact dimensions and offsets with pixel-level accuracy
- **Step Alignment**: Align crop dimensions to common values (2, 4, 8, 16, 32, 64 pixels) for codec compatibility
- **Customizable Mask**: Adjust mask color and opacity to suit your needs
- **One-Click Copy**: Copy the generated filter to your clipboard instantly

## How to Use

1. **Launch the Cropper** using the button at the top of the page
2. **Load an Image**: Drag and drop a frame from your video (or any image)
3. **Adjust the Crop Region**:
   - Use the width/height inputs to set dimensions
   - Use the X/Y inputs to set position
   - Or click and drag the crop rectangle directly
4. **Set Step Size**: Choose alignment (useful for codec requirements)
5. **Copy the Filter**: Click "Copy to Clipboard" to get your `crop` filter

## About the Crop Filter

The FFmpeg `crop` filter removes unwanted portions of video. The basic syntax is:

```
crop=w=WIDTH:h=HEIGHT:x=X_OFFSET:y=Y_OFFSET
```

Where:
- `w` = width of the output (cropped) video
- `h` = height of the output (cropped) video
- `x` = horizontal offset from the left edge
- `y` = vertical offset from the top edge

### Example Usage

```bash
ffmpeg -i input.mp4 -vf "crop=w=1920:h=800:x=0:y=140" output.mp4
```

This crops the video to 1920×800, removing 140 pixels from the top.

### Why Step Alignment Matters

Many video codecs work more efficiently when dimensions are divisible by certain values (typically 2, 8, or 16). Using the step alignment feature ensures your crop dimensions meet these requirements, which can:

- Improve encoding efficiency
- Prevent compatibility issues with some players
- Avoid codec warnings or errors

## Tips

- **Get a Frame First**: Use FFmpeg to extract a frame from your video to load into the cropper:
  ```bash
  ffmpeg -i input.mp4 -ss 00:01:00 -frames:v 1 frame.png
  ```
- **Check Aspect Ratio**: Make sure your crop maintains the aspect ratio you want
- **Test Your Filter**: Always test the generated filter on a short clip before processing your full video
- **Mind the Borders**: Ensure the crop region doesn't include black bars or unwanted edges
