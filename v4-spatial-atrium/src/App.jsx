import React, { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AtriumWorld from './components/AtriumWorld';
import SpatialHUD from './components/SpatialHUD';
import PluginShowcase from './components/PluginShowcase';
import ArchitecturalColophon from './components/ArchitecturalColophon';
import { detectInitialLang, getLocalizedData } from './config/architectData';

const OverviewProofDrawer = lazy(() => import('./components/OverviewProofDrawer'));

function detectMobileDevice() {
  if (typeof window === 'undefined') return false;
  return (
    window.innerWidth <= 900 ||
    Boolean(window.matchMedia && window.matchMedia('(pointer: coarse)').matches)
  );
}

export default function App() {
  const [lang, setLang] = useState(() => detectInitialLang());
  const [activeChapter, setActiveChapter] = useState(0);
  const [inContentZone, setInContentZone] = useState(false);
  const [canvasSleeping, setCanvasSleeping] = useState(false);
  const [fxMode, setFxMode] = useState('auto');
  const [hubOpen, setHubOpen] = useState(false);
  const [overviewOpen, setOverviewOpen] = useState(false);
  const [activeAnchorId, setActiveAnchorId] = useState(null);
  const [isMobile, setIsMobile] = useState(() => detectMobileDevice());

  // Mutable scroll telemetry read directly by Three.js useFrame -> 0 React re-renders during touch scroll
  const scrollRef = useRef({
    stageNorm: 0,
    laserX: 0,
    colophonBlend: 0,
  });
  const stageSpacerRef = useRef(null);
  const chapterRef = useRef(0);
  const contentZoneRef = useRef(false);
  const sleepRef = useRef(false);

  const data = useMemo(() => getLocalizedData(lang), [lang]);
  const totalChapters = data.chapters.length;

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title =
      lang === 'en'
        ? 'HiepD5.com — Arch. Vuong Dac Hiep | SketchUp AI Plugins & 3D Architecture'
        : 'HiepD5.com — KTS. Vương Đắc Hiệp | Plugin SketchUp AI, Thiết Kế & Diễn Họa';
    try {
      window.localStorage.setItem('hd5_lang', lang);
    } catch {
      // ignore storage restriction
    }
  }, [lang]);

  const handleToggleLang = useCallback(() => {
    setLang((prev) => (prev === 'vi' ? 'en' : 'vi'));
  }, []);

  useEffect(() => {
    let rafPending = false;

    const syncScrollMetrics = () => {
      rafPending = false;
      const spacerEl = stageSpacerRef.current;
      const vh = Math.max(1, window.innerHeight);
      const spacerH = spacerEl ? spacerEl.offsetHeight : vh * 2.8;
      const stageSpan = Math.max(1, spacerH - vh);
      const y = Math.max(0, window.scrollY);

      const stageNorm = Math.min(1, Math.max(0, y / stageSpan));
      const colophonBlend = Math.min(1, Math.max(0, (y - stageSpan * 0.85) / (vh * 0.75)));

      scrollRef.current.stageNorm = stageNorm;
      scrollRef.current.colophonBlend = colophonBlend;

      if (stageNorm >= 0.38 && stageNorm <= 0.64) {
        const localT = (stageNorm - 0.38) / 0.26;
        scrollRef.current.laserX = (localT - 0.5) * 3.4;
      }

      const nextChapter = Math.min(
        totalChapters - 1,
        Math.floor(stageNorm * totalChapters * 0.999)
      );
      if (nextChapter !== chapterRef.current) {
        chapterRef.current = nextChapter;
        setActiveChapter(nextChapter);
      }

      const nextInContent = y > stageSpan + vh * 0.18;
      if (nextInContent !== contentZoneRef.current) {
        contentZoneRef.current = nextInContent;
        setInContentZone(nextInContent);
        if (nextInContent) {
          setActiveAnchorId(null);
        }
      }

      // Pause WebGL completely (0% GPU) once the opaque Plugin Showcase covers the viewport
      const nextSleep = y >= spacerH - 56;
      if (nextSleep !== sleepRef.current) {
        sleepRef.current = nextSleep;
        setCanvasSleeping(nextSleep);
      }
    };

    const onScroll = () => {
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(syncScrollMetrics);
      }
    };

    const onResize = () => {
      setIsMobile(detectMobileDevice());
      syncScrollMetrics();
    };

    syncScrollMetrics();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [totalChapters]);

  useEffect(() => {
    const pal = data.palettes[activeChapter] || data.palettes[0];
    const root = document.documentElement;
    root.style.setProperty('--accent-primary', pal.primary);
    root.style.setProperty('--accent-secondary', pal.secondary);
  }, [activeChapter, data.palettes]);

  const handleSelectAnchor = useCallback((nextId) => {
    setActiveAnchorId(nextId);
  }, []);

  const handleSelectFxMode = useCallback((nextFx) => {
    setFxMode(nextFx);
  }, []);

  const handleScrollPlugins = useCallback(() => {
    setActiveAnchorId(null);
    document.getElementById('plugins')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleScrollGallery = useCallback(() => {
    setActiveAnchorId(null);
    document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleTriggerNodeAction = useCallback(
    (actionKey) => {
      if (actionKey === 'overview') {
        setActiveAnchorId(null);
        setOverviewOpen(true);
      } else if (actionKey === 'plugins') {
        handleScrollPlugins();
      } else if (actionKey) {
        setFxMode((cur) => (cur === actionKey ? 'auto' : actionKey));
      }
    },
    [handleScrollPlugins]
  );

  const handleJumpChapter = useCallback(
    (chapterIdx) => {
      setFxMode('auto');
      setActiveAnchorId(null);
      const spacerEl = stageSpacerRef.current;
      const vh = Math.max(1, window.innerHeight);
      const spacerH = spacerEl ? spacerEl.offsetHeight : vh * 2.8;
      const stageSpan = Math.max(1, spacerH - vh);
      const targetRatio = chapterIdx / Math.max(1, totalChapters - 1);
      window.scrollTo({
        top: targetRatio * stageSpan * 0.92,
        behavior: 'smooth',
      });
    },
    [totalChapters]
  );

  const handleScrollTop = useCallback(() => {
    setFxMode('auto');
    setActiveAnchorId(null);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  return (
    <>
      <AtriumWorld
        data={data}
        scrollRef={scrollRef}
        activeChapter={activeChapter}
        fxMode={fxMode}
        isMobile={isMobile}
        canvasSleeping={canvasSleeping}
        inContentZone={inContentZone}
        activeAnchorId={activeAnchorId}
        onSelectAnchor={handleSelectAnchor}
        onOpenOverview={() => setOverviewOpen(true)}
      />

      <SpatialHUD
        data={data}
        lang={lang}
        onToggleLang={handleToggleLang}
        inContentZone={inContentZone}
        activeChapter={activeChapter}
        onJumpChapter={handleJumpChapter}
        onScrollTop={handleScrollTop}
        onScrollPlugins={handleScrollPlugins}
        onScrollGallery={handleScrollGallery}
        fxMode={fxMode}
        onSelectFxMode={handleSelectFxMode}
        hubOpen={hubOpen}
        setHubOpen={setHubOpen}
        overviewOpen={overviewOpen}
        setOverviewOpen={setOverviewOpen}
        activeAnchorId={activeAnchorId}
        onDismissAnchor={() => setActiveAnchorId(null)}
        onTriggerNodeAction={handleTriggerNodeAction}
      />

      {overviewOpen && (
        <Suspense fallback={null}>
          <OverviewProofDrawer
            data={data}
            lang={lang}
            onToggleLang={handleToggleLang}
            onClose={() => setOverviewOpen(false)}
          />
        </Suspense>
      )}

      <main className="scroll-driver-track">
        <div ref={stageSpacerRef} className="scroll-spatial-spacer" aria-hidden="true" />
        <PluginShowcase data={data} onOpenOverview={() => setOverviewOpen(true)} />
        <ArchitecturalColophon
          data={data}
          onOpenOverview={() => setOverviewOpen(true)}
          onScrollTop={handleScrollTop}
        />
      </main>
    </>
  );
}
