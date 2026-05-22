---
description: Cơ chế scroll-driven video playback — wheel event, touch, scrub logic
---

# Scroll-Driven Video Playback

## Core logic

```javascript
const CONFIG = {
  scrollSpeedFactor: 0.003, // điều chỉnh độ nhạy tại đây
  snapThreshold: 0.05,      // giây còn lại để tự snap
};

window.addEventListener('wheel', (e) => {
  const delta = e.deltaY;
  video.currentTime = clamp(
    video.currentTime + delta * CONFIG.scrollSpeedFactor,
    0,
    video.duration
  );

  if (video.currentTime >= video.duration - CONFIG.snapThreshold) {
    showNextStaticScene();
  }
  if (video.currentTime <= CONFIG.snapThreshold) {
    showPrevStaticScene();
  }
}, { passive: true });
```

## Touch support (mobile)

```javascript
let lastTouchY = 0;
el.addEventListener('touchstart', e => { lastTouchY = e.touches[0].clientY; });
el.addEventListener('touchmove', e => {
  const delta = lastTouchY - e.touches[0].clientY;
  lastTouchY = e.touches[0].clientY;
  // áp dụng delta tương tự wheel
});
```

## Yêu cầu video asset

- Format: MP4 (H.264) + WebM (VP9) — cả hai bắt buộc
- Không audio (hoặc muted hoàn toàn)
- Độ phân giải: tối thiểu 1920×1080
- Thời lượng: 3–10 giây mỗi đoạn
- Frame-accurate: mỗi frame phải đẹp khi dừng giữa chừng
- Preload: `<video preload="auto" muted playsinline>`
- Gọi `video.pause()` ngay sau khi load để chặn autoplay
