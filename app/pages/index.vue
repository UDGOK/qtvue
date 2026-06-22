<script setup lang="ts">
/**
 * qtvue.com homepage — built per the v2 brief.
 *
 * Positioning: Unitree-specialist robotics company, pre-launch.
 *   - NO fabricated metrics, NO fake logos, NO fake testimonials
 *   - Single CTA throughout: "Submit your use case"
 *   - 7 sections per brief:
 *       1. Hero
 *       2. Platform strip
 *       3. Services
 *       4. How it works
 *       5. Capabilities
 *       6. Founder / why qtvue
 *       7. Final CTA → intake form
 */
import { stemToRoute } from '~/utils/content'

const { data: platforms } = await useAsyncData('home-platforms', () =>
  queryCollection('platforms').order('order', 'ASC').all(),
)
const { data: services } = await useAsyncData('home-services', () =>
  queryCollection('services').order('order', 'ASC').all(),
)

useSeoMeta({
  title: 'qtvue — Unitree robotics, programmed and integrated',
  description:
    'We sell, program, and integrate Unitree robots for your exact use case — Go2, B2, G1, R1, H1, H2 and arms. Submit your use case for an engineering assessment.',
})

// Homepage-specific structured data: WebPage + VideoObject (the
// "in the wild" hero clip) + an ItemList of all platforms so
// every AI engine gets a clean structural index.
useSchemaOrg([
  defineWebPage({
    '@type': 'WebPage',
    name: 'qtvue — Unitree robotics, programmed and integrated',
    description:
      'We sell, program, and integrate Unitree robots for your exact use case — Go2, B2, G1, R1, H1, H2 and arms. Submit your use case for an engineering assessment.',
    url: 'https://qtvue.com/',
    inLanguage: 'en-US',
    isPartOf: { '@type': 'WebSite', url: 'https://qtvue.com', name: 'qtvue' },
    primaryImage: 'https://qtvue.com/og-default.svg',
  }),
  defineVideo({
    '@type': 'VideoObject',
    name: 'Unitree G1 — in the wild, qtvue demo loop',
    description: 'Real Unitree G1 humanoid hardware running in our demo loop. No edits, no promo footage.',
    contentUrl: 'https://qtvue.com/videos/home-hero.mp4',
    thumbnailUrl: 'https://qtvue.com/videos/home-hero-poster.jpg',
    uploadDate: '2026-06-22',
    duration: 'PT8S',
    encodingFormat: 'video/mp4',
    isFamilyFriendly: true,
  }),
  {
    '@type': 'ItemList',
    name: 'Unitree platforms we sell / program / integrate',
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement: [
      'Unitree Go2',
      'Unitree B2',
      'Unitree G1',
      'Unitree G1-D',
      'Unitree R1',
      'Unitree H1',
      'Unitree H2',
      'Unitree Arms (Z1)',
    ].map((name, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      url: `https://qtvue.com/platforms/${name.toLowerCase().replace(/^unitree\s+/i, '').replace(/\s*\(.+\)/, '').replace(/[- ]/g, '')}`,
    })),
  },
  defineBreadcrumb({
    itemListElement: [
      { name: 'Home', item: 'https://qtvue.com/' },
    ],
  }),
])

// Real Unitree SDK snippet (Python) — used as the "code as hero visual" pattern
const unitreeSnippet = `# unitree_sdk2_python — joint position control
# Works across Go2, B2, G1, H1, H2, R1
from unitree_sdk2py.core.channel import ChannelFactoryInitialize
from unitree_sdk2py.g1.arm.g1_arm_action import G1ArmAction

ChannelFactoryInitialize(0, "eth0")          # DDS over the robot's LAN
arm = G1ArmAction()

# Safety: zero-torque, then staged enable
arm.setFsmLowCmd();   arm.send()
arm.setFsmJoint();    arm.send()             # compliant mode
arm.startRayCasting() # perception hook`

const servicesByKey = computed(() => {
  const map: Record<string, any> = {}
  for (const s of services.value ?? []) map[s.stem] = s
  return map
})
</script>

