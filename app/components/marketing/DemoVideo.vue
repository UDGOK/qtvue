<script setup lang="ts">
/**
 * DemoVideo — greptile-style demo video with three modes.
 *
 * Modes
 * -----
 *  - 'showcase'  (default) — full UI: dashed frame, status pill, play/pause,
 *              pause control. Used on platform detail pages.
 *  - 'minimal'   — dashed frame + caption only, no controls at all.
 *              Good for stacked grids / montage sections.
 *  - 'background' — no frame, no pill, no controls. Just a clean autoplay
 *              loop with the theme tint over it. Used behind hero copy.
 *
 * Behaviors (all modes)
 * --------------------
 *  - muted, autoplay, loop, playsinline (no audio, no fullscreen hijack)
 *  - preload='metadata' (browser fetches first chunk to find duration,
 *    doesn't pull the full file until the user lands on the page)
 *  - respects prefers-reduced-motion: shows a click-to-play overlay
 *    instead of autoplaying
 *  - SSR-safe: autoplay is gated on a `mounted` ref, so the server
 *    renders autoplay='false' and the client upgrades it to
 *    autoplay='true' after mount, with the same DOM tree
 *  - lazy-loads with the loading="lazy" attribute on the underlying
 *    source so the browser defers fetch until the element is
 *    near the viewport
 *
 * Tint
 * ----
 *  Pass `tint='forest'` (default) for a subtle green-to-transparent
 *  gradient at the bottom of the frame. 'none' to disable.
 *  The tint is the unified "looks like the rest of the site" overlay
 *  the user asked for — every video gets the same treatment.
 */
type Mode = 'showcase' | 'minimal' | 'background'
type Tint = 'forest' | 'none'

const props = withDefaults(
  defineProps<{
    src: string
    webmSrc?: string
    poster?: string
    /** Status pill in the corner (showcase mode only) */
    label?: string
    aspect?: string
    mode?: Mode
    tint?: Tint
  }>(),
  { aspect: '16/9', mode: 'showcase', tint: 'forest' },
)

const videoEl = ref<HTMLVideoElement | null>(null)
const playing = ref(false)
const mounted = ref(false)
const reducedMotion = ref(false)
const wantsPlay = ref(true)

onMounted(() => {
  mounted.value = true
  reducedMotion.value = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  if (reducedMotion.value) wantsPlay.value = false
  playing.value = wantsPlay.value
})

function toggle() {
  const v = videoEl.value
  if (!v) return
  if (v.paused) {
    v.play().catch(() => { /* autoplay blocked — keep click-to-play state */ })
    playing.value = true
  } else {
    v.pause()
    playing.value = false
  }
}
function onPlay()  { playing.value = true }
function onPause() { playing.value = false }

const frameClass = computed(() => {
  if (props.mode === 'background') return ''
  return 'overflow-hidden rounded-2xl border border-dashed border-border bg-surface'
})
</script>

<template>
  <div
    :class="frameClass"
    :style="mode !== 'background' ? { aspectRatio: aspect } : {}"
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
      loading="lazy"
      class="h-full w-full"
      :class="mode === 'background' ? 'absolute inset-0 object-cover' : 'absolute inset-0 object-cover'"
      @play="onPlay"
      @pause="onPause"
    >
      <source v-if="webmSrc" :src="webmSrc" type="video/webm" />
      <source :src="src" type="video/mp4" />
    </video>

    <!--
      Themed overlay. Same treatment on every video across the site:
      a subtle forest-green-to-transparent gradient at the bottom
      that gives the footage a unified look that matches the rest
      of the site. Toggleable via `tint='none'`.
    -->
    <div
      v-if="tint === 'forest'"
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/0 via-primary/0 to-primary/30 mix-blend-multiply"
    />
    <div
      v-if="tint === 'forest'"
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 halftone-bg opacity-20"
    />

    <!-- subtle inner ring (showcase + minimal only) -->
    <div
      v-if="mode !== 'background'"
      class="pointer-events-none absolute inset-0 ring-1 ring-inset ring-border/20"
      aria-hidden="true"
    />

    <!--
      Corner status pill — greptile pattern. Only on showcase mode
      (minimal + background stay clean by design).
    -->
    <div
      v-if="label && mode === 'showcase'"
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

    <!--
      Click-to-play overlay (showcase only). Shown when the user has
      reduced-motion preference OR before the autoplay has actually
      started. Clicking plays the video and dismisses the overlay.
    -->
    <button
      v-if="mode === 'showcase' && (!playing || reducedMotion)"
      type="button"
      @click="toggle"
      :aria-label="`Play ${label || 'video'}`"
      class="absolute inset-0 grid place-items-center bg-bg/20 backdrop-blur-[1px] transition-opacity hover:bg-bg/30"
    >
      <span class="grid h-16 w-16 place-items-center rounded-full border-2 border-paper bg-bg/90 text-text shadow-[var(--shadow-lg)] transition-transform group-hover:scale-110">
        <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M5 3.5v9l8-4.5z" />
        </svg>
      </span>
    </button>

    <!--
      Pause control (showcase only, when playing). Tiny icon button
      in the bottom-right so the user can stop the video without
      hunting for a global control.
    -->
    <button
      v-if="mode === 'showcase' && playing && !reducedMotion"
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
