<script setup lang="ts">
/**
 * SectionDivider — premium section break with mono label and tick marks.
 * Greptile style: thin line with a small mono label sitting in the middle,
 * and tick marks for that "technical" feel.
 */
defineProps<{
  label?: string
}>()
</script>

<template>
  <div class="relative flex items-center gap-3 py-2" role="separator">
    <span class="h-px flex-1 bg-border" />
    <span v-if="label" class="font-mono text-[10px] uppercase tracking-[0.3em] text-text-muted">
      {{ label }}
    </span>
    <span class="h-px flex-1 bg-border" />
  </div>
</template>
