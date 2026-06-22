<script setup lang="ts">
defineProps<{ value: string; label: string; sub?: string }>()
</script>

<template>
  <div>
    <!-- value inherits the section's text color (text-paper in dark/ink,
         text-text in light/paper) so it stays readable in both contexts -->
    <div
      class="font-display text-5xl font-extrabold leading-none tracking-tight text-current sm:text-6xl"
    >
      {{ value }}
    </div>
    <div class="mt-3 text-sm text-text-secondary">{{ label }}</div>
    <div v-if="sub" class="mt-1 font-mono text-xs text-text-muted">{{ sub }}</div>
  </div>
</template>
