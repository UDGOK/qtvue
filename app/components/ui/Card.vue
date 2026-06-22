<script setup lang="ts">
withDefaults(
  defineProps<{
    /** visual variant */
    variant?: 'default' | 'outline' | 'solid' | 'ghost'
    /** padding scale */
    pad?: 'sm' | 'md' | 'lg' | 'none'
    /** hover lift effect */
    interactive?: boolean
  }>(),
  { variant: 'default', pad: 'md', interactive: false },
)
</script>

<template>
  <div
    :class="[
      'relative rounded-2xl transition-all duration-300',
      variant === 'default' && 'border border-border bg-surface',
      variant === 'outline' && 'border border-border bg-transparent',
      variant === 'solid' && 'bg-surface-2',
      variant === 'ghost' && 'bg-transparent',
      pad === 'sm' && 'p-4',
      pad === 'md' && 'p-6',
      pad === 'lg' && 'p-8',
      pad === 'none' && 'p-0',
      interactive && 'hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-lg)] cursor-pointer',
    ]"
  >
    <slot />
  </div>
</template>
