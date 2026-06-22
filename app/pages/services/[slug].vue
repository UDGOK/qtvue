<script setup lang="ts">
import { stemToRoute } from '~/utils/content'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

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
    <section class="border-b border-border bg-bg">
      <Container class="py-20 sm:py-28">
        <Reveal>
          <NuxtLink to="/services" class="font-mono text-xs uppercase tracking-widest text-text-secondary hover:text-primary">
            ← All services
          </NuxtLink>
          <div class="mt-6 flex items-center gap-3">
            <span class="grid h-12 w-12 place-items-center rounded-xl bg-primary-50 text-primary">
              <Icon :name="service.icon" :size="24" />
            </span>
            <p class="eyebrow">Service</p>
          </div>
          <h1 class="display-lg mt-4 max-w-4xl">{{ service.title }}</h1>
          <p class="mt-6 max-w-2xl text-lg text-text-secondary">{{ service.summary }}</p>
        </Reveal>
      </Container>
    </section>

    <Section>
      <Reveal>
        <ContentRenderer :value="service" class="prose max-w-none text-text" />
        <div class="mt-12">
          <Btn href="/contact" variant="primary" size="lg" arrow>
            Start a {{ service.title.toLowerCase() }} project
          </Btn>
        </div>
      </Reveal>
    </Section>

    <Section v-if="related?.length" tone="surface" eyebrow="Related work" heading="See it in action.">
      <Reveal>
        <div class="grid gap-6 sm:grid-cols-3">
          <NuxtLink v-for="w in related" :key="w.path" :to="stemToRoute(w.stem)">
            <Card interactive pad="none" class="overflow-hidden">
              <Media :src="w.image" :alt="w.title" ratio="16/9" placeholder="arm" />
              <div class="p-5">
                <h4 class="font-semibold text-text">{{ w.title }}</h4>
                <p class="mt-1 line-clamp-2 text-sm text-text-secondary">{{ w.summary }}</p>
              </div>
            </Card>
          </NuxtLink>
        </div>
      </Reveal>
    </Section>
  </article>
</template>
