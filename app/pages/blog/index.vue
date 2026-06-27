<script setup lang="ts">
/**
 * /blog — greptile-style research feed.
 *
 * Layout (matches greptile.com/feed at the time of writing):
 *   1. Eyebrow + display heading + subhead
 *   2. FEATURED — one large card (latest featured + pinned post)
 *   3. CATEGORY FILTER — pill bar that filters the grid client-side
 *   4. ARTICLE GRID — 3-col on lg, 2-col on md, 1-col on mobile
 *      with cover image, category badge, title, summary, meta
 *   5. NEWSLETTER — "Stay in the loop" CTA
 *
 * State lives in a single `activeCategory` ref. Filtering is reactive,
 * no roundtrip. Articles are loaded once via useAsyncData and the
 * categories are computed once from the data.
 */
import { computed, ref } from 'vue'

interface BlogPost {
  title: string
  summary: string
  date: string
  updated?: string
  author: string
  category: 'research' | 'engineering' | 'security' | 'tutorial' | 'analysis'
  readTime: number
  image?: string
  slug: string
  pinned?: boolean
  featured?: boolean
  tags?: string[]
  tone?: 'forest' | 'ink' | 'cream'
}

const { data: rawPosts } = await useAsyncData('blog-index-v2', () =>
  queryCollection('blog').order('date', 'DESC').all(),
)

// Normalize the content collection entries into a typed shape with
// guaranteed slug + category + readTime + image.
const posts = computed<BlogPost[]>(() => {
  const raw = (rawPosts.value ?? []) as any[]
  return raw.map((p) => ({
    title: p.title,
    summary: p.summary,
    date: p.date,
    updated: p.updated,
    author: p.author ?? 'qtvue team',
    category: p.category ?? 'engineering',
    readTime: p.readTime ?? 6,
    image: p.image,
    slug: p.slug ?? (p.stem ? p.stem.split('/').pop() : ''),
    pinned: p.pinned ?? false,
    featured: p.featured ?? false,
    tags: p.tags ?? [],
    tone: p.tone ?? 'cream',
  }))
})

// Featured: prefer pinned, else most-recent featured, else most-recent
const featured = computed(() => {
  const list = posts.value
  const pinned = list.find((p) => p.pinned)
  if (pinned) return pinned
  const f = list.find((p) => p.featured)
  if (f) return f
  return list[0]
})

// Categories for the filter bar — driven by what the content actually has.
const categoryLabels: Record<BlogPost['category'], { label: string; desc: string }> = {
  research:   { label: 'Research',     desc: 'Original measurement & analysis' },
  engineering:{ label: 'Engineering',  desc: 'How we ship' },
  security:   { label: 'Security',     desc: 'Threats, posture, and patches' },
  tutorial:   { label: 'Tutorial',     desc: 'Step-by-step reproductions' },
  analysis:   { label: 'Analysis',     desc: 'Industry & market observations' },
}
const categories = computed(() => {
  const present = new Set(posts.value.map((p) => p.category))
  return (['research', 'engineering', 'security', 'tutorial', 'analysis'] as const).filter((c) =>
    present.has(c),
  )
})
const activeCategory = ref<'all' | BlogPost['category']>('all')

// Filtered list (excluding the featured post, since it's already in the hero)
const filtered = computed(() => {
  const list = posts.value.filter((p) => p.slug !== featured.value?.slug)
  if (activeCategory.value === 'all') return list
  return list.filter((p) => p.category === activeCategory.value)
})

