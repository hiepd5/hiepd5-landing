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
      title:    'HD5 STUDIO',
      subtitle: 'DIỄN HỌA KIẾN TRÚC ĐẲNG CẤP',
      code:     'SC-01',
      codeLabel:'HD5STUDIO.COM',
      specs:    [
        'Dịch vụ: Diễn họa quy hoạch & kiến trúc chất lượng cao',
        'Giải pháp: Hình ảnh render & Phim Cinematic 3D',
        'Liên hệ nhận dự án (Zalo): Sđt 0979 591 156',
        'Email công việc: kts.vuongdachiep@gmail.com'
      ],
      cta:      'Liên hệ làm việc',
      ctaUrl:   'https://hd5studio.com',
      showSocial: true,
    },

    { type: 'frames', dir: ASSET_BASE + 'frames/t-01-02/', count: 152 },

    {
      type:     'image',
      src:      ASSET_BASE + 'images/scene-02.jpg',
      zoom:     { from: 1.0, to: 1.15 },
      pan:      { fromX: -3, fromY: 0, toX: 3, toY: -1 },
      fog:      false,
      title:    'D5 RENDER WORKFLOW',
      subtitle: 'ĐÀO TẠO & CHIA SẺ KIẾN THỨC MIỄN PHÍ',
      code:     'SC-02',
      codeLabel:'LEARNING WORKFLOW',
      specs:    [
        'Nền tảng học: Kênh YouTube HiepD5',
        'Chủ đề: Hướng dẫn D5 Render từ cơ bản đến nâng cao',
        'Giải pháp AI: Ứng dụng Stable Diffusion trong kiến trúc',
        'Workflow: Tối ưu hóa thời gian render thực chiến'
      ],
      cta:      '',
      showSocial: false,
      actionLinks: [
        { text: 'Học D5 Render Cơ Bản', url: 'https://youtube.com/playlist?list=PLAxnVKb5XqwUD_rpWIupGl20BT2cTIKBX&si=gPHvgS0U5zgHcBxk' },
        { text: 'Ứng Dụng AI Kiến Trúc', url: 'https://youtube.com/playlist?list=PLAxnVKb5XqwVaD79Kf3S6Tuguc2aM2A_M&si=eqrdbWTPWmsPCh8Q' }
      ]
    },

    { type: 'frames', dir: ASSET_BASE + 'frames/t-02-03/', count: 122 },

    {
      type:     'image',
      src:      ASSET_BASE + 'images/scene-03.jpg',
      zoom:     { from: 1.05, to: 1.18 },
      pan:      { fromX: 3, fromY: 1, toX: -3, toY: -1 },
      fog:      false,
      title:    'D5 RENDER TIPS',
      subtitle: 'KINH NGHIỆM THỰC CHIẾN CHUYÊN SÂU',
      code:     'SC-03',
      codeLabel:'ADVANCED TECHNIQUES',
      specs:    [
        'Nội dung: Các thủ thuật xử lý ánh sáng & vật liệu khó',
        'Quy trình: Đồng bộ hóa 3d SketchUp sang D5 Render',
        'Mục tiêu: Nâng cao chất lượng ảnh diễn họa tiệm cận thực tế'
      ],
      cta:      '',
      showSocial: false,
      actionLinks: [
        { text: 'Xem Tips D5 Render Chuyên Sâu', url: 'https://youtube.com/playlist?list=PLAxnVKb5XqwVdEsJm4-eKY2picTnVQn0E&si=kS-T3AkDR0dfiIp4' }
      ]
    },

    { type: 'frames', dir: ASSET_BASE + 'frames/t-03-04/', count: 122 },

    {
      type:     'image',
      src:      ASSET_BASE + 'images/scene-04.jpg',
      zoom:     { from: 1.05, to: 1.18 },
      pan:      { fromX: -2, fromY: -1, toX: 2, toY: 1 },
      fog:      false,
      title:    'FUTURE VISUAL',
      subtitle: 'ĐỊNH HƯỚNG CÔNG NGHỆ TƯƠNG LAI',
      code:     'SC-04',
      codeLabel:'VISION',
      specs:    [
        'Công nghệ: Real-time Raytracing & Neural Rendering',
        'Xu hướng: Đón đầu kỷ nguyên thiết kế tối ưu bằng AI',
        'Sứ mệnh: Nâng tầm cộng đồng kiến trúc sư Việt Nam'
      ],
      cta:      'Tham gia cộng đồng',
      ctaUrl:   'https://www.facebook.com/groups/9524388777642550',
      showSocial: false,
    },

    { type: 'frames', dir: ASSET_BASE + 'frames/t-04-05/', count: 122 },

    {
      type:     'image',
      src:      ASSET_BASE + 'images/scene-05.jpg',
      zoom:     { from: 1.15, to: 1.0 },
      pan:      { fromX: 3, fromY: 0, toX: -3, toY: 0 },
      fog:      true,
      vignette: true,
      grain:    true,
      title:    'VƯƠNG ĐẮC HIỆP',
      subtitle: 'HIEPD5 / ARCHITECTURAL VISUALIZER',
      code:     'SC-05',
      codeLabel:'ABOUT ME',
      specs:    [
        'Sáng lập: <a href="https://www.facebook.com/groups/9524388777642550" target="_blank" rel="noopener">Group D5render Viet nam | Quy hoach kiến trúc</a>',
        'Chuyên môn: Diễn họa kiến trúc & Quy hoạch',
        'Tiên phong: Ứng dụng AI trong quy trình thiết kế',
        'Định hướng: Tối ưu hóa workflow kiến trúc thực chiến'
      ],
      cta:      'Tìm hiểu thêm',
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
  
  if (scene.cta && scene.ctaUrl) {
    sceneCta.innerHTML = `<a href="${scene.ctaUrl}" target="_blank" rel="noopener" style="color:inherit; text-decoration:none; cursor:none;">${scene.cta}</a>`;
  } else {
    sceneCta.textContent = scene.cta || '';
  }

  sceneSpecs.innerHTML = (scene.specs || [])
    .map(s => `<li>${s}</li>`).join('');

  sceneCode.innerHTML = scene.code
    ? `${scene.code}<span>${scene.codeLabel || ''}</span>`
    : '';

  // Dynamic action buttons (YouTube playlists)
  const sceneActionsEl = document.getElementById('scene-actions');
  if (sceneActionsEl) {
    sceneActionsEl.innerHTML = '';
    if (scene.actionLinks && scene.actionLinks.length > 0) {
      scene.actionLinks.forEach(link => {
        const a = document.createElement('a');
        a.className = 'action-btn';
        a.href = link.url;
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = link.text;
        sceneActionsEl.appendChild(a);
      });
      sceneActionsEl.style.display = 'flex';
      void sceneActionsEl.offsetWidth; // Force repaint
      sceneActionsEl.style.opacity = '1';
    } else {
      sceneActionsEl.style.display = 'none';
      sceneActionsEl.style.opacity = '0';
    }
  }

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
      dominantScene.currentProgress = progress; // Track scene active progress
    }
  });

  if (dominantScene) {
    updateInfoPanel(dominantScene);

    // Apply 3D Parallax & Depth Translation to info panel children
    const progress = dominantScene.currentProgress || 0.5;
    const delta = progress - 0.5; // range: -0.5 to 0.5

    sceneTitle.style.transform   = `translate3d(${(delta * -40).toFixed(1)}px, 0, ${(Math.abs(delta) * -80).toFixed(1)}px) rotateY(${(delta * -10).toFixed(1)}deg)`;
    sceneSub.style.transform     = `translate3d(${(delta * -60).toFixed(1)}px, 0, ${(Math.abs(delta) * -50).toFixed(1)}px) rotateY(${(delta * -12).toFixed(1)}deg)`;
    sceneSpecs.style.transform   = `translate3d(${(delta * -80).toFixed(1)}px, 0, ${(Math.abs(delta) * -20).toFixed(1)}px) rotateY(${(delta * -15).toFixed(1)}deg)`;

    const divider = document.getElementById('scene-divider');
    if (divider) {
      divider.style.transform   = `translate3d(${(delta * -50).toFixed(1)}px, 0, ${(Math.abs(delta) * -60).toFixed(1)}px) rotateY(${(delta * -11).toFixed(1)}deg)`;
    }

    const actions = document.getElementById('scene-actions');
    if (actions) {
      actions.style.transform   = `translate3d(${(delta * -95).toFixed(1)}px, 0, 0px) rotateY(${(delta * -18).toFixed(1)}deg)`;
    }
  }

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

