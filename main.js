'use strict';

// ── ASSET BASE ────────────────────────────────────────────────────────
// Local dev:  const ASSET_BASE = 'assets/';
// Production: const ASSET_BASE = 'https://assets.hiepd5.com/hiepd5-assets/';
const ASSET_BASE = 'https://assets.hiepd5.com/hiepd5-assets/';

// ── CONFIG ────────────────────────────────────────────────────────────
const CONFIG = {
  lerpFactor:        0.055,
  scrollSensitivity: 1.0,

  SCENE_WIDTH:       1000,  // virtual px — ảnh tĩnh
  TRANS_WIDTH:       700,   // virtual px — clip AI transition (lớn = scroll điều khiển từng frame)
  CROSSFADE:         80,    // px overlap

  LERP_SETTLE:       0.08,
  OPACITY_CUTOFF:    0.004,
  SCROLL_HINT_HIDE:  80,
  KEYBOARD_STEP:     100,
  TOUCH_MULTIPLIER:  2.8,
  FADE_INNER_RATIO:  0.25,
  LOADING_HIDE_DELAY:900,

  owner: {
    name:     'Vương Đắc Hiệp',
    phone:    '0979 591 156',
    youtube:  'https://www.youtube.com/channel/UCXD97eRzqP_7T9-wLg75MyQ',
    facebook: 'https://www.facebook.com/vuongdachiep',
  },

  // Mỗi image scene có: title, subtitle, specs[], code, codeLabel, cta
  // Điền content thật khi có ảnh dự án
  scenes: [
    {
      type:     'image',
      src:      ASSET_BASE + 'images/scene-01.jpg',
      zoom:     { from: 1.0, to: 1.12 },
      pan:      { fromX: 2, fromY: -1, toX: -2, toY: 1 },
      fog:      true,
      title:    'CAMPUS',
      subtitle: 'TOÀN CẢNH',
      code:     'SC-01',
      codeLabel:'TỔNG THỂ',
      specs:    ['Loại công trình: Trường học', 'Diện tích: —', 'Địa điểm: —', 'Chủ đầu tư: —'],
      cta:      'Xem chi tiết',
      showSocial: true,
    },

    { type: 'frames', dir: ASSET_BASE + 'frames/t-01-02/', count: 152 },

    {
      type:     'image',
      src:      ASSET_BASE + 'images/scene-02.jpg',
      zoom:     { from: 1.0, to: 1.15 },
      pan:      { fromX: -3, fromY: 0, toX: 3, toY: -1 },
      fog:      false,
      title:    'SÂN VẬN ĐỘNG',
      subtitle: 'KHÔNG GIAN VẬN ĐỘNG',
      code:     'SC-02',
      codeLabel:'NGOẠI THẤT',
      specs:    ['Khu vực: Sân track điền kinh', 'Vật liệu: Tartan xanh', 'Sức chứa: —'],
      cta:      '',
      showSocial: false,
    },

    { type: 'frames', dir: ASSET_BASE + 'frames/t-02-03/', count: 122 },

    {
      type:     'image',
      src:      ASSET_BASE + 'images/scene-03.jpg',
      zoom:     { from: 1.05, to: 1.18 },
      pan:      { fromX: 3, fromY: 1, toX: -3, toY: -1 },
      fog:      false,
      title:    'ARCADE VÒM',
      subtitle: 'NỘI THẤT TẦNG TRỆT',
      code:     'SC-03',
      codeLabel:'NỘI THẤT',
      specs:    ['Khu vực: Arcade — hành lang vòm', 'Vật liệu: Terracotta + bê tông', 'Chiều cao: —'],
      cta:      '',
      showSocial: false,
    },

    { type: 'frames', dir: ASSET_BASE + 'frames/t-03-04/', count: 122 },

    {
      type:     'image',
      src:      ASSET_BASE + 'images/scene-04.jpg',
      zoom:     { from: 1.05, to: 1.18 },
      pan:      { fromX: -2, fromY: -1, toX: 2, toY: 1 },
      fog:      false,
      title:    'ATRIUM',
      subtitle: 'NỘI THẤT ĐA TẦNG',
      code:     'SC-04',
      codeLabel:'NỘI THẤT',
      specs:    ['Khu vực: Atrium trung tâm', 'Số tầng: —', 'Đặc điểm: Cây xanh nội thất'],
      cta:      '',
      showSocial: false,
    },

    { type: 'frames', dir: ASSET_BASE + 'frames/t-04-05/', count: 122 },

    {
      type:     'image',
      src:      ASSET_BASE + 'images/scene-05.jpg',
      zoom:     { from: 1.15, to: 1.0 },
      pan:      { fromX: 3, fromY: 0, toX: -3, toY: 0 },
      fog:      false,
      title:    'TERRACE',
      subtitle: 'HÀNH LANG TẦNG CAO',
      code:     'SC-05',
      codeLabel:'NGOẠI THẤT',
      specs:    ['Khu vực: Walkway tầng trên', 'Tầm nhìn: Toàn khu campus', 'Vật liệu: Bê tông + lan can'],
      cta:      '',
      showSocial: false,
    },

    { type: 'frames', dir: ASSET_BASE + 'frames/t-05-01/', count: 152 },
  ],
};

