<script setup lang="ts">
/**
 * Reveal.vue — scroll-triggered fade/slide-in wrapper.
 *
 * Strategy:
 *  - SSR: always renders VISIBLE (good for SEO, no-JS users, and as a
 *    safe default if hydration fails for any reason). This matches my
 *    testing: zero hydration warnings, byte-identical style attribute
 *    between server and client first render.
 *  - Client, on mount: if element is ABOVE the fold, leave visible (no
 *    animation needed — it's already on screen). If BELOW the fold,
 *    briefly hide it then observe it; on intersection, reveal with the
 *    configured delay.
 *  - Reduced motion: always visible immediately.
 *  - Safety net: 1.5s timer forces visible in case IO never fires
 *    (headless screenshot tools, weird browser bugs, etc).
 *
 * The previous "start hidden" version looked safer in theory but had a
 * real failure mode: any hydration issue upstream (or a browser that
 * doesn't run IntersectionObserver) left the content permanently
 * invisible. This version degrades gracefully.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    /** delay in ms — useful for staggering grids */
    delay?: number
    /** translate offset in px */
    y?: number
    /** tag for the wrapper */
    as?: keyof HTMLElementTagNameMap
  }>(),
  { delay: 0, y: 16, as: 'div' },
)

const root = ref<HTMLElement | null>(null)
const visible = ref(true) // SSR-safe default: always visible until proven otherwise

onMounted(() => {
  const el = root.value
  if (!el) return
  if (typeof IntersectionObserver === 'undefined') return
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) return

  const rect = el.getBoundingClientRect()
  const viewportH = window.innerHeight || 0
  const inView = rect.top < viewportH && rect.bottom > 0
  if (inView) return // already on screen, nothing to animate

  // Below the fold: animate in when scrolled into view.
  visible.value = false
  let io: IntersectionObserver | null = null
  let timer: number | null = null

  const show = () => {
    window.setTimeout(() => (visible.value = true), props.delay)
  }

  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          show()
          io?.disconnect()
          if (timer) window.clearTimeout(timer)
        }
      }
    },
    { threshold: 0, rootMargin: '0px 0px -8% 0px' },
  )
  io.observe(el)

  // Safety net: if the IO never fires for any reason, force visible
  // after 1.5s so content never gets permanently hidden.
  timer = window.setTimeout(() => {
    show()
    io?.disconnect()
  }, 1500)

  onBeforeUnmount(() => {
    io?.disconnect()
    if (timer) window.clearTimeout(timer)
  })
})
</script>

<template>
  <component
    :is="as"
    ref="root"
    :style="{
      transform: visible ? 'translateY(0)' : `translateY(${y}px)`,
      opacity: visible ? 1 : 0,
      transition: 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1), opacity 600ms cubic-bezier(0.16, 1, 0.3, 1)',
      transitionDelay: `${delay}ms`,
      willChange: 'transform, opacity',
    }"
  >
    <slot />
  </component>
</template>
