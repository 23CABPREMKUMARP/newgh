"use client"

import { Suspense, useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Text, Float, OrbitControls } from "@react-three/drei"
import type * as THREE from "three"

const skills = [
  { name: "React", position: [-2, 2, 0], color: "#61dafb" },
  { name: "Next.js", position: [2, 2, 0], color: "#000000" },
  { name: "TypeScript", position: [0, 0, 2], color: "#3178c6" },
  { name: "Node.js", position: [-2, -2, 0], color: "#339933" },
  { name: "Python", position: [2, -2, 0], color: "#3776ab" },
  { name: "Three.js", position: [0, 0, -2], color: "#000000" },
]

function SkillSphere({ skill, index }: { skill: (typeof skills)[0]; index: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const textRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime
      meshRef.current.rotation.x = time * 0.5 + index
      meshRef.current.rotation.y = time * 0.3 + index

      // Gentle floating motion
      meshRef.current.position.y = skill.position[1] + Math.sin(time + index) * 0.3
    }
  })

  return (
    <Float speed={1 + index * 0.2} rotationIntensity={0.5} floatIntensity={0.3}>
      <group>
        <mesh ref={meshRef} position={skill.position}>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial
            color={skill.color}
            metalness={0.6}
            roughness={0.3}
            emissive={skill.color}
            emissiveIntensity={0.1}
          />
        </mesh>
        <Text
          ref={textRef}
          position={[skill.position[0], skill.position[1] - 0.8, skill.position[2]]}
          fontSize={0.2}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {skill.name}
        </Text>
      </group>
    </Float>
  )
}

function SkillsScene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#3b82f6" />

      {skills.map((skill, index) => (
        <SkillSphere key={skill.name} skill={skill} index={index} />
      ))}

      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </>
  )
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-pulse">
        <div className="w-16 h-16 bg-blue-500/20 rounded-full"></div>
      </div>
    </div>
  )
}

export default function Skills3DVisualization() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <LoadingFallback />
  }

  return (
    <div className="w-full h-[500px] relative">
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          camera={{ position: [0, 0, 6], fov: 75 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
        >
          <SkillsScene />
        </Canvas>
      </Suspense>
    </div>
  )
}
