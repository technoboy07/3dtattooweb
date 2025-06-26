import React, { useMemo, useRef } from 'react';
import { useGLTF, Decal, useTexture } from '@react-three/drei';
import { useDrag } from '@use-gesture/react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

const MODEL_PATH = '/Human2.glb';

// This component renders the interactive tattoo decal
function Tattoo({ textureUrl, initialProps, onUpdate, isDecalLocked, decalMode }) {
  const decalRef = useRef();
  const { scene } = useThree();
  const mesh = useMemo(() => scene.getObjectByProperty('type', 'Mesh'), [scene]);
  const texture = useTexture(textureUrl);

  // Gesture handling for drag to move
  const bind = useDrag(
    ({ active, event }) => {
      if (!active) return;
      event.stopPropagation();
      // Raycasting to find the point on the model under the cursor
      if (event.intersections.length > 0) {
        onUpdate({ position: event.intersections[0].point });
      }
    },
    // Only enable drag if the decal is not locked AND the mode is 'move'
    { enabled: !isDecalLocked && decalMode === 'move', eventOptions: { pointer: true } }
  );

  if (!mesh) return null;

  return (
    <Decal
      ref={decalRef}
      mesh={mesh}
      position={initialProps.position}
      rotation={initialProps.rotation}
      scale={initialProps.scale}
      map={texture}
      {...bind()}
    >
      <meshStandardMaterial
        map={texture}
        transparent
        polygonOffset
        polygonOffsetFactor={-10}
        depthTest={false}
      />
    </Decal>
  );
}

// This component loads and displays the human model
function Human({ children, onModelClick }) {
  const { nodes } = useGLTF(MODEL_PATH);
  const bodyNode = useMemo(() => Object.values(nodes).find(node => node.isMesh), [nodes]);

  if (!bodyNode) {
    console.error("No mesh found in the GLTF model. Displaying a fallback box.");
    return <mesh onClick={onModelClick}><boxGeometry args={[0.7, 1.5, 0.7]} /><meshStandardMaterial color="gray" /></mesh>;
  }

  return (
    <group>
      <mesh
        geometry={bodyNode.geometry}
        material={bodyNode.material}
        castShadow
        receiveShadow
        onClick={onModelClick}
      >
        <meshStandardMaterial color="#e0caba" roughness={0.6} metalness={0.2} />
        {children}
      </mesh>
    </group>
  );
}

// The main export of this file
export default function Model({ tattooTexture, decalProps, onDecalUpdate, onDecalPlace, isDecalLocked, decalMode }) {
  return (
    <Human onModelClick={onDecalPlace}>
      {tattooTexture && decalProps && (
        <Tattoo
          textureUrl={tattooTexture}
          initialProps={decalProps}
          onUpdate={onDecalUpdate}
          isDecalLocked={isDecalLocked}
          decalMode={decalMode}
        />
      )}
    </Human>
  );
}
