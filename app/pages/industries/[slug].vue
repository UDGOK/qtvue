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
  <article v-if="industry">
    <section class="border-b border-border bg-bg">
      <Container class="py-20">
        <Reveal>
          <NuxtLink to="/industries" class="font-mono text-xs uppercase tracking-widest text-text-secondary hover:text-primary">
            ← All industries
          </NuxtLink>
          <p class="eyebrow mt-6">Industries</p>
          <h1 class="display-lg mt-4 max-w-4xl">{{ industry.title }}</h1>
          <p class="mt-6 max-w-2xl text-lg text-text-secondary">{{ industry.summary }}</p>
        </Reveal>
      </Container>
    </section>

    <Container class="py-12">
      <Reveal>
        <ContentRenderer :value="industry" class="prose max-w-none" />
        <div v-if="work?.length" class="mt-12">
          <SectionDivider label="Related work" />
          <div class="mt-8 grid gap-6 sm:grid-cols-3">
            <NuxtLink v-for="w in work" :key="w.path" :to="stemToRoute(w.stem)" class="group block">
              <Card interactive pad="none" class="overflow-hidden">
                <Media :src="w.image" :alt="w.title" ratio="16/9" placeholder="arm" />
                <div class="p-5">
                  <h4 class="font-semibold text-text group-hover:text-primary">{{ w.title }}</h4>
                  <p class="mt-1 line-clamp-2 text-sm text-text-secondary">{{ w.summary }}</p>
                </div>
              </Card>
            </NuxtLink>
          </div>
        </div>
      </Reveal>
    </Container>
  </article>
</template>
