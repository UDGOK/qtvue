<script setup lang="ts">
/**
 * BarChart — greptile-style minimal bar chart with dashed grid lines.
 * Bars rise from 0 to `value`% (or whatever unit). One bar is the
 * "us" bar and gets the primary color; others are muted.
 */
defineProps<{
  /** array of bars, top of stack = leftmost */
  bars: { label: string; value: number; unit?: string; highlight?: boolean }[]
  /** y axis label */
  yLabel?: string
  /** show "us" badge on the highlighted bar */
  usBadge?: string
}>()
</script>

<template>
  <div class="rounded-2xl border border-border bg-bg p-6 sm:p-8">
    <div class="mb-6 flex items-end justify-between gap-4">
      <p v-if="yLabel" class="eyebrow">{{ yLabel }}</p>
      <p class="font-mono text-xs text-text-muted">
        <slot name="caption" />
      </p>
    </div>
    <div class="relative grid gap-6" :style="{ gridTemplateColumns: `repeat(${bars.length}, minmax(0, 1fr))` }">
      <!-- dashed gridlines -->
      <div class="pointer-events-none absolute inset-0 flex flex-col justify-between">
        <div v-for="i in 5" :key="i" class="border-t border-dashed border-border" />
      </div>
      <!-- bars -->
      <div
        v-for="(b, idx) in bars"
        :key="b.label"
        class="relative flex h-48 flex-col items-center justify-end sm:h-64"
      >
        <!-- value label -->
        <div class="mb-2 text-center">
          <div
            :class="[
              'font-display text-2xl font-extrabold sm:text-3xl',
              b.highlight ? 'text-primary' : 'text-text',
            ]"
          >
            {{ b.value }}{{ b.unit ?? '%' }}
          </div>
          <div class="mt-1 text-xs text-text-secondary">{{ b.label }}</div>
        </div>
        <!-- bar -->
        <div class="relative w-full max-w-[88px] flex-1">
          <div
            :class="[
              'absolute bottom-0 left-1/2 w-full -translate-x-1/2 rounded-t-md border-x-2 border-t-2 transition-all duration-700',
              b.highlight ? 'border-primary bg-primary/15' : 'border-border-strong bg-surface-2',
            ]"
            :style="{ height: `${b.value}%`, minHeight: '8px' }"
          />
          <!-- "us" badge on the highlighted bar -->
          <div
            v-if="b.highlight && usBadge"
            class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <div
              class="grid h-10 w-10 place-items-center rounded-md border-2 border-primary bg-bg"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M5 12 L10 17 L19 7"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="text-primary"
                />
              </svg>
            </div>
            <div class="mt-1 text-center font-mono text-[10px] uppercase tracking-wider text-primary">
              {{ usBadge }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
