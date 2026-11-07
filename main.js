'use strict';

// ── ENVIRONMENT & SMART ASSET BASE ────────────────────────────────────
const IS_LOCAL = (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname === '' ||
  window.location.protocol === 'file:'
);

const ASSET_BASE     = IS_LOCAL ? 'assets/' : 'https://assets.hiepd5.com/hiepd5-assets/';
const BLUEPRINT_BASE = 'assets/images/';

// ── CENTRALIZED CONFIGURATION (ZERO MAGIC NUMBERS) ────────────────────
const CONFIG = {
  lerpFactor:             0.072,
  scrollSensitivity:      1.0,

  SCENE_WIDTH:            1050,
  TRANS_WIDTH:            700,
  CROSSFADE:              110,

  LERP_SETTLE:            0.08,
  OPACITY_CUTOFF:         0.004,
  FRAME_FADE_ZONE:        0.12,
  FADE_INNER_RATIO:       0.25,
  SCENE_JUMP_RATIO:       0.28,
  SCROLL_HINT_HIDE:       90,
  KEYBOARD_STEP:          110,

  TOUCH_MULTIPLIER:       2.8,
  TOUCH_VELOCITY_MIN:     0.15,
  TOUCH_FRAME_MS:         16.67,
  TOUCH_MAX_SPEED:        62,
  TOUCH_DAMPING:          0.93,
  TOUCH_STOP_EPSILON:     0.5,

  CURSOR_LERP:            0.18,
  CURSOR_SETTLE:          0.15,

  LENS_RADIUS:            132,
  GRID_STEP:              76,
  SCRAMBLE_CHARS:         '01AI/+<>#ΔΣ',
  SCRAMBLE_DURATION_MS:   360,

  LOADING_HIDE_DELAY:     850,
  LOADING_FALLBACK_MS:    3200,
  AUDIO_MAX_VOL:          0.45,
  AUDIO_FADE_IN_MS:       750,
  AUDIO_FADE_OUT_MS:      380,

  owner: {
    name:       'KTS. Vương Đắc Hiệp',
    brand:      'HiệpD5',
    phone:      '0979 591 156',
    zalo:       'https://zalo.me/0979591156',
    email:      'kts.vuongdachiep@gmail.com',
    youtube:    'https://www.youtube.com/channel/UCXD97eRzqP_7T9-wLg75MyQ',
    facebook:   'https://www.facebook.com/vuongdachiep',
    fbGroup:    'https://www.facebook.com/groups/9524388777642550',
    studioUrl:  'https://hd5studio.com',
    aiPromptUrl:'https://aistudio.google.com/u/1/apps/acd43aee-4604-4684-a130-194bea8817fa?showPreview=true&showAssistant=true&fullscreenApplet=true',
    masoiUrl:   'https://masoi.hiepd5.com',
  },

  // Hot-Swap Socket for 1:1 Split-Slider (Drop any SketchUp Raw <-> 8K Render pair here)
  proofSlider: [
    {
      id:        'campus-masterplan',
      label:     '01 · Quy Hoạch Campus',
      beforeSrc: BLUEPRINT_BASE + 'scene-01-blueprint.jpg',
      afterSrc:  ASSET_BASE + 'images/scene-01.jpg',
      fallbackAfter: 'assets/images/scene-01.jpg',
    },
    {
      id:        'arcade-walkway',
      label:     '02 · Không Gian Cầu Vòm',
      beforeSrc: BLUEPRINT_BASE + 'scene-03-blueprint.jpg',
      afterSrc:  ASSET_BASE + 'images/scene-03.jpg',
      fallbackAfter: 'assets/images/scene-03.jpg',
    },
    {
      id:        'elevated-terrace',
      label:     '03 · Cảnh Quan Tầng Cao',
      beforeSrc: BLUEPRINT_BASE + 'scene-05-blueprint.jpg',
      afterSrc:  ASSET_BASE + 'images/scene-05.jpg',
      fallbackAfter: 'assets/images/scene-05.jpg',
    },
  ],

  scenes: [
    {
      type:         'image',
      src:          ASSET_BASE + 'images/scene-01.jpg',
      blueprintSrc: BLUEPRINT_BASE + 'scene-01-blueprint.jpg',
      zoom:         { from: 1.0, to: 1.11 },
      pan:          { fromX: 2, fromY: -1, toX: -2, toY: 1 },
      fog:          true,
      navLabel:     '01 IDENTITY',
      label:        '01 // KIẾN TRÚC SƯ & CHUYÊN GIA HỆ THỐNG AI',
      telemetry:    'AI AGENT ENGINE · 1:1 GEOMETRY LOCK · ONLINE',
      title:        'Vương Đắc Hiệp',
      subtitle:     'HiệpD5 — AI Agent Tự Động Hóa Kiến Trúc & Quy Hoạch',
      code:         'IDENTITY',
      codeLabel:    'AI ARCHITECT',
      coords:       '21.0285°N / 105.8542°E · HANOI',
      specs: [
        'Định vị: Kiến trúc sư tiên phong xây dựng Hệ thống AI Agent thực thi tự động',
        'Chuyên môn: Tự động hóa Quy hoạch Đô thị, Kiến trúc & Diễn họa chuẩn tỷ lệ 1:1',
        'Hệ sinh thái: Sáng lập <a href="https://hd5studio.com" target="_blank" rel="noopener noreferrer">HD5 Studio</a> &amp; Cộng đồng D5 Render Việt Nam',
        'Liên hệ hợp tác: Zalo <a href="https://zalo.me/0979591156" target="_blank" rel="noopener noreferrer">0979 591 156</a> · kts.vuongdachiep@gmail.com',
      ],
      cta:          'Mở Trung Tâm AI Hub',
      ctaHubFilter: 'all',
      showSocial:   true,
      actionLinks: [
        { text: '⚡ Khám Phá Hệ Sinh Thái AI', hubFilter: 'all', style: 'primary-gold' },
        { text: '🏢 Dịch Vụ B2B HD5Studio.com', url: 'https://hd5studio.com' },
      ],
    },

    { type: 'frames', dir: ASSET_BASE + 'frames/t-01-02/', count: 152 },

    {
      type:         'image',
      src:          ASSET_BASE + 'images/scene-02.jpg',
      zoom:         { from: 1.0, to: 1.14 },
      pan:          { fromX: -2.5, fromY: 0, toX: 2.5, toY: -1 },
      fog:          false,
      navLabel:     '02 AI AGENTS',
      label:        '02 // MULTI-AGENT AUTOMATION PIPELINE',
      telemetry:    'PIPELINE: CAD / SKETCHUP ➔ HIỆPD5 AI ➔ 8K NATIVE',
      title:        'HiệpD5 AI Agents',
      subtitle:     'Tự Động Hóa Thực Thi Trong Kiến Trúc & Quy Hoạch',
      code:         'AI AGENTS',
      codeLabel:    'AUTOMATION CORE',
      coords:       'PIPELINE · @ATLAS · VISION 1:1',
      specs: [
        'Plugin SketchUp AI (@atlas): Xuất phối cảnh 4K / 8K Native giữ nguyên 100% hình học',
        'Quy hoạch thông minh: Tự động hóa phân tích bối cảnh, cây xanh & trục cảnh quan đô thị',
        'AI Prompt 2.0: Trợ lý thiết lập ánh sáng, vật liệu & câu lệnh diễn họa chuyên sâu',
        'Hiệu quả thực tế: Rút ngắn 70–80% thời gian lên phương án cho Kiến trúc sư',
      ],
      cta:          'Xem Các Công Cụ AI',
      ctaHubFilter: 'agents',
      showSocial:   false,
      actionLinks: [
        { text: '⚡ Xem Sơ Đồ Multi-Agent', hubFilter: 'agents', style: 'cyan-btn' },
        { text: 'Mở App AI Prompt 2.0', url: 'https://aistudio.google.com/u/1/apps/acd43aee-4604-4684-a130-194bea8817fa?showPreview=true&showAssistant=true&fullscreenApplet=true', style: 'primary-gold' },
        { text: 'Tư Vấn Plugin SU 8K (Zalo)', url: 'https://zalo.me/0979591156' },
      ],
    },

    { type: 'frames', dir: ASSET_BASE + 'frames/t-02-03/', count: 122 },

    {
      type:         'image',
      src:          ASSET_BASE + 'images/scene-03.jpg',
      blueprintSrc: BLUEPRINT_BASE + 'scene-03-blueprint.jpg',
      zoom:         { from: 1.04, to: 1.16 },
      pan:          { fromX: 2.5, fromY: 1, toX: -2.5, toY: -1 },
      fog:          false,
      navLabel:     '03 1:1 PROOF',
      label:        '03 // ZERO-TOLERANCE VISUAL QA',
      telemetry:    'DRIFT RADAR: 0.00% DEVIATION · 1:1 CAD MATCH',
      title:        'Chuẩn Xác Tỷ Lệ 1:1',
      subtitle:     'Đối Chứng Bản Vẽ Kỹ Thuật CAD ↔ Phối Cảnh AI 8K',
      code:         '1:1 PROOF',
      codeLabel:    'GEOMETRY LOCK',
      coords:       'DRIFT 0.0PX · CAD WIREFRAME',
      specs: [
        'Cam kết kỹ thuật: Khóa cứng đường nét kiến trúc, không tự ý bóp méo công trình',
        'Kiểm định trực quan: Di chuột dùng Thấu kính CAD 1:1 hoặc kéo Thanh trượt đối chứng',
        'Quy trình kết hợp: Đồng bộ trực tiếp SketchUp + D5 Render + AI Hậu kỳ thực chiến',
      ],
      cta:          'Mở Bàn Đối Chứng 1:1',
      ctaHubFilter: 'proof',
      showSocial:   false,
      actionLinks: [
        { text: '⇄ Kéo Thanh Trượt Đối Chứng 1:1', hubFilter: 'proof', style: 'primary-gold' },
        { text: 'Tips D5 & AI Chuyên Sâu', url: 'https://youtube.com/playlist?list=PLAxnVKb5XqwVaD79Kf3S6Tuguc2aM2A_M&si=gefTBXf6fR_BQQ72' },
      ],
    },

    { type: 'frames', dir: ASSET_BASE + 'frames/t-03-04/', count: 122 },

    {
      type:         'image',
      src:          ASSET_BASE + 'images/scene-04.jpg',
      zoom:         { from: 1.04, to: 1.16 },
      pan:          { fromX: -2, fromY: -1, toX: 2, toY: 1 },
      fog:          false,
      navLabel:     '04 COMMUNITY',
      label:        '04 // KNOWLEDGE HUB & INTERACTIVE 3D LAB',
      telemetry:    'ECOSYSTEM · YOUTUBE · FB GROUP · WEBGL 3D',
      title:        'Tri Thức & Cộng Đồng',
      subtitle:     'Chia Sẻ Thực Chiến & Phòng Thí Nghiệm Tương Tác 3D',
      code:         'COMMUNITY',
      codeLabel:    'MEDIA & 3D LAB',
      coords:       'VISION 2026 · OPEN COMMUNITY',
      specs: [
        'YouTube HiepD5: Hệ thống bài giảng D5 Render &amp; AI Kiến trúc hoàn toàn miễn phí',
        'Cộng đồng chuyên môn: <a href="https://www.facebook.com/groups/9524388777642550" target="_blank" rel="noopener noreferrer">Group D5 Render Việt Nam | Quy hoạch Kiến trúc</a>',
        'Kết nối cá nhân: <a href="https://www.facebook.com/vuongdachiep" target="_blank" rel="noopener noreferrer">Facebook Vương Đắc Hiệp</a> cập nhật công nghệ AI mới nhất',
        'WebGL 3D Lab: Trải nghiệm không gian tương tác thời gian thực tại Ma Sói 3D',
      ],
      cta:          'Tham Gia Group D5 Render VN',
      ctaUrl:       'https://www.facebook.com/groups/9524388777642550',
      showSocial:   true,
      actionLinks: [
        { text: '▶ Học D5 & AI Trên YouTube', url: 'https://www.youtube.com/channel/UCXD97eRzqP_7T9-wLg75MyQ', style: 'primary-gold' },
        { text: '◈ Vào Group Quy Hoạch & D5', url: 'https://www.facebook.com/groups/9524388777642550' },
        { text: '🐺 Vũ Trụ Ma Sói 3D', url: 'https://masoi.hiepd5.com', style: 'cyan-btn' },
      ],
    },

    { type: 'frames', dir: ASSET_BASE + 'frames/t-04-05/', count: 122 },

    {
      type:         'image',
      src:          ASSET_BASE + 'images/scene-05.jpg',
      blueprintSrc: BLUEPRINT_BASE + 'scene-05-blueprint.jpg',
      zoom:         { from: 1.14, to: 1.0 },
      pan:          { fromX: 2.5, fromY: 0, toX: -2.5, toY: 0 },
      fog:          true,
      vignette:     true,
      grain:        true,
      navLabel:     '05 STUDIO B2B',
      label:        '05 // ENTERPRISE ARCHVIZ & URBAN PLANNING STUDIO',
      telemetry:    'COMMERCIAL PARTNER · HD5STUDIO.COM · READY',
      title:        'HD5 Studio',
      subtitle:     'Đối Tác Diễn Họa Quy Hoạch & Phim Kiến Trúc Đẳng Cấp',
      code:         'STUDIO B2B',
      codeLabel:    'HD5STUDIO.COM',
      coords:       'B2B MASTERPLAN · 4K/8K FILM',
      specs: [
        'Năng lực cốt lõi: Diễn họa Quy hoạch Đô thị quy mô lớn, Kiến trúc &amp; Nội thất cao cấp',
        'Sản xuất Phim 3D: Phim giới thiệu dự án BĐS, Flycam 3D &amp; Walkthrough giàu cảm xúc',
        'Công nghệ độc quyền: Quy trình D5 Render kết hợp AI Agent rút ngắn tiến độ bàn giao',
        'Nhận báo giá dự án: Hotline / Zalo <a href="https://zalo.me/0979591156" target="_blank" rel="noopener noreferrer">0979 591 156</a>',
      ],
      cta:          'Truy Cập HD5Studio.com',
      ctaUrl:       'https://hd5studio.com',
      showSocial:   false,
      actionLinks: [
        { text: '🏢 Mở Website HD5Studio.com', url: 'https://hd5studio.com', style: 'primary-gold' },
        { text: '💬 Nhắn Zalo Nhận Báo Giá', url: 'https://zalo.me/0979591156', style: 'cyan-btn' },
      ],
    },

    { type: 'frames', dir: ASSET_BASE + 'frames/t-05-01/', count: 152 },
  ],
};

