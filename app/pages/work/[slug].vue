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
    <Section :eyebrow="`Case study · ${project.year}`" :heading="project.title">
      <Media :src="project.image" :alt="project.title" ratio="16/9" />
      <div class="mt-6 flex flex-wrap gap-2">
        <Badge :text="project.industry" />
        <Badge v-for="s in project.services" :key="s" :text="s" />
      </div>
      <div v-if="project.metrics?.length" class="mt-8 grid gap-6 sm:grid-cols-3">
        <Stat v-for="m in project.metrics" :key="m.label" :value="m.value" :label="m.label" />
      </div>
      <ContentRenderer :value="project" class="prose mt-8 max-w-none" />
    </Section>
  </article>
</template>
