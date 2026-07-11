import { useRef, useState, useEffect, useMemo, memo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Dynamic Shape Geometry component for the rounded platform
function RoundedRectShape({ width, height, radius }: { width: number; height: number; radius: number }) {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    const x = -width / 2;
    const y = -height / 2;
    
    s.moveTo(x, y + radius);
    s.lineTo(x, y + height - radius);
    s.quadraticCurveTo(x, y + height, x + radius, y + height);
    s.lineTo(x + width - radius, y + height);
    s.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
    s.lineTo(x + width, y + radius);
    s.quadraticCurveTo(x + width, y, x + width - radius, y);
    s.lineTo(x + radius, y);
    s.quadraticCurveTo(x, y, x, y + radius);
    return s;
  }, [width, height, radius]);

  return <shapeGeometry args={[shape]} />;
}

// Component to handle individual floating glass objects (Memoized props)
const GlassObject = memo(function GlassObject({ 
  geometry, 
  material, 
  scale, 
  position, 
  speed 
}: {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  scale: [number, number, number] | number;
  position: [number, number, number];
  speed: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialY = position[1];

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      // Bobbing up and down
      meshRef.current.position.y = initialY + Math.sin(time * speed) * 0.4;
      // Continuous rotation
      meshRef.current.rotation.x = time * (speed * 0.1);
      meshRef.current.rotation.y = time * (speed * 0.15);
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      position={position} 
      scale={typeof scale === 'number' ? [scale, scale, scale] : scale}
      geometry={geometry} 
      material={material}
      castShadow 
      receiveShadow 
    />
  );
});

// VALO Logo Cube (Glass outer cube with double-heart logo core) (Memoized)
const ValoLogoCube = memo(function ValoLogoCube({ 
  position, 
  speed,
  outerGeometry,
  outerMaterial,
  coreGeometry,
  coreMaterial1,
  coreMaterial2
}: { 
  position: [number, number, number]; 
  speed: number;
  outerGeometry: THREE.BufferGeometry;
  outerMaterial: THREE.Material;
  coreGeometry: THREE.BufferGeometry;
  coreMaterial1: THREE.Material;
  coreMaterial2: THREE.Material;
}) {
  const outerRef = useRef<THREE.Mesh>(null);
  const coreRef1 = useRef<THREE.Mesh>(null);
  const coreRef2 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Animate outer cube
    if (outerRef.current) {
      outerRef.current.position.y = position[1] + Math.sin(time * speed) * 0.3;
      outerRef.current.rotation.x = time * (speed * 0.1);
      outerRef.current.rotation.y = time * (speed * 0.15);
    }

    // Animate cores (floating slightly inside the cube)
    if (coreRef1.current && coreRef2.current) {
      coreRef1.current.rotation.z = Math.sin(time) * 0.2;
      coreRef2.current.rotation.z = -Math.sin(time) * 0.2;
    }
  });

  return (
    <group position={position}>
      {/* Outer Glass Cube */}
      <mesh ref={outerRef} geometry={outerGeometry} material={outerMaterial} castShadow>
        {/* Inside logo core 1 (Blue/Purple) */}
        <mesh ref={coreRef1} position={[-0.2, 0, 0]} geometry={coreGeometry} material={coreMaterial1} />
        {/* Inside logo core 2 (Green) */}
        <mesh ref={coreRef2} position={[0.2, 0.1, 0]} geometry={coreGeometry} material={coreMaterial2} />
      </mesh>
    </group>
  );
});

