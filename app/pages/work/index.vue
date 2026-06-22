<script setup lang="ts">
import { stemToRoute } from '~/utils/content'

const { data: work } = await useAsyncData('work-index', () =>
  queryCollection('work').order('year', 'DESC').all(),
)
useSeoMeta({ title: 'Work — qtvue', description: 'Selected robotics projects.' })
</script>

<template>
  <div>
    <section class="border-b border-border bg-bg">
      <Container class="py-20 sm:py-28">
        <Reveal>
          <p class="eyebrow">Case studies</p>
          <h1 class="display-lg mt-4 max-w-4xl">
            Selected <span class="hl">work</span>.
          </h1>
          <p class="mt-6 max-w-2xl text-lg text-text-secondary">
            A representative slice of what we've shipped. Real metrics, real timelines, real
            customers. Every one of these went from feasibility to first-part-good with our
            team.
          </p>
        </Reveal>
      </Container>
    </section>

    <Section>
      <Reveal>
        <p v-if="!work?.length" class="text-text-secondary">Case studies coming soon.</p>
        <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <NuxtLink v-for="w in work" :key="w.path" :to="stemToRoute(w.stem)" class="group block">
            <Card interactive pad="none" class="h-full overflow-hidden">
              <div class="relative aspect-[4/3] overflow-hidden border-b border-border bg-surface-2 halftone-bg">
                <div class="absolute inset-0 grid place-items-center">
                  <div class="h-3/5 w-3/5 transition-transform duration-500 group-hover:scale-105">
                    <RobotMascot variant="arm" />
                  </div>
                </div>
                <span
                  v-if="w.year"
                  class="absolute left-3 top-3 rounded-full bg-bg/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-text-secondary backdrop-blur"
                >
                  {{ w.year }}
                </span>
                <span
                  class="absolute right-3 top-3 rounded-full bg-primary px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-[#faf6ec]"
                >
                  {{ w.industry }}
                </span>
              </div>
              <div class="p-6">
                <h3 class="text-lg font-bold tracking-tight text-text group-hover:text-primary">
                  {{ w.title }}
                </h3>
                <p class="mt-2 line-clamp-2 text-sm text-text-secondary">{{ w.summary }}</p>
                <div v-if="w.metrics?.length" class="mt-4 flex gap-6 border-t border-border pt-4">
                  <div v-for="m in w.metrics?.slice(0, 2)" :key="m.label">
                    <div class="font-display text-xl font-extrabold text-primary">{{ m.value }}</div>
                    <div class="text-xs text-text-secondary">{{ m.label }}</div>
                  </div>
                </div>
              </div>
            </Card>
          </NuxtLink>
        </div>
      </Reveal>
    </Section>
  </div>
</template>
