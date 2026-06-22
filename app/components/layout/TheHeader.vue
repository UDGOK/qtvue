<script setup lang="ts">
/**
 * TheHeader — qtvue marketing site mega-menu.
 *
 * Architecture (borrowed from the best-in-class greptile menu pattern):
 *  - <button> triggers (not links) with a rotating chevron.
 *  - Full-width mega-panels stay in the DOM (`v-show`), toggled via
 *    opacity / translate / pointer-events — SEO-friendly and animatable.
 *  - Hover-intent with a 140ms close delay so a diagonal mouse path
 *    from trigger → panel doesn't snap the panel shut.
 *  - Keyboard: Escape closes and returns focus to the trigger; outside
 *    click closes; click on a dropdown trigger toggles it open/closed.
 *  - One `menu` config drives desktop cards, desktop list, and mobile.
 *  - Logo on the LEFT (not centered, for more conventional nav density).
 *  - Right side: ThemeToggle + greptile-style chevron-cut CTAs.
 *  - `prefers-reduced-motion` kills all the transitions.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()

const scrolled = ref(false)
const active = ref<string | null>(null)
const mobileOpen = ref(false)
const mobileExpanded = ref<string | null>(null)
let closeTimer: number | null = null
const HOVER_CLOSE_MS = 140

/* ============================================================
   Menu config — edit this, the rest regenerates automatically.
   Types: 'link' (plain nav) | 'dropdown' (mega-panel).
   Dropdown layouts: 'cards' (Features, with thumbnails + icon + desc)
                     'list'  (Resources, compact two-line)
   ============================================================ */
const services = [
  { key: 'integration', title: 'Robotics Integration', desc: 'Full cell design, build, and commissioning', to: '/services/integration' },
  { key: 'programming', title: 'Robot Programming', desc: 'New programs, retrofits, optimization', to: '/services/programming' },
  { key: 'sales',       title: 'Robot & Peripheral Sales', desc: 'Arms, controllers, EOAT, vision', to: '/services/sales' },
  { key: 'consulting',  title: 'Feasibility & Consulting', desc: 'Assessments, ROI, engineering plans', to: '/services/consulting' },
]
const industries = [
  { key: 'welding',       title: 'Welding',            desc: 'MIG / TIG / spot cells', to: '/industries/welding' },
  { key: 'packaging',     title: 'Packaging',          desc: 'Pick-and-place, palletizing', to: '/industries/packaging' },
  { key: 'material',      title: 'Material Handling',  desc: 'High-throughput transfer', to: '/industries/material-handling' },
]

interface MenuLink   { type: 'link';     label: string; to: string }
interface MenuDrop   { type: 'dropdown'; label: string; key: string; layout: 'cards' | 'list' }
type MenuEntry = MenuLink | MenuDrop

const menu: MenuEntry[] = [
  { type: 'link', label: 'Examples', to: '/work' },
  { type: 'link', label: 'Pricing',  to: '/services' },
  {
    type: 'dropdown',
    label: 'Features',
    key: 'features',
    layout: 'cards',
  },
  { type: 'link', label: 'Enterprise', to: '/industries' },
  { type: 'link', label: 'Blog',       to: '/blog' },
  {
    type: 'dropdown',
    label: 'Resources',
    key: 'resources',
    layout: 'list',
  },
]

/* ============================================================
   Hover-intent + keyboard + outside-click handlers
   ============================================================ */
function open(key: string) {
  if (closeTimer) {
    window.clearTimeout(closeTimer)
    closeTimer = null
  }
  active.value = key
}
function scheduleClose() {
  if (closeTimer) window.clearTimeout(closeTimer)
  closeTimer = window.setTimeout(() => {
    active.value = null
  }, HOVER_CLOSE_MS)
}
function closeNow() {
  if (closeTimer) window.clearTimeout(closeTimer)
  active.value = null
}
function toggleClick(key: string) {
  if (active.value === key) {
    closeNow()
  } else {
    open(key)
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    const prev = active.value
    if (mobileOpen.value) {
      mobileOpen.value = false
      mobileExpanded.value = null
      return
    }
    if (prev) {
      closeNow()
      // return focus to the trigger
      const trigger = document.getElementById(`trigger-${prev}`)
      trigger?.focus()
    }
  }
}
function onDocClick(e: MouseEvent) {
  const target = e.target as HTMLElement | null
  if (active.value && target && !target.closest('[data-menu-root]')) closeNow()
  if (mobileOpen.value && target && !target.closest('[data-mobile-root]') && !target.closest('[data-mobile-trigger]')) {
    mobileOpen.value = false
    mobileExpanded.value = null
  }
}

function handleScroll() {
  scrolled.value = window.scrollY > 8
}

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('click', onDocClick)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('click', onDocClick)
  if (closeTimer) window.clearTimeout(closeTimer)
})

