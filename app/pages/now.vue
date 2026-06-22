<script setup lang="ts">
/**
 * /now — public "what we're working on" timeline.
 *
 * Layout:
 *   1. Hero with current status pill (large) + last-updated timestamp
 *   2. RECENT TIMELINE — full list of recent entries with timestamps,
 *      mood chips, and optional links
 *   3. EXPLAINER — how the user can post their own updates (greptile-style
 *      "open source by default" transparency)
 *
 * Reads /now.json via useNow(). No SSR fetch — client-side only,
 * because the file is updated by an external CLI and we want
 * instant updates without a Vercel rebuild.
 */
const { data, hasCurrent, currentText, currentMood, recent, updated, refresh } = useNow()

// JSON-LD for the page
useSeoMeta({
  title: 'Now — qtvue',
  description: 'What we are working on at qtvue right now. Live updates from the engineering team.',
  ogType: 'website',
})

useSchemaOrg(() => {
  const items = []
  if (data.value?.current) items.push({
    '@type': 'ListItem',
    position: 1,
    name: data.value.current.text,
    description: data.value.current.mood,
    datePublished: data.value.current.postedAt,
  })
  if (data.value?.recent) {
    data.value.recent.forEach((entry, i) => {
      items.push({
        '@type': 'ListItem',
        position: items.length + 1,
        name: entry.text,
        description: entry.mood,
        datePublished: entry.postedAt,
        url: entry.link ? `https://qtvue.com${entry.link}` : undefined,
      })
    })
  }
  return [
    defineWebPage({
      '@type': 'CollectionPage',
      name: 'Now — qtvue',
      description: 'What we are working on at qtvue right now. Live updates from the engineering team.',
      url: 'https://qtvue.com/now',
      inLanguage: 'en-US',
      isPartOf: { '@type': 'WebSite', url: 'https://qtvue.com', name: 'qtvue' },
      primaryImage: 'https://qtvue.com/og-default.svg',
    }),
    {
      '@type': 'ItemList',
      name: 'qtvue workbench updates',
      itemListElement: items,
    },
    defineBreadcrumb({
      itemListElement: [
        { name: 'Home', item: 'https://qtvue.com/' },
        { name: 'Now', item: 'https://qtvue.com/now' },
      ],
    }),
  ]
})

