<script setup lang="ts">
import { stemToRoute } from '~/utils/content'

const { t } = useI18n()

const { data: services } = await useAsyncData('home-services', () =>
  queryCollection('services').order('order', 'ASC').limit(4).all(),
)
const { data: work } = await useAsyncData('home-work', () =>
  queryCollection('work').where('featured', '=', true).limit(3).all(),
)

useSeoMeta({
  title: 'qtvue — The Robotics Company',
  description:
    'We sell, program, and integrate robots for any business need — full cells, programs, peripherals, and consulting.',
})

const tickerItems = [
  'FANUC · certified integrator',
  'ABB · value provider',
  'KUKA · system partner',
  'Yaskawa · Motoman partner',
  'Universal Robots · certified',
  '24/7 support · global',
  'ISO 9001 · certified processes',
  '2025: 240% throughput avg.',
]

const logoNames = [
  { name: 'Brex', shape: 'square' },
  { name: 'Substack', shape: 'bars' },
  { name: 'Scale', shape: 'circle' },
  { name: 'Klaviyo', shape: 'triangle' },
  { name: 'PostHog', shape: 'bars' },
  { name: 'Mintlify', shape: 'diamond' },
  { name: 'Browserbase', shape: 'square' },
  { name: 'BILT', shape: 'circle' },
  { name: 'Crossmint', shape: 'triangle' },
  { name: 'Pylon', shape: 'diamond' },
]

const benchBars = [
  { label: 'qtvue cells', value: 92, highlight: true },
  { label: 'in-house team', value: 68 },
  { label: 'generalist integrator', value: 54 },
  { label: 'DIY retrofit', value: 31 },
]

const stats = [
  { value: '240+', label: 'cells deployed', sub: 'across 14 countries' },
  { value: '99.4%', label: 'uptime', sub: 'avg across live cells' },
  { value: '< 6 wk', label: 'avg. time to commission', sub: 'standard cells' },
  { value: '14', label: 'countries served', sub: 'and counting' },
]

const testimonials = [
  {
    quote:
      'qtvue cut our commissioning time in half. Their offline programming workflow is the best we have seen — and we have seen a lot.',
    author: 'M. Terriere',
    role: 'Head of Operations',
    company: 'a Fortune-500 fabricator',
  },
  {
    quote:
      'They speak integrator, not just salesperson. We handed them a half-finished cell and they finished, validated, and trained our crew in three weeks.',
    author: 'A. Levinson',
    role: 'VP Manufacturing',
    company: 'a tier-1 automotive supplier',
  },
  {
    quote:
      'The ROI model they built for our feasibility study was the reason the board approved the project. We are 18 months in, beating every number.',
    author: 'P. Okafor',
    role: 'Plant Director',
    company: 'a global packaging group',
  },
]

// Code samples for the feature cards. Defined as plain strings so newlines
// survive Vue's template whitespace collapsing.
const cellYaml = `# cell: weld-line-7 — qtvue integration
robot: fanuc-m-2000
reach: 3.1m
payload: 2.3t
cycle_time: 28.4s
uptime_sla: 99.4%
commissioned: 2025-09-14`

const pickKarel = `PROGRAM pick_place
  MOVE TO home ; -- p[1]
  WAIT FOR dio[fixt_ready] = ON
  MOVE TO pick[1] SPEED 800mm/s
  CLOSE gripper FORCE 40N
  MOVE TO place[1] SPEED 1200mm/s
  OPEN gripper
  LOOP 12×
END PROGRAM`

const consultingGantt = `WEEK 1 · cell walk · interviews · data pull
WEEK 2 · cycle-time model · OEE baseline
WEEK 3 · vendor-neutral recommendations
WEEK 4 · ROI model · board-ready report`
</script>

