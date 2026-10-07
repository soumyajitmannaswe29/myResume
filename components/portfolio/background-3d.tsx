'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import {
  Background3DMode,
  getBackground3DSettings,
  subscribeBackground3D,
} from '@/lib/theme-3d'

// Predefined colors matching the portfolio design system
const COLOR_MINT = 0x00f5a0
const COLOR_CYAN = 0x06b6d4
const COLOR_EMERALD = 0x10b981
const COLOR_DARK_GLOW = 0x0a1a24

export function Background3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [activeMode, setActiveMode] = useState<Background3DMode>('synapse')
  const [webGlAvailable, setWebGlAvailable] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Check WebGL availability
    try {
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (!gl) {
        setWebGlAvailable(false)
        return
      }
    } catch {
      setWebGlAvailable(false)
      return
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let animationFrameId: number = 0
    let isVisible = true

    // --- THREE.JS INITIALIZATION ---
    let width = window.innerWidth
    let height = window.innerHeight

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x060911, 0.02)

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 200)
    camera.position.set(0, 0, 32)

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))

    // Ambient and point lighting for 3D geometric surfaces
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const pointLightMint = new THREE.PointLight(COLOR_MINT, 2.4, 60)
    pointLightMint.position.set(12, 10, 18)
    scene.add(pointLightMint)

    const pointLightCyan = new THREE.PointLight(COLOR_CYAN, 2.2, 60)
    pointLightCyan.position.set(-14, -10, 14)
    scene.add(pointLightCyan)

    // --- MOUSE & SCROLL STATE ---
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 }
    let scrollProgress = 0

    function handleMouseMove(e: MouseEvent) {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1
    }

    function handleScroll() {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      scrollProgress = window.scrollY / maxScroll
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    // --- MODE 1: SYNAPSE NETWORK (Nodes + Connections + Central Core) ---
    const synapseGroup = new THREE.Group()
    scene.add(synapseGroup)

    const NODE_COUNT = 160
    const nodePositions = new Float32Array(NODE_COUNT * 3)
    const nodeVelocities: { vx: number; vy: number; vz: number }[] = []

    for (let i = 0; i < NODE_COUNT; i++) {
      const idx = i * 3
      nodePositions[idx] = (Math.random() - 0.5) * 54
      nodePositions[idx + 1] = (Math.random() - 0.5) * 38
      nodePositions[idx + 2] = (Math.random() - 0.5) * 32 - 4

      nodeVelocities.push({
        vx: (Math.random() - 0.5) * 0.016,
        vy: (Math.random() - 0.5) * 0.016,
        vz: (Math.random() - 0.5) * 0.014,
      })
    }

    const nodeGeometry = new THREE.BufferGeometry()
    nodeGeometry.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3))

    // Canvas particle texture generator for high-res glow
    function createGlowTexture(colorHex: string) {
      const cv = document.createElement('canvas')
      cv.width = 64
      cv.height = 64
      const c = cv.getContext('2d')
      if (c) {
        const grad = c.createRadialGradient(32, 32, 0, 32, 32, 32)
        grad.addColorStop(0, colorHex)
        grad.addColorStop(0.3, colorHex)
        grad.addColorStop(0.6, 'rgba(0, 245, 160, 0.25)')
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
        c.fillStyle = grad
        c.fillRect(0, 0, 64, 64)
      }
      return new THREE.CanvasTexture(cv)
    }

    const glowTex = createGlowTexture('rgba(255, 255, 255, 1)')

    const nodeMaterial = new THREE.PointsMaterial({
      size: 1.35,
      map: glowTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: new THREE.Color(COLOR_MINT),
    })

    const nodePoints = new THREE.Points(nodeGeometry, nodeMaterial)
    synapseGroup.add(nodePoints)

    // Dynamic Synapse Line Mesh
    const MAX_LINES = 700
    const linePositions = new Float32Array(MAX_LINES * 6)
    const lineColors = new Float32Array(MAX_LINES * 6)

    const lineGeometry = new THREE.BufferGeometry()
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3))

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      linewidth: 1,
    })

    const lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial)
    synapseGroup.add(lineMesh)

    // Central 3D Wireframe AI Core (Nested Icosahedron + Outer Gyro Ring)
    const coreGroup = new THREE.Group()
    coreGroup.position.set(0, 0, -6)
    synapseGroup.add(coreGroup)

    const icoGeo = new THREE.IcosahedronGeometry(5.2, 1)
    const icoMat = new THREE.MeshStandardMaterial({
      color: COLOR_CYAN,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
      emissive: COLOR_MINT,
      emissiveIntensity: 0.2,
    })
    const icoMesh = new THREE.Mesh(icoGeo, icoMat)
    coreGroup.add(icoMesh)

    const innerIcoGeo = new THREE.OctahedronGeometry(3.2, 0)
    const innerIcoMat = new THREE.MeshStandardMaterial({
      color: COLOR_MINT,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      emissive: COLOR_EMERALD,
      emissiveIntensity: 0.35,
    })
    const innerIcoMesh = new THREE.Mesh(innerIcoGeo, innerIcoMat)
    coreGroup.add(innerIcoMesh)

    const ringGeo = new THREE.TorusGeometry(7.8, 0.04, 16, 100)
    const ringMat = new THREE.MeshBasicMaterial({
      color: COLOR_MINT,
      transparent: true,
      opacity: 0.28,
    })
    const ringMesh1 = new THREE.Mesh(ringGeo, ringMat)
    ringMesh1.rotation.x = Math.PI / 3
    coreGroup.add(ringMesh1)

    const ringMesh2 = new THREE.Mesh(ringGeo, ringMat)
    ringMesh2.rotation.y = Math.PI / 3.5
    coreGroup.add(ringMesh2)

    // Deep cosmic background stardust (450 particles)
    const starCount = 500
    const starGeo = new THREE.BufferGeometry()
    const starPos = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 110
      starPos[i + 1] = (Math.random() - 0.5) * 90
      starPos[i + 2] = -40 - Math.random() * 50
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    const starMat = new THREE.PointsMaterial({
      size: 0.7,
      color: 0x5a7b9e,
      transparent: true,
      opacity: 0.45,
    })
    const starPoints = new THREE.Points(starGeo, starMat)
    scene.add(starPoints)

    // --- MODE 2: CYBERNETIC MATRIX & WAVE GRID ---
    const matrixGroup = new THREE.Group()
    matrixGroup.visible = false
    scene.add(matrixGroup)

    const planeW = 60
    const planeH = 60
    const segX = 40
    const segY = 40
    const planeGeo = new THREE.PlaneGeometry(planeW, planeH, segX, segY)
    const planeMat = new THREE.MeshBasicMaterial({
      color: COLOR_CYAN,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    })
    const planeMesh = new THREE.Mesh(planeGeo, planeMat)
    planeMesh.rotation.x = -Math.PI / 2.3
    planeMesh.position.set(0, -10, -5)
    matrixGroup.add(planeMesh)

    // Floating cyber cubes in matrix mode
    const cubesGroup = new THREE.Group()
    matrixGroup.add(cubesGroup)
    const cubeCount = 20
    const cubes: THREE.Mesh[] = []
    const cubeGeo = new THREE.BoxGeometry(1.6, 1.6, 1.6)
    const cubeMat = new THREE.MeshStandardMaterial({
      color: COLOR_MINT,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
      emissive: COLOR_MINT,
      emissiveIntensity: 0.25,
    })
    for (let i = 0; i < cubeCount; i++) {
      const c = new THREE.Mesh(cubeGeo, cubeMat)
      c.position.set(
        (Math.random() - 0.5) * 44,
        (Math.random() - 0.5) * 22,
        (Math.random() - 0.5) * 26,
      )
      cubesGroup.add(c)
      cubes.push(c)
    }

    // --- MODE 3: QUANTUM HYPER-FIELD (Double Vortex / Cosmic Swarm) ---
    const quantumGroup = new THREE.Group()
    quantumGroup.visible = false
    scene.add(quantumGroup)

    const quantumCount = 1800
    const quantumGeo = new THREE.BufferGeometry()
    const quantumPos = new Float32Array(quantumCount * 3)
    const quantumColors = new Float32Array(quantumCount * 3)

    const color1 = new THREE.Color(COLOR_MINT)
    const color2 = new THREE.Color(COLOR_CYAN)
    const color3 = new THREE.Color(0x38bdf8)

    for (let i = 0; i < quantumCount; i++) {
      const angle = (i / quantumCount) * Math.PI * 16
      const radius = 2 + (i / quantumCount) * 26
      const spread = (Math.random() - 0.5) * 4

      quantumPos[i * 3] = Math.cos(angle) * radius + spread
      quantumPos[i * 3 + 1] = (Math.random() - 0.5) * 16
      quantumPos[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 10 - 8

      const mixed = color1.clone().lerp(color2, Math.random()).lerp(color3, Math.sin(angle) * 0.5 + 0.5)
      quantumColors[i * 3] = mixed.r
      quantumColors[i * 3 + 1] = mixed.g
      quantumColors[i * 3 + 2] = mixed.b
    }

    quantumGeo.setAttribute('position', new THREE.BufferAttribute(quantumPos, 3))
    quantumGeo.setAttribute('color', new THREE.BufferAttribute(quantumColors, 3))

    const quantumMat = new THREE.PointsMaterial({
      size: 1.1,
      vertexColors: true,
      map: glowTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.85,
    })

    const quantumPoints = new THREE.Points(quantumGeo, quantumMat)
    quantumGroup.add(quantumPoints)

    // Central spinning quantum crystal
    const crystalGeo = new THREE.DodecahedronGeometry(4.5, 0)
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      emissive: COLOR_MINT,
      emissiveIntensity: 0.3,
    })
    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat)
    quantumGroup.add(crystalMesh)

    // --- SETTINGS SUBSCRIPTION ---
    const unsubscribe = subscribeBackground3D((settings) => {
      setActiveMode(settings.mode)
      synapseGroup.visible = settings.mode === 'synapse'
      matrixGroup.visible = settings.mode === 'matrix'
      quantumGroup.visible = settings.mode === 'quantum'
    })

    // Set initial mode visibility
    const initialSettings = getBackground3DSettings()
    synapseGroup.visible = initialSettings.mode === 'synapse'
    matrixGroup.visible = initialSettings.mode === 'matrix'
    quantumGroup.visible = initialSettings.mode === 'quantum'

    // --- RESIZE HANDLING ---
    function handleResize() {
      if (!canvas) return
      width = window.innerWidth
      height = window.innerHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))
    }

    window.addEventListener('resize', handleResize)

    // Visibility observer to pause rendering when background is not visible or tab hidden
    function handleVisibility() {
      isVisible = document.visibilityState === 'visible'
    }
    document.addEventListener('visibilitychange', handleVisibility)

    // --- MAIN ANIMATION LOOP ---
    let clock = new THREE.Clock()

    function animate() {
      animationFrameId = requestAnimationFrame(animate)
      if (!isVisible) return

      const delta = clock.getDelta()
      const time = clock.getElapsedTime()

      // Smooth mouse damping
      mouse.x += (mouse.targetX - mouse.x) * 0.05
      mouse.y += (mouse.targetY - mouse.y) * 0.05

      // Scroll-driven camera path: glide camera smoothly along Z and Y
      const targetCamZ = 32 - scrollProgress * 12
      const targetCamY = -scrollProgress * 14 + mouse.y * 3
      const targetCamX = mouse.x * 4.5

      camera.position.x += (targetCamX - camera.position.x) * 0.04
      camera.position.y += (targetCamY - camera.position.y) * 0.04
      camera.position.z += (targetCamZ - camera.position.z) * 0.04
      camera.lookAt(0, -scrollProgress * 10, -5)

      // Light orbit
      pointLightMint.position.x = Math.sin(time * 0.6) * 16 + mouse.x * 5
      pointLightMint.position.y = Math.cos(time * 0.5) * 12 + mouse.y * 5
      pointLightCyan.position.x = -Math.sin(time * 0.5) * 18 - mouse.x * 5
      pointLightCyan.position.y = -Math.cos(time * 0.7) * 14 - mouse.y * 5

      // --- 1. Synapse Animation ---
      if (synapseGroup.visible) {
        // Rotate Central Core
        icoMesh.rotation.x = time * 0.12
        icoMesh.rotation.y = time * 0.16
        innerIcoMesh.rotation.x = -time * 0.18
        innerIcoMesh.rotation.z = time * 0.22
        ringMesh1.rotation.z = time * 0.09
        ringMesh2.rotation.x = -time * 0.07

        // Core gentle breathing
        const scale = 1 + Math.sin(time * 1.5) * 0.05
        coreGroup.scale.set(scale, scale, scale)

        // Move nodes gently
        const posAttr = nodeGeometry.attributes.position as THREE.BufferAttribute
        const arr = posAttr.array as Float32Array

        for (let i = 0; i < NODE_COUNT; i++) {
          const idx = i * 3
          arr[idx] += nodeVelocities[i].vx
          arr[idx + 1] += nodeVelocities[i].vy
          arr[idx + 2] += nodeVelocities[i].vz

          // Bounce off bounds
          if (Math.abs(arr[idx]) > 27) nodeVelocities[i].vx *= -1
          if (Math.abs(arr[idx + 1]) > 19) nodeVelocities[i].vy *= -1
          if (Math.abs(arr[idx + 2]) > 16) nodeVelocities[i].vz *= -1
        }
        posAttr.needsUpdate = true

        // Reconnect lines within threshold
        let lineIdx = 0
        const lPos = lineGeometry.attributes.position.array as Float32Array
        const lCol = lineGeometry.attributes.color.array as Float32Array
        const CONNECT_DIST_SQ = 9.5 * 9.5

        for (let i = 0; i < NODE_COUNT; i++) {
          const ix = arr[i * 3]
          const iy = arr[i * 3 + 1]
          const iz = arr[i * 3 + 2]

          for (let j = i + 1; j < NODE_COUNT; j++) {
            if (lineIdx >= MAX_LINES) break

            const jx = arr[j * 3]
            const jy = arr[j * 3 + 1]
            const jz = arr[j * 3 + 2]

            const dx = ix - jx
            const dy = iy - jy
            const dz = iz - jz
            const distSq = dx * dx + dy * dy + dz * dz

            if (distSq < CONNECT_DIST_SQ) {
              const alpha = Math.max(0.04, 1 - Math.sqrt(distSq) / 9.5) * 0.35

              const pIdx = lineIdx * 6
              lPos[pIdx] = ix
              lPos[pIdx + 1] = iy
              lPos[pIdx + 2] = iz
              lPos[pIdx + 3] = jx
              lPos[pIdx + 4] = jy
              lPos[pIdx + 5] = jz

              // Gradient between Mint and Cyan
              lCol[pIdx] = 0.0
              lCol[pIdx + 1] = alpha * 0.96
              lCol[pIdx + 2] = alpha * 0.63
              lCol[pIdx + 3] = alpha * 0.02
              lCol[pIdx + 4] = alpha * 0.71
              lCol[pIdx + 5] = alpha * 0.83

              lineIdx++
            }
          }
        }
        lineGeometry.setDrawRange(0, lineIdx * 2)
        lineGeometry.attributes.position.needsUpdate = true
        lineGeometry.attributes.color.needsUpdate = true
      }

      // --- 2. Matrix Animation ---
      if (matrixGroup.visible) {
        const pPos = planeGeo.attributes.position as THREE.BufferAttribute
        const pArr = pPos.array as Float32Array
        for (let i = 0; i < pArr.length; i += 3) {
          const u = pArr[i]
          const v = pArr[i + 1]
          pArr[i + 2] = Math.sin(u * 0.25 + time * 1.5) * 1.6 + Math.cos(v * 0.25 + time * 1.2) * 1.6
        }
        pPos.needsUpdate = true

        cubes.forEach((cube, i) => {
          cube.rotation.x += 0.01 * (i % 2 === 0 ? 1 : -1)
          cube.rotation.y += 0.015
          cube.position.y += Math.sin(time * 1.2 + i) * 0.02
        })
      }

      // --- 3. Quantum Animation ---
      if (quantumGroup.visible) {
        quantumGroup.rotation.y = time * 0.08
        quantumGroup.rotation.z = Math.sin(time * 0.1) * 0.15
        crystalMesh.rotation.x = time * 0.15
        crystalMesh.rotation.y = -time * 0.2
      }

      // Stardust slow drift
      starPoints.rotation.y = time * 0.012

      renderer.render(scene, camera)
    }

    if (!reduceMotion) {
      animate()
    } else {
      // Just one static render for reduced motion
      renderer.render(scene, camera)
    }

    // --- CLEANUP ---
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibility)
      unsubscribe()

      // Dispose three.js resources
      nodeGeometry.dispose()
      nodeMaterial.dispose()
      lineGeometry.dispose()
      lineMaterial.dispose()
      icoGeo.dispose()
      icoMat.dispose()
      innerIcoGeo.dispose()
      innerIcoMat.dispose()
      ringGeo.dispose()
      ringMat.dispose()
      starGeo.dispose()
      starMat.dispose()
      planeGeo.dispose()
      planeMat.dispose()
      cubeGeo.dispose()
      cubeMat.dispose()
      quantumGeo.dispose()
      quantumMat.dispose()
      crystalGeo.dispose()
      crystalMat.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 size-full block"
        style={{ opacity: webGlAvailable ? 1 : 0 }}
      />

      {/* Atmospheric lighting layers for perfect text readability and depth */}
      <div className="absolute inset-0 bg-[#090d16]/75 [mask-image:radial-gradient(ellipse_at_center,transparent_0%,#090d16_85%)]" />
      <div className="grid-lines absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_75%)]" />
      <div className="absolute -top-40 left-1/2 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-emerald-glow/12 blur-[150px]" />
      <div className="absolute top-[55%] -right-40 h-[440px] w-[540px] rounded-full bg-cyan-neon/10 blur-[150px]" />
      <div className="absolute top-[85%] -left-32 h-[420px] w-[500px] rounded-full bg-mint/8 blur-[160px]" />

      {/* Cyber scanline & grain overlay */}
      <div className="scanlines absolute inset-0 opacity-25" />
      <svg className="animate-grain absolute -inset-[50%] h-[200%] w-[200%] opacity-[0.05]">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
    </div>
  )
}
