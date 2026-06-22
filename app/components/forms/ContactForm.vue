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
  website: '', // honeypot — must stay empty
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
    class="space-y-4 rounded-xl border border-border bg-surface p-6"
    novalidate
    @submit.prevent="submit(form)"
  >
    <div v-if="status === 'success'" class="rounded-lg bg-success/10 p-4 text-success">
      {{ t('contact.success') }}
    </div>
    <div v-if="errors._form" class="rounded-lg bg-danger/10 p-4 text-danger">
      {{ errors._form }}
    </div>

    <Input v-model="form.name" name="name" label="Name" :error="errors.name" required />
    <Input
      v-model="form.email"
      name="email"
      label="Email"
      type="email"
      :error="errors.email"
      required
    />
    <Input v-model="form.company" name="company" label="Company (optional)" />
    <Select v-model="form.industry" name="industry" label="Industry" :options="industries" />
    <Textarea v-model="form.message" name="message" label="Message" :error="errors.message" required />

    <!-- Honeypot: hidden from users, visible to bots. Must stay empty. -->
    <input
      v-model="form.website"
      name="website"
      type="text"
      tabindex="-1"
      autocomplete="off"
      aria-hidden="true"
      class="hidden"
    />

    <Btn type="submit" :disabled="status === 'submitting'">
      {{ status === 'submitting' ? 'Sending…' : t('contact.submit') }}
    </Btn>
  </form>
</template>
