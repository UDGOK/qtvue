<script setup lang="ts">
defineProps<{
  modelValue: string
  label: string
  name: string
  options: { value: string; label: string }[]
  error?: string
  required?: boolean
}>()
defineEmits<{ 'update:modelValue': [string] }>()
</script>

<template>
  <label class="block">
    <span class="mb-1 block text-sm font-medium text-text">{{ label }}</span>
    <select
      :name="name"
      :required="required"
      :value="modelValue"
      class="w-full rounded-lg border border-border bg-bg px-3 py-2 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-for="o in options" :key="o.value" :value="o.value">{{ o.label }}</option>
    </select>
    <span v-if="error" class="mt-1 block text-sm text-danger">{{ error }}</span>
  </label>
</template>
