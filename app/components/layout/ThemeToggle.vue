<script setup lang="ts">
import { useThemeWithLifecycle } from '~/composables/useTheme'

const { isDark, toggle } = useThemeWithLifecycle()
</script>

<template>
  <button
    type="button"
    class="grid h-9 w-9 place-items-center rounded-full border border-border text-text-secondary transition-all hover:border-primary hover:text-primary"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    :aria-pressed="isDark"
    @click="toggle"
  >
    <!-- sun (shown in dark mode → click to go light) -->
    <svg
      v-if="isDark"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="3" stroke="currentColor" stroke-width="1.4" />
      <g stroke="currentColor" stroke-width="1.4" stroke-linecap="round">
        <line x1="8" y1="1.5" x2="8" y2="3" />
        <line x1="8" y1="13" x2="8" y2="14.5" />
        <line x1="1.5" y1="8" x2="3" y2="8" />
        <line x1="13" y1="8" x2="14.5" y2="8" />
        <line x1="3.2" y1="3.2" x2="4.3" y2="4.3" />
        <line x1="11.7" y1="11.7" x2="12.8" y2="12.8" />
        <line x1="3.2" y1="12.8" x2="4.3" y2="11.7" />
        <line x1="11.7" y1="4.3" x2="12.8" y2="3.2" />
      </g>
    </svg>
    <!-- moon (shown in light mode → click to go dark) -->
    <svg
      v-else
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M14 9.5A6 6 0 0 1 6.5 2a.5.5 0 0 0-.8-.4A7 7 0 1 0 14.4 10.3a.5.5 0 0 0-.4-.8z"
        fill="currentColor"
      />
    </svg>
  </button>
</template>
