<script setup lang="ts">
const { t } = useI18n()
const year = new Date().getFullYear()

const cols = [
  {
    heading: 'Services',
    links: [
      { label: 'Robotics Integration', to: '/services/integration' },
      { label: 'Robot Programming', to: '/services/programming' },
      { label: 'Robot Sales', to: '/services/sales' },
      { label: 'Feasibility & Consulting', to: '/services/consulting' },
    ],
  },
  {
    heading: 'Work',
    links: [
      { label: 'Case studies', to: '/work' },
      { label: 'Industries', to: '/industries' },
      { label: 'Welding', to: '/industries/welding' },
      { label: 'Packaging', to: '/industries/packaging' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Blog', to: '/blog' },
      { label: 'Careers', to: '/careers' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy', to: '/legal/privacy' },
      { label: 'Terms', to: '/legal/terms' },
    ],
  },
]
</script>

<template>
  <footer class="border-t border-border bg-bg">
    <!-- top: newsletter / status strip -->
    <div class="border-b border-border">
      <Container class="flex flex-col items-start justify-between gap-6 py-10 sm:flex-row sm:items-center">
        <div class="flex flex-col gap-3">
          <StatusPill text="Operational · 24/7 support" tone="primary" />
          <p class="font-display text-2xl font-extrabold tracking-tight text-text sm:text-3xl">
            Robots don't sleep. Neither do we.
          </p>
          <p class="max-w-md text-sm text-text-secondary">
            Subscribe for monthly notes on robotics, automation, and the future of work — straight from our engineers.
          </p>
        </div>
        <form class="flex w-full max-w-sm items-center gap-2 sm:w-auto" @submit.prevent>
          <input
            type="email"
            placeholder="you@company.com"
            class="h-11 flex-1 rounded-full border border-border bg-surface px-4 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:w-72"
            aria-label="Email address"
          />
          <Btn variant="primary" size="md" arrow>Subscribe</Btn>
        </form>
      </Container>
    </div>

    <!-- middle: brand + nav columns -->
    <Container class="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-6">
      <div class="lg:col-span-2">
        <Logo variant="full" />
        <p class="mt-4 max-w-xs text-sm text-text-secondary">
          {{ t('footer.tagline') }}
        </p>
        <div class="mt-6 flex items-center gap-3">
          <a
            v-for="social in [
              { label: 'GitHub', href: '#', path: 'M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.5-.3-5.2-1.3-5.2-5.6 0-1.2.4-2.3 1.2-3.1-.1-.3-.5-1.5.1-3 0 0 1-.3 3.2 1.2.9-.3 1.9-.4 2.9-.4s2 .1 2.9.4c2.2-1.5 3.2-1.2 3.2-1.2.6 1.5.2 2.7.1 3 .7.8 1.2 1.9 1.2 3.1 0 4.4-2.7 5.4-5.2 5.6.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z' },
              { label: 'LinkedIn', href: '#', path: 'M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8.5h4.56V24H.22V8.5zM8.34 8.5h4.37v2.12h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.48 3.04 5.48 7v8.74h-4.56v-7.75c0-1.85-.03-4.24-2.58-4.24-2.58 0-2.98 2.02-2.98 4.1V24H8.34V8.5z' },
              { label: 'X', href: '#', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
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

    <!-- bottom: legal line -->
    <div class="border-t border-border">
      <Container class="flex flex-col items-start justify-between gap-2 py-6 sm:flex-row sm:items-center">
        <p class="font-mono text-xs text-text-muted">
          © {{ year }} qtvue, Inc. {{ t('footer.rights') }}
        </p>
        <p class="font-mono text-xs text-text-muted">
          v2.0 · built with Nuxt & Three.js
        </p>
      </Container>
    </div>
  </footer>
</template>
