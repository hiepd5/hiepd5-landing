import React, { useEffect, useRef } from 'react';
import { ARCHITECT_DATA } from '../config/architectData';

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

/**
 * V5.0 Lean Magnetic Reticle + Bioluminescent Wake Trail
 * - Auto-Sleeps (`0 FPS`, `0%` CPU) when cursor rests & wakes instantly on pointer input!
 */
export default function ActiveTheoryCursor({ activeChapter = 0 }) {
  const canvasRef = useRef(null);
  const chapterRef = useRef(activeChapter);
  const wakeRef = useRef(null);
  chapterRef.current = activeChapter;

  useEffect(() => {
    wakeRef.current?.();
  }, [activeChapter]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reducedMotion) return undefined;

    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const mouse = { x: width * 0.5, y: height * 0.5, visible: false, down: false };
    const ring = { x: width * 0.5, y: height * 0.5, vx: 0, vy: 0, radius: 15 };
    let hoveredRect = null;
    const particles = [];

    const colPrimary = [...hexToRgb(ARCHITECT_DATA.palettes[0].primary)];
    const colSecondary = [...hexToRgb(ARCHITECT_DATA.palettes[0].secondary)];

    let rafId = 0;
    let running = false;
    let rotTick = 0;

    const spawnParticle = (x, y, vx, vy, boost = 1) => {
      if (particles.length > 44) particles.shift();
      particles.push({
        x,
        y,
        vx: vx * 0.14 + (Math.random() - 0.5) * 0.65 * boost,
        vy: vy * 0.14 + (Math.random() - 0.5) * 0.65 * boost,
        life: 1.0,
        decay: 0.028 + Math.random() * 0.016,
        size: (3.0 + Math.random() * 4.4) * boost,
        mix: Math.random(),
      });
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const pal = ARCHITECT_DATA.palettes[chapterRef.current] || ARCHITECT_DATA.palettes[0];
      const tgtP = hexToRgb(pal.primary);
      const tgtS = hexToRgb(pal.secondary);

      let colorDelta = 0;
      for (let c = 0; c < 3; c += 1) {
        const dp = tgtP[c] - colPrimary[c];
        const ds = tgtS[c] - colSecondary[c];
        colPrimary[c] += dp * 0.1;
        colSecondary[c] += ds * 0.1;
        colorDelta += Math.abs(dp) + Math.abs(ds);
      }

      const r1 = Math.round(colPrimary[0]);
      const g1 = Math.round(colPrimary[1]);
      const b1 = Math.round(colPrimary[2]);
      const r2 = Math.round(colSecondary[0]);
      const g2 = Math.round(colSecondary[1]);
      const b2 = Math.round(colSecondary[2]);

      if (particles.length > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = particles.length - 1; i >= 0; i -= 1) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.93;
          p.vy *= 0.93;
          p.life -= p.decay;

          if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
          }

          const pr = Math.round(r1 * (1 - p.mix) + r2 * p.mix);
          const pg = Math.round(g1 * (1 - p.mix) + g2 * p.mix);
          const pb = Math.round(b1 * (1 - p.mix) + b2 * p.mix);
          const rad = p.size * (0.45 + p.life * 0.75);

          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad * 2.0);
          grad.addColorStop(0, `rgba(${pr}, ${pg}, ${pb}, ${(p.life * 0.42).toFixed(3)})`);
          grad.addColorStop(0.5, `rgba(${pr}, ${pg}, ${pb}, ${(p.life * 0.15).toFixed(3)})`);
          grad.addColorStop(1, `rgba(${pr}, ${pg}, ${pb}, 0)`);

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, rad * 2.0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      let ringSpeed = 0;
      let ringDist = 0;

      if (mouse.visible) {
        let targetX = mouse.x;
        let targetY = mouse.y;
        let targetRad = mouse.down ? 11 : 15;

        if (hoveredRect) {
          const cx = hoveredRect.left + hoveredRect.width / 2;
          const cy = hoveredRect.top + hoveredRect.height / 2;
          targetX = mouse.x + (cx - mouse.x) * 0.28;
          targetY = mouse.y + (cy - mouse.y) * 0.28;
          targetRad = mouse.down ? 19 : 23;
        }

        const ax = (targetX - ring.x) * 0.22;
        const ay = (targetY - ring.y) * 0.22;
        ring.vx = (ring.vx + ax) * 0.62;
        ring.vy = (ring.vy + ay) * 0.62;
        ring.x += ring.vx;
        ring.y += ring.vy;
        ring.radius += (targetRad - ring.radius) * 0.2;

        ringSpeed = Math.hypot(ring.vx, ring.vy);
        ringDist = Math.hypot(targetX - ring.x, targetY - ring.y);
        const stretch = hoveredRect ? 1 : Math.min(1.4, 1 + ringSpeed * 0.025);
        const angle = Math.atan2(ring.vy, ring.vx);
        rotTick += 0.025;

        ctx.save();
        ctx.translate(ring.x, ring.y);
        ctx.rotate(hoveredRect ? rotTick : angle);
        ctx.scale(stretch, 1 / Math.sqrt(stretch));

        ctx.strokeStyle = hoveredRect
          ? `rgba(${r1}, ${g1}, ${b1}, 0.88)`
          : `rgba(${r2}, ${g2}, ${b2}, 0.62)`;
        ctx.lineWidth = hoveredRect ? 1.45 : 1.15;

        if (hoveredRect) {
          ctx.setLineDash([6, 5]);
        }
        ctx.beginPath();
        ctx.arc(0, 0, ring.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = `rgb(${r1}, ${g1}, ${b1})`;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouse.down ? 3.2 : 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Auto-Sleep Gate: 0 FPS when settled & not hovering interactive elements!
      const isSettled =
        particles.length === 0 &&
        !hoveredRect &&
        !mouse.down &&
        ringSpeed < 0.04 &&
        ringDist < 0.25 &&
        colorDelta < 1.5;

      if (isSettled) {
        running = false;
        rafId = 0;
      } else {
        rafId = requestAnimationFrame(render);
      }
    };

    const wake = () => {
      if (!running) {
        running = true;
        rafId = requestAnimationFrame(render);
      }
    };
    wakeRef.current = wake;

    let prevX = mouse.x;
    let prevY = mouse.y;

    const onMove = (e) => {
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      prevX = e.clientX;
      prevY = e.clientY;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.visible = true;

      const interactive = e.target?.closest?.('button, a');
      hoveredRect = interactive ? interactive.getBoundingClientRect() : null;

      const dist = Math.hypot(dx, dy);
      if (dist > 2.0) {
        spawnParticle(mouse.x, mouse.y, dx, dy, mouse.down ? 1.3 : 1.0);
      }
      wake();
    };

    const onDown = (e) => {
      mouse.down = true;
      for (let i = 0; i < 6; i += 1) {
        const ang = (i / 6) * Math.PI * 2;
        spawnParticle(e.clientX, e.clientY, Math.cos(ang) * 8.5, Math.sin(ang) * 8.5, 1.3);
      }
      wake();
    };

    const onUp = () => {
      mouse.down = false;
      wake();
    };

    const onLeave = () => {
      mouse.visible = false;
      hoveredRect = null;
      wake();
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    window.addEventListener('resize', resize);
    document.addEventListener('mouseleave', onLeave);

    return () => {
      wakeRef.current = null;
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('resize', resize);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="at-cursor-canvas" aria-hidden="true" />;
}
