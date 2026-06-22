<script setup lang="ts">
/**
 * Btn — greptile-inspired button: pill shape, chunky padding, optional
 * arrow on the right. Three variants: primary (filled green), secondary
 * (outlined on paper), ghost (text with underline animation).
 */
type Variant = 'primary' | 'secondary' | 'ghost' | 'accent'
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    href?: string
    variant?: Variant
    size?: Size
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
    arrow?: boolean
  }>(),
  { variant: 'primary', size: 'md', type: 'button', disabled: false, arrow: false },
)

const sizeClass: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
}

const base = [
  'group inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-all duration-200',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
  'disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap',
  sizeClass[props.size],
]

const variantClass: Record<Variant, string> = {
  primary:
    'bg-primary text-[#faf6ec] hover:bg-primary-600 shadow-sm hover:shadow-[var(--shadow-glow)]',
  secondary:
    'bg-bg text-text border border-border-strong hover:border-primary hover:text-primary',
  ghost:
    'text-text hover:text-primary link-underline',
  accent:
    'bg-accent text-[#0a1f14] hover:bg-accent-600 shadow-sm hover:shadow-[var(--shadow-glow-accent)]',
}
</script>

<template>
  <a
    v-if="href"
    :href="href"
    :data-variant="variant"
    :class="[base, variantClass[variant]]"
  >
    <slot />
    <span
      v-if="arrow"
      class="inline-block transition-transform duration-200 group-hover:translate-x-0.5"
      aria-hidden="true"
    >→</span>
  </a>
  <button
    v-else
    :type="type"
    :disabled="disabled"
    :data-variant="variant"
    :class="[base, variantClass[variant]]"
  >
    <slot />
    <span
      v-if="arrow"
      class="inline-block transition-transform duration-200 group-hover:translate-x-0.5"
      aria-hidden="true"
    >→</span>
  </button>
</template>
