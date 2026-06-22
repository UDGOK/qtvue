<script setup lang="ts">
/**
 * /about — founder-focused. Per the brief: real people are the
 * trust anchor pre-launch. No stock photos. No fabricated bios.
 */
useSeoMeta({
  title: 'About — qtvue',
  description:
    'qtvue is a Unitree robotics specialist. Pre-launch. Practitioner-led, not reseller-led.',
})
</script>

<template>
  <div>
    <section class="border-b border-border bg-bg">
      <Container class="py-20 sm:py-28">
        <Reveal>
          <p class="eyebrow">About</p>
          <h1 class="display-xl mt-4 max-w-4xl">
            A practitioner, <span class="hl">not a reseller</span>.
          </h1>
          <p class="mt-6 max-w-2xl text-lg text-text-secondary sm:text-xl">
            qtvue exists because mid-market operators and research teams don't
            need another hardware vendor — they need someone who can make the
            platform do the job.
          </p>
        </Reveal>
      </Container>
    </section>

    <Section eyebrow="Origin" heading="Why this exists.">
      <Reveal>
        <div class="prose prose-lg max-w-3xl text-text">
          <p class="text-lg leading-relaxed text-text-secondary">
            Unitree is shipping some of the most capable robots on the market
            at price points that change who's a real customer. But shipping a
            Go2 to a warehouse doesn't get you an autonomous inspection
            patrol. It gets you a $1,600 box that needs the same software,
            networking, and integration work a $300K industrial arm does.
          </p>
          <p class="mt-4 text-lg leading-relaxed text-text-secondary">
            That's the gap we work in. We work inside the same public SDKs
            the platform teams publish — <code>unitree_sdk2</code>,
            <code>unitree_ros2</code>, <code>unitree_sim_isaaclab</code> — and
            we deliver the program, the integration, and the security
            posture that makes the platform actually do work in your
            environment.
          </p>
        </div>
      </Reveal>
    </Section>

    <Section eyebrow="Positioning" heading="Where we are, where we're not." tone="surface">
      <div class="grid gap-4 md:grid-cols-2">
        <Reveal>
          <Card variant="default" pad="lg" class="h-full">
            <p class="eyebrow">What we are</p>
            <ul class="mt-3 space-y-2 text-sm text-text-secondary">
              <li>· A pre-launch Unitree specialist</li>
              <li>· Working inside the same public SDKs Unitree publishes</li>
              <li>· Practitioner-led, with real robotics-engineering background</li>
              <li>· Honest about what we can and can't do</li>
              <li>· Building credibility through process transparency and specificity</li>
            </ul>
          </Card>
        </Reveal>
        <Reveal :delay="80">
          <Card variant="default" pad="lg" class="h-full">
            <p class="eyebrow">What we are not</p>
            <ul class="mt-3 space-y-2 text-sm text-text-secondary">
              <li>· A reseller with a 240-cell case-study library to point at</li>
              <li>· A multi-brand robot integrator (we focus on Unitree)</li>
              <li>· A source of firmware jailbreaks or tier unlocks</li>
              <li>· In a hurry to scale before the work is real</li>
              <li>· Willing to invent metrics to look bigger than we are</li>
            </ul>
          </Card>
        </Reveal>
      </div>
    </Section>

    <Section eyebrow="What we publish" heading="Articles, not ads.">
      <Reveal>
        <p class="max-w-2xl text-text-secondary">
          The highest-leverage thing we can do right now is write
          founder-level technical articles. Real practitioner content
          about programming the G1, deploying the Go2, building sim-to-real
          pipelines in Isaac Lab. Only a real practitioner can write these.
        </p>
      </Reveal>
      <Reveal :delay="100" class="mt-6">
        <NuxtLink
          to="/blog"
          class="inline-flex h-10 items-center rounded-full border border-border px-5 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-text-secondary transition-all hover:border-primary hover:text-primary"
        >
          Read the technical articles →
        </NuxtLink>
      </Reveal>
    </Section>

    <Section tone="ink" eyebrow="Get in touch" heading="Submit your use case.">
      <Reveal>
        <p class="max-w-2xl text-paper/80">
          We don't have a sales team. We have engineers. Submit your use
          case and the reply comes from someone who has programmed the
          platform you're asking about.
        </p>
      </Reveal>
      <Reveal :delay="100" class="mt-6">
        <NuxtLink
          to="/intake"
          class="inline-flex h-11 items-center rounded-full bg-accent px-6 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-ink transition-all hover:opacity-90"
        >
          Submit your use case →
        </NuxtLink>
      </Reveal>
    </Section>
  </div>
</template>
