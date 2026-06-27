<script setup lang="ts">
/**
 * /compare/[slug] — data-driven head-to-head comparison page.
 * Pulls from app/data/comparisons.ts, renders a single spec table
 * + verdict, links to both platform pages.
 *
 * Ticket 3 from the v2 brief. Spec values were reconciled against the
 * live platform pages in content/en/platforms/*.md before commit.
 */

import { findComparison, comparisons } from '~/data/comparisons'

const route = useRoute()
const slug = computed(() => String(route.params.slug))
const cmp = findComparison(slug.value)

if (!cmp) {
  throw createError({ statusCode: 404, statusMessage: `Comparison "${slug.value}" not found` })
}

useSeoMeta({
  title: cmp.title,
  description: cmp.description,
  ogTitle: cmp.title,
  ogDescription: cmp.description,
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

useSchemaOrg([
  defineWebPage({
    '@type': 'WebPage',
    name: cmp.title,
    description: cmp.description,
    url: `https://qtvue.com/compare/${cmp.slug}`,
    inLanguage: 'en-US',
    isPartOf: { '@type': 'WebSite', url: 'https://qtvue.com', name: 'qtvue' },
    primaryImage: 'https://qtvue.com/og-default.svg',
  }),
  defineBreadcrumb({
    itemListElement: [
      { name: 'Home', item: 'https://qtvue.com/' },
      { name: 'Platforms', item: 'https://qtvue.com/platforms' },
      { name: cmp.title, item: `https://qtvue.com/compare/${cmp.slug}` },
    ],
  }),
])

// Sibling comparisons — shown at the bottom for SEO compounding
const siblings = computed(() =>
  comparisons.filter((c) => c.slug !== cmp!.slug),
)
</script>

<template>
  <div class="bg-bg text-text">
    <!-- ============================================================
         HERO
         ============================================================ -->
    <section class="border-b border-dashed border-border">
      <Container class="py-16 sm:py-20">
        <Reveal>
          <nav class="mb-6 font-mono text-[11px] uppercase tracking-wider text-text-muted">
            <NuxtLink to="/compare" class="hover:text-primary">
              ← All comparisons
            </NuxtLink>
            <span class="mx-2 text-border">·</span>
            <NuxtLink to="/platforms" class="hover:text-primary">
              Platforms
            </NuxtLink>
          </nav>
          <p class="eyebrow">{{ cmp.eyebrow || 'Comparison · 2026' }}</p>
          <h1 class="display-xl mt-4 max-w-4xl text-text">
            {{ cmp.a }} <span class="hl">vs</span> {{ cmp.b }}
          </h1>
          <p class="mt-6 max-w-3xl text-lg leading-relaxed text-text-secondary sm:text-xl">
            {{ cmp.intro }}
          </p>
        </Reveal>
      </Container>
    </section>

    <!-- ============================================================
         SPEC TABLE
         ============================================================ -->
    <Section eyebrow="Spec-by-spec" heading="Where they actually differ.">
      <Reveal>
        <div class="overflow-x-auto border border-dashed border-border bg-surface">
          <table class="w-full text-left text-sm">
            <thead class="bg-bg">
              <tr class="border-b border-border">
                <th class="px-5 py-3 font-mono text-[10px] uppercase tracking-widest text-text-muted">
                  Spec
                </th>
                <th class="px-5 py-3 font-mono text-[10px] uppercase tracking-widest text-text-muted">
                  <NuxtLink :to="`/platforms/${cmp.aSlug}`" class="hover:text-primary">
                    {{ cmp.a }}
                  </NuxtLink>
                </th>
                <th class="px-5 py-3 font-mono text-[10px] uppercase tracking-widest text-text-muted">
                  <NuxtLink :to="`/platforms/${cmp.bSlug}`" class="hover:text-primary">
                    {{ cmp.b }}
                  </NuxtLink>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, i) in cmp.specs"
                :key="row.label"
                :class="[
                  'border-b border-dashed border-border/60 last:border-0 transition-colors',
                  row.winner === 'a' && 'bg-primary-50/30',
                  row.winner === 'b' && 'bg-accent/10',
                ]"
              >
                <th scope="row" class="px-5 py-3 text-left font-medium text-text-secondary">
                  {{ row.label }}
                </th>
                <td
                  :class="[
                    'px-5 py-3 font-mono text-[13px] text-text',
                    row.winner === 'a' && 'font-bold text-primary',
                  ]"
                >
                  {{ row.a }}
                </td>
                <td
                  :class="[
                    'px-5 py-3 font-mono text-[13px] text-text',
                    row.winner === 'b' && 'font-bold text-primary',
                  ]"
                >
                  {{ row.b }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="mt-4 font-mono text-xs text-text-muted">
          Highlighted row = the side that wins on that dimension.
          Verified against the live platform pages.
        </p>
      </Reveal>
    </Section>

    <!-- ============================================================
         VERDICT
         ============================================================ -->
    <Section tone="surface" eyebrow="Verdict" heading="The honest answer.">
      <Reveal>
        <p class="max-w-3xl text-lg leading-relaxed text-text">
          {{ cmp.verdict }}
        </p>
      </Reveal>
    </Section>

    <!-- ============================================================
         SIBLINGS — other comparisons for SEO compounding
         ============================================================ -->
    <Section eyebrow="More comparisons" heading="Other matchups.">
      <ul class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        <Reveal
          v-for="(s, i) in siblings"
          :key="s.slug"
          :delay="i * 50"
          as="li"
        >
          <NuxtLink
            :to="`/compare/${s.slug}`"
            class="group block h-full border border-dashed border-border bg-surface p-5 transition-all hover:border-primary/60 hover:bg-primary-50/40"
          >
            <p class="font-mono text-[11px] uppercase tracking-wider text-primary">
              {{ s.a }} vs {{ s.b }}
            </p>
            <p class="mt-2 text-sm text-text-secondary">
              {{ s.description }}
            </p>
            <p class="mt-3 font-mono text-[10px] uppercase tracking-wider text-text-muted group-hover:text-primary">
              Read the comparison →
            </p>
          </NuxtLink>
        </Reveal>
      </ul>
    </Section>

    <!-- ============================================================
         FINAL CTA — same pattern as every page
         ============================================================ -->
    <section class="bg-ink-bg text-ink-text">
      <div class="mx-auto max-w-3xl px-6 py-20 text-center md:py-28">
        <h2 class="font-display text-3xl font-extrabold leading-tight md:text-5xl">
          Still not sure? Tell us what you want to do.
        </h2>
        <p class="mt-6 text-lg text-ink-text/80 max-w-2xl mx-auto">
          We'll name the right platform, the SDK, and a realistic timeline —
          free. No commitment.
        </p>
        <div class="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
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