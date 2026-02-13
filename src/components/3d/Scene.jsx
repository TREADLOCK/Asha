import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Model from './Model';

export default function Scene({ isEntering, onLoaded }) {
  return (
    <Canvas 
      camera={{ position: [0, 0, 5], fov: 45 }}
      // Simplified GL settings for stability
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 1.5]}
      className="fixed inset-0 z-0 pointer-events-none bg-black"
    >
      <color attach="background" args={['#000000']} />
      
      <Suspense fallback={null}>
         <Model isEntering={isEntering} onLoaded={onLoaded} />
      </Suspense>
    </Canvas>
  );
}
