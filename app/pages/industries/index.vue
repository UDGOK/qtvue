<script setup lang="ts">
import { stemToRoute } from '~/utils/content'

const { data: industries } = await useAsyncData('industries-index', () =>
  queryCollection('industries').order('order', 'ASC').all(),
)
useSeoMeta({ title: 'Industries — qtvue', description: 'Industries we serve.' })
</script>

<template>
  <div>
    <section class="border-b border-border bg-bg">
      <Container class="py-20 sm:py-28">
        <Reveal>
          <p class="eyebrow">Industries</p>
          <h1 class="display-lg mt-4 max-w-4xl">
            Where we <span class="hl">work</span>.
          </h1>
          <p class="mt-6 max-w-2xl text-lg text-text-secondary">
            We deploy across the high-mix, high-throughput operations that need it most.
            Every cell is engineered to the realities of the floor.
          </p>
        </Reveal>
      </Container>
    </section>

    <Section>
      <Reveal>
        <div class="grid gap-6 md:grid-cols-3">
          <NuxtLink v-for="i in industries" :key="i.path" :to="stemToRoute(i.stem)" class="group block">
            <Card interactive pad="lg" class="h-full">
              <div class="flex h-3/5 items-center justify-center">
                <div class="aspect-square w-2/3">
                  <RobotMascot variant="head" />
                </div>
              </div>
              <div class="mt-6">
                <h3 class="text-xl font-bold tracking-tight text-text group-hover:text-primary">
                  {{ i.title }}
                </h3>
                <p class="mt-2 text-sm text-text-secondary">{{ i.summary }}</p>
                <div class="mt-4 flex items-center gap-1 text-sm font-semibold text-primary">
                  Explore
                  <span class="inline-block transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
                </div>
              </div>
            </Card>
          </NuxtLink>
        </div>
      </Reveal>
    </Section>
  </div>
</template>
