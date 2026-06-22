<script setup lang="ts">
/**
 * Btn — greptile-style button.
 * - Pill shape, optional `→` arrow that slides on hover.
 * - `arrow` (chevron-cut): the right edge is a clipped arrow shape —
 *   greptile's signature "Start now" / "Contact Sales" look. The
 *   icon is a separate filled triangle on the right.
 * - Variants: primary (green), secondary (outlined), ghost (text + underline),
 *   accent (limelight), ink (dark navy with light text).
 */
type Variant = 'primary' | 'secondary' | 'ghost' | 'accent' | 'ink'
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    href?: string
    variant?: Variant
    size?: Size
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
    /** Show the → arrow that slides on hover (pill buttons) */
    arrow?: boolean
    /** Greptile-style chevron-cut on the right edge (clip-path) */
    chevron?: boolean
  }>(),
  { variant: 'primary', size: 'md', type: 'button', disabled: false, arrow: false, chevron: false },
)

const sizeClass: Record<Size, string> = {
  sm: 'h-9 px-4 text-xs',
  md: 'h-10 px-5 text-xs',
  lg: 'h-12 px-6 text-sm',
}

const base = [
  'group relative inline-flex items-center justify-center font-semibold uppercase tracking-[0.12em] transition-all duration-200',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
  'disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap',
  sizeClass[props.size],
]

// chevron-cut: clip the right side into an arrow shape. The triangle
// notch is ~14px deep; the cut is wider on lg buttons.
const chevronClip = computed(() => {
  if (!props.chevron) return undefined
  const notch = props.size === 'lg' ? 16 : props.size === 'sm' ? 10 : 13
  return `polygon(0 0, calc(100% - ${notch}px) 0, 100% 50%, calc(100% - ${notch}px) 100%, 0 100%, ${notch}px 50%)`
})

const variantClass: Record<Variant, string> = {
  primary:
    'bg-primary text-[#faf6ec] hover:bg-primary-600 shadow-sm hover:shadow-[var(--shadow-glow)]',
  secondary:
    'bg-bg text-text border border-border-strong hover:border-primary hover:text-primary',
  ghost:
    'text-text hover:text-primary link-underline',
  accent:
    'bg-accent text-[#0a1f14] hover:bg-accent-600 shadow-sm hover:shadow-[var(--shadow-glow-accent)]',
  // greptile-style "Contact Sales" — dark navy
  ink:
    'bg-[#1a1f3a] text-white hover:bg-[#262c4d] shadow-sm',
}

import { computed } from 'vue'
</script>

<template>
  <a
    v-if="href"
    :href="href"
    :data-variant="variant"
    :class="[base, variantClass[variant]]"
    :style="chevron ? { clipPath: chevronClip } : undefined"
  >
    <span v-if="chevron" class="pl-3 sm:pl-4"><slot /></span>
    <span v-else><slot /></span>
    <span
      v-if="arrow"
      class="ml-1 inline-block transition-transform duration-200 group-hover:translate-x-0.5"
      aria-hidden="true"
    >→</span>
  </a>
  <button
    v-else
    :type="type"
    :disabled="disabled"
    :data-variant="variant"
    :class="[base, variantClass[variant]]"
    :style="chevron ? { clipPath: chevronClip } : undefined"
  >
    <span v-if="chevron" class="pl-3 sm:pl-4"><slot /></span>
    <span v-else><slot /></span>
    <span
      v-if="arrow"
      class="ml-1 inline-block transition-transform duration-200 group-hover:translate-x-0.5"
      aria-hidden="true"
    >→</span>
  </button>
</template>