<template>
  <div>
    <!-- =============================================================
         HERO  — greptile-style: status pill, display headline with
         one highlighted word, halftone robotic arm on the right,
         WebGL particle field as the live background.
         ============================================================= -->
    <section class="relative isolate overflow-hidden border-b border-border">
      <!-- WebGL particle field / wireframe arm -->
      <ClientOnly>
        <RoboCanvas class="absolute inset-0 -z-10" :density="1400" />
        <template #fallback>
          <div class="absolute inset-0 -z-10 halftone-bg opacity-30" />
        </template>
      </ClientOnly>

      <!-- Subtle dotted halftone wash so light mode still feels premium -->
      <div
        class="pointer-events-none absolute inset-0 -z-10 opacity-[0.04] halftone-bg"
        aria-hidden="true"
      />

      <Container class="relative grid gap-12 pb-24 pt-12 lg:grid-cols-12 lg:gap-8 lg:pb-32 lg:pt-20">
        <!-- LEFT: copy -->
        <Reveal class="lg:col-span-7">
          <StatusPill text="Now booking Q3 2026" tone="primary" />
          <h1 class="display-xl mt-6 text-text">
            The <span class="hl">robotics</span> company for ambitious operators.
          </h1>
          <p class="mt-6 max-w-xl text-lg leading-relaxed text-text-secondary sm:text-xl">
            We <span class="text-highlight">sell, program, and integrate</span> robots for any
            business need — full cell design, programming, peripherals, and the consulting to
            make it all pencil out. From feasibility to first part, end to end.
          </p>
          <div class="mt-8 flex flex-wrap items-center gap-3">
            <Btn href="/contact" variant="primary" size="lg" arrow>
              {{ t('cta.startProject') }}
            </Btn>
            <Btn href="/work" variant="secondary" size="lg">
              See selected work
            </Btn>
          </div>
          <p class="mt-4 font-mono text-xs text-text-muted">
            no commitment · 30-min scoping call · reply within 1 business day
          </p>
        </Reveal>

        <!-- RIGHT: halftone robot mascot -->
        <Reveal class="relative lg:col-span-5" :delay="150">
          <div class="relative mx-auto aspect-square w-full max-w-md">
            <!-- dot ring background -->
            <div
              class="absolute inset-0 halftone-bg opacity-30"
              aria-hidden="true"
            />
            <div
              class="absolute inset-4 rounded-full border border-dashed border-border-strong"
              aria-hidden="true"
            />
            <div
              class="absolute inset-12 rounded-full border border-dashed border-border"
              aria-hidden="true"
            />
            <div
              class="absolute inset-20 rounded-full border border-dashed border-border"
              aria-hidden="true"
            />
            <RobotMascot variant="arm-large" />
            <!-- floating annotations -->
            <div
              class="absolute -left-2 top-1/4 hidden rounded-full border border-border bg-bg/80 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-text-secondary backdrop-blur sm:block"
            >
              <span class="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-primary align-middle" />
              cell · online
            </div>
            <div
              class="absolute -right-2 top-2/3 hidden rounded-full border border-border bg-bg/80 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-text-secondary backdrop-blur sm:block"
            >
              <span class="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent align-middle" />
              cycle · 12.4 s
            </div>
          </div>
        </Reveal>
      </Container>

      <!-- scroll cue -->
      <div class="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex">
        <span class="font-mono text-[10px] uppercase tracking-widest text-text-muted">scroll</span>
        <span class="block h-8 w-px bg-border-strong" />
      </div>
    </section>

    <!-- =============================================================
         TICKER — telemetry / partner strip
         ============================================================= -->
    <Ticker :items="tickerItems" :duration="50" />

    <!-- =============================================================
         LOGO CLOUD — 1000+ teams (greptile pattern)
         ============================================================= -->
    <LogoCloud
      eyebrow="Trusted by 240+ operations teams"
      cta="See our work"
      cta-href="/work"
    >
      <LogoMark
        v-for="logo in logoNames"
        :key="logo.name"
        :name="logo.name"
        :shape="logo.shape as 'square' | 'circle' | 'diamond' | 'triangle' | 'bars'"
      />
    </LogoCloud>

    <!-- =============================================================
         FEATURES — code-mockup feature blocks (greptile style)
         ============================================================= -->
    <Section
      eyebrow="What we ship"
      heading="Robots that work. Code that holds up. Cells that scale."
    >
      <Reveal class="grid gap-6 lg:grid-cols-2">
        <!-- Feature 1: cell design -->
        <Card variant="default" pad="none" class="overflow-hidden">
          <div class="border-b border-border p-6 sm:p-8">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="eyebrow">01 — Cell design</p>
                <h3 class="mt-2 display-md">From sketch to first part in 6 weeks.</h3>
              </div>
              <span class="hidden font-display text-6xl font-extrabold text-primary/20 sm:block">01</span>
            </div>
            <p class="mt-4 text-text-secondary">
              We design the cell in 3D, simulate cycle time, source every component, and
              integrate on your floor. Hand you the keys at first-part-good.
            </p>
            <NuxtLink
              to="/services/integration"
              class="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary link-underline"
            >
              How integration works →
            </NuxtLink>
          </div>
          <CodeBlock filename="cell.kineo" language="yaml" :code="cellYaml" compact />
        </Card>

        <!-- Feature 2: programming -->
        <Card variant="default" pad="none" class="overflow-hidden">
          <div class="border-b border-border p-6 sm:p-8">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="eyebrow">02 — Programming</p>
                <h3 class="mt-2 display-md">Faster paths. Cleaner code. Zero downtime.</h3>
              </div>
              <span class="hidden font-display text-6xl font-extrabold text-primary/20 sm:block">02</span>
            </div>
            <p class="mt-4 text-text-secondary">
              We write, debug, and optimize robot programs for FANUC, ABB, KUKA, Yaskawa, UR
              — and we ship offline-programmed, validated paths.
            </p>
            <NuxtLink
              to="/services/programming"
              class="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary link-underline"
            >
              See programming capabilities →
            </NuxtLink>
          </div>
          <CodeBlock filename="pick.karel" language="karel" :code="pickKarel" compact />
        </Card>

        <!-- Feature 3: sales -->
        <Card variant="default" pad="none" class="overflow-hidden">
          <div class="border-b border-border p-6 sm:p-8">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="eyebrow">03 — Sales</p>
                <h3 class="mt-2 display-md">The right robot. The right price. The right partner.</h3>
              </div>
              <span class="hidden font-display text-6xl font-extrabold text-primary/20 sm:block">03</span>
            </div>
            <p class="mt-4 text-text-secondary">
              We supply arms, controllers, end-of-arm tooling, vision, and safety — from
              every major brand, configured for your application.
            </p>
            <NuxtLink
              to="/services/sales"
              class="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary link-underline"
            >
              Browse the catalog →
            </NuxtLink>
          </div>
          <div class="grid grid-cols-3 gap-px bg-border">
            <div v-for="brand in ['FANUC', 'ABB', 'KUKA', 'Yaskawa', 'UR', 'Doosan']" :key="brand" class="bg-surface p-6 text-center">
              <div class="font-mono text-xs uppercase tracking-widest text-text-secondary">
                {{ brand }}
              </div>
            </div>
          </div>
        </Card>

        <!-- Feature 4: consulting -->
        <Card variant="default" pad="none" class="overflow-hidden">
          <div class="border-b border-border p-6 sm:p-8">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="eyebrow">04 — Consulting</p>
                <h3 class="mt-2 display-md">Decide if — and how — to automate.</h3>
              </div>
              <span class="hidden font-display text-6xl font-extrabold text-primary/20 sm:block">04</span>
            </div>
            <p class="mt-4 text-text-secondary">
              Vendor-neutral feasibility studies, ROI modeling, and engineering plans.
              We tell you when not to automate — and we tell you why.
            </p>
            <NuxtLink
              to="/services/consulting"
              class="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary link-underline"
            >
              Read about engagements →
            </NuxtLink>
          </div>
          <div class="bg-surface-2 p-6 font-mono text-xs leading-relaxed text-text-secondary sm:p-8">
            <div class="mb-3 flex items-center gap-2">
              <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              <span class="uppercase tracking-widest text-text-muted">engagement · 4 wk</span>
            </div>
            <div v-for="(line, i) in consultingGantt.split('\n')" :key="i" class="text-text">{{ line }}</div>
          </div>
        </Card>
      </Reveal>
    </Section>

    <!-- =============================================================
         STATS / BENCHMARK — greptile-style bar chart section
         ============================================================= -->
    <Section tone="ink" eyebrow="The benchmark" heading="We beat the alternatives. By a lot.">
      <Reveal>
        <div class="grid gap-8 lg:grid-cols-2 lg:items-center">
          <BarChart
            :bars="benchBars"
            y-label="% of cycle-time reduction delivered"
            us-badge="qtvue"
          >
            <template #caption>
              internal benchmark · 240+ cells · 2024-25
            </template>
          </BarChart>

          <div class="flex flex-col gap-6">
            <p class="text-lg text-ink-text/80 sm:text-xl">
              Across <span class="text-accent">240+ commissioned cells</span>, qtvue
              delivered a <span class="text-accent">92% median cycle-time reduction</span>
              vs. manual baselines. Generalist integrators hit 54%. DIY retrofits? 31%.
            </p>
            <div class="grid grid-cols-2 gap-4">
              <Card variant="ghost" pad="md" class="border border-ink-text/20">
                <Stat value="240+" label="cells deployed" />
              </Card>
              <Card variant="ghost" pad="md" class="border border-ink-text/20">
                <Stat value="99.4%" label="uptime" />
              </Card>
              <Card variant="ghost" pad="md" class="border border-ink-text/20">
                <Stat value="< 6 wk" label="avg. commission" />
              </Card>
              <Card variant="ghost" pad="md" class="border border-ink-text/20">
                <Stat value="14" label="countries" />
              </Card>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>

    <!-- =============================================================
         SELECTED WORK — greptile-style case study grid
         ============================================================= -->
    <Section eyebrow="Selected work" heading="From feasibility to first-part-good.">
      <Reveal>
        <div class="grid gap-6 md:grid-cols-3">
          <NuxtLink
            v-for="w in work"
            :key="w.path"
            :to="stemToRoute(w.stem)"
            class="group block"
          >
            <Card interactive pad="none" class="overflow-hidden">
              <div class="relative aspect-[4/3] overflow-hidden border-b border-border bg-surface-2 halftone-bg">
                <div class="absolute inset-0 grid place-items-center">
                  <div class="h-3/5 w-3/5 transition-transform duration-500 group-hover:scale-105">
                    <RobotMascot variant="arm" />
                  </div>
                </div>
                <span
                  v-if="w.year"
                  class="absolute left-3 top-3 rounded-full bg-bg/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-text-secondary backdrop-blur"
                >
                  {{ w.year }}
                </span>
              </div>
              <div class="p-6">
                <div class="font-mono text-[10px] uppercase tracking-widest text-primary">
                  {{ w.industry }}
                </div>
                <h3 class="mt-2 text-lg font-bold tracking-tight text-text group-hover:text-primary">
                  {{ w.title }}
                </h3>
                <p class="mt-2 line-clamp-2 text-sm text-text-secondary">{{ w.summary }}</p>
                <div v-if="w.metrics?.length" class="mt-4 flex gap-6 border-t border-border pt-4">
                  <div v-for="m in w.metrics?.slice(0, 2)" :key="m.label">
                    <div class="font-display text-xl font-extrabold text-primary">{{ m.value }}</div>
                    <div class="text-xs text-text-secondary">{{ m.label }}</div>
                  </div>
                </div>
              </div>
            </Card>
          </NuxtLink>
        </div>
        <div class="mt-8 text-center">
          <Btn href="/work" variant="secondary" size="md" arrow>View all case studies</Btn>
        </div>
      </Reveal>
    </Section>

    <!-- =============================================================
         TESTIMONIALS — quote grid
         ============================================================= -->
    <Section tone="surface" eyebrow="Operators trust us" heading="The people on the floor, on the record.">
      <Reveal>
        <div class="grid gap-6 md:grid-cols-3">
          <Card
            v-for="(t, i) in testimonials"
            :key="i"
            pad="lg"
            variant="default"
            class="flex flex-col"
          >
            <svg
              class="mb-4 h-6 w-6 text-primary"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M9.13 14.5H4.88c.13-2.83 1.78-5.27 4.5-6.83l-1.5-2.25C4.13 7.6 1.5 11.05 1.5 15.5v5.5h7.63v-6.5zM22.5 14.5h-4.25c.13-2.83 1.78-5.27 4.5-6.83l-1.5-2.25c-3.75 2.18-6.38 5.63-6.38 10.08v5.5H22.5v-6.5z"
              />
            </svg>
            <p class="flex-1 text-base text-text">{{ t.quote }}</p>
            <div class="mt-6 border-t border-border pt-4">
              <div class="font-semibold text-text">{{ t.author }}</div>
              <div class="text-xs text-text-secondary">
                {{ t.role }} · {{ t.company }}
              </div>
            </div>
          </Card>
        </div>
      </Reveal>
    </Section>

    <!-- =============================================================
         PROCESS — 3 steps
         ============================================================= -->
    <Section eyebrow="How we work" heading="Three steps. Then robots.">
      <Reveal>
        <ol class="grid gap-6 md:grid-cols-3">
          <li class="relative flex flex-col gap-3 rounded-2xl border border-border bg-surface p-6">
            <span class="font-mono text-[10px] uppercase tracking-widest text-primary">step 01</span>
            <h3 class="text-xl font-bold tracking-tight text-text">Scoping call</h3>
            <p class="text-sm text-text-secondary">
              30 minutes. We learn the process, the pain, and the constraints. We tell you
              straight whether automation makes sense.
            </p>
          </li>
          <li class="relative flex flex-col gap-3 rounded-2xl border border-border bg-surface p-6">
            <span class="font-mono text-[10px] uppercase tracking-widest text-primary">step 02</span>
            <h3 class="text-xl font-bold tracking-tight text-text">Feasibility + design</h3>
            <p class="text-sm text-text-secondary">
              We model the cell, run the cycle-time, source the parts, and write a
              board-ready proposal with line-item ROI.
            </p>
          </li>
          <li class="relative flex flex-col gap-3 rounded-2xl border border-border bg-surface p-6">
            <span class="font-mono text-[10px] uppercase tracking-widest text-primary">step 03</span>
            <h3 class="text-xl font-bold tracking-tight text-text">Build, ship, run</h3>
            <p class="text-sm text-text-secondary">
              We integrate, commission, and hand over the keys at first-part-good. We stay
              on the cell — 24/7 if you want us.
            </p>
          </li>
        </ol>
      </Reveal>
    </Section>

    <!-- =============================================================
         CTA — full-width dark band (greptile-style)
         ============================================================= -->
    <Section tone="ink" bleed>
      <Reveal>
        <div class="relative isolate overflow-hidden rounded-3xl">
          <ClientOnly>
            <AmbientField :density="500" height="100%" class="!relative" />
          </ClientOnly>
          <div class="relative grid gap-8 p-10 sm:p-16 lg:grid-cols-2 lg:items-center">
            <div>
              <StatusPill text="Booking Q3 2026" tone="accent" />
              <h2 class="display-md mt-4 text-ink-text">
                Have a process you want to <span class="text-accent">automate?</span>
              </h2>
              <p class="mt-4 max-w-md text-lg text-ink-text/70">
                Tell us about it. We'll tell you if it makes sense — and if it does, what it costs
                and how long it takes.
              </p>
            </div>
            <div class="flex flex-col gap-3 lg:items-end">
              <Btn href="/contact" variant="accent" size="lg" arrow>
                Start a project
              </Btn>
              <p class="font-mono text-xs text-ink-text/50 lg:text-right">
                no commitment · reply within 1 business day
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  </div>
</template>
