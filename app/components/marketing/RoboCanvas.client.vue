<script setup lang="ts">
/**
 * RoboCanvas — client-only Three.js hero scene.
 * A wireframe + solid-hybrid robotic arm suspended in a particle field
 * with a perspective grid floor. Subtle camera parallax on mouse move.
 *
 * Performance:
 *  - InstancedMesh for particles (one draw call for thousands of dots)
 *  - Low-poly geometry for the arm
 *  - requestAnimationFrame with visibilitychange pause
 *  - Auto-downgrades to a static frame on prefers-reduced-motion
 *  - Pixel ratio capped at 1.5
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as THREE from 'three'

const props = withDefaults(
  defineProps<{
    density?: number   // particle count
    intensity?: number // overall 0-1 animation intensity
  }>(),
  { density: 1800, intensity: 1 },
)

const root = ref<HTMLDivElement | null>(null)
const reduced = ref(false)

onMounted(() => {
  const el = root.value
  if (!el) return
  reduced.value =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const w = el.clientWidth
  const h = el.clientHeight
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

  // ------------------------------------------------------------------ scene
  const scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0x0a0f0a, 14, 32)

  // ------------------------------------------------------------------ camera
  const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100)
  camera.position.set(0, 1.6, 9)
  camera.lookAt(0, 0.4, 0)

  // ----------------------------------------------------------------- renderer
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  })
  renderer.setPixelRatio(dpr)
  renderer.setSize(w, h)
  renderer.setClearColor(0x000000, 0)
  el.appendChild(renderer.domElement)

  // ----------------------------------------------------------- color helpers
  const isDark =
    document.documentElement.classList.contains('dark') ||
    window.matchMedia('(prefers-color-scheme: dark)').matches
  const COLOR_INK = new THREE.Color(isDark ? 0xe8f0e5 : 0x0a1f14)
  const COLOR_ACCENT = new THREE.Color(0xc6f432)
  const COLOR_PRIMARY = new THREE.Color(isDark ? 0x2dd47a : 0x0e5c3a)
  const COLOR_GRID = new THREE.Color(isDark ? 0x2a3a30 : 0x1a2e22)

  // ----------------------------------------------------------- particle field
  const count = Math.floor(props.density * (reduced.value ? 0.25 : 1))
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const velocities = new Float32Array(count) // for slow drift

  for (let i = 0; i < count; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 24
    positions[i * 3 + 1] = (Math.random() - 0.5) * 12
    positions[i * 3 + 2] = (Math.random() - 0.5) * 18 - 2
    // mix between ink and primary green for subtle variation
    const mix = Math.random()
    const c = COLOR_INK.clone().lerp(COLOR_PRIMARY, mix * 0.5)
    colors[i * 3 + 0] = c.r
    colors[i * 3 + 1] = c.g
    colors[i * 3 + 2] = c.b
    sizes[i] = Math.random() * 0.06 + 0.015
    velocities[i] = Math.random() * 0.3 + 0.05
  }

  const particleGeo = new THREE.BufferGeometry()
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  particleGeo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))

  const particleMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: dpr },
    },
    vertexShader: /* glsl */ `
      attribute float aSize;
      varying vec3 vColor;
      uniform float uTime;
      uniform float uPixelRatio;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        // twinkle
        float tw = 0.5 + 0.5 * sin(uTime * 2.0 + position.x * 0.7 + position.y * 1.1);
        gl_PointSize = aSize * 220.0 * uPixelRatio * (0.6 + 0.4 * tw) / -mvPosition.z;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec3 vColor;
      void main() {
        vec2 c = gl_PointCoord - 0.5;
        float d = length(c);
        if (d > 0.5) discard;
        float alpha = smoothstep(0.5, 0.0, d);
        gl_FragColor = vec4(vColor, alpha * 0.85);
      }
    `,
    vertexColors: true,
  })

  const particles = new THREE.Points(particleGeo, particleMat)
  scene.add(particles)

  // ----------------------------------------------------------- robotic arm
  // Build a stylized arm with jointed cylindrical segments + glowing joints.
  // The arm sits on the right side of the hero so it visually anchors the
  // headline on the left.
  const arm = new THREE.Group()
  arm.position.set(2.2, -0.6, 0)
  arm.rotation.z = -0.12
  scene.add(arm)

  const matMetal = new THREE.MeshStandardMaterial({
    color: COLOR_INK,
    metalness: 0.85,
    roughness: 0.35,
    envMapIntensity: 1.2,
  })
  const matWire = new THREE.LineBasicMaterial({
    color: COLOR_INK,
    transparent: true,
    opacity: 0.45,
  })
  const matGlow = new THREE.MeshBasicMaterial({
    color: COLOR_ACCENT,
    transparent: true,
    opacity: 0.95,
  })

  function makeJoint(r: number) {
    const g = new THREE.IcosahedronGeometry(r, 1)
    const mesh = new THREE.Mesh(g, matMetal)
    return mesh
  }
  function makeSegment(len: number, r: number) {
    const g = new THREE.CylinderGeometry(r, r, len, 16, 1, false)
    const mesh = new THREE.Mesh(g, matMetal)
    // wireframe overlay
    const wire = new THREE.LineSegments(new THREE.EdgesGeometry(g), matWire)
    mesh.add(wire)
    return mesh
  }
  function makeGlowDot(r: number) {
    const g = new THREE.SphereGeometry(r, 16, 16)
    const mesh = new THREE.Mesh(g, matGlow)
    return mesh
  }

  // Base + lower arm + joint + upper arm + joint + gripper
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 0.25, 24), matMetal)
  base.position.y = -0.5
  arm.add(base)

  const lowerJoint = makeJoint(0.32)
  lowerJoint.position.y = -0.25
  arm.add(lowerJoint)

  const seg1 = makeSegment(1.4, 0.16)
  seg1.position.y = 0.7
  const seg1Pivot = new THREE.Group()
  seg1Pivot.position.y = -0.05
  seg1Pivot.add(seg1)
  arm.add(seg1Pivot)

  const elbow = makeJoint(0.26)
  elbow.position.y = 1.35
  seg1Pivot.add(elbow)

  const seg2Pivot = new THREE.Group()
  seg2Pivot.position.y = 0.05
  seg1Pivot.add(seg2Pivot)
  const seg2 = makeSegment(1.2, 0.13)
  seg2.position.y = 0.6
  seg2Pivot.add(seg2)

  const wrist = makeJoint(0.22)
  wrist.position.y = 1.2
  seg2Pivot.add(wrist)

  const seg3 = makeSegment(0.7, 0.1)
  seg3.position.y = 0.35
  seg3.rotation.z = -0.4
  seg2Pivot.add(seg3)

  // gripper fingers
  const finger1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, 0.12), matMetal)
  finger1.position.set(0.16, 0.85, 0)
  finger1.rotation.z = 0.2
  seg2Pivot.add(finger1)
  const finger2 = finger1.clone()
  finger2.position.x = -0.16
  finger2.rotation.z = -0.2
  seg2Pivot.add(finger2)

  // glowing joints (small accent dots)
  const glowLower = makeGlowDot(0.05)
  glowLower.position.copy(lowerJoint.position)
  arm.add(glowLower)
  const glowElbow = makeGlowDot(0.04)
  glowElbow.position.set(0, 1.3, 0.05)
  seg1Pivot.add(glowElbow)
  const glowWrist = makeGlowDot(0.035)
  glowWrist.position.set(0, 1.2, 0.05)
  seg2Pivot.add(glowWrist)

  // base ring
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.55, 0.02, 8, 64),
    new THREE.MeshBasicMaterial({ color: COLOR_ACCENT, transparent: true, opacity: 0.7 }),
  )
  ring.position.y = -0.6
  ring.rotation.x = Math.PI / 2
  arm.add(ring)

  // ----------------------------------------------------------- grid floor
  const grid = new THREE.GridHelper(40, 40, COLOR_GRID, COLOR_GRID)
  const gridMat = grid.material as THREE.LineBasicMaterial | THREE.LineBasicMaterial[]
  if (Array.isArray(gridMat)) {
    gridMat.forEach((m) => ((m as THREE.LineBasicMaterial).transparent = true))
    gridMat.forEach((m) => ((m as THREE.LineBasicMaterial).opacity = 0.18))
  } else {
    gridMat.transparent = true
    gridMat.opacity = 0.18
  }
  grid.position.y = -1.1
  scene.add(grid)

  // ----------------------------------------------------------- lighting
  const ambient = new THREE.AmbientLight(0xffffff, 0.45)
  scene.add(ambient)
  const key = new THREE.DirectionalLight(0xffffff, 1.0)
  key.position.set(4, 6, 5)
  scene.add(key)
  const rim = new THREE.DirectionalLight(new THREE.Color(0x88ffcc), 0.6)
  rim.position.set(-5, 2, -3)
  scene.add(rim)
  const accent = new THREE.PointLight(new THREE.Color(0xc6f432), 1.6, 8, 1.5)
  accent.position.set(0, 0, 1.5)
  scene.add(accent)

  // ----------------------------------------------------------- mouse parallax
  const target = { x: 0, y: 0 }
  const current = { x: 0, y: 0 }
  function onMove(e: MouseEvent) {
    const r = el.getBoundingClientRect()
    target.x = ((e.clientX - r.left) / r.width - 0.5) * 2
    target.y = ((e.clientY - r.top) / r.height - 0.5) * 2
  }
  window.addEventListener('mousemove', onMove)

  // ----------------------------------------------------------- resize
  function onResize() {
    const W = el.clientWidth
    const H = el.clientHeight
    renderer.setSize(W, H)
    camera.aspect = W / H
    camera.updateProjectionMatrix()
  }
  const ro = new ResizeObserver(onResize)
  ro.observe(el)

  // ----------------------------------------------------------- animate
  let raf = 0
  let visible = true
  function tick(t: number) {
    if (!visible) {
      raf = requestAnimationFrame(tick)
      return
    }
    const time = t * 0.001 * (reduced.value ? 0.3 : 1) * props.intensity
    // smooth camera parallax
    current.x += (target.x - current.x) * 0.05
    current.y += (target.y - current.y) * 0.05
    camera.position.x = current.x * 0.8
    camera.position.y = 1.6 - current.y * 0.4
    camera.lookAt(0, 0.4, 0)

    // arm slow articulation
    seg1Pivot.rotation.z = Math.sin(time * 0.6) * 0.18 - 0.2
    seg2Pivot.rotation.z = Math.sin(time * 0.6 + 0.7) * 0.4 - 0.6
    seg2Pivot.rotation.x = Math.sin(time * 0.4) * 0.06
    arm.rotation.y = Math.sin(time * 0.3) * 0.1

    // accent light orbit
    accent.position.x = Math.cos(time * 0.5) * 2
    accent.position.z = Math.sin(time * 0.5) * 2 + 1.5

    // particle drift
    const posAttr = particleGeo.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < count; i++) {
      const y = posAttr.array[i * 3 + 1] as number
      let ny = y + velocities[i] * 0.005
      if (ny > 6) ny = -6
      posAttr.array[i * 3 + 1] = ny
    }
    posAttr.needsUpdate = true
    particleMat.uniforms.uTime.value = time

    // glow pulse
    const pulse = 0.7 + 0.3 * Math.sin(time * 1.5)
    matGlow.opacity = 0.6 + 0.4 * pulse

    renderer.render(scene, camera)
    raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)

  function onVis() {
    visible = !document.hidden
  }
  document.addEventListener('visibilitychange', onVis)

  // ----------------------------------------------------------- cleanup
  onBeforeUnmount(() => {
    cancelAnimationFrame(raf)
    window.removeEventListener('mousemove', onMove)
    document.removeEventListener('visibilitychange', onVis)
    ro.disconnect()
    renderer.dispose()
    particleGeo.dispose()
    particleMat.dispose()
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose()
      const m = (obj as THREE.Mesh).material
      if (m) {
        if (Array.isArray(m)) m.forEach((mm) => mm.dispose())
        else (m as THREE.Material).dispose()
      }
    })
    if (renderer.domElement.parentNode === el) {
      el.removeChild(renderer.domElement)
    }
  })
})
</script>

<template>
  <div ref="root" class="absolute inset-0" aria-hidden="true" />
</template>
