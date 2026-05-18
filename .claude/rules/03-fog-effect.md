---
description: Hiệu ứng nghệ thuật — fog/sương, vignette, film grain — CSS layers và thông số
---

# Hiệu ứng Nghệ Thuật (Fog / Vignette / Grain)

## Ba lớp hiệu ứng

| Class | Kỹ thuật | Mục đích |
|-------|----------|---------|
| `.fog-wrap` + `.fog-layer` | SVG blur ellipse + CSS translateX animation | Sương bay — cinematic, bí ẩn |
| `.vignette-strong` | radial-gradient tối 4 cạnh | Tập trung vào trung tâm ảnh |
| `.film-grain` | SVG feTurbulence + translateX animation | Hạt phim analog |

## CONFIG fields

```js
{
  fog:      true,   // bật fog (3 layer sương)
  vignette: true,   // bật vignette tối
  grain:    true,   // bật film grain
}
```

Hiện tại: **scene-01** có `fog:true`, **scene-05** có `fog+vignette+grain:true`.

## Fog — thông số hiện tại

| Layer | Opacity | Duration | Direction | Tone |
|-------|---------|----------|-----------|------|
| fog-1 | 0.22 | 28s | forward | trắng `#ffffff` |
| fog-2 | 0.14 | 44s | reverse | xanh lạnh `#c8d8f0` |
| fog-3 | 0.10 | 56s | forward | trắng `#ffffff` |

SVG dùng `feGaussianBlur stdDeviation="32/48/22"` — không cần file PNG ngoài.

## Vignette

```css
.vignette-strong {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at center,
    transparent 30%,
    rgba(0,0,0,0.42) 72%,
    rgba(0,0,0,0.78) 100%
  );
  pointer-events: none;
  z-index: 2;
}
```

## Film Grain

```css
.film-grain {
  position: absolute; inset: -10%; width: 120%; height: 120%;
  opacity: 0.055;
  pointer-events: none; z-index: 3;
  background-image: url("data:image/svg+xml,...feTurbulence baseFrequency='0.75'...");
  background-size: 200px 200px;
  animation: grainShift 0.12s steps(1) infinite;
}
@keyframes grainShift {
  0%  { transform: translate(0,0); }
  25% { transform: translate(-3px, 2px); }
  50% { transform: translate(2px, -2px); }
  75% { transform: translate(-2px, 3px); }
}
```

## DOM build (main.js)

```js
if (scene.fog) {
  const fogWrap = document.createElement('div');
  fogWrap.className = 'fog-wrap';
  for (let f = 1; f <= 3; f++) {
    const fog = document.createElement('div');
    fog.className = `fog-layer fog-${f}`;
    fogWrap.appendChild(fog);
  }
  wrap.appendChild(fogWrap);
}
if (scene.vignette) {
  const vig = document.createElement('div');
  vig.className = 'vignette-strong';
  wrap.appendChild(vig);
}
if (scene.grain) {
  const grain = document.createElement('div');
  grain.className = 'film-grain';
  wrap.appendChild(grain);
}
```

## Điều chỉnh độ đậm/nhạt

| Muốn | Thay đổi |
|------|---------|
| Sương nhạt hơn | Giảm opacity fog-1/2/3 |
| Vignette nhẹ hơn | Tăng % transparent (30% → 45%) |
| Grain mờ hơn | Giảm opacity `.film-grain` (0.055 → 0.03) |
| Grain tắt hoàn toàn | `grain: false` trong CONFIG |
