<script setup lang="ts">
/**
 * Marquee — horizontal auto-scrolling strip. Greptile uses one for the
 * logo cloud. We render two stacked copies that translate together, so
 * the loop is seamless.
 */
const props = withDefaults(
  defineProps<{
    /** any number of slots via children — pass an array of items as a single
     *  child <template v-for>, or use the items + item-slot pattern. */
    duration?: number
    pauseOnHover?: boolean
  }>(),
  { duration: 30, pauseOnHover: true },
)
</script>

<template>
  <div
    class="group relative overflow-hidden"
    :style="{ '--marquee-duration': `${props.duration}s` }"
    :class="[pauseOnHover && 'hover:[&_*]:[animation-play-state:paused]']"
  >
    <div class="flex w-max animate-marquee gap-12 will-change-transform">
      <div class="flex shrink-0 items-center gap-12">
        <slot />
      </div>
      <div class="flex shrink-0 items-center gap-12" aria-hidden="true">
        <slot />
      </div>
    </div>
    <!-- fade edges -->
    <div class="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-bg to-transparent" />
    <div class="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-bg to-transparent" />
  </div>
</template>

<style scoped>
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.animate-marquee {
  animation: marquee var(--marquee-duration, 30s) linear infinite;
}
</style>