// ── DERIVED SCROLL TIMELINE ───────────────────────────────────────────
const IMAGE_FADE_ZONE  = CONFIG.CROSSFADE / CONFIG.SCENE_WIDTH;
const IMAGE_FADE_INNER = CONFIG.CROSSFADE * CONFIG.FADE_INNER_RATIO;

let _pos = 0;
CONFIG.scenes.forEach((s) => {
  s.start = _pos;
  const w = (s.type === 'video' || s.type === 'frames') ? CONFIG.TRANS_WIDTH : CONFIG.SCENE_WIDTH;
  s.end   = _pos + w;
  _pos    = s.end - CONFIG.CROSSFADE;
});
const TOTAL_SCROLL = CONFIG.scenes[CONFIG.scenes.length - 1].end;
const imageScenes  = CONFIG.scenes.filter((s) => s.type === 'image');

// ── MATH HELPERS ──────────────────────────────────────────────────────
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const lerp  = (a, b, t)   => a + (b - a) * t;
const map01 = (v, lo, hi) => clamp((v - lo) / (hi - lo), 0, 1);

// ── DOM REFERENCES ────────────────────────────────────────────────────
const scenesEl          = document.getElementById('scenes');
const lensCanvas        = document.getElementById('blueprint-lens-canvas');
const lensCtx           = lensCanvas ? lensCanvas.getContext('2d') : null;
const loadingEl         = document.getElementById('loading');
const loadingFillEl     = document.getElementById('loading-progress-fill');
const loadingPctEl      = document.getElementById('loading-percent');
const localBadgeEl      = document.getElementById('local-env-badge');
const progressBar       = document.getElementById('progress');
const scrollHint        = document.getElementById('scroll-hint');
const cursorDot         = document.getElementById('cursor-dot');
const cursorRing        = document.getElementById('cursor-ring');
const cursorLabel       = document.querySelector('.cursor-label');
const telemetryStatusEl = document.getElementById('telemetry-status');
const projectLabelEl    = document.getElementById('project-label');
const sceneTitleEl      = document.getElementById('scene-title');
const sceneSubEl        = document.getElementById('scene-subtitle');
const sceneSpecsEl      = document.getElementById('scene-specs');
const sceneActionsEl    = document.getElementById('scene-actions');
const sceneSocialSlotEl = document.getElementById('scene-social-slot');
const sceneCodeEl       = document.getElementById('scene-code');
const scrollTelemetryEl = document.getElementById('scroll-telemetry');
const coordinatesEl     = document.getElementById('coordinates');
const sceneCtaEl        = document.getElementById('scene-cta');
const navLinksEl        = document.getElementById('nav-links');
const navBrandEl        = document.getElementById('nav-brand');
const mobileMenuLinksEl = document.querySelector('.mobile-menu-links');
const menuToggleEl      = document.getElementById('menu-toggle');
const mobileOverlayEl   = document.getElementById('mobile-menu-overlay');
const mobileOpenHubEl   = document.getElementById('mobile-open-hub');
const sceneCurrentEl    = document.getElementById('scene-current');
const sceneTotalEl      = document.getElementById('scene-total');
const sceneDotsEl       = document.getElementById('scene-dots');
const cmdkTriggerEl     = document.getElementById('cmdk-trigger');
const lensToggleEl      = document.getElementById('lens-toggle');
const hubOverlayEl      = document.getElementById('ai-command-hub');
const hubCloseBtnEl     = document.getElementById('hub-close-btn');
const hubSearchInputEl  = document.getElementById('hub-search-input');
const hubScrollBodyEl   = document.getElementById('hub-scroll-body');
const proofSectionEl    = document.getElementById('hub-proof-section');
const proofSliderEl     = document.getElementById('proof-split-slider');
const proofBeforeImgEl  = document.getElementById('proof-before-img');
const proofAfterImgEl   = document.getElementById('proof-after-img');
const proofHandleEl     = document.getElementById('proof-handle');
const proofPresetsEl    = document.getElementById('proof-presets');

