<script setup lang="ts">
/**
 * /robot-review-checklist
 *
 * Greptile's code-review-checklist, adapted for robot integration review.
 * - Same 3-layer mental model (Mechanical / Structural / Narrative)
 * - Same UI: eyebrow + giant headline + long-form narrative intro
 * - The differentiator: each line is a LIVE TOGGLE that strikes through
 *   and persists to localStorage — this is a working tool, not a poster.
 *
 * Why this matters: the robot world has nothing like a "code review
 * checklist" yet. The closest thing is a deployment runbook, but those
 * are static PDFs. A greptile-style interactive checklist, scoped to
 * robot acceptance testing, is genuinely new and genuinely useful.
 */
import { ref, computed, onMounted, watch } from 'vue'

useSeoMeta({
  title: 'Robot Review Checklist & Acceptance Test (3-Layer Model) | qtvue',
  description:
    'Use this 3-layer robot review checklist before you sign off on a Unitree Go2, B2, G1, H1, or H2 deployment. Mechanical, structural, and narrative checks — with strike-through progress that persists locally.',
  ogTitle: 'Robot Review Checklist & Acceptance Test (3-Layer Model)',
  ogDescription:
    '3 layers × 9 categories × 47 checks. The first interactive acceptance checklist for Unitree robot deployments.',
})

useSchemaOrg([
  defineWebPage({
    '@type': 'WebPage',
    name: 'Robot Review Checklist & Acceptance Test (3-Layer Model) | qtvue',
    description:
      'A 3-layer interactive checklist for reviewing a Unitree robot integration before deployment. Mechanical (firmware, telemetry, network), Structural (E-stop, watchdog, sim-to-real), and Narrative (use case fit, ROI, safety case).',
    url: 'https://qtvue.com/robot-review-checklist',
    inLanguage: 'en-US',
    isPartOf: { '@type': 'WebSite', url: 'https://qtvue.com', name: 'qtvue' },
  }),
  defineBreadcrumb({
    itemListElement: [
      { name: 'Home', item: 'https://qtvue.com/' },
      { name: 'Robot Review Checklist', item: 'https://qtvue.com/robot-review-checklist' },
    ],
  }),
])

/* ===========================================================================
   3-layer model. Greptile had Mechanical / Structural / Narrative.
   For robot integration, the analogy maps cleanly:

     Mechanical   = "what sensors + scripts + dashboards should catch"
                     (the stuff a battery monitor / DDS ping should surface
                      before a human wastes time on it)

     Structural   = "what determines whether the robot keeps working
                     for the next 12 months" (E-stop wiring, fall
                     recovery, watchdog, sim-to-real coverage)

     Narrative    = "what the deployment means for the operator"
                     (does the use case actually fit the platform?
                      what's the safety case? what's the ROI math?)
   =========================================================================== */

interface CheckItem {
  text: string
  /** Optional inline code (shown in mono) — adds context like `unitree_sdk2` */
  code?: string
}
interface CheckCategory {
  title: string
  items: CheckItem[]
}
interface CheckLayer {
  number: string
  name: string
  /** accent color for the layer's left rail + heading underline */
  accent: 'mint' | 'amber' | 'forest'
  /** one-line tagline for the layer card */
  tagline: string
  /** longer explainer shown under the layer title */
  description: string
  categories: CheckCategory[]
}

