<script setup lang="ts">
import { computed } from 'vue'

/**
 * Section — greptile-style section wrapper.
 * - mono uppercase eyebrow
 * - chunky display heading with optional highlight word via slot
 * - optional bleed (no container max) for full-width visuals
 */
const props = withDefaults(
  defineProps<{
    eyebrow?: string
    heading?: string
    level?: '1' | '2' | '3'
    /** tight removes default vertical padding for inline sections */
    bleed?: boolean
    /** tone: paper (default) | ink (dark) | surface (warm) */
    tone?: 'paper' | 'ink' | 'surface'
  }>(),
  { level: '2', bleed: false, tone: 'paper' },
)

const headingTag = computed(() => `h${props.level}`)
</script>

<template>
  <section
    :class="[
      'relative',
      tone === 'ink' && 'bg-ink-bg text-ink-text',
      tone === 'paper' && 'bg-bg text-text',
      tone === 'surface' && 'bg-surface text-text',
      bleed ? '' : 'py-20 sm:py-28',
    ]"
  >
    <Container :bleed="bleed">
      <div v-if="eyebrow || heading || $slots.eyebrow || $slots.heading" class="mb-10 max-w-3xl">
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <slot name="eyebrow" />
        <component
          :is="headingTag"
          v-if="heading"
          :class="[
            'mt-3',
            level === '1' ? 'display-md' : 'display-md',
          ]"
        >
          <slot name="heading">{{ heading }}</slot>
        </component>
      </div>
      <slot />
    </Container>
  </section>
</template>
