<script setup lang="ts">
const { t } = useI18n()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-border bg-surface">
    <Container class="py-12">
      <div class="flex flex-col items-start justify-between gap-6 sm:flex-row">
        <div>
          <Logo />
          <p class="mt-3 max-w-xs text-sm text-text-secondary">
            {{ $t('footer.tagline') }}
          </p>
        </div>
        <nav class="flex flex-col gap-2 text-sm text-text-secondary" aria-label="Footer">
          <NuxtLink to="/services">{{ $t('nav.services') }}</NuxtLink>
          <NuxtLink to="/work">{{ $t('nav.work') }}</NuxtLink>
          <NuxtLink to="/careers">{{ $t('nav.careers') }}</NuxtLink>
          <NuxtLink to="/contact">{{ $t('nav.contact') }}</NuxtLink>
        </nav>
      </div>
      <div
        class="mt-8 flex flex-col gap-2 border-t border-border pt-6 text-xs text-text-secondary sm:flex-row sm:items-center sm:justify-between"
      >
        <p>© {{ year }} qtvue. {{ $t('footer.rights') }}</p>
        <div class="flex gap-4">
          <NuxtLink to="/legal/privacy">Privacy</NuxtLink>
          <NuxtLink to="/legal/terms">Terms</NuxtLink>
        </div>
      </div>
    </Container>
  </footer>
</template>
