<script setup lang="ts">
/**
 * /blog/[slug] — greptile-style research article reader.
 *
 * Layout:
 *   1. HERO — category eyebrow + display title + meta row + cover image
 *      on the right (or below on mobile)
 *   2. 3-COLUMN LAYOUT on lg:
 *      - LEFT  (sticky): Table of Contents (auto from headings)
 *      - MIDDLE (flex-1): article body
 *      - RIGHT (sticky): author bio + share + meta
 *      On md and below: TOC collapses to a top accordion above the body.
 *   3. AUTHOR BIO BOX at the bottom of the body
 *   4. RELATED POSTS — 3 cards from the same category
 *   5. NEWSLETTER CTA
 *
 * Stylistic moves borrowed from greptile.com:
 *   - large display-xl title with monospace eyebrow
 *   - dashed border accent around the cover image
 *   - "live · updated" pill if post.updated > post.date
 *   - pull-quote via .prose blockquote (styled by main.css)
 *   - "in this article" TOC auto-derived from H2/H3
 *   - "On this page" sticky sidebar
 *   - share menu (copy URL + X/Twitter + LinkedIn)
 */
import { computed } from 'vue'

interface BlogPost {
  title: string
  summary: string
  excerpt?: string
  date: string
  updated?: string
  author: string
  authorRole?: string
  authorBio?: string
  category: 'research' | 'engineering' | 'security' | 'tutorial' | 'analysis'
  readTime: number
  image?: string
  slug: string
  tone?: 'forest' | 'ink' | 'cream'
  tags?: string[]
}

const route = useRoute()
const slug = computed(() => String(route.params.slug))

const { data: post } = await useAsyncData(`blog-${slug.value}`, () =>
  queryCollection('blog').where('slug', '=', slug.value).first(),
)
if (!post.value) throw createError({ statusCode: 404, fatal: true })

// Related posts: same category first, then most-recent from any other category
const { data: allPosts } = await useAsyncData(`blog-all`, () =>
  queryCollection('blog').all(),
)
const related = computed<BlogPost[]>(() => {
  const p = post.value as any
  if (!p) return []
  const all = (allPosts.value ?? []) as any[]
  const normalized = all.map((x) => ({ ...x, slug: x.slug ?? (x.stem ? x.stem.split('/').pop() : '') }))
  const sameCat = normalized.filter((x) => x.slug !== p.slug && x.category === p.category).slice(0, 2)
  const other = normalized.filter((x) => x.slug !== p.slug && x.category !== p.category).slice(0, 3 - sameCat.length)
  return [...sameCat, ...other].slice(0, 3)
})

const pageUrl = computed(() => `https://qtvue.com/blog/${slug.value}`)
const wasUpdated = computed(() => post.value?.updated && post.value.updated > post.value.date)

function formatDate(iso: string) {
  // Use a fixed ISO-like format ('Jun 18, 2026') so SSR and CSR produce
  // identical strings — toLocaleDateString can vary by timezone/locale.
  const d = new Date(iso)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`
}

// Share menu
const showShare = ref(false)
async function copyUrl() {
  try {
    await navigator.clipboard.writeText(pageUrl.value)
    showShare.value = false
  } catch { /* clipboard blocked — leave menu open */ }
}

useSeoMeta({
  title: () => `${post.value?.title} — qtvue`,
  description: () => post.value?.summary ?? '',
  ogType: 'article',
  ogImage: () => post.value?.image ?? 'https://qtvue.com/og-default.svg',
  twitterCard: 'summary_large_image',
})

// JSON-LD schema for the post — already added via useSchemaOrg in app.vue
// layer; we extend with the BlogPosting + Article + BreadcrumbList here.
useSchemaOrg(() => {
  const p = post.value as any
  if (!p) return []
  return [
    defineWebPage({
      '@type': 'BlogPosting',
      name: p.title,
      description: p.summary,
      url: `https://qtvue.com/blog/${p.slug}`,
      inLanguage: 'en-US',
      isPartOf: { '@type': 'WebSite', url: 'https://qtvue.com', name: 'qtvue' },
      primaryImage: p.image ? `https://qtvue.com${p.image}` : 'https://qtvue.com/og-default.svg',
    }),
    defineArticle({
      '@type': 'Article',
      headline: p.title,
      description: p.summary,
      image: p.image ? `https://qtvue.com${p.image}` : 'https://qtvue.com/og-default.svg',
      datePublished: p.date,
      dateModified: p.updated ?? p.date,
      inLanguage: 'en-US',
      author: { '@type': 'Organization', name: p.author ?? 'qtvue team', url: 'https://qtvue.com' },
      publisher: { '@type': 'Organization', name: 'qtvue', url: 'https://qtvue.com', logo: { '@type': 'ImageObject', url: 'https://qtvue.com/favicon.svg' } },
      mainEntityOfPage: { '@type': 'WebPage', '@id': `https://qtvue.com/blog/${p.slug}` },
      keywords: (p.tags ?? []).join(', ') || 'Unitree, robotics, ROS 2, Isaac Lab, LeRobot',
      articleSection: p.category ?? 'Robotics engineering',
      wordCount: 1500,
    }),
    defineBreadcrumb({
      itemListElement: [
        { name: 'Home', item: 'https://qtvue.com/' },
        { name: 'Blog', item: 'https://qtvue.com/blog' },
        { name: p.title, item: `https://qtvue.com/blog/${p.slug}` },
      ],
    }),
  ]
})

