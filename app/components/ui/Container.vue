<script setup lang="ts">
withDefaults(
  defineProps<{
    bleed?: boolean
    narrow?: boolean
  }>(),
  { bleed: false, narrow: false },
)
</script>

<template>
  <div
    :class="[
      'mx-auto w-full',
      narrow ? 'max-w-[var(--container-narrow)]' : 'max-w-[var(--container-max)]',
      bleed ? '' : 'px-4 sm:px-6 lg:px-10',
    ]"
  >
    <slot />
  </div>
</template>
