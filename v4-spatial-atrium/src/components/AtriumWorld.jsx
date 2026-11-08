import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  ContactShadows,
  Environment,
  Lightformer,
  MeshReflectorMaterial,
  PerformanceMonitor,
} from '@react-three/drei';
import ExplodedCampusModel from './ExplodedCampusModel';
import UrbanSimulationOverlay from './UrbanSimulationOverlay';
import { ARCHITECT_DATA } from '../config/architectData';

const STEP_ANGLE = (Math.PI * 2) / 5;
const STAGE_BG = '#0a0a0b';

const CAMERA_KEYFRAMES = [
  { pos: new THREE.Vector3(0.0, 2.34, 8.85), target: new THREE.Vector3(0.0, 1.32, 0.0) },
  { pos: new THREE.Vector3(0.0, 3.92, 11.55), target: new THREE.Vector3(0.0, 2.52, 0.0) },
  { pos: new THREE.Vector3(0.0, 2.34, 8.45), target: new THREE.Vector3(0.0, 1.42, 0.0) },
  { pos: new THREE.Vector3(0.0, 4.18, 9.75), target: new THREE.Vector3(0.0, 1.52, 0.0) },
  { pos: new THREE.Vector3(0.0, 2.62, 9.35), target: new THREE.Vector3(0.0, 1.22, 0.45) },
];

function checkWebGLSupport() {
  if (typeof window === 'undefined') return true;
  try {
    const c = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (c.getContext('webgl2') || c.getContext('webgl') || c.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

function BootReadySignal() {
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.__hd5BootReady === 'function') {
      window.__hd5BootReady();
    }
  }, []);
  return null;
}

function StudioBackdrop() {
  return (
    <mesh position={[0, 2.6, -6.8]} raycast={() => null}>
      <planeGeometry args={[28, 15]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          void main() {
            vec2 p = (vUv - vec2(0.5, 0.46)) * vec2(1.9, 1.0);
            float glow = smoothstep(0.6, 0.0, length(p));
            vec3 col = mix(vec3(0.039), vec3(0.115, 0.112, 0.12), glow);
            gl_FragColor = vec4(col, glow * 0.85);
          }
        `}
      />
    </mesh>
  );
}

// Ultra-lightweight 0-FBO grounding shadow disc for mobile GPUs
function MobileGroundShadow() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]} raycast={() => null}>
      <planeGeometry args={[9.2, 8.2]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          void main() {
            float d = length((vUv - 0.5) * 2.0);
            float a = smoothstep(1.0, 0.18, d) * 0.58;
            gl_FragColor = vec4(0.0, 0.0, 0.0, a);
          }
        `}
      />
    </mesh>
  );
}

