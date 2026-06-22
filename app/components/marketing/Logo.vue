<script setup lang="ts">
/**
 * Logo — qtvue brand mark.
 * Modeled on greptile's logo: a 3D isometric cube/diamond with bright
 * mint/green face shading + a clean lowercase wordmark.
 */
withDefaults(
  defineProps<{
    variant?: 'wordmark' | 'monogram' | 'abstract' | 'full'
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
    <!-- ====================== DIAMOND / CUBE MARK ====================== -->
    <svg
      v-if="variant === 'wordmark' || variant === 'full' || variant === 'monogram'"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      aria-hidden="true"
    >
      <!-- Base hexagon (the "right" face) -->
      <path d="M16 2 L29 9.5 L29 22.5 L16 30 L3 22.5 L3 9.5 Z" fill="var(--color-accent)" />
      <!-- Top face (lighter) -->
      <path
        d="M16 2 L29 9.5 L16 16 L3 9.5 Z"
        fill="color-mix(in srgb, var(--color-accent) 60%, white)"
      />
      <!-- Right face (darker) -->
      <path
        d="M16 16 L29 9.5 L29 22.5 L16 30 Z"
        fill="color-mix(in srgb, var(--color-accent) 70%, var(--color-text))"
      />
    </svg>

    <!-- ====================== ABSTRACT ================================ -->
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

    <!-- ====================== WORDMARK ================================ -->
    <span
      v-if="variant !== 'monogram'"
      class="text-[22px] font-extrabold tracking-tight leading-none"
    >
      <span :class="inverted ? 'text-paper' : 'text-text'">qtvue</span>
    </span>
    <span
      v-if="variant === 'full'"
      class="ml-1 font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted"
    >
      robotics
    </span>
  </span>
</template>
