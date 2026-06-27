<script setup lang="ts">
/**
 * StatusPill — small live status indicator with pulse.
 * Greptile style: ● Live on Kickstarter / ● 24/7 / ● Operational.
 */
withDefaults(
  defineProps<{
    text: string
    tone?: 'primary' | 'accent' | 'success'
  }>(),
  { tone: 'primary' },
)
</script>

<template>
  <span
    :class="[
      'inline-flex items-center gap-2 rounded-none border px-3 py-1.5 text-xs font-medium font-mono uppercase tracking-wider',
      tone === 'primary' && 'border-primary/30 bg-primary-50 text-primary',
      tone === 'accent' && 'border-accent/40 bg-accent/15 text-text',
      tone === 'success' && 'border-success/30 bg-success/10 text-success',
    ]"
  >
    <span class="relative flex h-1.5 w-1.5" aria-hidden="true">
      <span
        :class="[
          'absolute inline-flex h-full w-full animate-ping rounded-full opacity-60',
          tone === 'primary' && 'bg-primary',
          tone === 'accent' && 'bg-accent',
          tone === 'success' && 'bg-success',
        ]"
      />
      <span
        :class="[
          'relative inline-flex h-1.5 w-1.5 rounded-full',
          tone === 'primary' && 'bg-primary',
          tone === 'accent' && 'bg-accent',
          tone === 'success' && 'bg-success',
        ]"
      />
    </span>
    {{ text }}
  </span>
</template>
