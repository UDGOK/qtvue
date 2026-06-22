<script setup lang="ts">
/**
 * /contact — per the brief, there is ONE funnel: submit your use case.
 * This page just redirects to /intake so any old inbound link still works.
 */
definePageMeta({ middleware: [() => navigateTo('/intake', { redirectCode: 301 })] })
</script>

<template>
  <div />
</template>
