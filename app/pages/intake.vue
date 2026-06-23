<script setup lang="ts">
/**
 * /intake — the conversion form. Per the brief:
 *   1. What are you trying to do?  (free text + chips)
 *   2. Which platform?             (chips + "Not sure — advise me")
 *   3. Current state               (chips)
 *   4. Constraints                 (timeline, optional budget, volume)
 *   5. Contact + anything else
 *
 * One question per screen on mobile. Dashed-border step cards.
 * Monospace step labels. SSR-safe.
 *
 * NOTE: This form currently does NOT submit anywhere. It's a static
 * SSR-rendered UI showing what the form would look like. A future
 * engagement would wire this to a backend (Formspree, custom API,
 * or CRM webhook).
 */
useSeoMeta({
  title: 'Submit your use case — qtvue',
  description: 'Five questions, three minutes. Engineering review within 1 business day.',
})

// ContactPage schema — helps AI engines surface this page as the
// canonical 'contact' / 'request a quote' endpoint.
useSchemaOrg([
  defineWebPage({
    '@type': 'ContactPage',
    name: 'Submit your use case — qtvue',
    description: 'Five questions, three minutes. Engineering review within 1 business day. No commitment, no spam.',
    url: 'https://qtvue.com/intake',
    inLanguage: 'en-US',
    isPartOf: { '@type': 'WebSite', url: 'https://qtvue.com', name: 'qtvue' },
    primaryImage: 'https://qtvue.com/og-default.svg',
    mainEntity: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      url: 'https://qtvue.com/intake',
      availableLanguage: ['English'],
      areaServed: 'Worldwide',
      hoursAvailable: 'Mo–Fr 09:00–18:00 UTC',
    },
  }),
  defineBreadcrumb({
    itemListElement: [
      { name: 'Home', item: 'https://qtvue.com/' },
      { name: 'Submit your use case', item: 'https://qtvue.com/intake' },
    ],
  }),
])

const TOTAL_STEPS = 5
const step = ref(1)
const submitted = ref(false)

const form = reactive({
  goal: '',
  goalChips: [] as string[],
  platform: '',
  platformOther: '',
  currentState: '',
  timeline: '',
  budget: '',
  volume: '',
  name: '',
  email: '',
  company: '',
  notes: '',
})

const goalChips = ['Automation', 'Inspection', 'Research', 'Security', 'Education']
const platformChips = ['Go2', 'B2', 'G1', 'R1', 'H1', 'H2', 'Arm', "Not sure — advise me"]
const stateChips = ['Manual today', 'Semi-automated', 'Greenfield', 'I already own hardware']
const timelineChips = ['< 1 month', '1–3 months', '3–6 months', '6+ months / exploring']
const budgetChips = ['Under $10K', '$10–50K', '$50–150K', '$150K+', 'Programming only']

function toggleChip(field: 'goalChips', chip: string) {
  const arr = form[field]
  const i = arr.indexOf(chip)
  if (i === -1) arr.push(chip)
  else arr.splice(i, 1)
}

function selectSingle(field: 'platform' | 'currentState' | 'timeline' | 'budget', value: string) {
  form[field] = form[field] === value ? '' : value
}

function next() {
  if (step.value < TOTAL_STEPS) step.value++
}
function prev() {
  if (step.value > 1) step.value--
}
function submit() {
  submitted.value = true
}

const canProceed = computed(() => {
  if (step.value === 1) return form.goal.trim().length > 0 || form.goalChips.length > 0
  if (step.value === 2) return form.platform !== ''
  if (step.value === 3) return form.currentState !== ''
  if (step.value === 4) return form.timeline !== ''
  if (step.value === 5) return form.name.trim() && /.+@.+\..+/.test(form.email)
  return false
})
</script>

