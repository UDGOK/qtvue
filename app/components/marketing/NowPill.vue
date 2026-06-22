<script setup lang="ts">
/**
 * NowPill — small ambient "what's happening on the workbench" indicator.
 *
 * Designed to sit in the header (replaces or augments the existing
 * announcement bar). Three sizes:
 *   - 'banner'  full-width announcement bar treatment (default)
 *   - 'inline'  a small inline pill next to other header items
 *   - 'compact' just the dot + status text, single line
 *
 * Behavior:
 *   - Reads /now.json via useNow() composable (client-side fetch)
 *   - If no current entry, renders nothing (so the component is
 *     safe to drop into any header layout without breaking it)
 *   - Animated pulsing dot (live indicator)
 *   - Click anywhere on the pill to navigate to /now
 *
 * Mood → accent color mapping:
 *   shipping        → forest green (default, neutral-positive)
 *   shipping-fast   → mint accent
 *   thinking        → paper/ink (neutral)
 *   investigating   → amber
 *   live            → red (urgent attention)
 *   reading         → indigo (default text-secondary)
 */
const props = withDefaults(
  defineProps<{
    variant?: 'banner' | 'inline' | 'compact'
    /** Show the live "now" indicator dot */
    dot?: boolean
    /** Allow click to navigate to /now */
    navigate?: boolean
    /** Show as truncated text on small screens */
    truncate?: boolean
  }>(),
  { variant: 'banner', dot: true, navigate: true, truncate: true },
)

const { hasCurrent, currentText, currentMood, currentLink, refresh } = useNow()

// Re-fetch every 60s while the page is open so updates land without refresh.
if (import.meta.client) {
  let timer: ReturnType<typeof setInterval> | null = null
  onMounted(() => {
    timer = setInterval(() => refresh(true), 60_000)
  })
  onBeforeUnmount(() => {
    if (timer) clearInterval(timer)
  })
}

const moodColor = computed(() => {
  switch (currentMood.value) {
    case 'shipping-fast': return { bg: 'bg-accent', text: 'text-bg', dot: 'bg-accent' }
    case 'live':          return { bg: 'bg-red-500', text: 'text-paper', dot: 'bg-red-500' }
    case 'investigating': return { bg: 'bg-amber-500', text: 'text-bg', dot: 'bg-amber-500' }
    case 'thinking':      return { bg: 'bg-ink-bg', text: 'text-paper', dot: 'bg-paper' }
    case 'reading':       return { bg: 'bg-surface-2', text: 'text-text-secondary', dot: 'bg-text-secondary' }
    default:              return { bg: 'bg-primary', text: 'text-paper', dot: 'bg-primary' }
  }
})

const link = computed(() => {
  if (!props.navigate) return undefined
  return props.currentLink || '/now'
})
</script>

<template>
  <NuxtLink
    v-if="hasCurrent"
    :to="link"
    :class="[
      'group inline-flex items-center gap-2 font-mono text-[12px] sm:text-[13px] transition-all',
      variant === 'banner' && 'rounded-md px-3 py-1 border border-current/20 hover:opacity-90',
      variant === 'inline' && 'rounded-full border border-border bg-bg/85 px-3 py-1 hover:border-primary hover:text-primary',
      variant === 'compact' && 'hover:opacity-80',
      moodColor.text,
      variant === 'banner' && moodColor.bg,
      variant === 'inline' && 'text-text-secondary',
      variant === 'compact' && 'text-text',
      truncate && 'max-w-[60vw] sm:max-w-[400px]',
    ]"
  >
    <span v-if="dot" class="relative flex h-1.5 w-1.5 shrink-0" aria-hidden="true">
      <span
        :class="['absolute inline-flex h-full w-full animate-ping rounded-full opacity-60', moodColor.dot]"
      />
      <span :class="['relative inline-flex h-1.5 w-1.5 rounded-full', moodColor.dot]" />
    </span>
    <span class="font-semibold uppercase tracking-[0.16em] opacity-80 shrink-0">now</span>
    <span
      :class="[
        'font-medium truncate',
        variant === 'compact' && 'font-sans text-[12px] tracking-normal',
      ]"
    >
      {{ currentText }}
    </span>
    <span aria-hidden="true" class="opacity-60 transition-transform group-hover:translate-x-0.5 shrink-0">→</span>
  </NuxtLink>
</template>