<script setup lang="ts">
defineProps<{
  modelValue: string
  label: string
  name: string
  type?: string
  error?: string
  required?: boolean
  placeholder?: string
}>()
defineEmits<{ 'update:modelValue': [string] }>()
</script>

<template>
  <label class="block">
    <span class="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-text-secondary">
      {{ label }}<span v-if="!required" class="text-text-muted"> · optional</span>
    </span>
    <input
      :type="type ?? 'text'"
      :name="name"
      :required="required"
      :placeholder="placeholder"
      :value="modelValue"
      :aria-invalid="error ? 'true' : undefined"
      class="h-11 w-full rounded-none border border-border bg-bg px-4 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <span v-if="error" class="mt-1 block text-xs text-danger">{{ error }}</span>
  </label>
</template>
