<script setup lang="ts">
/**
 * /pricing — qtvue engagement pricing.
 *
 * Greptile's pricing page, adapted for pre-launch Unitree robotics
 * services. Exact design language: ALL-CAPS giant headline, dashed
 * border hero frame, bracket-prefixed plan labels, hex-chevron CTAs,
 * diagonal-hatch section dividers, ✓ feature lists, FAQ accordion.
 *
 * Content adaptation (qtvue has 4 service lines, not 2 SaaS tiers):
 *
 *   TOP TIER — main engagement models (greptile: Pro + Enterprise)
 *     1. ENGAGEMENT  — project-based, fixed price (greptile "Pro")
 *     2. PARTNERSHIP — recurring retainer, dedicated team (greptile "Enterprise")
 *
 *   BOTTOM TIER — special programs (greptile: OSS + Startup)
 *     3. RESEARCH & ACADEMIA  — free for qualified labs (greptile "OSS")
 *     4. PILOT DISCOUNT       — 50% off first engagement (greptile "Startup")
 *
 * Per the brief: prices show "Coming soon" / "Q3 2026" because we're
 * pre-launch and the user wants the page up now. The feature lists
 * and deliverables are real — only the dollar amounts are TBD.
 *
 * "From 2035" details (intentional, not gimmicks):
 *   - We show *capacity transparency* (4 of 8 Q3 slots filled)
 *   - We show *what the budget actually buys* (deliverable list, not fluff)
 *   - We show *where the cost goes* (engineer time, hardware, ops)
 *   - No "most popular" badges, no fake urgency
 *   - The CTA is the only conversion path: /intake
 */

useSeoMeta({
  title: 'Pricing — Engagement-based Unitree robotics services | qtvue',
  description:
    'Engagement-based pricing for Unitree robotics services. Project-based engagements and recurring partnerships. Pre-launch — public pricing in Q3 2026.',
  ogTitle: 'qtvue Pricing — Engagement-based Unitree robotics services',
  ogDescription:
    'Project-based engagements and recurring partnerships. 4 service lines. 8 platforms. Pre-launch.',
})