if (IS_LOCAL && localBadgeEl) {
  localBadgeEl.hidden = false;
}

if (sceneTotalEl) {
  sceneTotalEl.textContent = String(imageScenes.length).padStart(2, '0');
}

// ── STATE ─────────────────────────────────────────────────────────────
let targetScroll      = 0;
let currentScroll     = 0;
let scrollVelocity    = 0;
let rafId             = null;
let isHubOpen         = false;
let isMobileMenuOpen  = false;
let isCoarsePointer   = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
let prefersReduced    = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let lensEnabled       = !isCoarsePointer && !prefersReduced;

let cursorX = -200, cursorY = -200;
let ringX   = -200, ringY   = -200;
let cursorActive = false;
let cursorRafId  = null;

let activeDominantState = {
  scene: null,
  scale: 1,
  tx: 0,
  ty: 0,
};

// ── IDLE-SAFE MAGNETIC CURSOR & SPOTLIGHT TRACKER ─────────────────────
function tickCursor() {
  cursorRafId = null;
  ringX = lerp(ringX, cursorX, CONFIG.CURSOR_LERP);
  ringY = lerp(ringY, cursorY, CONFIG.CURSOR_LERP);

  if (cursorRing) {
    cursorRing.style.transform = `translate3d(${(ringX - 15).toFixed(1)}px, ${(ringY - 15).toFixed(1)}px, 0)`;
  }

  if (lensEnabled && !isHubOpen) {
    drawBlueprintLens();
  }

  if (Math.hypot(cursorX - ringX, cursorY - ringY) > CONFIG.CURSOR_SETTLE) {
    cursorRafId = requestAnimationFrame(tickCursor);
  }
}

