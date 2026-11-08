import React, { useCallback, useEffect, useRef, useState } from 'react';
import { KineticBtn } from './SpatialHUD';

export default function OverviewProofDrawer({
  data,
  lang = 'vi',
  onToggleLang,
  onClose,
}) {
  const { ui, proofCases } = data;
  const ov = ui.overview;

  const [caseIdx, setCaseIdx] = useState(0);
  const [splitPct, setSplitPct] = useState(52);
  const [dragging, setDragging] = useState(false);
  const stageRef = useRef(null);

  const activeCase = proofCases[caseIdx] || proofCases[0];

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const updateSplitFromClientX = useCallback((clientX) => {
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const raw = ((clientX - rect.left) / Math.max(1, rect.width)) * 100;
    setSplitPct(Math.min(96, Math.max(4, Number(raw.toFixed(1)))));
  }, []);

  const handlePointerDown = useCallback(
    (e) => {
      if (e.target.closest('button')) return;
      setDragging(true);
      e.currentTarget.setPointerCapture?.(e.pointerId);
      updateSplitFromClientX(e.clientX);
    },
    [updateSplitFromClientX]
  );

  const handlePointerMove = useCallback(
    (e) => {
      if (!dragging) return;
      updateSplitFromClientX(e.clientX);
    },
    [dragging, updateSplitFromClientX]
  );

  const handlePointerUp = useCallback(() => {
    setDragging(false);
  }, []);

  return (
    <div
      className="overview-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={ov.heading}
      onClick={onClose}
    >
      <div className="overview-sheet" onClick={(e) => e.stopPropagation()}>

        {/* HEADER */}
        <div className="overview-header">
          <div>
            <div className="chapter-eyebrow">{ov.eyebrow}</div>
            <h2 className="overview-title">{ov.heading}</h2>
            <p className="overview-lead">{ov.lead}</p>
          </div>

          <div className="overview-header-actions">
            <KineticBtn variant="chip" onClick={onToggleLang} title={ui.langSwitchTitle}>
              {lang === 'vi' ? 'EN' : 'VI'}
            </KineticBtn>
            <KineticBtn variant="chip" icon="close" onClick={onClose}>
              {ui.closeBtn}
            </KineticBtn>
          </div>
        </div>

        {/* 4 KEY METRIC CELLS */}
        <div className="overview-stats-grid">
          {ov.stats.map((st, i) => (
            <div key={i} className="overview-stat-card">
              <span className="overview-stat-val">{st.value}</span>
              <span className="overview-stat-lbl">{st.label}</span>
            </div>
          ))}
        </div>

        {/* INTERACTIVE 1:1 BLUEPRINT <-> 8K RENDER SPLIT-SLIDER */}
        <section className="proof-section">
          <div className="proof-topbar">
            <div className="proof-tabs" role="tablist">
              {proofCases.map((c, idx) => (
                <KineticBtn
                  key={c.id}
                  variant="chip"
                  active={idx === caseIdx}
                  onClick={() => setCaseIdx(idx)}
                >
                  {c.tab}
                </KineticBtn>
              ))}
            </div>

            <div className="proof-quick-splits">
              <KineticBtn variant="chip" active={splitPct > 84} onClick={() => setSplitPct(92)}>
                CAD
              </KineticBtn>
              <KineticBtn
                variant="chip"
                active={splitPct >= 42 && splitPct <= 58}
                onClick={() => setSplitPct(50)}
              >
                50 : 50
              </KineticBtn>
              <KineticBtn variant="chip" active={splitPct < 16} onClick={() => setSplitPct(8)}>
                8K PBR
              </KineticBtn>
            </div>
          </div>

          <div
            ref={stageRef}
            className={`proof-slider-stage ${dragging ? 'is-dragging' : ''}`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {/* Base Full 8K Photorealistic Render */}
            <img
              src={activeCase.render}
              alt={activeCase.title}
              className="proof-img proof-img-render"
              loading="lazy"
              decoding="async"
              draggable={false}
            />

            {/* Clipped 1:1 CAD Blueprint Overlay */}
            <img
              src={activeCase.bp}
              alt={`${activeCase.title} — 1:1 Blueprint`}
              className="proof-img proof-img-bp"
              style={{ clipPath: `inset(0 ${100 - splitPct}% 0 0)` }}
              loading="lazy"
              decoding="async"
              draggable={false}
            />

            {/* Corner Spec Badges */}
            <span className="proof-corner-tag is-left">{ov.sliderLabelLeft}</span>
            <span className="proof-corner-tag is-right">{ov.sliderLabelRight}</span>

            {/* Laser Split Divider Line + Chamfered Diamond Handle */}
            <div className="proof-divider-line" style={{ left: `${splitPct}%` }} aria-hidden="true">
              <div className="proof-divider-knob" />
            </div>
          </div>

          <div className="proof-caption-bar">
            <div>
              <strong className="proof-case-title">{activeCase.title}</strong>
              <p className="proof-case-sub">{activeCase.caption}</p>
            </div>
            <div className="proof-metrics-row">
              {activeCase.metrics.map((m, i) => (
                <span key={i} className="proof-metric-badge">
                  {m}
                </span>
              ))}
            </div>
          </div>
          <div className="proof-hint-line">{ov.sliderHint}</div>
        </section>

        {/* 3 CORE REVENUE & B2B PILLARS (CRO GATE — ĐIỀU 8) */}
        <section className="pillars-section">
          <div className="chapter-eyebrow" style={{ marginBottom: '10px' }}>
            {ov.pillarsTitle}
          </div>
          <div className="pillars-grid">
            {ov.pillars.map((p, idx) => (
              <article key={idx} className="pillar-card">
                <div className="pillar-tag">{p.tag}</div>
                <h3 className="pillar-title">{p.title}</h3>
                <div className="pillar-price">{p.price}</div>
                <p className="pillar-desc">{p.desc}</p>
                <div className="pillar-cta">
                  <KineticBtn variant={idx === 0 ? 'accent' : 'glass'} trailingIcon="arrowUpRight" href={p.url}>
                    {p.ctaLabel}
                  </KineticBtn>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* FOOTER DIRECT ACTION BAR */}
        <div className="overview-footer-bar">
          <span className="overview-footer-text">{ov.directBarText}</span>
          <div className="overview-footer-ctas">
            <KineticBtn variant="accent" icon="phone" trailingIcon="arrowUpRight" href={ov.primaryContactUrl}>
              {ov.primaryContactLabel}
            </KineticBtn>
            <KineticBtn variant="glass" icon="mail" href={ov.secondaryContactUrl}>
              {ov.secondaryContactLabel}
            </KineticBtn>
            <KineticBtn variant="chip" onClick={onClose}>
              {ov.backTo3dLabel}
            </KineticBtn>
          </div>
        </div>
      </div>
    </div>
  );
}
