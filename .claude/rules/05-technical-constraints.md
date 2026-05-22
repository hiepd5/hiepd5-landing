---
description: Ràng buộc kỹ thuật bắt buộc, performance, cross-browser
---

# Ràng buộc Kỹ Thuật

## Bắt buộc

- Vanilla JS thuần — không jQuery, không React/Vue, không framework
- `requestAnimationFrame` cho animation — không `setInterval`
- `pointer-events: none` trên tất cả overlay/fog layer
- `will-change: transform` trên `.zoom-img` và fog layers
- Meta viewport chuẩn, `user-scalable=no` trên mobile
- Video: `muted playsinline preload="auto"` — bắt buộc cho iOS autoplay policy

## Cross-browser

- Test: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari (Safari iOS khác nhất)
- Video chỉ cần `.mp4` H.264 — đủ cho tất cả modern browser
- `playsinline` bắt buộc trên iOS để không fullscreen

## Performance

- Fog layer dùng `transform: translateX()` — không dùng `left/margin`
- `.zoom-img` dùng `background-size: cover`, `will-change: transform`
- scheduleRender() dừng rAF khi `|target - current| < LERP_SETTLE` → 0 frame/s khi idle
- Không gọi DOM read/write xen kẽ trong vòng lặp render (layout thrashing)

## Lưu ý video scrubbing

- Clip **phải encode all-keyframe** (`-g 1`) — nếu không, `currentTime` assignment bị skip frame
- `videoEl.readyState >= 1` guard trước khi set `currentTime`
- Không cần `video.pause()` — scrubbing không trigger play

## Quy trình thêm asset

1. Ảnh → `assets/images/scene-NN.jpg`
2. Clip (encode xong) → `assets/transitions/t-NN-MM.mp4`
3. Thêm entry vào `CONFIG.scenes[]`
4. Test trên Chrome trước, sau đó Safari iOS