if (!isCoarsePointer) {
  window.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    if (!cursorActive) {
      ringX = cursorX;
      ringY = cursorY;
      cursorActive = true;
    }
    if (cursorDot) {
      cursorDot.style.transform = `translate3d(${(cursorX - 2.5).toFixed(1)}px, ${(cursorY - 2.5).toFixed(1)}px, 0)`;
    }
    if (!cursorRafId) {
      cursorRafId = requestAnimationFrame(tickCursor);
    }
  }, { passive: true });
}

function bindMagneticHover(root = document) {
  if (isCoarsePointer || !cursorRing) return;
  const nodes = root.querySelectorAll('a, button, .action-btn, .scene-dot, .channel-pill, .split-handle');
  nodes.forEach((el) => {
    if (el.dataset.cursorBound) return;
    el.dataset.cursorBound = '1';
    el.addEventListener('mouseenter', () => {
      cursorRing.classList.add('cursor-hover');
      if (cursorLabel) {
        cursorLabel.textContent = el.classList.contains('split-handle') ? 'DRAG' : 'OPEN';
      }
    });
    el.addEventListener('mouseleave', () => {
      cursorRing.classList.remove('cursor-hover');
      if (cursorLabel) cursorLabel.textContent = '';
    });
  });
}

// MagicUI 1px Radial Spotlight Cards inside Hub
document.querySelectorAll('.spotlight-card').forEach((card) => {
  card.addEventListener('pointermove', (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${(e.clientX - rect.left).toFixed(0)}px`);
    card.style.setProperty('--mouse-y', `${(e.clientY - rect.top).toFixed(0)}px`);
  });
});

// ── MONOSPACE TEXT SCRAMBLE (MOTION-PRIMITIVES PATTERN) ───────────────
let scrambleRaf = null;
function scrambleText(el, finalMain, finalSub) {
  if (!el) return;
  cancelAnimationFrame(scrambleRaf);
  if (prefersReduced) {
    el.innerHTML = `${finalMain}<span>${finalSub}</span>`;
    return;
  }
  const chars = CONFIG.SCRAMBLE_CHARS;
  const start = performance.now();
  function step(now) {
    const t = clamp((now - start) / CONFIG.SCRAMBLE_DURATION_MS, 0, 1);
    const revealCount = Math.floor(t * finalMain.length);
    let out = '';
    for (let i = 0; i < finalMain.length; i++) {
      if (finalMain[i] === ' ') out += ' ';
      else if (i < revealCount) out += finalMain[i];
      else out += chars[(i + Math.floor(now * 0.05)) % chars.length];
    }
    el.innerHTML = `${out}<span>${finalSub}</span>`;
    if (t < 1) scrambleRaf = requestAnimationFrame(step);
  }
  scrambleRaf = requestAnimationFrame(step);
}

// ── MOBILE MENU & AI COMMAND HUB (CMDK) ───────────────────────────────
function openMobileMenu() {
  isMobileMenuOpen = true;
  if (menuToggleEl) menuToggleEl.classList.add('open');
  if (mobileOverlayEl) mobileOverlayEl.classList.add('open');
}

function closeMobileMenu() {
  isMobileMenuOpen = false;
  if (menuToggleEl) menuToggleEl.classList.remove('open');
  if (mobileOverlayEl) mobileOverlayEl.classList.remove('open');
}

function setHubFilter(filterKey) {
  document.querySelectorAll('.hub-tab').forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.filter === filterKey);
  });
  const query = (hubSearchInputEl ? hubSearchInputEl.value : '').trim().toLowerCase();
  document.querySelectorAll('#hub-scroll-body [data-cat]').forEach((item) => {
    const catMatch = filterKey === 'all' || item.dataset.cat === filterKey;
    const textBlob = `${item.textContent} ${item.dataset.keywords || ''}`.toLowerCase();
    const qMatch   = !query || textBlob.includes(query);
    item.hidden    = !(catMatch && qMatch);
  });
}

function openHub(initialFilter = 'all') {
  closeMobileMenu();
  isHubOpen = true;
  if (hubOverlayEl) {
    hubOverlayEl.classList.add('open');
    hubOverlayEl.setAttribute('aria-hidden', 'false');
  }
  if (hubSearchInputEl) hubSearchInputEl.value = '';
  setHubFilter(initialFilter);
  if (initialFilter === 'proof' && proofSectionEl) {
    setTimeout(() => proofSectionEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80);
  } else if (hubScrollBodyEl) {
    hubScrollBodyEl.scrollTop = 0;
  }
  clearBlueprintLens();
}

function closeHub() {
  isHubOpen = false;
  if (hubOverlayEl) {
    hubOverlayEl.classList.remove('open');
    hubOverlayEl.setAttribute('aria-hidden', 'true');
  }
  if (lensEnabled) drawBlueprintLens();
}

if (cmdkTriggerEl) {
  cmdkTriggerEl.addEventListener('click', () => (isHubOpen ? closeHub() : openHub('all')));
}
if (hubCloseBtnEl) {
  hubCloseBtnEl.addEventListener('click', closeHub);
}
if (hubOverlayEl) {
  hubOverlayEl.addEventListener('click', (e) => {
    if (e.target === hubOverlayEl) closeHub();
  });
}
if (mobileOpenHubEl) {
  mobileOpenHubEl.addEventListener('click', () => openHub('all'));
}

document.querySelectorAll('.hub-tab').forEach((tab) => {
  tab.addEventListener('click', () => setHubFilter(tab.dataset.filter || 'all'));
});

if (hubSearchInputEl) {
  hubSearchInputEl.addEventListener('input', () => {
    const activeTab = document.querySelector('.hub-tab.active');
    setHubFilter(activeTab ? activeTab.dataset.filter : 'all');
  });
}

if (menuToggleEl) {
  menuToggleEl.addEventListener('click', (e) => {
    e.stopPropagation();
    isMobileMenuOpen ? closeMobileMenu() : openMobileMenu();
  });
}
if (mobileOverlayEl) {
  mobileOverlayEl.addEventListener('click', (e) => {
    if (e.target === mobileOverlayEl) closeMobileMenu();
  });
}

// ── 1:1 BLUEPRINT <-> 8K SPLIT-SLIDER ENGINE (ĐIỀU 3) ─────────────────
function initProofSplitSlider() {
  if (!proofSliderEl || !proofBeforeImgEl || !proofAfterImgEl) return;

  function setSplitPercent(pct) {
    const clamped = clamp(pct, 4, 96);
    proofSliderEl.style.setProperty('--split-pos', `${clamped.toFixed(1)}%`);
    if (proofHandleEl) proofHandleEl.setAttribute('aria-valuenow', String(Math.round(clamped)));
  }

  function loadPreset(preset, btnEl) {
    if (proofPresetsEl) {
      proofPresetsEl.querySelectorAll('.preset-btn').forEach((b) => b.classList.toggle('active', b === btnEl));
    }
    proofAfterImgEl.onerror = () => {
      proofAfterImgEl.onerror = null;
      if (preset.fallbackAfter) {
        proofAfterImgEl.src = preset.fallbackAfter;
      }
    };
    proofBeforeImgEl.src = preset.beforeSrc;
    proofAfterImgEl.src  = preset.afterSrc;
    setSplitPercent(48);
  }

  if (proofPresetsEl) {
    CONFIG.proofSlider.forEach((preset, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'preset-btn' + (idx === 0 ? ' active' : '');
      btn.textContent = preset.label;
      btn.addEventListener('click', () => loadPreset(preset, btn));
      proofPresetsEl.appendChild(btn);
    });
    if (CONFIG.proofSlider[0]) {
      loadPreset(CONFIG.proofSlider[0], proofPresetsEl.querySelector('.preset-btn'));
    }
  }

  let dragging = false;
  function updateFromPointer(clientX) {
    const rect = proofSliderEl.getBoundingClientRect();
    if (!rect.width) return;
    setSplitPercent(((clientX - rect.left) / rect.width) * 100);
  }

  proofSliderEl.addEventListener('pointerdown', (e) => {
    dragging = true;
    proofSliderEl.setPointerCapture(e.pointerId);
    updateFromPointer(e.clientX);
  });
  proofSliderEl.addEventListener('pointermove', (e) => {
    if (dragging) updateFromPointer(e.clientX);
  });
  const endDrag = () => { dragging = false; };
  proofSliderEl.addEventListener('pointerup', endDrag);
  proofSliderEl.addEventListener('pointercancel', endDrag);

  if (proofHandleEl) {
    proofHandleEl.addEventListener('keydown', (e) => {
      const cur = parseFloat(proofHandleEl.getAttribute('aria-valuenow') || '48');
      if (e.key === 'ArrowLeft')  { e.preventDefault(); setSplitPercent(cur - 4); }
      if (e.key === 'ArrowRight') { e.preventDefault(); setSplitPercent(cur + 4); }
    });
  }
}
initProofSplitSlider();

// ── BUILD NAVIGATION & CHAPTER DOTS ───────────────────────────────────
const dotEls = [];

function jumpToScene(scene) {
  targetScroll = scene.start + CONFIG.SCENE_WIDTH * CONFIG.SCENE_JUMP_RATIO;
  scheduleRender();
}

if (navBrandEl) {
  navBrandEl.addEventListener('click', (e) => {
    e.preventDefault();
    closeHub();
    jumpToScene(CONFIG.scenes[0]);
  });
}

CONFIG.scenes.forEach((s, i) => {
  if (s.type !== 'image') return;
  const imgIdx = imageScenes.indexOf(s);

  if (navLinksEl) {
    const btn = document.createElement('button');
    btn.type        = 'button';
    btn.className   = 'nav-link';
    btn.textContent = s.navLabel || s.code || `0${imgIdx + 1}`;
    btn.dataset.idx = String(i);
    btn.addEventListener('click', () => jumpToScene(s));
    navLinksEl.appendChild(btn);
  }

  if (mobileMenuLinksEl) {
    const mBtn = document.createElement('a');
    mBtn.className   = 'mobile-nav-link';
    mBtn.href        = `#scene-${imgIdx + 1}`;
    mBtn.textContent = `${String(imgIdx + 1).padStart(2, '0')} · ${s.title}`;
    mBtn.dataset.idx = String(i);
    mBtn.addEventListener('click', (e) => {
      e.preventDefault();
      jumpToScene(s);
      closeMobileMenu();
    });
    mobileMenuLinksEl.appendChild(mBtn);
  }

  if (sceneDotsEl) {
    const dot = document.createElement('button');
    dot.type        = 'button';
    dot.className   = 'scene-dot';
    dot.dataset.idx = String(i);
    dot.title       = s.title || s.code;
    dot.setAttribute('aria-label', s.title || s.code);
    dot.addEventListener('click', () => jumpToScene(s));
    sceneDotsEl.appendChild(dot);
    dotEls.push({ dot, sceneIdx: i });
  }
});

// ── BUILD SCENE LAYERS & PRELOAD BLUEPRINTS ───────────────────────────
const layers = [];

CONFIG.scenes.forEach((scene) => {
  const wrap = document.createElement('div');
  wrap.className           = 'scene-layer';
  wrap.style.opacity       = '0';
  wrap.style.pointerEvents = 'none';

  if (scene.type === 'image') {
    const img = document.createElement('div');
    img.className             = 'zoom-img';
    img.style.backgroundImage = `url("${scene.src}")`;
    wrap.appendChild(img);

    // Preload 1:1 Blueprint plate for Desktop CAD X-Ray Lens
    if (scene.blueprintSrc && !isCoarsePointer) {
      const bpImg = new Image();
      bpImg.onload = () => {
        if (lensEnabled && !isHubOpen) drawBlueprintLens();
      };
      bpImg.src = scene.blueprintSrc;
      scene._bpImg = bpImg;
    }

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

    scenesEl.appendChild(wrap);
    layers.push({ scene, el: wrap, imgEl: img, canvasEl: null, ctx: null });

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
    layers.push({ scene, el: wrap, imgEl: null, canvasEl: canvas, ctx });
  }
});

// ── LAZY LOAD TRANSITION FRAMES ───────────────────────────────────────
function preloadTransition(scene) {
  if (!scene || scene.type !== 'frames' || scene._loaded) return;
  scene._loaded = true;
  for (let i = 1; i <= scene.count; i++) {
    const img = new Image();
    img.src = scene.dir + String(i).padStart(4, '0') + '.jpg';
    scene._frames.push(img);
  }
}
preloadTransition(CONFIG.scenes[1]);

// ── SOCIAL LINKS COMPONENT (ZERO INLINE MAGIC STYLES) ─────────────────
function buildSocialLinksHTML() {
  const o = CONFIG.owner;
  return `
    <div class="social-links">
      <a href="${o.youtube}" target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.8 15.5V8.5l6.2 3.5-6.2 3.5z"/></svg>
        YouTube
      </a>
      <a href="${o.facebook}" target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.88v2.27h3.32l-.53 3.49h-2.79V24C19.61 23.1 24 18.1 24 12.07z"/></svg>
        Facebook
      </a>
      <a href="${o.fbGroup}" target="_blank" rel="noopener noreferrer">◈ Group D5 VN</a>
      <a href="${o.masoiUrl}" target="_blank" rel="noopener noreferrer">🐺 Ma Sói 3D</a>
    </div>`;
}

// ── 1:1 BLUEPRINT CAD X-RAY LENS & KINETIC GRID RENDERER ──────────────
function resizeLensCanvas() {
  if (!lensCanvas) return;
  lensCanvas.width  = window.innerWidth;
  lensCanvas.height = window.innerHeight;
}
resizeLensCanvas();

function clearBlueprintLens() {
  if (lensCtx && lensCanvas) {
    lensCtx.clearRect(0, 0, lensCanvas.width, lensCanvas.height);
  }
}

function drawBlueprintLens() {
  if (!lensCtx || !lensCanvas) return;
  const cw = lensCanvas.width;
  const ch = lensCanvas.height;
  lensCtx.clearRect(0, 0, cw, ch);

  if (!lensEnabled || isHubOpen || isCoarsePointer) return;

  // 1. Subtle Kinetic Architectural Coordinate Grid modulated by scrollVelocity
  const velFactor = clamp(Math.abs(scrollVelocity) * 0.015, 0, 1);
  const gridAlpha = 0.022 + velFactor * 0.045;
  const step      = CONFIG.GRID_STEP;

  lensCtx.save();
  lensCtx.strokeStyle = `rgba(56, 189, 248, ${gridAlpha.toFixed(3)})`;
  lensCtx.lineWidth   = 1;
  lensCtx.beginPath();
  for (let x = 0; x < cw; x += step) {
    lensCtx.moveTo(x, 0);
    lensCtx.lineTo(x, ch);
  }
  for (let y = 0; y < ch; y += step) {
    lensCtx.moveTo(0, y);
    lensCtx.lineTo(cw, y);
  }
  lensCtx.stroke();
  lensCtx.restore();

  // 2. 1:1 Pixel-Synced Blueprint CAD X-Ray Reticle around cursor
  if (!cursorActive) return;
  const domScene = activeDominantState.scene;
  const bpImg    = domScene && domScene._bpImg;
  const radius   = CONFIG.LENS_RADIUS;

  lensCtx.save();
  lensCtx.beginPath();
  lensCtx.arc(ringX, ringY, radius, 0, Math.PI * 2);
  lensCtx.clip();

  if (bpImg && bpImg.complete && bpImg.naturalWidth > 0) {
    // Replicate exact .zoom-img geometry (inset: -8% => 1.16x box + scale + translate%)
    const boxW   = cw * 1.16;
    const boxH   = ch * 1.16;
    const coverS = Math.max(boxW / bpImg.naturalWidth, boxH / bpImg.naturalHeight);
    const drawW  = bpImg.naturalWidth * coverS;
    const drawH  = bpImg.naturalHeight * coverS;

    lensCtx.translate(cw * 0.5, ch * 0.5);
    lensCtx.scale(activeDominantState.scale, activeDominantState.scale);
    lensCtx.translate(
      (activeDominantState.tx / 100) * boxW,
      (activeDominantState.ty / 100) * boxH
    );
    lensCtx.drawImage(bpImg, -drawW * 0.5, -drawH * 0.5, drawW, drawH);
  } else {
    lensCtx.fillStyle = 'rgba(7, 14, 26, 0.32)';
    lensCtx.fillRect(ringX - radius, ringY - radius, radius * 2, radius * 2);
  }
  lensCtx.restore();

  // Technical CAD Reticle Ring & Tick Marks
  lensCtx.save();
  lensCtx.strokeStyle = 'rgba(56, 189, 248, 0.72)';
  lensCtx.lineWidth   = 1.2;
  lensCtx.beginPath();
  lensCtx.arc(ringX, ringY, radius, 0, Math.PI * 2);
  lensCtx.stroke();

  lensCtx.strokeStyle = 'rgba(200, 169, 110, 0.65)';
  lensCtx.beginPath();
  lensCtx.moveTo(ringX - radius - 8, ringY);
  lensCtx.lineTo(ringX - radius + 6, ringY);
  lensCtx.moveTo(ringX + radius - 6, ringY);
  lensCtx.lineTo(ringX + radius + 8, ringY);
  lensCtx.moveTo(ringX, ringY - radius - 8);
  lensCtx.lineTo(ringX, ringY - radius + 6);
  lensCtx.moveTo(ringX, ringY + radius - 6);
  lensCtx.lineTo(ringX, ringY + radius + 8);
  lensCtx.stroke();

  lensCtx.font      = '10px "Space Mono", monospace';
  lensCtx.fillStyle = 'rgba(56, 189, 248, 0.88)';
  lensCtx.fillText('CAD 1:1', ringX + 12, ringY - radius + 18);
  lensCtx.restore();
}

if (lensToggleEl) {
  lensToggleEl.classList.toggle('lens-active', lensEnabled);
  lensToggleEl.addEventListener('click', () => {
    lensEnabled = !lensEnabled;
    lensToggleEl.classList.toggle('lens-active', lensEnabled);
    if (lensEnabled) drawBlueprintLens();
    else clearBlueprintLens();
  });
}

// ── INFO PANEL UPDATE (MASKED SPLIT-LINE REVEAL — ZERO BLUR) ──────────
let currentInfoScene = null;

function triggerMaskReveal(el) {
  if (!el || prefersReduced) return;
  el.classList.remove('mask-enter');
  void el.offsetWidth;
  el.classList.add('mask-enter');
}

function updateInfoPanel(scene) {
  if (!scene || scene.type !== 'image' || scene === currentInfoScene) return;
  currentInfoScene = scene;

  const imgIdx   = imageScenes.indexOf(scene);
  const sceneIdx = CONFIG.scenes.indexOf(scene);

  if (imgIdx !== -1 && sceneCurrentEl) {
    sceneCurrentEl.textContent = String(imgIdx + 1).padStart(2, '0');
  }
  dotEls.forEach(({ dot, sceneIdx: dIdx }) => {
    dot.classList.toggle('active', sceneIdx === dIdx);
  });

  if (telemetryStatusEl) telemetryStatusEl.textContent = scene.telemetry || '';
  if (projectLabelEl)    projectLabelEl.textContent    = scene.label || '';
  if (coordinatesEl)     coordinatesEl.textContent     = scene.coords || '';

  if (sceneTitleEl) {
    sceneTitleEl.textContent = scene.title || '';
    triggerMaskReveal(sceneTitleEl);
  }
  if (sceneSubEl) {
    sceneSubEl.textContent = scene.subtitle || '';
    triggerMaskReveal(sceneSubEl);
  }

  scrambleText(sceneCodeEl, scene.code || '', scene.codeLabel || '');

  if (sceneSpecsEl) {
    sceneSpecsEl.innerHTML = (scene.specs || []).map((s) => `<li>${s}</li>`).join('');
  }

  // Bottom bar contextual CTA
  if (sceneCtaEl) {
    sceneCtaEl.innerHTML = '';
    if (scene.cta && scene.ctaHubFilter) {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = scene.cta;
      b.addEventListener('click', () => openHub(scene.ctaHubFilter));
      sceneCtaEl.appendChild(b);
    } else if (scene.cta && scene.ctaUrl) {
      const a = document.createElement('a');
      a.href = scene.ctaUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = scene.cta;
      sceneCtaEl.appendChild(a);
    }
  }

  // Dynamic Action Buttons
  if (sceneActionsEl) {
    sceneActionsEl.innerHTML = '';
    (scene.actionLinks || []).forEach((link) => {
      if (link.hubFilter) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'action-btn' + (link.style ? ` ${link.style}` : '');
        btn.textContent = link.text;
        btn.addEventListener('click', () => openHub(link.hubFilter));
        sceneActionsEl.appendChild(btn);
      } else if (link.url) {
        const a = document.createElement('a');
        a.className = 'action-btn' + (link.style ? ` ${link.style}` : '');
        a.href = link.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = link.text;
        sceneActionsEl.appendChild(a);
      }
    });
  }

  if (sceneSocialSlotEl) {
    sceneSocialSlotEl.innerHTML = scene.showSocial ? buildSocialLinksHTML() : '';
  }

  document.querySelectorAll('.nav-link').forEach((btn) => {
    btn.classList.toggle('active', Number(btn.dataset.idx) === sceneIdx);
  });
  document.querySelectorAll('.mobile-nav-link').forEach((btn) => {
    btn.classList.toggle('active', Number(btn.dataset.idx) === sceneIdx);
  });

  bindMagneticHover(document.getElementById('info-panel') || document);
  if (sceneCtaEl) bindMagneticHover(sceneCtaEl);

  // Lazy preload adjacent 752-frame AI transitions
  preloadTransition(CONFIG.scenes[sceneIdx - 1]);
  preloadTransition(CONFIG.scenes[sceneIdx + 1]);
  if (sceneIdx === 0) preloadTransition(CONFIG.scenes[CONFIG.scenes.length - 1]);
}

