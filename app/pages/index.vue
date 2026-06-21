<script setup lang="ts">
const { t } = useI18n()

const { data: services } = await useAsyncData('home-services', () =>
  queryCollection('services').order('order', 'ASC').limit(4).all(),
)
const { data: work } = await useAsyncData('home-work', () =>
  queryCollection('work').where('featured', '=', true).limit(3).all(),
)

useSeoMeta({
  title: 'qtvue — Robotics Integration, Programming, and Consulting',
  description:
    'We sell and program robots for any business need — full integration, cell design, commissioning, and consulting.',
})
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="border-b border-border bg-surface">
      <Container class="py-24 sm:py-32">
        <div class="max-w-3xl">
          <p class="font-mono text-sm uppercase tracking-wider text-primary">Robotics, end to end</p>
          <h1 class="mt-4 text-4xl font-bold sm:text-6xl">Automation that works for your business.</h1>
          <p class="mt-6 text-lg text-text-secondary">
            We sell and program robots for any business need — from feasibility and cell design to
            integration, commissioning, and ongoing support.
          </p>
          <div class="mt-8 flex gap-3">
            <Btn href="/contact" size="lg">{{ t('cta.startProject') }}</Btn>
            <Btn href="/services" variant="secondary" size="lg">{{ t('cta.viewAll') }}</Btn>
          </div>
        </div>
      </Container>
    </section>

    <!-- Services -->
    <Section eyebrow="Services" heading="What we do">
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card v-for="s in services" :key="s.path">
          <Icon :name="s.icon" :size="28" />
          <h3 class="mt-4 text-lg font-semibold">{{ s.title }}</h3>
          <p class="mt-2 text-sm text-text-secondary">{{ s.summary }}</p>
          <NuxtLink :to="s.path" class="mt-4 inline-block text-sm text-primary">Learn more →</NuxtLink>
        </Card>
      </div>
    </Section>

    <!-- Featured work -->
    <Section eyebrow="Work" heading="Selected projects">
      <div class="grid gap-6 sm:grid-cols-3">
        <NuxtLink v-for="w in work" :key="w.path" :to="w.path">
          <Card>
            <Media :src="w.image" alt="" decorative ratio="16/9" />
            <h3 class="mt-4 font-semibold">{{ w.title }}</h3>
            <p class="mt-1 text-sm text-text-secondary">{{ w.summary }}</p>
          </Card>
        </NuxtLink>
      </div>
      <div class="mt-8">
        <Btn href="/work" variant="ghost">{{ t('cta.viewAll') }} →</Btn>
      </div>
    </Section>

    <!-- CTA strip -->
    <Section>
      <div class="rounded-2xl bg-primary px-8 py-12 text-center text-white">
        <h2 class="text-2xl font-bold sm:text-3xl">Have a process you want to automate?</h2>
        <p class="mt-3 text-white/80">Tell us about it — we'll tell you if it makes sense.</p>
        <div class="mt-6">
          <Btn href="/contact" variant="secondary" size="lg">{{ t('cta.getInTouch') }}</Btn>
        </div>
      </div>
    </Section>
  </div>
</template>
