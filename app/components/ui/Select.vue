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
    <span class="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-text-secondary">
      {{ label }}<span v-if="!required" class="text-text-muted"> · optional</span>
    </span>
    <div class="relative">
      <select
        :name="name"
        :required="required"
        :value="modelValue"
        class="h-11 w-full appearance-none rounded-none border border-border bg-bg px-4 pr-10 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      >
        <option v-for="o in options" :key="o.value" :value="o.value">{{ o.label }}</option>
      </select>
      <svg
        class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
        width="14"
        height="14"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 6 L8 10 L12 6"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
    <span v-if="error" class="mt-1 block text-xs text-danger">{{ error }}</span>
  </label>
</template>