function AxisAndCameraController({ scrollRef, fxMode = 'auto', isMobile = false, axisSpinRef }) {
  const lookTargetRef = useRef(new THREE.Vector3(0.0, 1.32, 0));
  const desiredPos = useMemo(() => new THREE.Vector3(), []);
  const desiredTarget = useMemo(() => new THREE.Vector3(), []);
  const prevStageNormRef = useRef(0);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const stageNorm = scrollRef?.current?.stageNorm ?? 0;
    const colophonBlend = scrollRef?.current?.colophonBlend ?? 0;

    if (axisSpinRef?.current) {
      const spin = axisSpinRef.current;
      const scrollMoved = Math.abs(stageNorm - prevStageNormRef.current) > 0.0008;
      prevStageNormRef.current = stageNorm;

      if (!spin.isDragging) {
        spin.dragOffset += spin.velocity * dt;
        spin.velocity *= Math.exp(-3.4 * dt);
        if (Math.abs(spin.velocity) < 0.001) spin.velocity = 0;
        if (scrollMoved) {
          spin.dragOffset = THREE.MathUtils.damp(spin.dragOffset, 0, 7.5, dt);
        }
      }

      const targetAngle = -stageNorm * (4 * STEP_ANGLE) + spin.dragOffset;
      spin.angle = THREE.MathUtils.damp(spin.angle, targetAngle, 6.2, dt);
    }

    if (fxMode === 'explode') {
      desiredPos.copy(CAMERA_KEYFRAMES[1].pos);
      desiredTarget.copy(CAMERA_KEYFRAMES[1].target);
    } else if (fxMode === 'solar') {
      desiredPos.copy(CAMERA_KEYFRAMES[3].pos);
      desiredTarget.copy(CAMERA_KEYFRAMES[3].target);
    } else {
      const scaled = stageNorm * (CAMERA_KEYFRAMES.length - 1);
      const idx0 = Math.floor(scaled);
      const idx1 = Math.min(CAMERA_KEYFRAMES.length - 1, idx0 + 1);
      const frac = scaled - idx0;
      const smoothFrac = frac * frac * (3 - 2 * frac);
      desiredPos.lerpVectors(CAMERA_KEYFRAMES[idx0].pos, CAMERA_KEYFRAMES[idx1].pos, smoothFrac);
      desiredTarget.lerpVectors(CAMERA_KEYFRAMES[idx0].target, CAMERA_KEYFRAMES[idx1].target, smoothFrac);
    }

    if (!isMobile) {
      const shift = 1.85 * (1 - colophonBlend);
      desiredPos.x -= shift;
      desiredTarget.x -= shift;
      desiredPos.z += 1.9;
      desiredPos.y += 0.35;
    }

    desiredPos.z += colophonBlend * 2.2;
    desiredTarget.y -= colophonBlend * 0.9;

    if (isMobile) {
      desiredPos.z += 9.5;
      desiredPos.y += 2.2;
      desiredTarget.y += 1.9;
    } else {
      desiredPos.x += state.pointer.x * 0.2;
      desiredPos.y += state.pointer.y * 0.1;
    }

    state.camera.position.lerp(desiredPos, 1 - Math.exp(-4.5 * dt));
    lookTargetRef.current.lerp(desiredTarget, 1 - Math.exp(-5.0 * dt));
    state.camera.lookAt(lookTargetRef.current);
  });

  return null;
}

function StudioLights({ fxMode = 'auto', castShadows = true }) {
  const keyRef = useRef();

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    if (!keyRef.current) return;
    const sunHour =
      fxMode === 'solar' ? 12.0 + Math.sin(state.clock.elapsedTime * 0.75) * 4.5 : 15.5;
    const norm = THREE.MathUtils.clamp((sunHour - 6.0) / 12.0, 0.06, 0.94);
    const ang = Math.PI * (1 - norm);
    const tx = Math.cos(ang) * 9.5;
    const ty = Math.sin(ang) * 8.5 + 2.5;
    keyRef.current.position.x = THREE.MathUtils.damp(keyRef.current.position.x, tx, 3.5, dt);
    keyRef.current.position.y = THREE.MathUtils.damp(keyRef.current.position.y, ty, 3.5, dt);
  });

  return (
    <>
      <color attach="background" args={[STAGE_BG]} />
      <fog attach="fog" args={[STAGE_BG, 12, 26]} />
      <ambientLight intensity={0.42} color="#ffffff" />
      <hemisphereLight args={['#f5f5f7', '#060607', 0.55]} />
      <directionalLight
        ref={keyRef}
        position={[7.5, 7.2, 4.8]}
        intensity={2.35}
        color="#fff3e6"
        castShadow={castShadows}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={1}
        shadow-camera-far={28}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
      />
      <pointLight position={[5.2, 3.2, -4.2]} intensity={2.1} color="#ff7a59" distance={18} />
      <pointLight position={[-5.2, 2.6, 2.8]} intensity={1.35} color="#e8eefc" distance={16} />
    </>
  );
}

