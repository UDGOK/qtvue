<script setup lang="ts">
import * as icons from 'lucide-vue-next'
import { computed } from 'vue'

const props = withDefaults(defineProps<{ name: string; size?: number }>(), { size: 20 })

const Comp = computed(() => (icons as Record<string, unknown>)[props.name] ?? null)
</script>

<template>
  <component :is="Comp" v-if="Comp" :size="size" aria-hidden="true" />
</template>
