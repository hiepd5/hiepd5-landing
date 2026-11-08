// Zero-Asset ($0, 0 KB external MP3) Procedural WebAudio Micro-SFX Engine inspired by ActiveTheory.net
// Default OFF until explicitly toggled ON by user.

let audioCtx = null;
let enabled = false;
let lastHoverAt = 0;
let lastSpinAt = 0;

function getCtx() {
  if (!enabled || typeof window === 'undefined') return null;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) {
    audioCtx = new Ctx();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function setMicroAudioEnabled(val) {
  enabled = Boolean(val);
  if (enabled) {
    const ctx = getCtx();
    if (ctx) playPressPulse();
  }
}

export function isMicroAudioEnabled() {
  return enabled;
}

export function playHoverTick() {
  const nowMs = performance.now();
  if (nowMs - lastHoverAt < 45) return;
  lastHoverAt = nowMs;

  const ctx = getCtx();
  if (!ctx) return;

  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(1680, t);
  osc.frequency.exponentialRampToValueAtTime(2420, t + 0.022);

  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.linearRampToValueAtTime(0.022, t + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.028);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.032);
}

export function playPressPulse() {
  const ctx = getCtx();
  if (!ctx) return;

  const t = ctx.currentTime;
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();

  osc1.type = 'triangle';
  osc2.type = 'sine';
  osc1.frequency.setValueAtTime(320, t);
  osc1.frequency.exponentialRampToValueAtTime(580, t + 0.055);
  osc2.frequency.setValueAtTime(960, t);
  osc2.frequency.exponentialRampToValueAtTime(1280, t + 0.055);

  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.linearRampToValueAtTime(0.04, t + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.075);

  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(ctx.destination);

  osc1.start(t);
  osc2.start(t);
  osc1.stop(t + 0.08);
  osc2.stop(t + 0.08);
}

const CHAPTER_FREQS = [523.25, 587.33, 659.25, 783.99, 880.0];

export function playChapterChime(chapterIdx = 0) {
  const ctx = getCtx();
  if (!ctx) return;

  const t = ctx.currentTime;
  const baseFreq = CHAPTER_FREQS[chapterIdx % CHAPTER_FREQS.length];
  const osc = ctx.createOscillator();
  const oscHarm = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  oscHarm.type = 'sine';
  osc.frequency.setValueAtTime(baseFreq, t);
  oscHarm.frequency.setValueAtTime(baseFreq * 1.5, t);

  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.linearRampToValueAtTime(0.026, t + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);

  osc.connect(gain);
  oscHarm.connect(gain);
  gain.connect(ctx.destination);

  osc.start(t);
  oscHarm.start(t);
  osc.stop(t + 0.3);
  oscHarm.stop(t + 0.3);
}

export function playSpinRatchet(speed = 1) {
  const nowMs = performance.now();
  const interval = Math.max(55, 130 - Math.min(60, speed * 18));
  if (nowMs - lastSpinAt < interval) return;
  lastSpinAt = nowMs;

  const ctx = getCtx();
  if (!ctx) return;

  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(880 + Math.min(600, speed * 110), t);
  osc.frequency.exponentialRampToValueAtTime(520, t + 0.018);

  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.linearRampToValueAtTime(0.015, t + 0.003);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.02);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.024);
}
