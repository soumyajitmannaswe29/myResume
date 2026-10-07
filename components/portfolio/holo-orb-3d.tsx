'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

interface HoloOrb3DProps {
  pulseKey?: string | number
  className?: string
}

export function HoloOrb3D({ pulseKey, className = '' }: HoloOrb3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [supported, setSupported] = useState(true)
  const pulseRef = useRef(1)

  // Trigger pulse effect whenever pulseKey changes
  useEffect(() => {
    pulseRef.current = 2.4
  }, [pulseKey])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    try {
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (!gl) {
        setSupported(false)
        return
      }
    } catch {
      setSupported(false)
      return
    }

    let animId = 0
    let width = container.clientWidth || 320
    let height = container.clientHeight || 400

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100)
    camera.position.set(0, 0, 7.8)

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const light1 = new THREE.PointLight(0x00f5a0, 3, 20)
    light1.position.set(4, 4, 6)
    scene.add(light1)

    const light2 = new THREE.PointLight(0x06b6d4, 2.5, 20)
    light2.position.set(-4, -4, 4)
    scene.add(light2)

    // Master Group
    const orbGroup = new THREE.Group()
    scene.add(orbGroup)

    // 1. Outer Geodesic Sphere (Wireframe)
    const geoOuter = new THREE.IcosahedronGeometry(2.8, 2)
    const matOuter = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      emissive: 0x00f5a0,
      emissiveIntensity: 0.25,
    })
    const meshOuter = new THREE.Mesh(geoOuter, matOuter)
    orbGroup.add(meshOuter)

    // 2. Vertex Points on Outer Geodesic
    const geoPoints = new THREE.BufferGeometry()
    geoPoints.setAttribute('position', geoOuter.attributes.position)
    const matPoints = new THREE.PointsMaterial({
      size: 0.12,
      color: 0x00f5a0,
      transparent: true,
      opacity: 0.9,
    })
    const meshPoints = new THREE.Points(geoPoints, matPoints)
    meshOuter.add(meshPoints)

    // 3. Inner Quantum Core (Octahedron with glow)
    const geoInner = new THREE.OctahedronGeometry(1.4, 1)
    const matInner = new THREE.MeshStandardMaterial({
      color: 0x00f5a0,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
      emissive: 0x00f5a0,
      emissiveIntensity: 0.6,
    })
    const meshInner = new THREE.Mesh(geoInner, matInner)
    orbGroup.add(meshInner)

    // 4. Gimbal Equatorial Tech Rings
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00f5a0,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    })

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(3.5, 0.03, 16, 80), ringMat)
    ring1.rotation.x = Math.PI / 3
    orbGroup.add(ring1)

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(3.8, 0.03, 16, 80),
      new THREE.MeshBasicMaterial({
        color: 0x06b6d4,
        transparent: true,
        opacity: 0.35,
      }),
    )
    ring2.rotation.y = Math.PI / 2.6
    orbGroup.add(ring2)

    // 5. Orbital Synaptic Particle Cloud
    const particleCount = 120
    const partGeo = new THREE.BufferGeometry()
    const partPos = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      const radius = 1.6 + Math.random() * 2.2
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      partPos[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      partPos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      partPos[i * 3 + 2] = radius * Math.cos(phi)
    }
    partGeo.setAttribute('position', new THREE.BufferAttribute(partPos, 3))
    const partMat = new THREE.PointsMaterial({
      size: 0.09,
      color: 0x00f5a0,
      transparent: true,
      opacity: 0.8,
    })
    const meshParticles = new THREE.Points(partGeo, partMat)
    orbGroup.add(meshParticles)

    // Mouse Tracking for subtle interactive tilt
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 }
    function onPointerMove(e: PointerEvent) {
      const rect = container?.getBoundingClientRect()
      if (!rect) return
      mouse.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.targetY = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
    }

    container.addEventListener('pointermove', onPointerMove)

    // Resize observer
    const ro = new ResizeObserver(() => {
      if (!container) return
      width = container.clientWidth || 320
      height = container.clientHeight || 400
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    })
    ro.observe(container)

    let clock = new THREE.Clock()

    function animate() {
      animId = requestAnimationFrame(animate)
      const time = clock.getElapsedTime()

      // Damped mouse follow
      mouse.x += (mouse.targetX - mouse.x) * 0.08
      mouse.y += (mouse.targetY - mouse.y) * 0.08

      // Decay pulse
      if (pulseRef.current > 1) {
        pulseRef.current += (1 - pulseRef.current) * 0.05
      }

      // Rotations
      meshOuter.rotation.x = time * 0.2 + mouse.y * 0.8
      meshOuter.rotation.y = time * 0.35 + mouse.x * 0.8

      meshInner.rotation.x = -time * 0.4
      meshInner.rotation.z = time * 0.3

      ring1.rotation.z = time * 0.25
      ring2.rotation.x = -time * 0.18

      meshParticles.rotation.y = time * 0.15

      // Pulse breathing & emissive glow
      const pulse = pulseRef.current
      matOuter.emissiveIntensity = 0.25 * pulse
      matInner.emissiveIntensity = 0.6 * pulse

      const scale = (1 + Math.sin(time * 2) * 0.03) * Math.min(1.15, pulse)
      meshInner.scale.set(scale, scale, scale)

      // Master tilt
      orbGroup.rotation.x = mouse.y * 0.4
      orbGroup.rotation.y = mouse.x * 0.5

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animId)
      container.removeEventListener('pointermove', onPointerMove)
      ro.disconnect()

      geoOuter.dispose()
      matOuter.dispose()
      geoPoints.dispose()
      matPoints.dispose()
      geoInner.dispose()
      matInner.dispose()
      ring1.geometry.dispose()
      ringMat.dispose()
      ring2.geometry.dispose()
      partGeo.dispose()
      partMat.dispose()
      renderer.dispose()
    }
  }, [])

  if (!supported) {
    return null
  }

  return (
    <div ref={containerRef} className={`relative size-full overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 size-full block" />
    </div>
  )
}
