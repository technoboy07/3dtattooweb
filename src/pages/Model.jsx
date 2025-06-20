import { Suspense } from 'react'
import './Model.css'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import Human from './Human'

function Model() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 3, 3]} intensity={1} />
      <Suspense fallback={null}>
        <Human/>
      </Suspense>
      <OrbitControls />
      <Environment preset="sunset" />
    </Canvas>
  )
}

export default Model
