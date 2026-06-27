<script setup lang="ts">
/**
 * /compare — index page listing all head-to-head comparisons.
 *
 * Each card links to a /compare/[slug] dynamic route that renders the
 * spec table. Ticket 3 from the v2 brief — pure SEO compounding.
 */
import { comparisons } from '~/data/comparisons'

useSeoMeta({
  title: 'Compare Unitree robots head-to-head (2026) — qtvue',
  description:
    'Honest spec-by-spec comparisons of Unitree robots. Go2 vs B2, G1 vs H1, R1 vs G1, H1 vs H2, Go2 vs G1. Which platform for your use case?',
  ogTitle: 'Compare Unitree robots head-to-head (2026)',
  ogDescription:
    '5 head-to-head comparisons: Go2 vs B2, G1 vs H1, R1 vs G1, H1 vs H2, Go2 vs G1. Specs reconciled against the live platform pages.',
})

useSchemaOrg([
  defineWebPage({
    '@type': 'WebPage',
    name: 'Compare Unitree robots head-to-head (2026)',
    description:
      '5 head-to-head comparisons of Unitree robots. Specs reconciled against the live platform pages.',
    url: 'https://qtvue.com/compare',
    inLanguage: 'en-US',
    isPartOf: { '@type': 'WebSite', url: 'https://qtvue.com', name: 'qtvue' },
    primaryImage: 'https://qtvue.com/og-default.svg',
  }),
  defineBreadcrumb({
    itemListElement: [
      { name: 'Home', item: 'https://qtvue.com/' },
      { name: 'Compare', item: 'https://qtvue.com/compare' },
    ],
  }),
])
</script>

<template>
  <div class="bg-bg text-text">
    <section class="border-b border-dashed border-border">
      <Container class="py-20 sm:py-28">
        <Reveal>
          <p class="eyebrow">Comparisons</p>
          <h1 class="display-xl mt-4 max-w-4xl text-text">
            Which Unitree robot for <span class="hl">your</span> use case?
          </h1>
          <p class="mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary sm:text-xl">
            Five head-to-head comparisons. Every spec reconciled against the
            live platform pages — no rounded-up marketing numbers. Pick the
            one closest to your decision.
          </p>
        </Reveal>
      </Container>
    </section>

    <Section eyebrow="Browse" heading="All matchups.">
      <ul class="grid gap-4 md:grid-cols-2">
        <Reveal
          v-for="(c, i) in comparisons"
          :key="c.slug"
          :delay="i * 50"
          as="li"
        >
          <NuxtLink
            :to="`/compare/${c.slug}`"
            class="group block h-full border border-dashed border-border bg-surface p-6 transition-all hover:border-primary/60 hover:bg-primary-50/40"
          >
            <p class="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
              Comparison
            </p>
            <h2 class="mt-3 text-2xl font-bold tracking-tight text-text group-hover:text-primary">
              {{ c.a }} <span class="text-text-muted">vs</span> {{ c.b }}
            </h2>
            <p class="mt-3 text-sm leading-relaxed text-text-secondary">
              {{ c.description }}
            </p>
            <p class="mt-4 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-text-muted group-hover:text-primary">
              Read the comparison
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </p>
          </NuxtLink>
        </Reveal>
      </ul>
    </Section>

    <section class="bg-ink-bg text-ink-text">
      <div class="mx-auto max-w-3xl px-6 py-20 text-center md:py-28">
        <h2 class="font-display text-3xl font-extrabold leading-tight md:text-5xl">
          Still on the fence?
        </h2>
        <p class="mt-6 text-lg text-ink-text/80 max-w-2xl mx-auto">
          We work across the full Unitree range. Tell us what you're trying
          to do — we'll name the right platform, the SDK, and a realistic
          timeline. Free.
        </p>
        <div class="mt-10">
          <NuxtLink
            to="/intake"
            class="group relative inline-flex h-12 items-center font-mono text-xs font-semibold uppercase tracking-[0.12em] text-ink transition-all duration-200 bg-accent hover:opacity-90"
            style="clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 0 100%, 16px 50%); padding-left: 28px; padding-right: 32px;"
          >
            <span class="pl-3 sm:pl-4">Submit your use case</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="ml-2 transition-transform group-hover:translate-x-0.5">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>