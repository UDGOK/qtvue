<script setup lang="ts">
/**
 * Ticker — horizontal scrolling system-telemetry strip. Pure CSS, no JS.
 * Greptile style: monospace, all caps, separator dots, slow scroll.
 */
withDefaults(
  defineProps<{
    duration?: number
    items: string[]
  }>(),
  { duration: 50 },
)
</script>

<template>
  <div
    class="relative overflow-hidden border-y border-border bg-surface py-3"
    :style="{ '--ticker-duration': `${duration}s` }"
  >
    <div class="flex w-max animate-ticker gap-12 will-change-transform">
      <div v-for="copy in 2" :key="copy" class="flex shrink-0 items-center gap-12 px-6">
        <span
          v-for="(item, i) in items"
          :key="`${copy}-${i}`"
          class="flex items-center gap-12 font-mono text-xs uppercase tracking-widest text-text-secondary"
        >
          <span>{{ item }}</span>
          <span class="text-text-muted" aria-hidden="true">●</span>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes ticker {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.animate-ticker {
  animation: ticker var(--ticker-duration, 50s) linear infinite;
}
</style>