// ── DERIVED ───────────────────────────────────────────────────────────
const IMAGE_FADE_ZONE  = CONFIG.CROSSFADE / CONFIG.SCENE_WIDTH;
const IMAGE_FADE_INNER = CONFIG.CROSSFADE * CONFIG.FADE_INNER_RATIO;

let _pos = 0;
CONFIG.scenes.forEach(s => {
  s.start = _pos;
  const w = (s.type === 'video' || s.type === 'frames') ? CONFIG.TRANS_WIDTH : CONFIG.SCENE_WIDTH;
  s.end   = _pos + w;
  _pos    = s.end - CONFIG.CROSSFADE;
});
const TOTAL_SCROLL = CONFIG.scenes.at(-1).end;

// ── MATH ──────────────────────────────────────────────────────────────
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const lerp  = (a, b, t)   => a + (b - a) * t;
const map01 = (v, lo, hi) => clamp((v - lo) / (hi - lo), 0, 1);

// ── SCROLL STATE ──────────────────────────────────────────────────────
let targetScroll  = 0;
let currentScroll = 0;
let rafId         = null;

function addScroll(delta) {
  targetScroll += delta;
  if (targetScroll >= TOTAL_SCROLL) {
    targetScroll  -= TOTAL_SCROLL;
    currentScroll -= TOTAL_SCROLL;
  } else if (targetScroll < 0) {
    targetScroll  += TOTAL_SCROLL;
    currentScroll += TOTAL_SCROLL;
  }
  scheduleRender();
}

// ── DOM REFS ──────────────────────────────────────────────────────────
const scenesEl    = document.getElementById('scenes');
const loading     = document.getElementById('loading');
const progressBar = document.getElementById('progress');
const scrollHint  = document.getElementById('scroll-hint');
const cursor      = document.getElementById('cursor');
const sceneTitle  = document.getElementById('scene-title');
const sceneSub    = document.getElementById('scene-subtitle');
const sceneDivider= document.getElementById('scene-divider');
const sceneSpecs  = document.getElementById('scene-specs');
const sceneCode   = document.getElementById('scene-code');
const sceneCta    = document.getElementById('scene-cta');
const navLinks    = document.getElementById('nav-links');

// ── BUILD NAV ─────────────────────────────────────────────────────────
CONFIG.scenes.forEach((s, i) => {
  if (s.type !== 'image') return;
  const btn = document.createElement('button');
  btn.className   = 'nav-link';
  btn.textContent = s.code || `0${i+1}`;
  btn.dataset.idx = i;
  btn.addEventListener('click', () => {
    targetScroll = s.start + CONFIG.SCENE_WIDTH * 0.3;
    scheduleRender();
  });
  navLinks.appendChild(btn);
});

// ── BUILD SCENE LAYERS ────────────────────────────────────────────────
const layers = [];

