import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { shaderMaterial, useProgress } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler';

// 1. Define the Custom Shader Material
const ParticleMorphMaterial = shaderMaterial(
  {
    uProgress: 0,
    uEntrance: 0,
    uTime: 0,
    uScale: 1.0, 
    uColor: new THREE.Color('#ff2d55'),
    uColor2: new THREE.Color('#2962ff'),
    uColor3: new THREE.Color('#e0e0e0'),
  },
  // Vertex Shader
  `
    uniform float uProgress;
    uniform float uEntrance;
    uniform float uTime;
    uniform float uScale;
    
    attribute vec3 aPositionTarget; 
    attribute vec3 aPositionTargetSymbol;
    attribute float aRandom;
    
    varying float vAlpha;
    varying float vEntrance;
    varying float vRandom;
    
    void main() {
      vRandom = aRandom;
      vec3 chaos = vec3(
        (fract(aRandom * 123.4) - 0.5) * 20.0,
        (fract(aRandom * 567.8) - 0.5) * 20.0,
        (fract(aRandom * 910.1) - 0.5) * 20.0
      );
      
      float p1 = smoothstep(0.0, 0.2, uProgress);
      float p2 = smoothstep(0.6, 0.75, uProgress); 
      float p3 = smoothstep(0.95, 1.0, uProgress); 
      
      vec3 dnaPos = mix(position, aPositionTarget, p1);
      vec3 targetPos = mix(dnaPos, aPositionTargetSymbol, p2);
      vec3 finalPos = mix(targetPos, position, p3);
      
      vec3 pos = mix(chaos, finalPos, smoothstep(0.0, 0.8, uEntrance));
      
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      
      float tHero = smoothstep(0.65, 1.0, uEntrance);
      float exposure = pow(tHero, 0.4) * pow(1.0 - tHero, 2.5) * 4.0;
      
      float fuse = smoothstep(0.9, 1.0, uProgress);
      float sparkleSize = smoothstep(0.5, 1.0, aRandom) * exposure * 30.0;
      float baseSize = (12.0 + fuse * 12.0 + sparkleSize) * uScale; 
      
      gl_PointSize = baseSize * (1.0 / -mvPosition.z); 
      gl_Position = projectionMatrix * mvPosition;
      
      vAlpha = 1.0;
      vEntrance = uEntrance;
    }
  `,
  // (Fragment shader remains same)
  `
    uniform float uProgress;
    uniform vec3 uColor;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    
    varying float vEntrance;
    varying float vRandom;

    void main() {
      float r = distance(gl_PointCoord, vec2(0.5));
      if (r > 0.5) discard;
      float strength = 1.0 - (r * 2.0);
      strength = pow(strength, 3.0);
      
      float mixBlue = smoothstep(0.2, 0.35, uProgress);
      float mixWhite = smoothstep(0.85, 0.95, uProgress);
      float mixHeartBack = smoothstep(0.98, 1.0, uProgress);
      
      vec3 activeColor = mix(uColor, uColor2, mixBlue);
      activeColor = mix(activeColor, uColor3, mixWhite);
      activeColor = mix(activeColor, uColor, mixHeartBack);
      
      float t = smoothstep(0.65, 1.0, vEntrance);
      float flashMask = smoothstep(0.5, 1.0, vRandom);
      float exposure = pow(t, 0.4) * pow(1.0 - t, 2.5) * 4.0 * flashMask;
      
      vec3 fusedColor = mix(activeColor, vec3(8.0), exposure);
      vec3 finalColor = fusedColor + (exposure * 5.0);
      
      gl_FragColor = vec4(finalColor, strength);
    }
  `
);

extend({ ParticleMorphMaterial });

// ... (getTextPoints and generateParticleData stay same)

// Helper to sample points from text using a canvas
const getTextPoints = (text, count) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1000;
    canvas.height = 400;
    
    ctx.fillStyle = 'white';
    // Using a bold serif font for a "Valentine" feel
    ctx.font = 'bold 240px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const points = [];
    
    // Sample points from the text pixels
    for (let y = 0; y < canvas.height; y += 4) {
        for (let x = 0; x < canvas.width; x += 4) {
            const index = (y * canvas.width + x) * 4;
            if (imageData[index + 3] > 128) {
                // Map to normalized -1 to 1 range
                points.push({
                    x: (x / canvas.width - 0.5) * 6.0,
                    y: (0.5 - y / canvas.height) * 2.0,
                    z: (Math.random() - 0.5) * 0.15 // Slight depth for 3D feel
                });
            }
        }
    }
    
    const target = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const p = points[Math.floor(Math.random() * points.length)];
        if (p) {
            target[i * 3] = p.x;
            target[i * 3 + 1] = p.y;
            target[i * 3 + 2] = p.z;
        }
    }
    return target;
};

