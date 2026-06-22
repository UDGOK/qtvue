<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{ error: NuxtError }>()

function home() {
  return clearError({ redirect: '/' })
}
</script>

<template>
  <div>
    <section class="relative border-b border-border bg-bg">
      <Container class="grid min-h-[60vh] place-items-center py-20 text-center">
        <Reveal>
          <p class="eyebrow">Error</p>
          <h1 class="display-xl mt-4">
            <span class="hl">{{ error.statusCode }}</span>
          </h1>
          <p class="mt-4 text-lg text-text-secondary">
            {{ error.statusCode === 404 ? "We couldn't find that page." : 'Something went wrong.' }}
          </p>
          <div class="mt-8 flex justify-center">
            <Btn @click="home" variant="primary" size="lg" arrow>Back home</Btn>
          </div>
        </Reveal>
      </Container>
    </section>
  </div>
</template>
