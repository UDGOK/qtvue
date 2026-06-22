<script setup lang="ts">
/**
 * Highlight — a chunky display heading with one "spotlight" word rendered
 * in the brand color. Greptile uses this on the hero: e.g. "The AI Code
 * Reviewer" — the word "Code" gets the green color. We make the highlight
 * wrap optional via slot.
 */
defineProps<{
  /** main heading text — wrap the highlight word in <span class="hl">…</span> */
  text: string
  level?: '1' | '2' | '3'
}>()
</script>

<template>
  <h1
    :class="[level === '1' ? 'display-xl' : 'display-lg']"
  >
    <span v-html="text" />
  </h1>
</template>

<style scoped>
:deep(.hl) {
  color: var(--color-primary);
  position: relative;
  display: inline-block;
}
:deep(.hl::after) {
  content: '';
  position: absolute;
  left: -0.05em;
  right: -0.05em;
  bottom: 0.05em;
  height: 0.32em;
  background: color-mix(in srgb, var(--color-accent) 30%, transparent);
  z-index: -1;
  border-radius: 4px;
}
</style>
