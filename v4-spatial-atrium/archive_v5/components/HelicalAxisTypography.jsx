import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { ARCHITECT_DATA } from '../config/architectData';
import { playHoverTick, playPressPulse } from '../utils/microAudio';

const STEP_ANGLE = (Math.PI * 2) / 5;
const ORBIT_RADIUS = 3.68;
const ARC_BEND_RADIUS = 4.95;

/**
 * Builds an Extruded, Diamond-Beveled, 18°-Arc-Bent 3D Mesh Geometry for VI & EN Sculptural Titles
 */
function buildCurved3DTitleGeometry(font, label) {
  const geo = new TextGeometry(label, {
    font,
    size: 0.23,
    depth: 0.082,
    curveSegments: 4,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.012,
    bevelOffset: 0,
    bevelSegments: 2,
  });

  geo.computeBoundingBox();
  geo.center();

  const bbox = geo.boundingBox;
  const rawWidth = Math.max(0.01, bbox.max.x - bbox.min.x);
  const maxWidth = 2.68;
  const fitScaleX = rawWidth > maxWidth ? maxWidth / rawWidth : 1.0;

  const posAttr = geo.attributes.position;
  const normAttr = geo.attributes.normal;

  for (let i = 0; i < posAttr.count; i += 1) {
    const vx = posAttr.getX(i) * fitScaleX;
    const vy = posAttr.getY(i);
    const vz = posAttr.getZ(i);

    const theta = vx / ARC_BEND_RADIUS;
    const r = ARC_BEND_RADIUS + vz;
    const bentX = Math.sin(theta) * r;
    const bentZ = Math.cos(theta) * r - ARC_BEND_RADIUS;

    posAttr.setXYZ(i, bentX, vy, bentZ);

    if (normAttr) {
      const nx = normAttr.getX(i);
      const ny = normAttr.getY(i);
      const nz = normAttr.getZ(i);
      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);
      normAttr.setXYZ(i, nx * cosT + nz * sinT, ny, -nx * sinT + nz * cosT);
    }
  }

  posAttr.needsUpdate = true;
  if (normAttr) normAttr.needsUpdate = true;
  geo.computeBoundingSphere();
  return geo;
}

function createTintableKineticTexture(text) {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 144;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.42)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 16);
  ctx.lineTo(canvas.width, 16);
  ctx.moveTo(0, canvas.height - 16);
  ctx.lineTo(canvas.width, canvas.height - 16);
  ctx.stroke();

  ctx.font = '500 42px "JetBrains Mono", "Be Vietnam Pro", monospace';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = '#ffffff';
  ctx.shadowBlur = 12;

  const repeated = `${text}   ${text}`;
  ctx.fillText(repeated, canvas.width / 2, canvas.height / 2 + 2);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

