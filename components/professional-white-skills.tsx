"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Float, Text, Center, Environment, OrbitControls } from "@react-three/drei"
import { Suspense, useState, useRef } from "react"
import * as THREE from "three"

const skills = [
  { name: "React", position: [-3, 2, 0], color: "#61dafb", hoverColor: "#21d4fd" },
  { name: "Next.js", position: [3, 2, 0], color: "#000000", hoverColor: "#333333" },
  { name: "TypeScript", position: [-3, -2, 0], color: "#3178c6", hoverColor: "#2563eb" },
  { name: "Three.js", position: [3, -2, 0], color: "#049ef4", hoverColor: "#0284c7" },
  { name: "Node.js", position: [0, 0, 2], color: "#68a063", hoverColor: "#16a34a" },
  { name: "Python", position: [0, 3, -1], color: "#ffde57", hoverColor: "#fbbf24" },
  { name: "MongoDB", position: [0, -3, -1], color: "#4db33d", hoverColor: "#22c55e" },
]

function DraggableSkillSphere({ skill, index }: { skill: any; index: number }) {
  const [hovered, setHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState<THREE.Vector3>(new THREE.Vector3())
  const groupRef = useRef<THREE.Group>(null)
  const { camera, gl } = useThree()

  useFrame(() => {
    if (groupRef.current && !isDragging && !hovered) {
      groupRef.current.rotation.y += 0.005
    }
  })

  const handlePointerDown = (event: any) => {
    event.stopPropagation()
    setIsDragging(true)
    gl.domElement.style.cursor = "grabbing"

    const mouse = new THREE.Vector2()
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(mouse, camera)

    if (groupRef.current) {
      const intersection = raycaster.intersectObject(groupRef.current, true)[0]
      if (intersection) {
        setDragOffset(intersection.point.sub(groupRef.current.position))
      }
    }
  }

  const handlePointerMove = (event: any) => {
    if (!isDragging || !groupRef.current) return

    const mouse = new THREE.Vector2()
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(mouse, camera)

    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -groupRef.current.position.z)
    const intersection = new THREE.Vector3()
    raycaster.ray.intersectPlane(plane, intersection)

    if (intersection) {
      groupRef.current.position.copy(intersection.sub(dragOffset))
    }
  }

  const handlePointerUp = () => {
    setIsDragging(false)
    gl.domElement.style.cursor = "grab"
  }

  return (
    <Float speed={1 + index * 0.2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group
        ref={groupRef}
        position={skill.position}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerEnter={() => {
          setHovered(true)
          gl.domElement.style.cursor = "grab"
        }}
        onPointerLeave={() => {
          setHovered(false)
          gl.domElement.style.cursor = "default"
        }}
      >
        <mesh scale={hovered ? 1.3 : 1}>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshStandardMaterial
            color={hovered ? skill.hoverColor : skill.color}
            metalness={hovered ? 0.8 : 0.4}
            roughness={hovered ? 0.1 : 0.3}
            transparent
            opacity={0.9}
            emissive={hovered ? skill.color : "#000000"}
            emissiveIntensity={hovered ? 0.2 : 0}
          />
        </mesh>
        <Center position={[0, 0, 0.9]}>
          <Text
            fontSize={0.25}
            color={hovered ? "#ffffff" : "#1f2937"}
            anchorX="center"
            anchorY="middle"
            font="/fonts/Inter-Bold.ttf"
          >
            {skill.name}
          </Text>
        </Center>

        {hovered && (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.2, 0.05, 8, 32]} />
            <meshStandardMaterial
              color={skill.hoverColor}
              emissive={skill.hoverColor}
              emissiveIntensity={0.5}
              transparent
              opacity={0.7}
            />
          </mesh>
        )}
      </group>
    </Float>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} color="#ffffff" />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#ff6b6b" />
      <pointLight position={[10, -10, 10]} intensity={0.8} color="#4ecdc4" />
      <spotLight position={[0, 10, 0]} intensity={1} color="#ffd93d" angle={0.3} />

      {skills.map((skill, index) => (
        <DraggableSkillSphere key={skill.name} skill={skill} index={index} />
      ))}

      <Environment preset="city" />
    </>
  )
}

export default function ProfessionalWhiteSkills() {
  return (
    <div className="w-full h-96">
      <Canvas camera={{ position: [0, 0, 12], fov: 50 }} gl={{ antialias: true, alpha: true }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <Scene />
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            zoomSpeed={0.5}
            panSpeed={0.5}
            rotateSpeed={0.5}
            minDistance={8}
            maxDistance={20}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
