<script setup lang="ts">
/**
 * LogoMark — stylized wordmark used in the logo cloud.
 * Solid, monochrome, sized for the cloud.
 */
defineProps<{
  name: string
  /** add a small icon-shape prefix to vary the cloud */
  shape?: 'square' | 'circle' | 'diamond' | 'triangle' | 'bars'
}>()
</script>

<template>
  <div
    class="flex items-center justify-center gap-2 grayscale opacity-60 transition-all duration-300 hover:opacity-100 hover:grayscale-0"
  >
    <svg v-if="shape === 'square'" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <rect x="2" y="2" width="12" height="12" rx="2" fill="currentColor" />
    </svg>
    <svg v-else-if="shape === 'circle'" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="6" fill="currentColor" />
    </svg>
    <svg v-else-if="shape === 'diamond'" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 1 L15 8 L8 15 L1 8 Z" fill="currentColor" />
    </svg>
    <svg v-else-if="shape === 'triangle'" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 2 L14 13 L2 13 Z" fill="currentColor" />
    </svg>
    <svg v-else-if="shape === 'bars'" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <rect x="2" y="3" width="2" height="10" fill="currentColor" />
      <rect x="7" y="6" width="2" height="7" fill="currentColor" />
      <rect x="12" y="9" width="2" height="4" fill="currentColor" />
    </svg>
    <span class="text-base font-semibold tracking-tight text-text">{{ name }}</span>
  </div>
</template>
