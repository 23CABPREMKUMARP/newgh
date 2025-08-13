"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Float, Environment } from "@react-three/drei"
import { Suspense, useRef, useState } from "react"
import * as THREE from "three"

function DraggableGeometry({ children, position, ...props }: any) {
  const meshRef = useRef<THREE.Group>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState<THREE.Vector3>(new THREE.Vector3())
  const { camera, gl } = useThree()

  useFrame(() => {
    if (meshRef.current && !isDragging) {
      meshRef.current.rotation.x += 0.01
      meshRef.current.rotation.y += 0.01
    }
  })

  const handlePointerDown = (event: any) => {
    event.stopPropagation()
    setIsDragging(true)
    gl.domElement.style.cursor = "grabbing"

    // Calculate offset between mouse and object position
    const mouse = new THREE.Vector2()
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(mouse, camera)

    if (meshRef.current) {
      const intersection = raycaster.intersectObject(meshRef.current, true)[0]
      if (intersection) {
        setDragOffset(intersection.point.sub(meshRef.current.position))
      }
    }
  }

  const handlePointerMove = (event: any) => {
    if (!isDragging || !meshRef.current) return

    const mouse = new THREE.Vector2()
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(mouse, camera)

    // Project to a plane at the object's z position
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -meshRef.current.position.z)
    const intersection = new THREE.Vector3()
    raycaster.ray.intersectPlane(plane, intersection)

    if (intersection) {
      meshRef.current.position.copy(intersection.sub(dragOffset))
    }
  }

  const handlePointerUp = () => {
    setIsDragging(false)
    gl.domElement.style.cursor = "grab"
  }

  return (
    <group
      ref={meshRef}
      position={position}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerEnter={() => (gl.domElement.style.cursor = "grab")}
      onPointerLeave={() => (gl.domElement.style.cursor = "default")}
      {...props}
    >
      {children}
    </group>
  )
}

function FloatingGeometry() {
  return (
    <group>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <DraggableGeometry position={[-2, 0, 0]}>
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
              color="#8b5cf6"
              metalness={0.8}
              roughness={0.1}
              emissive="#4c1d95"
              emissiveIntensity={0.2}
            />
          </mesh>
        </DraggableGeometry>
      </Float>

      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.7}>
        <DraggableGeometry position={[2, 1, -1]}>
          <mesh>
            <sphereGeometry args={[0.7, 32, 32]} />
            <meshStandardMaterial
              color="#f97316"
              metalness={0.6}
              roughness={0.2}
              emissive="#ea580c"
              emissiveIntensity={0.3}
            />
          </mesh>
        </DraggableGeometry>
      </Float>

      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.6}>
        <DraggableGeometry position={[0, -1, 1]}>
          <mesh>
            <cylinderGeometry args={[0.5, 0.5, 1.5, 8]} />
            <meshStandardMaterial
              color="#06b6d4"
              metalness={0.9}
              roughness={0.1}
              emissive="#0891b2"
              emissiveIntensity={0.2}
            />
          </mesh>
        </DraggableGeometry>
      </Float>

      <Float speed={2.0} rotationIntensity={0.6} floatIntensity={0.8}>
        <DraggableGeometry position={[1, 2, -2]}>
          <mesh>
            <octahedronGeometry args={[0.6]} />
            <meshStandardMaterial
              color="#ec4899"
              metalness={0.7}
              roughness={0.2}
              emissive="#be185d"
              emissiveIntensity={0.25}
            />
          </mesh>
        </DraggableGeometry>
      </Float>

      <Float speed={1.3} rotationIntensity={0.7} floatIntensity={0.4}>
        <DraggableGeometry position={[-1.5, -2, -1]}>
          <mesh>
            <torusGeometry args={[0.5, 0.2, 16, 100]} />
            <meshStandardMaterial
              color="#10b981"
              metalness={0.8}
              roughness={0.1}
              emissive="#047857"
              emissiveIntensity={0.3}
            />
          </mesh>
        </DraggableGeometry>
      </Float>
    </group>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} color="#ffffff" />
      <directionalLight position={[10, 10, 5]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#fbbf24" />
      <pointLight position={[10, -10, 10]} intensity={0.6} color="#a855f7" />

      <FloatingGeometry />

      <Environment preset="sunset" />
    </>
  )
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  )
}

export default function ProfessionalWhiteHero() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }} gl={{ antialias: true, alpha: true }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <Scene />
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            autoRotate={false}
            zoomSpeed={0.5}
            panSpeed={0.5}
            rotateSpeed={0.5}
            minDistance={5}
            maxDistance={15}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
