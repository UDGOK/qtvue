<script setup lang="ts">
import { computed, ref } from 'vue'

const { t } = useI18n()

const nav = computed(() => [
  { label: t('nav.services'), to: '/services' },
  { label: t('nav.industries'), to: '/industries' },
  { label: t('nav.work'), to: '/work' },
  { label: t('nav.about'), to: '/about' },
  { label: t('nav.blog'), to: '/blog' },
  { label: t('nav.careers'), to: '/careers' },
])

const mobileOpen = ref(false)
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur">
    <Container class="flex h-16 items-center justify-between">
      <NuxtLink to="/" aria-label="qtvue home"><Logo /></NuxtLink>

      <nav class="hidden items-center gap-6 md:flex" aria-label="Primary">
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="text-sm text-text-secondary hover:text-text"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-2">
        <ThemeToggle />
        <Btn href="/contact" size="sm">{{ $t('nav.contact') }}</Btn>
        <button
          type="button"
          class="rounded-lg p-2 hover:bg-surface md:hidden"
          aria-label="Toggle menu"
          @click="mobileOpen = !mobileOpen"
        >
          <Icon :name="mobileOpen ? 'X' : 'Menu'" :size="20" />
        </button>
      </div>
    </Container>

    <nav v-if="mobileOpen" class="border-t border-border bg-bg md:hidden" aria-label="Mobile">
      <Container class="flex flex-col py-2">
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="py-2 text-text-secondary"
          @click="mobileOpen = false"
        >
          {{ item.label }}
        </NuxtLink>
      </Container>
    </nav>
  </header>
</template>
