<script setup lang="ts">
import { stemToRoute } from '~/utils/content'

const { data: industries } = await useAsyncData('industries-index', () =>
  queryCollection('industries').order('order', 'ASC').all(),
)
useSeoMeta({ title: 'Industries — qtvue', description: 'Industries we serve.' })
</script>

<template>
  <Section eyebrow="Industries" heading="Where we work">
    <div class="grid gap-6 sm:grid-cols-3">
      <NuxtLink v-for="i in industries" :key="i.path" :to="stemToRoute(i.stem)">
        <Card>
          <h3 class="text-lg font-semibold">{{ i.title }}</h3>
          <p class="mt-2 text-sm text-text-secondary">{{ i.summary }}</p>
        </Card>
      </NuxtLink>
    </div>
  </Section>
</template>
