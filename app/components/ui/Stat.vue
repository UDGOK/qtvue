<script setup lang="ts">
defineProps<{ value: string; label: string }>()
</script>

<template>
  <div>
    <div class="text-3xl font-bold text-primary sm:text-4xl">{{ value }}</div>
    <div class="mt-1 text-sm text-text-secondary">{{ label }}</div>
  </div>
</template>
