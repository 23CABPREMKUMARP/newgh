"use client"

import { Suspense, useRef, useState, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Text, Float, OrbitControls, Environment, Html } from "@react-three/drei"
import * as THREE from "three"

const techSkills = [
  { name: "HTML", position: [0, 0, 2], color: "#e34f26", icon: "🌐", details: "Semantic markup and accessibility" },
  { name: "CSS", position: [1.5, 1.5, 0], color: "#1572b6", icon: "🎨", details: "Modern styling and animations" },
  { name: "JavaScript", position: [-1.5, 1.5, 0], color: "#f7df1e", icon: "⚡", details: "Dynamic web interactions" },
  { name: "Python", position: [2, 0, 0], color: "#3776ab", icon: "🐍", details: "Backend development and AI" },
  { name: "Java", position: [-2, 0, 0], color: "#ed8b00", icon: "☕", details: "Enterprise applications" },
  { name: "MySQL", position: [0, 2, 0], color: "#4479a1", icon: "🗄️", details: "Database management" },
  { name: "React", position: [0, -2, 0], color: "#61dafb", icon: "⚛️", details: "Component-based UI" },
  { name: "Node.js", position: [1.5, -1.5, 0], color: "#339933", icon: "🟢", details: "Server-side JavaScript" },
  { name: "MongoDB", position: [-1.5, -1.5, 0], color: "#47a248", icon: "🍃", details: "NoSQL database" },
]

function HolographicGlobe() {
  const globeRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y = state.clock.elapsedTime * 0.2
      globeRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
    }
  })

  return (
    <mesh ref={globeRef}>
      <sphereGeometry args={[1.8, 64, 64]} />
      <meshPhysicalMaterial
        color="#1e293b"
        transparent
        opacity={0.1}
        transmission={0.9}
        thickness={0.1}
        roughness={0}
        metalness={0.1}
        clearcoat={1}
        clearcoatRoughness={0}
        envMapIntensity={1}
      />
      {/* Holographic grid lines */}
      <mesh>
        <sphereGeometry args={[1.81, 32, 16]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.2} wireframe />
      </mesh>
    </mesh>
  )
}

function FloatingSkillIcon({ skill, index }: { skill: (typeof techSkills)[0]; index: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  const { camera } = useThree()

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime
      const radius = 2.5
      const angle = (index / techSkills.length) * Math.PI * 2 + time * 0.1

      // Orbit around the globe
      groupRef.current.position.x = Math.cos(angle) * radius
      groupRef.current.position.z = Math.sin(angle) * radius
      groupRef.current.position.y = skill.position[1] + Math.sin(time + index) * 0.3

      // Look at camera
      groupRef.current.lookAt(camera.position)

      // Scale based on interaction
      const targetScale = hovered ? 1.5 : clicked ? 0.8 : 1
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }
  })

  return (
    <Float speed={1 + index * 0.1} rotationIntensity={0.2} floatIntensity={0.3}>
      <group
        ref={groupRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onPointerDown={() => setClicked(true)}
        onPointerUp={() => setClicked(false)}
      >
        {/* Skill sphere */}
        <mesh>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshPhysicalMaterial
            color={skill.color}
            metalness={0.8}
            roughness={0.2}
            emissive={skill.color}
            emissiveIntensity={hovered ? 0.4 : 0.1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            transmission={0.1}
          />
        </mesh>

        {/* Holographic ring */}
        {hovered && (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.5, 0.02, 8, 32]} />
            <meshBasicMaterial color={skill.color} transparent opacity={0.8} />
          </mesh>
        )}

        {/* Skill name */}
        <Text
          position={[0, -0.6, 0]}
          fontSize={0.15}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Bold.ttf"
        >
          {skill.name}
        </Text>

        {/* Hover details */}
        {hovered && (
          <Html position={[0, 0.8, 0]} center>
            <div className="bg-black/90 text-white px-4 py-3 rounded-lg text-sm whitespace-nowrap border border-blue-500/30 backdrop-blur-sm">
              <div className="font-bold text-lg mb-1">
                {skill.icon} {skill.name}
              </div>
              <div className="text-blue-300 text-xs">{skill.details}</div>
              <div className="mt-2 text-xs text-gray-400">Click to zoom in</div>
            </div>
          </Html>
        )}
      </group>
    </Float>
  )
}

function HolographicScene() {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(0, 0, 8)
  }, [camera])

  return (
    <>
      {/* Holographic lighting */}
      <Environment preset="city" />
      <ambientLight intensity={0.3} color="#1e293b" />
      <pointLight position={[0, 0, 0]} intensity={1} color="#3b82f6" />
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#8b5cf6" />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#06b6d4" />

      {/* Central holographic globe */}
      <HolographicGlobe />

      {/* Floating skill icons */}
      {techSkills.map((skill, index) => (
        <FloatingSkillIcon key={skill.name} skill={skill} index={index} />
      ))}

      {/* Enhanced orbit controls */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        dampingFactor={0.05}
        enableDamping
        minDistance={4}
        maxDistance={12}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI - Math.PI / 6}
      />
    </>
  )
}

function HolographicLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="relative mb-4">
        <div className="w-16 h-16 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
        <div className="absolute inset-2 w-12 h-12 border-2 border-purple-500/30 border-r-purple-500 rounded-full animate-spin animate-reverse"></div>
      </div>
      <p className="text-sm text-blue-400 animate-pulse">Initializing Holographic Globe...</p>
    </div>
  )
}

export default function HolographicSkillGlobe() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <HolographicLoader />
  }

  return (
    <div className="w-full h-[600px] relative overflow-hidden rounded-lg bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Suspense fallback={<HolographicLoader />}>
        <Canvas
          camera={{ position: [0, 0, 8], fov: 75 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
        >
          <HolographicScene />
        </Canvas>
      </Suspense>

      {/* Controls hint */}
      <div className="absolute bottom-4 left-4 text-xs text-blue-400 bg-black/30 px-3 py-2 rounded backdrop-blur-sm border border-blue-500/20">
        <div>🌐 Drag to rotate • Scroll to zoom</div>
        <div>✨ Hover skills for details</div>
      </div>

      {/* Title overlay */}
      <div className="absolute top-4 left-4 text-white">
        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Tech Skills Globe
        </h3>
        <p className="text-sm text-gray-400">Interactive 3D visualization</p>
      </div>
    </div>
  )
}
