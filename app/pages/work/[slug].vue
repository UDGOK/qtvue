<script setup lang="ts">
const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { data: project } = await useAsyncData(`work-${slug.value}`, () =>
  queryCollection('work').where('stem', '=', `en/work/${slug.value}`).first(),
)
if (!project.value) throw createError({ statusCode: 404, fatal: true })

useSeoMeta({
  title: () => `${project.value?.title} — qtvue`,
  description: () => project.value?.summary ?? '',
  ogImage: () => project.value?.image,
})
</script>

<template>
  <article v-if="project">
    <section class="border-b border-border bg-bg">
      <Container class="py-20">
        <Reveal>
          <NuxtLink to="/work" class="font-mono text-xs uppercase tracking-widest text-text-secondary hover:text-primary">
            ← All case studies
          </NuxtLink>
          <p class="eyebrow mt-6">Case study · {{ project.year }}</p>
          <h1 class="display-lg mt-4 max-w-4xl">{{ project.title }}</h1>
          <p class="mt-6 max-w-2xl text-lg text-text-secondary">{{ project.summary }}</p>
        </Reveal>
      </Container>
    </section>

    <Container class="py-12">
      <Reveal>
        <Media :src="project.image" :alt="project.title" ratio="16/9" placeholder="arm" />
        <div class="mt-8 flex flex-wrap gap-2">
          <Badge :text="project.industry" />
          <Badge v-for="s in project.services" :key="s" :text="s" />
        </div>
        <div v-if="project.metrics?.length" class="mt-10 grid gap-6 rounded-2xl border border-border bg-surface p-8 sm:grid-cols-3">
          <Stat v-for="m in project.metrics" :key="m.label" :value="m.value" :label="m.label" />
        </div>
        <ContentRenderer :value="project" class="prose mt-10 max-w-none" />
      </Reveal>
    </Container>
  </article>
</template>
