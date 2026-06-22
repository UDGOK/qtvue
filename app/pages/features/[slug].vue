<script setup lang="ts">
import { stemToRoute } from '~/utils/content'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

/**
 * Feature detail page.
 *
 * Fetched via @nuxt/content v3 queryCollection, same pattern as the
 * working /work/[slug] and /services/[slug] pages. The data is
 * resolved at build time (the route is fully prerendered), so a
 * failure at query time would prevent the route from being generated
 * — that's a build error, not a runtime 500.
 */
const { data: feature } = await useAsyncData(`feature-${slug.value}`, () =>
  queryCollection('features').where('stem', '=', `en/features/${slug.value}`).first(),
)
if (!feature.value) {
  throw createError({ statusCode: 404, statusMessage: 'Feature not found', fatal: true })
}

const { data: all } = await useAsyncData('features-all', () =>
  queryCollection('features').order('order', 'ASC').all(),
)

useSeoMeta({
  title: () => `${feature.value?.title} — qtvue`,
  description: () => feature.value?.summary ?? '',
})
</script>

<template>
  <article v-if="feature">
    <!-- HERO -->
    <section class="relative border-b border-border bg-bg">
      <div class="absolute inset-0 -z-10 halftone-bg opacity-30" aria-hidden="true" />
      <Container class="py-20 sm:py-28">
        <Reveal>
          <NuxtLink to="/features" class="font-mono text-[10px] uppercase tracking-[0.18em] text-text-secondary hover:text-primary">
            ← All features
          </NuxtLink>
          <div class="mt-6 flex flex-wrap items-center gap-3">
            <span class="grid h-12 w-12 place-items-center rounded-xl bg-primary-50 text-primary">
              <Icon :name="feature.icon" :size="24" />
            </span>
            <span
              v-if="feature.badge"
              class="rounded-full border border-primary/30 bg-primary-50 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-primary"
            >
              {{ feature.badge }}
            </span>
            <p class="font-mono text-[10px] uppercase tracking-[0.18em] text-text-secondary">Feature</p>
          </div>
          <h1 class="display-lg mt-4 max-w-4xl">{{ feature.title }}</h1>
          <p class="mt-6 max-w-2xl text-lg text-text-secondary sm:text-xl">{{ feature.summary }}</p>

          <div v-if="feature.brands?.length" class="mt-10">
            <p class="font-mono text-[10px] uppercase tracking-[0.18em] text-text-secondary">Brands we support</p>
            <div class="mt-3 flex flex-wrap gap-2">
              <span
                v-for="b in feature.brands"
                :key="b"
                class="rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-text-secondary"
              >{{ b }}</span>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>

    <!-- VISUAL -->
    <Section bleed>
      <Reveal>
        <div class="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-dashed border-border bg-surface halftone-bg">
          <div class="grid aspect-[16/9] place-items-center">
            <div class="h-3/4 w-3/4">
              <RobotMascot variant="arm" />
            </div>
          </div>
        </div>
      </Reveal>
    </Section>

    <!-- METRICS -->
    <Section v-if="feature.metrics?.length" tone="surface" eyebrow="By the numbers" heading="The numbers behind the work.">
      <Reveal>
        <div class="grid grid-cols-2 gap-6 sm:grid-cols-3">
          <div v-for="m in feature.metrics" :key="m.label">
            <Stat :value="m.value" :label="m.label" />
          </div>
        </div>
      </Reveal>
    </Section>

    <!-- CAPABILITIES -->
    <Section
      v-if="feature.capabilities?.length"
      eyebrow="What we deliver"
      heading="Everything in scope."
    >
      <Reveal>
        <ul class="grid gap-3 sm:grid-cols-2">
          <li
            v-for="(c, i) in feature.capabilities"
            :key="c"
            class="flex items-start gap-3 rounded-xl border border-border bg-surface p-4"
          >
            <span class="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary-50 font-mono text-[10px] font-bold text-primary">
              {{ String(i + 1).padStart(2, '0') }}
            </span>
            <span class="text-sm text-text">{{ c }}</span>
          </li>
        </ul>
      </Reveal>
    </Section>

    <!-- LEARNING PATH (programming only) — animated 6-step pathway
         inspired by k-robotic's "Unitree Robot Operation for Beginners"
         article, adapted for qtvue's industrial-robotics stack. -->
    <Section
      v-if="slug === 'programming'"
      eyebrow="The pathway"
      heading="From theory to real-world control."
    >
      <Reveal>
        <p class="max-w-2xl text-lg text-text-secondary">
          Every qtvue programmer follows the same six-step pathway. We hire at step one and
          grow people through the rest — because the only way to ship a reliable cell is to
          understand every layer from the math to the on-floor hand-off.
        </p>
      </Reveal>
      <div class="mt-10">
        <LearningPath />
      </div>
    </Section>

    <!-- BODY -->
    <!-- ClientOnly wraps ContentRenderer as a safety net: any hydration
         mismatch in @nuxt/content's renderer (which throws
         "Cannot read properties of null (reading 'nextSibling')" on
         some setups) is contained — the SSR HTML stays visible and
         the rich body content hydrates client-side. -->
    <Container class="py-12">
      <ClientOnly>
        <Reveal>
          <ContentRenderer :value="feature" class="prose max-w-none" />
        </Reveal>
        <template #fallback>
          <Reveal>
            <div class="prose max-w-none" v-html="feature?.body" />
          </Reveal>
        </template>
      </ClientOnly>
    </Container>

    <!-- RELATED -->
    <Section v-if="all && all.length > 1" tone="surface" eyebrow="More capabilities" heading="Other features.">
      <Reveal>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="f in all.filter(x => x.stem !== feature.stem).slice(0, 6)"
            :key="f.stem"
            :to="stemToRoute(f.stem)"
            class="group block rounded-2xl border border-border bg-bg p-5 transition-all hover:border-primary/40 hover:shadow-[var(--shadow-lg)]"
          >
            <div class="flex items-center gap-3">
              <div class="grid h-9 w-9 place-items-center rounded-lg bg-primary-50 text-primary">
                <Icon :name="f.icon" :size="18" />
              </div>
              <h3 class="text-sm font-bold tracking-tight text-text group-hover:text-primary">
                {{ f.title }}
              </h3>
            </div>
            <p class="mt-3 line-clamp-2 text-sm text-text-secondary">{{ f.summary }}</p>
          </NuxtLink>
        </div>
      </Reveal>
    </Section>

    <!-- CTA -->
    <Section bleed>
      <Reveal>
        <div class="grid gap-6 rounded-3xl border border-border bg-ink-bg p-10 sm:p-16 lg:grid-cols-2 lg:items-center">
          <div>
            <StatusPill text="Booking Q3 2026" tone="accent" />
            <h2 class="display-md mt-4 text-ink-text">
              Want <span class="text-accent">{{ feature.title.toLowerCase() }}</span> on your floor?
            </h2>
            <p class="mt-4 max-w-md text-ink-text/70">
              Tell us about your process. We'll tell you if it makes sense and what it costs.
            </p>
          </div>
          <div class="flex flex-col gap-3 lg:items-end">
            <Btn href="/contact" variant="accent" size="lg" arrow>Start a project</Btn>
            <p class="font-mono text-xs text-ink-text/50 lg:text-right">
              reply within 1 business day
            </p>
          </div>
        </div>
      </Reveal>
    </Section>
  </article>
</template>
