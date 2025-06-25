// src/pages/CreateNew.jsx
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import Model from '../pages/Model';
import * as THREE from 'three';
import './CreateNew.css';

export default function CreateNew() {
  const [tattooTexture, setTattooTexture] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const texture = new THREE.TextureLoader().load(url);
    setTattooTexture(texture);
  };

  return (
    <div className="create-new-wrapper">
      <div className="model-viewer">
        <Canvas camera={{ position: [0, 1, 2.5], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 10, 5]} intensity={1} />
          <Model tattooTexture={tattooTexture} />
          <OrbitControls />
          <Environment preset="studio" />
        </Canvas>
      </div>

      <div className="side-panel">
        <h2>Upload & Customize Tattoo</h2>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          id="file-upload"
          style={{ display: 'none' }}
        />
        <label htmlFor="file-upload" className="upload-button">Upload Tattoo</label>
        <p>Select a tattoo image and click on the 3D model to place it.</p>
      </div>
    </div>
  );
}
