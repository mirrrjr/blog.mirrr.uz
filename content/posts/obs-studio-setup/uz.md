---
id: obs-studio-setup-uz
title: OBS Studio'ni har qanday kompyuter uchun sozlash (video va audio)
date: 2026-10-06
author: MIRRR jr.
readingTime: 7
tags: [obs, obs-studio, recording, audio, noise-suppression]
excerpt: OBS Studio'da sifatli ekran yozish uchun universal video, encoder va mikrofon filtrlari sozlamalari
---

OBS Studio'da ekranni yozib olayotganda ikkita muammo tez-tez uchraydi: video og'ir yoki xira chiqadi, mikrofon ovozida esa fon shovqini va g'ing'illash bo'ladi. Quyida men o'z laptopimda ishlatadigan sozlamalar keltirilgan. Boshqa kompyuterlar uchun nimani o'zgartirish kerakligini ham yozib o'tdim.

## Mening kompyuterim

- OS: Debian (Sway)
- Videokarta: NVIDIA (shu sababli NVENC encoder ishlatiladi)
- Ekran: 1366×768
- Mikrofon: laptopning ichki mikrofoni va quloqchin mikrofoni

## 1. Umumiy profil

| Parametr             | Qiymat             |
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

## 2. Video sozlamalari

`Settings → Video`

```text
Base (Canvas) Resolution:  1366×768
Output (Scaled) Resolution: 1920×1080
Downscale Filter:           Lanczos
Common FPS Values:          30
```

Mening laptopimning ekrani 1366×768, shuning uchun Canvas shu qiymatda qoldirilgan. Sizda ekran boshqacha bo'lsa, Canvas'ni o'z ekraningiz o'lchamiga moslang. Output 1920×1080 bo'lgani sababli video Full HD formatida saqlanadi. **Lanczos** filtri kattalashtirish paytida matn va chiziqlarni aniqroq saqlaydi, bu dasturlash darslari uchun muhim.

## 3. Recording va encoder sozlamalari

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

Nima uchun aynan shunday:

- **CQP** doimiy sifatni ushlab turadi. Ekranda kam harakat bo'lsa fayl kichik, ko'p harakat bo'lsa kattaroq bo'ladi.
- **CQ 20** sifat va fayl hajmi o'rtasidagi yaxshi muvozanat.
- **Look-ahead** va **Psycho Visual Tuning** o'chiq turadi, chunki ular GPU'ni qo'shimcha yuklaydi. Mening laptopimda kadr tushib ketishining oldini oladi.
- **MKV** formati kompyuter o'chib qolsa yoki OBS qotib qolsa ham yozuvni saqlab qoladi. MP4'da bunday holatda fayl buzilishi mumkin.
- **Keyframe 2** montaj dasturlarida videoni tez surish (seek) imkonini beradi.

> MKV'ni keyin MP4'ga o'tkazish uchun: `File → Remux Recordings`. Qayta kodlanmaydi, sifat yo'qolmaydi.

## 4. Audio sozlamalari

`Settings → Audio`

```text
Sample Rate: 48 kHz
```

`Settings → Output → Audio`

```text
Audio Track 1 Bitrate: 192 Kbps
```

48 kHz video uchun standart chastota, 192 Kbps esa nutq va musiqa uchun yetarli sifat beradi.

## 5. Mikrofon: fon shovqini va g'ing'illashni yo'qotish

Mening laptopimning ichki mikrofoni ovozni kuchli fon shovqini bilan birga oladi. Quloqchin mikrofoni yaxshiroq, lekin unda ham past g'ing'illash qoladi. Muammo OBS'da emas, mikrofon signaliga qo'shilayotgan shovqinda, uni filtrlar bilan sezilarli kamaytirish mumkin.

`Audio Mixer → Mic/Aux → ⚙️ → Filters → +`

### 5.1. Noise Suppression

```text
Method: RNNoise
```

Doimiy fon shovqinini yaxshi kamaytiradi. Birinchi shuni qo'ying.

### 5.2. Expander

```text
Ratio:       3:1
Threshold:   -40 dB
Attack:      5 ms
Release:     100 ms
Output Gain: 0 dB
```

Siz gapirmayotgan paytda mikrofonni pasaytiradi, shuning uchun pauzalardagi fon shovqini ham kamayadi.

### 5.3. Compressor

```text
Ratio:       3:1
Threshold:   -18 dB
Attack:      6 ms
Release:     60 ms
Output Gain: 0 dB
```

Ovoz balandligini tekislaydi. Sekin gapirgan va birdan balandroq gapirgan joylar o'rtasidagi farq kamayadi.

### 5.4. Limiter

```text
Threshold: -1 dB
Release:   60 ms
```

Baqirib yuborganda yoki kuchli ovoz chiqqanda clipping (ovozning qirsillashi)ni oldini oladi.

### Filtrlar tartibi

Tartib muhim, yuqoridan pastga shunday bo'lishi kerak:

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

## 6. Kuchli kompyuter bo'lsa

Yuqoridagi qiymatlar mening laptopim imkoniyatiga qarab tanlangan. Agar kompyuteringiz kuchliroq bo'lsa (zamonaviy NVIDIA GPU, yetarli RAM va tez SSD), quyidagilarni oshirishingiz mumkin:

| Parametr             | Standart  | Kuchli kompyuter uchun                                 |
| -------------------- | --------- | ------------------------------------------------------ |
| FPS                  | 30        | 60                                                     |
| Output               | 1920×1080 | 2560×1440 yoki 3840×2160                               |
| CQ Level             | 20        | 16-18 (kichikroq son = yuqoriroq sifat, fayl kattaroq) |
| Look-ahead           | Off       | On                                                     |
| Psycho Visual Tuning | Off       | On                                                     |
| Audio bitrate        | 192 Kbps  | 256-320 Kbps                                           |

Eslatma: yuqori qiymatlar GPU, disk va fayl hajmiga yuklamani oshiradi. O'zgartirgandan keyin 1-2 daqiqalik test yozuv qilib, kadr tushib ketmayotganini tekshiring (OBS pastki qismidagi `Dropped Frames` va CPU/GPU ko'rsatkichlariga qarang).

## 7. NVIDIA videokarta bo'lmasa

NVENC faqat NVIDIA videokartalarida ishlaydi, men shuni ishlataman. Sizda boshqacha bo'lsa, `Encoder` ro'yxatidan o'zingizga mosini tanlang:

- **AMD yoki Intel (Linux)**: VAAPI H.264
- **AMD (Windows)**: AMD HW H.264 (AMF)
- **Intel (Windows)**: QuickSync H.264
- **Videokartasiz yoki eski kompyuter**: x264 (CPU orqali, processorni ko'proq yuklaydi)

Qolgan sozlamalar (Canvas/Output, FPS, MKV, audio filtrlar) o'zgarishsiz qoladi.

## Xulosa

Shu sozlamalar bilan men Full HD, 30 FPS, toza ovozli va hajmi me'yorida bo'lgan yozuvlar olaman. Avval shu profilda sinab ko'ring, kompyuteringiz bemalol ko'tarsa, 6-bo'limdagi qiymatlarni asta-sekin oshiring.