function formatDate(iso: string) {
  // Use a fixed format so SSR and CSR produce identical strings
  // (toLocaleDateString can vary by timezone/locale and cause
  // hydration mismatches).
  const d = new Date(iso)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`
}
function isoToDate(iso: string) {
  return new Date(iso).getTime()
}

useSeoMeta({
  title: 'Research feed — qtvue',
  description:
    'Original research, engineering notes, and security analysis on Unitree robotics. From the qtvue engineering team.',
  ogType: 'website',
})

// Blog schema — mark this as a Blog (ItemList of BlogPostings) so
// AI engines surface it as a coherent publication, not just a page.
useSchemaOrg(() => {
  const list = posts.value
  return [
    defineWebPage({
      '@type': 'CollectionPage',
      name: 'qtvue research feed',
      description:
        'Original research, engineering notes, and security analysis on Unitree robotics. From the qtvue engineering team.',
      url: 'https://qtvue.com/blog',
      inLanguage: 'en-US',
      isPartOf: { '@type': 'WebSite', url: 'https://qtvue.com', name: 'qtvue' },
      primaryImage: 'https://qtvue.com/og-default.svg',
    }),
    {
      '@type': 'ItemList',
      name: 'qtvue blog posts',
      itemListOrder: 'https://schema.org/ItemListOrderDescending',
      numberOfItems: list.length,
      itemListElement: list.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `https://qtvue.com/blog/${p.slug}`,
        name: p.title,
        description: p.summary,
        datePublished: p.date,
        author: p.author,
      })),
    },
    defineBreadcrumb({
      itemListElement: [
        { name: 'Home', item: 'https://qtvue.com/' },
        { name: 'Blog', item: 'https://qtvue.com/blog' },
      ],
    }),
  ]
})
</script>

