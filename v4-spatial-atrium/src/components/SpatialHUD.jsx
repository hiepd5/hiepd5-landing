import React, { useEffect, useMemo } from 'react';
import { ARCHITECT_DATA, recordBetaSignal } from '../config/architectData';
import { playHoverTick, playPressPulse } from '../utils/microAudio';
import Icon, { FX_ICON } from './Icons';

export function KineticBtn({
  href,
  onClick,
  variant = 'glass',
  active = false,
  className = '',
  icon,
  trailingIcon,
  title,
  ariaLabel,
  children,
}) {
  const classes = ['kbtn', `kbtn-${variant}`, active ? 'is-active' : '', className]
    .filter(Boolean)
    .join(' ');

  const renderGlyph = (g) =>
    typeof g === 'string' && /^[a-zA-Z]+$/.test(g) ? <Icon name={g} size={16} /> : g;

  const inner = (
    <>
      {icon && <span className="kbtn-icon">{renderGlyph(icon)}</span>}
      {children && <span className="kbtn-label">{children}</span>}
      {trailingIcon && <span className="kbtn-trail">{renderGlyph(trailingIcon)}</span>}
    </>
  );

  const handlePointerDown = (e) => {
    e.stopPropagation();
    playPressPulse();
  };

  if (href) {
    const isMail = href.startsWith('mailto:');
    return (
      <a
        href={href}
        target={isMail ? undefined : '_blank'}
        rel={isMail ? undefined : 'noopener noreferrer'}
        className={classes}
        title={title}
        aria-label={ariaLabel || title}
        onPointerEnter={playHoverTick}
        onPointerDown={handlePointerDown}
        onClick={onClick}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      title={title}
      aria-label={ariaLabel || title}
      aria-pressed={variant === 'seg' ? active : undefined}
      onPointerEnter={playHoverTick}
      onPointerDown={handlePointerDown}
      onClick={onClick}
    >
      {inner}
    </button>
  );
}

export default function SpatialHUD({
  data = ARCHITECT_DATA,
  lang = 'vi',
  onToggleLang,
  inContentZone = false,
  activeChapter = 0,
  onJumpChapter,
  onScrollTop,
  onScrollPlugins,
  onScrollGallery,
  fxMode = 'auto',
  onSelectFxMode,
  hubOpen = false,
  setHubOpen,
  overviewOpen = false,
  setOverviewOpen,
  activeAnchorId = null,
  onDismissAnchor,
  onTriggerNodeAction,
}) {
  const { owner, chapters, ui, v6 } = data;
  const chapterCopy = v6.chapterCopy[activeChapter];
  const fxIdx = Math.max(0, ui.fxModes.findIndex((m) => m.id === fxMode));

  const activeCard = useMemo(() => {
    if (!activeAnchorId || inContentZone) return null;
    if (activeAnchorId.startsWith('mod:')) {
      const modId = activeAnchorId.slice(4);
      const item = (data.curiosityNodes || []).find((n) => n.modId === modId);
      if (!item) return null;
      return {
        eyebrow: `${item.code} · ${item.metric}`,
        title: item.title,
        desc: item.detail,
        ctaLabel: item.ctaLabel,
        fxAction: item.fxAction,
      };
    }
    if (activeAnchorId.startsWith('portal:')) {
      const pid = activeAnchorId.slice(7);
      const p = (data.ecosystemPortals || []).find((it) => it.id === pid);
      if (!p) return null;
      return {
        eyebrow: p.badge,
        title: p.title,
        desc: p.desc,
        ctaLabel: p.ctaLabel,
        url: p.url,
        fxAction: p.action,
        signal: `portal_${p.id}`,
      };
    }
    if (activeAnchorId === 'sim:zoning') {
      const z = ui.zoningTag;
      return {
        eyebrow: `${z.code} · ${z.metric}`,
        title: z.name,
        desc:
          lang === 'en'
            ? 'Spatial reference envelope around the 5-module architectural model.'
            : 'Khung bao tham chiếu tỷ lệ quanh mô hình 5 lớp mô-đun.',
        ctaLabel: lang === 'en' ? 'Explore Plugins Below' : 'Xem Plugin bên dưới',
        fxAction: 'plugins',
      };
    }
    return null;
  }, [activeAnchorId, inContentZone, data.curiosityNodes, data.ecosystemPortals, ui.zoningTag, lang]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.target?.matches?.('input, textarea')) return;
      const key = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && key === 'k') {
        e.preventDefault();
        setHubOpen((v) => !v);
      } else if (!e.ctrlKey && !e.metaKey && !e.altKey && key === 'o') {
        setOverviewOpen((v) => !v);
      } else if (!e.ctrlKey && !e.metaKey && !e.altKey && key === 'l') {
        onToggleLang();
      } else if (e.key === 'Escape') {
        setHubOpen(false);
        onDismissAnchor?.();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [setHubOpen, setOverviewOpen, onToggleLang, onDismissAnchor]);

  return (
    <>
      {!inContentZone && <div className="viewport-vignette" aria-hidden="true" />}

      {/* 1. APPLE GLASS NAV BAR */}
      <header className="nav-bar">
        <button type="button" className="nav-logo" onClick={onScrollTop} aria-label={v6.nav.top}>
          <span className="nav-logo-mark">HD5</span>
          <span className="nav-logo-name">{owner.brand}</span>
        </button>

        <nav className="nav-links" aria-label="Primary">
          <button type="button" className="nav-link" onClick={onScrollPlugins}>
            {v6.nav.plugins}
          </button>
          <button type="button" className="nav-link" onClick={onScrollGallery}>
            {v6.nav.gallery}
          </button>
          <button
            type="button"
            className={`nav-link ${overviewOpen ? 'is-active' : ''}`}
            onClick={() => setOverviewOpen((v) => !v)}
            title={ui.overviewTitle}
          >
            {v6.nav.projects}
          </button>
          <button
            type="button"
            className={`nav-link ${hubOpen ? 'is-active' : ''}`}
            onClick={() => setHubOpen(true)}
            title={ui.menuTitle}
          >
            {v6.nav.ecosystem}
          </button>
        </nav>

        <div className="nav-actions">
          <button
            type="button"
            className="lang-switch"
            onClick={() => {
              playPressPulse();
              onToggleLang();
            }}
            title={ui.langSwitchTitle}
            aria-label={ui.langSwitchTitle}
          >
            <span className={lang === 'vi' ? 'is-on' : ''}>VI</span>
            <span className={lang === 'en' ? 'is-on' : ''}>EN</span>
          </button>
          <KineticBtn
            variant="accent"
            href={owner.directChatUrl}
            onClick={() => recordBetaSignal('contact_click')}
            title={v6.nav.contact}
          >
            {v6.nav.contact}
          </KineticBtn>
        </div>
      </header>

      {/* 2. HERO (CH.01) / CHAPTER COPY (CH.02–05) */}
      <section className={`story-copy ${inContentZone ? 'is-hidden' : ''}`} aria-live="polite">
        {activeChapter === 0 || !chapterCopy ? (
          <div className="hero-block" key={`hero-${lang}`}>
            <h1 className="hero-headline">
              {v6.hero.lines.map((line) => (
                <span key={line} className="hero-line">
                  {line}
                </span>
              ))}
            </h1>
            <p className="hero-sub">{v6.hero.sub}</p>
            <div className="hero-ctas">
              <KineticBtn variant="accent" onClick={onScrollPlugins}>
                {v6.hero.primary}
              </KineticBtn>
              <KineticBtn
                variant="link"
                trailingIcon="chevronRight"
                onClick={() => setOverviewOpen(true)}
              >
                {v6.hero.secondary}
              </KineticBtn>
            </div>
          </div>
        ) : (
          <div className="chapter-copy" key={`ch-${activeChapter}-${lang}`}>
            <span className="chapter-index">
              {chapters[activeChapter].index} / {String(chapters.length).padStart(2, '0')}
            </span>
            <h2 className="chapter-title">{chapterCopy.title}</h2>
            <p className="chapter-sub">{chapterCopy.sub}</p>
          </div>
        )}
      </section>

      {/* 3. CHAPTER PAGER (RIGHT EDGE) */}
      <nav className={`pager-dots ${inContentZone ? 'is-hidden' : ''}`} aria-label="Chapters">
        {chapters.map((ch, idx) => (
          <button
            key={ch.id}
            type="button"
            className={`pager-dot ${idx === activeChapter ? 'is-active' : ''}`}
            onClick={() => onJumpChapter(idx)}
            aria-label={`${ch.index} ${ch.title}`}
            title={`${ch.index} · ${ch.title}`}
          >
            <span />
          </button>
        ))}
      </nav>

      {/* 4. SEGMENTED FX CONTROL */}
      <footer className={`fx-dock ${inContentZone ? 'is-hidden' : ''}`}>
        <div
          className="segmented"
          role="group"
          aria-label="Core Model Effects"
          style={{ '--seg-i': fxIdx }}
        >
          <span className="seg-indicator" aria-hidden="true" />
          {ui.fxModes.map((m) => {
            const isAct = fxMode === m.id;
            return (
              <KineticBtn
                key={m.id}
                variant="seg"
                className="seg-btn"
                active={isAct}
                icon={FX_ICON[m.id]}
                onClick={() => onSelectFxMode(isAct && m.id !== 'auto' ? 'auto' : m.id)}
                title={m.title}
                ariaLabel={m.title}
              >
                {m.label}
              </KineticBtn>
            );
          })}
        </div>
      </footer>

      {/* 5. SPATIAL CARD (ONLY WHEN A HOTSPOT IS CLICKED) */}
      {activeCard && (
        <aside className="spatial-card" onPointerDown={(e) => e.stopPropagation()}>
          <div className="spatial-card-top">
            <span className="spatial-card-eyebrow">{activeCard.eyebrow}</span>
            <button
              type="button"
              className="icon-circle"
              onClick={onDismissAnchor}
              aria-label={ui.closeBtn}
            >
              <Icon name="close" size={14} />
            </button>
          </div>
          <h3 className="spatial-card-title">{activeCard.title}</h3>
          <p className="spatial-card-desc">{activeCard.desc}</p>
          {activeCard.url ? (
            <a
              href={activeCard.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link"
              onPointerEnter={playHoverTick}
              onClick={() => recordBetaSignal(activeCard.signal || 'holo_link')}
            >
              {activeCard.ctaLabel}
              <Icon name="arrowUpRight" size={14} />
            </a>
          ) : (
            <button
              type="button"
              className="text-link"
              onPointerEnter={playHoverTick}
              onClick={() => {
                playPressPulse();
                onTriggerNodeAction?.(activeCard.fxAction);
              }}
            >
              {activeCard.ctaLabel}
              <Icon name="chevronRight" size={14} />
            </button>
          )}
        </aside>
      )}

      {/* 6. ECOSYSTEM HUB (CTRL+K) */}
      {hubOpen && (
        <div className="hub-modal-backdrop" onClick={() => setHubOpen(false)}>
          <div
            className="hub-modal-panel"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="hub-modal-top">
              <h2 className="hub-modal-title">{ui.hub.title}</h2>
              <button
                type="button"
                className="icon-circle"
                onClick={() => setHubOpen(false)}
                aria-label={ui.closeBtn}
              >
                <Icon name="close" size={14} />
              </button>
            </div>
            <div className="hub-grid">
              {ui.hub.cards.map((c, idx) => (
                <KineticBtn
                  key={idx}
                  variant="hubcard"
                  trailingIcon="arrowUpRight"
                  href={c.url}
                  onClick={
                    c.action === 'openOverview'
                      ? () => {
                          setHubOpen(false);
                          setOverviewOpen(true);
                        }
                      : c.action === 'scrollPlugins'
                        ? () => {
                            setHubOpen(false);
                            onScrollPlugins?.();
                          }
                        : () => recordBetaSignal('hub_click')
                  }
                >
                  <strong>{c.title}</strong>
                  <small>{c.desc}</small>
                </KineticBtn>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