function formatRelative(iso: string) {
  if (!iso) return ''
  const d = new Date(iso)
  const diff = Date.now() - d.getTime()
  const min = Math.round(diff / 60_000)
  const hr = Math.round(diff / 3_600_000)
  const day = Math.round(diff / 86_400_000)
  if (min < 1) return 'just now'
  if (min < 60) return `${min}m ago`
  if (hr < 24) return `${hr}h ago`
  if (day < 7) return `${day}d ago`
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function formatAbsolute(iso: string) {
  if (!iso) return ''
  const d = new Date(iso)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()} · ${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')} UTC`
}

function moodLabel(mood: string) {
  const map: Record<string, string> = {
    'shipping':       'Shipping',
    'shipping-fast':  'Shipping fast',
    'thinking':       'Thinking',
    'investigating':  'Investigating',
    'live':           'Live',
    'reading':        'Reading',
    'engineering':    'Engineering',
    'bugfix':         'Bug fix',
    'seo':            'SEO',
  }
  return map[mood] || mood
}

function moodStyle(mood: string) {
  switch (mood) {
    case 'shipping-fast':  return 'bg-accent text-bg'
    case 'live':           return 'bg-red-500 text-paper'
    case 'investigating':  return 'bg-amber-500 text-bg'
    case 'thinking':       return 'bg-ink-bg text-paper'
    case 'reading':        return 'bg-surface-2 text-text-secondary'
    case 'bugfix':         return 'bg-red-50 text-red-700'
    case 'seo':            return 'bg-primary/15 text-primary'
    default:               return 'bg-primary text-paper'
  }
}
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
            Now · Live workbench feed
            <span v-if="updated" class="text-text-muted">·</span>
            <span v-if="updated">last updated {{ formatRelative(updated) }}</span>
          </div>
          <h1 class="display-xl max-w-4xl">
            What we're <span class="hl">working on</span> right now.
          </h1>
          <p class="mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary sm:text-xl">
            Live updates from the engineering workbench. No marketing, no
            scheduling — what we're actually shipping, thinking about, or
            debugging today.
          </p>
        </Reveal>

        <!-- Current status, big -->
        <Reveal v-if="hasCurrent" :delay="150">
          <div class="mt-10 flex flex-col gap-3 rounded-3xl border border-dashed border-border bg-surface p-6 sm:flex-row sm:items-center sm:gap-6 sm:p-8">
            <span
              :class="[
                'inline-flex h-12 shrink-0 items-center justify-center rounded-full px-5 font-mono text-xs font-bold uppercase tracking-[0.14em]',
                moodStyle(currentMood),
              ]"
            >
              <span class="relative flex h-1.5 w-1.5 mr-2" aria-hidden="true">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
                <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
              </span>
              {{ moodLabel(currentMood) }}
            </span>
            <div class="flex-1">
              <p class="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
                Current
              </p>
              <p class="mt-1 text-xl font-semibold leading-snug text-text sm:text-2xl">
                {{ currentText }}
              </p>
            </div>
            <NuxtLink
              v-if="recent && recent.length"
              to="#timeline"
              class="inline-flex h-10 shrink-0 items-center rounded-full border border-border bg-bg px-5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-text-secondary transition-all hover:border-primary hover:text-primary"
            >
              See timeline →
            </NuxtLink>
          </div>
        </Reveal>

        <Reveal v-else :delay="150">
          <div class="mt-10 rounded-3xl border border-dashed border-border bg-surface p-8">
            <p class="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
              Current
            </p>
            <p class="mt-2 text-xl text-text-secondary">
              No status posted right now. Check back in a bit, or subscribe
              to the RSS feed below.
            </p>
          </div>
        </Reveal>
      </Container>
    </section>

    <!-- ============================================================
         TIMELINE
         ============================================================ -->
    <section id="timeline" class="bg-bg">
      <Container class="py-16 sm:py-20">
        <Reveal>
          <div class="mb-8 flex items-baseline justify-between">
            <h2 class="display-md">Timeline.</h2>
            <button
              type="button"
              class="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-bg px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-text-secondary transition-all hover:border-primary hover:text-primary"
              @click="refresh(true)"
            >
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8a5 5 0 0 1 8.5-3.5L13 3M13 8a5 5 0 0 1-8.5 3.5L3 13M13 3v3h-3M3 13v-3h3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              Refresh
            </button>
          </div>

          <div v-if="!recent || recent.length === 0" class="rounded-2xl border border-dashed border-border bg-surface p-12 text-center">
            <p class="font-mono text-[10px] uppercase tracking-widest text-text-muted">No history yet.</p>
            <p class="mt-3 text-lg text-text-secondary">First update will appear here.</p>
          </div>

          <ol v-else class="relative space-y-4">
            <!-- Vertical timeline rule -->
            <span
              aria-hidden="true"
              class="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-primary/40 via-border to-transparent sm:left-[23px]"
            />
            <li
              v-for="entry in recent"
              :key="entry.id"
              class="relative flex gap-4 rounded-2xl border border-dashed border-border bg-surface p-5 pl-12 transition-all hover:border-primary/40 sm:gap-6 sm:p-6 sm:pl-14"
            >
              <!-- Timeline dot -->
              <span
                :class="[
                  'absolute left-[12px] top-7 grid h-4 w-4 shrink-0 place-items-center rounded-full border-2 border-bg sm:left-[14px]',
                  moodStyle(entry.mood).replace('text-paper', 'text-paper'),
                ]"
                :style="{ backgroundColor: 'currentColor' }"
                aria-hidden="true"
              >
                <span class="h-1.5 w-1.5 rounded-full bg-bg" />
              </span>

              <div class="flex-1 min-w-0">
                <div class="mb-2 flex flex-wrap items-center gap-2">
                  <span
                    :class="[
                      'inline-flex h-5 items-center rounded-full px-2 font-mono text-[9px] font-bold uppercase tracking-widest',
                      moodStyle(entry.mood),
                    ]"
                  >
                    {{ moodLabel(entry.mood) }}
                  </span>
                  <span class="font-mono text-[10px] uppercase tracking-widest text-text-muted">
                    {{ formatRelative(entry.postedAt) }}
                  </span>
                  <span class="font-mono text-[10px] text-text-muted/60">·</span>
                  <time
                    :datetime="entry.postedAt"
                    :title="formatAbsolute(entry.postedAt)"
                    class="font-mono text-[10px] uppercase tracking-widest text-text-muted"
                  >
                    {{ formatAbsolute(entry.postedAt) }}
                  </time>
                </div>
                <p class="text-base leading-relaxed text-text">
                  {{ entry.text }}
                </p>
                <NuxtLink
                  v-if="entry.link"
                  :to="entry.link"
                  class="mt-3 inline-flex items-center gap-1 font-mono text-[11px] font-semibold uppercase tracking-widest text-primary hover:underline"
                >
                  Read more
                  <span aria-hidden="true">→</span>
                </NuxtLink>
              </div>
            </li>
          </ol>
        </Reveal>
      </Container>
    </section>

    <!-- ============================================================
         EXPLAINER — how the user can post their own updates
         ============================================================ -->
    <section class="border-t border-border bg-bg">
      <Container class="py-16 sm:py-20">
        <Reveal>
          <div class="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div class="lg:col-span-5">
              <p class="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                // Open by default
              </p>
              <h2 class="display-md mt-3">Post from your PC.</h2>
              <p class="mt-4 text-base leading-relaxed text-text-secondary">
                This page is driven by a single file —{' '}
                <code class="font-mono text-[0.92em] bg-surface border border-border px-1.5 py-0.5 rounded">public/now.json</code>{' '}
                — that lives in the qtvue repo. There's a tiny CLI on your PC
                that updates the file and pushes to GitHub. Vercel
                auto-deploys. That's it.
              </p>
            </div>
            <div class="lg:col-span-7">
              <div class="rounded-2xl border border-dashed border-border bg-surface p-6">
                <div class="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-text-muted">
                  <span class="h-2 w-2 rounded-full bg-accent" />
                  Quick setup
                </div>
                <ol class="space-y-4 font-mono text-[13px] leading-relaxed text-text-secondary">
                  <li>
                    <span class="text-primary font-bold">1.</span>
                    <span class="ml-2">Clone the repo or just copy <code class="bg-bg border border-border px-1.5 py-0.5 rounded">scripts/now.sh</code> to your PC.</span>
                  </li>
                  <li>
                    <span class="text-primary font-bold">2.</span>
                    <span class="ml-2">Set <code class="bg-bg border border-border px-1.5 py-0.5 rounded">export GITHUB_TOKEN=&lt;pat&gt;</code> in your shell rc (token needs <code class="bg-bg border border-border px-1.5 py-0.5 rounded">repo</code> scope).</span>
                  </li>
                  <li>
                    <span class="text-primary font-bold">3.</span>
                    <span class="ml-2">Run <code class="bg-bg border border-border px-1.5 py-0.5 rounded">now &quot;Wiring up the firmware auditor&quot; shipping</code></span>
                  </li>
                  <li>
                    <span class="text-primary font-bold">4.</span>
                    <span class="ml-2">Refresh qtvue.com — your status is live in ~30s.</span>
                  </li>
                </ol>
                <p class="mt-6 font-mono text-[10px] uppercase tracking-widest text-text-muted">
                  → <NuxtLink to="/docs" class="text-primary hover:underline">Full docs</NuxtLink>
                  <span class="mx-2">·</span>
                  <NuxtLink to="/blog" class="text-primary hover:underline">Long-form research</NuxtLink>
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  </div>
</template>