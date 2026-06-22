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
      defineWebPage({
        '@type': 'BlogPosting',
        name: post.value.title,
        description: post.value.summary,
        url: `https://qtvue.com/blog/${post.value.slug}`,
        inLanguage: 'en-US',
        isPartOf: { '@type': 'WebSite', url: 'https://qtvue.com', name: 'qtvue' },
        primaryImage: post.value.image ? `https://qtvue.com${post.value.image}` : 'https://qtvue.com/og-default.svg',
      }),
      defineArticle({
        '@type': 'Article',
        headline: post.value.title,
        description: post.value.summary,
        image: post.value.image ? `https://qtvue.com${post.value.image}` : 'https://qtvue.com/og-default.svg',
        datePublished: post.value.date ?? '2026-06-22',
        dateModified: post.value.date ?? '2026-06-22',
        inLanguage: 'en-US',
        author: { '@type': 'Organization', name: post.value.author ?? 'qtvue', url: 'https://qtvue.com' },
        publisher: { '@type': 'Organization', name: 'qtvue', url: 'https://qtvue.com', logo: { '@type': 'ImageObject', url: 'https://qtvue.com/favicon.svg' } },
        mainEntityOfPage: { '@type': 'WebPage', '@id': `https://qtvue.com/blog/${post.value.slug}` },
        keywords: 'Unitree, robotics, ROS 2, Isaac Lab, LeRobot, automation, integration',
        articleSection: 'Robotics engineering',
        wordCount: 1200,
      }),
      defineBreadcrumb({
        itemListElement: [
          { name: 'Home', item: 'https://qtvue.com/' },
          { name: 'Blog', item: 'https://qtvue.com/blog' },
          { name: post.value.title, item: `https://qtvue.com/blog/${post.value.slug}` },
        ],
      }),
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
