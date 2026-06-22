<script setup lang="ts">
/**
 * RobotMascot — halftone SVG illustration of a stylized robotic arm.
 * Greptile-style: a creature/object rendered with a dot pattern
 * (here we use radial-gradient halftone via SVG pattern + solid silhouettes).
 *
 * Variant "arm"  → 6-axis industrial robot arm
 * Variant "head" → robot head (for use in small slots, footer, etc.)
 */
withDefaults(
  defineProps<{
    variant?: 'arm' | 'head' | 'arm-large'
    /** dark variant swaps the ink color for paper */
    inverted?: boolean
  }>(),
  { variant: 'arm', inverted: false },
)
</script>

<template>
  <!-- ============================================================ ARM -->
  <svg
    v-if="variant === 'arm' || variant === 'arm-large'"
    viewBox="0 0 400 400"
    class="h-full w-full"
    aria-hidden="true"
    preserveAspectRatio="xMidYMid meet"
  >
    <defs>
      <!-- halftone dot pattern that fades from dense to sparse -->
      <pattern
        id="halftone-dense"
        x="0"
        y="0"
        width="4"
        height="4"
        patternUnits="userSpaceOnUse"
      >
        <circle cx="2" cy="2" r="1.4" :fill="inverted ? 'var(--color-paper)' : 'var(--color-ink)'" />
      </pattern>
      <pattern
        id="halftone-mid"
        x="0"
        y="0"
        width="6"
        height="6"
        patternUnits="userSpaceOnUse"
      >
        <circle cx="3" cy="3" r="1.4" :fill="inverted ? 'var(--color-paper)' : 'var(--color-ink)'" />
      </pattern>
      <pattern
        id="halftone-sparse"
        x="0"
        y="0"
        width="9"
        height="9"
        patternUnits="userSpaceOnUse"
      >
        <circle cx="4.5" cy="4.5" r="1.3" :fill="inverted ? 'var(--color-paper)' : 'var(--color-ink)'" />
      </pattern>
      <!-- gradient masks: dense in highlights, sparse in shadow -->
      <linearGradient id="fade-arm" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="white" stop-opacity="0.95" />
        <stop offset="100%" stop-color="white" stop-opacity="0.45" />
      </linearGradient>
      <mask id="arm-mask">
        <rect width="400" height="400" fill="black" />
        <!-- filled silhouette of the arm to mask the halftone -->
        <g transform="translate(200 320)">
          <ellipse cx="0" cy="0" rx="90" ry="20" fill="white" />
          <rect x="-20" y="-90" width="40" height="90" fill="white" />
          <circle cx="0" cy="-95" r="35" fill="white" />
          <rect x="-15" y="-220" width="30" height="130" rx="8" fill="white" transform="rotate(-25 0 -130)" />
          <circle cx="-30" cy="-200" r="28" fill="white" />
          <rect x="-15" y="-310" width="30" height="130" rx="8" fill="white" transform="rotate(15 -30 -250)" />
          <circle cx="-15" cy="-310" r="24" fill="white" />
          <rect x="-15" y="-360" width="30" height="60" rx="6" fill="white" transform="rotate(15 -15 -340)" />
        </g>
      </mask>
    </defs>

    <!-- halftone fill of the arm silhouette -->
    <rect width="400" height="400" fill="url(#halftone-sparse)" mask="url(#arm-mask)" />
    <g mask="url(#arm-mask)">
      <rect width="400" height="400" fill="url(#halftone-dense)" opacity="0.9" />
    </g>

    <!-- outline edges on top for definition -->
    <g
      :stroke="inverted ? 'var(--color-paper)' : 'var(--color-ink)'"
      stroke-width="1.4"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <ellipse cx="200" cy="320" rx="90" ry="20" />
      <rect x="180" y="230" width="40" height="90" />
      <circle cx="200" cy="225" r="35" />
      <rect
        x="185"
        y="100"
        width="30"
        height="130"
        rx="8"
        transform="rotate(-25 200 100)"
      />
      <circle cx="170" cy="120" r="28" />
      <rect
        x="185"
        y="10"
        width="30"
        height="130"
        rx="8"
        transform="rotate(15 185 10)"
      />
      <circle cx="185" cy="10" r="24" />
    </g>

    <!-- glowing accent joint (the "eye" of the arm) -->
    <circle cx="200" cy="225" r="9" :fill="inverted ? 'var(--color-paper)' : 'var(--color-accent)'" />
    <circle cx="200" cy="225" r="14" fill="none" :stroke="inverted ? 'var(--color-paper)' : 'var(--color-accent)'" stroke-width="1.5" opacity="0.5" />
    <circle cx="170" cy="120" r="5" :fill="inverted ? 'var(--color-paper)' : 'var(--color-accent)'" opacity="0.85" />
    <circle cx="185" cy="10" r="4" :fill="inverted ? 'var(--color-paper)' : 'var(--color-accent)'" opacity="0.85" />

    <!-- base ground line -->
    <line
      x1="60"
      y1="345"
      x2="340"
      y2="345"
      :stroke="inverted ? 'var(--color-paper)' : 'var(--color-ink)'"
      stroke-width="1.2"
      stroke-dasharray="3 4"
      opacity="0.5"
    />
  </svg>

  <!-- ============================================================ HEAD -->
  <svg
    v-else
    viewBox="0 0 200 200"
    class="h-full w-full"
    aria-hidden="true"
  >
    <defs>
      <pattern id="halftone-head" x="0" y="0" width="5" height="5" patternUnits="userSpaceOnUse">
        <circle cx="2.5" cy="2.5" r="1.2" :fill="inverted ? 'var(--color-paper)' : 'var(--color-ink)'" />
      </pattern>
      <mask id="head-mask">
        <rect width="200" height="200" fill="black" />
        <rect x="40" y="35" width="120" height="120" rx="22" fill="white" />
        <rect x="60" y="155" width="80" height="20" rx="6" fill="white" />
        <rect x="80" y="175" width="40" height="14" fill="white" />
        <circle cx="80" cy="90" r="14" fill="black" />
        <circle cx="120" cy="90" r="14" fill="black" />
      </mask>
    </defs>
    <rect width="200" height="200" fill="url(#halftone-head)" mask="url(#head-mask)" />
    <g
      :stroke="inverted ? 'var(--color-paper)' : 'var(--color-ink)'"
      stroke-width="1.2"
      fill="none"
    >
      <rect x="40" y="35" width="120" height="120" rx="22" />
      <rect x="60" y="155" width="80" height="20" rx="6" />
      <line x1="100" y1="110" x2="100" y2="130" />
      <line x1="80" y1="120" x2="120" y2="120" />
    </g>
    <circle cx="80" cy="90" r="4" :fill="inverted ? 'var(--color-paper)' : 'var(--color-accent)'" />
    <circle cx="120" cy="90" r="4" :fill="inverted ? 'var(--color-paper)' : 'var(--color-accent)'" />
  </svg>
</template>
