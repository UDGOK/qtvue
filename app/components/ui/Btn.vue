<script setup lang="ts">
type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    href?: string
    variant?: Variant
    size?: Size
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
  }>(),
  { variant: 'primary', size: 'md', type: 'button', disabled: false },
)

const sizeClass: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

const base = [
  'inline-flex items-center justify-center rounded-lg font-medium transition',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
  'disabled:opacity-50 disabled:pointer-events-none',
  sizeClass[props.size],
]

const variantClass: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-600',
  secondary: 'bg-surface text-text border border-border hover:border-primary',
  ghost: 'text-text hover:bg-surface',
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
  </a>
  <button
    v-else
    :type="type"
    :disabled="disabled"
    :data-variant="variant"
    :class="[base, variantClass[variant]]"
  >
    <slot />
  </button>
</template>
