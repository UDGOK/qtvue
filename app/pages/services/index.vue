<script setup lang="ts">
/**
 * /services — index of the four service lines:
 *   01 — Sell, 02 — Program, 03 — Integrate, 04 — Security & Hardening
 */
const { data: services } = await useAsyncData('services-index', () =>
  queryCollection('services').order('order', 'ASC').all(),
)
useSeoMeta({
  title: 'Services — qtvue',
  description: 'Sell, Program, Integrate, and Security & Firmware Hardening for the Unitree range.',
})
</script>

<template>
  <div>
    <section class="border-b border-border bg-bg">
      <Container class="py-20 sm:py-28">
        <Reveal>
          <p class="eyebrow">Services</p>
          <h1 class="display-xl mt-4 max-w-4xl">
            Four ways we can <span class="hl">help</span>.
          </h1>
          <p class="mt-6 max-w-2xl text-lg text-text-secondary sm:text-xl">
            Pick the one you need. Stack them. Or start with
            <NuxtLink to="/intake" class="text-primary link-underline">submitting a use case</NuxtLink>
            and we'll recommend the right combination.
          </p>
        </Reveal>
      </Container>
    </section>

    <Section eyebrow="The service lines" heading="Each one is a complete engagement.">
      <ul class="grid gap-4 md:grid-cols-2">
        <Reveal
          v-for="(s, idx) in services"
          :key="s.stem"
          :delay="idx * 60"
          as="li"
        >
          <NuxtLink
            :to="`/services/${s.stem?.replace(/^en\/services\//, '')}`"
            class="group block h-full"
          >
            <Card variant="default" pad="lg" class="h-full transition-all hover:border-primary/40">
              <div class="flex items-baseline justify-between">
                <p class="eyebrow">{{ s.label || `0${idx + 1}` }}</p>
                <span class="font-mono text-[10px] uppercase tracking-widest text-text-muted">
                  full engagement
                </span>
              </div>
              <h3 class="mt-3 text-xl font-bold tracking-tight text-text group-hover:text-primary">
                {{ s.title }}
              </h3>
              <p class="mt-3 text-sm text-text-secondary">{{ s.summary }}</p>
              <div class="mt-6 flex items-center gap-1 text-sm font-semibold text-primary">
                Read what's in scope
                <span
                  class="inline-block transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                >→</span>
              </div>
            </Card>
          </NuxtLink>
        </Reveal>
      </ul>
    </Section>

    <Section tone="ink" eyebrow="One funnel" heading="Submit your use case.">
      <Reveal>
        <p class="max-w-2xl text-paper/80">
          One short form, one engineering review, one reply. Programming-only
          engagements route through the same form.
        </p>
      </Reveal>
      <Reveal :delay="100" class="mt-6 flex flex-wrap gap-3">
        <NuxtLink
          to="/intake"
          class="inline-flex h-11 items-center rounded-full bg-accent px-6 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-ink transition-all hover:opacity-90"
        >
          Submit your use case →
        </NuxtLink>
        <NuxtLink
          to="/platforms"
          class="inline-flex h-11 items-center rounded-full border border-paper/30 px-6 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-paper transition-all hover:border-paper/60"
        >
          See platforms
        </NuxtLink>
      </Reveal>
    </Section>
  </div>
</template>