useSchemaOrg([
  defineWebPage({
    '@type': 'WebPage',
    name: 'qtvue Pricing — Engagement-based Unitree robotics services',
    description: 'Project-based engagements and recurring partnerships. 4 service lines. 8 platforms. Pre-launch pricing.',
    url: 'https://qtvue.com/pricing',
    inLanguage: 'en-US',
    isPartOf: { '@type': 'WebSite', url: 'https://qtvue.com', name: 'qtvue' },
    primaryImage: 'https://qtvue.com/og-default.svg',
  }),
  defineBreadcrumb({
    itemListElement: [
      { name: 'Home', item: 'https://qtvue.com/' },
      { name: 'Pricing', item: 'https://qtvue.com/pricing' },
    ],
  }),
  {
    '@type': 'AggregateOffer',
    name: 'qtvue Engagement Pricing',
    description: 'Engagement-based pricing for Unitree robotics services. Pre-launch — public pricing in Q3 2026.',
    offerCount: 4,
    priceCurrency: 'USD',
    offers: [
      {
        '@type': 'Offer',
        name: 'Engagement (project-based)',
        description: 'Fixed-price project engagement for a defined scope. Programming, integration, and deployment on Unitree hardware.',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          priceCurrency: 'USD',
          description: 'Coming soon — Q3 2026',
        },
      },
      {
        '@type': 'Offer',
        name: 'Partnership (recurring)',
        description: 'Recurring retainer with a dedicated engineering team. Ongoing optimization, fleet support, monthly hours.',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          priceCurrency: 'USD',
          description: 'Custom — contact us',
        },
      },
      {
        '@type': 'Offer',
        name: 'Research & Academia',
        description: 'Free for qualified non-commercial research labs and university programs using Unitree platforms.',
          priceSpecification: {
          '@type': 'UnitPriceSpecification',
          priceCurrency: 'USD',
          price: '0',
          description: 'Free for qualified research labs',
        },
      },
      {
        '@type': 'Offer',
        name: 'Pilot Discount',
        description: '50% off first engagement for our first 5 customers. Help us refine the offering, get a meaningful discount.',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          priceCurrency: 'USD',
          description: '50% off first engagement (first 5 customers)',
        },
      },
    ],
  },
  {
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'When will public pricing be available?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Public pricing is scheduled for Q3 2026. Until then, every engagement is scoped individually and quoted from the intake form. Pre-launch pricing is intentionally transparent: you see the engagement model, the deliverables, and the cost drivers before you commit.',
        },
      },
      {
        '@type': 'Question',
        name: 'How is engagement pricing structured?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Engagements are fixed-price, scoped against a written SOW you can share with your CTO, security team, or finance. The SOW lists every deliverable, the acceptance criteria, and the cost drivers. You own the program source, the design files, and the documentation. No subscriptions, no per-seat fees.',
        },
      },
      {
        '@type': 'Question',
        name: 'What does the Partnership retainer include?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A Partnership engagement reserves a dedicated engineering team for a monthly block of hours. The hours can be split across any of our 4 service lines (Sell, Program, Integrate, Security). Carry-over hours, multi-robot fleet support, and ongoing sim-to-real policy updates are included.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you offer academic or research pricing?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Qualified non-commercial research labs and university robotics programs get free programming and integration support for Unitree platforms. We ask for a short write-up of the research use case and, in return, we get a citation in your published work where appropriate.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the pilot discount?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our first 5 customers get 50% off their first engagement. The pilot helps us validate the engagement model against real use cases, and gives you a meaningful discount in exchange for being an early reference. The discount applies to one engagement only, not recurring partnerships.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I cancel or change an engagement?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Project-based engagements can be paused or canceled at any milestone boundary with 5 business days notice. Partnership retainers can be paused or canceled at the end of any month with 15 days notice. You retain ownership of all program source, design files, and documentation we produce, regardless of cancellation.',
        },
      },
    ],
  },
])

/* ===========================================================================
   FAQ interactive state (accordion)
   =========================================================================== */
const openFaq = ref<number | null>(0)
function toggleFaq(i: number) {
  openFaq.value = openFaq.value === i ? null : i
}

const faqs = [
  {
    q: 'When will public pricing be available?',
    a: "Public pricing is scheduled for Q3 2026. Until then, every engagement is scoped individually and quoted from the intake form. Pre-launch pricing is intentionally transparent: you see the engagement model, the deliverables, and the cost drivers before you commit.",
  },
  {
    q: 'How is engagement pricing structured?',
    a: "Engagements are fixed-price, scoped against a written SOW you can share with your CTO, security team, or finance. The SOW lists every deliverable, the acceptance criteria, and the cost drivers. You own the program source, the design files, and the documentation. No subscriptions, no per-seat fees.",
  },
  {
    q: 'What does the Partnership retainer include?',
    a: "A Partnership engagement reserves a dedicated engineering team for a monthly block of hours. The hours can be split across any of our 4 service lines (Sell, Program, Integrate, Security). Carry-over hours, multi-robot fleet support, and ongoing sim-to-real policy updates are included.",
  },
  {
    q: 'Do you offer academic or research pricing?',
    a: "Yes. Qualified non-commercial research labs and university robotics programs get free programming and integration support for Unitree platforms. We ask for a short write-up of the research use case and, in return, we get a citation in your published work where appropriate.",
  },
  {
    q: 'What is the pilot discount?',
    a: "Our first 5 customers get 50% off their first engagement. The pilot helps us validate the engagement model against real use cases, and gives you a meaningful discount in exchange for being an early reference. The discount applies to one engagement only, not recurring partnerships.",
  },
  {
    q: 'How do I cancel or change an engagement?',
    a: "Project-based engagements can be paused or canceled at any milestone boundary with 5 business days notice. Partnership retainers can be paused or canceled at the end of any month with 15 days notice. You retain ownership of all program source, design files, and documentation we produce, regardless of cancellation.",
  },
]

