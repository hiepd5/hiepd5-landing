import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import { ARCHITECT_DATA } from '../config/architectData';
import { playHoverTick, playPressPulse } from '../utils/microAudio';

function calcSunPosition(hour) {
  const norm = THREE.MathUtils.clamp((hour - 6.0) / 12.0, 0.04, 0.96);
  const ang = Math.PI * (1 - norm);
  return [
    Math.cos(ang) * 4.85,
    Math.sin(ang) * 4.35 + 0.35,
    -0.85 + Math.sin(norm * Math.PI) * 0.65,
  ];
}

export default function UrbanSimulationOverlay({
  data = ARCHITECT_DATA,
  campusOffsetX = 0.0,
  fxMode = 'auto',
  showUrbanSim = false,
  showPortals = false,
  activeAnchorId = null,
  onSelectAnchor,
  hideAnchors = false,
}) {
  const windParticlesRef = useRef([]);
  const sunGroupRef = useRef();

  const solarArcPoints = useMemo(() => {
    const pts = [];
    const steps = 48;
    for (let i = 0; i <= steps; i += 1) {
      const t = i / steps;
      const ang = Math.PI * (1 - t);
      const x = Math.cos(ang) * 4.85;
      const y = Math.sin(ang) * 4.35 + 0.35;
      const z = -0.85 + Math.sin(t * Math.PI) * 0.65;
      pts.push([x, y, z]);
    }
    return pts;
  }, []);

  const defaultSunPos = useMemo(() => calcSunPosition(15.5), []);

  const sunRayObj = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const arr = new Float32Array([...calcSunPosition(15.5), 0, 1.6, 0]);
    geo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
    const mat = new THREE.LineBasicMaterial({
      color: '#ffffff',
      transparent: true,
      opacity: 0.3,
    });
    return new THREE.Line(geo, mat);
  }, []);

  const windCorridors = useMemo(() => {
    const defs = [
      [
        [-5.2, 0.55, 2.8],
        [-2.4, 0.72, 2.45],
        [0.0, 0.85, 2.65],
        [2.6, 0.72, 2.25],
        [5.2, 0.58, 1.5],
      ],
      [
        [-5.0, 1.35, -2.4],
        [-2.2, 1.55, -2.35],
        [0.2, 1.65, -2.55],
        [2.7, 1.42, -2.1],
        [5.1, 1.15, -1.3],
      ],
      [
        [-4.8, 2.25, 0.2],
        [-2.1, 3.45, 0.15],
        [0.3, 3.72, 0.0],
        [2.6, 3.35, -0.15],
        [4.9, 2.15, -0.35],
      ],
    ];
    return defs.map((ctrl) => {
      const curve = new THREE.CatmullRomCurve3(ctrl.map((p) => new THREE.Vector3(...p)));
      return {
        curve,
        points: curve.getPoints(56).map((v) => [v.x, v.y, v.z]),
      };
    });
  }, []);

  const zoningBoxPoints = useMemo(() => {
    const w = 3.35;
    const d = 2.95;
    const h = 3.75;
    return [
      [-w, 0.05, -d],
      [w, 0.05, -d],
      [w, 0.05, d],
      [-w, 0.05, d],
      [-w, 0.05, -d],
      [-w, h, -d],
      [w, h, -d],
      [w, h, d],
      [-w, h, d],
      [-w, h, -d],
    ];
  }, []);

  useFrame((state) => {
    if (!showUrbanSim) return;
    const t = state.clock.elapsedTime;
    const liveHour = fxMode === 'solar' ? 12.0 + Math.sin(t * 0.75) * 4.5 : 15.5;
    const [sx, sy, sz] = calcSunPosition(liveHour);
    if (sunGroupRef.current) {
      sunGroupRef.current.position.set(sx, sy, sz);
    }
    const posAttr = sunRayObj.geometry.getAttribute('position');
    if (posAttr) {
      posAttr.setXYZ(0, sx, sy, sz);
      posAttr.needsUpdate = true;
    }

    windParticlesRef.current.forEach((mesh, idx) => {
      if (!mesh) return;
      const cIdx = idx % windCorridors.length;
      const offset = Math.floor(idx / windCorridors.length) * 0.33;
      const u = ((t * 0.26 + offset + cIdx * 0.17) % 1 + 1) % 1;
      const pos = windCorridors[cIdx].curve.getPointAt(u);
      mesh.position.copy(pos);
    });
  });

  const zTag = data.ui.zoningTag;
  const zoningOpen = activeAnchorId === 'sim:zoning';
  const shortLabels = data.v6?.hotspotShort || {};

  const renderHotspot = (key, isOpen, label, ariaLabel) => (
    <button
      type="button"
      className={`hotspot ${isOpen ? 'is-active' : ''}`}
      aria-expanded={isOpen}
      aria-label={ariaLabel}
      onPointerDown={(e) => e.stopPropagation()}
      onPointerEnter={playHoverTick}
      onClick={(e) => {
        e.stopPropagation();
        playPressPulse();
        onSelectAnchor?.(isOpen ? null : key);
      }}
    >
      <span className="hotspot-dot" aria-hidden="true" />
      <span className="hotspot-label">{label}</span>
    </button>
  );

  return (
    <group position={[campusOffsetX, 0, 0]}>
      {showUrbanSim && (
        <group>
          <Line points={solarArcPoints} color="#ff7a59" lineWidth={1.4} dashed dashSize={0.22} gapSize={0.14} transparent opacity={0.8} />

          <group ref={sunGroupRef} position={defaultSunPos}>
            <mesh raycast={() => null}>
              <sphereGeometry args={[0.18, 20, 20]} />
              <meshBasicMaterial color="#fff3e6" />
            </mesh>
            <mesh raycast={() => null}>
              <sphereGeometry args={[0.4, 20, 20]} />
              <meshBasicMaterial
                color="#ff7a59"
                transparent
                opacity={0.22}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          </group>
          <primitive object={sunRayObj} />

          {windCorridors.map((w, idx) => (
            <Line key={idx} points={w.points} color="#f5f5f7" lineWidth={1.2} transparent opacity={0.42} />
          ))}

          {Array.from({ length: 9 }).map((_, idx) => (
            <mesh
              key={idx}
              ref={(el) => {
                windParticlesRef.current[idx] = el;
              }}
              raycast={() => null}
            >
              <sphereGeometry args={[0.05, 10, 10]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          ))}

          <Line points={zoningBoxPoints} color="#f5f5f7" lineWidth={0.8} transparent opacity={0.22} />

          {!hideAnchors && (
            <Html position={[-3.2, 3.88, -2.85]} center zIndexRange={[16, 0]}>
              {renderHotspot('sim:zoning', zoningOpen, shortLabels.zoning || 'FAR', zTag.name)}
            </Html>
          )}
        </group>
      )}

      {showPortals && (
        <group>
          {data.ecosystemPortals.map((portal) => {
            const pKey = `portal:${portal.id}`;
            const isOpen = activeAnchorId === pKey;

            return (
              <group key={portal.id} position={portal.position}>
                <mesh position={[0, -0.89, 0]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
                  <ringGeometry args={[0.32, 0.36, 48]} />
                  <meshBasicMaterial
                    color={isOpen ? '#ff7a59' : '#f5f5f7'}
                    transparent
                    opacity={isOpen ? 0.8 : 0.35}
                    side={THREE.DoubleSide}
                  />
                </mesh>

                {!hideAnchors && (
                  <Html position={[0, 0.2, 0]} center zIndexRange={isOpen ? [36, 20] : [15, 0]}>
                    {renderHotspot(pKey, isOpen, portal.code, portal.title)}
                  </Html>
                )}
              </group>
            );
          })}
        </group>
      )}
    </group>
  );
}
