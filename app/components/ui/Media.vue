<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    src: string
    alt?: string
    ratio?: string // e.g. '16/9'
    decorative?: boolean
  }>(),
  { alt: '', decorative: false, ratio: '16/9' },
)
const altText = props.decorative ? '' : props.alt
const aspectStyle = props.ratio ? { aspectRatio: props.ratio } : {}
</script>

<template>
  <div class="overflow-hidden rounded-lg bg-surface" :style="aspectStyle">
    <img :src="src" :alt="altText" loading="lazy" class="h-full w-full object-cover" />
  </div>
</template>
