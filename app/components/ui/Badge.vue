<script setup lang="ts">
/**
 * Badge — greptile-style status pill: small dot + text.
 * Variants: live (green dot), accent (limelight bg), default.
 */
withDefaults(
  defineProps<{
    text: string
    variant?: 'default' | 'live' | 'accent' | 'outline'
  }>(),
  { variant: 'default' },
)
</script>

<template>
  <span
    :class="[
      'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium font-mono uppercase tracking-wider',
      variant === 'default' && 'bg-surface-2 text-text-secondary border border-border',
      variant === 'live' && 'bg-primary-50 text-primary border border-primary/20',
      variant === 'accent' && 'bg-accent/20 text-text border border-accent/40',
      variant === 'outline' && 'bg-transparent text-text border border-border-strong',
    ]"
  >
    <span
      v-if="variant === 'live'"
      class="relative flex h-1.5 w-1.5"
      aria-hidden="true"
    >
      <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
      <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
    </span>
    <span
      v-else-if="variant === 'accent'"
      class="h-1.5 w-1.5 rounded-full bg-accent"
      aria-hidden="true"
    />
    {{ text }}
  </span>
</template>