<template>
  <div>
    <!-- ============================================================
         HERO
         ============================================================ -->
    <section class="relative isolate overflow-hidden border-b border-border bg-bg">
      <div class="absolute inset-0 -z-10 halftone-bg opacity-30" aria-hidden="true" />
      <Container class="relative py-20 sm:py-28">
        <Reveal>
          <div class="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
            <span class="relative flex h-1.5 w-1.5">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            Research feed
            <span class="text-text-muted">·</span>
            <span>{{ posts.length }} articles</span>
            <span class="text-text-muted">·</span>
            <span>updated {{ formatDate(posts[0]?.updated ?? posts[0]?.date ?? '2026-06-22') }}</span>
          </div>
          <h1 class="display-xl max-w-4xl">
            Notes from the <span class="hl">workbench</span>.
          </h1>
          <p class="mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary sm:text-xl">
            Original research, engineering deep-dives, and security analysis on
            Unitree robotics. Written by the engineers who ship the work.
          </p>
          <div class="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#feed"
              class="group relative inline-flex h-11 items-center rounded-none bg-primary px-6 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-[#faf6ec] transition-all hover:bg-primary-600"
              style="clip-path:polygon(0 0, calc(100% - 13px) 0, 100% 50%, calc(100% - 13px) 100%, 0 100%, 13px 50%);"
            >
              <span class="pl-3 sm:pl-4">Browse the feed</span>
            </a>
            <NuxtLink
              to="/intake"
              class="inline-flex h-11 items-center rounded-none border border-border bg-bg px-5 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-text-secondary transition-all hover:border-primary hover:text-primary"
            >
              Submit your use case
            </NuxtLink>
          </div>
        </Reveal>
      </Container>
    </section>

    <!-- ============================================================
         FREE TOOL CALLOUT — sits between the hero and the featured
         article. Blog readers are the most qualified visitors on
         the site (they chose to read 45-min deep-dives). A working
         checklist is exactly the artifact a serious reader wants
         to bookmark.
         ============================================================ -->
    <ChecklistCallout
      variant="banner"
      context="Most bookmarked page on the site · 47 checks · no login"
      placement="blog"
    />

    <!-- ============================================================
         FEATURED ARTICLE (greptile pattern: big cover + meta + CTAs)
         ============================================================ -->
    <section v-if="featured" class="relative border-b border-border bg-bg">
      <Container class="py-16 sm:py-20">
        <Reveal>
          <div class="mb-6 flex items-baseline justify-between">
            <p class="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
              // Featured · {{ categoryLabels[featured.category].label }}
            </p>
            <NuxtLink
              :to="`/blog/${featured.slug}`"
              class="font-mono text-[11px] uppercase tracking-[0.14em] text-text-secondary hover:text-primary"
            >
              Read article →
            </NuxtLink>
          </div>

          <NuxtLink
            :to="`/blog/${featured.slug}`"
            class="group grid gap-8 rounded-none border border-dashed border-border bg-surface p-4 transition-all hover:border-primary/40 hover:shadow-[var(--shadow-lg)] lg:grid-cols-12 lg:p-6"
          >
            <!-- Cover / hero illustration -->
            <div class="relative aspect-[16/10] overflow-hidden rounded-none border border-dashed border-border lg:col-span-7">
              <ArticleHero
                v-if="featured.image"
                :src="featured.image"
                :tone="featured.tone ?? 'cream'"
              />
              <ArticleHero v-else :tone="featured.tone ?? 'cream'" :slug="featured.slug" />
              <div class="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-primary/5" />
            </div>

            <!-- Title + body -->
            <div class="flex flex-col justify-center lg:col-span-5">
              <div class="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-text-muted">
                <span>{{ categoryLabels[featured.category].label }}</span>
                <span class="text-text-muted">·</span>
                <span>{{ featured.readTime }} min read</span>
                <span class="text-text-muted">·</span>
                <span>{{ formatDate(featured.date) }}</span>
              </div>
              <h2 class="display-md text-text group-hover:text-primary">
                {{ featured.title }}
              </h2>
              <p class="mt-4 text-base leading-relaxed text-text-secondary sm:text-lg">
                {{ featured.summary }}
              </p>
              <div class="mt-6 flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-widest">
                <span class="font-semibold text-text">{{ featured.author }}</span>
                <span class="text-text-muted">·</span>
                <span class="inline-flex items-center gap-1.5 text-primary">
                  Read the article
                  <span class="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                </span>
              </div>
            </div>
          </NuxtLink>
        </Reveal>
      </Container>
    </section>

    <!-- ============================================================
         CATEGORY FILTER BAR
         ============================================================ -->
    <section id="feed" class="sticky top-16 z-20 border-b border-border bg-bg/95 backdrop-blur supports-[backup-filter]:bg-bg/80">
      <Container class="py-4">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex flex-wrap items-center gap-2">
            <span class="mr-1 font-mono text-[10px] uppercase tracking-widest text-text-muted">Filter</span>
            <button
              type="button"
              :class="[
                'inline-flex h-8 items-center rounded-none border px-3 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] transition-all',
                activeCategory === 'all'
                  ? 'border-primary bg-primary text-[#faf6ec]'
                  : 'border-border bg-bg text-text-secondary hover:border-primary hover:text-primary',
              ]"
              @click="activeCategory = 'all'"
            >
              All
              <span class="ml-1.5 rounded-none bg-bg/20 px-1.5 py-px text-[9px]">{{ posts.length }}</span>
            </button>
            <button
              v-for="cat in categories"
              :key="cat"
              type="button"
              :class="[
                'inline-flex h-8 items-center rounded-none border px-3 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] transition-all',
                activeCategory === cat
                  ? 'border-primary bg-primary text-[#faf6ec]'
                  : 'border-border bg-bg text-text-secondary hover:border-primary hover:text-primary',
              ]"
              :title="categoryLabels[cat].desc"
              @click="activeCategory = cat"
            >
              {{ categoryLabels[cat].label }}
              <span class="ml-1.5 rounded-none bg-bg/20 px-1.5 py-px text-[9px]">
                {{ posts.filter((p) => p.category === cat).length }}
              </span>
            </button>
          </div>
          <span class="font-mono text-[10px] uppercase tracking-widest text-text-muted">
            Showing {{ filtered.length }} of {{ posts.length - 1 }}
          </span>
        </div>
      </Container>
    </section>

    <!-- ============================================================
         ARTICLE GRID
         ============================================================ -->
    <section class="bg-bg">
      <Container class="py-16 sm:py-20">
        <div v-if="filtered.length === 0" class="rounded-none border border-dashed border-border bg-surface p-12 text-center">
          <p class="font-mono text-[10px] uppercase tracking-widest text-text-muted">No articles in this category yet.</p>
          <p class="mt-3 text-lg text-text-secondary">More coming. Try another filter.</p>
        </div>
        <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Reveal v-for="p in filtered" :key="p.slug" class="h-full">
            <NuxtLink
              :to="`/blog/${p.slug}`"
              class="group flex h-full flex-col overflow-hidden rounded-none border border-dashed border-border bg-surface transition-all hover:border-primary/40 hover:shadow-[var(--shadow-lg)]"
            >
              <!-- Cover / hero illustration -->
              <div class="relative aspect-[16/10] overflow-hidden border-b border-dashed border-border">
                <ArticleHero
                  v-if="p.image"
                  :src="p.image"
                  :tone="p.tone ?? 'cream'"
                />
                <ArticleHero v-else :tone="p.tone ?? 'cream'" :slug="p.slug" />
                <div class="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-primary/5" />
                <span
                  :class="[
                    'absolute left-3 top-3 inline-flex h-6 items-center rounded-none border px-2.5 font-mono text-[10px] font-bold uppercase tracking-widest backdrop-blur',
                    p.category === 'security'   && 'border-red-300 bg-red-50 text-red-700',
                    p.category === 'research'   && 'border-primary bg-primary/15 text-primary',
                    p.category === 'engineering'&& 'border-border bg-bg/85 text-text',
                    p.category === 'tutorial'   && 'border-accent bg-accent/15 text-accent',
                    p.category === 'analysis'   && 'border-border bg-bg/85 text-text-secondary',
                  ]"
                >
                  {{ categoryLabels[p.category].label }}
                </span>
              </div>

              <div class="flex flex-1 flex-col gap-3 p-5">
                <h3 class="text-lg font-bold tracking-tight text-text group-hover:text-primary">
                  {{ p.title }}
                </h3>
                <p class="line-clamp-3 text-sm leading-relaxed text-text-secondary">
                  {{ p.summary }}
                </p>

                <div class="mt-auto flex flex-wrap items-center gap-2 pt-4 font-mono text-[10px] uppercase tracking-widest text-text-muted">
                  <span>{{ formatDate(p.date) }}</span>
                  <span class="text-text-muted/50">·</span>
                  <span>{{ p.readTime }} min</span>
                  <span class="text-text-muted/50">·</span>
                  <span class="truncate">{{ p.author }}</span>
                  <span class="ml-auto inline-flex items-center gap-1 font-semibold text-primary transition-transform group-hover:translate-x-1">
                    Read <span aria-hidden="true">→</span>
                  </span>
                </div>
              </div>
            </NuxtLink>
          </Reveal>
        </div>
      </Container>
    </section>

    <!-- ============================================================
         NEWSLETTER CTA
         ============================================================ -->
    <section class="border-t border-border bg-ink-bg text-ink-text">
      <Container class="py-20 sm:py-24">
        <Reveal>
          <div class="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div class="lg:col-span-7">
              <p class="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                // Subscribe
              </p>
              <h2 class="display-md mt-3 text-paper">
                Stay in the loop.
              </h2>
              <p class="mt-4 max-w-xl text-base leading-relaxed text-paper/80">
                New research, security advisories, and engineering notes from
                our team. One email per piece of research — no marketing.
              </p>
            </div>
            <div class="lg:col-span-5">
              <form class="flex flex-col gap-3" @submit.prevent>
                <label class="block">
                  <span class="sr-only">Email</span>
                  <input
                    type="email"
                    required
                    placeholder="you@company.com"
                    class="w-full rounded-none border border-paper/20 bg-paper/5 px-5 py-3 text-paper placeholder-paper/40 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </label>
                <button
                  type="submit"
                  class="inline-flex h-12 items-center justify-center rounded-none bg-accent px-6 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-ink transition-all hover:bg-paper"
                >
                  Subscribe — one email per research piece
                </button>
                <p class="font-mono text-[10px] uppercase tracking-widest text-paper/50">
                  No spam. Unsubscribe with one click.
                </p>
              </form>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  </div>
</template>