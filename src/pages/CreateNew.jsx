import React, { useState, Suspense, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import Model from './Model'; // Ensure this path is correct
import * as THREE from 'three';
import './CreateNew.css';

export default function CreateNew() {
  // State for tattoo texture
  const [tattooTexture, setTattooTexture] = useState(null);
  // State for decal properties
  const [decalProps, setDecalProps] = useState(null);

  // State for UI controls
  const [isModelLocked, setIsModelLocked] = useState(false);
  const [isDecalLocked, setIsDecalLocked] = useState(false);
  const [decalMode, setDecalMode] = useState('move'); // 'move', 'rotate', 'scale'

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setTattooTexture(url);
    setDecalProps(null); // Reset decal on new image
  };

  const handleDecalPlace = (event) => {
    event.stopPropagation();
    if (tattooTexture && !decalProps) {
      setDecalProps({
        position: event.point,
        rotation: new THREE.Euler(0, 0, 0),
        scale: new THREE.Vector3(0.15, 0.15, 0.15),
      });
    }
  };

  // Centralized handler to update any decal property
  const handleDecalPropertyChange = useCallback((newProps) => {
    if (!decalProps) return;
    setDecalProps(prev => ({ ...prev, ...newProps }));
  }, [decalProps]);


  const controlSection = (
     <div className="control-section">
        <h4>Model Controls</h4>
        <div className="control-item">
            <input
                type="checkbox"
                id="lock-model"
                checked={isModelLocked}
                onChange={(e) => setIsModelLocked(e.target.checked)}
            />
            <label htmlFor="lock-model">Lock Model (Pan/Zoom/Rotate)</label>
        </div>
     </div>
  );

  const decalControlSection = decalProps && (
    <div className="control-section">
        <h4>Decal Controls</h4>
        <div className="control-item">
            <input
                type="checkbox"
                id="lock-decal"
                checked={isDecalLocked}
                onChange={(e) => setIsDecalLocked(e.target.checked)}
            />
            <label htmlFor="lock-decal">Lock Decal (Move/Rotate/Scale)</label>
        </div>
        
        {!isDecalLocked && (
            <>
                <div className="control-item mode-selector">
                    <button className={decalMode === 'move' ? 'active' : ''} onClick={() => setDecalMode('move')}>Move</button>
                    <button className={decalMode === 'rotate' ? 'active' : ''} onClick={() => setDecalMode('rotate')}>Rotate</button>
                    <button className={decalMode === 'scale' ? 'active' : ''} onClick={() => setDecalMode('scale')}>Scale</button>
                </div>

                {decalMode === 'rotate' && (
                    <div className="control-item">
                        <label htmlFor="decal-rotation">Rotation</label>
                        <input
                            type="range"
                            id="decal-rotation"
                            min="-3.14"
                            max="3.14"
                            step="0.01"
                            value={decalProps.rotation.z}
                            onChange={(e) => handleDecalPropertyChange({ rotation: new THREE.Euler(decalProps.rotation.x, decalProps.rotation.y, parseFloat(e.target.value)) })}
                        />
                    </div>
                )}

                {decalMode === 'scale' && (
                    <div className="control-item">
                        <label htmlFor="decal-scale">Scale</label>
                        <input
                            type="range"
                            id="decal-scale"
                            min="0.05"
                            max="0.5"
                            step="0.01"
                            value={decalProps.scale.x}
                            onChange={(e) => {
                                const newScale = parseFloat(e.target.value);
                                handleDecalPropertyChange({ scale: new THREE.Vector3(newScale, newScale, newScale) });
                            }}
                        />
                    </div>
                )}
            </>
        )}
    </div>
  );


  return (
    <div className="create-new-wrapper">
      <div className="model-viewer">
        <Canvas camera={{ position: [0, 0, 2.5], fov: 50 }} shadows>
          <color attach="background" args={['#f0f0f0']} />
          <ambientLight intensity={0.8} />
          <directionalLight 
            position={[5, 10, 7.5]} 
            intensity={1.5} 
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <Suspense fallback={null}>
            <Model 
                tattooTexture={tattooTexture}
                decalProps={decalProps}
                onDecalUpdate={handleDecalPropertyChange}
                onDecalPlace={handleDecalPlace}
                isDecalLocked={isDecalLocked}
                decalMode={decalMode}
            />
          </Suspense>
          <OrbitControls enabled={!isModelLocked} minDistance={1} maxDistance={5} />
          <Environment preset="studio" />
        </Canvas>
      </div>

      <div className="side-panel">
        <h2>Tattoo Customizer</h2>
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleImageUpload}
          id="file-upload"
          style={{ display: 'none' }}
        />
        <label htmlFor="file-upload" className="upload-button">
          {tattooTexture ? 'Change Tattoo' : 'Upload Tattoo'}
        </label>
        
        {tattooTexture && (
            <div className="tattoo-preview-container">
                <h3>Current Tattoo:</h3>
                <img src={tattooTexture} alt="Tattoo preview" className="tattoo-preview" />
            </div>
        )}
        
        {controlSection}
        {decalControlSection}

        <div className="instructions">
            {!tattooTexture && <p className="instruction-step"><b>Step 1:</b> Upload a tattoo image.</p>}
            {tattooTexture && !decalProps && <p className="instruction-step"><b>Step 2:</b> Click on the model to place it.</p>}
            {decalProps && decalMode === 'move' && !isDecalLocked && <p className="instruction-step"><b>Mode: Move.</b> Drag the decal on the model.</p>}
            {decalProps && decalMode !== 'move' && !isDecalLocked && <p className="instruction-step"><b>Mode: {decalMode}.</b> Use the sliders to adjust.</p>}
        </div>
      </div>
    </div>
  );
}