export default function HelicalAxisTypography({
  data = ARCHITECT_DATA,
  activeChapter = 0,
  axisSpinRef,
  explodeTarget = 0,
  onJumpChapter,
}) {
  const vnFont = useLoader(FontLoader, '/fonts/vn_arch_bold.json');

  const orbitRigRef = useRef();
  const baseRingRef = useRef();
  const crownRingRef = useRef();
  const baseRingMatRef = useRef();
  const crownRingMatRef = useRef();
  const spinePulsesRef = useRef([]);
  const title3dGroupRefs = useRef([]);
  const hoveredIdxRef = useRef(-1);
  const explodeCurRef = useRef(0);

  const chapters = data.chapters;
  const palettes = data.palettes;

  const tgtPrimary = useMemo(() => new THREE.Color(), []);
  const tgtSecondary = useMemo(() => new THREE.Color(), []);

  // Rebuilds 3D Diamond-Bevel Sculptures seamlessly when `data.langCode` (`vi` <-> `en`) switches!
  const sculptedChapters = useMemo(() => {
    return chapters.map((ch, idx) => {
      const pal = palettes[idx] || palettes[0];
      const label = (ch.title3d || ch.title).toUpperCase();
      const geometry = buildCurved3DTitleGeometry(vnFont, label);

      const frontMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#f9fbff'),
        emissive: new THREE.Color(pal.primary),
        emissiveIntensity: 0.24,
        metalness: 0.52,
        roughness: 0.16,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08,
        iridescence: 1.0,
        iridescenceIOR: 1.42,
        transparent: true,
        opacity: 1.0,
      });

      const bevelMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(pal.primary),
        emissive: new THREE.Color(pal.secondary),
        emissiveIntensity: 1.45,
        metalness: 0.86,
        roughness: 0.18,
        transparent: true,
        opacity: 1.0,
      });

      return { geometry, materials: [frontMat, bevelMat], pal };
    });
  }, [vnFont, chapters, palettes]);

  useEffect(() => {
    sculptedChapters.forEach((item) => {
      item.__rc = (item.__rc || 0) + 1;
    });
    return () => {
      sculptedChapters.forEach((item) => {
        item.__rc -= 1;
        setTimeout(() => {
          if ((item.__rc || 0) <= 0) {
            item.geometry.dispose();
            item.materials.forEach((m) => m.dispose());
          }
        }, 0);
      });
    };
  }, [sculptedChapters]);

  const baseKineticTex = useMemo(
    () => createTintableKineticTexture(data.ringTextBase),
    [data.ringTextBase]
  );

  const crownKineticTex = useMemo(
    () => createTintableKineticTexture(data.ringTextCrown),
    [data.ringTextCrown]
  );

  useEffect(() => {
    baseKineticTex.__rc = (baseKineticTex.__rc || 0) + 1;
    crownKineticTex.__rc = (crownKineticTex.__rc || 0) + 1;
    return () => {
      baseKineticTex.__rc -= 1;
      crownKineticTex.__rc -= 1;
      setTimeout(() => {
        if ((baseKineticTex.__rc || 0) <= 0) baseKineticTex.dispose();
        if ((crownKineticTex.__rc || 0) <= 0) crownKineticTex.dispose();
      }, 0);
    };
  }, [baseKineticTex, crownKineticTex]);

  const helixTrackPoints = useMemo(() => {
    const pts = [];
    const segs = 80;
    for (let i = 0; i <= segs; i += 1) {
      const u = i / segs;
      const ang = u * Math.PI * 2;
      const y = 0.68 + Math.sin(ang * 2) * 0.12;
      pts.push([Math.sin(ang) * ORBIT_RADIUS, y, Math.cos(ang) * ORBIT_RADIUS]);
    }
    return pts;
  }, []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const axisAngle = axisSpinRef?.current?.angle ?? 0;
    const spinVel = axisSpinRef?.current?.velocity ?? 0;
    const px = state.pointer.x;
    const py = state.pointer.y;

    explodeCurRef.current = THREE.MathUtils.damp(explodeCurRef.current, explodeTarget, 4.8, dt);

    const pal = palettes[activeChapter] || palettes[0];
    const kCol = 1 - Math.exp(-3.4 * dt);
    tgtPrimary.set(pal.primary);
    tgtSecondary.set(pal.secondary);
    if (baseRingMatRef.current) baseRingMatRef.current.color.lerp(tgtPrimary, kCol);
    if (crownRingMatRef.current) crownRingMatRef.current.color.lerp(tgtSecondary, kCol);

    if (orbitRigRef.current) {
      orbitRigRef.current.rotation.y = axisAngle;
    }

    const gyroTilt = THREE.MathUtils.clamp(spinVel * 0.065, -0.22, 0.22);
    if (baseRingRef.current) {
      baseRingRef.current.rotation.y = axisAngle * 1.14 + t * 0.085;
      baseRingRef.current.rotation.z = THREE.MathUtils.damp(baseRingRef.current.rotation.z, gyroTilt, 5.0, dt);
      baseRingRef.current.rotation.x = THREE.MathUtils.damp(
        baseRingRef.current.rotation.x,
        Math.abs(gyroTilt) * 0.35,
        5.0,
        dt
      );
    }
    if (crownRingRef.current) {
      crownRingRef.current.position.y = 2.96 + explodeCurRef.current * 2.45;
      crownRingRef.current.rotation.y = -axisAngle * 0.88 - t * 0.068;
      crownRingRef.current.rotation.z = THREE.MathUtils.damp(crownRingRef.current.rotation.z, -gyroTilt * 1.15, 5.0, dt);
    }

    spinePulsesRef.current.forEach((mesh, idx) => {
      if (!mesh) return;
      const u = ((t * (0.38 + idx * 0.09) + idx * 0.33) % 1 + 1) % 1;
      mesh.position.set(0, 0.1 + u * 6.2, 0);
      mesh.material.color.copy(idx % 2 === 0 ? tgtPrimary : tgtSecondary);
    });

    for (let i = 0; i < chapters.length; i += 1) {
      const worldAng = i * STEP_ANGLE + axisAngle;
      const cosFront = Math.cos(worldAng);
      const grp3d = title3dGroupRefs.current[i];
      const scItem = sculptedChapters[i];
      const isHovered = hoveredIdxRef.current === i;

      if (grp3d && scItem) {
        const isFront = cosFront > 0.58;
        const frontFactor = THREE.MathUtils.clamp((cosFront - 0.58) / 0.42, 0, 1);

        const targetRotX = isFront
          ? -py * 0.16 + Math.sin(t * 1.4) * 0.025
          : -0.68 * (1 - Math.max(0, cosFront));
        const targetRotY = isFront ? px * 0.2 : 0;
        const targetY = isFront ? 0.7 + frontFactor * 0.06 + Math.sin(t * 1.6 + i) * 0.018 : 0.46;
        const targetScale = isFront
          ? isHovered
            ? 1.06
            : 1.0
          : cosFront > -0.25
          ? 0.68 + (cosFront + 0.25) * 0.22
          : 0.48;
        const targetOpacity = isFront ? 1.0 : cosFront > -0.3 ? 0.36 + (cosFront + 0.3) * 0.4 : 0.11;

        grp3d.position.y = THREE.MathUtils.damp(grp3d.position.y, targetY, 6.0, dt);
        grp3d.rotation.x = THREE.MathUtils.damp(grp3d.rotation.x, targetRotX, 6.2, dt);
        grp3d.rotation.y = THREE.MathUtils.damp(grp3d.rotation.y, targetRotY, 6.2, dt);

        const nextS = THREE.MathUtils.damp(grp3d.scale.x, targetScale, 6.2, dt);
        grp3d.scale.setScalar(nextS);

        const [frontMat, bevelMat] = scItem.materials;
        frontMat.opacity = THREE.MathUtils.damp(frontMat.opacity, targetOpacity, 6.0, dt);
        bevelMat.opacity = frontMat.opacity;
        frontMat.emissiveIntensity = THREE.MathUtils.damp(
          frontMat.emissiveIntensity,
          isHovered ? 0.52 : isFront ? 0.26 : 0.1,
          6.0,
          dt
        );
        bevelMat.emissiveIntensity = THREE.MathUtils.damp(
          bevelMat.emissiveIntensity,
          isHovered ? 2.45 : isFront ? 1.65 + Math.abs(spinVel) * 0.35 : 0.65,
          6.0,
          dt
        );
      }
    }
  });

  const activePal = palettes[activeChapter] || palettes[0];

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Central Vertical Coaxial Rotation Spine */}
      <Line
        points={[
          [0, -0.05, 0],
          [0, 6.65, 0],
        ]}
        color={activePal.primary}
        lineWidth={1.65}
        dashed
        dashSize={0.18}
        gapSize={0.09}
        transparent
        opacity={0.62}
      />

      {Array.from({ length: 3 }).map((_, idx) => (
        <mesh
          key={idx}
          ref={(el) => {
            spinePulsesRef.current[idx] = el;
          }}
          raycast={() => null}
        >
          <sphereGeometry args={[0.054, 10, 10]} />
          <meshBasicMaterial color={idx % 2 === 0 ? '#f6cf8c' : '#49c5b6'} />
        </mesh>
      ))}

      {/* 2. Gyroscopic Bilingual 3D Curved Kinetic Typography Rings */}
      <mesh ref={baseRingRef} position={[0, 0.22, 0]} raycast={() => null}>
        <cylinderGeometry args={[3.32, 3.32, 0.24, 72, 1, true]} />
        <meshBasicMaterial
          ref={baseRingMatRef}
          map={baseKineticTex}
          color="#f6cf8c"
          transparent
          opacity={0.64}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={crownRingRef} position={[0, 2.96, 0]} raycast={() => null}>
        <cylinderGeometry args={[2.58, 2.58, 0.2, 72, 1, true]} />
        <meshBasicMaterial
          ref={crownRingMatRef}
          map={crownKineticTex}
          color="#49c5b6"
          transparent
          opacity={0.56}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 3. Pure 3D Sculpted Diamond-Bevel Headlines (Zero Floating <Html> Clutter!) */}
      <group ref={orbitRigRef}>
        <Line
          points={helixTrackPoints}
          color={activePal.secondary}
          lineWidth={1.2}
          dashed
          dashSize={0.14}
          gapSize={0.1}
          transparent
          opacity={0.38}
        />

        {chapters.map((ch, idx) => {
          const ang = idx * STEP_ANGLE;
          const nx = Math.sin(ang) * ORBIT_RADIUS;
          const nz = Math.cos(ang) * ORBIT_RADIUS;
          const scItem = sculptedChapters[idx];
          const chPal = palettes[idx] || activePal;

          return (
            <group key={`${data.langCode}-${ch.id}`}>
              <Line
                points={[
                  [0, 0.68, 0],
                  [nx, 0.68, nz],
                ]}
                color={chPal.secondary}
                lineWidth={1.15}
                transparent
                opacity={0.3}
              />

              <group position={[nx, 0, nz]} rotation={[0, ang, 0]}>
                <group
                  ref={(el) => {
                    title3dGroupRefs.current[idx] = el;
                  }}
                  position={[0, 0.82, 0]}
                >
                  <mesh
                    geometry={scItem.geometry}
                    material={scItem.materials}
                    castShadow
                    onPointerOver={(e) => {
                      e.stopPropagation();
                      hoveredIdxRef.current = idx;
                      playHoverTick();
                    }}
                    onPointerOut={() => {
                      if (hoveredIdxRef.current === idx) hoveredIdxRef.current = -1;
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      playPressPulse();
                      onJumpChapter(idx);
                    }}
                  />
                </group>
              </group>
            </group>
          );
        })}
      </group>
    </group>
  );
}
