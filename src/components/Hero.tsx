import { useEffect, useRef, useState, memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Shared mutable object to store scroll values for R3F GPU loop (prevents React re-renders)
const scrollState = {
  scale: 1.25,
  rotationY: 0,
  rotationX: 0,
  positionZ: 0,
  positionY: 0,
  opacity: 1.0,
  layerSeparation: 0.0, // 0.0 = closed, 1.0 = fully open
  serverGlow: 0.5,      // glow intensity of internal servers
  pulseSpeed: 1.0,      // speed multiplier for data pulses
};

// Holographic line connector between server nodes (Cylinder)
const CylinderLine = memo(function CylinderLine({ 
  start, 
  end, 
  geometry, 
  material 
}: { 
  start: THREE.Vector3; 
  end: THREE.Vector3; 
  geometry: THREE.BufferGeometry; 
  material: THREE.Material 
}) {
  const direction = new THREE.Vector3().subVectors(end, start);
  const distance = direction.length();
  const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  
  const up = new THREE.Vector3(0, 1, 0);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(up, direction.clone().normalize());
  
  return (
    <mesh 
      position={midpoint} 
      quaternion={quaternion} 
      scale={[0.015, distance, 0.015]} 
      geometry={geometry} 
      material={material} 
    />
  );
});

// Data pulse travelling along network lines
const DataPulse = memo(function DataPulse({ 
  start, 
  end, 
  delay, 
  geometry, 
  material 
}: { 
  start: THREE.Vector3; 
  end: THREE.Vector3; 
  delay: number; 
  geometry: THREE.BufferGeometry; 
  material: THREE.Material 
}) {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const speed = scrollState.pulseSpeed;
    const progress = ((time * 0.4 * speed) + delay) % 1.0;
    
    if (ref.current) {
      ref.current.position.lerpVectors(start, end, progress);
    }
  });
  
  return <mesh ref={ref} geometry={geometry} material={material} />;
});

