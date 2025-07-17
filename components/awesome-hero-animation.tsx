"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, TorusKnot, Sphere, Environment, Stars } from "@react-three/drei"
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing"
import type { Mesh, PointLight } from "three"
import { Vector3 } from "three"

function AwesomeSceneContent({ theme }: { theme?: string }) {
    const torusKnotRef = useRef<Mesh>(null!)
    const sphereRef1 = useRef<Mesh>(null!)
    const sphereRef2 = useRef<Mesh>(null!)
    const lightRef = useRef<PointLight>(null!)

    useFrame((state, delta) => {
        // Rotate the central TorusKnot
        if (torusKnotRef.current) {
            torusKnotRef.current.rotation.x += delta * 0.05
            torusKnotRef.current.rotation.y += delta * 0.08
        }

        // Orbiting spheres
        const time = state.clock.getElapsedTime()
        if (sphereRef1.current) {
            sphereRef1.current.position.x = Math.sin(time * 0.7) * 2.5
            sphereRef1.current.position.z = Math.cos(time * 0.7) * 2.5
            sphereRef1.current.rotation.y += delta * 0.2
        }
        if (sphereRef2.current) {
            sphereRef2.current.position.x = Math.cos(time * 0.5) * 3.5
            sphereRef2.current.position.z = Math.sin(time * 0.5) * 3.5
            sphereRef2.current.rotation.x += delta * 0.15
        }

        // Light follows mouse pointer
        if (lightRef.current) {
            const targetX = (state.pointer.x * state.viewport.width) / 2
            const targetY = (state.pointer.y * state.viewport.height) / 2
            const targetPosition = new Vector3(targetX, targetY, 3)
            lightRef.current.position.lerp(targetPosition, 0.05)
        }
    })

    return (
        <>
            <ambientLight intensity={theme === "dark" ? 0.2 : 0.8} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <pointLight ref={lightRef} color="#c084fc" intensity={8} distance={10} />

            <TorusKnot ref={torusKnotRef} args={[1, 0.3, 200, 32]}>
                <meshStandardMaterial color={theme === "dark" ? "#9333ea" : "#6d28d9"} roughness={0.1} metalness={0.8} />
            </TorusKnot>

            <Sphere ref={sphereRef1} args={[0.3, 16, 16]}>
                <meshStandardMaterial color={theme === "dark" ? "#a78bfa" : "#8b5cf6"} metalness={0.9} roughness={0.1} />
            </Sphere>

            <Sphere ref={sphereRef2} args={[0.2, 16, 16]}>
                <meshStandardMaterial color={theme === "dark" ? "#fde047" : "#eab308"} metalness={0.9} roughness={0.1} />
            </Sphere>

            {theme === "dark" && <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />}
            <Environment preset={theme === "dark" ? "city" : "studio"} />
        </>
    )
}

export function AwesomeHeroAnimation({ theme }: { theme?: string }) {
    const [contextKey, setContextKey] = useState(0) // State to force re-mount on context restore

    const handleContextLost = (event: WebGLContextEvent) => {
        event.preventDefault()
        console.warn('WebGL Context Lost:', event)
        // You might want to display a message to the user here
    }

    const handleContextRestored = () => {
        console.log('WebGL Context Restored')
        setContextKey(prev => prev + 1) // Increment key to force SceneContent re-mount
    }

    return (
        <Canvas
            dpr={[1, 2]} // Set device pixel ratio to improve rendering quality and potentially stability
            onContextLost={handleContextLost}
            onContextRestored={handleContextRestored}
        >
            <AwesomeSceneContent key={contextKey} theme={theme} /> {/* Use key to force re-mount */}
            
            <EffectComposer>
                <Bloom luminanceThreshold={0.8} luminanceSmoothing={0.9} height={300} />
                <Vignette eskil={false} offset={0.1} darkness={0.8} />
            </EffectComposer>
        </Canvas>
    )
}
