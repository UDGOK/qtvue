<script setup lang="ts">
const { t } = useI18n()
const year = new Date().getFullYear()

/**
 * Footer link columns, rebuilt for the v2 brief:
 *   - No "Work" / "Industries" / fake case-study links (deleted)
 *   - Services column = the four service lines (Sell / Program / Integrate / Security)
 *   - Single CTA in the company column: Submit use case
 */
const cols = [
  {
    heading: 'Platforms',
    links: [
      { label: 'All platforms', to: '/platforms' },
      { label: 'Go2',           to: '/platforms/go2' },
      { label: 'B2',            to: '/platforms/b2' },
      { label: 'G1',            to: '/platforms/g1' },
      { label: 'H1 / H2',       to: '/platforms/h1' },
    ],
  },
  {
    heading: 'Services',
    links: [
      { label: 'Sell',                  to: '/services/sell' },
      { label: 'Program',               to: '/services/program' },
      { label: 'Integrate',             to: '/services/integrate' },
      { label: 'Security & Hardening',  to: '/services/security' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About',         to: '/about' },
      { label: 'How it works',  to: '/how-it-works' },
      { label: 'Blog',          to: '/blog' },
      { label: 'Careers',       to: '/careers' },
      { label: 'Submit use case', to: '/intake' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy', to: '/legal/privacy' },
      { label: 'Terms',   to: '/legal/terms' },
    ],
  },
]
</script>

<template>
  <footer class="border-t border-border bg-bg">
    <div class="border-b border-border">
      <Container class="flex flex-col items-start justify-between gap-6 py-10 sm:flex-row sm:items-center">
        <div class="flex flex-col gap-3">
          <StatusPill text="Pre-launch · booking assessments" tone="primary" />
          <p class="font-display text-2xl font-extrabold tracking-tight text-text sm:text-3xl">
            Tell us what you want to do.
          </p>
          <p class="max-w-md text-sm text-text-secondary">
            Submit your use case. Engineering review within 1 business day.
            Free, no commitment.
          </p>
        </div>
        <NuxtLink
          to="/intake"
          class="inline-flex h-11 items-center rounded-full bg-primary px-6 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-bg transition-all hover:opacity-90"
        >
          Submit your use case →
        </NuxtLink>
      </Container>
    </div>

    <Container class="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-6">
      <div class="lg:col-span-2">
        <Logo variant="full" />
        <p class="mt-4 max-w-xs text-sm text-text-secondary">
          A Unitree robotics specialist. Pre-launch. Practitioner-led.
        </p>
        <div class="mt-6 flex items-center gap-3">
          <a
            v-for="social in [
              { label: 'GitHub',   href: '#', path: 'M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.5-.3-5.2-1.3-5.2-5.6 0-1.2.4-2.3 1.2-3.1-.1-.3-.5-1.5.1-3 0 0 1-.3 3.2 1.2.9-.3 1.9-.4 2.9-.4s2 .1 2.9.4c2.2-1.5 3.2-1.2 3.2-1.2.6 1.5.2 2.7.1 3 .7.8 1.2 1.9 1.2 3.1 0 4.4-2.7 5.4-5.2 5.6.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z' },
              { label: 'LinkedIn', href: '#', path: 'M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8.5h4.56V24H.22V8.5zM8.34 8.5h4.37v2.12h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.48 3.04 5.48 7v8.74h-4.56v-7.75c0-1.85-.03-4.24-2.58-4.24-2.58 0-2.98 2.02-2.98 4.1V24H8.34V8.5z' },
            ]"
            :key="social.label"
            :href="social.href"
            :aria-label="social.label"
            class="grid h-9 w-9 place-items-center rounded-full border border-border text-text-secondary transition-all hover:border-primary hover:text-primary"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path :d="social.path" />
            </svg>
          </a>
        </div>
      </div>

      <div
        v-for="col in cols"
        :key="col.heading"
        class="flex flex-col gap-3 lg:col-span-1"
      >
        <div class="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
          {{ col.heading }}
        </div>
        <NuxtLink
          v-for="l in col.links"
          :key="l.to"
          :to="l.to"
          class="text-sm text-text-secondary transition-colors hover:text-primary"
        >
          {{ l.label }}
        </NuxtLink>
      </div>
    </Container>

    <div class="border-t border-border">
      <Container class="flex flex-col items-start justify-between gap-2 py-6 sm:flex-row sm:items-center">
        <p class="font-mono text-xs text-text-muted">
          © {{ year }} qtvue · pre-launch
        </p>
        <p class="font-mono text-xs text-text-muted">
          v2.0 · built with Nuxt & Three.js
        </p>
      </Container>
    </div>
  </footer>
</template>
