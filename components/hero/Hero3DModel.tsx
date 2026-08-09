"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Icosahedron, Edges } from "@react-three/drei";
import * as THREE from "three";

function BrutalistShape() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <mesh ref={meshRef}>
      <Icosahedron args={[2, 0]}>
        <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
        <Edges
          scale={1.05}
          threshold={15} // Display edges only when angle exceeds this
          color="black"
        />
      </Icosahedron>
      
      {/* Inner smaller shape for depth */}
      <mesh>
        <Icosahedron args={[1.2, 0]}>
           <meshBasicMaterial color="#ffffff" transparent opacity={0} />
           <Edges scale={1} threshold={15} color="#ff6b00" />
        </Icosahedron>
      </mesh>
    </mesh>
  );
}

export default function Hero3DModel() {
  return (
    <div className="w-full h-full absolute inset-0 z-0">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 1.5]} 
        performance={{ min: 0.5 }}
        gl={{ antialias: false }}
      >
        <BrutalistShape />
      </Canvas>
    </div>
  );
}
