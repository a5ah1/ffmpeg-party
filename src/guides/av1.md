---
layout: guide.liquid
title: AV1 Encoder Guide
description: FFmpeg parameters and quality settings for AV1 video encoding with SVT-AV1
permalink: /guides/av1/
---

## Overview

This guide provides opinionated recommendations for AV1 video encoding using the SVT-AV1 encoder in FFmpeg. AV1 offers significantly better compression than older codecs, making it ideal for reducing file sizes while maintaining quality. These settings prioritize visual quality and are suitable for most live-action content.

**Note:** Like any encoding guide, these are opinionated recommendations. Your specific content and use case may benefit from different settings.

## Recommended Parameters

The following command uses SVT-AV1 with recommended parameters optimized for perceptual quality. The keyframe interval is set to 10 seconds using time-based notation:

```bash
-c:v libsvtav1 -crf 30 -preset 6 -svtav1-params keyint=10s:tune=0:enable-overlays=1:scd=1:scm=0
```

**Why time-based keyframes?** Using `keyint=10s` automatically adjusts for any frame rate, ensuring consistent 10-second intervals between keyframes regardless of whether your video is 24fps, 30fps, 60fps, etc. This is more robust than frame-based intervals and ideal for streaming and archival workflows.

## Quality Settings (CRF Values)

The SVT-AV1 encoder uses **Constant Rate Factor (CRF)** mode to maintain perceptual quality by dynamically allocating bitrate per frame. SVT-AV1 offers 2–5× faster encoding than libaom-AV1 with solid compression efficiency.

### CRF Scale

- **Range**: 0 to 63, where lower values mean higher quality (larger files) and higher values mean lower quality (smaller files)
- **Default**: 30 provides a balanced starting point for most content
- **Compared to other codecs**: SVT-AV1 CRF 30 ≈ x265 CRF 21 ≈ x264 CRF 16
- A change of ±6 in CRF typically halves or doubles the bitrate

### Recommended CRF by Purpose and Resolution

These recommendations assume preset 6. Faster presets (8+) may require lowering CRF by 2–4 points for equivalent quality; slower presets (0–4) can use slightly higher CRF.

| Purpose/Use Case | CRF Range | Typical Resolution | Notes |
|------------------|-----------|-------------------|-------|
| **High-Quality Archival** | 18–24 | Any (1080p–8K) | Near-transparent preservation. Use preset 0–4 for critical sources. 30–50% smaller than x265 at equivalent quality |
| **Visually Transparent** | 22–28 | 720p–4K | Indistinguishable from source. CRF 24–26 with preset 4–6 recommended for film content |
| **General/Balanced** | 25–32 | 1080p–4K | Everyday use; CRF 28–30 with preset 6 is versatile for Blu-ray rips and personal libraries |
| **Efficient Compression** | 28–35 | 1080p–8K | Storage/streaming focus. Good balance for 4K content without visible loss |
| **Low-Bitrate/Streaming** | 32–40 | 480p–1080p | Bandwidth-limited scenarios. Avoid >38 on motion-heavy content to prevent blocking |

### Resolution-Specific Guidelines

- **Standard Definition (480p/576p)**: CRF 22–28
- **720p HD**: CRF 24–30, with 26 for balanced streaming
- **1080p Full HD**: CRF 25–32, most tested range
- **4K UHD (2160p)**: CRF 26–35, leveraging AV1's efficiency

**Recommended baseline:** CRF 30 is a good starting point for general use. For high-quality or archival encodes, use CRF 24–26. Always test a short clip before encoding your full video.

## Essential SVT-AV1 Parameters

These parameters optimize encoding for visual quality and compression efficiency:

- **Keyframe interval** (`keyint=10s`) - Sets maximum distance between keyframes. Time-based values (e.g., `10s`) automatically adjust for any frame rate, ensuring consistent seeking intervals
- **Tune** (`tune=0`) - Prioritizes perceptual/visual quality through adjusted reference frame filtering and scene detection bias
- **Enable overlays** (`enable-overlays=1`) - Activates detail-preserving overlay frames for alt-ref prediction, improving quality
- **Scene change detection** (`scd=1`) - Increases intra frame insertion at scene changes for better seeking and quality
- **Screen content mode** (`scm=0`) - Disabled for live-action content; use `scm=2` for mixed content or `scm=1` for screen recordings

