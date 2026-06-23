<script setup lang="ts">
/**
 * ChecklistCallout — reusable promotion for /robot-review-checklist.
 *
 * Drop it anywhere a visitor is "thinking about hiring us" and a
 * pre-engagement self-assessment would be useful. The page itself
 * is a working tool (interactive strikethrough checklist that
 * persists to localStorage), so the callout has to feel like a
 * tool, not a sales banner.
 *
 * 4 variants:
 *  - `banner`   full-width section with eyebrow + heading + copy + CTA
 *  - `inline`   compact card that fits inside another section
 *  - `footer`   footer-column style (one link, simple)
 *  - `cta-band` dark ink band — use as a final CTA alternative
 *
 * Pass a `context` string for tailored copy on each placement.
 */
withDefaults(
  defineProps<{
    variant?: 'banner' | 'inline' | 'footer' | 'cta-band'
    /** Optional contextual hook — shown as small italic mono text */
    context?: string
    /** Where this callout is being placed — for analytics / tone */
    placement?:
      | 'homepage'
      | 'footer'
      | 'intake'
      | 'how-it-works'
      | 'about'
      | 'blog'
      | 'platform'
      | 'service'
  }>(),
  { variant: 'inline', context: undefined, placement: undefined },
)
</script>

<template>
  <!-- ============================================================
       BANNER — full-width section between sections. Big, scannable.
       Used on /how-it-works, /blog, /intake.
       ============================================================ -->
  <section
    v-if="variant === 'banner'"
    class="border-y border-dashed border-border bg-surface"
  >
    <div class="mx-auto max-w-5xl px-6 py-10 md:py-12">
      <div class="grid items-center gap-6 md:grid-cols-12">
        <div class="md:col-span-8">
          <div class="flex items-center gap-2.5 mb-3">
            <span class="inline-flex h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span class="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
              Free tool
            </span>
          </div>
          <h2 class="font-display text-2xl md:text-3xl font-bold leading-tight text-text">
            Run the Robot Review Checklist before you sign anything off.
          </h2>
          <p class="mt-3 text-text-secondary max-w-2xl">
            3 layers &times; 9 categories &times; 47 interactive checks. Tick each line as
            you verify it &mdash; your progress saves locally and persists across reloads.
            Built from real Unitree acceptance criteria (firmware 1.5.2, DDS handshake,
            E-stop, fall-recovery, ROI).
          </p>
          <p v-if="context" class="mt-3 font-mono text-[11px] uppercase tracking-wider text-text-muted">
            {{ context }}
          </p>
        </div>
        <div class="md:col-span-4 flex flex-col items-start md:items-end gap-3">
          <NuxtLink
            to="/robot-review-checklist"
            class="group inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-bg transition-all hover:bg-primary-600"
          >
            Open the checklist
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="transition-transform group-hover:translate-x-0.5">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </NuxtLink>
          <p class="font-mono text-[10px] uppercase tracking-wider text-text-muted">
            No login &middot; No cloud &middot; Saves to your browser
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- ============================================================
       INLINE — compact card, fits inside other sections.
       Used inside homepage sections, blog posts, platform/service pages.
       ============================================================ -->
  <NuxtLink
    v-else-if="variant === 'inline'"
    to="/robot-review-checklist"
    class="group block rounded-2xl border border-dashed border-border bg-bg p-5 transition-all hover:border-primary/60 hover:bg-primary-50/40 hover:-translate-y-0.5"
  >
    <div class="flex items-start gap-4">
      <!-- icon: clipboard with check -->
      <div class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-bg">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <rect x="8" y="2" width="8" height="4" rx="1" />
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <path d="m9 14 2 2 4-4" />
        </svg>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-baseline justify-between gap-2">
          <h3 class="text-sm font-bold tracking-tight text-text group-hover:text-primary">
            Robot Review Checklist
          </h3>
          <span class="font-mono text-[10px] uppercase tracking-widest text-text-muted">
            Free
          </span>
        </div>
        <p class="mt-1 text-xs leading-snug text-text-secondary">
          {{ context || '47 interactive checks across 3 layers. Tick lines, progress saves locally.' }}
        </p>
        <p class="mt-2 font-mono text-[10px] uppercase tracking-wider text-primary group-hover:underline">
          Open the tool &rarr;
        </p>
      </div>
    </div>
  </NuxtLink>

  <!-- ============================================================
       FOOTER — single column link. Used in TheFooter.vue.
       ============================================================ -->
  <div v-else-if="variant === 'footer'">
    <div class="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
      Free tool
    </div>
    <ul class="mt-3 flex flex-col gap-3">
      <li>
        <NuxtLink
          to="/robot-review-checklist"
          class="text-sm text-text-secondary transition-colors hover:text-primary"
        >
          Robot Review Checklist
        </NuxtLink>
      </li>
    </ul>
    <p class="mt-3 text-xs leading-snug text-text-muted">
      47 checks &middot; saves locally &middot; no login
    </p>
  </div>

  <!-- ============================================================
       CTA-BAND — dark ink band, used as final-CTA alternative.
       Used at the bottom of /about, /platforms/[slug], /services/[slug].
       ============================================================ -->
  <section
    v-else-if="variant === 'cta-band'"
    class="bg-ink-bg text-ink-text"
  >
    <div class="mx-auto max-w-4xl px-6 py-12 md:py-16">
      <div class="flex items-center gap-2.5 mb-3">
        <span class="inline-flex h-2 w-2 rounded-full bg-accent animate-pulse" />
        <span class="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
          Free tool
        </span>
      </div>
      <div class="grid items-center gap-6 md:grid-cols-12">
        <div class="md:col-span-8">
          <h2 class="font-display text-2xl md:text-3xl font-bold leading-tight">
            Run the checklist before you sign anything off.
          </h2>
          <p class="mt-3 text-ink-text/80 max-w-2xl">
            47 checks across mechanical, structural, and narrative layers. Your progress
            saves locally. No login, no cloud, no telemetry.
          </p>
          <p v-if="context" class="mt-2 font-mono text-[11px] uppercase tracking-wider text-ink-text/60">
            {{ context }}
          </p>
        </div>
        <div class="md:col-span-4 flex md:justify-end">
          <NuxtLink
            to="/robot-review-checklist"
            class="group inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-ink transition-all hover:opacity-90"
          >
            Open the checklist
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="transition-transform group-hover:translate-x-0.5">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