// 3D Enterprise Cloud Architecture (Memoized to prevent React overhead)
const CloudComputingModel = memo(function CloudComputingModel() {
  const frontGroup = useRef<THREE.Group>(null);
  const backGroup = useRef<THREE.Group>(null);
  const rotationGroup = useRef<THREE.Group>(null);
  const serversRef = useRef<THREE.Group>(null);

  // Server positions (nodes)
  const nodeA = new THREE.Vector3(0, 0, 0);          // Center Server
  const nodeB = new THREE.Vector3(-0.5, -0.2, 0.0);   // Left Server
  const nodeC = new THREE.Vector3(0.5, -0.2, -0.05);  // Right Server
  const nodeD = new THREE.Vector3(0, 0.45, -0.05);    // Top Server
  const nodeE = new THREE.Vector3(-0.8, 0.25, 0.1);   // Outer Node Left
  const nodeF = new THREE.Vector3(0.8, 0.25, -0.1);   // Outer Node Right

  // Share geometries to drastically reduce poly count & memory allocations
  const sharedSphereGeometry = useMemo(() => new THREE.SphereGeometry(1, 14, 14), []); // Reduced subdivisions
  const sharedBoxGeometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const sharedCylinderGeometry = useMemo(() => new THREE.CylinderGeometry(1, 1, 1, 4), []);
  const sharedPulseGeometry = useMemo(() => new THREE.SphereGeometry(0.035, 6, 6), []);

  // Share materials to reduce draw calls
  const glassMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    transmission: 0.95,
    roughness: 0.18,
    thickness: 0.75,
    clearcoat: 1.0,
    clearcoatRoughness: 0.03,
    color: "#cbd5e1",
    attenuationColor: "#282764",
    attenuationDistance: 0.65,
    ior: 1.52,
    transparent: true,
    opacity: 0.88,
  }), []);

  const lineMatBlue = useMemo(() => new THREE.MeshBasicMaterial({ color: '#38bdf8', transparent: true, opacity: 0.3 }), []);
  const lineMatPurple = useMemo(() => new THREE.MeshBasicMaterial({ color: '#818cf8', transparent: true, opacity: 0.3 }), []);
  const lineMatGreen = useMemo(() => new THREE.MeshBasicMaterial({ color: '#68C247', transparent: true, opacity: 0.3 }), []);
  const pulseMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: '#68C247', toneMapped: false }), []);

  const serverMatA = useMemo(() => new THREE.MeshPhysicalMaterial({ color: "#090d16", emissive: "#68C247", emissiveIntensity: 1.0, roughness: 0.05, metalness: 0.9, clearcoat: 1.0 }), []);
  const serverMatB = useMemo(() => new THREE.MeshPhysicalMaterial({ color: "#090d16", emissive: "#38bdf8", emissiveIntensity: 1.0, roughness: 0.05, metalness: 0.9, clearcoat: 1.0 }), []);
  const serverMatC = useMemo(() => new THREE.MeshPhysicalMaterial({ color: "#090d16", emissive: "#818cf8", emissiveIntensity: 1.0, roughness: 0.05, metalness: 0.9, clearcoat: 1.0 }), []);
  const serverMatD = useMemo(() => new THREE.MeshPhysicalMaterial({ color: "#090d16", emissive: "#68C247", emissiveIntensity: 1.0, roughness: 0.05, metalness: 0.9, clearcoat: 1.0 }), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const sep = scrollState.layerSeparation; // 0 to 1

    // 10-second slow vertical float loop (±10px equivalent: 0.05 units)
    const idleFloat = Math.sin(time * 0.6) * 0.05;
    
    // Very slow rotation drift: ±1° (0.017 radians)
    const idleRotate = Math.sin(time * 0.15) * 0.017;
    
    // Subtle breathing scale idle: 0.98 -> 1.00
    const breathingScale = 0.99 + Math.sin(time * 0.6) * 0.01;

    if (rotationGroup.current) {
      rotationGroup.current.position.y = scrollState.positionY + idleFloat;
      rotationGroup.current.position.z = scrollState.positionZ;
      rotationGroup.current.scale.setScalar(scrollState.scale * breathingScale);
      
      // Combine scroll rotation and idle rotation
      rotationGroup.current.rotation.y = scrollState.rotationY + idleRotate;
      rotationGroup.current.rotation.x = scrollState.rotationX + Math.cos(time * 0.2) * 0.01;
    }

    // Exploding separation of front and back glass shells
    if (frontGroup.current) {
      frontGroup.current.position.z = 0.15 + sep * 0.65;
    }
    if (backGroup.current) {
      backGroup.current.position.z = -0.15 - sep * 0.65;
    }

    // Rotate internal servers and update emissive intensity on scroll
    if (serversRef.current) {
      serversRef.current.children.forEach((server, idx) => {
        server.rotation.y = time * 0.4 + idx;
        server.rotation.x = time * 0.2;
        
        const mat = (server as THREE.Mesh).material as THREE.MeshPhysicalMaterial;
        if (mat) {
          mat.emissiveIntensity = scrollState.serverGlow * (0.8 + Math.sin(time * 3 + idx) * 0.2);
        }
      });
    }
  });

  const frontSpheres = [
    { pos: [0, 0, 0.1], r: 1.05 },
    { pos: [-0.9, -0.1, 0.2], r: 0.75 },
    { pos: [0.9, -0.1, 0.15], r: 0.75 },
    { pos: [-0.5, 0.45, 0.25], r: 0.65 },
    { pos: [0.5, 0.45, 0.2], r: 0.65 },
    { pos: [0, -0.3, 0.3], r: 0.5 },
  ];

  const backSpheres = [
    { pos: [0, 0.1, -0.1], r: 1.0 },
    { pos: [-0.9, 0.0, -0.15], r: 0.7 },
    { pos: [0.9, 0.0, -0.2], r: 0.7 },
    { pos: [-0.4, 0.5, -0.25], r: 0.6 },
    { pos: [0.4, 0.5, -0.2], r: 0.6 },
    { pos: [0, -0.2, -0.3], r: 0.5 },
  ];

  return (
    <group ref={rotationGroup}>
      {/* FRONT FROSTED SHELL */}
      <group ref={frontGroup}>
        {frontSpheres.map((s, i) => (
          <mesh 
            key={i} 
            position={s.pos as any} 
            scale={[s.r, s.r, s.r]} 
            geometry={sharedSphereGeometry} 
            material={glassMaterial} 
          />
        ))}
      </group>

      {/* BACK FROSTED SHELL */}
      <group ref={backGroup}>
        {backSpheres.map((s, i) => (
          <mesh 
            key={i} 
            position={s.pos as any} 
            scale={[s.r, s.r, s.r]} 
            geometry={sharedSphereGeometry} 
            material={glassMaterial} 
          />
        ))}
      </group>

      {/* GLOWING DATA LAYER & NETWORKS */}
      <group>
        {/* Holographic Network Lines */}
        <CylinderLine start={nodeA} end={nodeB} geometry={sharedCylinderGeometry} material={lineMatBlue} />
        <CylinderLine start={nodeA} end={nodeC} geometry={sharedCylinderGeometry} material={lineMatBlue} />
        <CylinderLine start={nodeA} end={nodeD} geometry={sharedCylinderGeometry} material={lineMatBlue} />
        <CylinderLine start={nodeB} end={nodeE} geometry={sharedCylinderGeometry} material={lineMatPurple} />
        <CylinderLine start={nodeC} end={nodeF} geometry={sharedCylinderGeometry} material={lineMatPurple} />
        <CylinderLine start={nodeD} end={nodeE} geometry={sharedCylinderGeometry} material={lineMatGreen} />
        <CylinderLine start={nodeD} end={nodeF} geometry={sharedCylinderGeometry} material={lineMatGreen} />

        {/* Data Pulses traversing coordinates */}
        <DataPulse start={nodeB} end={nodeA} delay={0.0} geometry={sharedPulseGeometry} material={pulseMaterial} />
        <DataPulse start={nodeC} end={nodeA} delay={0.3} geometry={sharedPulseGeometry} material={pulseMaterial} />
        <DataPulse start={nodeD} end={nodeA} delay={0.6} geometry={sharedPulseGeometry} material={pulseMaterial} />
        <DataPulse start={nodeA} end={nodeE} delay={0.15} geometry={sharedPulseGeometry} material={pulseMaterial} />
        <DataPulse start={nodeA} end={nodeF} delay={0.45} geometry={sharedPulseGeometry} material={pulseMaterial} />

        {/* Glowing Server Cubes */}
        <group ref={serversRef}>
          <mesh position={[nodeA.x, nodeA.y, nodeA.z]} scale={[0.26, 0.26, 0.26]} geometry={sharedBoxGeometry} material={serverMatA} />
          <mesh position={[nodeB.x, nodeB.y, nodeB.z]} scale={[0.22, 0.22, 0.22]} geometry={sharedBoxGeometry} material={serverMatB} />
          <mesh position={[nodeC.x, nodeC.y, nodeC.z]} scale={[0.22, 0.22, 0.22]} geometry={sharedBoxGeometry} material={serverMatC} />
          <mesh position={[nodeD.x, nodeD.y, nodeD.z]} scale={[0.2, 0.2, 0.2]} geometry={sharedBoxGeometry} material={serverMatD} />
        </group>
      </group>
    </group>
  );
});

