---
description: Cấu trúc file, CONFIG object chuẩn, frames pipeline, quy cách asset
---

# Cấu trúc File & Config

## Cây thư mục (hiện tại — dự án campus)

```
HiepD5.com/
├── index.html
├── style.css
├── main.js
├── assets/
│   ├── images/
│   │   ├── scene-01.jpg          ← Toàn cảnh ngoại thất (wide)
│   │   ├── scene-02.jpg          ← Sân vận động (medium exterior)
│   │   ├── scene-03.jpg          ← Arcade vòm (interior)
│   │   ├── scene-04.jpg          ← Atrium đa tầng (deep interior)
│   │   ├── scene-05.jpg          ← Walkway tầng cao (elevated exterior)
│   │   ├── scene-alt-ext-dusk.jpg  ← backup (dusk exterior)
│   ├── transitions/
│   │   ├── t-01-02.mp4  t-02-03.mp4  t-03-04.mp4  t-04-05.mp4  t-05-01.mp4
│   └── frames/
│       ├── t-01-02/  0001.jpg … 0152.jpg   (152 frames)
│       ├── t-02-03/  0001.jpg … 0122.jpg   (122 frames)
│       ├── t-03-04/  0001.jpg … 0122.jpg   (122 frames)
│       ├── t-04-05/  0001.jpg … 0122.jpg   (122 frames)
│       └── t-05-01/  0001.jpg … 0152.jpg   (152 frames)
└── video_frames/   ← frame extract video tham khảo (phân tích xong, không dùng nữa)
```

**N ảnh → N clip transition (loop: scene cuối → scene đầu).**

## Quy cách ảnh tĩnh

| Thông số | Yêu cầu |
|----------|---------|
| Độ phân giải | **3840×2160** (4K) — zoom cần pixel dư |
| Format | JPG quality 90 |
| Tên file | `scene-01.jpg` → `scene-NN.jpg` |
| Focal point | Exit point ảnh A khớp entry point ảnh B |

## Pipeline tạo transition (bắt buộc theo thứ tự)

```bash
# 1. Encode all-keyframe
ffmpeg -i raw.mp4 -g 1 -crf 20 -preset fast assets/transitions/t-NN-MM.mp4

# 2. Extract frames 720p
mkdir assets/frames/t-NN-MM
ffmpeg -i assets/transitions/t-NN-MM.mp4 -vf scale=1280:720 -q:v 3 assets/frames/t-NN-MM/%04d.jpg

# 3. Đếm frames
ls assets/frames/t-NN-MM/ | wc -l

# 4. Update count trong CONFIG.scenes[]
{ type: 'frames', dir: 'assets/frames/t-NN-MM/', count: XX }
```

**AI tools tạo clip:** Kling AI (Image-to-Image, tốt nhất), Runway Gen-3, Luma Dream Machine  
**Thời lượng clip:** 3–5s raw → trim nếu cần → extract frames  
**Frames extract:** 720p JPG quality 3 (~120–160KB/frame)

## CONFIG object — pattern hiện tại

```javascript
const CONFIG = {
  lerpFactor:        0.055,
  scrollSensitivity: 1.0,
  SCENE_WIDTH:       1000,  // virtual px — ảnh tĩnh
  TRANS_WIDTH:        700,  // virtual px — frames transition (lớn = điều khiển từng frame)
  CROSSFADE:           80,

  scenes: [
    { type:'image', src:'assets/images/scene-01.jpg',
      zoom:{from:1.0, to:1.12}, pan:{fromX:2,fromY:-1, toX:-2,toY:1},
      fog:true,
      title:'CAMPUS', subtitle:'TOÀN CẢNH',
      code:'SC-01', codeLabel:'TỔNG THỂ',
      specs:['Loại công trình: Trường học','Diện tích: —','Địa điểm: —','Chủ đầu tư: —'],
      cta:'Xem chi tiết', showSocial:true },

    { type:'frames', dir:'assets/frames/t-01-02/', count:152 },

    // ... image scenes + frames transitions xen kẽ ...

    { type:'frames', dir:'assets/frames/t-05-01/', count:152 },
    // ↑ transition cuối loop về scene-01
  ],

  owner: { name:'Vương Đắc Hiệp', phone:'0979 591 156', ... }
};
```

## Tinh chỉnh tốc độ

| Muốn | Thay đổi |
|------|---------|
| Transition nhanh hơn | Giảm `TRANS_WIDTH` xuống 400–500 |
| Transition chậm hơn / điều khiển tốt hơn | Tăng `TRANS_WIDTH` lên 900–1200 |
| Ảnh tĩnh lâu hơn | Tăng `SCENE_WIDTH` lên 1200–1500 |

## Thêm scene mới

1. Đặt ảnh → `assets/images/scene-NN.jpg`
2. Tạo clip AI → encode → extract frames → `assets/frames/t-NN-MM/`
3. Thêm `{type:'image',...}` và `{type:'frames', dir:..., count:XX}` vào `CONFIG.scenes[]`
4. Đảm bảo transition cuối vẫn loop về scene-01
5. Reload là xong
