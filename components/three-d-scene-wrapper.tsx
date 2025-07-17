"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, TorusKnot, Environment, Stars } from "@react-three/drei"
import type { Mesh, PointLight } from "three"
import { Vector3 } from "three"
import { useTheme } from "next-themes"

function ThreeDScene({ theme }: { theme?: string }) {
  const meshRef = useRef<Mesh>(null!)
  const lightRef = useRef<PointLight>(null!)

  useFrame((state, delta) => {
    // Make the dynamic light follow the mouse cursor
    if (lightRef.current) {
      // Map pointer coordinates (-1 to 1) to the viewport size for positioning
      const targetX = (state.pointer.x * state.viewport.width) / 2
      const targetY = (state.pointer.y * state.viewport.height) / 2

      // Create a target vector for the light's position
      const targetPosition = new Vector3(targetX, targetY, 3)

      // Smoothly interpolate the light's position to the target for a fluid motion
      lightRef.current.position.lerp(targetPosition, 0.05)
    }
  })

  return (
    <>
      <ambientLight intensity={theme === "dark" ? 0.2 : 0.8} />
      {/* Static main light for overall scene illumination */}
      <pointLight position={[10, 10, 10]} intensity={1.5} />

      {/* This is the new dynamic light that follows the mouse */}
      <pointLight ref={lightRef} color="#c084fc" intensity={8} distance={10} />

      <TorusKnot ref={meshRef} args={[1, 0.3, 200, 32]}>
        <meshStandardMaterial color="#9333ea" roughness={0.1} metalness={0.8} />
      </TorusKnot>
      {theme === "dark" && <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />}
      <Environment preset={theme === "dark" ? "city" : "studio"} />
    </>
  )
}

export default function ThreeDSceneWrapper() {
  const { theme } = useTheme()
  return (
    <Canvas className="w-full h-full absolute inset-0">
      <ThreeDScene theme={theme} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  )
}