## Preset Selection and Quality Impact

SVT-AV1 uses **presets** (0–13) to balance encoding speed against compression efficiency and quality. **Important:** At a fixed CRF, slower presets produce better quality and smaller files due to improved rate-distortion optimization.

| Preset Range | Speed | Quality at Fixed CRF | Typical Use Case |
|--------------|-------|---------------------|------------------|
| **0–2** | Very Slow (1–5× real-time) | Highest quality, smallest files | Archival/offline mastering. High memory usage |
| **3–5** | Slow (5–10× real-time) | Very high quality | High-quality production, 4K/HDR content |
| **6–8** | Medium (10–30× real-time) | High quality | **Recommended default (preset 6)** for balanced encoding |
| **9–11** | Fast (30–60× real-time) | Medium quality | Streaming, quick turnarounds. Lower CRF by 2–3 for quality parity |
| **12–13** | Very Fast (60×+ real-time) | Lower quality | Live/real-time encoding. Lower CRF by 3–5 for quality parity |

**Key takeaway:** Slower presets at the same CRF yield 5–15% better quality (VMAF) and smaller files. If you need faster encoding, increase the preset number and compensate by lowering the CRF value.

## Content-Specific Recommendations

### Live-Action (Default)
Use the parameters shown at the top with `scm=0` or omit the scm parameter entirely.

### Anime/Animation
For anime content, you can remove the `scm` parameter from the command:

```bash
-c:v libsvtav1 -crf 30 -preset 6 -svtav1-params keyint=10s:tune=0:enable-overlays=1:scd=1
```

### Screen Content
For screencasts, presentations, or content with sharp text:

```bash
-c:v libsvtav1 -crf 30 -preset 6 -svtav1-params keyint=10s:tune=0:enable-overlays=1:scd=1:scm=2
```

Use `scm=1` for screen-only content with no video elements.

## Complete Example Command

Here's a complete FFmpeg command for encoding live-action content with AV1:

```bash
ffmpeg -i input.mp4 \
  -c:v libsvtav1 \
  -crf 30 \
  -preset 6 \
  -svtav1-params keyint=10s:tune=0:enable-overlays=1:scd=1:scm=0 \
  -c:a libopus -b:a 128k \
  output.mkv
```

**Audio recommendations:** Use Opus audio codec (`libopus`) for WebM/MKV containers, or AAC (`aac`) for MP4 containers.

## Notes

- AV1 encoding is significantly slower than x264/x265 but produces much smaller files for equivalent quality (often 30–50% reduction)
- The SVT-AV1 encoder (libsvtav1) is recommended over libaom-AV1 for 2–5× faster encoding with solid quality
- Container format matters: Use MKV or WebM for maximum compatibility; MP4 support is improving but may require specific players
- All parameters including `keyint` are colon-separated within the `-svtav1-params` option
- Using time-based `keyint` values (e.g., `keyint=10s`) is preferred over frame-based values for consistency across different frame rates
- Slower presets at the same CRF produce better quality and smaller files—compensate for faster presets by lowering CRF

## References

1. [SVT-AV1 Common Questions](https://gitlab.com/AOMediaCodec/SVT-AV1/-/blob/master/Docs/CommonQuestions.md)
2. [SVT-AV1 Parameters Documentation](https://gitlab.com/AOMediaCodec/SVT-AV1/-/blob/master/Docs/Parameters.md)
3. [FFmpeg AV1 Encoding Guide](https://trac.ffmpeg.org/wiki/Encode/AV1)
4. [BlueSwordM's AV1 Encoding Guide](https://gist.github.com/BlueSwordM/86dfcb6ab38a93a524472a0cbe4c4100)
