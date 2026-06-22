<script setup lang="ts">
/**
 * LearningPath — animated 6-step robotics learning pathway.
 *
 * Inspired by the k-robotic.com "Unitree Robot Operation for Beginners"
 * article: a step-by-step path from theory to real-world control.
 * Adapted for qtvue's industrial-robotics context (FANUC, ABB, KUKA,
 * Yaskawa, UR) and built to match the rest of the qtvue design system.
 *
 * Steps animate in on scroll via the Reveal wrapper, with a
 * staggered 80ms delay per step so they cascade like a timeline.
 */
defineProps<{
  steps?: Array<{
    number: string
    title: string
    summary: string
    duration: string
    tools: string[]
  }>
}>()

const defaultSteps = [
  {
    number: '01',
    title: 'Theory & Kinematics',
    summary:
      'Forward & inverse kinematics, Denavit–Hartenberg parameters, Jacobian, joint vs Cartesian space, singularities, and trajectory planning. The math behind every move the arm makes.',
    duration: '2–4 weeks',
    tools: ['Textbook: Spong / Craig', 'MATLAB or Python', 'Pen & paper'],
  },
  {
    number: '02',
    title: 'Simulation & OLP',
    summary:
      'Build the cell in RoboDK, Visual Components, or DELMIA. Validate cycle time, reach, and collisions before any steel is cut. Write the program offline and export to native code.',
    duration: '2–3 weeks',
    tools: ['RoboDK', 'Visual Components', 'DELMIA', 'Process Simulate'],
  },
  {
    number: '03',
    title: 'Basic Motion & I/O',
    summary:
      'Joint moves, linear moves, circular blends, speed/accel profiles, digital I/O, handshakes with conveyors and fixtures. The fundamentals every program builds on.',
    duration: '3–4 weeks',
    tools: ['FANUC KAREL', 'ABB RAPID', 'KUKA KRL', 'UR URScript'],
  },
  {
    number: '04',
    title: 'Sensors & Vision',
    summary:
      'Wire up 2D/3D vision for part location, force/torque for assembly, conveyor encoders for tracking. Make the arm responsive to the real world, not just the sim.',
    duration: '3–4 weeks',
    tools: ['Cognex In-Sight', 'Keyence CV', 'Photoneo 3D', 'ATI F/T'],
  },
  {
    number: '05',
    title: 'Optimization & Cycle Time',
    summary:
      'Profile the cycle, shave milliseconds off every move, eliminate air cuts, balance multi-robot handoffs. The difference between a good cell and a great one.',
    duration: 'Ongoing',
    tools: ['Cycle timer', 'Profiler', 'Offline sim', 'Production data'],
  },
  {
    number: '06',
    title: 'Deployment & Support',
    summary:
      'On-floor commissioning, operator training, program documentation, 24/7 monitoring, and a plan for when (not if) something breaks at 2am on a Saturday.',
    duration: '1 week + ongoing',
    tools: ['qtvue dashboard', 'Remote hand-off', 'SOPs', 'Runbooks'],
  },
]
</script>

<template>
  <div class="not-prose">
    <div class="mb-10 flex items-baseline justify-between">
      <p class="font-mono text-[10px] uppercase tracking-[0.18em] text-text-secondary">
        The pathway
      </p>
      <p class="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
        From theory → real-world control
      </p>
    </div>

    <ol class="relative space-y-4 sm:space-y-6">
      <!-- vertical line connecting steps -->
      <div
        class="absolute left-[19px] top-2 bottom-2 hidden w-px sm:block"
        aria-hidden="true"
      >
        <div class="h-full w-px bg-gradient-to-b from-primary/30 via-accent/30 to-transparent" />
      </div>

      <Reveal
        v-for="(s, i) in (steps ?? defaultSteps)"
        :key="s.number"
        :delay="i * 80"
        as="li"
      >
        <div
          class="group relative grid grid-cols-[40px_1fr] items-start gap-4 rounded-2xl border border-dashed border-border bg-surface p-5 transition-all hover:border-primary/40 hover:shadow-[var(--shadow-lg)] sm:p-6"
        >
          <!-- number bubble -->
          <div
            class="grid h-10 w-10 place-items-center rounded-full border-2 border-dashed border-primary/40 bg-bg font-mono text-xs font-bold text-primary transition-all group-hover:scale-110 group-hover:border-solid"
          >
            {{ s.number }}
          </div>

          <!-- content -->
          <div class="min-w-0">
            <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 class="text-lg font-bold tracking-tight text-text">{{ s.title }}</h3>
              <span class="font-mono text-[10px] uppercase tracking-widest text-text-muted">
                {{ s.duration }}
              </span>
            </div>
            <p class="mt-2 text-sm leading-relaxed text-text-secondary">{{ s.summary }}</p>
            <div class="mt-3 flex flex-wrap items-center gap-1.5">
              <span class="font-mono text-[10px] uppercase tracking-widest text-text-muted">
                Stack:
              </span>
              <span
                v-for="t in s.tools"
                :key="t"
                class="rounded-full border border-border bg-bg px-2 py-0.5 font-mono text-[10px] text-text-secondary"
              >
                {{ t }}
              </span>
            </div>
          </div>

          <!-- corner accent -->
          <span
            class="pointer-events-none absolute right-3 top-3 font-mono text-[10px] uppercase tracking-widest text-text-muted opacity-0 transition-opacity group-hover:opacity-100"
          >
            step {{ s.number }} / 06
          </span>
        </div>
      </Reveal>
    </ol>
  </div>
</template>
