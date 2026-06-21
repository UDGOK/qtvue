<script setup lang="ts">
const { data: services } = await useAsyncData('services-index', () =>
  queryCollection('services').order('order', 'ASC').all(),
)
useSeoMeta({
  title: 'Services — qtvue',
  description: 'Robotics integration, programming, sales, and consulting services.',
})
</script>

<template>
  <Section eyebrow="Services" heading="Everything you need to automate">
    <div class="grid gap-6 sm:grid-cols-2">
      <NuxtLink v-for="s in services" :key="s.path" :to="s.path">
        <Card>
          <div class="flex items-center gap-3">
            <Icon :name="s.icon" :size="24" />
            <h3 class="text-lg font-semibold">{{ s.title }}</h3>
          </div>
          <p class="mt-3 text-text-secondary">{{ s.summary }}</p>
        </Card>
      </NuxtLink>
    </div>
  </Section>
</template>
