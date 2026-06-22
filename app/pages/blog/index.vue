<script setup lang="ts">
import { stemToRoute } from '~/utils/content'

const { data: posts } = await useAsyncData('blog-index', () =>
  queryCollection('blog').order('date', 'DESC').all(),
)
useSeoMeta({ title: 'Blog — qtvue', description: 'Articles on robotics and automation.' })
</script>

<template>
  <Section eyebrow="Blog" heading="Notes on robotics & automation">
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink v-for="p in posts" :key="p.path" :to="stemToRoute(p.stem)">
        <Card>
          <time class="text-xs font-mono text-text-secondary">{{ p.date }}</time>
          <h3 class="mt-2 font-semibold">{{ p.title }}</h3>
          <p class="mt-1 text-sm text-text-secondary">{{ p.summary }}</p>
        </Card>
      </NuxtLink>
    </div>
  </Section>
</template>
