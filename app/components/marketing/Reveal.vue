<script setup lang="ts">
/**
 * Reveal — scroll-triggered fade/slide-in wrapper.
 *
 * Strategy:
 *  - SSR / no JS / reduced motion: always visible (good for SEO, screenshots).
 *  - Client, with JS: on mount, if the element is in viewport, leave visible.
 *  - If the element is BELOW the fold on mount, hide it and observe it.
 *    When the user scrolls it into view, fade/slide in.
 *  - Safety net: if the IO never fires (e.g. headless full-page screenshot
 *    that doesn't trigger scroll events), a 1.5s timer forces visible.
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
const visible = ref(true) // SSR-safe default

onMounted(() => {
  const el = root.value
  if (!el) return
  if (typeof IntersectionObserver === 'undefined') return
  const reduced =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) return

  const rect = el.getBoundingClientRect()
  const viewportH = window.innerHeight || 0
  const inView = rect.top < viewportH && rect.bottom > 0
  if (inView) return

  // Below the fold: hide and observe.
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

  // Safety net: if the IO never fires (e.g. headless screenshot tools that
  // resize the viewport rather than scrolling), force visible after 1.5s.
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
