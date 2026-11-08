import React, { useCallback, useRef, useState } from 'react';
import { ARCHITECT_DATA, recordBetaSignal } from '../config/architectData';
import { KineticBtn } from './SpatialHUD';
import Icon from './Icons';

function MiniCompareFrame({ beforeSrc, afterSrc, beforeLabel, afterLabel, alt }) {
  const [pct, setPct] = useState(50);
  const [dragging, setDragging] = useState(false);
  const boxRef = useRef(null);

  const updatePct = useCallback((clientX) => {
    const el = boxRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const raw = ((clientX - rect.left) / Math.max(1, rect.width)) * 100;
    setPct(Math.min(95, Math.max(5, Number(raw.toFixed(1)))));
  }, []);

  const onDown = useCallback(
    (e) => {
      setDragging(true);
      e.currentTarget.setPointerCapture?.(e.pointerId);
      updatePct(e.clientX);
    },
    [updatePct]
  );

  const onMove = useCallback(
    (e) => {
      if (!dragging) return;
      updatePct(e.clientX);
    },
    [dragging, updatePct]
  );

  const onUp = useCallback(() => {
    setDragging(false);
  }, []);

  return (
    <div
      ref={boxRef}
      className={`bento-compare-stage ${dragging ? 'is-dragging' : ''}`}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      <img
        src={afterSrc}
        alt={alt}
        className="bento-compare-img"
        loading="lazy"
        decoding="async"
        draggable={false}
      />
      <img
        src={beforeSrc}
        alt={`${alt} — wireframe`}
        className="bento-compare-img is-before"
        style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}
        loading="lazy"
        decoding="async"
        draggable={false}
      />
      <span className="bento-compare-tag is-left">{beforeLabel}</span>
      <span className="bento-compare-tag is-right">{afterLabel}</span>
      <div className="bento-compare-line" style={{ left: `${pct}%` }} aria-hidden="true">
        <span className="bento-compare-knob" />
      </div>
    </div>
  );
}

function MapPlaceholderFrame({ title, sub, attribution }) {
  return (
    <div className="bento-slot-frame is-map">
      <svg className="bento-map-grid" viewBox="0 0 480 300" fill="none" aria-hidden="true">
        <g stroke="currentColor" strokeOpacity="0.12" strokeWidth="1">
          <path d="M0 60h480M0 120h480M0 180h480M0 240h480" />
          <path d="M80 0v300M160 0v300M240 0v300M320 0v300M400 0v300" />
        </g>
        <path
          d="M36 226C112 194 156 112 242 118s126 74 206 42"
          stroke="currentColor"
          strokeOpacity="0.28"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <rect
          x="148"
          y="78"
          width="184"
          height="136"
          rx="10"
          stroke="#ff7a59"
          strokeOpacity="0.75"
          strokeWidth="1.5"
        />
        <rect x="176" y="104" width="54" height="38" rx="4" fill="currentColor" fillOpacity="0.08" />
        <rect x="242" y="104" width="62" height="56" rx="4" fill="currentColor" fillOpacity="0.11" />
        <rect x="176" y="152" width="54" height="40" rx="4" fill="currentColor" fillOpacity="0.06" />
      </svg>

      <div className="bento-slot-caption">
        <span className="bento-slot-icon">
          <Icon name="map" size={20} />
        </span>
        <strong className="bento-slot-title">{title}</strong>
        <span className="bento-slot-sub">{sub}</span>
      </div>

      {attribution && <span className="bento-osm-badge">{attribution}</span>}
    </div>
  );
}