export default function ThreeCanvas() {
  // Suspend dynamic R3F frameloop when idle to optimize power usage
  const [frameloop, setFrameloop] = useState<'always' | 'demand'>('always');

  useEffect(() => {
    let timeoutId: number;
    const handleScroll = () => {
      setFrameloop('always');
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        setFrameloop('demand');
      }, 500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.clearTimeout(timeoutId);
    };
  }, []);

  // Shared assets pre-allocations
  const sharedSphereGeometry = useMemo(() => new THREE.SphereGeometry(1, 16, 16), []);
  const sharedBoxGeometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);

  const logoOuterGeometry = useMemo(() => new THREE.BoxGeometry(1.2, 1.2, 1.2), []);
  const logoCoreGeometry = useMemo(() => new THREE.BoxGeometry(0.3, 0.6, 0.3), []);

  // Shared materials definitions
  const logoOuterMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#ffffff",
    transmission: 0.95,
    thickness: 1.5,
    roughness: 0.05,
    clearcoat: 1.0,
    ior: 1.6
  }), []);

  const logoCoreMaterial1 = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#2D2D73",
    roughness: 0.2,
    metalness: 0.8,
    emissive: "#2D2D73",
    emissiveIntensity: 0.2
  }), []);

  const logoCoreMaterial2 = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#68C247",
    roughness: 0.2,
    metalness: 0.8,
    emissive: "#68C247",
    emissiveIntensity: 0.2
  }), []);

  const deckMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#ffffff",
    transmission: 0.85,
    thickness: 1.5,
    roughness: 0.15,
    clearcoat: 1.0,
    ior: 1.45,
    transparent: true,
    opacity: 0.9
  }), []);

  // Glass objects materials
  const matSphere1 = useMemo(() => new THREE.MeshPhysicalMaterial({ color: "#a5b4fc", transmission: 0.9, thickness: 1.2, roughness: 0.1, clearcoat: 1.0, clearcoatRoughness: 0.1, ior: 1.5, attenuationDistance: 0.5, attenuationColor: "#a5b4fc", transparent: true, opacity: 0.8 }), []);
  const matSphere2 = useMemo(() => new THREE.MeshPhysicalMaterial({ color: "#86efac", transmission: 0.9, thickness: 1.2, roughness: 0.1, clearcoat: 1.0, clearcoatRoughness: 0.1, ior: 1.5, attenuationDistance: 0.5, attenuationColor: "#86efac", transparent: true, opacity: 0.8 }), []);
  const matSphere3 = useMemo(() => new THREE.MeshPhysicalMaterial({ color: "#ffffff", transmission: 0.9, thickness: 1.2, roughness: 0.1, clearcoat: 1.0, clearcoatRoughness: 0.1, ior: 1.5, attenuationDistance: 0.5, attenuationColor: "#ffffff", transparent: true, opacity: 0.8 }), []);
  const matBox1 = useMemo(() => new THREE.MeshPhysicalMaterial({ color: "#e0e7ff", transmission: 0.9, thickness: 1.2, roughness: 0.1, clearcoat: 1.0, clearcoatRoughness: 0.1, ior: 1.5, attenuationDistance: 0.5, attenuationColor: "#e0e7ff", transparent: true, opacity: 0.8 }), []);

  return (
    <div 
      className="w-full h-full min-h-[500px] lg:min-h-[650px] relative select-none"
      onMouseEnter={() => setFrameloop('always')}
      onMouseLeave={() => setFrameloop('demand')}
    >
      <Canvas
        shadows
        camera={{ position: [0, 0.5, 7.8], fov: 48 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        frameloop={frameloop}
      >
        {/* Soft Ambient Lights */}
        <ambientLight intensity={1.5} color="#e0e7ff" />
        
        {/* Warm and Cool Directional Lights for Highlights */}
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={2.5} 
          color="#ffffff"
          castShadow 
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight 
          position={[-8, 5, -2]} 
          intensity={1.5} 
          color="#82d962" 
        />

        {/* Glowing Translucent Glass Platform */}
        <group position={[0, -1.2, 0]}>
          {/* Main Glass Deck */}
          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} material={deckMaterial}>
            <RoundedRectShape width={8.8} height={5.8} radius={0.8} />
          </mesh>

          {/* Under-glow Point Lights */}
          <pointLight position={[0, -0.2, 0]} intensity={4.5} distance={6} color="#68C247" />
          <pointLight position={[-2, -0.2, -1]} intensity={3.5} distance={5} color="#2D2D73" />
          <pointLight position={[2, -0.2, 1]} intensity={3.5} distance={5} color="#2D2D73" />
        </group>

        {/* Floating Objects */}
        {/* Floating Glass Spheres */}
        <GlassObject geometry={sharedSphereGeometry} material={matSphere1} scale={0.5} position={[-4.5, 1.8, -1.5]} speed={0.7} />
        <GlassObject geometry={sharedSphereGeometry} material={matSphere2} scale={0.35} position={[4.6, 2.2, 1.0]} speed={0.9} />
        <GlassObject geometry={sharedSphereGeometry} material={matSphere3} scale={0.25} position={[-3.8, -0.8, 2.0]} speed={1.2} />
        
        {/* Floating Glass Cube */}
        <GlassObject geometry={sharedBoxGeometry} material={matBox1} scale={[0.6, 0.6, 0.6]} position={[4.0, -1.0, -1.0]} speed={0.8} />

        {/* Floating VALO Logo Cube */}
        <ValoLogoCube 
          position={[3.2, 0.5, 2.0]} 
          speed={0.9} 
          outerGeometry={logoOuterGeometry}
          outerMaterial={logoOuterMaterial}
          coreGeometry={logoCoreGeometry}
          coreMaterial1={logoCoreMaterial1}
          coreMaterial2={logoCoreMaterial2}
        />
      </Canvas>
    </div>
  );
}

// Set up Y-up axis defaults
THREE.Object3D.DEFAULT_UP.set(0, 1, 0);
