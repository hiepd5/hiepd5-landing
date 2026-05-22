---
description: Kiến trúc hiện tại — full-screen, ảnh tĩnh + clip AI transition, layout Fall Line House
---

# Kiến trúc & Layout

## Nguyên tắc cốt lõi

Thiết kế theo phong cách **Fall Line House** — full-screen dark, architectural.  
Hành trình = **ảnh tĩnh** (zoom+pan, người xem nhìn ngắm) xen kẽ **clip AI** (scrub nhanh, cảm giác bay qua).

```
[Ảnh tĩnh — zoom+pan]  →scroll→  [Clip AI — lướt nhanh]  →scroll→  [Ảnh tĩnh — zoom+pan]  ...
```

## Layout cố định (fixed overlay)

```
┌─────────────────────────────────────────────────────────┐
│ [nav] HiepD5.com │ SC-01  SC-02  SC-03 │ 0979 591 156  │ ← #top-nav
│                                                          │
│  TÊN DỰ ÁN                              SC-01           │
│  TOÀN CẢNH                              TỔNG THỂ        │
│  ——                                     +                │ ← #info-panel (left) + #right-panel
│  — spec 1                               21.028°N         │
│  — spec 2                               105.834°E        │
│                                                          │
│  [YouTube]  [Facebook]                                   │ ← social (scene đầu only)
│                                                          │
│ ████░░░░░░░  scroll ◯          Xem chi tiết →           │ ← #bottom-bar
└─────────────────────────────────────────────────────────┘
```

## Hai loại scene trong CONFIG.scenes[]

| Loại | Kỹ thuật | Mục đích |
|------|----------|---------|
| `type:'image'` | CSS `scale()+translate()` lerp | Điểm dừng — người xem nhìn ngắm |
| `type:'frames'` | Canvas `drawImage()` index vào frame JPG preloaded | Đường đi — scrub mượt tuyệt đối |

> `type:'video'` (currentTime scrub) đã bỏ — lag không tránh được. Thay bằng `type:'frames'`.

### Image scene fields
```js
{
  type: 'image',
  src:  'assets/images/scene-01.jpg',
  zoom: { from:1.0, to:1.15 },
  pan:  { fromX:3, fromY:-2, toX:-3, toY:2 },
  fog:  true,           // sương khói
  // UI content
  title:     'TÊN DỰ ÁN',
  subtitle:  'TOÀN CẢNH',
  code:      'SC-01',
  codeLabel: 'TỔNG THỂ',
  specs:     ['Loại: —', 'Diện tích: —'],
  cta:       'Xem chi tiết',
  showSocial: true,     // chỉ scene đầu
}
```

### Video scene fields
```js
{ type: 'video', src: 'assets/transitions/t-01-02.mp4' }
```

## updateInfoPanel()

Gọi mỗi frame render, tự chọn image scene có `opacity` cao nhất (`dominant`) để hiển thị text panel.  
Không cần event listener riêng — smooth tự nhiên theo scroll.

## Nguyên tắc bất biến

- Ảnh cuối zoom OUT (`zoom.from > zoom.to`) — reveal kết thúc
- Scene đầu có `fog:true, showSocial:true`
- Frames transition fade 12% đầu/cuối (`FADE = 0.12`) — không giật khi chuyển sang ảnh
- Image opacity dùng `IMAGE_FADE_ZONE` crossfade chuẩn
- Scroll wrap (modulo) — vòng lặp vô hạn, transition cuối nối về scene đầu
