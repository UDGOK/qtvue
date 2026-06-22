<script setup lang="ts">
/**
 * Default layout — header + slot + footer.
 *
 * The header's announcement bar has a `now` named slot. We fill
 * it with the <NowPill variant="banner"> component so the live
 * "what's happening on the workbench" status appears at the very
 * top of every page, next to the static pre-launch CTA.
 *
 * NowPill hides itself when there's no current entry, so this
 * slot is safe to fill unconditionally.
 */
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <TheHeader>
      <template #now>
        <NowPill variant="banner" />
      </template>
    </TheHeader>
    <main class="flex-1">
      <slot />
    </main>
    <TheFooter />
  </div>
</template>