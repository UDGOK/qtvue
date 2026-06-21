<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-border bg-surface">
    <Container class="py-12">
      <div class="flex flex-col items-start justify-between gap-6 sm:flex-row">
        <div>
          <Logo />
          <p class="mt-3 max-w-xs text-sm text-text-secondary">
            Robotics integration, programming, and consulting for industrial operations worldwide.
          </p>
        </div>
        <nav class="flex flex-col gap-2 text-sm text-text-secondary" aria-label="Footer">
          <NuxtLink to="/services">Services</NuxtLink>
          <NuxtLink to="/work">Work</NuxtLink>
          <NuxtLink to="/careers">Careers</NuxtLink>
          <NuxtLink to="/contact">Contact</NuxtLink>
        </nav>
      </div>
      <div
        class="mt-8 flex flex-col gap-2 border-t border-border pt-6 text-xs text-text-secondary sm:flex-row sm:items-center sm:justify-between"
      >
        <p>© {{ year }} qtvue. All rights reserved.</p>
        <div class="flex gap-4">
          <NuxtLink to="/legal/privacy">Privacy</NuxtLink>
          <NuxtLink to="/legal/terms">Terms</NuxtLink>
        </div>
      </div>
    </Container>
  </footer>
</template>
