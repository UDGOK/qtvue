<script setup lang="ts">
defineProps<{
  eyebrow?: string
  heading?: string
}>()
</script>

<template>
  <section class="py-16 sm:py-24">
    <Container>
      <div v-if="eyebrow || heading" class="mb-10 max-w-2xl">
        <p v-if="eyebrow" class="font-mono text-sm uppercase tracking-wider text-primary">
          {{ eyebrow }}
        </p>
        <h2 v-if="heading" class="mt-2 text-3xl font-bold sm:text-4xl">{{ heading }}</h2>
      </div>
      <slot />
    </Container>
  </section>
</template>
