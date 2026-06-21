<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    locales?: string[]
    current?: string
  }>(),
  { locales: () => ['en'], current: 'en' },
)

function onChange(e: Event) {
  const v = (e.target as HTMLSelectElement).value
  if (v !== props.current && typeof window !== 'undefined') {
    window.location.pathname = `/${v}/`
  }
}
</script>

<template>
  <select
    v-if="locales.length > 1"
    data-i18n-switcher
    class="rounded-lg border border-border bg-bg px-2 py-1 text-sm"
    :value="current"
    @change="onChange"
  >
    <option v-for="l in locales" :key="l" :value="l">{{ l.toUpperCase() }}</option>
  </select>
</template>
