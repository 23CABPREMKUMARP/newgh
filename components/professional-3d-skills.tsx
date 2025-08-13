"use client"

import { Suspense, useRef, useState, useEffect, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Text, Float, OrbitControls, Environment, ContactShadows, Html } from "@react-three/drei"
import * as THREE from "three"

// Professional skill data with enhanced properties
const professionalSkills = [
  {
    name: "React",
    position: [-3, 2, 0],
    color: "#61dafb",
    level: 95,
    category: "Frontend",
  },
  {
    name: "Next.js",
    position: [3, 2, 0],
    color: "#000000",
    level: 90,
    category: "Framework",
  },
  {
    name: "TypeScript",
    position: [0, 0, 3],
    color: "#3178c6",
    level: 88,
    category: "Language",
  },
  {
    name: "Node.js",
    position: [-3, -2, 0],
    color: "#339933",
    level: 85,
    category: "Backend",
  },
  {
    name: "Python",
    position: [3, -2, 0],
    color: "#3776ab",
    level: 82,
    category: "Language",
  },
  {
    name: "Three.js",
    position: [0, 0, -3],
    color: "#049ef4",
    level: 78,
    category: "3D Graphics",
  },
]

// Professional skill sphere with advanced interactions
function ProfessionalSkillSphere({
  skill,
  index,
}: {
  skill: (typeof professionalSkills)[0]
  index: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const textRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  // Smooth animations with performance optimization
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime
      const offset = index * 0.5

      // Rotation based on skill level
      meshRef.current.rotation.x = time * 0.3 + offset
      meshRef.current.rotation.y = time * 0.2 + offset

      // Floating motion with individual timing
      meshRef.current.position.y = skill.position[1] + Math.sin(time * 0.8 + offset) * 0.2

      // Scale based on interaction
      const targetScale = hovered ? 1.2 : clicked ? 0.9 : 1
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }
  })

  // Calculate sphere size based on skill level
  const sphereSize = useMemo(() => 0.3 + (skill.level / 100) * 0.3, [skill.level])

  return (
    <Float speed={1 + index * 0.1} rotationIntensity={0.3} floatIntensity={0.2}>
      <group>
        {/* Main skill sphere */}
        <mesh
          ref={meshRef}
          position={skill.position}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onPointerDown={() => setClicked(true)}
          onPointerUp={() => setClicked(false)}
        >
          <sphereGeometry args={[sphereSize, 64, 64]} />
          <meshPhysicalMaterial
            color={skill.color}
            metalness={0.8}
            roughness={0.2}
            emissive={skill.color}
            emissiveIntensity={hovered ? 0.3 : 0.1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            transmission={0.05}
            thickness={0.2}
          />
        </mesh>

        {/* Skill name text */}
        <Text
          ref={textRef}
          position={[skill.position[0], skill.position[1] - 1, skill.position[2]]}
          fontSize={0.25}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Bold.woff"
        >
          {skill.name}
          <meshStandardMaterial emissive="#ffffff" emissiveIntensity={0.1} />
        </Text>

        {/* Skill level indicator */}
        <Text
          position={[skill.position[0], skill.position[1] - 1.3, skill.position[2]]}
          fontSize={0.15}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Regular.woff"
        >
          {skill.level}%
        </Text>

        {/* Category badge */}
        <Text
          position={[skill.position[0], skill.position[1] + 0.8, skill.position[2]]}
          fontSize={0.12}
          color="#64748b"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Regular.woff"
        >
          {skill.category}
        </Text>

        {/* Hover tooltip */}
        {hovered && (
          <Html position={[skill.position[0], skill.position[1] + 1.2, skill.position[2]]}>
            <div className="bg-black/80 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap">
              <div className="font-semibold">{skill.name}</div>
              <div className="text-xs text-gray-300">
                {skill.category} • {skill.level}% Proficiency
              </div>
            </div>
          </Html>
        )}
      </group>
    </Float>
  )
}

// Connection lines between related skills
function SkillConnections() {
  const linesRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  const connections = useMemo(
    () => [
      [0, 1], // React to Next.js
      [0, 2], // React to TypeScript
      [1, 2], // Next.js to TypeScript
      [3, 4], // Node.js to Python
      [2, 5], // TypeScript to Three.js
    ],
    [],
  )

  return (
    <group ref={linesRef}>
      {connections.map(([startIdx, endIdx], index) => {
        const start = professionalSkills[startIdx].position
        const end = professionalSkills[endIdx].position

        return (
          <line key={index}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([...start, ...end])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#3b82f6" transparent opacity={0.3} />
          </line>
        )
      })}
    </group>
  )
}

// Main professional skills scene
function ProfessionalSkillsScene() {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(0, 0, 8)
  }, [camera])

  return (
    <>
      {/* Professional lighting setup */}
      <Environment preset="city" />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
      <pointLight position={[-10, -10, -5]} intensity={0.4} color="#3b82f6" />

      {/* Skill spheres */}
      {professionalSkills.map((skill, index) => (
        <ProfessionalSkillSphere key={skill.name} skill={skill} index={index} />
      ))}

      {/* Skill connections */}
      <SkillConnections />

      {/* Ground plane with shadows */}
      <ContactShadows position={[0, -4, 0]} opacity={0.3} scale={15} blur={2.5} far={6} />

      {/* Enhanced orbit controls */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.3}
        dampingFactor={0.05}
        enableDamping
        minDistance={5}
        maxDistance={12}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI - Math.PI / 6}
      />
    </>
  )
}

// Professional loading component
function ProfessionalSkillsLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="relative mb-4">
        <div className="w-12 h-12 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-12 h-12 border-3 border-transparent border-r-purple-500 rounded-full animate-spin animate-reverse"></div>
      </div>
      <p className="text-sm text-slate-400 animate-pulse">Loading Skills Visualization...</p>
      <div className="mt-2 flex space-x-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  )
}

export default function Professional3DSkills() {
  const [isClient, setIsClient] = useState(false)
  const [hasWebGL, setHasWebGL] = useState(true)

  useEffect(() => {
    setIsClient(true)

    // WebGL detection
    try {
      const canvas = document.createElement("canvas")
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
      setHasWebGL(!!gl)
    } catch {
      setHasWebGL(false)
    }
  }, [])

  if (!isClient) {
    return <ProfessionalSkillsLoader />
  }

  if (!hasWebGL) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-900 text-white">
        <h3 className="text-lg font-semibold mb-4">Skills Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-md">
          {professionalSkills.map((skill) => (
            <div key={skill.name} className="bg-slate-800 p-4 rounded-lg text-center">
              <div className="text-sm font-medium">{skill.name}</div>
              <div className="text-xs text-slate-400 mt-1">{skill.level}%</div>
              <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-[600px] relative overflow-hidden rounded-lg bg-gradient-to-br from-slate-900 to-slate-800">
      <Suspense fallback={<ProfessionalSkillsLoader />}>
        <Canvas
          camera={{ position: [0, 0, 8], fov: 75 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            stencil: false,
            depth: true,
          }}
          dpr={[1, 2]}
          performance={{ min: 0.5 }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping
            gl.toneMappingExposure = 1.1
          }}
        >
          <ProfessionalSkillsScene />
        </Canvas>
      </Suspense>

      {/* Controls hint */}
      <div className="absolute bottom-4 left-4 text-xs text-slate-400 bg-black/20 px-3 py-2 rounded">
        <div>Drag to rotate • Scroll to zoom</div>
        <div>Hover skills for details</div>
      </div>
    </div>
  )
}
