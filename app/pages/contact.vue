<script setup lang="ts">
import { siteConfig } from '~/site-config'

const { t } = useI18n()
const contactEmail = siteConfig.contactEmail

useSeoMeta({ title: 'Contact — qtvue', description: 'Start a project with qtvue.' })
</script>

<template>
  <div>
    <section class="border-b border-border bg-bg">
      <Container class="py-20 sm:py-28">
        <Reveal>
          <p class="eyebrow">Contact</p>
          <h1 class="display-lg mt-4 max-w-4xl">
            {{ t('contact.heading') }}
          </h1>
          <p class="mt-6 max-w-2xl text-lg text-text-secondary">
            Tell us about your operation and what you'd like to automate. We'll get back to
            you within one business day.
          </p>
        </Reveal>
      </Container>
    </section>

    <Section>
      <Reveal>
        <div class="grid gap-12 lg:grid-cols-5">
          <div class="lg:col-span-2">
            <div class="rounded-2xl border border-border bg-surface p-6 sm:p-8">
              <p class="eyebrow text-primary">Direct</p>
              <dl class="mt-6 space-y-5 text-sm">
                <div>
                  <dt class="font-mono text-[10px] uppercase tracking-widest text-text-muted">Email</dt>
                  <dd class="mt-1">
                    <a class="text-base text-text hover:text-primary" :href="`mailto:${contactEmail}`">
                      {{ contactEmail }}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt class="font-mono text-[10px] uppercase tracking-widest text-text-muted">Response time</dt>
                  <dd class="mt-1 text-text">Within 1 business day</dd>
                </div>
                <div>
                  <dt class="font-mono text-[10px] uppercase tracking-widest text-text-muted">Headquarters</dt>
                  <dd class="mt-1 text-text">Remote-first · US, EU, and Asia</dd>
                </div>
              </dl>
              <div class="mt-8 border-t border-border pt-6">
                <p class="eyebrow text-primary">Status</p>
                <div class="mt-3">
                  <StatusPill text="Booking Q3 2026" tone="primary" />
                </div>
              </div>
            </div>
          </div>
          <div class="lg:col-span-3">
            <ContactForm />
          </div>
        </div>
      </Reveal>
    </Section>
  </div>
</template>