// Surrounding particles, orbit rings, and external floating cubes (Memoized)
const SurroundingArchitecture = memo(function SurroundingArchitecture() {
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const cubesRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Group>(null);

  // Pre-calculated shared geometries & materials
  const ringGeometry1 = useMemo(() => new THREE.TorusGeometry(2.6, 0.012, 3, 20), []); // Lower poly subdivisions
  const ringGeometry2 = useMemo(() => new THREE.TorusGeometry(3.2, 0.01, 3, 20), []);
  
  const ringMaterial1 = useMemo(() => new THREE.MeshBasicMaterial({ color: "#cbd5e1", transparent: true, opacity: 0.15 }), []);
  const ringMaterial2 = useMemo(() => new THREE.MeshBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.1 }), []);

  const sharedBoxGeometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const remoteCubeMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({ transmission: 0.95, roughness: 0.1, thickness: 0.2, color: "#ffffff", transparent: true }), []);

  const sharedParticleGeometry = useMemo(() => new THREE.SphereGeometry(0.02, 4, 4), []);
  const particleMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.3 }), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Orbit rings: extremely slow rotation, almost unnoticeable
    if (ring1.current) {
      ring1.current.rotation.z = time * 0.005;
    }
    if (ring2.current) {
      ring2.current.rotation.z = -time * 0.003;
    }

    if (cubesRef.current) {
      cubesRef.current.children.forEach((cube, idx) => {
        cube.position.y += Math.sin(time * 0.5 + idx) * 0.001;
        cube.rotation.y = time * 0.05 + idx;
      });
    }

    // Particles: move very gently
    if (particlesRef.current) {
      particlesRef.current.children.forEach((p, idx) => {
        p.position.y += Math.cos(time * 0.4 + idx) * 0.0005;
        p.position.x += Math.sin(time * 0.3 + idx) * 0.0003;
      });
    }
  });

  return (
    <group>
      {/* Outer Orbit Rings */}
      <mesh ref={ring1} rotation={[Math.PI / 2.2, 0, 0]} geometry={ringGeometry1} material={ringMaterial1} />
      <mesh ref={ring2} rotation={[-Math.PI / 2.3, 0, 0]} geometry={ringGeometry2} material={ringMaterial2} />

      {/* Floating glass cubes representing remote data nodes */}
      <group ref={cubesRef}>
        <mesh position={[-2.2, 1.2, 0.5]} scale={[0.15, 0.15, 0.15]} geometry={sharedBoxGeometry} material={remoteCubeMaterial} />
        <mesh position={[2.4, -0.8, -0.6]} scale={[0.18, 0.18, 0.18]} geometry={sharedBoxGeometry} material={remoteCubeMaterial} />
        <mesh position={[-1.8, -1.0, 0.8]} scale={[0.12, 0.12, 0.12]} geometry={sharedBoxGeometry} material={remoteCubeMaterial} />
      </group>

      {/* Reduced Particles */}
      <group ref={particlesRef}>
        <mesh position={[1.5, 1.0, -0.5]} geometry={sharedParticleGeometry} material={particleMaterial} />
        <mesh position={[-1.2, -1.2, 0.4]} geometry={sharedParticleGeometry} material={particleMaterial} />
        <mesh position={[2.0, -0.5, 0.8]} geometry={sharedParticleGeometry} material={particleMaterial} />
      </group>
    </group>
  );
});

