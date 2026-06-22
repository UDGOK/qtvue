<script setup lang="ts">
import { stemToRoute } from '~/utils/content'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

// Content paths include the locale prefix (/en/services/integration), so query
// by stem (locale-stable: 'en/services/integration') instead of path.
const { data: service } = await useAsyncData(`service-${slug.value}`, () =>
  queryCollection('services').where('stem', '=', `en/services/${slug.value}`).first(),
)

if (!service.value) {
  throw createError({ statusCode: 404, statusMessage: 'Service not found', fatal: true })
}

const { data: related } = await useAsyncData(`service-${slug.value}-work`, () =>
  queryCollection('work').where('services', 'LIKE', `%"${slug.value}"%`).limit(3).all(),
)

useSeoMeta({
  title: () => `${service.value?.title} — qtvue`,
  description: () => service.value?.summary ?? '',
})
</script>

<template>
  <article v-if="service">
    <Section eyebrow="Services" :heading="service.title" level="1">
      <ContentRenderer :value="service" class="prose max-w-none text-text" />
      <div v-if="related?.length" class="mt-12">
        <h3 class="mb-4 text-xl font-semibold">Related work</h3>
        <div class="grid gap-6 sm:grid-cols-3">
          <NuxtLink v-for="w in related" :key="w.path" :to="stemToRoute(w.stem)">
            <Card>
              <Media :src="w.image" alt="" decorative ratio="16/9" />
              <h4 class="mt-3 font-medium">{{ w.title }}</h4>
            </Card>
          </NuxtLink>
        </div>
      </div>
    </Section>
  </article>
</template>
