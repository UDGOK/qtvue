<script setup lang="ts">
/**
 * AmbientField — lightweight WebGL particle field for section backgrounds.
 * Subtle, low-density, less CPU than the hero. Used behind stat blocks,
 * testimonials, etc. to give the site that "trillion-dollar" tech vibe
 * without being distracting.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as THREE from 'three'

const props = withDefaults(
  defineProps<{
    density?: number
    height?: string
  }>(),
  { density: 600, height: '400px' },
)

const root = ref<HTMLDivElement | null>(null)

onMounted(() => {
  const el = root.value
  if (!el) return
  const w = el.clientWidth
  const h = el.clientHeight
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

  const isDark = document.documentElement.classList.contains('dark')
  const ink = new THREE.Color(isDark ? 0xe8f0e5 : 0x0a1f14)
  const primary = new THREE.Color(isDark ? 0x2dd47a : 0x0e5c3a)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100)
  camera.position.set(0, 0, 8)

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(dpr)
  renderer.setSize(w, h)
  renderer.setClearColor(0x000000, 0)
  el.appendChild(renderer.domElement)

  const count = props.density
  const positions = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const drifts = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 18
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10
    positions[i * 3 + 2] = (Math.random() - 0.5) * 6
    sizes[i] = Math.random() * 0.04 + 0.01
    drifts[i] = Math.random() * 0.4 + 0.1
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))

  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: ink.clone().lerp(primary, 0.3) },
      uPixelRatio: { value: dpr },
    },
    vertexShader: /* glsl */ `
      attribute float aSize;
      uniform float uTime;
      uniform float uPixelRatio;
      varying float vAlpha;
      void main() {
        vec3 p = position;
        p.y += sin(uTime * 0.4 + position.x * 0.5) * 0.1;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = aSize * 220.0 * uPixelRatio / -mv.z;
        gl_Position = projectionMatrix * mv;
        vAlpha = 0.4 + 0.6 * (0.5 + 0.5 * sin(uTime + position.x));
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      varying float vAlpha;
      void main() {
        vec2 c = gl_PointCoord - 0.5;
        float d = length(c);
        if (d > 0.5) discard;
        float a = smoothstep(0.5, 0.0, d) * vAlpha;
        gl_FragColor = vec4(uColor, a * 0.6);
      }
    `,
  })

  const points = new THREE.Points(geo, mat)
  scene.add(points)

  let raf = 0
  let visible = !document.hidden
  function tick(t: number) {
    if (!visible) {
      raf = requestAnimationFrame(tick)
      return
    }
    const time = t * 0.001
    mat.uniforms.uTime.value = time
    // slow drift up
    const pos = geo.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < count; i++) {
      const y = pos.array[i * 3 + 1] as number
      let ny = y + drifts[i] * 0.004
      if (ny > 5) ny = -5
      pos.array[i * 3 + 1] = ny
    }
    pos.needsUpdate = true
    // gentle rotation
    points.rotation.y = time * 0.02
    renderer.render(scene, camera)
    raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)

  function onVis() { visible = !document.hidden }
  document.addEventListener('visibilitychange', onVis)

  function onResize() {
    renderer.setSize(el.clientWidth, el.clientHeight)
    camera.aspect = el.clientWidth / el.clientHeight
    camera.updateProjectionMatrix()
  }
  const ro = new ResizeObserver(onResize)
  ro.observe(el)

  onBeforeUnmount(() => {
    cancelAnimationFrame(raf)
    document.removeEventListener('visibilitychange', onVis)
    ro.disconnect()
    renderer.dispose()
    geo.dispose()
    mat.dispose()
    if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement)
  })
})
</script>

<template>
  <div
    ref="root"
    :style="{ height }"
    class="pointer-events-none absolute inset-x-0 top-0 -z-10"
    aria-hidden="true"
  />
</template>
