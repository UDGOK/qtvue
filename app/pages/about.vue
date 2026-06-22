<script setup lang="ts">
useSeoMeta({
  title: 'About — qtvue',
  description: 'About qtvue — a robotics integration company.',
})
</script>

<template>
  <div>
    <!-- HERO -->
    <section class="border-b border-border bg-bg">
      <Container class="py-20 sm:py-28">
        <Reveal>
          <p class="eyebrow">About</p>
          <h1 class="display-lg mt-4 max-w-4xl">
            We build <span class="hl">robotics</span> that earns its place on the line.
          </h1>
          <p class="mt-6 max-w-2xl text-lg text-text-secondary">
            qtvue is a robotics company that sells and programs robots for any business
            need. We work across the full lifecycle — from feasibility and design through
            integration, programming, commissioning, and ongoing support.
          </p>
        </Reveal>
      </Container>
    </section>

    <!-- STATS BAND -->
    <Section tone="ink" eyebrow="By the numbers" heading="Quietly excellent, decade after decade.">
      <Reveal>
        <div class="grid grid-cols-2 gap-6 sm:grid-cols-4">
          <Card variant="ghost" pad="lg" class="border border-ink-text/15">
            <Stat value="240+" label="cells deployed" sub="across 14 countries" />
          </Card>
          <Card variant="ghost" pad="lg" class="border border-ink-text/15">
            <Stat value="12 yr" label="in business" sub="since 2014" />
          </Card>
          <Card variant="ghost" pad="lg" class="border border-ink-text/15">
            <Stat value="38" label="engineers" sub="avg. 9 yrs experience" />
          </Card>
          <Card variant="ghost" pad="lg" class="border border-ink-text/15">
            <Stat value="99.4%" label="uptime" sub="on live cells" />
          </Card>
        </div>
      </Reveal>
    </Section>

    <!-- VALUES -->
    <Section eyebrow="Principles" heading="What we believe (and what we won't do).">
      <Reveal>
        <div class="grid gap-6 md:grid-cols-3">
          <Card pad="lg" variant="default">
            <p class="eyebrow text-primary">01</p>
            <h3 class="mt-2 text-xl font-bold tracking-tight text-text">Tell the truth about ROI.</h3>
            <p class="mt-3 text-sm text-text-secondary">
              If the math doesn't work, we say so. We send more feasibility work back to
              prospects as "don't do it" than any integrator we know.
            </p>
          </Card>
          <Card pad="lg" variant="default">
            <p class="eyebrow text-primary">02</p>
            <h3 class="mt-2 text-xl font-bold tracking-tight text-text">Stay on the cell.</h3>
            <p class="mt-3 text-sm text-text-secondary">
              We commission, train, and stay. Our support team is staffed by the same
              engineers who integrated the cell — not a third-tier call center.
            </p>
          </Card>
          <Card pad="lg" variant="default">
            <p class="eyebrow text-primary">03</p>
            <h3 class="mt-2 text-xl font-bold tracking-tight text-text">Be vendor-neutral.</h3>
            <p class="mt-3 text-sm text-text-secondary">
              We sell FANUC, ABB, KUKA, Yaskawa, UR, and Doosan — and we'll recommend the
              one that fits, not the one with the best spiff.
            </p>
          </Card>
        </div>
      </Reveal>
    </Section>

    <!-- CTA -->
    <Section tone="surface" eyebrow="Talk to us" heading="Ready to scope a project?">
      <div class="flex flex-wrap items-center gap-3">
        <Btn href="/contact" variant="primary" size="lg" arrow>Start a project</Btn>
        <Btn href="/work" variant="secondary" size="lg">See our work</Btn>
      </div>
    </Section>
  </div>
</template>
