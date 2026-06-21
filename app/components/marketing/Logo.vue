<script setup lang="ts">
withDefaults(defineProps<{ variant?: 'wordmark' | 'monogram' | 'abstract' }>(), {
  variant: 'wordmark',
})
</script>

<template>
  <span :data-variant="variant" class="inline-flex items-center gap-2 font-semibold">
    <!-- Variant 1: wordmark with node mark -->
    <svg
      v-if="variant === 'wordmark'"
      width="28"
      height="28"
      viewBox="0 0 28 28"
      aria-hidden="true"
    >
      <rect width="28" height="28" rx="7" fill="var(--color-primary)" />
      <circle cx="14" cy="14" r="5" fill="white" />
      <circle cx="14" cy="14" r="2" fill="var(--color-primary)" />
    </svg>

    <!-- Variant 2: monogram Q -->
    <svg
      v-else-if="variant === 'monogram'"
      width="28"
      height="28"
      viewBox="0 0 28 28"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="qg" x1="0" y1="0" x2="28" y2="28">
          <stop offset="0" stop-color="var(--color-primary)" />
          <stop offset="1" stop-color="var(--color-accent)" />
        </linearGradient>
      </defs>
      <rect width="28" height="28" rx="7" fill="url(#qg)" />
      <text
        x="14"
        y="20"
        text-anchor="middle"
        font-family="var(--font-sans)"
        font-size="16"
        font-weight="700"
        fill="white"
      >
        Q
      </text>
    </svg>

    <!-- Variant 3: abstract gripper -->
    <svg v-else width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
      <path
        d="M4 8 L14 4 L24 8 L24 16 L14 24 L4 16 Z"
        fill="none"
        stroke="var(--color-primary)"
        stroke-width="2"
      />
      <circle cx="14" cy="13" r="3" fill="var(--color-accent)" />
    </svg>

    <span class="text-lg tracking-tight">qtvue</span>
  </span>
</template>