export default function PluginShowcase({ data = ARCHITECT_DATA, onOpenOverview }) {
  const { owner, showcase } = data;
  const [betaOptIn, setBetaOptIn] = useState(false);
  const [consentPulse, setConsentPulse] = useState(false);
  const consentRef = useRef(null);

  if (!showcase) return null;
  const [renderPlugin, mapPlugin] = showcase.plugins;
  const { gallery, betaConsent } = showcase;

  const handleBetaRequest = useCallback(
    (productCode) => {
      recordBetaSignal(`upgrade_click_${productCode}`);
      if (!betaOptIn) {
        consentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setConsentPulse(true);
        setTimeout(() => setConsentPulse(false), 1200);
        return;
      }
      recordBetaSignal(`beta_optin_open_${productCode}`);
      window.open(owner.directChatUrl, '_blank', 'noopener,noreferrer');
    },
    [betaOptIn, owner.directChatUrl]
  );

  return (
    <section id="plugins" className="showcase-surface" aria-label={showcase.sectionEyebrow}>
      <div className="showcase-inner">
        {/* SECTION HEADER */}
        <header className="showcase-header">
          <span className="showcase-eyebrow">{showcase.sectionEyebrow}</span>
          <h2 className="showcase-title">{showcase.sectionTitle}</h2>
          <p className="showcase-sub">{showcase.sectionSub}</p>
        </header>

        {/* FLAGSHIP PLUGIN 01 — RENDER AI STUDIO FOR SKETCHUP */}
        {renderPlugin && (
          <article className="plugin-bento-card">
            <div className="plugin-bento-copy">
              <div className="plugin-badge-row">
                <span className="plugin-icon-pill">
                  <Icon name={renderPlugin.icon} size={16} />
                </span>
                <span className="plugin-badge">{renderPlugin.badge}</span>
              </div>

              <h3 className="plugin-title">{renderPlugin.name}</h3>
              <p className="plugin-tagline">{renderPlugin.tagline}</p>

              <ul className="plugin-bullets">
                {renderPlugin.bullets.map((b, idx) => (
                  <li key={idx}>{b}</li>
                ))}
              </ul>

              <span className="plugin-status-pill">{renderPlugin.statusNote}</span>

              <div className="plugin-cta-row">
                <KineticBtn
                  variant="accent"
                  onClick={() => handleBetaRequest(renderPlugin.productCode)}
                >
                  {renderPlugin.primaryCta}
                </KineticBtn>
                <KineticBtn variant="glass" onClick={onOpenOverview}>
                  {renderPlugin.secondaryCta}
                </KineticBtn>
              </div>

              <p className="plugin-legal-foot">{renderPlugin.legalFoot}</p>
            </div>

            <div className="plugin-bento-media">
              {renderPlugin.uiPreview ? (
                <img
                  src={renderPlugin.uiPreview}
                  alt={renderPlugin.name}
                  className="plugin-preview-img"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <MiniCompareFrame
                  beforeSrc={renderPlugin.beforeImage}
                  afterSrc={renderPlugin.afterImage}
                  beforeLabel={renderPlugin.beforeLabel}
                  afterLabel={renderPlugin.afterLabel}
                  alt={renderPlugin.name}
                />
              )}
            </div>
          </article>
        )}

        {/* FLAGSHIP PLUGIN 02 — MAPSKP FOR SKETCHUP */}
        {mapPlugin && (
          <article className="plugin-bento-card is-reverse">
            <div className="plugin-bento-media">
              {mapPlugin.uiPreview ? (
                <div className="plugin-img-wrap">
                  <img
                    src={mapPlugin.uiPreview}
                    alt={mapPlugin.name}
                    className="plugin-preview-img"
                    loading="lazy"
                    decoding="async"
                  />
                  {mapPlugin.attribution && (
                    <span className="bento-osm-badge">{mapPlugin.attribution}</span>
                  )}
                </div>
              ) : (
                <MapPlaceholderFrame
                  title={mapPlugin.placeholderTitle}
                  sub={mapPlugin.placeholderSub}
                  attribution={mapPlugin.attribution}
                />
              )}
            </div>

            <div className="plugin-bento-copy">
              <div className="plugin-badge-row">
                <span className="plugin-icon-pill">
                  <Icon name={mapPlugin.icon} size={16} />
                </span>
                <span className="plugin-badge">{mapPlugin.badge}</span>
              </div>

              <h3 className="plugin-title">{mapPlugin.name}</h3>
              <p className="plugin-tagline">{mapPlugin.tagline}</p>

              <ul className="plugin-bullets">
                {mapPlugin.bullets.map((b, idx) => (
                  <li key={idx}>{b}</li>
                ))}
              </ul>

              <span className="plugin-status-pill">{mapPlugin.statusNote}</span>

              <div className="plugin-cta-row">
                <KineticBtn
                  variant="accent"
                  onClick={() => handleBetaRequest(mapPlugin.productCode)}
                >
                  {mapPlugin.primaryCta}
                </KineticBtn>
              </div>

              <p className="plugin-legal-foot">{mapPlugin.legalFoot}</p>
            </div>
          </article>
        )}

        {/* EXPLICIT OPT-IN BETA REGISTRATION BAR (LUẬT BVDLCN 91/2025/QH15 — UNCHECKED BY DEFAULT) */}
        <div
          id="beta-access"
          ref={consentRef}
          className={`beta-consent-bar ${consentPulse ? 'is-pulsing' : ''}`}
        >
          <label className="beta-consent-label">
            <input
              type="checkbox"
              className="beta-consent-checkbox"
              checked={betaOptIn}
              onChange={(e) => setBetaOptIn(e.target.checked)}
            />
            <span>{betaConsent.label}</span>
          </label>

          <div className="beta-consent-action">
            {betaOptIn ? (
              <KineticBtn
                variant="accent"
                href={owner.directChatUrl}
                trailingIcon="arrowUpRight"
                onClick={() => recordBetaSignal('beta_optin_direct_chat')}
              >
                {betaConsent.ctaReady}
              </KineticBtn>
            ) : (
              <span className="beta-consent-hint">{betaConsent.promptHint}</span>
            )}
          </div>
        </div>

        {/* PRODUCT & OUTPUT GALLERY BENTO GRID */}
        <div id="gallery" className="gallery-block">
          <div className="gallery-header">
            <span className="showcase-eyebrow">{gallery.eyebrow}</span>
            <h3 className="gallery-heading">{gallery.title}</h3>
            <p className="gallery-sub">{gallery.sub}</p>
          </div>

          <div className="gallery-grid">
            {gallery.items.map((item) => (
              <figure key={item.id} className="gallery-card">
                {item.image ? (
                  <div className="gallery-media">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="gallery-img"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                ) : (
                  <div className="gallery-placeholder">
                    <Icon name="image" size={22} />
                    <span className="gallery-placeholder-path">{item.hint}</span>
                  </div>
                )}
                <figcaption className="gallery-caption">
                  <span className="gallery-tag">{item.tag}</span>
                  <strong className="gallery-item-title">{item.title}</strong>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