CONFIG.scenes.forEach((scene) => {
  const wrap = document.createElement('div');
  wrap.className      = 'scene-layer';
  wrap.style.opacity  = '0';
  wrap.style.pointerEvents = 'none';

  if (scene.type === 'image') {
    const img = document.createElement('div');
    img.className = 'zoom-img';
    img.style.backgroundImage = `url("${scene.src}")`;
    wrap.appendChild(img);

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

    if (scene.showSocial) wrap.appendChild(buildSocialLinks());

    scenesEl.appendChild(wrap);
    layers.push({ scene, el: wrap, imgEl: img, videoEl: null });

  } else if (scene.type === 'frames') {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%';
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');

    scene._frames = [];
    scene._loaded = false;

    wrap.appendChild(canvas);
    scenesEl.appendChild(wrap);
    layers.push({ scene, el: wrap, imgEl: null, videoEl: null, canvasEl: canvas, ctx });

  } else {
    const video = document.createElement('video');
    video.src     = scene.src;
    video.muted   = true;
    video.setAttribute('playsinline', '');
    video.preload = 'auto';
    video.load();

    wrap.appendChild(video);
    scenesEl.appendChild(wrap);
    layers.push({ scene, el: wrap, imgEl: null, videoEl: video, canvasEl: null });
  }
});

// ── LAZY LOAD FRAMES ──────────────────────────────────────────────────
function preloadTransition(scene) {
  if (!scene || scene.type !== 'frames' || scene._loaded) return;
  scene._loaded = true;
  for (let i = 1; i <= scene.count; i++) {
    const img = new Image();
    img.src = scene.dir + String(i).padStart(4, '0') + '.jpg';
    scene._frames.push(img);
  }
}

// Preload only first transition on init
preloadTransition(CONFIG.scenes[1]);

// ── SOCIAL LINKS ──────────────────────────────────────────────────────
function buildSocialLinks() {
  const o = CONFIG.owner;
  const div = document.createElement('div');
  div.className = 'social-links';
  div.style.cssText = 'position:absolute;bottom:60px;left:40px;z-index:10;pointer-events:all';
  div.innerHTML = `
    <a href="${o.youtube}" target="_blank" rel="noopener">
      <svg viewBox="0 0 24 24"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.8 15.5V8.5l6.2 3.5-6.2 3.5z"/></svg>
      YouTube
    </a>
    <a href="${o.facebook}" target="_blank" rel="noopener">
      <svg viewBox="0 0 24 24"><path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.88v2.27h3.32l-.53 3.49h-2.79V24C19.61 23.1 24 18.1 24 12.07z"/></svg>
      Facebook
    </a>`;
  return div;
}

// ── UI UPDATE — text panel per scene ──────────────────────────────────
let currentInfoScene = null;

function updateInfoPanel(scene) {
  if (!scene || scene.type !== 'image') return;
  if (scene === currentInfoScene) return;
  currentInfoScene = scene;

  sceneTitle.textContent  = scene.title    || '';
  sceneSub.textContent    = scene.subtitle || '';
  sceneCta.textContent    = scene.cta      || '';

  sceneSpecs.innerHTML = (scene.specs || [])
    .map(s => `<li>${s}</li>`).join('');

  sceneCode.innerHTML = scene.code
    ? `${scene.code}<span>${scene.codeLabel || ''}</span>`
    : '';

  // Update active nav link
  const sceneIdx = CONFIG.scenes.indexOf(scene);
  document.querySelectorAll('.nav-link').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.idx == sceneIdx);
  });

  // Lazy load adjacent transitions
  preloadTransition(CONFIG.scenes[sceneIdx - 1]);
  preloadTransition(CONFIG.scenes[sceneIdx + 1]);
  // wrap: nếu ở scene cuối thì preload transition đầu (loop)
  if (sceneIdx === 0) preloadTransition(CONFIG.scenes[CONFIG.scenes.length - 1]);
}

