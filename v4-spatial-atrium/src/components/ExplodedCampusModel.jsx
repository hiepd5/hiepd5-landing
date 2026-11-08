import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Html, Line, useGLTF } from '@react-three/drei';
import { ARCHITECT_DATA } from '../config/architectData';
import { playHoverTick, playPressPulse } from '../utils/microAudio';

const MODULE_KINEMATICS = {
  plaza: { baseY: 0.0, liftDelta: 0.0, calloutLocalY: 0.42, calloutX: 2.48 },
  interior: { baseY: 0.34, liftDelta: 0.52, calloutLocalY: 0.72, calloutX: 1.76 },
  structure: { baseY: 0.34, liftDelta: 2.26, calloutLocalY: 1.36, calloutX: 2.02 },
  shell: { baseY: 0.34, liftDelta: 2.96, calloutLocalY: 1.98, calloutX: 2.18 },
  roof: { baseY: 2.74, liftDelta: 2.58, calloutLocalY: 0.28, calloutX: 2.12 },
};

const SHELL_PEEL_DISTANCE = 1.58;

const CORNER_GUIDES = [
  [-2.02, -1.74],
  [2.02, -1.74],
  [2.02, 1.74],
  [-2.02, 1.74],
];

function preparePbrGraph(scene, clipRightPBR, modId, matBuckets) {
  const pbr = scene.clone(true);
  pbr.traverse((obj) => {
    if (obj.isMesh) {
      obj.castShadow = true;
      obj.receiveShadow = true;
      if (obj.material) {
        const m = obj.material.clone();
        m.clippingPlanes = [clipRightPBR];
        m.clipShadows = true;
        m.userData = {
          baseOpacity: typeof m.opacity === 'number' ? m.opacity : 1.0,
          baseTransparent: Boolean(m.transparent),
          baseEmissiveIntensity: typeof m.emissiveIntensity === 'number' ? m.emissiveIntensity : 0.0,
        };
        if (m.name && m.name.toLowerCase().includes('warm')) {
          matBuckets.warm.push(m);
        }
        if (modId === 'shell' || modId === 'roof') {
          matBuckets.envelope.push(m);
        } else if (modId === 'structure') {
          matBuckets.structure.push(m);
        } else if (modId === 'interior') {
          matBuckets.interior.push(m);
        }
        obj.material = m;
      }
    }
  });
  return pbr;
}

function prepareWireGraph(scene, wireMatMain, wireMatGold) {
  const wire = scene.clone(true);
  let idx = 0;
  wire.traverse((obj) => {
    if (obj.isMesh) {
      obj.castShadow = false;
      obj.receiveShadow = false;
      obj.raycast = () => null;
      obj.material = idx % 2 === 0 ? wireMatMain : wireMatGold;
      idx += 1;
    }
  });
  return wire;
}