// ── KINETIC VIRTUAL SCROLL & RENDER ENGINE (60FPS LOCKED) ─────────────
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

function render() {
  rafId = null;
  const prevScroll = currentScroll;
  currentScroll    = lerp(currentScroll, targetScroll, CONFIG.lerpFactor);
  scrollVelocity   = currentScroll - prevScroll;

  const s = ((currentScroll % TOTAL_SCROLL) + TOTAL_SCROLL) % TOTAL_SCROLL;
  if (progressBar) {
    progressBar.style.width = `${((s / TOTAL_SCROLL) * 100).toFixed(2)}%`;
  }
  if (scrollHint) {
    const movedFromInit = Math.abs(s - (CONFIG.scenes[0].start + CONFIG.CROSSFADE + 1));
    scrollHint.style.opacity = movedFromInit < CONFIG.SCROLL_HINT_HIDE ? '1' : '0';
  }
  if (scrollTelemetryEl) {
    scrollTelemetryEl.textContent = `VEL ${Math.abs(scrollVelocity).toFixed(1).padStart(4, '0')} · 1:1`;
  }

  let dominantScene    = null;
  let dominantOpacity  = -1;
  let dominantScale    = 1;
  let dominantTx       = 0;
  let dominantTy       = 0;

  layers.forEach(({ scene, el, imgEl, canvasEl, ctx }) => {
    const progress = map01(s, scene.start, scene.end);

    if (progress <= 0 || progress >= 1) {
      if (el.style.opacity !== '0') {
        el.style.opacity       = '0';
        el.style.pointerEvents = 'none';
      }
      return;
    }

    if (scene.type === 'frames') {
      const fade = CONFIG.FRAME_FADE_ZONE;
      let opacity = 1;
      if (progress < fade)          opacity = progress / fade;
      else if (progress > 1 - fade) opacity = (1 - progress) / fade;
      el.style.opacity = opacity.toFixed(3);

      if (scene._frames.length > 0 && ctx && canvasEl) {
        const idx   = Math.min(Math.floor(progress * scene._frames.length), scene._frames.length - 1);
        const frame = scene._frames[idx];
        if (frame && frame.complete && frame.naturalWidth) {
          const cw = canvasEl.width, ch = canvasEl.height;
          const scale = Math.max(cw / frame.naturalWidth, ch / frame.naturalHeight);
          const w = frame.naturalWidth * scale, h = frame.naturalHeight * scale;
          ctx.drawImage(frame, (cw - w) * 0.5, (ch - h) * 0.5, w, h);
        }
      }
      return;
    }

    let opacity = 1;
    if (progress < IMAGE_FADE_ZONE)          opacity = progress / IMAGE_FADE_ZONE;
    else if (progress > 1 - IMAGE_FADE_ZONE) opacity = (1 - progress) / IMAGE_FADE_ZONE;

    if (opacity < CONFIG.OPACITY_CUTOFF) {
      el.style.opacity       = '0';
      el.style.pointerEvents = 'none';
      return;
    }

    el.style.opacity = opacity.toFixed(3);

    const rawT  = map01(s, scene.start + IMAGE_FADE_INNER, scene.end - IMAGE_FADE_INNER);
    const scale = lerp(scene.zoom.from, scene.zoom.to, rawT);
    const tx    = lerp(scene.pan.fromX, scene.pan.toX, rawT);
    const ty    = lerp(scene.pan.fromY, scene.pan.toY, rawT);
    imgEl.style.transform = `scale(${scale.toFixed(4)}) translate3d(${tx.toFixed(2)}%, ${ty.toFixed(2)}%, 0)`;

    if (opacity > dominantOpacity) {
      dominantOpacity = opacity;
      dominantScene   = scene;
      dominantScale   = scale;
      dominantTx      = tx;
      dominantTy      = ty;
    }
  });

  if (dominantScene) {
    activeDominantState.scene = dominantScene;
    activeDominantState.scale = dominantScale;
    activeDominantState.tx    = dominantTx;
    activeDominantState.ty    = dominantTy;
    updateInfoPanel(dominantScene);
  }

  if (lensEnabled && !isHubOpen) {
    drawBlueprintLens();
  }

  if (Math.abs(targetScroll - currentScroll) > CONFIG.LERP_SETTLE) {
    scheduleRender();
  } else {
    scrollVelocity = 0;
    if (scrollTelemetryEl) scrollTelemetryEl.textContent = 'VEL 00.0 · 1:1';
    if (lensEnabled && !isHubOpen) drawBlueprintLens();
  }
}

