<script setup lang="ts">
/**
 * /platforms — index page listing all Unitree platforms in the
 * content collection, with greptile-style cards.
 */
const { data: platforms } = await useAsyncData('platforms', () =>
  queryCollection('platforms').order('order', 'ASC').all(),
)

useSeoMeta({
  title: 'Platforms — qtvue',
  description:
    'The full Unitree range — Go2, B2, G1, R1, H1, H2, G1-D, and arms. Specs, SDK snippets, and honest callouts for each platform.',
})
</script>

<template>
  <div>
    <section class="border-b border-border bg-bg">
      <Container class="py-20 sm:py-28">
        <Reveal>
          <p class="eyebrow">Platforms</p>
          <h1 class="display-xl mt-4 max-w-4xl">
            The full <span class="hl">Unitree</span> range.
          </h1>
          <p class="mt-6 max-w-2xl text-lg text-text-secondary sm:text-xl">
            We sell, program, and integrate every platform on this page.
            Click any card for specs, real SDK snippets, and the honest
            callouts we wish every product page had.
          </p>
        </Reveal>
      </Container>
    </section>

    <Section eyebrow="Browse" heading="Eight platforms. One SDK.">
      <Reveal class="mb-6">
        <NuxtLink
          to="/compare"
          class="inline-flex items-center gap-2 border border-dashed border-border bg-surface px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-text-secondary transition-all hover:border-primary hover:text-primary"
        >
          <span class="inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          Compare platforms head-to-head (5 matchups) →
        </NuxtLink>
      </Reveal>
      <ul class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Reveal
          v-for="(p, i) in platforms"
          :key="p.stem"
          :delay="i * 50"
          as="li"
        >
          <NuxtLink
            :to="`/platforms/${p.slug}`"
            class="group flex h-full flex-col rounded-none border border-dashed border-border bg-surface p-6 transition-all hover:border-primary/40 hover:shadow-[var(--shadow-lg)]"
          >
            <div class="flex items-baseline justify-between">
              <span class="font-mono text-[10px] uppercase tracking-widest text-text-muted">
                {{ p.type }}
              </span>
              <span class="font-mono text-[10px] text-text-secondary">{{ p.priceFrom }}</span>
            </div>
            <h2 class="mt-3 text-xl font-bold tracking-tight text-text group-hover:text-primary">
              {{ p.title }}
            </h2>
            <p class="mt-2 text-sm text-text-secondary">{{ p.oneLiner }}</p>
            <dl class="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 font-mono text-[10px] uppercase tracking-widest text-text-secondary">
              <div>
                <dt class="text-text-muted">payload</dt>
                <dd class="mt-1 text-text">{{ p.payload || '—' }}</dd>
              </div>
              <div>
                <dt class="text-text-muted">IP</dt>
                <dd class="mt-1 text-text">{{ p.ipRating || '—' }}</dd>
              </div>
            </dl>
            <div class="mt-auto pt-5 font-mono text-[10px] uppercase tracking-widest text-text-secondary group-hover:text-primary">
              Specs + SDK snippet →
            </div>
          </NuxtLink>
        </Reveal>
      </ul>
    </Section>

    <Section tone="surface" eyebrow="Not sure?" heading="Tell us what you want to do.">
      <Reveal>
        <p class="max-w-2xl text-text-secondary">
          We will recommend the right platform. Free, no commitment.
        </p>
      </Reveal>
      <Reveal :delay="100" class="mt-6">
        <NuxtLink
          to="/intake"
          class="inline-flex h-11 items-center rounded-none bg-primary px-6 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-bg transition-all hover:opacity-90"
        >
          Submit your use case →
        </NuxtLink>
      </Reveal>
    </Section>
  </div>
</template>
