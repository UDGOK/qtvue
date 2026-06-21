<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: string
    label: string
    name: string
    error?: string
    rows?: number
    required?: boolean
  }>(),
  { rows: 4 },
)
defineEmits<{ 'update:modelValue': [string] }>()
</script>

<template>
  <label class="block">
    <span class="mb-1 block text-sm font-medium text-text">{{ label }}</span>
    <textarea
      :name="name"
      :rows="rows"
      :required="required"
      :value="modelValue"
      :aria-invalid="error ? 'true' : undefined"
      class="w-full rounded-lg border border-border bg-bg px-3 py-2 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
    <span v-if="error" class="mt-1 block text-sm text-danger">{{ error }}</span>
  </label>
</template>
