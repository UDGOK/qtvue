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

watchEffect(() => {
  if (post.value) {
    useSchemaOrg([
      {
        '@type': 'Article',
        headline: post.value.title,
        datePublished: post.value.date,
        author: { '@type': 'Organization', name: post.value.author },
      },
    ])
  }
})
</script>

<template>
  <article v-if="post">
    <section class="border-b border-border bg-bg">
      <Container class="py-20">
        <Reveal>
          <NuxtLink to="/blog" class="font-mono text-xs uppercase tracking-widest text-text-secondary hover:text-primary">
            ← All posts
          </NuxtLink>
          <p class="eyebrow mt-6">Blog</p>
          <h1 class="display-md mt-4 max-w-4xl">{{ post.title }}</h1>
          <div class="mt-6 flex items-center gap-3 font-mono text-xs text-text-secondary">
            <time>{{ post.date }}</time>
            <span class="text-text-muted">·</span>
            <span>{{ post.author }}</span>
          </div>
        </Reveal>
      </Container>
    </section>

    <Container class="py-12">
      <Reveal>
        <div v-if="post.tags?.length" class="mb-6 flex flex-wrap gap-2">
          <Badge v-for="tag in post.tags" :key="tag" :text="tag" variant="outline" />
        </div>
        <ContentRenderer :value="post" class="prose max-w-none" />
      </Reveal>
    </Container>
  </article>
</template>