export default function AtriumWorld({
  data = ARCHITECT_DATA,
  scrollRef,
  activeChapter = 0,
  fxMode = 'auto',
  isMobile = false,
  canvasSleeping = false,
  inContentZone = false,
  activeAnchorId = null,
  onSelectAnchor,
  onOpenOverview,
}) {
  const [lowPower, setLowPower] = useState(false);
  const [draggingCursor, setDraggingCursor] = useState(false);
  const [webglOk] = useState(() => checkWebGLSupport());

  // 1-Pass Smart GPU Mode on Mobile or Low-Power Laptops
  const useLiteGpu = isMobile || lowPower;
  const campusOffsetX = 0.0;

  useEffect(() => {
    if (!webglOk && typeof window !== 'undefined' && typeof window.__hd5BootReady === 'function') {
      window.__hd5BootReady();
    }
  }, [webglOk]);

  const axisSpinRef = useRef({
    angle: 0,
    dragOffset: 0,
    velocity: 0,
    isDragging: false,
    startX: 0,
    lastX: 0,
    lastTime: 0,
  });

  const handlePointerDown = useCallback((e) => {
    if (e.target.closest('button, a, input, label')) return;
    const spin = axisSpinRef.current;
    spin.isDragging = true;
    spin.velocity = 0;
    spin.startX = e.clientX;
    spin.lastX = e.clientX;
    spin.lastTime = performance.now();
    setDraggingCursor(true);
  }, []);

  const handlePointerMove = useCallback(
    (e) => {
      const spin = axisSpinRef.current;
      if (!spin.isDragging) return;
      const now = performance.now();
      const dx = e.clientX - spin.lastX;
      const dtSec = Math.max(0.008, (now - spin.lastTime) / 1000);
      const radDelta = dx * 0.0072;

      spin.dragOffset += radDelta;
      spin.velocity = THREE.MathUtils.lerp(spin.velocity, radDelta / dtSec, 0.45);
      spin.lastX = e.clientX;
      spin.lastTime = now;

      if (activeAnchorId && Math.abs(e.clientX - spin.startX) > 28) {
        onSelectAnchor?.(null);
      }
    },
    [activeAnchorId, onSelectAnchor]
  );

  const handlePointerUp = useCallback(
    (e) => {
      const spin = axisSpinRef.current;
      if (!spin.isDragging) return;
      const moved = Math.abs((e?.clientX ?? spin.lastX) - spin.startX);
      spin.isDragging = false;
      setDraggingCursor(false);
      if (moved < 6 && activeAnchorId && !e?.target?.closest?.('.hotspot')) {
        onSelectAnchor?.(null);
      }
    },
    [activeAnchorId, onSelectAnchor]
  );

  const explodeTarget = useMemo(() => {
    if (fxMode === 'explode') return 1.0;
    if (fxMode === 'xray') return 0.14;
    if (fxMode !== 'auto') return 0.0;
    return activeChapter === 1 ? 1.0 : 0.0;
  }, [activeChapter, fxMode]);

  const peelTarget = useMemo(() => {
    if (fxMode === 'explode') return 1.0;
    if (fxMode === 'xray') return 0.32;
    if (fxMode !== 'auto') return 0.0;
    return activeChapter === 1 ? 1.0 : 0.0;
  }, [activeChapter, fxMode]);

  const xrayActive = fxMode === 'xray';
  const laserActive = fxMode === 'laser' || (fxMode === 'auto' && activeChapter === 2);
  const showUrbanSim = fxMode === 'solar' || (fxMode === 'auto' && activeChapter === 3);
  const showPortals = fxMode === 'auto' && activeChapter === 4;
  const hideAnchors = inContentZone || isMobile;

  if (!webglOk) {
    const fb = data.ui.webglFallback;
    return (
      <div className="webgl-fallback-stage">
        <div className="webgl-fallback-card">
          <h2>{fb.title}</h2>
          <p>{fb.desc}</p>
          <button type="button" className="kbtn kbtn-accent" onClick={onOpenOverview}>
            {fb.cta}
          </button>
        </div>
      </div>
    );
  }

  const stageClasses = [
    'webgl-stage-fixed',
    draggingCursor ? 'is-grabbing' : 'is-grabbable',
    canvasSleeping ? 'is-sleeping' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={stageClasses}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <Canvas
        shadows={!useLiteGpu}
        frameloop={canvasSleeping ? 'demand' : 'always'}
        dpr={useLiteGpu ? [1, 1.2] : [1, 1.65]}
        gl={{ antialias: !useLiteGpu, powerPreference: 'high-performance' }}
        camera={{ position: [-1.85, 2.69, 10.75], fov: 42, near: 0.1, far: 80 }}
      >
        <PerformanceMonitor onDecline={() => setLowPower(true)} />

        <StudioLights fxMode={fxMode} castShadows={!useLiteGpu} />
        <AxisAndCameraController
          scrollRef={scrollRef}
          fxMode={fxMode}
          isMobile={isMobile}
          axisSpinRef={axisSpinRef}
        />

        <Environment resolution={useLiteGpu ? 64 : 128}>
          <group rotation={[-Math.PI / 4, -0.3, 0]}>
            <Lightformer
              intensity={2.1}
              rotation-x={Math.PI / 2}
              position={[0, 5, -6]}
              scale={[10, 10, 1]}
              color="#ffffff"
            />
            <Lightformer
              intensity={1.2}
              rotation-y={Math.PI / 2}
              position={[-6, 2, -1]}
              scale={[12, 3, 1]}
              color="#e8eefc"
            />
            <Lightformer
              intensity={1.6}
              rotation-y={-Math.PI / 2}
              position={[7, 2.5, 2]}
              scale={[12, 4, 1]}
              color="#ffd9cc"
            />
          </group>
        </Environment>

        <StudioBackdrop />

        {/* 1-Pass Matte Floor on Mobile vs Subtle Studio Reflector on Desktop */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.01, 0]}
          receiveShadow={!useLiteGpu}
          raycast={() => null}
        >
          <circleGeometry args={[28, 48]} />
          {useLiteGpu ? (
            <meshStandardMaterial color="#0b0b0d" roughness={0.68} metalness={0.14} />
          ) : (
            <MeshReflectorMaterial
              blur={[220, 64]}
              resolution={512}
              mixBlur={0.9}
              mixStrength={8}
              roughness={0.42}
              depthScale={1.0}
              minDepthThreshold={0.35}
              maxDepthThreshold={1.4}
              color="#080809"
              metalness={0.5}
            />
          )}
        </mesh>

        {/* Bake ContactShadows ONCE (frames={1}) on Desktop; 0-FBO Shader Disc on Mobile */}
        {useLiteGpu ? (
          <MobileGroundShadow />
        ) : (
          <ContactShadows
            frames={1}
            position={[0, 0.002, 0]}
            scale={14}
            resolution={256}
            blur={2.5}
            opacity={0.52}
            far={4.5}
            color="#000000"
          />
        )}

        <Suspense fallback={null}>
          <BootReadySignal />

          <ExplodedCampusModel
            data={data}
            campusOffsetX={campusOffsetX}
            axisSpinRef={axisSpinRef}
            scrollRef={scrollRef}
            fxMode={fxMode}
            explodeTarget={explodeTarget}
            peelTarget={peelTarget}
            xrayActive={xrayActive}
            laserActive={laserActive}
            activeAnchorId={activeAnchorId}
            onSelectAnchor={onSelectAnchor}
            hideAnchors={hideAnchors}
          />

          <UrbanSimulationOverlay
            data={data}
            campusOffsetX={campusOffsetX}
            fxMode={fxMode}
            showUrbanSim={showUrbanSim}
            showPortals={showPortals}
            activeAnchorId={activeAnchorId}
            onSelectAnchor={onSelectAnchor}
            hideAnchors={hideAnchors}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
