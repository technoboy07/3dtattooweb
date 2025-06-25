// src/components/Model.jsx
import React, { useState } from 'react';
import { useGLTF, Decal, Html } from '@react-three/drei';

export default function Model({ tattooTexture }) {
  const { scene } = useGLTF('/Human.gltf');
  const [decals, setDecals] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleClick = (e) => {
    if (!tattooTexture) return;
    const newDecal = {
      id: Date.now(),
      position: e.point.toArray(),
      rotation: [0, 0, 0],
      scale: 0.2,
      texture: tattooTexture,
    };
    setDecals([...decals, newDecal]);
    setSelectedIndex(decals.length);
  };

  const updateDecal = (key, value) => {
    setDecals((prev) =>
      prev.map((d, i) => (i === selectedIndex ? { ...d, [key]: value } : d))
    );
  };

  return (
    <>
      <primitive object={scene} onClick={handleClick} />
      {decals.map((decal, i) => (
        <Decal
          key={decal.id}
          position={decal.position}
          rotation={decal.rotation}
          scale={decal.scale}
          map={decal.texture}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedIndex(i);
          }}
        />
      ))}
      {selectedIndex !== null && decals[selectedIndex] && (
        <Html position={decals[selectedIndex].position} center>
          <div className="controls-panel">
            <label>
              Scale:
              <input
                type="range"
                min="0.05"
                max="1"
                step="0.01"
                value={decals[selectedIndex].scale}
                onChange={(e) =>
                  updateDecal('scale', parseFloat(e.target.value))
                }
              />
            </label>
            <label>
              Rotate Z:
              <input
                type="range"
                min="0"
                max={2 * Math.PI}
                step="0.01"
                value={decals[selectedIndex].rotation[2]}
                onChange={(e) =>
                  updateDecal('rotation', [
                    0,
                    0,
                    parseFloat(e.target.value),
                  ])
                }
              />
            </label>
            <button
              onClick={() => {
                setDecals((prev) => prev.filter((_, j) => j !== selectedIndex));
                setSelectedIndex(null);
              }}
            >
              Delete
            </button>
          </div>
        </Html>
      )}
    </>
  );
}
