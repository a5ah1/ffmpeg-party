---
layout: page.liquid
title: About ffmpeg.party
description: A personal project providing opinionated FFmpeg tools and guides
---

## What is ffmpeg.party?

ffmpeg.party is a personal project created by one person - a collection of tools and guides for FFmpeg that started as personal notes on video encoding and evolved into something I thought might be useful to share.

If you're looking for comprehensive documentation that covers every possible FFmpeg option, the [official FFmpeg documentation](https://ffmpeg.org/documentation.html) is the place to go. This site is more opinionated: I provide the tools and settings I think are useful, not an exhaustive catalog of every possibility.

## Philosophy

Video encoding is full of different approaches and preferences. Rather than pretend there's one "correct" way to do things, this site provides opinionated recommendations based on what I've found works well.

**Limited Options by Design** - The tools here don't expose every possible FFmpeg parameter because that would be exhausting. Instead, they focus on what I consider essential options. If you need more control, you're better off learning FFmpeg's command-line syntax directly.

**Valid Commands, Not Hand-Holding** - The tools are designed to generate valid FFmpeg commands, but they assume you have some basic familiarity with video encoding concepts. You're expected to understand what you're doing rather than being guided through every step.

**Personal Preferences** - The guides and recommendations reflect my own research and preferences. Your needs may differ, and that's fine. Use what's helpful, ignore what isn't.

## Available Tools

### Encoders & Generators

- **VP9 Wizard** - VP9 command generator for high-quality videos using 2-pass encoding
- **AV1 Wizard** - AV1 command generator with SVT-AV1 encoder and optimized parameters
- **x264 Wizard** - x264 command generator for H.264/AVC encoding with optimized settings
- **x265 Wizard** - x265 command generator for H.265/HEVC encoding with superior compression

### Utilities

- **Duration Calculator** - Calculate durations between timestamps for FFmpeg commands
- **WebM from Image Sequence** - Convert image sequences to WebM videos (legacy tool)

### Guides

- **x264 Encoder Guide** - Comprehensive guide for H.264/AVC encoding
- **x265 Encoder Guide** - Complete reference for H.265/HEVC encoding

## How to Use This Site

Pick a tool or guide, fill in the form, copy the generated command, and run it. Your inputs are saved in your browser's session storage for convenience, but there's no account system or cloud storage - everything stays local.

## What's Included

- **Session Persistence** - Form inputs are saved locally so you can revisit later
- **Copy to Clipboard** - Quick copying of generated commands
- **Dark Mode** - Permanent dark interface (because it's objectively better)
- **Mobile Friendly** - Works on phones and tablets

## Technical Details

Built with Eleventy (11ty) and Tailwind CSS v4. Plain JavaScript, no heavy frameworks. Hosted as a static site because it's simple and fast.

## Disclaimer

This site is not affiliated with the FFmpeg project. It's an independent resource. All FFmpeg trademarks and copyrights belong to their respective owners.

For official FFmpeg documentation and resources, visit [ffmpeg.org](https://ffmpeg.org/).
