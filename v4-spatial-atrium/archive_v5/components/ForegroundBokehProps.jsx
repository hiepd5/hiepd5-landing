import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { ARCHITECT_DATA } from '../config/architectData';

function createSoftBokehTexture() {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(size / 2, size / 2, 2, size / 2, size / 2, size / 2);
  grad.addColorStop(0.0, 'rgba(246, 207, 140, 0.65)');
  grad.addColorStop(0.45, 'rgba(223, 177, 107, 0.26)');
  grad.addColorStop(0.8, 'rgba(56, 189, 248, 0.06)');
  grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

export default function ForegroundBokehProps({ activeChapter = 0, campusOffsetX = 1.25 }) {
  const droneGltf = useGLTF(ARCHITECT_DATA.models.drone);
  const treeGltf = useGLTF(ARCHITECT_DATA.models.tree);
  const monolithGltf = useGLTF(ARCHITECT_DATA.models.monolith);

  const droneRef = useRef();
  const leftTreeRef = useRef();
  const rightTreeRef = useRef();
  const monolithRef = useRef();
  const bokehGroupRef = useRef();

  const droneScene = useMemo(() => droneGltf.scene.clone(true), [droneGltf.scene]);
  const treeLeftScene = useMemo(() => treeGltf.scene.clone(true), [treeGltf.scene]);
  const treeRightScene = useMemo(() => treeGltf.scene.clone(true), [treeGltf.scene]);
  const monolithScene = useMemo(() => monolithGltf.scene.clone(true), [monolithGltf.scene]);

  const bokehTexture = useMemo(() => createSoftBokehTexture(), []);

  const bokehDiscs = useMemo(
    () => [
      { pos: [-3.9, 2.35, 5.2], scale: 1.35, opacity: 0.22 },
      { pos: [-3.2, 0.75, 5.5], scale: 1.65, opacity: 0.18 },
      { pos: [4.2, 2.65, 5.0], scale: 1.45, opacity: 0.2 },
      { pos: [3.6, 0.65, 5.4], scale: 1.25, opacity: 0.16 },
      { pos: [-0.8, 3.15, 4.8], scale: 0.95, opacity: 0.14 },
    ],
    []
  );

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const px = state.pointer.x;
    const py = state.pointer.y;

    // Autonomous AI LiDAR Drone: Orbits cleanly around the upper flank without blocking Central Axis Text
    if (droneRef.current) {
      const isHero = activeChapter === 0;
      const targetX = isHero ? 2.85 + px * 0.35 : campusOffsetX - 2.95 + px * 0.25;
      const targetY = isHero ? 2.45 + Math.sin(t * 1.9) * 0.09 + py * 0.16 : 2.65 + Math.sin(t * 1.6) * 0.11;
      const targetZ = isHero ? 2.85 : 1.65;

      droneRef.current.position.x = THREE.MathUtils.damp(droneRef.current.position.x, targetX, 3.8, dt);
      droneRef.current.position.y = THREE.MathUtils.damp(droneRef.current.position.y, targetY, 3.8, dt);
      droneRef.current.position.z = THREE.MathUtils.damp(droneRef.current.position.z, targetZ, 3.2, dt);

      droneRef.current.rotation.z = THREE.MathUtils.damp(droneRef.current.rotation.z, -px * 0.22, 4.5, dt);
      droneRef.current.rotation.x = THREE.MathUtils.damp(droneRef.current.rotation.x, 0.14 - py * 0.12, 4.5, dt);
      droneRef.current.rotation.y = 0.48 + Math.sin(t * 0.7) * 0.12;
    }

    // Foreground Bonsai Trees shift opposite to pointer to create real Z-Depth optical parallax
    if (leftTreeRef.current) {
      leftTreeRef.current.position.x = THREE.MathUtils.damp(leftTreeRef.current.position.x, -4.15 - px * 0.42, 4.0, dt);
      leftTreeRef.current.position.y = THREE.MathUtils.damp(leftTreeRef.current.position.y, -0.55 - py * 0.15, 4.0, dt);
    }
    if (rightTreeRef.current) {
      rightTreeRef.current.position.x = THREE.MathUtils.damp(rightTreeRef.current.position.x, 4.55 - px * 0.42, 4.0, dt);
      rightTreeRef.current.position.y = THREE.MathUtils.damp(rightTreeRef.current.position.y, -0.48 - py * 0.15, 4.0, dt);
    }

    if (bokehGroupRef.current) {
      bokehGroupRef.current.position.x = THREE.MathUtils.damp(bokehGroupRef.current.position.x, -px * 0.55, 3.5, dt);
      bokehGroupRef.current.position.y = THREE.MathUtils.damp(bokehGroupRef.current.position.y, -py * 0.28, 3.5, dt);
    }

    // Sculptural Bronze Mobius Monolith on the reflective plaza
    if (monolithRef.current) {
      monolithRef.current.rotation.y = t * 0.35;
    }
  });

  return (
    <group>
      {/* Autonomous LiDAR Drone Asset (.glb) + Volumetric Scan Cone */}
      <group ref={droneRef} position={[2.85, 2.45, 2.85]} scale={1.12}>
        <primitive object={droneScene} />
        <mesh position={[0, -0.62, 0.08]} rotation={[0.12, 0, 0]} raycast={() => null}>
          <coneGeometry args={[0.42, 1.25, 24, 1, true]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.11}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* Foreground Z-Depth Framing Architectural Bonsai Trees (.glb) */}
      <group ref={leftTreeRef} position={[-4.15, -0.55, 4.55]} rotation={[0, 0.5, 0]} scale={1.32}>
        <primitive object={treeLeftScene} />
      </group>
      <group ref={rightTreeRef} position={[4.55, -0.48, 4.35]} rotation={[0, -2.2, 0]} scale={1.25}>
        <primitive object={treeRightScene} />
      </group>

      {/* Soft Optical Foreground Bokeh Particles */}
      <group ref={bokehGroupRef}>
        {bokehDiscs.map((b, i) => (
          <sprite key={i} position={b.pos} scale={[b.scale, b.scale, 1]} raycast={() => null}>
            <spriteMaterial
              map={bokehTexture}
              transparent
              opacity={b.opacity}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </sprite>
        ))}
      </group>

      {/* Plaza Museum Bronze Monolith (.glb) */}
      <group position={[campusOffsetX - 3.35, 0, -1.55]} scale={0.95}>
        <group ref={monolithRef}>
          <primitive object={monolithScene} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload(ARCHITECT_DATA.models.drone);
useGLTF.preload(ARCHITECT_DATA.models.tree);
useGLTF.preload(ARCHITECT_DATA.models.monolith);