// ── RENDER ────────────────────────────────────────────────────────────
function render() {
  rafId = null;
  currentScroll = lerp(currentScroll, targetScroll, CONFIG.lerpFactor);

  const s = ((currentScroll % TOTAL_SCROLL) + TOTAL_SCROLL) % TOTAL_SCROLL;
  progressBar.style.width  = (s / TOTAL_SCROLL * 100) + '%';
  scrollHint.style.opacity = currentScroll < CONFIG.SCROLL_HINT_HIDE ? '1' : '0';
  let dominantScene = null;
  let dominantProgress = -1;

  layers.forEach(({ scene, el, imgEl, canvasEl, ctx }) => {
    const progress = map01(s, scene.start, scene.end);

    if (progress <= 0 || progress >= 1) {
      el.style.opacity       = '0';
      el.style.pointerEvents = 'none';
      return;
    }

    if (scene.type === 'frames') {
      el.style.pointerEvents = 'none';
      const FADE = 0.12;
      let opacity = 1;
      if (progress < FADE)           opacity = progress / FADE;
      else if (progress > 1 - FADE)  opacity = (1 - progress) / FADE;
      el.style.opacity = opacity;

      if (scene._frames.length > 0) {
        const idx   = Math.min(Math.floor(progress * scene._frames.length), scene._frames.length - 1);
        const frame = scene._frames[idx];
        if (frame && frame.complete && frame.naturalWidth) {
          const cw = canvasEl.width, ch = canvasEl.height;
          const scale = Math.max(cw / frame.naturalWidth, ch / frame.naturalHeight);
          const w = frame.naturalWidth * scale, h = frame.naturalHeight * scale;
          ctx.drawImage(frame, (cw - w) / 2, (ch - h) / 2, w, h);
        }
      }
      return;
    }

    // Image: crossfade opacity
    let opacity;
    if (progress < IMAGE_FADE_ZONE) {
      opacity = progress / IMAGE_FADE_ZONE;
    } else if (progress > 1 - IMAGE_FADE_ZONE) {
      opacity = (1 - progress) / IMAGE_FADE_ZONE;
    } else {
      opacity = 1;
    }

    if (opacity < CONFIG.OPACITY_CUTOFF) {
      el.style.opacity       = '0';
      el.style.pointerEvents = 'none';
      return;
    }

    el.style.opacity       = opacity;
    el.style.pointerEvents = opacity > 0.5 ? 'all' : 'none';

    const rawT  = map01(s, scene.start + IMAGE_FADE_INNER, scene.end - IMAGE_FADE_INNER);
    const scale = lerp(scene.zoom.from, scene.zoom.to, rawT);
    const tx    = lerp(scene.pan.fromX, scene.pan.toX, rawT);
    const ty    = lerp(scene.pan.fromY, scene.pan.toY, rawT);
    imgEl.style.transform = `scale(${scale.toFixed(4)}) translate(${tx.toFixed(2)}%, ${ty.toFixed(2)}%)`;

    // Track most-visible image scene for info panel
    if (opacity > dominantProgress) {
      dominantProgress = opacity;
      dominantScene    = scene;
    }
  });

  if (dominantScene) updateInfoPanel(dominantScene);

  if (Math.abs(targetScroll - currentScroll) > CONFIG.LERP_SETTLE) {
    scheduleRender();
  }
}

function scheduleRender() {
  if (!rafId) rafId = requestAnimationFrame(render);
}

// ── INPUT ─────────────────────────────────────────────────────────────
window.addEventListener('wheel', (e) => {
  e.preventDefault();
  addScroll(e.deltaY * CONFIG.scrollSensitivity);
}, { passive: false });

let lastTouchY = null;
window.addEventListener('touchstart', (e) => { lastTouchY = e.touches[0].clientY; }, { passive: true });
window.addEventListener('touchmove',  (e) => {
  if (lastTouchY === null) return;
  addScroll((lastTouchY - e.touches[0].clientY) * CONFIG.TOUCH_MULTIPLIER);
  lastTouchY = e.touches[0].clientY;
}, { passive: true });
window.addEventListener('touchend', () => { lastTouchY = null; });

window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') addScroll( CONFIG.KEYBOARD_STEP);
  if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  addScroll(-CONFIG.KEYBOARD_STEP);
});

window.addEventListener('resize', () => {
  layers.forEach(({ scene, canvasEl }) => {
    if (scene.type === 'frames' && canvasEl) {
      canvasEl.width  = window.innerWidth;
      canvasEl.height = window.innerHeight;
    }
  });
  scheduleRender();
});

window.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
});

// ── LOADING ───────────────────────────────────────────────────────────
let loadingHidden = false;
function hideLoading() {
  if (loadingHidden) return;
  loadingHidden = true;
  loading.classList.add('hidden');
  setTimeout(() => loading.remove(), CONFIG.LOADING_HIDE_DELAY);
}

const probe = new Image();
probe.onload = probe.onerror = hideLoading;
probe.src = CONFIG.scenes[0].src;
setTimeout(hideLoading, 3000);

// ── INIT ──────────────────────────────────────────────────────────────
targetScroll  = 0;
currentScroll = 0;
updateInfoPanel(CONFIG.scenes[0]);
scheduleRender();