const CHECKLIST: CheckLayer[] = [
  /* ---------------- Layer 1 ---------------- */
  {
    number: '1',
    name: 'Mechanical',
    accent: 'mint',
    tagline: 'What scripts and sensors should catch',
    description:
      'These are the things a battery monitor, a DDS ping, a firmware-version probe, or a 30-second unit-test should surface — without a human in the loop. Every minute a robotics engineer spends verifying this layer by hand is a minute stolen from real engineering.',
    categories: [
      {
        title: 'Firmware & SDK baseline',
        items: [
          { text: 'Firmware version recorded (run `unitree_legged_sdk --version` or check DDS topic)' },
          { text: 'Firmware is on a known-good release (no `-dev` / `-rc` tags in production)' },
          { text: 'SDK version pinned in `requirements.txt` / `package.json` / `Cargo.toml`' },
          { text: 'Cyclone DDS config matches the platform default (no surprise multicast on a hostile network)' },
          { text: 'Robot serial number and MAC recorded in your asset tracker' },
        ],
      },
      {
        title: 'Pre-flight telemetry',
        items: [
          { text: 'Battery telemetry parses cleanly (SOC %, voltage, current, temperature — all 4 fields, not just SOC)' },
          { text: 'IMU stream rate matches spec (Go2 = 500Hz, G1 = 200Hz, verify against the published rate)' },
          { text: 'Joint state stream rate matches spec and has zero gaps in a 60-second recording' },
          { text: 'Foot-force sensors (if present) all reporting non-zero and within 5% of each other at rest' },
          { text: 'Camera streams open at the advertised resolution and ≥25 fps' },
        ],
      },
      {
        title: 'Network & comms',
        items: [
          { text: 'DDS discovery completes in <3 seconds on the target network' },
          { text: 'No multicast storms in a 60-second idle capture (tcpdump + `tshark -Y "rtps"`)' },
          { text: 'Robot reachable on its documented port (Go2 = 8080, B2 = 8090, G1 = 8181) with no auth surprise' },
          { text: 'Wi-Fi RSSI on the control laptop > -65 dBm at the deployment location' },
        ],
      },
    ],
  },

  /* ---------------- Layer 2 ---------------- */
  {
    number: '2',
    name: 'Structural',
    accent: 'amber',
    tagline: 'What determines long-term reliability',
    description:
      'This is architecture. How the E-stop is wired, what happens on a controller crash, whether the fall-recovery routine is tested on the actual floor surface, whether the policy trained in Isaac Lab transfers to the real unit. This is what should take up 80% of your acceptance time.',
    categories: [
      {
        title: 'Safety primitives',
        items: [
          { text: 'Hardware E-stop button physically wired and tested (latches, recovers, visible LED)' },
          { text: 'Software E-stop triggered over DDS round-trips in <100ms' },
          { text: 'E-stop tested while robot is mid-walk, mid-jump, and mid-manipulation' },
          { text: 'Watchdog timer configured — robot halts gracefully if command stream pauses >250ms' },
          { text: 'Operator and bystander zones defined in the runbook with a measured distance' },
        ],
      },
      {
        title: 'Control loop & recovery',
        items: [
          { text: 'Fall-detection triggers a safe shutdown (joints brake, no power cycling mid-fall)' },
          { text: 'Self-righting routine tested on the deployment surface (carpet, tile, raised floor — all 3 if applicable)' },
          { text: 'Battery-low state forces a controlled stop, not a brownout surprise' },
          { text: "Controller restart under load doesn't leave the robot in a half-command state" },
          { text: 'Loss-of-network behavior documented (hold last pose? safe-stop? return-to-home?)' },
        ],
      },
      {
        title: 'Sim-to-real & policy',
        items: [
          { text: 'Policy trained in Isaac Lab tested on real hardware, not just the validation split' },
          { text: 'Domain randomization includes the actual deployment lighting, floor texture, and payload' },
          { text: 'Action noise / latency injected in sim to match observed real-world control loop' },
          { text: 'LeRobot / Diffusion Policy checkpoints versioned, with the sim-reward that produced them' },
        ],
      },
      {
        title: 'Security (post-UniPwn 2025)',
        items: [
          { text: 'Firmware ≥ 1.5.2 (UniPwn 2025 patch — CVE-equivalent Bluetooth RCE fixed in this build)' },
          { text: 'Bluetooth pairing requires a physical button press, not just proximity' },
          { text: 'Default credentials rotated — no `unitree` / `1234` left on the device' },
          { text: 'Network segmentation: robot on its own VLAN, not the same broadcast domain as the office Wi-Fi' },
        ],
      },
    ],
  },

  /* ---------------- Layer 3 ---------------- */
  {
    number: '3',
    name: 'Narrative',
    accent: 'forest',
    tagline: 'What the deployment means for the operator',
    description:
      "Most of this doesn't live in the robot's spec sheet — it lives in the runbook, the stakeholder meeting, and the post-deployment review. Without this layer, you've shipped a feature that nobody knows how to operate, scale, or defend in a safety audit.",
    categories: [
      {
        title: 'Use case fit',
        items: [
          { text: 'Platform form factor matches the environment (quadruped vs humanoid vs arm — not negotiable)' },
          { text: 'Indoor-only platforms (G1, R1) flagged as such in the runbook and the access policy' },
          { text: 'Payload + terrain spec is within the published limits, with a 25% safety margin' },
          { text: 'Operator training plan exists and is signed off before first unsupervised run' },
        ],
      },
      {
        title: 'Documentation & reasoning',
        items: [
          { text: 'Runbook written in the operator\'s language, not the engineer\'s' },
          { text: 'Failure modes and recovery documented (at least the top 5 most likely)' },
          { text: 'Why this platform, why this policy, why this surface — captured in the deployment PR' },
          { text: 'Rollback plan exists (can we pull this robot out of the loop in <30 minutes?)' },
        ],
      },
      {
        title: 'ROI & sustainability',
        items: [
          { text: 'Measured battery life (2-hour marketing claim vs your duty cycle) captured in `real-battery-life` data' },
          { text: 'Maintenance interval documented (joint lubrication, battery cycle count, firmware cadence)' },
          { text: 'Spare-parts list in inventory (most common failure: leg servo, battery, depth-camera cover)' },
          { text: 'Cost-per-operating-hour tracked and trended — if it\'s growing, something is degrading' },
        ],
      },
      {
        title: 'Safety case',
        items: [
          { text: 'Hazard analysis done (ISO 12100 or equivalent) — at least for the highest-risk interactions' },
          { text: 'Emergency-stop procedure rehearsed with the actual operator, not just the integrator' },
          { text: 'Incident-reporting channel set up (who gets called when the robot does something unexpected)' },
        ],
      },
    ],
  },
]

