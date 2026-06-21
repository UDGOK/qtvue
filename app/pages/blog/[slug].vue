<script setup lang="ts">
const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { data: post } = await useAsyncData(`blog-${slug.value}`, () =>
  queryCollection('blog').where('stem', '=', `en/blog/${slug.value}`).first(),
)
if (!post.value) throw createError({ statusCode: 404, fatal: true })

useSeoMeta({
  title: () => `${post.value?.title} — qtvue Blog`,
  description: () => post.value?.summary ?? '',
  ogImage: () => post.value?.image,
})
</script>

<template>
  <article v-if="post">
    <Section>
      <time class="font-mono text-sm text-text-secondary">{{ post.date }} · {{ post.author }}</time>
      <h1 class="mt-2 text-3xl font-bold sm:text-4xl">{{ post.title }}</h1>
      <div v-if="post.tags?.length" class="mt-4 flex gap-2">
        <Badge v-for="tag in post.tags" :key="tag" :text="tag" />
      </div>
      <ContentRenderer :value="post" class="prose mt-8 max-w-none" />
    </Section>
  </article>
</template>