export default function ExplodedCampusModel({
  data = ARCHITECT_DATA,
  campusOffsetX = 0.0,
  axisSpinRef = null,
  scrollRef = null,
  fxMode = 'auto',
  explodeTarget = 0,
  peelTarget = 0,
  xrayActive = false,
  laserActive = false,
  activeAnchorId = null,
  onSelectAnchor,
  hideAnchors = false,
}) {
  const { gl } = useThree();
  const { modules: modUrls } = data.models;
  const shortLabels = data.v6?.hotspotShort || {};

  const gltfPlaza = useGLTF(modUrls.plaza);
  const gltfInterior = useGLTF(modUrls.interior);
  const gltfStructure = useGLTF(modUrls.structure);
  const gltfShell = useGLTF(modUrls.shell);
  const gltfRoof = useGLTF(modUrls.roof);

  // Lazy Wireframe Clone: Only instantiated when Laser Slice or X-Ray Ghost mode is activated
  const [wireReady, setWireReady] = useState(false);
  useEffect(() => {
    if ((laserActive || xrayActive) && !wireReady) {
      setWireReady(true);
    }
  }, [laserActive, xrayActive, wireReady]);

  const turntableRef = useRef();
  const laserCurtainRef = useRef();
  const lidarGroupRef = useRef();
  const lidarDiscMatRef = useRef();
  const lidarPointLightRef = useRef();

  const explodeCur = useRef(0);
  const peelCur = useRef(0);
  const xrayCur = useRef(0);
  const laserCur = useRef(0);

  const modGroupRefs = useRef({});
  const wireGroupRefs = useRef({});
  const calloutRefs = useRef({});
  const pulsesRef = useRef([]);

  const clipRightPBR = useMemo(() => new THREE.Plane(new THREE.Vector3(1, 0, 0), 999), []);
  const clipLeftCAD = useMemo(() => new THREE.Plane(new THREE.Vector3(-1, 0, 0), 999), []);

  useEffect(() => {
    gl.localClippingEnabled = true;
  }, [gl]);

  const { pbrGraphs, pbrShellHalves, matBuckets } = useMemo(() => {
    const buckets = {
      warm: [],
      envelope: [],
      structure: [],
      interior: [],
    };
    const built = {
      plaza: preparePbrGraph(gltfPlaza.scene, clipRightPBR, 'plaza', buckets),
      interior: preparePbrGraph(gltfInterior.scene, clipRightPBR, 'interior', buckets),
      structure: preparePbrGraph(gltfStructure.scene, clipRightPBR, 'structure', buckets),
      shell: preparePbrGraph(gltfShell.scene, clipRightPBR, 'shell', buckets),
      roof: preparePbrGraph(gltfRoof.scene, clipRightPBR, 'roof', buckets),
    };

    const halves = {
      left: built.shell.getObjectByName('Shell_Left'),
      right: built.shell.getObjectByName('Shell_Right'),
    };

    return {
      pbrGraphs: built,
      pbrShellHalves: halves,
      matBuckets: buckets,
    };
  }, [
    gltfPlaza.scene,
    gltfInterior.scene,
    gltfStructure.scene,
    gltfShell.scene,
    gltfRoof.scene,
    clipRightPBR,
  ]);

  const wirePack = useMemo(() => {
    if (!wireReady) return null;
    const wireMatMain = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#f5f5f7'),
      wireframe: true,
      transparent: true,
      opacity: 0.42,
      clippingPlanes: [clipLeftCAD],
    });
    const wireMatGold = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#ff7a59'),
      wireframe: true,
      transparent: true,
      opacity: 0.5,
      clippingPlanes: [clipLeftCAD],
    });

    const wGraphs = {
      plaza: prepareWireGraph(gltfPlaza.scene, wireMatMain, wireMatGold),
      interior: prepareWireGraph(gltfInterior.scene, wireMatMain, wireMatGold),
      structure: prepareWireGraph(gltfStructure.scene, wireMatMain, wireMatGold),
      shell: prepareWireGraph(gltfShell.scene, wireMatMain, wireMatGold),
      roof: prepareWireGraph(gltfRoof.scene, wireMatMain, wireMatGold),
    };

    return {
      graphs: wGraphs,
      mats: [wireMatMain, wireMatGold],
      left: wGraphs.shell.getObjectByName('Shell_Left'),
      right: wGraphs.shell.getObjectByName('Shell_Right'),
    };
  }, [
    wireReady,
    gltfPlaza.scene,
    gltfInterior.scene,
    gltfStructure.scene,
    gltfShell.scene,
    gltfRoof.scene,
    clipLeftCAD,
  ]);

  const lidarRingPoints = useMemo(() => {
    const pts = [];
    const segs = 64;
    for (let i = 0; i <= segs; i += 1) {
      const a = (i / segs) * Math.PI * 2;
      pts.push([Math.cos(a) * 2.52, 0, Math.sin(a) * 2.18]);
    }
    return pts;
  }, []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;

    explodeCur.current = THREE.MathUtils.damp(explodeCur.current, explodeTarget, 4.8, dt);
    peelCur.current = THREE.MathUtils.damp(peelCur.current, peelTarget, 4.8, dt);
    xrayCur.current = THREE.MathUtils.damp(xrayCur.current, xrayActive ? 1.0 : 0.0, 5.4, dt);

    const e = explodeCur.current;
    const p = peelCur.current;
    const x = xrayCur.current;

    if (turntableRef.current) {
      const liveAxis = axisSpinRef?.current?.angle;
      if (typeof liveAxis === 'number') {
        turntableRef.current.rotation.y = liveAxis - 0.38;
      } else {
        const fallbackRot = Math.sin(t * 0.24) * 0.16 - 0.36;
        turntableRef.current.rotation.y = THREE.MathUtils.damp(turntableRef.current.rotation.y, fallbackRot, 3.4, dt);
      }
    }

    Object.entries(MODULE_KINEMATICS).forEach(([modId, kin]) => {
      const yPos = kin.baseY + kin.liftDelta * e;
      const g = modGroupRefs.current[modId];
      if (g) g.position.y = yPos;

      const cGrp = calloutRefs.current[modId];
      if (cGrp) {
        const extraX = modId === 'shell' ? SHELL_PEEL_DISTANCE * p * 0.65 : 0;
        cGrp.position.set(extraX, yPos + kin.calloutLocalY, 0);
      }
    });

    const peelShift = SHELL_PEEL_DISTANCE * p;
    if (pbrShellHalves.left) pbrShellHalves.left.position.x = -peelShift;
    if (pbrShellHalves.right) pbrShellHalves.right.position.x = peelShift;
    if (wirePack?.left) wirePack.left.position.x = -peelShift;
    if (wirePack?.right) wirePack.right.position.x = peelShift;

    // FX 1: Porcelain-white LiDAR scan ring — only while X-Ray lens is active
    if (lidarGroupRef.current) {
      lidarGroupRef.current.visible = x > 0.02;
      const maxScanH = 3.18 + e * 2.35;
      const wave = 0.5 + 0.5 * Math.sin(t * 0.92);
      lidarGroupRef.current.position.y = 0.18 + wave * maxScanH;
      lidarGroupRef.current.rotation.y = t * 0.35;
      if (lidarDiscMatRef.current) {
        lidarDiscMatRef.current.opacity = x * 0.09;
      }
      if (lidarPointLightRef.current) {
        lidarPointLightRef.current.intensity = x * 2.2;
      }
    }

    // FX 2: Ghost-Shell X-Ray Transparency & Helical Core Radiance
    const isGhosting = x > 0.015;
    matBuckets.envelope.forEach((m) => {
      const baseOp = m.userData?.baseOpacity ?? 1.0;
      const tgtOp = THREE.MathUtils.lerp(baseOp, 0.2, x);
      const needTrans = isGhosting || m.userData?.baseTransparent;
      if (m.transparent !== needTrans) {
        m.transparent = needTrans;
        m.needsUpdate = true;
      }
      m.depthWrite = x < 0.35;
      m.opacity = tgtOp;
    });

    matBuckets.structure.forEach((m) => {
      const baseOp = m.userData?.baseOpacity ?? 1.0;
      const tgtOp = THREE.MathUtils.lerp(baseOp, 0.58, x);
      const needTrans = isGhosting || m.userData?.baseTransparent;
      if (m.transparent !== needTrans) {
        m.transparent = needTrans;
        m.needsUpdate = true;
      }
      m.opacity = tgtOp;
    });

    const targetGlow = x > 0.25 ? 2.85 : p > 0.2 ? 1.65 : 1.1;
    matBuckets.warm.forEach((m) => {
      if ('emissiveIntensity' in m) {
        m.emissiveIntensity = THREE.MathUtils.damp(m.emissiveIntensity, targetGlow, 3.6, dt);
      }
    });

    // FX 2: Hardware CAD Wireframe <-> PBR Laser Slice OR X-Ray Rim Overlay
    const targetLaserX =
      fxMode === 'laser' ? Math.sin(t * 1.15) * 1.75 : (scrollRef?.current?.laserX ?? 0);
    laserCur.current = THREE.MathUtils.damp(laserCur.current, targetLaserX, 7.5, dt);
    if (laserActive && wirePack) {
      const worldCutX = campusOffsetX + laserCur.current;
      clipRightPBR.constant = -worldCutX;
      clipLeftCAD.constant = worldCutX;
      wirePack.mats[0].opacity = 0.46;
      wirePack.mats[1].opacity = 0.55;
      Object.values(wireGroupRefs.current).forEach((wg) => {
        if (wg) wg.visible = true;
      });
      if (laserCurtainRef.current) {
        laserCurtainRef.current.visible = true;
        laserCurtainRef.current.position.x = laserCur.current;
      }
    } else if (x > 0.08 && wirePack) {
      clipRightPBR.constant = 999;
      clipLeftCAD.constant = 999;
      wirePack.mats[0].opacity = x * 0.34;
      wirePack.mats[1].opacity = x * 0.28;
      Object.entries(wireGroupRefs.current).forEach(([modId, wg]) => {
        if (wg) wg.visible = modId === 'interior' || modId === 'structure' || modId === 'shell';
      });
      if (laserCurtainRef.current) laserCurtainRef.current.visible = false;
    } else {
      clipRightPBR.constant = 999;
      clipLeftCAD.constant = -999;
      Object.values(wireGroupRefs.current).forEach((wg) => {
        if (wg) wg.visible = false;
      });
      if (laserCurtainRef.current) laserCurtainRef.current.visible = false;
    }

    // Energy Conduit Pulses (active during Explode or X-Ray)
    if (e > 0.05 || x > 0.15) {
      const topPinY = 3.25 + 2.35 * e;
      pulsesRef.current.forEach((mesh, idx) => {
        if (!mesh) return;
        const [gx, gz] = CORNER_GUIDES[idx % 4];
        const speed = 0.48 + (idx % 3) * 0.16;
        const u = ((t * speed + idx * 0.25) % 1 + 1) % 1;
        mesh.position.set(gx, 0.36 + u * topPinY, gz);
      });
    }
  });

  const showConduits = explodeTarget > 0.15 || peelTarget > 0.15 || xrayActive;
  const guideHeight = 3.45 + 2.25 * explodeTarget;
  const nodes = data.curiosityNodes || [];

  return (
    <group position={[campusOffsetX, 0, 0]}>
      <group ref={turntableRef}>
        {/* 5 Interlocking Parametric BIM Modules */}
        {Object.keys(MODULE_KINEMATICS).map((modId) => (
          <group
            key={modId}
            ref={(el) => {
              modGroupRefs.current[modId] = el;
            }}
            position={[0, MODULE_KINEMATICS[modId].baseY, 0]}
          >
            <primitive object={pbrGraphs[modId]} />
            {wirePack && (
              <group
                ref={(el) => {
                  wireGroupRefs.current[modId] = el;
                }}
                visible={false}
              >
                <primitive object={wirePack.graphs[modId]} />
              </group>
            )}
          </group>
        ))}

        {/* Porcelain LiDAR Scan Plane + Internal Atrium Light (X-Ray only) */}
        <group ref={lidarGroupRef} position={[0, 1.2, 0]} visible={false}>
          <Line points={lidarRingPoints} color="#f5f5f7" lineWidth={1.4} transparent opacity={0.7} />
          <mesh rotation={[-Math.PI / 2, 0, 0]} scale={[1.0, 0.86, 1.0]} raycast={() => null}>
            <circleGeometry args={[2.5, 48]} />
            <meshBasicMaterial
              ref={lidarDiscMatRef}
              color="#ffffff"
              transparent
              opacity={0}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
          <pointLight ref={lidarPointLightRef} position={[0, 0, 0]} color="#ffffff" intensity={0} distance={4.8} />
        </group>

        {/* Guide Filaments (Explode / X-Ray) */}
        {showConduits && (
          <group>
            {CORNER_GUIDES.map(([gx, gz], idx) => (
              <Line
                key={idx}
                points={[
                  [gx, 0.36, gz],
                  [gx, guideHeight, gz],
                ]}
                color={idx % 2 === 0 ? '#f5f5f7' : '#ff7a59'}
                lineWidth={1.0}
                dashed
                dashSize={0.14}
                gapSize={0.1}
                transparent
                opacity={0.4}
              />
            ))}
            {Array.from({ length: 8 }).map((_, idx) => (
              <mesh
                key={idx}
                ref={(el) => {
                  pulsesRef.current[idx] = el;
                }}
                raycast={() => null}
              >
                <sphereGeometry args={[0.036, 10, 10]} />
                <meshBasicMaterial color={idx % 2 === 0 ? '#ffffff' : '#ff7a59'} />
              </mesh>
            ))}
          </group>
        )}

        {/* 5 APPLE-STYLE HOTSPOTS — label appears on hover, card on click */}
        {!hideAnchors &&
          nodes.map((item) => {
            const kin = MODULE_KINEMATICS[item.modId];
            if (!kin) return null;
            const anchorKey = `mod:${item.modId}`;
            const isOpen = activeAnchorId === anchorKey;

            return (
              <group
                key={`${data.langCode}-${item.modId}`}
                ref={(el) => {
                  calloutRefs.current[item.modId] = el;
                }}
                position={[0, kin.baseY + kin.calloutLocalY, 0]}
              >
                <Html position={[kin.calloutX, 0, 0]} center zIndexRange={[16, 0]}>
                  <button
                    type="button"
                    className={`hotspot ${isOpen ? 'is-active' : ''}`}
                    aria-expanded={isOpen}
                    aria-label={item.title}
                    onPointerDown={(e) => e.stopPropagation()}
                    onPointerEnter={playHoverTick}
                    onClick={(e) => {
                      e.stopPropagation();
                      playPressPulse();
                      onSelectAnchor?.(isOpen ? null : anchorKey);
                    }}
                  >
                    <span className="hotspot-dot" aria-hidden="true" />
                    <span className="hotspot-label">{shortLabels[item.modId] || item.title}</span>
                  </button>
                </Html>
              </group>
            );
          })}
      </group>

      {/* Laser Section Curtain (Chapter 03 / Laser FX Mode) */}
      <group ref={laserCurtainRef} visible={false}>
        <mesh position={[0, 1.85, 0]} rotation={[0, Math.PI / 2, 0]} raycast={() => null}>
          <planeGeometry args={[6.6, 3.85]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.06}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <Line
          points={[
            [0, 0.02, -3.3],
            [0, 3.72, -3.3],
            [0, 3.72, 3.3],
            [0, 0.02, 3.3],
            [0, 0.02, -3.3],
          ]}
          color="#ff7a59"
          lineWidth={1.6}
        />
        <Line
          points={[
            [0, 0.03, -3.6],
            [0, 0.03, 3.6],
          ]}
          color="#ffffff"
          lineWidth={2.0}
        />
      </group>
    </group>
  );
}

useGLTF.preload(ARCHITECT_DATA.models.modules.plaza);
useGLTF.preload(ARCHITECT_DATA.models.modules.interior);
useGLTF.preload(ARCHITECT_DATA.models.modules.structure);
useGLTF.preload(ARCHITECT_DATA.models.modules.shell);
useGLTF.preload(ARCHITECT_DATA.models.modules.roof);
