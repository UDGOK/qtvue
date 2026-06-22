<script setup lang="ts">
import { stemToRoute } from '~/utils/content'

const { data: features } = await useAsyncData('features-index', () =>
  queryCollection('features').order('order', 'ASC').all(),
)
useSeoMeta({
  title: 'Features — qtvue',
  description: 'Cell design, programming, vision, EOAT, safety, and 24/7 support — every capability you need to automate.',
})
</script>

<template>
  <div>
    <section class="border-b border-border bg-bg">
      <Container class="py-20 sm:py-28">
        <Reveal>
          <p class="eyebrow">Features</p>
          <h1 class="display-lg mt-4 max-w-4xl">
            Six capabilities. <span class="hl">One team.</span>
          </h1>
          <p class="mt-6 max-w-2xl text-lg text-text-secondary sm:text-xl">
            Every cell we ship is designed, programmed, integrated, validated, and supported by the
            same engineers. No handoffs between vendors, no finger-pointing when something breaks.
            One team, end to end.
          </p>
        </Reveal>
      </Container>
    </section>

    <Section>
      <Reveal>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="f in features"
            :key="f.stem"
            :to="stemToRoute(f.stem)"
            class="group block"
          >
            <Card interactive pad="none" class="h-full overflow-hidden">
              <div class="relative aspect-[16/9] w-full overflow-hidden border-b border-border bg-surface-2 halftone-bg">
                <div class="absolute inset-0 grid place-items-center">
                  <div class="h-3/5 w-3/5 transition-transform duration-500 group-hover:scale-105">
                    <RobotMascot variant="arm" />
                  </div>
                </div>
                <span
                  v-if="f.badge"
                  class="absolute left-3 top-3 rounded-full bg-bg/90 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-primary backdrop-blur"
                >
                  {{ f.badge }}
                </span>
              </div>
              <div class="p-6">
                <div class="flex items-center gap-2">
                  <span class="grid h-8 w-8 place-items-center rounded-lg bg-primary-50 text-primary">
                    <Icon :name="f.icon" :size="16" />
                  </span>
                  <h3 class="text-lg font-bold tracking-tight text-text group-hover:text-primary">
                    {{ f.title }}
                  </h3>
                </div>
                <p class="mt-3 text-sm text-text-secondary">{{ f.summary }}</p>
                <div class="mt-4 flex items-center gap-1 text-sm font-semibold text-primary">
                  Learn more
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
