<script setup lang="ts">
/**
 * Reveal.vue — hydration-safe scroll/mount reveal animation.
 *
 * Why we start hidden (shown=false):
 *   Starting hidden on BOTH server and client means the SSR HTML
 *   (`opacity:0; transform:translateY(20px)`) byte-matches the client's
 *   first render — Vue's hydration walker doesn't desync on the style
 *   attribute. The animation only kicks in AFTER onMounted (when
 *   IntersectionObserver fires), so it's a post-hydration reactive
 *   update, not a hydration mismatch.
 *
 * Why this avoids the "flash" bug:
 *   Starting visible means SSR paints the element in its final spot.
 *   When JS loads and the element is below the fold, it snaps back to
 *   `translateY(20px); opacity:0` for one frame before animating in.
 *   Starting hidden makes the first paint already invisible.
 *
 * No-JS / SEO:
 *   Content is initially invisible because the only way to reveal it is
 *   JS. We compensate with a <noscript> global stylesheet (added in
 *   main.css) that forces `.qtvue-reveal { opacity:1; transform:none }`
 *   when scripts are disabled. Search engines that render JS see content
 *   in the visible state once IO fires.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    /** tag for the wrapper (default 'div') */
    as?: keyof HTMLElementTagNameMap
    /** start offset in px */
    y?: number
    /** animation duration in ms */
    duration?: number
    /** delay in ms — useful for staggering grids */
    delay?: number
    /** stop observing after first reveal */
    once?: boolean
    /** IntersectionObserver threshold */
    threshold?: number
  }>(),
  { as: 'div', y: 20, duration: 600, delay: 0, once: true, threshold: 0.12 },
)

const el = ref<HTMLElement | null>(null)
const shown = ref(false) // identical on server + client first render
let io: IntersectionObserver | null = null

onMounted(() => {
  // No-JS users already see content via the <noscript> fallback in
  // main.css. For JS users:
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  if (reduced || !el.value || typeof IntersectionObserver === 'undefined') {
    shown.value = true
    return
  }

  // If the element is already in viewport on mount, reveal immediately
  // (no observer latency, no flash).
  const rect = el.value.getBoundingClientRect()
  const viewportH = window.innerHeight || 0
  if (rect.top < viewportH && rect.bottom > 0) {
    window.setTimeout(() => (shown.value = true), props.delay)
    return
  }

  io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          window.setTimeout(() => (shown.value = true), props.delay)
          if (props.once && io) {
            io.disconnect()
            io = null
          }
        } else if (!props.once) {
          shown.value = false
        }
      }
    },
    { threshold: props.threshold, rootMargin: '0px 0px -8% 0px' },
  )
  io.observe(el.value)
})

onBeforeUnmount(() => {
  io?.disconnect()
  io = null
})
</script>

<template>
  <component
    :is="as"
    ref="el"
    class="qtvue-reveal"
    :style="{
      transform: shown ? 'translateY(0)' : `translateY(${y}px)`,
      opacity: shown ? 1 : 0,
      transition: `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      willChange: 'transform, opacity',
    }"
  >
    <slot />
  </component>
</template>
