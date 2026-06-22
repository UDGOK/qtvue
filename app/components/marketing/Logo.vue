<script setup lang="ts">
/**
 * Logo — qtvue brand mark.
 *
 * Design:
 *  - A geometric "Q" (rounded square with a small triangular tail at the
 *    bottom-right). Inside the Q is a small "sensor" dot — the all-seeing
 *    automation eye. The tail doubles as a play/forward chevron.
 *  - Three-tone face shading: light top, mid body, dark right tail.
 *  - Wordmark: clean lowercase "qtvue" with the "v" accented in brand
 *    primary for a subtle, on-brand color signal.
 *
 * Variants:
 *  - wordmark (default) → mark + name
 *  - monogram           → mark only (favicons, dense slots)
 *  - full               → mark + name + "robotics" tag (footer)
 */
withDefaults(
  defineProps<{
    variant?: 'wordmark' | 'monogram' | 'full'
    /** swap the mark's tonal values for use on dark backgrounds */
    inverted?: boolean
  }>(),
  { variant: 'wordmark', inverted: false },
)
</script>

<template>
  <span
    :data-variant="variant"
    class="inline-flex items-center gap-2.5 leading-none"
  >
    <!-- =========================== MARK =========================== -->
    <svg
      width="34"
      height="34"
      viewBox="0 0 40 40"
      aria-hidden="true"
      class="shrink-0"
    >
      <defs>
        <linearGradient id="q-body" x1="0" y1="0" x2="40" y2="40">
          <stop offset="0" stop-color="var(--color-primary)" />
          <stop offset="1" :stop-color="inverted ? 'var(--color-text)' : 'var(--color-primary-600)'" />
        </linearGradient>
      </defs>

      <!-- Outer rounded square (the Q body) -->
      <rect
        x="3"
        y="3"
        width="34"
        height="34"
        rx="9"
        fill="url(#q-body)"
      />

      <!-- Top highlight (lighter face) -->
      <path
        d="M3 12 Q3 3 12 3 L28 3 Q37 3 37 12 L37 14 L3 14 Z"
        :fill="inverted ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.22)'"
        opacity="0.85"
      />

      <!-- Inner cutout ring (the "hole" of the Q) -->
      <circle
        cx="20"
        cy="20"
        r="7.5"
        :fill="inverted ? 'var(--color-text)' : 'var(--color-bg)'"
      />
      <!-- Inner ring stroke -->
      <circle
        cx="20"
        cy="20"
        r="7.5"
        fill="none"
        :stroke="inverted ? 'var(--color-primary)' : 'var(--color-accent)'"
        stroke-width="1.2"
        opacity="0.7"
      />

      <!-- The "sensor" / "eye" dot in the middle -->
      <circle
        cx="20"
        cy="20"
        r="2.4"
        fill="var(--color-accent)"
      />

      <!-- The Q's tail / chevron (bottom-right) -->
      <path
        d="M28 28 L37 37 L30 37 L24 31 Z"
        :fill="inverted ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.28)'"
      />
      <path
        d="M28 28 L37 37 L30 37 L24 31 Z"
        :stroke="inverted ? 'var(--color-primary)' : 'var(--color-accent)'"
        stroke-width="1"
        fill="none"
        opacity="0.6"
      />
    </svg>

    <!-- =========================== WORDMARK =========================== -->
    <span
      v-if="variant !== 'monogram'"
      class="flex items-baseline gap-0 text-[22px] font-extrabold tracking-tight leading-none"
    >
      <span :class="inverted ? 'text-paper' : 'text-text'">qt</span><span class="text-primary">v</span><span :class="inverted ? 'text-paper' : 'text-text'">ue</span>
    </span>
    <span
      v-if="variant === 'full'"
      class="ml-1 font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted"
    >
      robotics
    </span>
  </span>
</template>
