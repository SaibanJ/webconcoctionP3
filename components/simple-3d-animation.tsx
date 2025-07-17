"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Sphere, Environment } from "@react-three/drei"
import type { Mesh } from "three"

function RotatingSphere({ theme }: { theme?: string }) {
    const meshRef = useRef<Mesh>(null!)

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.005
        }
    })

    return (
        <>
            <ambientLight intensity={theme === "dark" ? 0.5 : 1} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <Sphere ref={meshRef} args={[1, 32, 32]}>
                <meshStandardMaterial color={theme === "dark" ? "#9333ea" : "#6d28d9"} metalness={0.8} roughness={0.2} />
            </Sphere>
            <Environment preset={theme === "dark" ? "city" : "studio"} />
        </>
    )
}

export function Simple3DAnimation({ theme }: { theme?: string }) {
    return (
        <Canvas>
            <RotatingSphere theme={theme} />
        </Canvas>
    )
}
