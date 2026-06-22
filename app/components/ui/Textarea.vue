<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: string
    label: string
    name: string
    error?: string
    rows?: number
    required?: boolean
    placeholder?: string
  }>(),
  { rows: 5 },
)
defineEmits<{ 'update:modelValue': [string] }>()
</script>

<template>
  <label class="block">
    <span class="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-text-secondary">
      {{ label }}<span v-if="!required" class="text-text-muted"> · optional</span>
    </span>
    <textarea
      :name="name"
      :rows="rows"
      :required="required"
      :placeholder="placeholder"
      :value="modelValue"
      :aria-invalid="error ? 'true' : undefined"
      class="w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
    <span v-if="error" class="mt-1 block text-xs text-danger">{{ error }}</span>
  </label>
</template>
