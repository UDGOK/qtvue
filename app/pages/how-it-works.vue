<script setup lang="ts">
/**
 * /how-it-works — process transparency page. Per the brief, this
 * is the credibility work that case studies would normally do,
 * pre-launch. Four steps with concrete deliverables per step.
 */
useSeoMeta({
  title: 'How it works — qtvue',
  description: 'From use case submission to first deployment. The four-step qtvue engagement process.',
})
</script>

<template>
  <div>
    <section class="border-b border-border bg-bg">
      <Container class="py-20 sm:py-28">
        <Reveal>
          <p class="eyebrow">How it works</p>
          <h1 class="display-xl mt-4 max-w-4xl">
            From use case to <span class="hl">first deployment</span>.
          </h1>
          <p class="mt-6 max-w-2xl text-lg text-text-secondary sm:text-xl">
            We don't have a 240-cell case-study library yet — we won't fake
            one. What we do have is a process that's worth showing in
            detail. Here's exactly what happens when you submit a use case.
          </p>
        </Reveal>
      </Container>
    </section>

    <!-- ============================================================
         STEP 0 — SELF-ASSESS. The page most likely to convert a
         qualified lead is the one that catches them BEFORE they
         hit "Submit". The Robot Review Checklist is the most
         qualified-engagement filter we can offer: 47 checks,
         tick-as-you-go, saves locally. Visitors who complete it
         arrive at the form knowing what they actually need.
         ============================================================ -->
    <ChecklistCallout
      variant="banner"
      context="Step 0 — runs before the 4 steps below · no login required"
      placement="how-it-works"
    />

    <Section>
      <ol class="grid gap-4 md:grid-cols-2">
        <Reveal :delay="0" as="li">
          <Card variant="default" pad="lg" class="h-full border-dashed">
            <p class="font-mono text-[10px] uppercase tracking-widest text-primary">step 01</p>
            <h3 class="mt-3 text-xl font-bold tracking-tight text-text">Submit your use case</h3>
            <p class="mt-3 text-text-secondary">
              Five-question form, three minutes. We learn what you're trying to
              do, the environment, the platform (if you have one), and the
              constraints.
            </p>
            <div class="mt-4 border-t border-border pt-4">
              <p class="eyebrow">Deliverable</p>
              <p class="mt-2 text-sm text-text-secondary">
                A written use-case summary in your inbox, within 1 business day.
              </p>
            </div>
          </Card>
        </Reveal>
        <Reveal :delay="80" as="li">
          <Card variant="default" pad="lg" class="h-full border-dashed">
            <p class="font-mono text-[10px] uppercase tracking-widest text-primary">step 02</p>
            <h3 class="mt-3 text-xl font-bold tracking-tight text-text">Engineering review</h3>
            <p class="mt-3 text-text-secondary">
              We name the platform, the SDK, the integration pattern, and a
              realistic timeline. We tell you what we think will work, what
              won't, and what the rough cost band is.
            </p>
            <div class="mt-4 border-t border-border pt-4">
              <p class="eyebrow">Deliverable</p>
              <p class="mt-2 text-sm text-text-secondary">
                A 2–4 page engineering memo (PDF) with the platform pick,
                the SDK/ROS 2 plan, the rough timeline, and a no-surprise
                cost band.
              </p>
            </div>
          </Card>
        </Reveal>
        <Reveal :delay="160" as="li">
          <Card variant="default" pad="lg" class="h-full border-dashed">
            <p class="font-mono text-[10px] uppercase tracking-widest text-primary">step 03</p>
            <h3 class="mt-3 text-xl font-bold tracking-tight text-text">Scope + quote</h3>
            <p class="mt-3 text-text-secondary">
              Fixed price. Plain-English SOW. You see what's in scope, what's
              not, and what the acceptance criteria are. We use the same
              document for any third-party review (your CTO, your security
              team, your finance team).
            </p>
            <div class="mt-4 border-t border-border pt-4">
              <p class="eyebrow">Deliverable</p>
              <p class="mt-2 text-sm text-text-secondary">
                A signed SOW with line-item pricing, acceptance criteria,
                and the exact deliverables list.
              </p>
            </div>
          </Card>
        </Reveal>
        <Reveal :delay="240" as="li">
          <Card variant="default" pad="lg" class="h-full border-dashed">
            <p class="font-mono text-[10px] uppercase tracking-widest text-primary">step 04</p>
            <h3 class="mt-3 text-xl font-bold tracking-tight text-text">Build, ship, run</h3>
            <p class="mt-3 text-text-secondary">
              We program in sim, validate on hardware, deploy on your floor.
              You own the program source, the design files, the documentation.
              If you want a 24/7 support contract after, we offer that
              separately.
            </p>
            <div class="mt-4 border-t border-border pt-4">
              <p class="eyebrow">Deliverable</p>
              <p class="mt-2 text-sm text-text-secondary">
                A working system + a private git repo + operator runbooks +
                30-day on-site warranty window.
              </p>
            </div>
          </Card>
        </Reveal>
      </ol>
    </Section>

    <Section tone="ink" eyebrow="Start" heading="Submit your use case.">
      <Reveal>
        <p class="max-w-2xl text-paper/80">
          Five questions, three minutes. Free, no commitment, reply within
          one business day.
        </p>
      </Reveal>
      <Reveal :delay="100" class="mt-6">
        <NuxtLink
          to="/intake"
          class="inline-flex h-11 items-center rounded-none bg-accent px-6 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-ink transition-all hover:opacity-90"
        >
          Submit your use case →
        </NuxtLink>
      </Reveal>
    </Section>
  </div>
</template>
