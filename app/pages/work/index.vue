<script setup lang="ts">
const { data: work } = await useAsyncData('work-index', () =>
  queryCollection('work').order('year', 'DESC').all(),
)
useSeoMeta({ title: 'Work — qtvue', description: 'Selected robotics projects.' })
</script>

<template>
  <Section eyebrow="Work" heading="Selected projects">
    <p v-if="!work?.length" class="text-text-secondary">Case studies coming soon.</p>
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink v-for="w in work" :key="w.path" :to="w.path">
        <Card>
          <Media :src="w.image" alt="" decorative ratio="16/9" />
          <h3 class="mt-4 font-semibold">{{ w.title }}</h3>
          <p class="mt-1 text-sm text-text-secondary">{{ w.summary }}</p>
          <div v-if="w.metrics?.length" class="mt-4 flex gap-6">
            <Stat v-for="m in w.metrics" :key="m.label" :value="m.value" :label="m.label" />
          </div>
        </Card>
      </NuxtLink>
    </div>
  </Section>
</template>