watch(() => route.path, () => {
  closeNow()
  mobileOpen.value = false
  mobileExpanded.value = null
})
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full border-b border-border/60 bg-bg/85 backdrop-blur-xl supports-[backdrop-filter]:bg-bg/70 transition-shadow"
    :class="scrolled && 'shadow-sm'"
    data-menu-root
  >
    <Container class="flex h-16 items-center gap-4">
      <!-- ============= LOGO (left) ============= -->
      <NuxtLink to="/" aria-label="qtvue home" class="flex shrink-0 items-center">
        <Logo />
      </NuxtLink>

      <!-- ============= DESKTOP NAV ============= -->
      <nav class="hidden flex-1 items-center justify-center gap-1 lg:flex" aria-label="Primary">
        <ul class="flex items-center gap-1">
          <li
            v-for="entry in menu"
            :key="entry.label"
            class="relative"
            @mouseenter="entry.type === 'dropdown' ? open(entry.key) : null"
            @mouseleave="entry.type === 'dropdown' ? scheduleClose() : null"
          >
            <!-- Plain link -->
            <NuxtLink
              v-if="entry.type === 'link'"
              :to="entry.to"
              class="inline-flex h-10 items-center rounded-md px-3 font-mono text-[11px] uppercase tracking-[0.14em] text-text-secondary transition-colors hover:text-text"
            >
              {{ entry.label }}
            </NuxtLink>

            <!-- Dropdown trigger -->
            <button
              v-else
              :id="`trigger-${entry.key}`"
              type="button"
              :aria-expanded="active === entry.key"
              aria-haspopup="true"
              :aria-controls="`panel-${entry.key}`"
              class="inline-flex h-10 items-center gap-1.5 rounded-md px-3 font-mono text-[11px] uppercase tracking-[0.14em] text-text-secondary transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              @click.stop="toggleClick(entry.key)"
            >
              {{ entry.label }}
              <svg
                :class="['h-3 w-3 transition-transform duration-200', active === entry.key && 'rotate-180']"
                viewBox="0 0 16 16" fill="none" aria-hidden="true"
              >
                <path
                  d="M4 6 L8 10 L12 6"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </li>
        </ul>
      </nav>

      <!-- ============= RIGHT: theme + CTAs ============= -->
      <div class="ml-auto hidden items-center gap-2 lg:flex">
        <ThemeToggle class="h-9 w-9" />
        <div class="flex items-center gap-0">
          <Btn href="/contact" variant="ink" size="md" chevron>Contact Sales</Btn>
          <Btn href="/contact" variant="primary" size="md" chevron>Start now</Btn>
        </div>
      </div>

      <!-- ============= MOBILE TRIGGER ============= -->
      <button
        type="button"
        class="ml-auto grid h-9 w-9 place-items-center rounded-full border border-border md:hidden"
        :aria-label="mobileOpen ? 'Close menu' : 'Open menu'"
        :aria-expanded="mobileOpen"
        data-mobile-trigger
        @click="mobileOpen = !mobileOpen"
      >
        <svg
          v-if="!mobileOpen"
          width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"
        >
          <path d="M2 4 H14 M2 8 H14 M2 12 H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
        <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 3 L13 13 M13 3 L3 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </button>
    </Container>

    <!-- ===================== MEGA PANELS (desktop) ===================== -->
    <template v-for="entry in menu" :key="`panel-${entry.label}`">
      <div
        v-if="entry.type === 'dropdown'"
        :id="`panel-${entry.key}`"
        role="region"
        :aria-label="entry.label"
        @mouseenter="open(entry.key)"
        @mouseleave="scheduleClose()"
        v-show="active === entry.key"
        class="absolute inset-x-0 top-full hidden border-b border-border/60 bg-bg/98 backdrop-blur-xl transition-all duration-200 ease-out lg:block"
        :class="active === entry.key
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none -translate-y-2 opacity-0'"
      >
        <Container class="py-8">
          <!-- =====================================================
               CARDS layout (Features) — service tiles w/ icon + desc
               ===================================================== -->
          <div v-if="entry.layout === 'cards'">
            <div class="mb-6 flex items-baseline justify-between">
              <p class="eyebrow">What we ship</p>
              <NuxtLink
                to="/services"
                class="font-mono text-[11px] uppercase tracking-[0.14em] text-text-secondary hover:text-primary"
                @click="closeNow"
              >
                View all services →
              </NuxtLink>
            </div>
            <ul class="grid gap-px overflow-hidden rounded-2xl border border-dashed border-border bg-border md:grid-cols-2">
              <li v-for="s in services" :key="s.key" class="bg-bg">
                <NuxtLink
                  :to="s.to"
                  @click="closeNow"
                  class="group block p-5 transition-colors hover:bg-surface"
                >
                  <div class="flex items-start gap-4">
                    <div class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-50 text-primary transition-colors group-hover:bg-primary group-hover:text-paper">
                      <Icon :name="iconForService(s.key)" :size="20" />
                    </div>
                    <div class="min-w-0">
                      <div class="flex items-center gap-2">
                        <h3 class="text-sm font-semibold text-text group-hover:text-primary">{{ s.title }}</h3>
                        <span class="text-text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden="true">→</span>
                      </div>
                      <p class="mt-1 text-xs text-text-secondary">{{ s.desc }}</p>
                    </div>
                  </div>
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- =====================================================
               LIST layout (Resources) — compact two-line items
               ===================================================== -->
          <div v-else>
            <div class="mb-6 flex items-baseline justify-between">
              <p class="eyebrow">Learn & explore</p>
              <NuxtLink
                to="/contact"
                class="font-mono text-[11px] uppercase tracking-[0.14em] text-text-secondary hover:text-primary"
                @click="closeNow"
              >
                Talk to us →
              </NuxtLink>
            </div>
            <ul class="grid gap-1 md:grid-cols-2">
              <li v-for="r in resourcesList" :key="r.to">
                <NuxtLink
                  :to="r.to"
                  @click="closeNow"
                  class="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-surface"
                >
                  <div class="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface-2 text-text-secondary group-hover:bg-primary-50 group-hover:text-primary">
                    <Icon :name="r.icon" :size="18" />
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-semibold text-text group-hover:text-primary">{{ r.label }}</span>
                      <span class="text-text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden="true">→</span>
                    </div>
                    <p class="text-xs text-text-secondary">{{ r.desc }}</p>
                  </div>
                </NuxtLink>
              </li>
            </ul>
          </div>
        </Container>
      </div>
    </template>

    <!-- ===================== MOBILE DRAWER ===================== -->
    <div
      v-show="mobileOpen"
      data-mobile-root
      class="border-t border-border bg-bg lg:hidden"
    >
      <Container class="flex flex-col gap-1 py-4">
        <ul class="divide-y divide-border/40">
          <li v-for="entry in menu" :key="`m-${entry.label}`">
            <NuxtLink
              v-if="entry.type === 'link'"
              :to="entry.to"
              class="block py-3 font-mono text-xs uppercase tracking-[0.14em] text-text-secondary"
              @click="mobileOpen = false"
            >
              {{ entry.label }}
            </NuxtLink>

            <div v-else>
              <button
                type="button"
                :aria-expanded="mobileExpanded === entry.key"
                class="flex w-full items-center justify-between py-3 font-mono text-xs uppercase tracking-[0.14em] text-text-secondary"
                @click="mobileExpanded = mobileExpanded === entry.key ? null : entry.key"
              >
                {{ entry.label }}
                <svg
                  :class="['h-3 w-3 transition-transform', mobileExpanded === entry.key && 'rotate-180']"
                  viewBox="0 0 16 16" fill="none" aria-hidden="true"
                >
                  <path
                    d="M4 6 L8 10 L12 6"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
              <ul v-show="mobileExpanded === entry.key" class="pb-2 pl-2">
                <li v-for="s in services" :key="`m-${s.key}`" v-if="entry.key === 'features'">
                  <NuxtLink
                    :to="s.to"
                    class="flex items-center gap-2 py-2 text-sm text-text-secondary"
                    @click="mobileOpen = false"
                  >
                    <Icon :name="iconForService(s.key)" :size="14" />
                    {{ s.title }}
                  </NuxtLink>
                </li>
                <li v-for="r in resourcesList" :key="`m-${r.to}`" v-if="entry.key === 'resources'">
                  <NuxtLink
                    :to="r.to"
                    class="flex items-center gap-2 py-2 text-sm text-text-secondary"
                    @click="mobileOpen = false"
                  >
                    <Icon :name="r.icon" :size="14" />
                    {{ r.label }}
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </li>
        </ul>

        <div class="my-2 h-px bg-border" />

        <div class="flex items-center justify-between">
          <span class="font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted">Theme</span>
          <ThemeToggle class="h-8 w-8" />
        </div>

        <div class="grid grid-cols-2 gap-2">
          <Btn href="/contact" variant="ink" size="sm" chevron>Contact Sales</Btn>
          <Btn href="/contact" variant="primary" size="sm" chevron>Start now</Btn>
        </div>
      </Container>
    </div>
  </header>
</template>

<script lang="ts">
// Small helpers used in the template
const resourcesList = [
  { label: 'Case studies',  desc: 'Selected robotics projects', to: '/work',         icon: 'Briefcase' },
  { label: 'Industries',    desc: 'Where we deploy',           to: '/industries',   icon: 'Factory' },
  { label: 'Blog',          desc: 'Notes from our engineers',  to: '/blog',         icon: 'BookOpen' },
  { label: 'Careers',       desc: 'Join the team',             to: '/careers',      icon: 'Users' },
]
const serviceIconMap: Record<string, string> = {
  integration: 'Cog',
  programming: 'Code',
  sales: 'Package',
  consulting: 'Lightbulb',
}
function iconForService(key: string) {
  return serviceIconMap[key] ?? 'Cog'
}
export { resourcesList, iconForService }
</script>

<style scoped>
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
</style>