/* ===========================================================================
   Persistence: keyed by a stable per-item id. localStorage, no SSR touch.
   We avoid useStorage from @vueuse for now to keep the dep footprint flat.
   =========================================================================== */

const STORAGE_KEY = 'qtvue:robot-review-checklist:v1'

function makeId(layer: number, cat: number, item: number) {
  return `l${layer}.c${cat}.i${item}`
}

const checked = ref<Set<string>>(new Set())
const ready = ref(false)

onMounted(() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const arr = JSON.parse(raw)
      if (Array.isArray(arr)) checked.value = new Set(arr)
    }
  } catch {
    /* corrupt storage — start clean */
  }
  ready.value = true
})

watch(checked, (s) => {
  if (!ready.value) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...s]))
  } catch {
    /* quota exceeded — ignore */
  }
}, { deep: true })

function toggle(id: string) {
  // create a new Set so the deep watcher fires
  const next = new Set(checked.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  checked.value = next
}

function reset() {
  checked.value = new Set()
}

/* ---------- aggregate stats ---------- */

const totalItems = computed(() =>
  CHECKLIST.reduce(
    (acc, l) => acc + l.categories.reduce((a, c) => a + c.items.length, 0),
    0,
  ),
)

const checkedCount = computed(() => {
  let n = 0
  for (const l of CHECKLIST) {
    for (let ci = 0; ci < l.categories.length; ci++) {
      for (let ii = 0; ii < l.categories[ci].items.length; ii++) {
        if (checked.value.has(makeId(CHECKLIST.indexOf(l), ci, ii))) n++
      }
    }
  }
  return n
})

const progressPct = computed(() =>
  totalItems.value === 0 ? 0 : Math.round((checkedCount.value / totalItems.value) * 100),
)

/* ---------- accent color helpers (resolve to tailwind classes) ---------- */

const accentBg: Record<CheckLayer['accent'], string> = {
  mint: 'bg-[#3df5a3]',
  amber: 'bg-[#f5a13d]',
  forest: 'bg-[#0e5c3a]',
}
const accentText: Record<CheckLayer['accent'], string> = {
  mint: 'text-[#0a8f57]',
  amber: 'text-[#a55a0a]',
  forest: 'text-[#0e5c3a]',
}
const accentBorder: Record<CheckLayer['accent'], string> = {
  mint: 'border-l-[#3df5a3]',
  amber: 'border-l-[#f5a13d]',
  forest: 'border-l-[#0e5c3a]',
}
const accentGlow: Record<CheckLayer['accent'], string> = {
  mint: 'shadow-[0_0_0_1px_rgba(61,245,163,0.35)]',
  amber: 'shadow-[0_0_0_1px_rgba(245,161,61,0.35)]',
  forest: 'shadow-[0_0_0_1px_rgba(14,92,58,0.35)]',
}
const accentChecked: Record<CheckLayer['accent'], string> = {
  mint: 'border-[#3df5a3] bg-[#3df5a3]/10',
  amber: 'border-[#f5a13d] bg-[#f5a13d]/10',
  forest: 'border-[#0e5c3a] bg-[#0e5c3a]/10',
}
</script>

<template>
  <div class="bg-bg text-text font-sans">
    <!-- ====================================================================
         HERO — greptile's "giant headline + eyebrow + 1-line tagline"
         pattern. Display font, lime/green for the headline.
         ==================================================================== -->
    <section class="relative overflow-hidden border-b border-dashed border-border">
      <div class="absolute inset-0 bg-halftone-bg opacity-50 pointer-events-none" />
      <div class="relative mx-auto max-w-5xl px-6 py-20 md:py-28">
        <div class="flex items-center gap-3 mb-6">
          <span class="inline-block h-2 w-2 rounded-full bg-accent animate-pulse" />
          <span class="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
            Robot Review Checklist
          </span>
        </div>

        <h1
          data-title-length="28"
          class="font-display font-bold text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] tracking-tight text-primary"
          style="--blog-title-length: 28"
        >
          The Robot <br class="hidden sm:block" />Review Checklist
        </h1>

        <p class="mt-8 max-w-3xl text-lg md:text-xl leading-relaxed text-text-secondary">
          Use this 3-layer checklist before you sign off on a Unitree Go2, B2, G1, H1, or H2
          deployment. <strong>Tick each line as you verify it</strong> — your progress saves locally
          and persists across reloads. No login, no cloud, no telemetry.
        </p>

        <!-- progress strip -->
        <div class="mt-10 flex flex-col sm:flex-row sm:items-center gap-4">
          <div class="flex-1">
            <div class="flex items-baseline justify-between mb-2">
              <span class="font-mono text-[11px] uppercase tracking-[0.18em] text-text-secondary">
                Your progress
              </span>
              <span class="font-mono text-sm font-bold text-primary">
                {{ checkedCount }} / {{ totalItems }} ({{ progressPct }}%)
              </span>
            </div>
            <div class="relative h-2 w-full overflow-hidden rounded-full bg-surface-2">
              <div
                class="absolute inset-y-0 left-0 bg-accent transition-all duration-500 ease-out"
                :style="{ width: `${progressPct}%` }"
              />
            </div>
          </div>
          <button
            v-if="checkedCount > 0"
            type="button"
            class="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-text-secondary hover:text-danger transition-colors"
            @click="reset"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12a9 9 0 1 0 9-9" />
              <path d="M3 4v5h5" />
            </svg>
            Reset
          </button>
        </div>
      </div>
    </section>

    <!-- ====================================================================
         INTRO — the 3-layer mental model
         ==================================================================== -->
    <section class="border-b border-dashed border-border">
      <div class="mx-auto max-w-3xl px-6 py-16 md:py-20">
        <h2 class="font-display text-2xl md:text-3xl font-bold text-text mb-6">
          Why the checklist is organized this way
        </h2>

        <div class="prose prose-lg max-w-none text-text-secondary space-y-5">
          <p>
            You receive a new Unitree shipment. Forty-five minutes from now you're supposed to
            run a 20-minute safety demo for the VP. You have ten minutes to decide whether this
            robot is ready to leave the crate.
          </p>

          <p>
            So you <em>skim</em>. You confirm the legs are attached, you push the button and
            watch it stand up, you wave at the camera, you ship it to the demo. The demo goes
            fine. The robot makes it into a deployment loop. Three weeks later, it falls over
            in a meeting room with a 25% slope in the floor, the E-stop was on the wrong
            VLAN, and now the VP is asking <em>"didn't anyone test this?"</em>
          </p>

          <p>
            The problem is: your team has never agreed on what a robot review is actually for.
            This is not a process problem; this is a <strong>clarity problem</strong>, and
            clarity begins by understanding what you're looking at.
          </p>

          <p>
            When you unbox a robot, you're not looking at a single machine to test. You're
            looking at <strong>three layers stacked on top of one another</strong>. We'll give
            you a mental model to identify these layers, deal with them correctly, and take
            your robot acceptance testing to the next level.
          </p>
        </div>

        <h2 class="mt-16 font-display text-2xl md:text-3xl font-bold text-text mb-6 scroll-mt-24">
          The 3-Layer Mental Model
        </h2>

        <div class="space-y-10">
          <div>
            <h3 class="font-mono text-[11px] uppercase tracking-[0.18em] text-[#0a8f57] mb-2">
              Layer 1
            </h3>
            <h4 class="font-display text-xl font-bold text-text mb-3">
              Mechanical — what sensors and scripts should catch
            </h4>
            <div class="space-y-3 text-text-secondary">
              <p>
                This is firmware versions, battery telemetry, network handshake success, IMU
                stream rates. It's everything a computer can verify <em>without</em> understanding
                what your robot is about to do.
              </p>
              <p>
                Here's the thing: <em>every minute a robotics engineer spends verifying this
                layer by hand is a waste.</em> If someone is running battery diagnostics with a
                multimeter when there's a `battery_state` DDS topic, that's not robotics — that's
                archaeology.
              </p>
            </div>
          </div>

          <div>
            <h3 class="font-mono text-[11px] uppercase tracking-[0.18em] text-[#a55a0a] mb-2">
              Layer 2
            </h3>
            <h4 class="font-display text-xl font-bold text-text mb-3">
              Structural — what determines long-term reliability
            </h4>
            <div class="space-y-3 text-text-secondary">
              <p>
                This is architecture. You review how the E-stop is wired, what happens on a
                controller crash, whether the fall-recovery routine is tested on the actual
                floor surface, whether the policy trained in Isaac Lab transfers to the real
                unit. You ask: <em>"if we do it this way, what happens when the network drops
                mid-walk, or the battery hits 5% mid-grasp, or the operator forgets to put the
                robot in its crate at end of day?"</em>
              </p>
              <p>
                This is what should take up 80% of your acceptance time. This is
                <em>hard</em>. It requires understanding both the robot and the environment
                it lives in. It requires taste, experience, and the ability to imagine
                failures.
              </p>
              <p>
                A junior engineer can run the Layer 1 battery test. Only senior engineers
                who've lived through a fall-recovery failure can catch the Layer 2 ones.
              </p>
            </div>
          </div>

          <div>
            <h3 class="font-mono text-[11px] uppercase tracking-[0.18em] text-[#0e5c3a] mb-2">
              Layer 3
            </h3>
            <h4 class="font-display text-xl font-bold text-text mb-3">
              Narrative — what the deployment means for the operator
            </h4>
            <div class="space-y-3 text-text-secondary">
              <p>
                This is the <em>why</em>. Why this platform? Why this floor? Why this policy?
                What happens when the operator's kid walks into the work cell? What's the
                plan if the robot doesn't actually deliver on the use case? What's the
                rollback if the deployment turns out to be a bad fit?
              </p>
              <p>
                Most of this doesn't live in the spec sheet — it lives in the runbook, the
                stakeholder meeting, and the post-deployment review. This is where you
                communicate your intent for the deployment, and this is where you get to make
                decisions that live forever, since this is where you set your standards.
              </p>
              <p>
                A deployment with no narrative context is a deployment that someone else has
                to debug. The reviewer has to reconstruct the reasoning from scratch, asks
                questions that should have been answered upfront, and approves decisions they
                don't fully understand because they're exhausted from detective work.
              </p>
            </div>
          </div>

          <p class="text-text font-medium">
            Once you see these three layers, the rest of the checklist finally makes sense.
            Let's make it practical.
          </p>
        </div>
      </div>
    </section>

    <!-- ====================================================================
         THE CHECKLIST — interactive, 3 layer cards
         ==================================================================== -->
    <section id="checklist" class="border-b border-dashed border-border bg-surface">
      <div class="mx-auto max-w-4xl px-6 py-16 md:py-20">
        <div class="mb-12 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <span class="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
              The Checklist
            </span>
            <h2 class="mt-2 font-display text-3xl md:text-4xl font-bold text-text">
              Tick each line as you verify it
            </h2>
          </div>
          <p class="font-mono text-xs text-text-secondary max-w-xs">
            Click any line. Your progress saves in this browser.
            <button
              v-if="checkedCount > 0"
              type="button"
              class="ml-2 text-danger hover:underline"
              @click="reset"
            >Reset</button>
          </p>
        </div>

        <div class="space-y-10">
          <article
            v-for="(layer, li) in CHECKLIST"
            :key="layer.number"
            :class="[
              'relative rounded-2xl border border-border bg-bg p-6 md:p-8 border-l-4 transition-shadow',
              accentBorder[layer.accent],
            ]"
          >
            <!-- layer header -->
            <header class="mb-6 pb-6 border-b border-dashed border-border">
              <div class="flex items-start gap-4">
                <div
                  :class="[
                    'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-display font-bold text-2xl',
                    accentBg[layer.accent],
                    layer.accent === 'mint' ? 'text-[#0a1f14]' : 'text-white',
                  ]"
                >
                  {{ layer.number }}
                </div>
                <div class="flex-1">
                  <p :class="['font-mono text-[11px] uppercase tracking-[0.18em]', accentText[layer.accent]]">
                    Layer {{ layer.number }}
                  </p>
                  <h3 class="mt-1 font-display text-2xl md:text-3xl font-bold text-text">
                    {{ layer.name }}
                  </h3>
                  <p class="mt-2 font-mono text-sm text-text-secondary italic">
                    {{ layer.tagline }}
                  </p>
                  <p class="mt-3 text-text-secondary leading-relaxed">
                    {{ layer.description }}
                  </p>
                </div>
              </div>
            </header>

            <!-- categories inside this layer -->
            <div class="space-y-8">
              <div v-for="(cat, ci) in layer.categories" :key="cat.title">
                <h4 class="font-mono text-[11px] uppercase tracking-[0.18em] text-text-secondary mb-3">
                  {{ cat.title }}
                </h4>
                <ul class="space-y-1">
                  <li
                    v-for="(item, ii) in cat.items"
                    :key="makeId(li, ci, ii)"
                  >
                    <button
                      type="button"
                      :aria-pressed="checked.has(makeId(li, ci, ii))"
                      :class="[
                        'group flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-200',
                        'hover:bg-surface-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                        checked.has(makeId(li, ci, ii))
                          ? accentChecked[layer.accent]
                          : 'border border-transparent',
                      ]"
                      @click="toggle(makeId(li, ci, ii))"
                    >
                      <!-- checkbox square -->
                      <span
                        :class="[
                          'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all duration-200',
                          checked.has(makeId(li, ci, ii))
                            ? [accentBg[layer.accent], 'border-transparent', accentGlow[layer.accent]]
                            : 'border-border-strong bg-bg group-hover:border-primary',
                        ]"
                      >
                        <svg
                          v-if="checked.has(makeId(li, ci, ii))"
                          :class="layer.accent === 'mint' ? 'text-[#0a1f14]' : 'text-white'"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="3.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>

                      <!-- label -->
                      <span
                        :class="[
                          'flex-1 text-[15px] leading-relaxed transition-all duration-200',
                          checked.has(makeId(li, ci, ii))
                            ? 'line-through text-text-muted'
                            : 'text-text',
                        ]"
                      >
                        {{ item.text }}
                      </span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ====================================================================
         EXAMPLES — real failures this checklist would have caught
         ==================================================================== -->
    <section class="border-b border-dashed border-border">
      <div class="mx-auto max-w-3xl px-6 py-16 md:py-20">
        <h2 class="font-display text-2xl md:text-3xl font-bold text-text mb-6">
          Robot Review Examples
        </h2>

        <p class="text-text-secondary mb-8">
          These are real failures from public Unitree reports, the
          <code class="font-mono text-sm bg-surface px-1.5 py-0.5 rounded border border-border">/r/robotics</code>
          subreddit, and direct field reports we've collected. Each one would have been caught
          by a line in this checklist:
        </p>

        <div class="space-y-4">
          <div class="rounded-xl border border-border bg-surface p-5">
            <p class="font-mono text-[11px] uppercase tracking-[0.18em] text-danger mb-2">
              Layer 2 — Security
            </p>
            <p class="text-text">
              <strong>UniPwn 2025</strong> — Bluetooth RCE on Unitree robots running firmware
              &lt; 1.5.2 allowed an attacker within BT range to take control of the gait loop.
              <strong>Caught by:</strong> "Firmware ≥ 1.5.2" + "Bluetooth pairing requires a
              physical button press."
            </p>
          </div>

          <div class="rounded-xl border border-border bg-surface p-5">
            <p class="font-mono text-[11px] uppercase tracking-[0.18em] text-[#a55a0a] mb-2">
              Layer 2 — Control loop
            </p>
            <p class="text-text">
              <strong>Go2 fall on raised-floor meeting room</strong> — fall-recovery routine
              trained on flat gym floor, never tested on a 25mm raised access floor.
              <strong>Caught by:</strong> "Self-righting routine tested on the deployment
              surface."
            </p>
          </div>

          <div class="rounded-xl border border-border bg-surface p-5">
            <p class="font-mono text-[11px] uppercase tracking-[0.18em] text-[#0e5c3a] mb-2">
              Layer 3 — Use case fit
            </p>
            <p class="text-text">
              <strong>G1 outdoor demo</strong> — humanoid taken to an outdoor parking-lot demo
              with no weather protection, slipped on wet asphalt on first walk.
              <strong>Caught by:</strong> "Indoor-only platforms (G1, R1) flagged in the
              runbook and access policy."
            </p>
          </div>

          <div class="rounded-xl border border-border bg-surface p-5">
            <p class="font-mono text-[11px] uppercase tracking-[0.18em] text-[#0a8f57] mb-2">
              Layer 1 — Pre-flight telemetry
            </p>
            <p class="text-text">
              <strong>B2 5-volt rail brownout under payload</strong> — battery SOC reading
              looked fine (50%) but the 5V rail to the depth cameras dipped under transient
              load, causing intermittent SLAM failures. <strong>Caught by:</strong> "Battery
              telemetry parses all 4 fields (SOC, voltage, current, temperature), not just
              SOC."
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ====================================================================
         BEST PRACTICES — mapped to the 3 layers
         ==================================================================== -->
    <section class="border-b border-dashed border-border">
      <div class="mx-auto max-w-3xl px-6 py-16 md:py-20">
        <h2 class="font-display text-2xl md:text-3xl font-bold text-text mb-6">
          Best Practices, Mapped to the Layers
        </h2>
        <p class="text-text-secondary mb-10">
          Best practices aren't random rules — they're tactics for solving problems in one of
          the three layers. Every rule of thumb you've heard maps to a specific layer.
        </p>

        <div class="space-y-8">
          <div>
            <h3 class="font-mono text-[11px] uppercase tracking-[0.18em] text-[#0a8f57] mb-3">
              Layer 1 (Mechanical)
            </h3>
            <ol class="list-decimal pl-5 space-y-2 text-text-secondary">
              <li>
                <strong class="text-text">Automate the diagnostics.</strong> A 60-second
                startup script that reads firmware, battery, joint state, and DDS health is
                worth more than an hour of manual probing.
              </li>
              <li>
                <strong class="text-text">Use a known-good firmware manifest.</strong> Don't
                trust "latest" — pin to a known-good version and reject robots on other
                builds.
              </li>
              <li>
                <strong class="text-text">Verify the network, not just the robot.</strong>
                The DDS handshake will fail on a hostile network even if the robot is perfect.
              </li>
            </ol>
          </div>

          <div>
            <h3 class="font-mono text-[11px] uppercase tracking-[0.18em] text-[#a55a0a] mb-3">
              Layer 2 (Structural)
            </h3>
            <ol class="list-decimal pl-5 space-y-2 text-text-secondary">
              <li>
                <strong class="text-text">Test on the actual deployment surface.</strong>
                A floor that's 3mm different in coefficient of friction is a different test.
              </li>
              <li>
                <strong class="text-text">Senior engineers should own the safety case.</strong>
                Matches expertise to structural complexity — same reason a senior surgeon
                scrubs in for the hard part.
              </li>
              <li>
                <strong class="text-text">Test failure modes, not just happy paths.</strong>
                What does the robot do when Wi-Fi drops? When the E-stop is hit mid-walk?
                When the battery hits 5% mid-grasp?
              </li>
            </ol>
          </div>

          <div>
            <h3 class="font-mono text-[11px] uppercase tracking-[0.18em] text-[#0e5c3a] mb-3">
              Layer 3 (Narrative)
            </h3>
            <ol class="list-decimal pl-5 space-y-2 text-text-secondary">
              <li>
                <strong class="text-text">Write a runbook, not a spec.</strong> The
                operator needs to know what to do at 9am on a Tuesday, not what the
                architecture diagram looks like.
              </li>
              <li>
                <strong class="text-text">Capture the "why" in the deployment PR.</strong>
                Why this platform, why this surface, why this policy. Future you will thank
                present you.
              </li>
              <li>
                <strong class="text-text">Plan the rollback on day one.</strong> If you
                can't pull the robot out of the loop in 30 minutes, you don't have a
                deployment — you have a liability.
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>

    <!-- ====================================================================
         FINAL CTA — single, on-brand
         ==================================================================== -->
    <section class="bg-ink-bg text-ink-text">
      <div class="mx-auto max-w-3xl px-6 py-20 md:py-28 text-center">
        <h2 class="font-display text-3xl md:text-5xl font-bold leading-tight">
          Got a Unitree robot to ship?
        </h2>
        <p class="mt-6 text-lg text-ink-text/80 max-w-2xl mx-auto">
          Run the checklist above. When you hit a line you can't verify on your own, that's
          the line we help with. We sell, program, and integrate Unitree robots — Go2, B2, G1,
          R1, H1, H2, and arms.
        </p>
        <div class="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            to="/intake"
            class="group inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full font-semibold uppercase tracking-[0.12em] text-sm bg-accent text-[#0a1f14] hover:bg-accent-600 transition-colors"
          >
            Submit your use case
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="transition-transform group-hover:translate-x-0.5">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </NuxtLink>
          <NuxtLink
            to="/blog"
            class="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full font-semibold uppercase tracking-[0.12em] text-sm border border-ink-text/30 hover:bg-ink-text/10 transition-colors"
          >
            Read the research
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* halftone background — used on the hero, mirrors the rest of qtvue */
.bg-halftone-bg {
  background-image:
    radial-gradient(circle at 1px 1px, rgba(14, 92, 58, 0.18) 1px, transparent 0);
  background-size: 24px 24px;
}
</style>
