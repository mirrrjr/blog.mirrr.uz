---
id: obs-studio-setup-en
title: Universal OBS Studio Setup for Any Laptop or PC (Video and Audio)
date: 2026-10-06
author: MIRRR jr.
readingTime: 7
tags: [obs, obs-studio, recording, audio, noise-suppression]
excerpt: Universal video, encoder and microphone filter settings for high-quality screen recording in OBS Studio
---

Two problems come up all the time when recording your screen with OBS Studio: the video is either heavy or blurry, and the microphone picks up background noise and a constant hum. Below is the setup I use on my own laptop, plus notes on what to change for other machines.

## My machine

- OS: Debian (GNOME)
- GPU: NVIDIA (which is why I use the NVENC encoder)
- Screen: 1366×768
- Microphones: the laptop's built-in mic and a headset mic

## 1. The overall profile

| Setting              | Value              |
| -------------------- | ------------------ |
| Canvas (Base)        | 1366×768           |
| Output (Scaled)      | 1920×1080          |
| FPS                  | 30                 |
| Downscale Filter     | Lanczos            |
| Encoder              | NVIDIA NVENC H.264 |
| Rate Control         | CQP                |
| CQ Level             | 20                 |
| Keyframe Interval    | 2                  |
| Preset               | Quality            |
| Profile              | High               |
| Look-ahead           | Off                |
| Psycho Visual Tuning | Off                |
| B-frames             | 2                  |
| Recording Format     | MKV                |
| Audio                | 48 kHz / 192 Kbps  |

## 2. Video settings

`Settings → Video`

```text
Base (Canvas) Resolution:   1366×768
Output (Scaled) Resolution: 1920×1080
Downscale Filter:           Lanczos
Common FPS Values:          30
```

My laptop's screen is 1366×768, so the canvas stays at that value. If your screen is different, set the canvas to match your own screen resolution. Output at 1920×1080 saves the video in Full HD. The **Lanczos** filter keeps text and thin lines sharper when scaling up, which matters a lot for coding tutorials.

## 3. Recording and encoder settings

`Settings → Output → Output Mode: Advanced → Recording`

```text
Type:                 Standard
Recording Format:     MKV
Encoder:              NVIDIA NVENC H.264
Rate Control:         CQP
CQ Level:             20
Keyframe Interval:    2 s
Preset:               Quality
Profile:              High
Look-ahead:           Off
Psycho Visual Tuning: Off
B-frames:             2
```

Why these values:

- **CQP** keeps the quality constant. The file stays small when little is moving on screen and grows only when needed.
- **CQ 20** is a good balance between quality and file size.
- **Look-ahead** and **Psycho Visual Tuning** are off because they add extra GPU load. Turning them off helps avoid dropped frames on my laptop.
- **MKV** keeps your recording safe if the PC shuts down or OBS crashes. With MP4 the file can end up corrupted.
- **Keyframe 2** lets video editors seek quickly through the footage.

> To convert MKV to MP4 afterwards: `File → Remux Recordings`. It does not re-encode, so there is no quality loss.

## 4. Audio settings

`Settings → Audio`

```text
Sample Rate: 48 kHz
```

`Settings → Output → Audio`

```text
Audio Track 1 Bitrate: 192 Kbps
```

48 kHz is the standard sample rate for video, and 192 Kbps is plenty for speech and music.

## 5. Microphone: removing background noise and hum

My laptop's built-in mic captures my voice together with heavy background noise. The headset mic is cleaner, but a low hum remains. The problem is not OBS itself but noise getting into the mic signal, and filters can reduce it a lot.

`Audio Mixer → Mic/Aux → ⚙️ → Filters → +`

### 5.1. Noise Suppression

```text
Method: RNNoise
```

Very effective against constant background noise. Add this one first.

### 5.2. Expander

```text
Ratio:       3:1
Threshold:   -40 dB
Attack:      5 ms
Release:     100 ms
Output Gain: 0 dB
```

Lowers the mic while you are not speaking, so the noise between sentences drops too.

### 5.3. Compressor

```text
Ratio:       3:1
Threshold:   -18 dB
Attack:      6 ms
Release:     60 ms
Output Gain: 0 dB
```

Evens out your volume, so the gap between quiet and loud parts of your speech gets smaller.

### 5.4. Limiter

```text
Threshold: -1 dB
Release:   60 ms
```

Prevents clipping (crackling distortion) when you suddenly get loud.

### Filter order

The order matters. From top to bottom:

```text
Mic/Aux
   ↓
Noise Suppression
   ↓
Expander
   ↓
Compressor
   ↓
Limiter
```

## 6. If you have a powerful computer

The values above are chosen to fit my laptop's capabilities. If your machine is more powerful (a modern NVIDIA GPU, enough RAM and a fast SSD), you can raise them:

| Setting              | Default   | For powerful PCs                                   |
| -------------------- | --------- | -------------------------------------------------- |
| FPS                  | 30        | 60                                                 |
| Output               | 1920×1080 | 2560×1440 or 3840×2160                             |
| CQ Level             | 20        | 16-18 (lower number = higher quality, bigger file) |
| Look-ahead           | Off       | On                                                 |
| Psycho Visual Tuning | Off       | On                                                 |
| Audio bitrate        | 192 Kbps  | 256-320 Kbps                                       |

Note: higher values put more load on the GPU and disk and produce larger files. After changing them, make a 1-2 minute test recording and check that no frames are dropped (watch `Dropped Frames` and the CPU/GPU indicators at the bottom of OBS).

## 7. If you don't have an NVIDIA GPU

NVENC only works on NVIDIA graphics cards, and that is what I use. If yours is different, pick the matching option in the `Encoder` list:

- **AMD or Intel (Linux)**: VAAPI H.264
- **AMD (Windows)**: AMD HW H.264 (AMF)
- **Intel (Windows)**: QuickSync H.264
- **No dedicated GPU or an old PC**: x264 (CPU-based, uses more processor power)

Everything else (canvas/output, FPS, MKV, audio filters) stays the same.

## Summary

With this setup I get Full HD, 30 FPS recordings with clean audio and reasonable file sizes. Start with this profile, and if your computer handles it comfortably, raise the values from section 6 step by step.
