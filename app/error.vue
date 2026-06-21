<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{ error: NuxtError }>()
</script>

<template>
  <NuxtLayout>
    <Section :heading="`${error.statusCode}`" eyebrow="Error">
      <p class="text-text-secondary">
        {{ error.statusCode === 404 ? "We couldn't find that page." : 'Something went wrong.' }}
      </p>
      <div class="mt-6">
        <Btn href="/">Back home</Btn>
      </div>
    </Section>
  </NuxtLayout>
</template>