function scheduleRender() {
  if (!rafId) rafId = requestAnimationFrame(render);
}

// ── INPUT LISTENERS (ISOLATED WHEN HUB OR MENU IS OPEN) ───────────────
window.addEventListener('wheel', (e) => {
  if (isHubOpen || isMobileMenuOpen) return;
  e.preventDefault();
  addScroll(e.deltaY * CONFIG.scrollSensitivity);
}, { passive: false });

let lastTouchY      = null;
let lastTouchTime   = null;
let touchVelocity   = 0;
let touchInertiaRaf = null;

window.addEventListener('touchstart', (e) => {
  if (isHubOpen || isMobileMenuOpen) return;
  lastTouchY    = e.touches[0].clientY;
  lastTouchTime = performance.now();
  touchVelocity = 0;
  cancelAnimationFrame(touchInertiaRaf);
}, { passive: true });

window.addEventListener('touchmove', (e) => {
  if (isHubOpen || isMobileMenuOpen || lastTouchY === null) return;
  const now    = performance.now();
  const dt     = now - lastTouchTime;
  const deltaY = lastTouchY - e.touches[0].clientY;

  addScroll(deltaY * CONFIG.TOUCH_MULTIPLIER);
  if (dt > 0) touchVelocity = (deltaY * CONFIG.TOUCH_MULTIPLIER) / dt;

  lastTouchY    = e.touches[0].clientY;
  lastTouchTime = now;
}, { passive: true });

