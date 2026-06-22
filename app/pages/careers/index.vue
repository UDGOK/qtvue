<script setup lang="ts">
import { stemToRoute } from '~/utils/content'

const { data: roles } = await useAsyncData('careers', () => queryCollection('careers').all())
useSeoMeta({ title: 'Careers — qtvue', description: 'Join the qtvue team.' })
</script>

<template>
  <div>
    <section class="border-b border-border bg-bg">
      <Container class="py-20 sm:py-28">
        <Reveal>
          <p class="eyebrow">Careers</p>
          <h1 class="display-lg mt-4 max-w-4xl">
            Build the future of <span class="hl">automation</span> with us.
          </h1>
          <p class="mt-6 max-w-2xl text-lg text-text-secondary">
            We're a small, senior team that ships real robots to real floors. No silos. No
            politics. Engineers talk to customers, customers talk to engineers.
          </p>
        </Reveal>
      </Container>
    </section>

    <Section>
      <Reveal>
        <!-- Listing mode (when roles exist) -->
        <div v-if="roles?.length" class="grid gap-4">
          <NuxtLink v-for="r in roles" :key="r.path" :to="stemToRoute(r.stem)" class="group block">
            <Card interactive pad="lg">
              <div class="flex items-center justify-between gap-4">
                <div>
                  <h3 class="text-lg font-bold tracking-tight text-text group-hover:text-primary">
                    {{ r.title }}
                  </h3>
                  <p class="mt-1 text-sm text-text-secondary">
                    {{ r.location }} · {{ r.type }}<span v-if="r.department"> · {{ r.department }}</span>
                  </p>
                </div>
                <span
                  class="grid h-9 w-9 place-items-center rounded-full border border-border text-text-secondary transition-all group-hover:border-primary group-hover:text-primary"
                  aria-hidden="true"
                >→</span>
              </div>
            </Card>
          </NuxtLink>
        </div>

        <!-- Evergreen CTA -->
        <div v-else class="rounded-2xl border border-border bg-surface p-8 text-center sm:p-12">
          <div class="mx-auto h-32 w-32">
            <RobotMascot variant="head" />
          </div>
          <h3 class="mt-6 text-2xl font-bold tracking-tight text-text">We're always looking for talent.</h3>
          <p class="mx-auto mt-3 max-w-md text-text-secondary">
            No open roles right now, but we'd still love to hear from you. Send your resume
            and a note about what you do.
          </p>
          <div class="mt-6">
            <Btn href="mailto:hello@qtvue.com" variant="primary" size="lg" arrow>Email us</Btn>
          </div>
        </div>
      </Reveal>
    </Section>
  </div>
</template>
