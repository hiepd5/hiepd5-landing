---
description: Virtual scroll engine — lerp, wrap loop, image/frames render, scheduleRender()
---

# Scroll Engine

## Kiến trúc

```
wheel / touch / keyboard
        ↓ addScroll(delta)
targetScroll (wrap modulo TOTAL_SCROLL — vòng lặp vô hạn)
        ↓ scheduleRender() → rAF
render(): currentScroll = lerp(current, target, lerpFactor)
        ↓ s = currentScroll % TOTAL_SCROLL  (normalized)
        ↓ mỗi scene: tính progress → opacity + transform / canvas frame
        ↓ nếu |target - current| > LERP_SETTLE → scheduleRender() lại
        ↓ nếu đã settled → dừng
```

## Constants (tất cả trong CONFIG)

```js
SCENE_WIDTH:      1000   // virtual px — ảnh tĩnh
TRANS_WIDTH:       700   // virtual px — frames transition (lớn = scroll điều khiển từng frame)
CROSSFADE:          80   // px overlap giữa scene liền kề
lerpFactor:      0.055
LERP_SETTLE:      0.08
scrollSensitivity: 1.0
TOUCH_MULTIPLIER:  1.6
KEYBOARD_STEP:     100
FADE_INNER_RATIO:  0.25
```

## Derived (tính 1 lần lúc khởi động)

```js
const IMAGE_FADE_ZONE  = CONFIG.CROSSFADE / CONFIG.SCENE_WIDTH  // 0.08
const IMAGE_FADE_INNER = CONFIG.CROSSFADE * CONFIG.FADE_INNER_RATIO  // 20px

let _pos = 0;
CONFIG.scenes.forEach(s => {
  s.start = _pos;
  const w = (s.type === 'video' || s.type === 'frames') ? CONFIG.TRANS_WIDTH : CONFIG.SCENE_WIDTH;
  s.end   = _pos + w;
  _pos    = s.end - CONFIG.CROSSFADE;
});
const TOTAL_SCROLL = CONFIG.scenes.at(-1).end;
```

## addScroll — Wrap loop (không clamp)

```js
function addScroll(delta) {
  targetScroll += delta;
  if (targetScroll >= TOTAL_SCROLL) {
    targetScroll  -= TOTAL_SCROLL;
    currentScroll -= TOTAL_SCROLL;  // giữ nguyên delta lerp, không nhảy
  } else if (targetScroll < 0) {
    targetScroll  += TOTAL_SCROLL;
    currentScroll += TOTAL_SCROLL;
  }
  scheduleRender();
}
```

**Tại sao shift cả `currentScroll`**: lerp cần `|target - current|` nhỏ để mượt. Nếu chỉ wrap target, lerp đi sai chiều qua 0.

## Render — normalized scroll

```js
const s = ((currentScroll % TOTAL_SCROLL) + TOTAL_SCROLL) % TOTAL_SCROLL;
// Dùng s cho tất cả progress calculations
```

## Render — Image scene

```js
progress = map01(s, scene.start, scene.end)

// Opacity crossfade
if progress < IMAGE_FADE_ZONE:       opacity = progress / IMAGE_FADE_ZONE
elif progress > 1 - IMAGE_FADE_ZONE: opacity = (1-progress) / IMAGE_FADE_ZONE
else:                                 opacity = 1

// Transform
rawT  = map01(s, scene.start + IMAGE_FADE_INNER, scene.end - IMAGE_FADE_INNER)
scale = lerp(zoom.from, zoom.to, rawT)
imgEl.style.transform = `scale(${scale}) translate(${tx}%, ${ty}%)`
```

## Render — Frames scene (type:'frames')

```js
const FADE = 0.12;
let opacity = 1;
if (progress < FADE)        opacity = progress / FADE;
else if (progress > 1-FADE) opacity = (1 - progress) / FADE;
el.style.opacity = opacity;

const idx = Math.min(Math.floor(progress * scene._frames.length), scene._frames.length - 1);
const frame = scene._frames[idx];
if (frame && frame.complete && frame.naturalWidth) {
  const ctx = canvasEl.getContext('2d');
  const scale = Math.max(cw / frame.naturalWidth, ch / frame.naturalHeight);
  ctx.drawImage(frame, (cw-w)/2, (ch-h)/2, w, h);  // object-fit: cover
}
```

**Preload**: tất cả frames load vào `scene._frames[]` khi build DOM. Lần đầu ~3-5s, sau đó 0 lag.

## Tại sao frames thay video.currentTime

`video.currentTime` có decode buffer — browser skip frames khi seek quá nhanh, gây giật.  
Frame JPG preload vào RAM = index trực tiếp, không decode, không lag.
