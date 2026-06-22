<script setup lang="ts">
import { stemToRoute } from '~/utils/content'

const { data: services } = await useAsyncData('services-index', () =>
  queryCollection('services').order('order', 'ASC').all(),
)
useSeoMeta({
  title: 'Services — qtvue',
  description: 'Robotics integration, programming, sales, and consulting services.',
})
</script>

<template>
  <div>
    <!-- HERO -->
    <section class="border-b border-border bg-bg">
      <Container class="py-20 sm:py-28">
        <Reveal>
          <p class="eyebrow">Services</p>
          <h1 class="display-lg mt-4 max-w-4xl">
            Everything you need to <span class="hl">automate</span>.
          </h1>
          <p class="mt-6 max-w-2xl text-lg text-text-secondary">
            Four services, one team, end-to-end ownership. Pick a single engagement or run the
            full lifecycle with us — from feasibility to first-part-good to ongoing support.
          </p>
        </Reveal>
      </Container>
    </section>

    <Section>
      <Reveal>
        <div class="grid gap-6 md:grid-cols-2">
          <NuxtLink
            v-for="(s, idx) in services"
            :key="s.path"
            :to="stemToRoute(s.stem)"
            class="group block"
          >
            <Card interactive pad="lg" class="h-full">
              <div class="flex items-start justify-between gap-4">
                <div class="grid h-10 w-10 place-items-center rounded-xl bg-primary-50 text-primary">
                  <Icon :name="s.icon" :size="20" />
                </div>
                <span class="font-mono text-[10px] uppercase tracking-widest text-text-muted">
                  0{{ idx + 1 }}
                </span>
              </div>
              <h3 class="mt-5 text-xl font-bold tracking-tight text-text group-hover:text-primary">
                {{ s.title }}
              </h3>
              <p class="mt-3 text-text-secondary">{{ s.summary }}</p>
              <div class="mt-6 flex items-center gap-1 text-sm font-semibold text-primary">
                Learn more
                <span
                  class="inline-block transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                >→</span>
              </div>
            </Card>
          </NuxtLink>
        </div>
      </Reveal>
    </Section>

    <Section tone="ink" eyebrow="Not sure where to start?" heading="Book a 30-minute scoping call.">
      <div class="flex flex-wrap items-center gap-3">
        <Btn href="/contact" variant="accent" size="lg" arrow>Book the call</Btn>
        <p class="font-mono text-xs text-ink-text/50">no commitment · reply within 1 business day</p>
      </div>
    </Section>
  </div>
</template>
