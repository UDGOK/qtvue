<script setup lang="ts">
import { computed } from 'vue'

// `level` controls which heading element renders the `heading` prop, so pages
// can use <h1> (detail pages) or <h2> (section headings) as appropriate for
// document outline / accessibility. Defaults to h2 (section-level).
const props = withDefaults(
  defineProps<{
    eyebrow?: string
    heading?: string
    level?: '1' | '2' | '3'
  }>(),
  { level: '2' },
)

const headingTag = computed(() => `h${props.level}`)
</script>

<template>
  <section class="py-16 sm:py-24">
    <Container>
      <div v-if="eyebrow || heading" class="mb-10 max-w-2xl">
        <p v-if="eyebrow" class="font-mono text-sm uppercase tracking-wider text-primary">
          {{ eyebrow }}
        </p>
        <component :is="headingTag" v-if="heading" class="mt-2 text-3xl font-bold sm:text-4xl">
          {{ heading }}
        </component>
      </div>
      <slot />
    </Container>
  </section>
</template>
