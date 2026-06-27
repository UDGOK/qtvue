<script setup lang="ts">
/**
 * DemoVideo — greptile-style demo video, hardened for iOS Safari.
 *
 * Why this component looks the way it does
 * ---------------------------------------
 * iOS Safari has three behaviors that bite every Nuxt video integration:
 *
 *  1. Autoplay only works if the `autoplay` attribute is in the parsed
 *     HTML. Setting it via JS after mount is too late — iOS has
 *     already decided not to autoplay. So this component always
 *     renders `autoplay` in the static markup and uses JS only to
 *     call play() / pause() / fallback for reduced-motion.
 *  2. The default behavior for `<video autoplay>` on iOS is to hijack
 *     the viewport with a fullscreen player. `playsinline` prevents
 *     that. Older iOS needs the `webkit-` prefix; modern iOS reads
 *     the unprefixed attribute. Both are emitted.
 *  3. iOS is strict about muted autoplay policies: muted + autoplay +
 *     playsinline is allowed without user interaction. So all
 *     three are present on the static element.
 *
 * Modes
 * -----
 *  - 'showcase'  (default) — full UI: dashed frame, status pill,
 *              play/pause, pause control. Used on platform pages.
 *  - 'minimal'   — dashed frame + caption only, no controls.
 *  - 'background' — no frame, no pill, no controls. Used behind
 *              hero copy and full-bleed sections. The wrapper
 *              still gets `position: relative` so the absolute
 *              video is anchored correctly.
 *
 * Behaviors (all modes)
 * --------------------
 *  - muted, autoplay, loop, playsinline (in static HTML — see
 *    the iOS note above)
 *  - preload='metadata' so the browser fetches just enough to
 *    know the duration without pulling the whole file
 *  - respects prefers-reduced-motion: on mount, we immediately
 *    pause and show a click-to-play overlay
 *  - SSR-safe: the JS pause-on-mount runs only on the client,
 *    after onMounted. SSR is a clean, simple <video> with all
 *    the iOS-required attributes present.
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
const reducedMotion = ref(false)
const wantsPlay = ref(true)
const mounted = ref(false)

onMounted(() => {
  mounted.value = true
  reducedMotion.value = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  if (reducedMotion.value) wantsPlay.value = false

  const v = videoEl.value
  if (!v) return

  // iOS-friendly: the markup already has `autoplay` (so iOS tries
  // to play). If the user has reduced-motion preference, we
  // immediately pause and show the click-to-play overlay.
  if (wantsPlay.value) {
    // .play() returns a Promise that rejects on iOS if not muted
    // or if the source isn't ready. We catch the rejection
    // silently — the user just sees a paused video.
    const result = v.play()
    if (result && typeof result.then === 'function') {
      result.then(() => { playing.value = true })
            .catch(() => { playing.value = false })
    } else {
      playing.value = !v.paused
    }
  } else {
    v.pause()
    playing.value = false
  }
})

function toggle() {
  const v = videoEl.value
  if (!v) return
  if (v.paused) {
    v.play().catch(() => { /* autoplay blocked */ })
    playing.value = true
  } else {
    v.pause()
    playing.value = false
  }
}
function onPlay()  { playing.value = true }
function onPause() { playing.value = false }
</script>

<template>
  <div
    :class="[
      mode === 'background'
        ? 'absolute inset-0'
        : 'relative overflow-hidden rounded-none border border-dashed border-border bg-surface',
    ]"
    :style="mode !== 'background' ? { aspectRatio: aspect } : {}"
  >
    <video
      ref="videoEl"
      :src="src"
      :poster="poster"
      muted
      autoplay
      loop
      playsinline
      webkit-playsinline
      preload="metadata"
      :class="mode === 'background' ? 'h-full w-full object-cover' : 'absolute inset-0 h-full w-full object-cover'"
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
      Corner status pill — greptile pattern. Only on showcase mode.
    -->
    <div
      v-if="label && mode === 'showcase'"
      class="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-none border border-border bg-bg/85 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-text-secondary backdrop-blur"
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
      This is the universal fallback for every mobile browser that
      refuses to autoplay — iOS, Android Chrome with strict policies,
      Firefox on Android, etc.
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
