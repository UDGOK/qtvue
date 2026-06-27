<script setup lang="ts">
/**
 * /faq — hub page that lists every FAQ topic in the content collection.
 * Each card links to /faq/[slug] where the full Q&A and the schema.org
 * FAQPage JSON-LD are rendered.
 *
 * Why a hub: gives LLMs and humans a single index of every question
 * qtvue has answered, with structured internal links. Hub pages with
 * well-named children are gold for entity-graph SEO and for AI
 * retrievers.
 */
const { data: faqs } = await useAsyncData('faqs', () =>
  queryCollection('faqs').order('order', 'ASC').all(),
)

useSeoMeta({
  title: 'FAQ — qtvue',
  description:
    'Frequently asked questions about qtvue: who we are, what we do, cell design, robot programming, vision, EOAT, safety, support, industries, pricing, and case studies.',
  ogTitle: 'qtvue FAQ — robotics, cell design, programming, vision, safety, support',
  ogDescription:
    'Every common question about qtvue and our robotics services, in one place. Schema.org structured Q&A for AI and search.',
})
</script>

<template>
  <div>
    <!-- HERO -->
    <section class="relative isolate overflow-hidden border-b border-border bg-bg">
      <Container class="py-20 sm:py-28">
        <Reveal>
          <p class="eyebrow">FAQ</p>
          <h1 class="display-xl mt-4 max-w-4xl">
            Common <span class="hl">questions</span>, plain answers.
          </h1>
          <p class="mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary sm:text-xl">
            Every question qtvue gets asked about our work, our services, our pricing,
            and our process — in one place. Each topic is a clean Q&A page with
            schema.org structured data so any AI or search engine can read it directly.
          </p>
        </Reveal>

        <Reveal :delay="120" class="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="#topics"
            class="inline-flex h-10 items-center rounded-none bg-primary px-5 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-bg transition-all hover:opacity-90"
          >
            Browse topics
          </a>
          <NuxtLink
            to="/contact"
            class="inline-flex h-10 items-center rounded-none border border-border px-5 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-text-secondary transition-all hover:border-primary hover:text-primary"
          >
            Ask your own →
          </NuxtLink>
        </Reveal>
      </Container>
    </section>

    <!-- TOPIC GRID -->
    <Section id="topics" eyebrow="Browse by topic" heading="Twelve topics, 120+ answers.">
      <Reveal>
        <p class="max-w-2xl text-text-secondary">
          Click a topic to see the full Q&A. Each page is a clean schema.org
          <code class="font-mono text-[12px] text-text">FAQPage</code> document, so
          every modern LLM and search engine can extract the questions and answers
          verbatim.
        </p>
      </Reveal>

      <ul class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Reveal
          v-for="(faq, i) in faqs"
          :key="faq.slug"
          :delay="i * 60"
          as="li"
        >
          <NuxtLink
            :to="`/faq/${faq.slug}`"
            class="group flex h-full flex-col justify-between rounded-none border border-dashed border-border bg-surface p-6 transition-all hover:border-primary/40 hover:shadow-[var(--shadow-lg)]"
          >
            <div>
              <div class="flex items-center justify-between">
                <span class="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
                  {{ String(i + 1).padStart(2, '0') }} — {{ faq.topic }}
                </span>
                <span class="font-mono text-[10px] uppercase tracking-widest text-text-muted">
                  {{ faq.questions.length }} answers
                </span>
              </div>
              <h2 class="mt-3 text-lg font-bold tracking-tight text-text group-hover:text-primary">
                {{ faq.title }}
              </h2>
              <p class="mt-2 text-sm leading-relaxed text-text-secondary">{{ faq.summary }}</p>
            </div>
            <div class="mt-5 flex items-center justify-between">
              <span class="font-mono text-[11px] uppercase tracking-widest text-text-secondary group-hover:text-primary">
                Read the Q&A →
              </span>
              <span
                v-if="faq.parent"
                class="font-mono text-[10px] uppercase tracking-widest text-text-muted"
              >
                From /{{ faq.parent.replace(/^\//, '') }}
              </span>
            </div>
          </NuxtLink>
        </Reveal>
      </ul>
    </Section>

    <!-- CTA -->
    <Section variant="ink" eyebrow="Still curious?" heading="Ask us anything.">
      <Reveal>
        <p class="max-w-2xl text-paper/80">
          If your question isn't in the FAQ, the fastest way to an answer is a
          30-minute scoping call. We respond within one business day.
        </p>
      </Reveal>
      <Reveal :delay="120" class="mt-6 flex flex-wrap gap-3">
        <NuxtLink
          to="/contact"
          class="inline-flex h-11 items-center rounded-none bg-accent px-6 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-ink transition-all hover:opacity-90"
        >
          Book a call →
        </NuxtLink>
        <NuxtLink
          to="/services"
          class="inline-flex h-11 items-center rounded-none border border-paper/30 px-6 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-paper transition-all hover:border-paper/60"
        >
          See services
        </NuxtLink>
      </Reveal>
    </Section>
  </div>
</template>