window.addEventListener('touchend', () => {
  if (lastTouchY === null) return;
  lastTouchY = null;
  if (Math.abs(touchVelocity) > CONFIG.TOUCH_VELOCITY_MIN) {
    let velocity = clamp(
      touchVelocity * CONFIG.TOUCH_FRAME_MS,
      -CONFIG.TOUCH_MAX_SPEED,
      CONFIG.TOUCH_MAX_SPEED
    );
    function applyInertia() {
      addScroll(velocity);
      velocity *= CONFIG.TOUCH_DAMPING;
      if (Math.abs(velocity) > CONFIG.TOUCH_STOP_EPSILON) {
        touchInertiaRaf = requestAnimationFrame(applyInertia);
      }
    }
    touchInertiaRaf = requestAnimationFrame(applyInertia);
  }
}, { passive: true });

window.addEventListener('keydown', (e) => {
  // Global Ctrl+K / Cmd+K Command Palette Shortcut
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    isHubOpen ? closeHub() : openHub('all');
    return;
  }
  if (e.key === 'Escape') {
    if (isHubOpen) closeHub();
    if (isMobileMenuOpen) closeMobileMenu();
    return;
  }
  if (isHubOpen || isMobileMenuOpen) return;
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') addScroll(CONFIG.KEYBOARD_STEP);
  if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  addScroll(-CONFIG.KEYBOARD_STEP);
});