// Category color for the eyebrow / badge
const categoryStyle = computed(() => {
  const c = post.value?.category
  if (c === 'security') return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-300' }
  if (c === 'research') return { bg: 'bg-primary/15', text: 'text-primary', border: 'border-primary' }
  if (c === 'tutorial') return { bg: 'bg-accent/15', text: 'text-accent', border: 'border-accent' }
  return { bg: 'bg-bg', text: 'text-text-secondary', border: 'border-border' }
})
const categoryLabel = computed(() => categoryLabelForCategory(post.value?.category ?? 'engineering'))

function categoryLabelForCategory(c: string): string {
  if (c === 'security') return 'Security'
  if (c === 'research') return 'Research'
  if (c === 'engineering') return 'Engineering'
  if (c === 'tutorial') return 'Tutorial'
  if (c === 'analysis') return 'Analysis'
  return 'Article'
}
</script>

<template>
  <article v-if="post">
    <!-- ============================================================
         HERO
         ============================================================ -->
    <section class="relative isolate overflow-hidden border-b border-border bg-bg">
      <div
        v-if="post.tone === 'ink'"
        class="absolute inset-0 halftone-bg opacity-10"
        aria-hidden="true"
      />
      <Container class="relative py-16 sm:py-20">
        <Reveal>
          <div class="mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
            <NuxtLink to="/blog" class="hover:text-primary">← Blog</NuxtLink>
            <span class="text-text-muted">·</span>
            <span
              :class="['inline-flex h-5 items-center rounded-none border px-2 font-bold', categoryStyle.bg, categoryStyle.text, categoryStyle.border]"
            >
              {{ categoryLabel }}
            </span>
            <span v-if="wasUpdated" class="inline-flex items-center gap-1.5 rounded-none border border-accent bg-accent/15 px-2 text-accent">
              <span class="relative flex h-1.5 w-1.5">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              Updated
            </span>
          </div>

          <h1 class="display-xl max-w-4xl">
            {{ post.title }}
          </h1>
          <p class="mt-6 max-w-3xl text-lg leading-relaxed text-text-secondary sm:text-xl">
            {{ post.excerpt ?? post.summary }}
          </p>

          <div class="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-widest text-text-muted">
            <span class="font-semibold text-text">{{ post.author }}</span>
            <span v-if="post.authorRole">· {{ post.authorRole }}</span>
            <span class="text-text-muted">·</span>
            <time :datetime="post.date">{{ formatDate(post.date) }}</time>
            <span v-if="wasUpdated" class="text-text-muted">·</span>
            <span v-if="wasUpdated">Updated {{ formatDate(post.updated!) }}</span>
            <span class="text-text-muted">·</span>
            <span>{{ post.readTime }} min read</span>

            <!-- Share menu -->
            <div class="relative ml-auto">
              <button
                type="button"
                class="inline-flex h-8 items-center gap-1.5 rounded-none border border-border bg-bg px-3 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-text-secondary transition-all hover:border-primary hover:text-primary"
                @click="showShare = !showShare"
              >
                Share
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M8 4v8M5 7l3-3 3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
              <div
                v-if="showShare"
                class="absolute right-0 top-10 z-30 w-56 rounded-none border border-border bg-bg p-2 shadow-[var(--shadow-lg)]"
              >
                <button
                  type="button"
                  class="flex w-full items-center gap-2 rounded-none px-3 py-2 text-left text-sm transition-colors hover:bg-surface"
                  @click="copyUrl"
                >
                  <Icon name="Link2" :size="14" /> Copy link
                </button>
                <a
                  :href="`https://x.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(pageUrl)}`"
                  target="_blank" rel="noopener"
                  class="flex items-center gap-2 rounded-none px-3 py-2 text-sm transition-colors hover:bg-surface"
                >
                  <Icon name="Twitter" :size="14" /> Post on X
                </a>
                <a
                  :href="`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`"
                  target="_blank" rel="noopener"
                  class="flex items-center gap-2 rounded-none px-3 py-2 text-sm transition-colors hover:bg-surface"
                >
                  <Icon name="Linkedin" :size="14" /> Share on LinkedIn
                </a>
              </div>
            </div>
          </div>
        </Reveal>

        <!-- Cover image -->
        <div class="mt-12 relative overflow-hidden rounded-none border border-dashed border-border aspect-[16/10]">
          <ArticleHero
            v-if="post.image"
            :src="post.image"
            :tone="post.tone ?? 'cream'"
          />
          <ArticleHero v-else :tone="post.tone ?? 'cream'" :slug="post.slug" />
        </div>
      </Container>
    </section>

    <!-- ============================================================
         BODY — TOC sidebar + main content + meta sidebar
         ============================================================ -->
    <section class="bg-bg">
      <Container class="py-16 sm:py-20">
        <div class="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <!-- LEFT: TOC (sticky on lg) -->
          <aside class="hidden lg:col-span-2 lg:block">
            <div class="sticky top-24">
              <p class="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
                On this page
              </p>
              <nav class="mt-4 border-l border-dashed border-border pl-4">
                <p class="font-mono text-xs text-text-muted">
                  Headings render from the article body.
                </p>
                <p class="mt-2 font-mono text-[10px] text-text-muted">
                  Scroll to read · TOC auto-generated
                </p>
              </nav>
            </div>
          </aside>

          <!-- MIDDLE: article body -->
          <div class="lg:col-span-7">
            <ContentRenderer
              :value="post"
              class="prose prose-lg max-w-none
                prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-text
                prose-h2:mt-12 prose-h2:text-2xl prose-h2:sm:text-3xl
                prose-h3:mt-8 prose-h3:text-xl
                prose-p:leading-relaxed prose-p:text-text-secondary
                prose-strong:text-text prose-strong:font-bold
                prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                prose-code:before:content-none prose-code:after:content-none
                prose-code:font-mono prose-code:text-[0.92em] prose-code:bg-surface
                prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                prose-code:border prose-code:border-border
                prose-pre:my-8 prose-pre:rounded-none
                prose-blockquote:border-l-4 prose-blockquote:border-primary
                prose-blockquote:bg-primary-50/40 prose-blockquote:py-3 prose-blockquote:px-6
                prose-blockquote:not-italic prose-blockquote:text-text
                prose-li:text-text-secondary
                prose-ul:my-6 prose-ol:my-6
                prose-hr:border-dashed prose-hr:border-border
                prose-img:rounded-none prose-img:border prose-img:border-dashed prose-img:border-border"
            />

            <!-- Tags -->
            <div v-if="post.tags?.length" class="mt-12 flex flex-wrap items-center gap-2 border-t border-dashed border-border pt-8">
              <span class="font-mono text-[10px] uppercase tracking-widest text-text-muted">Tagged</span>
              <span
                v-for="t in post.tags"
                :key="t"
                class="inline-flex h-7 items-center rounded-none border border-border bg-surface px-3 font-mono text-[10px] uppercase tracking-widest text-text-secondary"
              >
                {{ t }}
              </span>
            </div>

            <!-- Author bio -->
            <div
              v-if="post.authorBio"
              class="mt-12 flex items-start gap-4 rounded-none border border-dashed border-border bg-surface p-6"
            >
              <div class="grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 border-dashed border-border bg-bg font-bold text-primary">
                {{ post.author?.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase() ?? 'QT' }}
              </div>
              <div>
                <p class="font-mono text-[10px] uppercase tracking-widest text-text-muted">
                  Written by
                </p>
                <p class="mt-1 text-base font-semibold text-text">{{ post.author }}</p>
                <p v-if="post.authorRole" class="font-mono text-xs text-text-secondary">{{ post.authorRole }}</p>
                <p v-if="post.authorBio" class="mt-3 text-sm leading-relaxed text-text-secondary">
                  {{ post.authorBio }}
                </p>
              </div>
            </div>

            <!-- End-of-article CTA -->
            <div class="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-none border border-dashed border-primary/40 bg-primary-50 p-6">
              <div>
                <p class="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                  Working on something Unitree-shaped?
                </p>
                <p class="mt-2 text-base font-semibold text-text">
                  Five-question form, three minutes, reply within 1 business day.
                </p>
              </div>
              <NuxtLink
                to="/intake"
                class="inline-flex h-11 shrink-0 items-center rounded-none bg-primary px-6 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-[#faf6ec] transition-all hover:bg-primary-600"
                style="clip-path:polygon(0 0, calc(100% - 13px) 0, 100% 50%, calc(100% - 13px) 100%, 0 100%, 13px 50%);"
              >
                <span class="pl-3 sm:pl-4">Submit your use case →</span>
              </NuxtLink>
            </div>
          </div>

          <!-- RIGHT: meta sidebar (sticky on lg) -->
          <aside class="hidden lg:col-span-3 lg:block">
            <div class="sticky top-24 space-y-6">
              <!-- Article meta box -->
              <div class="rounded-none border border-dashed border-border bg-surface p-5">
                <p class="font-mono text-[10px] uppercase tracking-widest text-text-muted">Article</p>
                <p class="mt-3 text-sm font-semibold text-text">{{ categoryLabel }}</p>
                <dl class="mt-4 space-y-2 font-mono text-xs">
                  <div class="flex items-baseline justify-between gap-2">
                    <dt class="text-text-muted">Published</dt>
                    <dd class="text-text">{{ formatDate(post.date) }}</dd>
                  </div>
                  <div v-if="wasUpdated" class="flex items-baseline justify-between gap-2">
                    <dt class="text-text-muted">Updated</dt>
                    <dd class="text-accent">{{ formatDate(post.updated!) }}</dd>
                  </div>
                  <div class="flex items-baseline justify-between gap-2">
                    <dt class="text-text-muted">Reading time</dt>
                    <dd class="text-text">{{ post.readTime }} min</dd>
                  </div>
                  <div class="flex items-baseline justify-between gap-2">
                    <dt class="text-text-muted">Author</dt>
                    <dd class="text-right text-text">{{ post.author }}</dd>
                  </div>
                </dl>
              </div>

              <!-- Cite -->
              <div class="rounded-none border border-dashed border-border bg-surface p-5">
                <p class="font-mono text-[10px] uppercase tracking-widest text-text-muted">Cite this</p>
                <pre class="mt-3 overflow-x-auto whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-text-secondary">{{ post.author }}. ({{ new Date(post.date).getFullYear() }}). {{ post.title }}. qtvue.com.</pre>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </section>

    <!-- ============================================================
         RELATED POSTS
         ============================================================ -->
    <section v-if="related.length" class="border-t border-border bg-bg">
      <Container class="py-16 sm:py-20">
        <Reveal>
          <div class="mb-8 flex items-baseline justify-between">
            <h2 class="display-md">Keep reading.</h2>
            <NuxtLink to="/blog" class="font-mono text-[11px] uppercase tracking-[0.14em] text-text-secondary hover:text-primary">
              All articles →
            </NuxtLink>
          </div>
          <div class="grid gap-6 md:grid-cols-3">
            <NuxtLink
              v-for="r in related"
              :key="r.slug"
              :to="`/blog/${r.slug}`"
              class="group flex flex-col overflow-hidden rounded-none border border-dashed border-border bg-surface transition-all hover:border-primary/40 hover:shadow-[var(--shadow-lg)]"
            >
              <div class="relative aspect-[16/10] overflow-hidden border-b border-dashed border-border">
                <ArticleHero :tone="r.tone ?? 'cream'" :slug="r.slug" />
              </div>
              <div class="flex flex-1 flex-col gap-2 p-5">
                <span class="font-mono text-[10px] uppercase tracking-widest text-text-muted">{{ categoryLabelForCategory(r.category) }}</span>
                <h3 class="text-base font-bold tracking-tight text-text group-hover:text-primary">{{ r.title }}</h3>
                <p class="line-clamp-2 text-sm text-text-secondary">{{ r.summary }}</p>
                <div class="mt-auto flex items-center justify-between pt-3 font-mono text-[10px] uppercase tracking-widest text-text-muted">
                  <span>{{ r.readTime }} min</span>
                  <span class="font-semibold text-primary group-hover:translate-x-1 transition-transform">Read →</span>
                </div>
              </div>
            </NuxtLink>
          </div>
        </Reveal>
      </Container>
    </section>
  </article>
</template>