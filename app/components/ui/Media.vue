<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    src?: string
    alt?: string
    ratio?: string
    decorative?: boolean
    /** if no src, render a halftone placeholder */
    placeholder?: 'arm' | 'head' | 'grid'
  }>(),
  { alt: '', decorative: false, ratio: '16/9', placeholder: 'arm' },
)
const altText = props.decorative ? '' : props.alt
const aspectStyle = props.ratio ? { aspectRatio: props.ratio } : {}

const loaded = ref(false)
const failed = ref(false)
function onLoad() { loaded.value = true }
function onError() { failed.value = true }
</script>

<template>
  <div
    class="relative overflow-hidden rounded-2xl border border-border bg-surface-2"
    :style="aspectStyle"
  >
    <!-- placeholder / fallback -->
    <div
      v-if="!src || failed"
      class="absolute inset-0 grid place-items-center halftone-bg"
    >
      <div class="h-3/4 w-3/4">
        <RobotMascot :variant="placeholder" />
      </div>
    </div>
    <img
      v-if="src && !failed"
      :src="src"
      :alt="altText"
      loading="lazy"
      class="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
      :class="loaded ? 'opacity-100' : 'opacity-0'"
      @load="onLoad"
      @error="onError"
    />
    <!-- subtle gradient overlay for depth -->
    <div
      class="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-paper/20 mix-blend-overlay"
      aria-hidden="true"
    />
  </div>
</template>