<template>
  <div>
    <section class="border-b border-border bg-bg">
      <Container class="py-12 sm:py-16">
        <Reveal>
          <p class="eyebrow">Submit your use case</p>
          <h1 class="display-lg mt-3 max-w-3xl">
            Tell us what you want to <span class="hl">do</span>.
          </h1>
          <p class="mt-4 max-w-2xl text-text-secondary">
            Five questions, three minutes. Engineering review within
            1 business day. Free, no commitment.
          </p>
        </Reveal>
      </Container>
    </section>

    <!-- ============================================================
         BEFORE YOU SUBMIT — run the checklist first.
         The most intelligent place for this: anyone landing on the
         intake page is committed enough to engage. Giving them a
         free self-assessment tool right before the form helps them
         write a better submission (faster engineering review on
         our end = better quote for them).
         ============================================================ -->
    <ChecklistCallout
      variant="banner"
      context="On the conversion path · before the 5-step form"
      placement="intake"
    />

    <Section>
      <div class="mx-auto max-w-2xl">
        <!-- progress -->
        <Reveal>
          <div class="mb-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-text-muted">
            <span>step {{ String(step).padStart(2, '0') }} / {{ String(TOTAL_STEPS).padStart(2, '0') }}</span>
            <div class="ml-3 flex flex-1 gap-1">
              <span
                v-for="i in TOTAL_STEPS"
                :key="i"
                class="h-1 flex-1 rounded-full"
                :class="i <= step ? 'bg-primary' : 'bg-border'"
              />
            </div>
          </div>
        </Reveal>

        <!-- success state -->
        <Reveal v-if="submitted">
          <Card variant="default" pad="lg" class="border-dashed text-center">
            <p class="font-mono text-[10px] uppercase tracking-widest text-primary">received</p>
            <h2 class="display-md mt-3 text-text">Thanks — we'll be in touch.</h2>
            <p class="mt-4 text-text-secondary">
              We've sent a copy of your submission to
              <strong>{{ form.email }}</strong>. Expect a reply from a real
              engineer within 1 business day.
            </p>
            <div class="mt-6">
              <NuxtLink
                to="/"
                class="inline-flex h-10 items-center rounded-full border border-border px-5 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-text-secondary transition-all hover:border-primary hover:text-primary"
              >
                Back to home
              </NuxtLink>
            </div>
          </Card>
        </Reveal>

        <!-- form steps -->
        <Reveal v-else>
          <Card variant="default" pad="lg" class="border-dashed">
            <!-- Step 1: what are you trying to do? -->
            <div v-if="step === 1">
              <p class="font-mono text-[10px] uppercase tracking-widest text-primary">step 01 / 05</p>
              <h2 class="mt-3 text-2xl font-bold tracking-tight text-text">
                What are you trying to do?
              </h2>
              <p class="mt-2 text-sm text-text-secondary">
                In one or two sentences, or pick the closest chip.
              </p>
              <div class="mt-6">
                <textarea
                  v-model="form.goal"
                  rows="4"
                  class="w-full rounded-2xl border border-dashed border-border bg-bg p-4 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none"
                  placeholder="e.g. I want to automate the inspection rounds in our 12,000 sq ft warehouse, twice a day, on shift handover."
                />
                <div class="mt-4 flex flex-wrap gap-2">
                  <button
                    v-for="chip in goalChips"
                    :key="chip"
                    type="button"
                    @click="toggleChip('goalChips', chip)"
                    class="rounded-full border border-dashed px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-all"
                    :class="form.goalChips.includes(chip)
                      ? 'border-primary bg-primary text-bg'
                      : 'border-border text-text-secondary hover:border-primary hover:text-primary'"
                  >
                    {{ chip }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Step 2: which platform -->
            <div v-else-if="step === 2">
              <p class="font-mono text-[10px] uppercase tracking-widest text-primary">step 02 / 05</p>
              <h2 class="mt-3 text-2xl font-bold tracking-tight text-text">
                Which platform?
              </h2>
              <p class="mt-2 text-sm text-text-secondary">
                Pick one. If you don't know, "advise me" — that's the most
                popular choice and we're happy to recommend.
              </p>
              <div class="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
                <button
                  v-for="p in platformChips"
                  :key="p"
                  type="button"
                  @click="selectSingle('platform', p)"
                  class="rounded-2xl border border-dashed px-4 py-3 text-left text-sm font-medium transition-all"
                  :class="form.platform === p
                    ? 'border-primary bg-primary text-bg'
                    : 'border-border bg-bg text-text hover:border-primary'"
                >
                  {{ p }}
                </button>
              </div>
            </div>

            <!-- Step 3: current state -->
            <div v-else-if="step === 3">
              <p class="font-mono text-[10px] uppercase tracking-widest text-primary">step 03 / 05</p>
              <h2 class="mt-3 text-2xl font-bold tracking-tight text-text">
                Where are you today?
              </h2>
              <p class="mt-2 text-sm text-text-secondary">
                Helps us scope. Pick the closest.
              </p>
              <div class="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  v-for="s in stateChips"
                  :key="s"
                  type="button"
                  @click="selectSingle('currentState', s)"
                  class="rounded-2xl border border-dashed px-4 py-3 text-left text-sm font-medium transition-all"
                  :class="form.currentState === s
                    ? 'border-primary bg-primary text-bg'
                    : 'border-border bg-bg text-text hover:border-primary'"
                >
                  {{ s }}
                </button>
              </div>
            </div>

            <!-- Step 4: constraints -->
            <div v-else-if="step === 4">
              <p class="font-mono text-[10px] uppercase tracking-widest text-primary">step 04 / 05</p>
              <h2 class="mt-3 text-2xl font-bold tracking-tight text-text">
                Constraints
              </h2>
              <p class="mt-2 text-sm text-text-secondary">
                Timeline and rough budget. Both are optional but they
                help us scope honestly.
              </p>
              <div class="mt-6 space-y-6">
                <div>
                  <p class="eyebrow">Timeline</p>
                  <div class="mt-3 flex flex-wrap gap-2">
                    <button
                      v-for="t in timelineChips"
                      :key="t"
                      type="button"
                      @click="selectSingle('timeline', t)"
                      class="rounded-full border border-dashed px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-all"
                      :class="form.timeline === t
                        ? 'border-primary bg-primary text-bg'
                        : 'border-border text-text-secondary hover:border-primary hover:text-primary'"
                    >
                      {{ t }}
                    </button>
                  </div>
                </div>
                <div>
                  <p class="eyebrow">Budget band (optional)</p>
                  <div class="mt-3 flex flex-wrap gap-2">
                    <button
                      v-for="b in budgetChips"
                      :key="b"
                      type="button"
                      @click="selectSingle('budget', b)"
                      class="rounded-full border border-dashed px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-all"
                      :class="form.budget === b
                        ? 'border-primary bg-primary text-bg'
                        : 'border-border text-text-secondary hover:border-primary hover:text-primary'"
                    >
                      {{ b }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 5: contact -->
            <div v-else-if="step === 5">
              <p class="font-mono text-[10px] uppercase tracking-widest text-primary">step 05 / 05</p>
              <h2 class="mt-3 text-2xl font-bold tracking-tight text-text">
                Where do we reach you?
              </h2>
              <p class="mt-2 text-sm text-text-secondary">
                A real engineer will reply within 1 business day.
              </p>
              <div class="mt-6 space-y-4">
                <div>
                  <label class="font-mono text-[10px] uppercase tracking-widest text-text-muted">Name</label>
                  <input
                    v-model="form.name"
                    type="text"
                    class="mt-1 w-full rounded-xl border border-dashed border-border bg-bg p-3 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label class="font-mono text-[10px] uppercase tracking-widest text-text-muted">Email</label>
                  <input
                    v-model="form.email"
                    type="email"
                    class="mt-1 w-full rounded-xl border border-dashed border-border bg-bg p-3 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none"
                    placeholder="you@company.com"
                  />
                </div>
                <div>
                  <label class="font-mono text-[10px] uppercase tracking-widest text-text-muted">Company / lab (optional)</label>
                  <input
                    v-model="form.company"
                    type="text"
                    class="mt-1 w-full rounded-xl border border-dashed border-border bg-bg p-3 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none"
                    placeholder="Where you're based"
                  />
                </div>
                <div>
                  <label class="font-mono text-[10px] uppercase tracking-widest text-text-muted">Anything else (optional)</label>
                  <textarea
                    v-model="form.notes"
                    rows="3"
                    class="mt-1 w-full rounded-xl border border-dashed border-border bg-bg p-3 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none"
                    placeholder="Constraints we should know about."
                  />
                </div>
              </div>
            </div>

            <!-- nav -->
            <div class="mt-8 flex items-center justify-between border-t border-border pt-6">
              <button
                v-if="step > 1"
                type="button"
                @click="prev"
                class="inline-flex h-10 items-center rounded-full border border-border px-5 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-text-secondary transition-all hover:border-primary hover:text-primary"
              >
                ← Back
              </button>
              <span v-else />
              <button
                v-if="step < TOTAL_STEPS"
                type="button"
                @click="next"
                :disabled="!canProceed"
                class="inline-flex h-10 items-center rounded-full bg-primary px-5 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-bg transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
              >
                Next →
              </button>
              <button
                v-else
                type="button"
                @click="submit"
                :disabled="!canProceed"
                class="inline-flex h-10 items-center rounded-full bg-primary px-5 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-bg transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
              >
                Submit use case →
              </button>
            </div>
          </Card>
        </Reveal>
      </div>
    </Section>
  </div>
</template>
