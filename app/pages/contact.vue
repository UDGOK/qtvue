<script setup lang="ts">
import { siteConfig } from '~/site-config'

const { t } = useI18n()
const contactEmail = siteConfig.contactEmail

useSeoMeta({ title: 'Contact — qtvue', description: 'Start a project with qtvue.' })
</script>

<template>
  <Section eyebrow="Contact" :heading="t('contact.heading')" level="1">
    <div class="grid gap-12 lg:grid-cols-2">
      <div>
        <p class="text-text-secondary">
          Tell us about your operation and what you'd like to automate. We'll get back to you within
          one business day.
        </p>
        <dl class="mt-8 space-y-4 text-sm">
          <div>
            <dt class="text-text-secondary">Email</dt>
            <dd>
              <a class="text-primary" :href="`mailto:${contactEmail}`">{{ contactEmail }}</a>
            </dd>
          </div>
        </dl>
      </div>
      <div>
        <ContactForm />
      </div>
    </div>
  </Section>
</template>
