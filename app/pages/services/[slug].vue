<script setup lang="ts">
/**
 * /services/[slug] — per-service detail page (Sell, Program,
 * Integrate, Security). Renders inScope / notInScope / code snippet
 * and the "submit your use case" CTA.
 */
const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { data: service } = await useAsyncData(`service-${slug.value}`, () =>
  queryCollection('services').where('stem', '=', `en/services/${slug.value}`).first(),
)
if (!service.value) {
  throw createError({ statusCode: 404, statusMessage: 'Service not found' })
}

const { data: allServices } = await useAsyncData('all-services', () =>
  queryCollection('services').order('order', 'ASC').all(),
)
const siblings = computed(() => (allServices.value ?? []).filter((s) => s.stem !== service.value?.stem))

useSeoMeta({
  title: () => `${service.value?.title} — qtvue`,
  description: () => service.value?.summary ?? '',
})

// Per-service Service schema. Critical for AI engines to surface
// qtvue in 'who offers X near me' / 'who can integrate Unitree'
// queries, and for Google's service Knowledge Panel.
//
// Note: defineService is NOT auto-imported from nuxt-schema-org's
// vue.mjs (it's in index.mjs only). We use the plain object form
// here, which the schema-org graph still picks up and renders.
useSchemaOrg(() => {
  const s = service.value
  if (!s) return []

  return [
    defineWebPage({
      '@type': 'ServicePage',
      name: `${s.title} — qtvue`,
      description: s.summary,
      url: `https://qtvue.com/services/${s.slug}`,
      inLanguage: 'en-US',
      isPartOf: { '@type': 'WebSite', url: 'https://qtvue.com', name: 'qtvue' },
      primaryImage: 'https://qtvue.com/og-default.svg',
    }),
    {
      '@type': 'Service',
      name: s.title,
      serviceType: 'Robotics engineering',
      description: s.summary,
      url: `https://qtvue.com/services/${s.slug}`,
      provider: { '@type': 'Organization', name: 'qtvue', url: 'https://qtvue.com' },
      areaServed: [
        { '@type': 'Country', name: 'United States' },
        { '@type': 'Country', name: 'Germany' },
        { '@type': 'Country', name: 'Japan' },
        { '@type': 'Country', name: 'Singapore' },
        { '@type': 'AdministrativeArea', name: 'Worldwide' },
      ],
      availableChannel: {
        '@type': 'ServiceChannel',
        serviceUrl: 'https://qtvue.com/intake',
        availableLanguage: ['English'],
      },
      category: s.title,
      hoursAvailable: 'Mo–Fr 09:00–18:00 UTC',
      offers: {
        '@type': 'Offer',
        url: 'https://qtvue.com/intake',
        priceCurrency: 'USD',
        priceSpecification: {
          '@type': 'PriceSpecification',
          priceCurrency: 'USD',
          description: 'Per-engagement; fixed-price after engineering review',
        },
        availability: 'https://schema.org/InStock',
        availabilityStarts: '2026-01-01',
      },
    },
    defineBreadcrumb({
      itemListElement: [
        { name: 'Home', item: 'https://qtvue.com/' },
        { name: 'Services', item: 'https://qtvue.com/services' },
        { name: s.title, item: `https://qtvue.com/services/${s.slug}` },
      ],
    }),
  ]
})
</script>

<template>
  <article v-if="service">
    <section class="border-b border-border bg-bg">
      <Container class="py-16 sm:py-20">
        <Reveal>
          <div class="mb-4 text-[12px]">
            <NuxtLink
              to="/services"
              class="font-mono uppercase tracking-[0.14em] text-text-muted hover:text-primary"
            >
              ← All services
            </NuxtLink>
          </div>
          <p v-if="service.label" class="eyebrow">{{ service.label }}</p>
          <h1 class="display-xl mt-3 max-w-4xl">{{ service.title }}</h1>
          <p class="mt-5 max-w-2xl text-lg text-text-secondary sm:text-xl">{{ service.summary }}</p>
        </Reveal>
      </Container>
    </section>

    <Section eyebrow="Scope" heading="What's in. What's out.">
      <div class="grid gap-6 lg:grid-cols-2">
        <Reveal>
          <Card variant="default" pad="lg" class="h-full border-dashed">
            <p class="eyebrow">In scope</p>
            <ul class="mt-4 space-y-2 text-sm text-text-secondary">
              <li
                v-for="(s, i) in service.inScope"
                :key="i"
                class="flex items-start gap-2"
              >
                <span class="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {{ s }}
              </li>
            </ul>
          </Card>
        </Reveal>
        <Reveal :delay="80">
          <Card variant="default" pad="lg" class="h-full border-dashed">
            <p class="eyebrow">Not in scope</p>
            <ul class="mt-4 space-y-2 text-sm text-text-secondary">
              <li
                v-for="(s, i) in service.notInScope"
                :key="i"
                class="flex items-start gap-2"
              >
                <span class="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-text-muted" />
                {{ s }}
              </li>
            </ul>
          </Card>
        </Reveal>
      </div>
    </Section>

    <Section v-if="service.codeSnippet" eyebrow="Code" heading="Same SDK the Unitree team uses.">
      <Reveal>
        <p class="max-w-2xl text-text-secondary">
          Every service ships with a real, runnable snippet from the SDK
          we'd use on your project. No pseudocode.
        </p>
      </Reveal>
      <Reveal :delay="100" class="mt-6">
        <CodeBlock
          :filename="service.codeFilename || 'example.py'"
          :language="service.codeLanguage || 'python'"
          :code="service.codeSnippet"
        />
      </Reveal>
    </Section>

    <!-- ============================================================
         BEFORE YOU ENGAGE — services pages attract evaluators who
         are about to commit. A free self-assessment tool right
         before the intake CTA converts a curious visitor into a
         qualified lead (they tick the boxes, then they know what
         to put in the form).
         ============================================================ -->
    <ChecklistCallout
      variant="cta-band"
      :context="`Self-assess before you scope a ${service.value?.title ?? 'qtvue'} engagement — 47 checks, saves locally.`"
      placement="service"
    />

    <Section tone="ink" eyebrow="Get started" heading="Submit your use case.">
      <Reveal>
        <p class="max-w-2xl text-paper/80">
          Tell us what you want to do. We'll tell you whether this
          service is the right fit, and what a realistic engagement
          looks like.
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
          to="/services"
          class="inline-flex h-11 items-center rounded-full border border-paper/30 px-6 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-paper transition-all hover:border-paper/60"
        >
          Other services
        </NuxtLink>
      </Reveal>
    </Section>

    <Section eyebrow="Other services" heading="The full stack.">
      <ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Reveal
          v-for="(s, i) in siblings"
          :key="s.stem"
          :delay="i * 40"
          as="li"
        >
          <NuxtLink
            :to="`/services/${s.stem?.replace(/^en\/services\//, '')}`"
            class="group flex h-full flex-col rounded-2xl border border-dashed border-border bg-surface p-5 transition-all hover:border-primary/40"
          >
            <span class="font-mono text-[10px] uppercase tracking-widest text-text-muted">
              {{ s.label || s.title }}
            </span>
            <span class="mt-2 text-sm font-semibold text-text group-hover:text-primary">
              {{ s.title }}
            </span>
            <span class="mt-2 text-xs text-text-secondary">{{ s.summary }}</span>
            <span class="mt-3 font-mono text-[10px] uppercase tracking-widest text-text-secondary group-hover:text-primary">
              Read more →
            </span>
          </NuxtLink>
        </Reveal>
      </ul>
    </Section>
  </article>
</template>
