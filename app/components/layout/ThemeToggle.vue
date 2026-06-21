<script setup lang="ts">
import { useTheme } from '~/composables/useTheme'

const { isDark, toggle } = useTheme()
</script>

<template>
  <button
    type="button"
    class="rounded-lg p-2 text-text hover:bg-surface"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    @click="toggle"
  >
    <Icon :name="isDark ? 'Sun' : 'Moon'" :size="18" />
  </button>
</template>