// ── AMBIENT AUDIO ENGINE ──────────────────────────────────────────────
const bgAudio      = document.getElementById('bg-audio');
const audioToggle  = document.getElementById('audio-toggle');
let audioStarted = false;

function startAudio() {
  if (audioStarted) return;
  audioStarted = true;

  bgAudio.play().then(() => {
    audioToggle.classList.remove('audio-muted');
  }).catch(err => {
    console.log("Autoplay prevented, waiting for user interaction.", err);
    audioStarted = false; // Allow retry
  });

  // Clean up listeners
  window.removeEventListener('click', startAudio);
  window.removeEventListener('scroll', startAudio);
  window.removeEventListener('wheel', startAudio);
  window.removeEventListener('touchstart', startAudio);
}

// User interaction events to trigger audio
window.addEventListener('click', startAudio, { passive: true });
window.addEventListener('scroll', startAudio, { passive: true });
window.addEventListener('wheel', startAudio, { passive: true });
window.addEventListener('touchstart', startAudio, { passive: true });

function fadeAudio(volume, duration = 800) {
  const startVol = bgAudio.volume;
  const steps = 20;
  const interval = duration / steps;
  let step = 0;

  const timer = setInterval(() => {
    step++;
    bgAudio.volume = startVol + (volume - startVol) * (step / steps);
    if (step >= steps) {
      bgAudio.volume = volume;
      clearInterval(timer);
    }
  }, interval);
}

if (audioToggle && bgAudio) {
  bgAudio.volume = 0.5; // Init volume at 50%

  audioToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (bgAudio.paused) {
      bgAudio.play();
      audioToggle.classList.remove('audio-muted');
      fadeAudio(0.5);
    } else {
      fadeAudio(0, 400);
      setTimeout(() => {
        bgAudio.pause();
        audioToggle.classList.add('audio-muted');
      }, 400);
    }
  });
}

// ── INIT ──────────────────────────────────────────────────────────────
// Start at scene-05 (index 8)
const _initScene = CONFIG.scenes[8];
targetScroll  = _initScene.start + CONFIG.CROSSFADE;
currentScroll = _initScene.start + CONFIG.CROSSFADE;
updateInfoPanel(CONFIG.scenes[0]);
scheduleRender();