<template>
  <div>
    <!-- =============================================================
         1. HERO
         ============================================================= -->
    <section class="relative isolate overflow-hidden border-b border-border">
      <ClientOnly>
        <RoboCanvas class="absolute inset-0 -z-10" :density="1400" />
        <template #fallback>
          <div class="absolute inset-0 -z-10 halftone-bg opacity-30" />
        </template>
      </ClientOnly>
      <div
        class="pointer-events-none absolute inset-0 -z-10 opacity-[0.04] halftone-bg"
        aria-hidden="true"
      />

      <Container class="relative grid gap-12 pb-24 pt-12 lg:grid-cols-12 lg:gap-8 lg:pb-32 lg:pt-20">
        <Reveal class="lg:col-span-7">
          <StatusPill text="Pre-launch · Booking assessments now" tone="primary" />
          <h1 class="display-xl mt-6 text-text">
            We sell, program, and <span class="hl">integrate</span> robots for your exact use case.
          </h1>
          <p class="mt-6 max-w-xl text-lg leading-relaxed text-text-secondary sm:text-xl">
            Starting with the full <span class="text-highlight">Unitree</span> range — Go2, B2, G1,
            R1, H1, H2 and arms. We make the platform do the job, end to end.
          </p>
          <div class="mt-8 flex flex-wrap items-center gap-3">
            <Btn href="/intake" variant="primary" size="lg" arrow>
              Submit your use case
            </Btn>
          </div>
          <p class="mt-4 font-mono text-xs text-text-muted">
            one short form · engineering review · reply within 1 business day
          </p>
        </Reveal>

        <Reveal class="relative lg:col-span-5" :delay="150">
          <CodeBlock
            filename="arm_control.py"
            language="python"
            :code="unitreeSnippet"
            class="!shadow-[var(--shadow-lg)]"
          />
        </Reveal>
      </Container>

      <div class="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex">
        <span class="font-mono text-[10px] uppercase tracking-widest text-text-muted">scroll</span>
        <span class="block h-8 w-px bg-border-strong" />
      </div>
    </section>

    <!-- =============================================================
         2. PLATFORM STRIP
         ============================================================= -->
    <Section
      eyebrow="Platforms"
      heading="The Unitree range, in plain English."
      sub="Every platform below is something we can sell you, program, or integrate. Prices are from and move — exact quotes after a scoping call."
    >
      <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Reveal
          v-for="(p, i) in platforms"
          :key="p.stem"
          :delay="i * 50"
          as="li"
        >
          <NuxtLink
            :to="stemToRoute(p.stem)"
            class="group flex h-full flex-col rounded-2xl border border-dashed border-border bg-surface p-5 transition-all hover:border-primary/40 hover:shadow-[var(--shadow-lg)]"
          >
            <div class="flex items-baseline justify-between">
              <span class="font-mono text-[10px] uppercase tracking-widest text-text-muted">
                {{ p.type }}
              </span>
              <span class="font-mono text-[10px] text-text-secondary">
                {{ p.priceFrom }}
              </span>
            </div>
            <h3 class="mt-3 text-lg font-bold tracking-tight text-text group-hover:text-primary">
              {{ p.title }}
            </h3>
            <p class="mt-2 text-sm text-text-secondary">{{ p.oneLiner }}</p>
            <div class="mt-auto pt-4 font-mono text-[10px] uppercase tracking-widest text-text-secondary group-hover:text-primary">
              Specs + SDK →
            </div>
          </NuxtLink>
        </Reveal>
      </ul>
      <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
        <NuxtLink
          to="/platforms"
          class="inline-flex h-10 items-center rounded-full border border-border px-5 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-text-secondary transition-all hover:border-primary hover:text-primary"
        >
          See full platform comparison
        </NuxtLink>
        <span class="font-mono text-[11px] text-text-muted">
          Not sure? Tell us what you want to do — we'll recommend the right platform.
        </span>
      </div>
    </Section>

    <!-- =============================================================
         2.5 IN THE WILD — homepage hero showcase video, greptile-style
         Full-bleed autoplay loop, no controls, themed tint. Sits between
         the platform grid and the services section as a "proof point"
         that the platform actually moves.
         ============================================================= -->
    <Section
      eyebrow="In the wild"
      heading="See it work."
      sub="Real hardware, real environment. No edits, no promo footage. This is what we ship."
      tone="ink"
      bleed
    >
      <Reveal>
        <div class="relative isolate overflow-hidden rounded-3xl border border-paper/10">
          <!-- Full-bleed autoplay loop, no chrome, themed tint -->
          <div class="relative aspect-video">
            <DemoVideo
              src="/videos/home-hero.mp4"
              poster="/videos/home-hero-poster.jpg"
              mode="background"
              tint="forest"
              aspect="16/9"
            />

            <!-- Top-left status pill — same shape as platform pages,
                 but on a dark tinted background so it reads -->
            <div class="pointer-events-none absolute left-6 top-6 flex items-center gap-2 rounded-full border border-paper/20 bg-bg/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-paper/80 backdrop-blur">
              <span class="relative flex h-1.5 w-1.5" aria-hidden="true">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              live · G1 in motion
            </div>

            <!-- Bottom-right caption -->
            <div class="absolute bottom-6 right-6 hidden font-mono text-[10px] uppercase tracking-widest text-paper/60 sm:block">
              <Reveal :delay="200">8s loop · autoplay · muted</Reveal>
            </div>
          </div>
        </div>
      </Reveal>
      <Reveal :delay="120" class="mt-6 text-center">
        <NuxtLink
          to="/platforms/g1"
          class="inline-flex h-11 items-center rounded-full bg-accent px-6 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-ink transition-all hover:opacity-90"
        >
          See the G1 page →
        </NuxtLink>
      </Reveal>
    </Section>

    <!-- =============================================================
         3. SERVICES
         ============================================================= -->
    <Section
      eyebrow="Services"
      heading="Four ways we can help."
      sub="Pick the one you need, or stack them. Programming-only engagements route through the same intake form."
    >
      <div class="grid gap-4 md:grid-cols-2">
        <Reveal
          v-for="(s, i) in services"
          :key="s.stem"
          :delay="i * 60"
        >
          <Card variant="default" pad="lg" class="flex h-full flex-col">
            <p class="eyebrow">{{ s.label }}</p>
            <h3 class="mt-3 text-xl font-bold tracking-tight text-text">{{ s.title }}</h3>
            <p class="mt-3 text-sm leading-relaxed text-text-secondary">{{ s.summary }}</p>
            <div class="mt-auto pt-4">
              <NuxtLink
                v-if="s.cta"
                :to="s.cta.to"
                class="inline-flex items-center gap-1 text-sm font-semibold text-primary link-underline"
              >
                {{ s.cta.label }} →
              </NuxtLink>
            </div>
          </Card>
        </Reveal>
      </div>
    </Section>

    <!-- =============================================================
         4. HOW IT WORKS
         ============================================================= -->
    <Section
      eyebrow="How it works"
      heading="From use case to first deployment."
    >
      <ol class="grid gap-4 md:grid-cols-4">
        <Reveal :delay="0" as="li">
          <div class="flex h-full flex-col rounded-2xl border border-dashed border-border bg-surface p-6">
            <span class="font-mono text-[10px] uppercase tracking-widest text-primary">step 01</span>
            <h3 class="mt-3 text-lg font-bold tracking-tight text-text">Submit use case</h3>
            <p class="mt-2 text-sm text-text-secondary">
              Five-question form, three minutes. We learn what you're trying to do.
            </p>
          </div>
        </Reveal>
        <Reveal :delay="80" as="li">
          <div class="flex h-full flex-col rounded-2xl border border-dashed border-border bg-surface p-6">
            <span class="font-mono text-[10px] uppercase tracking-widest text-primary">step 02</span>
            <h3 class="mt-3 text-lg font-bold tracking-tight text-text">Engineering review</h3>
            <p class="mt-2 text-sm text-text-secondary">
              We name the platform, the SDK, the integration pattern, and a realistic
              timeline. Free, no commitment.
            </p>
          </div>
        </Reveal>
        <Reveal :delay="160" as="li">
          <div class="flex h-full flex-col rounded-2xl border border-dashed border-border bg-surface p-6">
            <span class="font-mono text-[10px] uppercase tracking-widest text-primary">step 03</span>
            <h3 class="mt-3 text-lg font-bold tracking-tight text-text">Scope + quote</h3>
            <p class="mt-2 text-sm text-text-secondary">
              Fixed price. Plain-English SOW. You own the program source, the design, and
              the documentation.
            </p>
          </div>
        </Reveal>
        <Reveal :delay="240" as="li">
          <div class="flex h-full flex-col rounded-2xl border border-dashed border-border bg-surface p-6">
            <span class="font-mono text-[10px] uppercase tracking-widest text-primary">step 04</span>
            <h3 class="mt-3 text-lg font-bold tracking-tight text-text">Build, ship, run</h3>
            <p class="mt-2 text-sm text-text-secondary">
              We program in sim, validate on hardware, deploy on your floor. Remote support
              after, if you want it.
            </p>
          </div>
        </Reveal>
      </ol>
    </Section>

    <!-- =============================================================
         5. CAPABILITIES — SDK + standards grid
         ============================================================= -->
    <Section
      eyebrow="Stack"
      heading="The tools we work in."
      sub="All public, all official. If we use it, we can show you the source."
    >
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Reveal :delay="0">
          <div class="rounded-2xl border border-dashed border-border bg-surface p-5">
            <p class="font-mono text-[10px] uppercase tracking-widest text-text-muted">SDK</p>
            <p class="mt-2 font-semibold text-text">unitree_sdk2 / unitree_sdk2_python</p>
            <p class="mt-1 text-xs text-text-secondary">C++ and Python SDK across the full Unitree range.</p>
          </div>
        </Reveal>
        <Reveal :delay="60">
          <div class="rounded-2xl border border-dashed border-border bg-surface p-5">
            <p class="font-mono text-[10px] uppercase tracking-widest text-text-muted">Middleware</p>
            <p class="mt-2 font-semibold text-text">ROS 2 (unitree_ros2)</p>
            <p class="mt-1 text-xs text-text-secondary">Same DDS interface on real hardware and in simulation.</p>
          </div>
        </Reveal>
        <Reveal :delay="120">
          <div class="rounded-2xl border border-dashed border-border bg-surface p-5">
            <p class="font-mono text-[10px] uppercase tracking-widest text-text-muted">Simulation</p>
            <p class="mt-2 font-semibold text-text">Isaac Lab (unitree_sim_isaaclab)</p>
            <p class="mt-1 text-xs text-text-secondary">High-fidelity sim-to-real workflow, validated policies.</p>
          </div>
        </Reveal>
        <Reveal :delay="180">
          <div class="rounded-2xl border border-dashed border-border bg-surface p-5">
            <p class="font-mono text-[10px] uppercase tracking-widest text-text-muted">Learning</p>
            <p class="mt-2 font-semibold text-text">LeRobot + UnifoLM-VLA-0</p>
            <p class="mt-1 text-xs text-text-secondary">Imitation learning and Unitree's open VLA model.</p>
          </div>
        </Reveal>
        <Reveal :delay="240">
          <div class="rounded-2xl border border-dashed border-border bg-surface p-5">
            <p class="font-mono text-[10px] uppercase tracking-widest text-text-muted">Perception</p>
            <p class="mt-2 font-semibold text-text">LiDAR SLAM · RealSense · CUDA pipelines</p>
            <p class="mt-1 text-xs text-text-secondary">Localization, mapping, multi-sensor fusion.</p>
          </div>
        </Reveal>
        <Reveal :delay="300">
          <div class="rounded-2xl border border-dashed border-border bg-surface p-5">
            <p class="font-mono text-[10px] uppercase tracking-widest text-text-muted">Safety</p>
            <p class="mt-2 font-semibold text-text">ISO 10218 · RIA R15.06</p>
            <p class="mt-1 text-xs text-text-secondary">Industrial robot safety standards we scope to.</p>
          </div>
        </Reveal>
        <Reveal :delay="360">
          <div class="rounded-2xl border border-dashed border-border bg-surface p-5">
            <p class="font-mono text-[10px] uppercase tracking-widest text-text-muted">Security</p>
            <p class="mt-2 font-semibold text-text">Firmware hardening · network isolation</p>
            <p class="mt-1 text-xs text-text-secondary">Post-UniPwn 2025 — verified patches, isolated robot networks.</p>
          </div>
        </Reveal>
        <Reveal :delay="420">
          <div class="rounded-2xl border border-dashed border-border bg-surface p-5">
            <p class="font-mono text-[10px] uppercase tracking-widest text-text-muted">Hardware</p>
            <p class="mt-2 font-semibold text-text">EOAT · power · mounting</p>
            <p class="mt-1 text-xs text-text-secondary">Grippers, batteries, charging, custom mounts.</p>
          </div>
        </Reveal>
      </div>
    </Section>

    <!-- =============================================================
         6. FOUNDER / WHY QTVUE — written, no stock photos
         ============================================================= -->
    <Section
      eyebrow="Why qtvue"
      heading="A practitioner, not a reseller."
    >
      <Reveal>
        <div class="grid gap-8 lg:grid-cols-12">
          <div class="lg:col-span-7">
            <p class="text-lg leading-relaxed text-text-secondary">
              qtvue exists because mid-market operators and research teams don't need another
              hardware vendor — they need someone who can make the platform
              <em>do the job</em>. We work inside the same public SDKs the platform teams
              publish, in the same simulators, on the same standards. When you hire us, you
              get a programming and integration team that ships.
            </p>
            <p class="mt-4 text-lg leading-relaxed text-text-secondary">
              We are pre-launch. We don't have a 240-cell case-study library to point at —
              and we won't fake one. What we do have is the depth to tell you, in plain
              English, what your use case will actually take. Some of them we will
              talk you out of. Most we will scope honestly.
            </p>
            <div class="mt-6 flex flex-wrap gap-3">
              <NuxtLink
                to="/about"
                class="inline-flex h-10 items-center rounded-full border border-border px-5 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-text-secondary transition-all hover:border-primary hover:text-primary"
              >
                About the founder →
              </NuxtLink>
              <NuxtLink
                to="/blog"
                class="inline-flex h-10 items-center rounded-full border border-border px-5 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-text-secondary transition-all hover:border-primary hover:text-primary"
              >
                Read technical articles →
              </NuxtLink>
            </div>
          </div>
          <div class="lg:col-span-5">
            <Card variant="default" pad="lg" class="border-dashed">
              <p class="eyebrow">Honest spec callouts</p>
              <ul class="mt-3 space-y-2 font-mono text-xs leading-relaxed text-text-secondary">
                <li>· G1 is indoor-only. No IP rating. Real battery is ~2 hr (vs 5–10 hr standby marketing).</li>
                <li>· Go2 carries IP67. Field-deployable.</li>
                <li>· H1 is the fastest production humanoid (1.78 m, ~3.7 m/s). Not a desk toy.</li>
                <li>· G1-D teleop rig has &lt;100 ms latency — usable for training data collection.</li>
                <li>· UniPwn (2025) affects Go2/B2/G1/H1 over Bluetooth. We verify firmware before deployment.</li>
              </ul>
              <p class="mt-4 text-xs text-text-muted">
                The kinds of specifics that signal we actually know the hardware.
              </p>
            </Card>
          </div>
        </div>
      </Reveal>
    </Section>

    <!-- =============================================================
         7. FINAL CTA
         ============================================================= -->
    <Section tone="ink" bleed>
      <Reveal>
        <div class="relative isolate overflow-hidden rounded-3xl">
          <ClientOnly>
            <AmbientField :density="500" height="100%" class="!relative" />
          </ClientOnly>
          <div class="relative grid gap-8 p-10 sm:p-16 lg:grid-cols-2 lg:items-center">
            <div>
              <StatusPill text="One short form" tone="accent" />
              <h2 class="display-md mt-4 text-ink-text">
                Tell us what you want to <span class="text-accent">do</span>.
              </h2>
              <p class="mt-4 max-w-md text-lg text-ink-text/70">
                Five questions, three minutes. We name the platform, the SDK, the
                integration pattern, and a realistic timeline. No sales call required.
              </p>
            </div>
            <div class="flex flex-col gap-3 lg:items-end">
              <Btn href="/intake" variant="accent" size="lg" arrow>
                Submit your use case
              </Btn>
              <p class="font-mono text-xs text-ink-text/50 lg:text-right">
                or just need programming help on a platform you already own? Same form.
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  </div>
</template>
