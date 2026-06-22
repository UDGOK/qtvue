<script setup lang="ts">
import { stemToRoute } from '~/utils/content'

const { data: posts } = await useAsyncData('blog-index', () =>
  queryCollection('blog').order('date', 'DESC').all(),
)
useSeoMeta({ title: 'Blog — qtvue', description: 'Articles on robotics and automation.' })
</script>

<template>
  <div>
    <section class="border-b border-border bg-bg">
      <Container class="py-20 sm:py-28">
        <Reveal>
          <p class="eyebrow">Blog</p>
          <h1 class="display-lg mt-4 max-w-4xl">
            Notes on <span class="hl">robotics</span> & automation.
          </h1>
          <p class="mt-6 max-w-2xl text-lg text-text-secondary">
            From our engineers. No fluff, no sales pitch — just what we are learning on the
            line.
          </p>
        </Reveal>
      </Container>
    </section>

    <Section>
      <Reveal>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <NuxtLink v-for="p in posts" :key="p.path" :to="stemToRoute(p.stem)" class="group block">
            <Card interactive pad="lg" class="h-full">
              <time class="font-mono text-xs uppercase tracking-widest text-text-muted">
                {{ p.date }}
              </time>
              <h3 class="mt-3 text-lg font-bold tracking-tight text-text group-hover:text-primary">
                {{ p.title }}
              </h3>
              <p class="mt-2 line-clamp-3 text-sm text-text-secondary">{{ p.summary }}</p>
              <div v-if="p.tags?.length" class="mt-4 flex flex-wrap gap-2">
                <Badge v-for="tag in p.tags" :key="tag" :text="tag" variant="outline" />
              </div>
            </Card>
          </NuxtLink>
        </div>
      </Reveal>
    </Section>
  </div>
</template>
