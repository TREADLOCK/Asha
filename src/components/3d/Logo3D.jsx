import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import * as THREE from 'three';

const LogoModel = () => {
    const meshRef = useRef();

    const shape = useMemo(() => {
        // Path from Preloader.jsx:
        // M256 64 L330 170 L300 170 L256 110 L212 170 L182 170 Z
        // M168 190 L212 190 L256 250 L300 190 L344 190 L256 330 Z
        // M120 360 L200 360 L256 420 L312 360 L392 360 L256 470 Z
        
        const loader = new SVGLoader();
        const svgData = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M256 64 L330 170 L300 170 L256 110 L212 170 L182 170 Z M168 190 L212 190 L256 250 L300 190 L344 190 L256 330 Z M120 360 L200 360 L256 420 L312 360 L392 360 L256 470 Z" />
            </svg>
        `;
        const paths = loader.parse(svgData).paths;
        const shapes = paths[0].toShapes(true);
        
        return shapes;
    }, []);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.01;
            // Subtle hover effect
            meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.5) * 1.5;
        }
    });

    return (
        <group scale={[0.07, -0.07, 0.07]}>
            <mesh ref={meshRef}>
                <extrudeGeometry
                    onUpdate={(self) => self.center()}
                    args={[
                        shape,
                        { depth: 40, bevelEnabled: true, bevelThickness: 5, bevelSize: 5, bevelSegments: 3 }
                    ]}
                />
                <meshStandardMaterial 
                    color="#ffffff" 
                    roughness={0.1} 
                    metalness={0.8}
                    emissive="#ffffff"
                    emissiveIntensity={0.2}
                />
            </mesh>
            <ambientLight intensity={1.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
        </group>
    );
};

const Logo3D = () => {
    return (
        <div className="w-12 h-12 flex items-center justify-center pointer-events-none" style={{ background: 'transparent' }}>
            <Canvas
                orthographic
                camera={{ zoom: 1, position: [0, 0, 100] }}
                gl={{ antialias: true, alpha: true }}
                style={{ background: 'transparent' }}
            >
                <LogoModel />
            </Canvas>
        </div>
    );
};

export default Logo3D;
