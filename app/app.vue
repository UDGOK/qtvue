<script setup lang="ts">
// Global SEO defaults applied to every page; pages override via useSeoMeta.
useSeoMeta({
  ogSiteName: 'qtvue',
  twitterCard: 'summary_large_image',
})

// Organization structured data for rich search results.
useSchemaOrg([
  {
    '@type': 'Organization',
    name: 'qtvue',
    url: 'https://qtvue.com',
    email: 'hello@qtvue.com',
    description: 'Robotics integration, programming, sales, and consulting.',
  },
])
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
