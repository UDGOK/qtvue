<script setup lang="ts">
import { stemToRoute } from '~/utils/content'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { data: industry } = await useAsyncData(`industry-${slug.value}`, () =>
  queryCollection('industries').where('stem', '=', `en/industries/${slug.value}`).first(),
)
if (!industry.value) throw createError({ statusCode: 404, fatal: true })

const { data: work } = await useAsyncData(`industry-${slug.value}-work`, () =>
  queryCollection('work').where('industry', '=', slug.value).all(),
)

useSeoMeta({
  title: () => `${industry.value?.title} — qtvue`,
  description: () => industry.value?.summary ?? '',
})
</script>

<template>
  <Section :heading="industry?.title" eyebrow="Industries" level="1">
    <ContentRenderer :value="industry" class="prose max-w-none" />
    <div v-if="work?.length" class="mt-12">
      <h3 class="mb-4 text-xl font-semibold">Related work</h3>
      <div class="grid gap-6 sm:grid-cols-3">
        <NuxtLink v-for="w in work" :key="w.path" :to="stemToRoute(w.stem)">
          <Card>
            <h4 class="font-medium">{{ w.title }}</h4>
            <p class="mt-1 text-sm text-text-secondary">{{ w.summary }}</p>
          </Card>
        </NuxtLink>
      </div>
    </div>
  </Section>
</template>
