<script setup lang="ts">
/**
 * /faq/[slug] — per-topic FAQ page.
 *
 * Loads one FAQ document from the content collection by slug and
 * renders:
 *  1. The topic title and summary (greptile-style hero)
 *  2. The Q&A accordion via <FaqView>
 *  3. Cross-links to sibling FAQ topics for crawlers + humans
 *  4. A 'back to' link to the parent page (e.g. /features/cell-design)
 *
 * Schema.org FAQPage JSON-LD is emitted by <FaqView> into the head.
 */
const route = useRoute()
const slug = computed(() => String(route.params.slug))

const { data: faq } = await useAsyncData(`faq-${slug.value}`, () =>
  queryCollection('faqs').where('slug', '=', slug.value).first(),
)

if (!faq.value) {
  throw createError({ statusCode: 404, statusMessage: `No FAQ found for /${slug.value}` })
}

// Sibling topics for the cross-link grid
const { data: allFaqs } = await useAsyncData('all-faqs', () =>
  queryCollection('faqs').order('order', 'ASC').all(),
)
const siblings = computed(() =>
  (allFaqs.value ?? []).filter((f) => f.slug !== slug.value),
)

const siteUrl = 'https://qtvue.com'
const pageUrl = computed(() => `${siteUrl}/faq/${slug.value}`)

useSeoMeta({
  title: () => (faq.value ? `${faq.value.title} — qtvue FAQ` : 'FAQ — qtvue'),
  description: () => faq.value?.description ?? '',
  ogTitle: () => faq.value?.title ?? 'qtvue FAQ',
  ogDescription: () => faq.value?.description ?? '',
  ogUrl: () => pageUrl.value,
  twitterCard: 'summary',
})
</script>

<template>
  <div v-if="faq">
    <!-- HERO -->
    <section class="relative isolate overflow-hidden border-b border-border bg-bg">
      <Container class="py-16 sm:py-20">
        <Reveal>
          <div class="mb-4 flex items-center gap-2 text-[12px]">
            <NuxtLink to="/faq" class="font-mono uppercase tracking-[0.14em] text-text-muted hover:text-primary">
              ← All FAQs
            </NuxtLink>
            <span v-if="faq.parent" class="text-text-muted">·</span>
            <NuxtLink
              v-if="faq.parent"
              :to="faq.parent"
              class="font-mono uppercase tracking-[0.14em] text-text-muted hover:text-primary"
            >
              {{ faq.parent }}
            </NuxtLink>
          </div>
          <p class="eyebrow">{{ faq.topic }} FAQ</p>
          <h1 class="display-lg mt-3 max-w-4xl">{{ faq.title }}</h1>
          <p class="mt-5 max-w-2xl text-lg text-text-secondary sm:text-xl">{{ faq.summary }}</p>
          <p class="mt-4 font-mono text-[11px] uppercase tracking-widest text-text-muted">
            {{ faq.questions.length }} questions · schema.org/FAQPage
          </p>
        </Reveal>
      </Container>
    </section>

    <!-- Q&A -->
    <Section eyebrow="Questions" heading="The full Q&A.">
      <Reveal>
        <p class="max-w-2xl text-text-secondary">
          Every question is also emitted as
          <code class="font-mono text-[12px] text-text">application/ld+json</code> with a
          <code class="font-mono text-[12px] text-text">FAQPage</code> schema. AI crawlers,
          search engines, and accessibility tools can all consume the same structured data.
        </p>
      </Reveal>
      <div class="mt-10">
        <FaqView
          :questions="faq.questions"
          :url="pageUrl"
          :title="faq.title"
          :description="faq.description"
        />
      </div>
    </Section>

    <!-- SIBLINGS -->
    <Section eyebrow="More topics" heading="Other FAQs.">
      <ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Reveal
          v-for="(s, i) in siblings"
          :key="s.slug"
          :delay="i * 40"
          as="li"
        >
          <NuxtLink
            :to="`/faq/${s.slug}`"
            class="group flex h-full flex-col rounded-2xl border border-dashed border-border bg-surface p-5 transition-all hover:border-primary/40"
          >
            <span class="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
              {{ s.topic }}
            </span>
            <span class="mt-2 text-sm font-semibold text-text group-hover:text-primary">
              {{ s.title }}
            </span>
            <span class="mt-2 text-xs text-text-secondary">{{ s.summary }}</span>
            <span class="mt-3 font-mono text-[10px] uppercase tracking-widest text-text-secondary group-hover:text-primary">
              {{ s.questions.length }} answers →
            </span>
          </NuxtLink>
        </Reveal>
      </ul>
    </Section>

    <!-- CTA -->
    <Section variant="ink" eyebrow="Need more?" heading="Book a 30-minute call.">
      <Reveal>
        <p class="max-w-2xl text-paper/80">
          If your question isn't covered here, the fastest path to a real answer is a
          short scoping call. Free, no commitment, written summary whether or not
          you move forward.
        </p>
      </Reveal>
      <Reveal :delay="120" class="mt-6 flex flex-wrap gap-3">
        <NuxtLink
          to="/contact"
          class="inline-flex h-11 items-center rounded-full bg-accent px-6 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-ink transition-all hover:opacity-90"
        >
          Book a call →
        </NuxtLink>
        <NuxtLink
          v-if="faq.parent"
          :to="faq.parent"
          class="inline-flex h-11 items-center rounded-full border border-paper/30 px-6 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-paper transition-all hover:border-paper/60"
        >
          Back to {{ faq.parent }}
        </NuxtLink>
      </Reveal>
    </Section>
  </div>
</template>
