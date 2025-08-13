"use client"

import { Suspense, useRef, useState, useEffect, useMemo, useCallback } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Sphere, Box, Text, Float, Environment, ContactShadows } from "@react-three/drei"
import * as THREE from "three"

// Performance monitoring hook
function usePerformanceMonitor() {
  const [fps, setFps] = useState(60)
  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())

  useFrame(() => {
    frameCount.current++
    const currentTime = performance.now()

    if (currentTime - lastTime.current >= 1000) {
      setFps(Math.round((frameCount.current * 1000) / (currentTime - lastTime.current)))
      frameCount.current = 0
      lastTime.current = currentTime
    }
  })

  return fps
}

// Professional animated sphere with advanced materials
function ProfessionalSphere({
  position,
  color,
  emissiveIntensity = 0.1,
  metalness = 0.9,
  roughness = 0.1,
}: {
  position: [number, number, number]
  color: string
  emissiveIntensity?: number
  metalness?: number
  roughness?: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  // Optimized animation with reduced calculations
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime
      meshRef.current.rotation.x = time * 0.3
      meshRef.current.rotation.y = time * 0.2
      meshRef.current.position.y = position[1] + Math.sin(time * 0.8) * 0.15

      // Hover effect
      const scale = hovered ? 1.1 : 1
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1)
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.2}>
      <Sphere
        ref={meshRef}
        position={position}
        args={[0.6, 64, 64]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshPhysicalMaterial
          color={color}
          metalness={metalness}
          roughness={roughness}
          emissive={color}
          emissiveIntensity={hovered ? emissiveIntensity * 2 : emissiveIntensity}
          clearcoat={1}
          clearcoatRoughness={0.1}
          transmission={0.1}
          thickness={0.5}
        />
      </Sphere>
    </Float>
  )
}

// Professional wireframe box with glow effect
function ProfessionalBox({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime
      meshRef.current.rotation.x = time * 0.2
      meshRef.current.rotation.z = time * 0.15

      // Pulsing effect
      const scale = 1 + Math.sin(time * 2) * 0.05
      meshRef.current.scale.set(scale, scale, scale)
    }
  })

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.15}>
      <Box
        ref={meshRef}
        position={position}
        args={[1, 1, 1]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshBasicMaterial
          color={hovered ? "#60a5fa" : "#3b82f6"}
          wireframe
          transparent
          opacity={hovered ? 0.8 : 0.6}
        />
      </Box>
    </Float>
  )
}

// Professional 3D text with better typography
function ProfessionalText() {
  const textRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (textRef.current) {
      const time = state.clock.elapsedTime
      textRef.current.position.y = Math.sin(time * 0.5) * 0.1
    }
  })

  return (
    <Text
      ref={textRef}
      position={[0, 0, -2]}
      fontSize={0.8}
      color="#ffffff"
      anchorX="center"
      anchorY="middle"
      font="/fonts/Inter-Bold.woff"
      letterSpacing={0.02}
      lineHeight={1}
    >
      PORTFOLIO
      <meshStandardMaterial emissive="#ffffff" emissiveIntensity={0.2} metalness={0.5} roughness={0.3} />
    </Text>
  )
}

// Main 3D scene with professional lighting
function ProfessionalScene() {
  const { camera, gl } = useThree()
  const fps = usePerformanceMonitor()

  // Optimize renderer settings based on performance
  useEffect(() => {
    if (fps < 30) {
      gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    } else {
      gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }
  }, [fps, gl])

  useEffect(() => {
    camera.position.set(0, 0, 6)
  }, [camera])

  // Memoized sphere positions for performance
  const sphereConfigs = useMemo(
    () => [
      { position: [-2.5, 1, 0] as [number, number, number], color: "#ef4444", metalness: 0.9, roughness: 0.1 },
      { position: [2.5, -0.5, -1] as [number, number, number], color: "#10b981", metalness: 0.8, roughness: 0.2 },
      { position: [0, -1.5, 1] as [number, number, number], color: "#f59e0b", metalness: 0.7, roughness: 0.3 },
    ],
    [],
  )

  const boxPositions = useMemo(
    () => [[1.5, -2, 0] as [number, number, number], [-1.5, 2.5, -2] as [number, number, number]],
    [],
  )

  return (
    <>
      {/* Professional lighting setup */}
      <Environment preset="studio" />
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#3b82f6" />
      <spotLight position={[0, 10, 0]} intensity={0.3} angle={0.3} penumbra={1} />

      {/* 3D Objects */}
      {sphereConfigs.map((config, index) => (
        <ProfessionalSphere key={index} {...config} />
      ))}

      {boxPositions.map((position, index) => (
        <ProfessionalBox key={index} position={position} />
      ))}

      <ProfessionalText />

      {/* Ground shadows for realism */}
      <ContactShadows position={[0, -3, 0]} opacity={0.4} scale={10} blur={2} far={4} />

      {/* Enhanced controls */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        dampingFactor={0.05}
        enableDamping
      />
    </>
  )
}

// Professional loading component
function ProfessionalLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-500 rounded-full animate-spin animate-reverse"></div>
      </div>
      <p className="mt-4 text-sm text-slate-400 animate-pulse">Loading 3D Experience...</p>
    </div>
  )
}

// Error boundary component
function ErrorFallback() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-slate-900 text-white">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">3D Scene Unavailable</h3>
        <p className="text-sm text-slate-400 mb-4">Your device may not support WebGL</p>
        <div className="w-full h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
          <span className="text-2xl font-bold">PORTFOLIO</span>
        </div>
      </div>
    </div>
  )
}

export default function Professional3DHero() {
  const [isClient, setIsClient] = useState(false)
  const [hasWebGL, setHasWebGL] = useState(true)

  // WebGL detection
  const detectWebGL = useCallback(() => {
    try {
      const canvas = document.createElement("canvas")
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
      return !!gl
    } catch {
      return false
    }
  }, [])

  useEffect(() => {
    setIsClient(true)
    setHasWebGL(detectWebGL())
  }, [detectWebGL])

  if (!isClient) {
    return <ProfessionalLoader />
  }

  if (!hasWebGL) {
    return <ErrorFallback />
  }

  return (
    <div className="w-full h-[500px] relative overflow-hidden rounded-lg bg-gradient-to-br from-slate-900 to-slate-800">
      <Suspense fallback={<ProfessionalLoader />}>
        <Canvas
          camera={{ position: [0, 0, 6], fov: 75 }}
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
            gl.toneMappingExposure = 1.2
          }}
        >
          <ProfessionalScene />
        </Canvas>
      </Suspense>

      {/* Performance indicator */}
      <div className="absolute top-4 right-4 text-xs text-slate-400 bg-black/20 px-2 py-1 rounded">WebGL Active</div>
    </div>
  )
}