/* ===========================================================================
   "From 2035" detail: capacity transparency
   =========================================================================== */
const capacity = {
  q3: { total: 8, filled: 4, open: 4 },
  q4: { total: 12, filled: 2, open: 10 },
  pilotSlotsRemaining: 5, // first-5-customers discount
}
</script>

<template>
  <div class="bg-bg text-text">
    <!-- ====================================================================
         HERO — greptile's giant ALL-CAPS title with dashed border frame
         and decorative grid pattern in the corners
         ==================================================================== -->
    <section class="relative overflow-hidden border-b border-dashed border-border">
      <!-- decorative grid pattern in left/right corners (greptile signature) -->
      <div
        class="pointer-events-none absolute inset-y-0 left-0 hidden w-8 md:block"
        aria-hidden="true"
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="pricing-grid-left" width="6" height="6" patternUnits="userSpaceOnUse">
              <path d="M 6 0 L 0 0 0 6" fill="none" stroke="currentColor" stroke-width="0.5" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pricing-grid-left)" class="text-text-muted" />
        </svg>
      </div>
      <div
        class="pointer-events-none absolute inset-y-0 right-0 hidden w-8 md:block"
        aria-hidden="true"
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="pricing-grid-right" width="6" height="6" patternUnits="userSpaceOnUse">
              <path d="M 6 0 L 0 0 0 6" fill="none" stroke="currentColor" stroke-width="0.5" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pricing-grid-right)" class="text-text-muted" />
        </svg>
      </div>
      <!-- dashed vertical rule (greptile) -->
      <div
        class="pointer-events-none absolute inset-y-0 left-8 hidden border-l border-dashed border-border md:block"
        aria-hidden="true"
      />
      <div
        class="pointer-events-none absolute inset-y-0 right-8 hidden border-r border-dashed border-border md:block"
        aria-hidden="true"
      />

      <Container class="relative py-20 text-center sm:py-28">
        <Reveal>
          <p class="eyebrow">Pricing</p>
          <h1 class="mt-4 font-display text-[clamp(3rem,10vw,8rem)] font-extrabold leading-[0.9] tracking-tight text-text">
            QTVUE PRICING
          </h1>
          <p class="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary sm:text-xl">
            Engagement-based pricing for Unitree robotics. Project work and recurring partnerships. Public pricing Q3 2026.
          </p>
          <div class="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <NuxtLink
              to="/intake"
              class="group relative inline-flex h-12 items-center font-mono text-xs font-semibold uppercase tracking-[0.12em] text-bg transition-all duration-200 bg-primary hover:bg-primary-600"
              style="clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 0 100%, 16px 50%); padding-left: 28px; padding-right: 32px;"
            >
              Submit your use case
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="ml-2 transition-transform group-hover:translate-x-0.5">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </NuxtLink>
            <NuxtLink
              to="/how-it-works"
              class="inline-flex h-12 items-center rounded-full border border-border px-6 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-text-secondary transition-all hover:border-primary hover:text-primary"
            >
              How it works
            </NuxtLink>
          </div>
        </Reveal>
      </Container>
    </section>

    <!-- ====================================================================
         FREE TOOL CALLOUT — before the pricing tiers, so visitors
         who've already used the checklist see the page as "a quote
         for the work my self-assessment surfaces". Mirrors the
         pattern from /intake, /how-it-works, /blog.
         ==================================================================== -->
    <ChecklistCallout
      variant="banner"
      context="On the conversion path · pre-pricing self-assessment"
      placement="intake"
    />

    <!-- ====================================================================
         DIAGONAL HATCH DIVIDER (greptile section break)
         ==================================================================== -->
    <div class="relative h-6 overflow-hidden border-b border-border" aria-hidden="true">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" class="absolute inset-0">
        <defs>
          <pattern id="pricing-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="currentColor" stroke-width="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pricing-hatch)" class="text-text-muted/50" />
      </svg>
    </div>

    <!-- ====================================================================
         TWO MAIN PLAN CARDS — greptile: Pro + Enterprise
         ==================================================================== -->
    <section class="border-b border-border">
      <Container class="py-16 sm:py-20">
        <div class="grid gap-px md:grid-cols-2 bg-border rounded-2xl overflow-hidden border border-border">
          <!-- ============================================================
               PLAN 1: ENGAGEMENT (project-based, greptile "Pro")
               ============================================================ -->
          <article class="relative bg-bg p-8 md:p-10">
            <div class="flex items-baseline gap-2">
              <span class="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">[</span>
              <p class="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
                Engagement
              </p>
              <span class="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">]</span>
            </div>
            <p class="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-text-secondary">
              Project-based · Fixed price
            </p>
            <h2 class="mt-6 font-display text-6xl font-extrabold leading-none text-text sm:text-7xl">
              Coming soon
            </h2>
            <p class="mt-3 font-mono text-sm text-text-secondary">
              <span class="text-text-muted">/</span>project <span class="text-text-muted">·</span> Q3 2026 public launch
            </p>

            <div class="my-8 border-t border-dashed border-border" />

            <ul class="space-y-3.5">
              <li class="flex items-start gap-3 text-[15px] text-text">
                <svg class="mt-1 h-4 w-4 shrink-0 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Programming (unitree_sdk2 / unitree_ros2 / Isaac Lab)</span>
              </li>
              <li class="flex items-start gap-3 text-[15px] text-text">
                <svg class="mt-1 h-4 w-4 shrink-0 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Integration (DDS, ROS 2, fleet management)</span>
              </li>
              <li class="flex items-start gap-3 text-[15px] text-text">
                <svg class="mt-1 h-4 w-4 shrink-0 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Sim-to-real pipeline (Isaac Lab + LeRobot / Diffusion Policy)</span>
              </li>
              <li class="flex items-start gap-3 text-[15px] text-text">
                <svg class="mt-1 h-4 w-4 shrink-0 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Custom policy training + real-hardware validation</span>
              </li>
              <li class="flex items-start gap-3 text-[15px] text-text">
                <svg class="mt-1 h-4 w-4 shrink-0 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Operator runbook + 30-day on-site warranty</span>
              </li>
              <li class="flex items-start gap-3 text-[15px] text-text">
                <svg class="mt-1 h-4 w-4 shrink-0 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>You own the program source, design files, and documentation</span>
              </li>
              <li class="flex items-start gap-3 text-[15px] text-text">
                <svg class="mt-1 h-4 w-4 shrink-0 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Written SOW with line-item pricing + acceptance criteria</span>
              </li>
            </ul>

            <div class="mt-10 border-t border-dashed border-border pt-8">
              <NuxtLink
                to="/intake"
                class="group relative inline-flex h-11 w-full items-center justify-center font-mono text-xs font-semibold uppercase tracking-[0.12em] text-ink transition-all duration-200 bg-accent hover:opacity-90"
                style="clip-path: polygon(0 0, calc(100% - 13px) 0, 100% 50%, calc(100% - 13px) 100%, 0 100%, 13px 50%); padding-left: 22px; padding-right: 28px;"
              >
                <span class="pl-3 sm:pl-4">Submit your use case</span>
              </NuxtLink>
            </div>
          </article>

          <!-- ============================================================
               PLAN 2: PARTNERSHIP (recurring, greptile "Enterprise")
               ============================================================ -->
          <article class="relative bg-bg p-8 md:p-10">
            <div class="flex items-baseline gap-2">
              <span class="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">[</span>
              <p class="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
                Partnership
              </p>
              <span class="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">]</span>
            </div>
            <p class="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-text-secondary">
              Recurring retainer · Dedicated team
            </p>
            <h2 class="mt-6 font-display text-6xl font-extrabold leading-none text-text sm:text-7xl">
              Custom
            </h2>
            <p class="mt-3 font-mono text-sm text-text-secondary">
              <span class="text-text-muted">/</span>month <span class="text-text-muted">·</span> reserved capacity
            </p>

            <div class="my-8 border-t border-dashed border-border" />

            <ul class="space-y-3.5">
              <li class="flex items-start gap-3 text-[15px] text-text">
                <svg class="mt-1 h-4 w-4 shrink-0 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Reserved monthly engineering hours, all 4 service lines</span>
              </li>
              <li class="flex items-start gap-3 text-[15px] text-text">
                <svg class="mt-1 h-4 w-4 shrink-0 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Multi-robot fleet support (homogeneous or mixed Unitree)</span>
              </li>
              <li class="flex items-start gap-3 text-[15px] text-text">
                <svg class="mt-1 h-4 w-4 shrink-0 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Ongoing sim-to-real policy updates (UniPwn 2025 patches, etc.)</span>
              </li>
              <li class="flex items-start gap-3 text-[15px] text-text">
                <svg class="mt-1 h-4 w-4 shrink-0 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Security &amp; firmware monitoring (post-UniPwn 2025 SLA)</span>
              </li>
              <li class="flex items-start gap-3 text-[15px] text-text">
                <svg class="mt-1 h-4 w-4 shrink-0 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Quarterly on-site or remote training sessions</span>
              </li>
              <li class="flex items-start gap-3 text-[15px] text-text">
                <svg class="mt-1 h-4 w-4 shrink-0 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Carry-over hours (no use-it-or-lose-it)</span>
              </li>
              <li class="flex items-start gap-3 text-[15px] text-text">
                <svg class="mt-1 h-4 w-4 shrink-0 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Direct Slack / Teams channel with the engineering team</span>
              </li>
              <li class="flex items-start gap-3 text-[15px] text-text">
                <svg class="mt-1 h-4 w-4 shrink-0 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Custom invoicing, MSA, security DPA</span>
              </li>
            </ul>

            <div class="mt-10 border-t border-dashed border-border pt-8">
              <NuxtLink
                to="/intake"
                class="group relative inline-flex h-11 w-full items-center justify-center font-mono text-xs font-semibold uppercase tracking-[0.12em] text-paper transition-all duration-200 bg-ink hover:bg-ink-2"
                style="clip-path: polygon(0 0, calc(100% - 13px) 0, 100% 50%, calc(100% - 13px) 100%, 0 100%, 13px 50%); padding-left: 22px; padding-right: 28px;"
              >
                <span class="pl-3 sm:pl-4">Talk to us</span>
              </NuxtLink>
            </div>
          </article>
        </div>
      </Container>
    </section>

    <!-- ====================================================================
         DIAGONAL HATCH DIVIDER
         ==================================================================== -->
    <div class="relative h-6 overflow-hidden border-b border-border" aria-hidden="true">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" class="absolute inset-0">
        <defs>
          <pattern id="pricing-hatch-2" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="currentColor" stroke-width="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pricing-hatch-2)" class="text-text-muted/50" />
      </svg>
    </div>

    <!-- ====================================================================
         TWO PROMO CARDS — greptile: OSS + Startup
         ==================================================================== -->
    <section class="border-b border-border">
      <Container class="py-16 sm:py-20">
        <div class="grid gap-px md:grid-cols-2 bg-border rounded-2xl overflow-hidden border border-border">
          <!-- ============================================================
               PROMO 1: RESEARCH & ACADEMIA (greptile OSS)
               ============================================================ -->
          <article class="relative bg-bg p-8 md:p-10">
            <div class="flex items-baseline gap-2">
              <span class="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">[</span>
              <p class="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
                Research &amp; Academia
              </p>
              <span class="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">]</span>
            </div>
            <p class="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-text-secondary">
              Free for qualified research labs
            </p>
            <h2 class="mt-6 font-display text-6xl font-extrabold leading-none text-text sm:text-7xl">
              Free
            </h2>
            <p class="mt-3 font-mono text-sm text-text-secondary">
              <span class="text-text-muted">/</span>engagement <span class="text-text-muted">·</span> non-commercial
            </p>

            <div class="my-8 border-t border-dashed border-border" />

            <p class="text-[15px] leading-relaxed text-text-secondary">
              Programming and integration support for Unitree platforms is free for qualified
              non-commercial research labs, university robotics programs, and student projects
              using public SDKs. We ask for a short write-up of the research use case and, where
              appropriate, a citation in your published work.
            </p>

            <ul class="mt-6 space-y-2.5 text-[14px] text-text-secondary">
              <li class="flex items-start gap-2">
                <span class="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                <span>Sim-to-real policy training (Isaac Lab / LeRobot / Diffusion Policy)</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                <span>unitree_sdk2 + unitree_ros2 programming hours</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                <span>Research-paper review for engineering claims</span>
              </li>
            </ul>

            <div class="mt-10 border-t border-dashed border-border pt-8">
              <NuxtLink
                to="/intake"
                class="group relative inline-flex h-11 w-full items-center justify-center font-mono text-xs font-semibold uppercase tracking-[0.12em] text-text-secondary transition-all duration-200 bg-bg border border-text-secondary hover:border-primary hover:text-primary"
                style="clip-path: polygon(0 0, calc(100% - 13px) 0, 100% 50%, calc(100% - 13px) 100%, 0 100%, 13px 50%); padding-left: 22px; padding-right: 28px;"
              >
                <span class="pl-3 sm:pl-4">Apply for research pricing</span>
              </NuxtLink>
            </div>
          </article>

          <!-- ============================================================
               PROMO 2: PILOT DISCOUNT (greptile Startup 50% off)
               ============================================================ -->
          <article class="relative bg-bg p-8 md:p-10">
            <div class="flex items-baseline gap-2">
              <span class="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">[</span>
              <p class="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
                Pilot Discount
              </p>
              <span class="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">]</span>
            </div>
            <p class="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-text-secondary">
              For the first 5 customers
            </p>
            <h2 class="mt-6 font-display text-6xl font-extrabold leading-none text-text sm:text-7xl">
              <span class="text-text-muted line-through decoration-2">Full</span> 50%
            </h2>
            <p class="mt-3 font-mono text-sm text-text-secondary">
              <span class="text-text-muted">/</span>first engagement <span class="text-text-muted">·</span> {{ capacity.pilotSlotsRemaining }} slots
            </p>

            <div class="my-8 border-t border-dashed border-border" />

            <p class="text-[15px] leading-relaxed text-text-secondary">
              Our first 5 customers get 50% off their first engagement. The pilot helps us
              validate the engagement model against real use cases, and gives you a meaningful
              discount in exchange for being an early reference. The discount applies to one
              engagement only — not recurring partnerships.
            </p>

            <ul class="mt-6 space-y-2.5 text-[14px] text-text-secondary">
              <li class="flex items-start gap-2">
                <span class="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                <span>50% off any one Engagement scope</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                <span>Same deliverables + 30-day warranty</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                <span>Early-reference request (case study, not fake metrics)</span>
              </li>
            </ul>

            <div class="mt-10 border-t border-dashed border-border pt-8">
              <NuxtLink
                to="/intake"
                class="group relative inline-flex h-11 w-full items-center justify-center font-mono text-xs font-semibold uppercase tracking-[0.12em] text-text-secondary transition-all duration-200 bg-bg border border-text-secondary hover:border-primary hover:text-primary"
                style="clip-path: polygon(0 0, calc(100% - 13px) 0, 100% 50%, calc(100% - 13px) 100%, 0 100%, 13px 50%); padding-left: 22px; padding-right: 28px;"
              >
                <span class="pl-3 sm:pl-4">Apply for pilot pricing</span>
              </NuxtLink>
            </div>
          </article>
        </div>
      </Container>
    </section>

    <!-- ====================================================================
         "FROM 2035" SECTION: Capacity transparency + cost breakdown
         This is what makes the page not a sales banner. The kind of
         information a 2035-era pricing page would publish by default.
         ==================================================================== -->
    <section class="border-b border-border">
      <Container class="py-16 sm:py-20">
        <div class="grid items-start gap-10 md:grid-cols-12">
          <div class="md:col-span-5">
            <p class="eyebrow">Capacity · Q3 2026</p>
            <h2 class="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              We don't hide scarcity.
            </h2>
            <p class="mt-4 text-text-secondary leading-relaxed">
              Pre-launch means a small engineering team. We won't pretend otherwise. Here's
              the actual capacity we have for the next two quarters, and what it means for
              your timeline.
            </p>
          </div>
          <div class="md:col-span-7 space-y-4">
            <!-- Q3 capacity bar -->
            <div class="rounded-2xl border border-dashed border-border bg-surface p-5">
              <div class="flex items-baseline justify-between">
                <p class="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
                  Q3 2026 · Jul–Sep
                </p>
                <p class="font-mono text-sm font-bold text-text">
                  {{ capacity.q3.filled }} / {{ capacity.q3.total }} filled
                </p>
              </div>
              <div class="mt-3 h-3 w-full overflow-hidden rounded-full bg-surface-2">
                <div
                  class="h-full bg-accent transition-all"
                  :style="{ width: `${(capacity.q3.filled / capacity.q3.total) * 100}%` }"
                />
              </div>
              <p class="mt-2 font-mono text-xs text-text-secondary">
                {{ capacity.q3.open }} of {{ capacity.q3.total }} engagement slots remaining
              </p>
            </div>
            <!-- Q4 capacity bar -->
            <div class="rounded-2xl border border-dashed border-border bg-surface p-5">
              <div class="flex items-baseline justify-between">
                <p class="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
                  Q4 2026 · Oct–Dec
                </p>
                <p class="font-mono text-sm font-bold text-text">
                  {{ capacity.q4.filled }} / {{ capacity.q4.total }} filled
                </p>
              </div>
              <div class="mt-3 h-3 w-full overflow-hidden rounded-full bg-surface-2">
                <div
                  class="h-full bg-accent transition-all"
                  :style="{ width: `${(capacity.q4.filled / capacity.q4.total) * 100}%` }"
                />
              </div>
              <p class="mt-2 font-mono text-xs text-text-secondary">
                {{ capacity.q4.open }} of {{ capacity.q4.total }} engagement slots remaining
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>

    <!-- ====================================================================
         "FROM 2035" SECTION 2: where the cost goes
         ==================================================================== -->
    <section class="border-b border-border bg-surface">
      <Container class="py-16 sm:py-20">
        <div class="grid items-start gap-10 md:grid-cols-12">
          <div class="md:col-span-5">
            <p class="eyebrow">Where the cost goes</p>
            <h2 class="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              We don't bury the math.
            </h2>
            <p class="mt-4 text-text-secondary leading-relaxed">
              The cost of an engagement is roughly the cost of the engineering time, the
              hardware, and the operations. Here's the honest split for a typical
              programming + integration engagement. Your actual mix may differ based on
              hardware, sim time, and security requirements.
            </p>
          </div>
          <div class="md:col-span-7">
            <div class="rounded-2xl border border-dashed border-border bg-bg p-6">
              <div class="space-y-4">
                <!-- bar row -->
                <div v-for="row in [
                  { label: 'Engineering time (programming, sim, integration)', pct: 62, tone: 'bg-primary' },
                  { label: 'Hardware procurement + spare-parts buffer', pct: 18, tone: 'bg-accent' },
                  { label: 'On-site / deployment travel (when needed)', pct: 10, tone: 'bg-ink' },
                  { label: 'Operations, infra, monitoring, SRE', pct: 6, tone: 'bg-text-muted' },
                  { label: 'Margin (reinvested into research + open tooling)', pct: 4, tone: 'bg-text-secondary' },
                ]" :key="row.label">
                  <div class="flex items-baseline justify-between gap-3">
                    <p class="text-sm text-text">{{ row.label }}</p>
                    <p class="font-mono text-sm font-bold text-text shrink-0">{{ row.pct }}%</p>
                  </div>
                  <div class="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                    <div :class="row.tone" class="h-full" :style="{ width: `${row.pct}%` }" />
                  </div>
                </div>
              </div>
              <p class="mt-5 font-mono text-[11px] uppercase tracking-wider text-text-muted">
                Illustrative · actual mix varies by hardware, sim, and security scope
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>

    <!-- ====================================================================
         FAQ SECTION — greptile-style accordion
         ==================================================================== -->
    <section class="border-b border-border">
      <Container class="py-16 sm:py-20">
        <h2 class="mb-10 text-center font-display text-4xl font-extrabold tracking-tight text-text sm:text-5xl">
          FAQ
        </h2>
        <div class="mx-auto max-w-3xl">
          <div
            v-for="(faq, i) in faqs"
            :key="faq.q"
            class="border-b border-dashed border-border"
          >
            <button
              type="button"
              :aria-expanded="openFaq === i"
              class="group flex w-full items-center justify-between gap-4 py-5 text-left transition-colors"
              @click="toggleFaq(i)"
            >
              <h3 class="font-display text-base font-bold text-text group-hover:text-primary sm:text-lg">
                {{ faq.q }}
              </h3>
              <svg
                class="h-5 w-5 shrink-0 text-text-secondary transition-transform duration-200"
                :class="openFaq === i && 'rotate-180'"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div
              v-show="openFaq === i"
              class="overflow-hidden pb-6 text-[15px] leading-relaxed text-text-secondary"
            >
              {{ faq.a }}
            </div>
          </div>
        </div>
        <p class="mt-10 text-center text-text-secondary">
          Can't find your answer here?
          <NuxtLink to="/intake" class="text-primary underline-offset-2 hover:underline">
            Get in touch.
          </NuxtLink>
        </p>
      </Container>
    </section>

    <!-- ====================================================================
         FINAL CTA — single, on-brand
         ==================================================================== -->
    <section class="bg-ink-bg text-ink-text">
      <div class="mx-auto max-w-3xl px-6 py-20 text-center md:py-28">
        <h2 class="font-display text-3xl font-extrabold leading-tight md:text-5xl">
          Tell us what you want to do.
        </h2>
        <p class="mt-6 text-lg text-ink-text/80 max-w-2xl mx-auto">
          Five-question form, three minutes. Free, no commitment, reply within one business day.
          We name the platform, the SDK, the integration pattern, and a realistic cost band.
        </p>
        <div class="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <NuxtLink
            to="/intake"
            class="group relative inline-flex h-12 items-center font-mono text-xs font-semibold uppercase tracking-[0.12em] text-ink transition-all duration-200 bg-accent hover:opacity-90"
            style="clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 0 100%, 16px 50%); padding-left: 28px; padding-right: 32px;"
          >
            <span class="pl-3 sm:pl-4">Submit your use case</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="ml-2 transition-transform group-hover:translate-x-0.5">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </NuxtLink>
          <NuxtLink
            to="/how-it-works"
            class="inline-flex h-12 items-center rounded-full border border-ink-text/30 px-6 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-ink-text transition-all hover:bg-ink-text/10"
          >
            How it works
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
