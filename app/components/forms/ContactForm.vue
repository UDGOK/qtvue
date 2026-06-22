<script setup lang="ts">
import { reactive } from 'vue'
import { useContactForm } from '~/composables/useContactForm'

const { t } = useI18n()
const { status, errors, submit } = useContactForm()

const form = reactive({
  name: '',
  email: '',
  company: '',
  industry: '',
  message: '',
  website: '', // honeypot
})

const industries = [
  { value: '', label: 'Select an industry (optional)' },
  { value: 'welding', label: 'Welding' },
  { value: 'packaging', label: 'Packaging' },
  { value: 'material-handling', label: 'Material Handling' },
  { value: 'other', label: 'Other' },
]
</script>

<template>
  <form
    class="space-y-5 rounded-2xl border border-border bg-surface p-6 sm:p-8"
    novalidate
    @submit.prevent="submit(form)"
  >
    <div v-if="status === 'success'" class="rounded-xl bg-primary-50 p-4 text-sm text-primary">
      {{ t('contact.success') }}
    </div>
    <div v-if="errors._form" class="rounded-xl bg-danger/10 p-4 text-sm text-danger">
      {{ errors._form }}
    </div>

    <div class="grid gap-5 sm:grid-cols-2">
      <Input
        v-model="form.name"
        name="name"
        label="Name"
        :error="errors.name"
        required
        placeholder="Your name"
      />
      <Input
        v-model="form.email"
        name="email"
        label="Email"
        type="email"
        :error="errors.email"
        required
        placeholder="you@company.com"
      />
    </div>
    <Input
      v-model="form.company"
      name="company"
      label="Company"
      placeholder="Where you work"
    />
    <Select v-model="form.industry" name="industry" label="Industry" :options="industries" />
    <Textarea
      v-model="form.message"
      name="message"
      label="Tell us about the project"
      :error="errors.message"
      required
      placeholder="What are you trying to automate? What's the pain?"
      :rows="5"
    />

    <!-- Honeypot -->
    <input
      v-model="form.website"
      name="website"
      type="text"
      tabindex="-1"
      autocomplete="off"
      aria-hidden="true"
      class="hidden"
    />

    <div class="flex items-center justify-between gap-4 pt-2">
      <Btn type="submit" :disabled="status === 'submitting'" variant="primary" size="md" arrow>
        {{ status === 'submitting' ? 'Sending…' : t('contact.submit') }}
      </Btn>
      <p class="font-mono text-[10px] uppercase tracking-widest text-text-muted">
        reply within 1 business day
      </p>
    </div>
  </form>
</template>
