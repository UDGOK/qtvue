<script setup lang="ts">
/**
 * VideoGallery — a 2- or 3-column grid of autoplaying demo videos.
 * Greptile-style: no controls, muted loop, dashed-border frames,
 * monospace caption underneath each clip. Used on the Go2 page to
 * show the platform in different environments.
 *
 * Every video gets the same 'showcase' mode and 'forest' tint
 * treatment, so the gallery reads as one continuous design system.
 */

interface Clip {
  label: string
  src: string
  poster?: string
  caption?: string
}
defineProps<{
  clips: Clip[]
  /** Optional eyebrow + heading shown above the grid */
  eyebrow?: string
  heading?: string
  intro?: string
}>()
</script>

<template>
  <div class="not-prose">
    <header v-if="eyebrow || heading || intro" class="mb-10">
      <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
      <h2 v-if="heading" class="display-md mt-3 max-w-3xl">{{ heading }}</h2>
      <p v-if="intro" class="mt-4 max-w-2xl text-text-secondary">{{ intro }}</p>
    </header>

    <ul class="grid gap-6 md:grid-cols-2">
      <Reveal
        v-for="(clip, i) in clips"
        :key="clip.src"
        :delay="i * 80"
        as="li"
      >
        <div class="flex flex-col">
          <DemoVideo
            :src="clip.src"
            :poster="clip.poster"
            mode="showcase"
            tint="forest"
            aspect="16/9"
            :label="`live · ${clip.label}`"
          />
          <div class="mt-3 flex items-baseline justify-between gap-4">
            <p class="text-sm font-semibold text-text">{{ clip.label }}</p>
            <p
              v-if="clip.caption"
              class="font-mono text-[10px] uppercase tracking-widest text-text-muted"
            >
              {{ clip.caption }}
            </p>
          </div>
        </div>
      </Reveal>
    </ul>
  </div>
</template>