export default function Hero() {
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const textGroupRef = useRef<HTMLDivElement>(null);
  const buttonGroupRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  // Dynamic frameloop state to switch to 'demand' when idle, saving GPU resources
  const [frameloop, setFrameloop] = useState<'always' | 'demand'>('always');

  useEffect(() => {
    let timeoutId: number;
    const handleScroll = () => {
      setFrameloop('always');
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        setFrameloop('demand');
      }, 500); // 500ms after scrolling stops, suspend active frames
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (!pinContainerRef.current) return;

    // Pin the Hero wrapper for a shorter responsive duration (500px to unpin faster)
    const pinTrigger = ScrollTrigger.create({
      trigger: pinContainerRef.current,
      start: 'top top',
      end: '+=500', // Pin duration reduced to 500 to keep it extremely tight
      pin: true,
      scrub: true,
      invalidateOnRefresh: true,
    });

    // Pinned scroll timeline: scrub: 0.2 (extremely responsive, 200ms latency)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: pinContainerRef.current,
        start: 'top top',
        end: '+=500',
        scrub: 0.2,
      }
    });

    // Immediate fade out of scroll indicator on scroll
    tl.to(scrollIndicatorRef.current, {
      opacity: 0,
      y: 10,
      duration: 0.1,
      ease: 'power2.out',
    }, 0);

    // 1. Scroll 0% -> 15% (Slight upward drift, fully visible, button and text fully readable)
    tl.to(scrollState, {
      positionY: 0.1,
      scale: 1.27,
      rotationY: 0.005,
      layerSeparation: 0.05,
      serverGlow: 0.55,
      pulseSpeed: 1.05,
      duration: 0.15,
      ease: 'power2.out',
    }, 0)
    .to(textGroupRef.current, {
      opacity: 1.0,
      filter: 'blur(0px)',
      duration: 0.15,
      ease: 'power2.out',
    }, 0)
    .to(buttonGroupRef.current, {
      opacity: 1.0,
      scale: 1.0,
      duration: 0.15,
      ease: 'power2.out',
    }, 0);

    // 2. Scroll 15% -> 70% (Explore My Work starts fading immediately: duration 0.55, y: -18, opacity: 0, scale: 0.98, ease: power2.out)
    tl.to(buttonGroupRef.current, {
      y: -18,
      opacity: 0,
      scale: 0.98,
      ease: 'power2.out',
      force3D: true,
      duration: 0.55,
    }, 0.15);

    // Text Group Exit (starts at 15% scroll, fades to 70% opacity at 45% scroll, then fades to 0 at 80% scroll)
    tl.to(textGroupRef.current, {
      opacity: 0.7,
      filter: 'blur(0px)',
      ease: 'power2.out',
      duration: 0.3, // 0.15 to 0.45
    }, 0.15)
    .to(textGroupRef.current, {
      opacity: 0,
      filter: 'blur(4px)',
      ease: 'power2.out',
      duration: 0.35, // 0.45 to 0.80
    }, 0.45);

    // Cloud movements (mid scroll to scale 1.65, rotation < 5° (0.07 rad))
    tl.to(scrollState, {
      positionY: 1.0,
      scale: 1.65,
      rotationY: 0.07, // ~4° (below 5° limits)
      layerSeparation: 0.65,
      serverGlow: 1.8,
      pulseSpeed: 2.0,
      duration: 0.45, // 0.15 to 0.60
      ease: 'power2.out',
    }, 0.15);

    // 3. Scroll 60% -> 100% (Exit: Cloud leaves off the top, fades to 0 along with text)
    tl.to(scrollState, {
      positionY: 6.5,      // Moves off screen at top
      scale: 2.0,
      rotationY: 0.15,
      layerSeparation: 1.0,
      serverGlow: 2.5,
      opacity: 0.0,
      duration: 0.4, // 0.60 to 1.0
      ease: 'power2.out',
    }, 0.6);

    return () => {
      pinTrigger.kill();
      tl.kill();
    };
  }, []);

  // Entrance load animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0, filter: 'blur(8px)' },
    visible: {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const lineRevealVariants = {
    hidden: { y: '100%', opacity: 0, filter: 'blur(10px)' },
    visible: {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <div
      id="home"
      ref={pinContainerRef}
      className="w-full min-h-[82vh] relative overflow-hidden bg-transparent scroll-mt-24"
      onMouseEnter={() => setFrameloop('always')}
      onMouseLeave={() => setFrameloop('demand')}
    >
      {/* 3D Canvas Layer (Absolute background behind centered text overlay) */}
      <div className="absolute inset-0 w-full h-full z-0 select-none pointer-events-none">
        <Canvas
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          camera={{ position: [0, 0, 5.5], fov: 45 }}
          frameloop={frameloop} // Dynamically toggles to demand when idle
        >
          <ambientLight intensity={0.45} />
          
          {/* Key lights for VisionOS glassmorphic specular shine */}
          <directionalLight position={[8, 8, 8]} intensity={2.2} color="#ffffff" />
          <directionalLight position={[-8, 4, -4]} intensity={1.5} color="#82d962" />
          <directionalLight position={[0, -5, 5]} intensity={1.2} color="#2d2d73" />
          
          <CloudComputingModel />
          <SurroundingArchitecture />
          
          {/* Pre-packaged studio environment for HDRI reflections */}
          <Environment preset="studio" />
        </Canvas>
      </div>

      {/* Centered Content Wrapper: reduced min-height to 82vh and bottom padding to pb-8 */}
      <div ref={contentRef} className="w-full min-h-[82vh] flex flex-col items-center justify-center relative z-10 px-6 pt-20 pb-8">
        
        <motion.div
          className="w-full max-w-[850px] mx-auto text-center flex flex-col items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Text Group */}
          <div ref={textGroupRef} className="w-full flex flex-col items-center will-change-[transform,opacity,filter]">
            {/* Badge */}
            <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel text-[10px] font-bold tracking-[0.2em] text-primary uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                VALO TECH
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="text-4xl sm:text-6xl md:text-[76px] font-extrabold leading-[0.98] text-[#0A0E1A] tracking-tighter mb-8 select-none"
            >
              <span className="block overflow-hidden relative pb-1">
                <motion.span className="block" variants={lineRevealVariants}>
                  Building Digital
                </motion.span>
              </span>
              <span className="block overflow-hidden relative pb-1">
                <motion.span className="block" variants={lineRevealVariants}>
                  Solutions That
                </motion.span>
              </span>
              <span className="block overflow-hidden relative pb-1">
                <motion.span className="block" variants={lineRevealVariants}>
                  <span className="text-primary">Drive </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-secondary-dark relative">
                    Real Results.
                  </span>
                </motion.span>
              </span>
            </motion.h1>

            {/* Paragraph */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-primary/70 leading-relaxed max-w-[650px] mb-10"
            >
              I help businesses and brands grow with modern web applications, stunning designs, and powerful digital strategies.
            </motion.p>
          </div>

          {/* Button Group: reduced margin bottom to mb-8 */}
          <div ref={buttonGroupRef} className="w-full flex justify-center will-change-[transform,opacity]">
            <motion.div variants={itemVariants} className="mb-8">
              <motion.a
                href="#project"
                whileHover="hover"
                whileTap="tap"
                variants={{
                  hover: { y: -6, scale: 1.03 },
                  tap: { y: 0, scale: 0.98 }
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="relative inline-flex items-center gap-2.5 px-8 py-4 text-white text-xs font-bold tracking-[0.15em] uppercase rounded-full glass-button-primary hover:border-white/50 transition-glass duration-500 group overflow-hidden shadow-xl shadow-primary/10"
              >
                <motion.div
                  className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 -left-full pointer-events-none"
                  variants={{
                    hover: {
                      left: '100%',
                      transition: { duration: 0.8, ease: 'easeInOut' }
                    }
                  }}
                />
                <span>Explore My Work</span>
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </motion.a>
            </motion.div>
          </div>

          {/* Bouncing & Fading Scroll Indicator Group */}
          <div ref={scrollIndicatorRef} className="w-full flex flex-col items-center">
            <motion.div
              animate={{
                y: [0, 6, 0],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="flex flex-col items-center gap-3 text-primary/50 text-[10px] font-bold tracking-[0.2em] uppercase select-none"
            >
              <span>Scroll to Explore</span>
              <div className="w-[1.5px] h-10 bg-gradient-to-b from-primary/40 to-transparent rounded-full" />
            </motion.div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
