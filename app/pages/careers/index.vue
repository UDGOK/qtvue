<script setup lang="ts">
const { data: roles } = await useAsyncData('careers', () => queryCollection('careers').all())
useSeoMeta({ title: 'Careers — qtvue', description: 'Join the qtvue team.' })
</script>

<template>
  <Section eyebrow="Careers" heading="Build the future of automation with us">
    <!-- Listing mode (when roles exist) -->
    <div v-if="roles?.length" class="grid gap-6">
      <NuxtLink v-for="r in roles" :key="r.path" :to="r.path">
        <Card>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold">{{ r.title }}</h3>
              <p class="mt-1 text-sm text-text-secondary">{{ r.location }} · {{ r.type }}</p>
            </div>
            <span class="text-primary">→</span>
          </div>
        </Card>
      </NuxtLink>
    </div>

    <!-- Evergreen CTA (no open roles) -->
    <div v-else class="rounded-2xl border border-border bg-surface p-8 text-center">
      <h3 class="text-xl font-semibold">We're always looking for talent</h3>
      <p class="mx-auto mt-3 max-w-md text-text-secondary">
        No open roles right now, but we'd still love to hear from you. Send your resume and a note
        about what you do.
      </p>
      <div class="mt-6">
        <Btn href="mailto:hello@qtvue.com" size="lg">Email us</Btn>
      </div>
    </div>
  </Section>
</template>