window.addEventListener('resize', () => {
  layers.forEach(({ scene, canvasEl }) => {
    if (scene.type === 'frames' && canvasEl) {
      canvasEl.width  = window.innerWidth;
      canvasEl.height = window.innerHeight;
    }
  });
  resizeLensCanvas();
  scheduleRender();
});

// ── LOADING TELEMETRY & HERO PRELOAD ──────────────────────────────────
let loadingHidden = false;
function setLoadingProgress(pct) {
  const c = clamp(pct, 0, 100);
  if (loadingFillEl) loadingFillEl.style.transform = `scaleX(${(c / 100).toFixed(2)})`;
  if (loadingPctEl)  loadingPctEl.textContent      = `${String(Math.round(c)).padStart(2, '0')}%`;
}

function hideLoading() {
  if (loadingHidden || !loadingEl) return;
  loadingHidden = true;
  setLoadingProgress(100);
  loadingEl.classList.add('hidden');
  setTimeout(() => loadingEl.remove(), CONFIG.LOADING_HIDE_DELAY);
}

setLoadingProgress(38);
const heroProbe = new Image();
heroProbe.onload = heroProbe.onerror = hideLoading;
heroProbe.src = CONFIG.scenes[0].src;
setTimeout(hideLoading, CONFIG.LOADING_FALLBACK_MS);

// ── RAF-BASED SPATIAL AUDIO FADER (ZERO SETINTERVAL) ──────────────────
const bgAudio     = document.getElementById('bg-audio');
const audioToggle = document.getElementById('audio-toggle');
let audioFadeRaf  = null;

function fadeAudio(targetVol, durationMs, onComplete) {
  if (!bgAudio) return;
  cancelAnimationFrame(audioFadeRaf);
  const startVol  = bgAudio.volume;
  const startTime = performance.now();

  function tick(now) {
    const t = clamp((now - startTime) / durationMs, 0, 1);
    bgAudio.volume = clamp(lerp(startVol, targetVol, t), 0, 1);
    if (t < 1) {
      audioFadeRaf = requestAnimationFrame(tick);
    } else if (onComplete) {
      onComplete();
    }
  }
  audioFadeRaf = requestAnimationFrame(tick);
}

if (audioToggle && bgAudio) {
  bgAudio.volume = 0;
  audioToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (bgAudio.paused) {
      bgAudio.play().then(() => {
        audioToggle.classList.remove('audio-muted');
        fadeAudio(CONFIG.AUDIO_MAX_VOL, CONFIG.AUDIO_FADE_IN_MS);
      }).catch(() => {});
    } else {
      fadeAudio(0, CONFIG.AUDIO_FADE_OUT_MS, () => {
        bgAudio.pause();
        audioToggle.classList.add('audio-muted');
      });
    }
  });
}

// ── INIT AT FULL OPACITY (CRITICAL-01 FIX: +CROSSFADE + 1) ────────────
bindMagneticHover(document);
const _initPos = CONFIG.scenes[0].start + CONFIG.CROSSFADE + 1;
targetScroll   = _initPos;
currentScroll  = _initPos;
updateInfoPanel(CONFIG.scenes[0]);
scheduleRender();
