<script setup lang="ts">
/**
 * /platforms/[slug] — per-platform detail page. Specs, code snippet,
 * honest callouts, and the "submit your use case" CTA.
 */
const route = useRoute()
const slug = computed(() => String(route.params.slug))

const { data: platform } = await useAsyncData(`platform-${slug.value}`, () =>
  queryCollection('platforms').where('slug', '=', slug.value).first(),
)

if (!platform.value) {
  throw createError({ statusCode: 404, statusMessage: `No platform at /platforms/${slug.value}` })
}

const { data: allPlatforms } = await useAsyncData('all-platforms', () =>
  queryCollection('platforms').order('order', 'ASC').all(),
)
const siblings = computed(() => (allPlatforms.value ?? []).filter((p) => p.slug !== slug.value))

useSeoMeta({
  title: () => (platform.value ? `${platform.value.title} — qtvue` : 'Platform — qtvue'),
  description: () => platform.value?.summary ?? '',
})
</script>

<template>
  <div v-if="platform">
    <!-- HERO -->
    <section class="border-b border-border bg-bg">
      <Container class="py-16 sm:py-20">
        <Reveal>
          <div class="mb-4 text-[12px]">
            <NuxtLink
              to="/platforms"
              class="font-mono uppercase tracking-[0.14em] text-text-muted hover:text-primary"
            >
              ← All platforms
            </NuxtLink>
          </div>
          <div class="flex flex-wrap items-baseline justify-between gap-4">
            <h1 class="display-xl max-w-3xl">{{ platform.title }}</h1>
            <span class="font-mono text-sm uppercase tracking-widest text-text-secondary">
              {{ platform.priceFrom }}
            </span>
          </div>
          <p class="mt-5 max-w-2xl text-lg text-text-secondary sm:text-xl">{{ platform.summary }}</p>
          <div class="mt-5 flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-text-muted">
            <span>{{ platform.type }}</span>
            <span>·</span>
            <span>for {{ platform.whoItsFor }}</span>
          </div>
        </Reveal>
      </Container>
    </section>

    <!-- =============================================================
         IN THE WILD — demo video (only when one is published for
         this platform). Frame: dashed-border blueprint style; muted
         autoplay loop; "live" pill; click-to-play for users with
         prefers-reduced-motion. Stays above the specs section so the
         reader gets the "what it actually does" before the numbers.
         ============================================================= -->
    <Section
      v-if="platform.videoSrc"
      eyebrow="In the wild"
      heading="See it move."
    >
      <Reveal>
        <p class="max-w-2xl text-text-secondary">
          Real hardware, real environment, no edits. We tune the gait and
          balance for each platform; what you see is what we ship.
        </p>
      </Reveal>
      <Reveal :delay="120" class="mt-8">
        <DemoVideo
          :src="platform.videoSrc"
          :poster="platform.videoPoster"
          :label="`live · ${platform.title} demo`"
          mode="showcase"
          tint="forest"
          aspect="16/9"
        />
        <p
          v-if="platform.videoCaption"
          class="mt-3 font-mono text-[10px] uppercase tracking-widest text-text-muted"
        >
          {{ platform.videoCaption }}
        </p>
      </Reveal>
    </Section>

    <!-- =============================================================
         VIDEO GALLERY — additional clips, same themed treatment.
         Renders only when the platform has more than one clip to
         show (currently just the Go2 with outdoor / terrain / POV
         / lifestyle). Same mode + tint as the main video above so
         the gallery reads as one continuous design system.
         ============================================================= -->
    <Section
      v-if="platform.gallery?.length"
      eyebrow="In the field"
      heading="More clips."
    >
      <VideoGallery :clips="platform.gallery" />
    </Section>

    <!-- SPECS + CODE -->
    <Section eyebrow="Specs" heading="What it actually does.">
      <div class="grid gap-6 lg:grid-cols-2 lg:items-start">
        <!-- left: spec table + use cases + callouts -->
        <div class="space-y-6">
          <Reveal>
            <Card variant="default" pad="lg" class="border-dashed">
              <p class="eyebrow">Spec sheet</p>
              <dl class="mt-4 divide-y divide-border/60">
                <div
                  v-for="(s, i) in platform.specs"
                  :key="i"
                  class="flex items-baseline justify-between gap-4 py-3"
                >
                  <dt class="font-mono text-[11px] uppercase tracking-widest text-text-muted">
                    {{ s.k }}
                  </dt>
                  <dd class="text-sm font-medium text-text">{{ s.v }}</dd>
                </div>
              </dl>
            </Card>
          </Reveal>

          <Reveal :delay="80">
            <div>
              <p class="eyebrow">Use cases</p>
              <ul class="mt-3 space-y-2 text-sm text-text-secondary">
                <li
                  v-for="(u, i) in platform.useCases"
                  :key="i"
                  class="flex items-start gap-2"
                >
                  <span class="mt-1 inline-block h-1 w-1 shrink-0 rounded-full bg-primary" />
                  {{ u }}
                </li>
              </ul>
            </div>
          </Reveal>

          <Reveal v-if="platform.callouts?.length" :delay="160">
            <Card variant="default" pad="lg" class="border-dashed">
              <p class="eyebrow">Honest callouts</p>
              <ul class="mt-3 space-y-2 font-mono text-xs leading-relaxed text-text-secondary">
                <li v-for="(c, i) in platform.callouts" :key="i">· {{ c }}</li>
              </ul>
            </Card>
          </Reveal>
        </div>

        <!-- right: code snippet (the "code as hero" pattern) -->
        <Reveal :delay="120" class="lg:sticky lg:top-24">
          <CodeBlock
            v-if="platform.codeSnippet"
            :filename="platform.codeFilename || 'example.py'"
            :language="platform.codeLanguage || 'python'"
            :code="platform.codeSnippet"
            class="!shadow-[var(--shadow-lg)]"
          />
        </Reveal>
      </div>
    </Section>

    <!-- CTA -->
    <Section tone="ink" eyebrow="Get one" heading="Submit your use case.">
      <Reveal>
        <p class="max-w-2xl text-paper/80">
          Tell us what you want to do and we'll tell you whether this
          platform is the right one (and if not, which is).
        </p>
      </Reveal>
      <Reveal :delay="100" class="mt-6">
        <NuxtLink
          to="/intake"
          class="inline-flex h-11 items-center rounded-full bg-accent px-6 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-ink transition-all hover:opacity-90"
        >
          Submit your use case →
        </NuxtLink>
      </Reveal>
    </Section>

    <!-- SIBLINGS -->
    <Section eyebrow="Other platforms" heading="Compare the range.">
      <ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Reveal
          v-for="(s, i) in siblings"
          :key="s.slug"
          :delay="i * 40"
          as="li"
        >
          <NuxtLink
            :to="`/platforms/${s.slug}`"
            class="group flex h-full flex-col rounded-2xl border border-dashed border-border bg-surface p-5 transition-all hover:border-primary/40"
          >
            <span class="font-mono text-[10px] uppercase tracking-widest text-text-muted">
              {{ s.type }}
            </span>
            <span class="mt-2 text-sm font-semibold text-text group-hover:text-primary">
              {{ s.title }}
            </span>
            <span class="mt-2 text-xs text-text-secondary">{{ s.oneLiner }}</span>
            <span class="mt-3 font-mono text-[10px] uppercase tracking-widest text-text-secondary group-hover:text-primary">
              {{ s.priceFrom }} →
            </span>
          </NuxtLink>
        </Reveal>
      </ul>
    </Section>
  </div>
</template>