// Helper to generate initial particle data and targets
const generateParticleData = (count, roseMesh) => {
    const pos = new Float32Array(count * 3);
    const target = new Float32Array(count * 3);
    const targetSymbol = getTextPoints('ASHA', count); // Replaced chevron with ASHA text
    const rand = new Float32Array(count);

    let sampler;
    if (roseMesh) {
        sampler = new MeshSurfaceSampler(roseMesh).build();
    }
    const tempPosition = new THREE.Vector3();
    const tempNormal = new THREE.Vector3();
    const yAxis = new THREE.Vector3(0, 1, 0);

    for (let i = 0; i < count; i++) {
        const r1 = Math.random();
        const r2 = Math.random();
        const r4 = Math.random();

        // --- 1. VALENTINE'S HEART (Base Position) ---
        const t = r1 * Math.PI * 2;
        // Reduced heart size to match rose visually
        const heartScale = 0.07; 
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
        const depth = (r2 - 0.5) * 0.8;
        
        pos[i * 3] = hx * heartScale;
        // Centering the heart (approximate offset based on formula)
        pos[i * 3 + 1] = (hy + 5.0) * heartScale; 
        pos[i * 3 + 2] = depth;

        // --- 2. SAMPLED ROSE MESH (Intermediate Target) ---
        if (sampler) {
            sampler.sample(tempPosition, tempNormal);
            tempPosition.applyAxisAngle(yAxis, Math.PI / 1.7);
            const scale = 0.017;
            target[i * 3] = tempPosition.x * scale;
            // Shifted UP significantly (decreased subtraction from 45 to 10)
            target[i * 3 + 1] = (tempPosition.y - 12) * scale;
            target[i * 3 + 2] = tempPosition.z * scale;
        } else {
             target[i * 3] = 0;
             target[i * 3 + 1] = 0;
             target[i * 3 + 2] = 0;
        }

        rand[i] = r4;
    }

    return [pos, target, targetSymbol, rand];
};

export default function Model({ isEntering, onLoaded }) {
  const { viewport } = useThree();
  const material = useRef();
  const mesh = useRef();
  // Increased particle count for higher density rose
  const count = 25000;

  // Calculate responsive scale (1.0 on desktop, 0.6-0.8 on mobile)
  const responsiveScale = useMemo(() => {
    // If viewport width is large (desktop), don't scale down
    if (viewport.width > 6) return 1.0;
    return Math.min(1, Math.max(0.7, viewport.width / 5)); 
  }, [viewport.width]);

  const { progress } = useProgress();

  useEffect(() => {
    if (progress === 100 && onLoaded) {
      onLoaded();
    }
  }, [progress, onLoaded]);

  const roseObj = useLoader(OBJLoader, '/models/rose.obj');

  const [positions, targetPositions, targetSymbolPositions, randoms] = useMemo(() => {
    let roseMesh = null;
    if (roseObj) {
        roseObj.traverse((child) => {
            if (child.isMesh) roseMesh = child;
        });
    }
    return generateParticleData(count, roseMesh);
  }, [count, roseObj]);

  useFrame((state, delta) => {
     if (material.current && mesh.current && mesh.current.scale) {
        // Apply responsive scale to the entire points group
        mesh.current.scale.setScalar(responsiveScale);

        const scrollY = window.scrollY;
        // Map progress across the entire scrollable range (1075vh total approx)
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const rawProgress = Math.min(1, Math.max(0, scrollY / maxScroll));
        
        // --- 1. PROGRESS SYNC ---
        const prevProgress = material.current.uProgress;
        material.current.uProgress = THREE.MathUtils.damp(prevProgress, rawProgress, 15, delta);
        const dProg = material.current.uProgress; 

        // --- 2. ENTRANCE SYNC ---
        const targetEntrance = isEntering ? 0 : 1;
        material.current.uEntrance = THREE.MathUtils.damp(material.current.uEntrance, targetEntrance, 1.2, delta);

        // --- 3. ROTATION LOGIC ---
        // Lock rotation tighter as we reach the final symbol (0.8+)
        const lockIn = THREE.MathUtils.smoothstep(dProg, 0.8, 0.95);
        const freedom = 1.0 - lockIn;

        const baseRotY = dProg * Math.PI * 6; // Faster base rotation
        const extraRotation = THREE.MathUtils.smoothstep(dProg, 0.85, 1.0) * Math.PI * 2;
        const targetRotY = baseRotY + extraRotation; 

        mesh.current.rotation.y = targetRotY;
        mesh.current.rotation.x = (dProg * 0.3) * freedom;
        mesh.current.rotation.z = (dProg * 0.05) * freedom;

        // Absolute Lock
        if (dProg > 0.97) {
            mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, 0, 0.1);
            mesh.current.rotation.z = THREE.MathUtils.lerp(mesh.current.rotation.z, 0, 0.1);
        }

        // --- 3. CAMERA CINEMATIC ZOOM (Synced) ---
        // DELAYED ZOOM: Start at 0.95 instead of 0.9
        const zoomPhase = THREE.MathUtils.smoothstep(dProg, 0.95, 1.0);
        // Adjusted target positions to account for scaling
        const targetZ = THREE.MathUtils.lerp(5, -2.5 * responsiveScale, zoomPhase);
        const targetY = THREE.MathUtils.lerp(0, 0.8 * responsiveScale, zoomPhase);
        
        state.camera.position.z = targetZ;
        state.camera.position.y = targetY;
        
        const lookTargetZ = THREE.MathUtils.lerp(0, -10, zoomPhase);
        state.camera.lookAt(0, targetY, lookTargetZ);

        material.current.uTime = state.clock.elapsedTime;
     }
  });

  return (
    <points ref={mesh}>
        <bufferGeometry>
            <bufferAttribute
                attach="attributes-position"
                count={count}
                array={positions}
                itemSize={3}
            />
            <bufferAttribute
                attach="attributes-aPositionTarget"
                count={count}
                array={targetPositions}
                itemSize={3}
            />
            <bufferAttribute
                attach="attributes-aPositionTargetSymbol"
                count={count}
                array={targetSymbolPositions}
                itemSize={3}
            />
            <bufferAttribute
                attach="attributes-aRandom"
                count={count}
                array={randoms}
                itemSize={1}
            />
        </bufferGeometry>
        {/* @ts-ignore */}
        <particleMorphMaterial 
            ref={material} 
            transparent 
            depthWrite={false} 
            blending={THREE.AdditiveBlending}
            uScale={responsiveScale} 
        />
    </points>
  );
}
