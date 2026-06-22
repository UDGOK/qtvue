<script setup lang="ts">
/**
 * LogoCloud — greptile-style 2-row logo grid with eyebrow + linked CTA.
 * Logos are placeholder wordmarks styled to feel like real brand marks.
 */
defineProps<{
  eyebrow?: string
  cta?: string
  ctaHref?: string
}>()
</script>

<template>
  <section class="border-y border-border bg-bg py-12">
    <Container>
      <div class="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p v-if="eyebrow" class="eyebrow text-center sm:text-left">{{ eyebrow }}</p>
        <NuxtLink
          v-if="cta"
          :to="ctaHref ?? '#'"
          class="font-mono text-xs uppercase tracking-wider text-text-secondary hover:text-primary"
        >
          {{ cta }} <span aria-hidden="true">→</span>
        </NuxtLink>
      </div>
      <div class="grid grid-cols-2 items-center gap-6 sm:grid-cols-3 md:grid-cols-5">
        <slot />
      </div>
    </Container>
  </section>
</template>
