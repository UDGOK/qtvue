<script setup lang="ts">
/**
 * ProofSection — homepage proof block, Ticket 1 from the v2 brief.
 *
 * "Don't take our word for it. Read the code." — links the GitHub org
 * (qtvue) and the data-backed blog posts together as evidence for the
 * practitioner claim.
 *
 * Each card links to either a real GitHub repo (placeholder org until
 * user publishes the actual code) or an existing blog post.
 */

const GITHUB_ORG = 'https://github.com/qtvue'

const proofs = [
  {
    kind: 'Repo',
    title: 'Isaac Lab → G1 locomotion',
    desc: 'URDF, reward function, domain-randomization ranges, and the 48-hour sim-to-real workflow. Clone and run.',
    href: `${GITHUB_ORG}/unitree-isaaclab-g1-locomotion`,
    cta: 'View on GitHub →',
    external: true,
  },
  {
    kind: 'Repo',
    title: 'LeRobot → Go2 walking policy',
    desc: '50 teleoperated demonstrations to a deployed Go2 policy. Dataset format, config, eval script.',
    href: `${GITHUB_ORG}/lerobot-go2-walking-policy`,
    cta: 'View on GitHub →',
    external: true,
  },
  {
    kind: 'Measurement',
    title: 'Real battery life, measured',
    desc: 'We instrumented the G1, Go2, and B2 under realistic load. The marketing numbers are standby figures.',
    href: '/blog/real-battery-life',
    cta: 'Read the data →',
    external: false,
  },
] as const
</script>

<template>
  <section class="border-y border-dashed border-border bg-surface">
    <Container class="py-20 sm:py-28">
      <Reveal>
        <p class="eyebrow">Proof</p>
        <h2 class="display-lg mt-4 max-w-3xl text-text">
          Don't take our word for it. <span class="hl">Read the code.</span>
        </h2>
        <p class="mt-5 max-w-2xl text-lg leading-relaxed text-text-secondary">
          We're pre-launch, so we won't point you at a fake case-study library.
          Instead, here's runnable source and real measurements behind the work —
          everything we publish about is verifiable.
        </p>
      </Reveal>

      <ul class="mt-12 grid gap-4 md:grid-cols-3">
        <Reveal
          v-for="(p, i) in proofs"
          :key="p.title"
          :delay="i * 80"
          as="li"
        >
          <article class="group flex h-full flex-col border border-dashed border-border bg-bg p-6 transition-all hover:border-primary/60 hover:bg-primary-50/40">
            <p class="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
              {{ p.kind }}
            </p>
            <h3 class="mt-3 text-lg font-bold tracking-tight text-text">
              {{ p.title }}
            </h3>
            <p class="mt-3 text-sm leading-relaxed text-text-secondary">
              {{ p.desc }}
            </p>
            <NuxtLink
              :to="p.href"
              :target="p.external ? '_blank' : undefined"
              :rel="p.external ? 'noopener' : undefined"
              class="mt-auto inline-flex items-center gap-1 pt-4 font-mono text-[11px] font-semibold uppercase tracking-wider text-primary link-underline"
            >
              {{ p.cta }}
            </NuxtLink>
          </article>
        </Reveal>
      </ul>

      <Reveal :delay="240" class="mt-10">
        <NuxtLink
          :to="GITHUB_ORG"
          target="_blank"
          rel="noopener"
          class="inline-flex items-center gap-2 border border-dashed border-text-secondary bg-bg px-4 py-2 font-mono text-xs uppercase tracking-wider text-text-secondary transition-all hover:border-primary hover:text-primary"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.5-.3-5.2-1.3-5.2-5.6 0-1.2.4-2.3 1.2-3.1-.1-.3-.5-1.5.1-3 0 0 1-.3 3.2 1.2.9-.3 1.9-.4 2.9-.4s2 .1 2.9.4c2.2-1.5 3.2-1.2 3.2-1.2.6 1.5.2 2.7.1 3 .7.8 1.2 1.9 1.2 3.1 0 4.4-2.7 5.4-5.2 5.6.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z"/>
          </svg>
          All repositories on GitHub →
        </NuxtLink>
      </Reveal>
    </Container>
  </section>
</template>