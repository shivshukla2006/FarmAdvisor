import { Canvas, useFrame } from "@react-three/fiber";
import { Float, ContactShadows, OrbitControls } from "@react-three/drei";
import { useRef, Suspense, useState, useEffect } from "react";
import * as THREE from "three";

const Wheel = ({ position, radius = 0.35, width = 0.2 }: { position: [number, number, number]; radius?: number; width?: number }) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.x += delta * 3;
  });
  return (
    <mesh ref={ref} position={position} rotation={[0, Math.PI / 2, 0]}>
      <cylinderGeometry args={[radius, radius, width, 16]} />
      <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
    </mesh>
  );
};

const Tractor = () => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      {/* Body */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[1.8, 0.7, 1]} />
        <meshStandardMaterial color="#2d8a2d" roughness={0.4} metalness={0.3} />
      </mesh>
      {/* Cabin */}
      <mesh position={[-0.2, 1.2, 0]}>
        <boxGeometry args={[1, 0.8, 0.9]} />
        <meshStandardMaterial color="#247024" roughness={0.3} metalness={0.4} />
      </mesh>
      {/* Windows */}
      <mesh position={[-0.2, 1.25, 0.46]}>
        <boxGeometry args={[0.7, 0.5, 0.02]} />
        <meshStandardMaterial color="#87CEEB" roughness={0.1} metalness={0.8} transparent opacity={0.7} />
      </mesh>
      <mesh position={[-0.2, 1.25, -0.46]}>
        <boxGeometry args={[0.7, 0.5, 0.02]} />
        <meshStandardMaterial color="#87CEEB" roughness={0.1} metalness={0.8} transparent opacity={0.7} />
      </mesh>
      {/* Hood */}
      <mesh position={[0.9, 0.45, 0]}>
        <boxGeometry args={[0.6, 0.5, 0.85]} />
        <meshStandardMaterial color="#35a035" roughness={0.4} metalness={0.3} />
      </mesh>
      {/* Exhaust */}
      <mesh position={[0.7, 1.3, 0.3]}>
        <cylinderGeometry args={[0.04, 0.05, 0.7, 8]} />
        <meshStandardMaterial color="#555" roughness={0.5} metalness={0.7} />
      </mesh>
      {/* Grille */}
      <mesh position={[1.21, 0.45, 0]}>
        <boxGeometry args={[0.02, 0.35, 0.65]} />
        <meshStandardMaterial color="#222" roughness={0.6} />
      </mesh>
      {/* Headlights */}
      <mesh position={[1.22, 0.55, 0.25]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[1.22, 0.55, -0.25]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.5} />
      </mesh>
      {/* Wheels */}
      <Wheel position={[-0.5, 0.05, 0.6]} radius={0.45} width={0.25} />
      <Wheel position={[-0.5, 0.05, -0.6]} radius={0.45} width={0.25} />
      <Wheel position={[0.8, 0.05, 0.5]} radius={0.28} width={0.18} />
      <Wheel position={[0.8, 0.05, -0.5]} radius={0.28} width={0.18} />
      {/* Fenders */}
      <mesh position={[-0.5, 0.45, 0.62]}>
        <boxGeometry args={[0.6, 0.06, 0.3]} />
        <meshStandardMaterial color="#1f7a1f" roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[-0.5, 0.45, -0.62]}>
        <boxGeometry args={[0.6, 0.06, 0.3]} />
        <meshStandardMaterial color="#1f7a1f" roughness={0.4} metalness={0.3} />
      </mesh>
    </group>
  );
};

const GrassGround = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.75, 0]} receiveShadow>
    <circleGeometry args={[3, 32]} />
    <meshStandardMaterial color="#2d6b2d" roughness={0.9} />
  </mesh>
);

const FloatingLeaves = () => {
  const leaves = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (leaves.current) {
      leaves.current.children.forEach((leaf, i) => {
        leaf.position.y = Math.sin(state.clock.elapsedTime * 0.5 + i * 2) * 0.3 + 1.5 + i * 0.3;
        leaf.rotation.z = state.clock.elapsedTime * 0.3 + i;
      });
    }
  });

  return (
    <group ref={leaves}>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[Math.cos(i * 1.5) * 1.8, 1.5, Math.sin(i * 1.5) * 1.8]}>
          <planeGeometry args={[0.15, 0.25]} />
          <meshStandardMaterial color="#4caf50" side={THREE.DoubleSide} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
};

const Scene = () => (
  <>
    <ambientLight intensity={0.6} />
    <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
    <directionalLight position={[-3, 3, -3]} intensity={0.3} color="#FFD700" />
    <pointLight position={[0, 3, 0]} intensity={0.4} color="#87CEEB" />
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <Tractor />
    </Float>
    <FloatingLeaves />
    <GrassGround />
    <ContactShadows position={[0, -0.74, 0]} opacity={0.4} scale={8} blur={2} />
    <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} maxPolarAngle={Math.PI / 2.2} minPolarAngle={Math.PI / 4} />
  </>
);

export const FarmScene = () => {
  const [webGLAvailable, setWebGLAvailable] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) setWebGLAvailable(false);
    } catch {
      setWebGLAvailable(false);
    }
  }, []);

  if (!webGLAvailable) {
    return (
      <div className="w-full h-[280px] sm:h-[350px] md:h-[400px] flex items-center justify-center">
        <div className="text-white/40 text-sm">3D scene requires WebGL support</div>
      </div>
    );
  }

  return (
    <div className="w-full h-[280px] sm:h-[350px] md:h-[400px] rounded-xl overflow-hidden">
      <Canvas
        camera={{ position: [3, 2.5, 3], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
};
