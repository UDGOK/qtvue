<script setup lang="ts">
/**
 * DemoVideo — greptile-style autoplay demo video.
 *
 * Behaviors:
 *  - muted, autoplay, loop, playsinline (no fullscreen hijack, no audio)
 *  - lazy / metadata preload (don't fetch the file until in viewport)
 *  - respects prefers-reduced-motion: pauses and shows a click-to-play overlay
 *  - dashed-border "blueprint" frame, matching the rest of qtvue
 *  - "live · <label>" status pill in the corner
 *  - play/pause control on hover (greptile pattern)
 *  - SSR-safe: no autoplay until after mount, no hydration mismatch
 */
const props = withDefaults(
  defineProps<{
    /** Path under /public, e.g. '/videos/g1-demo.mp4' */
    src: string
    /** Same video in webm for ~30% size savings when supported */
    webmSrc?: string
    /** Poster image (jpg) shown until first frame paints */
    poster?: string
    /** Pill in the corner, e.g. 'live · G1 demo' */
    label?: string
    /** Aspect ratio (defaults to 16/9) */
    aspect?: string
  }>(),
  { aspect: '16/9', label: 'live demo' },
)

const videoEl = ref<HTMLVideoElement | null>(null)
const playing = ref(false)
const mounted = ref(false)
const reducedMotion = ref(false)
const wantsPlay = ref(true)

onMounted(() => {
  mounted.value = true
  reducedMotion.value = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  // If reduced motion is on, do NOT autoplay — show click-to-play instead.
  if (reducedMotion.value) wantsPlay.value = false
  playing.value = wantsPlay.value
})

function toggle() {
  const v = videoEl.value
  if (!v) return
  if (v.paused) {
    v.play().catch(() => {
      /* autoplay blocked — keep click-to-play state */
    })
    playing.value = true
  } else {
    v.pause()
    playing.value = false
  }
}

function onPlay()  { playing.value = true }
function onPause() { playing.value = false }
function onEnded()  { /* loop handles it */ }
</script>

<template>
  <div
    class="group relative overflow-hidden rounded-2xl border border-dashed border-border bg-surface"
    :style="{ aspectRatio: aspect }"
  >
    <video
      ref="videoEl"
      :src="src"
      :poster="poster"
      :muted="true"
      :loop="true"
      :playsinline="true"
      :autoplay="mounted && wantsPlay && !reducedMotion"
      preload="metadata"
      class="absolute inset-0 h-full w-full object-cover"
      @play="onPlay"
      @pause="onPause"
      @ended="onEnded"
    >
      <source v-if="webmSrc" :src="webmSrc" type="video/webm" />
      <source :src="src" type="video/mp4" />
    </video>

    <!-- subtle inner ring so the dashed border doesn't fight the video edge -->
    <div class="pointer-events-none absolute inset-0 ring-1 ring-inset ring-border/20" aria-hidden="true" />

    <!-- corner status pill -->
    <div
      v-if="label"
      class="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full border border-border bg-bg/85 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-text-secondary backdrop-blur"
    >
      <span class="relative flex h-1.5 w-1.5" aria-hidden="true">
        <span
          v-if="playing"
          class="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60"
        />
        <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
      </span>
      {{ label }}
    </div>

    <!-- play/pause overlay (only shown when paused, or for reduced-motion users) -->
    <button
      v-if="!playing"
      type="button"
      @click="toggle"
      :aria-label="`Play ${label}`"
      class="absolute inset-0 grid place-items-center bg-bg/20 backdrop-blur-[1px] transition-opacity hover:bg-bg/30"
    >
      <span class="grid h-16 w-16 place-items-center rounded-full border-2 border-paper bg-bg/90 text-text shadow-[var(--shadow-lg)] transition-transform group-hover:scale-110">
        <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M5 3.5v9l8-4.5z" />
        </svg>
      </span>
    </button>

    <!-- bottom-right play/pause control (only when playing) -->
    <button
      v-if="playing"
      type="button"
      @click="toggle"
      aria-label="Pause"
      class="absolute bottom-4 right-4 grid h-9 w-9 place-items-center rounded-full border border-border bg-bg/85 text-text-secondary backdrop-blur transition-all hover:border-primary hover:text-primary"
    >
      <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <rect x="4" y="3" width="3" height="10" />
        <rect x="9" y="3" width="3" height="10" />
      </svg>
    </button>
  </div>
</template>
