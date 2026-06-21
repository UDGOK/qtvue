<script setup lang="ts">
useSeoMeta({
  title: 'About — qtvue',
  description: 'About qtvue — a robotics integration company.',
})
</script>

<template>
  <Section eyebrow="About" heading="Engineering automation that lasts">
    <div class="max-w-2xl text-text-secondary">
      <p>
        [PLACEHOLDER — replace with real copy.] qtvue is a robotics company that sells and programs
        robots for any business need. We work across the full lifecycle — from feasibility and design
        through integration, programming, commissioning, and support.
      </p>
      <p class="mt-4">
        [PLACEHOLDER] Our team has deployed automation across welding, packaging, material handling,
        and other industrial operations worldwide.
      </p>
    </div>

    <div class="mt-12 grid gap-6 sm:grid-cols-3">
      <Card><Stat value="N+" label="cells deployed" /></Card>
      <Card><Stat value="N" label="countries served" /></Card>
      <Card><Stat value="N yr" label="average tenure" /></Card>
    </div>
  </Section>
</template>
