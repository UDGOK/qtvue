<script setup lang="ts">
/**
 * Logo — qtvue brand mark.
 * - "wordmark"  → the main brand: small gecko-style halftone mark + name
 *                 (greptile-style horizontal lockup, "qtvue" set in display
 *                 weight with one letter accented in limelight)
 * - "monogram"  → the Q monogram for favicons / dense slots
 * - "abstract"  → the abstract robot-arm mark
 * - "full"      → wordmark + tagline, used in the footer
 */
withDefaults(
  defineProps<{
    variant?: 'wordmark' | 'monogram' | 'abstract' | 'full'
    /** swap inks for use on dark backgrounds */
    inverted?: boolean
  }>(),
  { variant: 'wordmark', inverted: false },
)
</script>

<template>
  <span
    :data-variant="variant"
    class="inline-flex items-center gap-2.5 font-semibold leading-none"
  >
    <!-- ====================== WORDMARK =========================== -->
    <svg
      v-if="variant === 'wordmark' || variant === 'full'"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      aria-hidden="true"
    >
      <defs>
        <pattern id="logo-halftone" x="0" y="0" width="3" height="3" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="0.9" :fill="inverted ? 'var(--color-paper)' : 'var(--color-ink)'" />
        </pattern>
      </defs>
      <!-- background tile -->
      <rect
        x="0.5"
        y="0.5"
        width="31"
        height="31"
        rx="8"
        :fill="inverted ? 'var(--color-ink)' : 'var(--color-primary)'"
      />
      <!-- halftone robotic arm silhouette -->
      <g transform="translate(6 22)">
        <rect x="0" y="0" width="20" height="3" rx="1" fill="url(#logo-halftone)" />
        <rect x="8" y="-12" width="4" height="14" rx="1" fill="url(#logo-halftone)" />
        <circle cx="10" cy="-12" r="3.5" fill="url(#logo-halftone)" />
        <rect
          x="9"
          y="-21"
          width="4"
          height="10"
          rx="1"
          fill="url(#logo-halftone)"
          transform="rotate(-22 11 -16)"
        />
        <circle cx="4.5" cy="-19" r="3" fill="url(#logo-halftone)" />
        <rect
          x="3"
          y="-26"
          width="4"
          height="7"
          rx="1"
          fill="url(#logo-halftone)"
          transform="rotate(15 5 -22.5)"
        />
      </g>
      <!-- glowing joint accent -->
      <circle cx="16" cy="10" r="1.6" :fill="inverted ? 'var(--color-paper)' : 'var(--color-accent)'" />
    </svg>

    <!-- ====================== MONOGRAM =========================== -->
    <svg v-else-if="variant === 'monogram'" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id="q-grad" x1="0" y1="0" x2="32" y2="32">
          <stop offset="0" :stop-color="inverted ? 'var(--color-paper)' : 'var(--color-primary)'" />
          <stop offset="1" stop-color="var(--color-accent)" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#q-grad)" />
      <text
        x="16"
        y="23"
        text-anchor="middle"
        font-family="var(--font-display)"
        font-size="18"
        font-weight="800"
        :fill="inverted ? 'var(--color-ink)' : 'var(--color-paper)'"
      >Q</text>
    </svg>

    <!-- ====================== ABSTRACT =========================== -->
    <svg v-else width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
      <path
        d="M4 8 L16 2 L28 8 L28 18 L16 30 L4 18 Z"
        fill="none"
        :stroke="inverted ? 'var(--color-paper)' : 'var(--color-primary)'"
        stroke-width="2"
        stroke-linejoin="round"
      />
      <circle cx="16" cy="14" r="3.5" fill="var(--color-accent)" />
    </svg>

    <span class="flex items-baseline gap-0.5 text-xl font-extrabold tracking-tight">
      <span :class="inverted ? 'text-paper' : 'text-text'">qt</span><span class="text-primary">v</span><span :class="inverted ? 'text-paper' : 'text-text'">ue</span>
    </span>
    <span
      v-if="variant === 'full'"
      class="ml-1 font-mono text-[10px] uppercase tracking-widest text-text-muted"
    >
      robotics
    </span>
  </span>
</template>
