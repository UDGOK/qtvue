<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const { t } = useI18n()
const route = useRoute()

const scrolled = ref(false)
const open = ref(false)
const openDropdown = ref<string | null>(null)

/* ============================================================
   Menu structure — greptile-style.
   Each item has a small icon, UPPERCASE label, and a route.
   Dropdowns get a `▾` chevron.
   ============================================================ */
const services = computed(() => [
  { label: 'Robotics Integration', to: '/services/integration', desc: 'Full cell design, build, and commissioning' },
  { label: 'Robot Programming', to: '/services/programming', desc: 'New programs, retrofits, optimization' },
  { label: 'Robot & Peripheral Sales', to: '/services/sales', desc: 'Arms, controllers, EOAT, vision' },
  { label: 'Feasibility & Consulting', to: '/services/consulting', desc: 'Assessments, ROI, engineering plans' },
])
const resources = computed(() => [
  { label: 'Case studies', to: '/work', desc: 'Selected projects' },
  { label: 'Industries', to: '/industries', desc: 'Where we work' },
  { label: 'Blog', to: '/blog', desc: 'Notes on robotics & automation' },
  { label: 'Careers', to: '/careers', desc: 'Join the team' },
])

interface NavItem {
  key: string
  label: string
  to: string
  hasDropdown: boolean
  icon: 'cube' | 'dollar' | 'sparkle' | 'building' | 'book' | 'bookmark' | 'arrow' | 'dot'
}

const leftNav = computed<NavItem[]>(() => [
  { key: 'examples', label: 'Examples', to: '/work', hasDropdown: false, icon: 'cube' },
  { key: 'pricing', label: 'Pricing', to: '/services', hasDropdown: false, icon: 'dollar' },
  {
    key: 'services',
    label: 'Features',
    to: '/services',
    hasDropdown: true,
    icon: 'sparkle',
  },
])
const rightNav = computed<NavItem[]>(() => [
  { key: 'enterprise', label: 'Enterprise', to: '/industries', hasDropdown: false, icon: 'building' },
  { key: 'blog', label: 'Blog', to: '/blog', hasDropdown: false, icon: 'book' },
  {
    key: 'resources',
    label: 'Resources',
    to: '#',
    hasDropdown: true,
    icon: 'bookmark',
  },
])

const dropdownMap: Record<string, ReturnType<typeof services.value extends never[] ? never : () => { label: string; to: string; desc: string }[]>> = {
  services,
  resources,
}

function handleScroll() {
  scrolled.value = window.scrollY > 8
}
onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
  document.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('keydown', onKey)
})

function toggleDropdown(key: string) {
  openDropdown.value = openDropdown.value === key ? null : key
}
function closeAll() {
  openDropdown.value = null
  open.value = false
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') closeAll()
}

watch(() => route.path, closeAll)

const headerEl = ref<HTMLElement | null>(null)
function onClickAway(e: MouseEvent) {
  if (!headerEl.value) return
  if (!headerEl.value.contains(e.target as Node)) closeAll()
}
onMounted(() => document.addEventListener('click', onClickAway))
onBeforeUnmount(() => document.removeEventListener('click', onClickAway))
</script>

<template>
  <header
    ref="headerEl"
    :class="[
      'sticky top-0 z-50 w-full transition-all duration-300',
      scrolled
        ? 'border-b border-border bg-bg/85 backdrop-blur-xl supports-[backdrop-filter]:bg-bg/70'
        : 'bg-bg/60 backdrop-blur-md',
    ]"
  >
    <Container class="grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-4">
      <!-- ============= LEFT NAV ============= -->
      <nav class="hidden items-center gap-1 md:flex" aria-label="Primary left">
        <div
          v-for="item in leftNav"
          :key="item.key"
          class="relative"
          @mouseenter="item.hasDropdown ? (openDropdown = item.key) : null"
          @mouseleave="item.hasDropdown ? (openDropdown = null) : null"
        >
          <NuxtLink
            v-if="!item.hasDropdown"
            :to="item.to"
            class="group inline-flex h-10 items-center gap-1.5 rounded-md px-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-text-secondary transition-colors hover:text-text"
          >
            <!-- inline icon -->
            <svg
              v-if="item.icon === 'cube'"
              class="h-3.5 w-3.5 opacity-70 transition-opacity group-hover:opacity-100"
              viewBox="0 0 16 16" fill="none" aria-hidden="true"
            >
              <path d="M8 1.5 L14 5 L14 11 L8 14.5 L2 11 L2 5 Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" />
              <path d="M8 1.5 L14 5 L8 8.5 L2 5 Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" />
            </svg>
            <svg
              v-else-if="item.icon === 'dollar'"
              class="h-3.5 w-3.5 opacity-70 transition-opacity group-hover:opacity-100"
              viewBox="0 0 16 16" fill="none" aria-hidden="true"
            >
              <path d="M8 2 V14 M5 5 Q5 4 8 4 Q11 4 11 6 Q11 8 8 8 Q5 8 5 10 Q5 12 8 12 Q11 12 11 11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <svg
              v-else-if="item.icon === 'sparkle'"
              class="h-3.5 w-3.5 opacity-70 transition-opacity group-hover:opacity-100"
              viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"
            >
              <path d="M8 1 L9.5 6.5 L15 8 L9.5 9.5 L8 15 L6.5 9.5 L1 8 L6.5 6.5 Z" />
            </svg>
            <span>{{ item.label }}</span>
          </NuxtLink>

          <button
            v-else
            type="button"
            :aria-expanded="openDropdown === item.key"
            aria-haspopup="true"
            class="group inline-flex h-10 items-center gap-1.5 rounded-md px-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-text-secondary transition-colors hover:text-text"
            @click.stop="toggleDropdown(item.key)"
          >
            <svg
              v-if="item.icon === 'sparkle'"
              class="h-3.5 w-3.5 opacity-70 transition-opacity group-hover:opacity-100"
              viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"
            >
              <path d="M8 1 L9.5 6.5 L15 8 L9.5 9.5 L8 15 L6.5 9.5 L1 8 L6.5 6.5 Z" />
            </svg>
            <span>{{ item.label }}</span>
            <svg
              :class="['h-3 w-3 opacity-70 transition-transform', openDropdown === item.key && 'rotate-180']"
              viewBox="0 0 16 16" fill="none" aria-hidden="true"
            >
              <path d="M4 6 L8 10 L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>

          <!-- DROPDOWN -->
          <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-1"
          >
            <div
              v-if="item.hasDropdown && openDropdown === item.key"
              class="absolute left-0 top-full z-50 mt-2 w-[420px] rounded-2xl border border-border bg-bg p-3 shadow-[var(--shadow-lg)]"
              role="menu"
            >
              <div class="grid grid-cols-1 gap-1">
                <NuxtLink
                  v-for="entry in dropdownMap[item.key]"
                  :key="entry.to"
                  :to="entry.to"
                  class="group flex flex-col gap-0.5 rounded-xl p-3 transition-colors hover:bg-surface"
                  role="menuitem"
                >
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-semibold text-text group-hover:text-primary">
                      {{ entry.label }}
                    </span>
                    <span
                      class="text-text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                      aria-hidden="true"
                    >→</span>
                  </div>
                  <span class="text-xs text-text-secondary">{{ entry.desc }}</span>
                </NuxtLink>
              </div>
            </div>
          </Transition>
        </div>
      </nav>

      <!-- ============= CENTER LOGO ============= -->
      <NuxtLink to="/" aria-label="qtvue home" class="flex items-center justify-center" @click="closeAll">
        <Logo />
      </NuxtLink>

      <!-- ============= RIGHT NAV ============= -->
      <nav class="hidden items-center justify-end gap-1 md:flex" aria-label="Primary right">
        <div
          v-for="item in rightNav"
          :key="item.key"
          class="relative"
          @mouseenter="item.hasDropdown ? (openDropdown = item.key) : null"
          @mouseleave="item.hasDropdown ? (openDropdown = null) : null"
        >
          <NuxtLink
            v-if="!item.hasDropdown"
            :to="item.to"
            class="group inline-flex h-10 items-center gap-1.5 rounded-md px-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-text-secondary transition-colors hover:text-text"
          >
            <svg
              v-if="item.icon === 'building'"
              class="h-3.5 w-3.5 opacity-70 transition-opacity group-hover:opacity-100"
              viewBox="0 0 16 16" fill="none" aria-hidden="true"
            >
              <path d="M2 14 V4 L8 2 L14 4 V14 M5 7 H7 M5 10 H7 M9 7 H11 M9 10 H11 M2 14 H14" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <svg
              v-else-if="item.icon === 'book'"
              class="h-3.5 w-3.5 opacity-70 transition-opacity group-hover:opacity-100"
              viewBox="0 0 16 16" fill="none" aria-hidden="true"
            >
              <path d="M2 3 V13 M14 3 V13 M2 3 Q5 2 8 3 Q11 2 14 3 M2 13 Q5 12 8 13 Q11 12 14 13" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" />
            </svg>
            <span>{{ item.label }}</span>
          </NuxtLink>

          <button
            v-else
            type="button"
            :aria-expanded="openDropdown === item.key"
            aria-haspopup="true"
            class="group inline-flex h-10 items-center gap-1.5 rounded-md px-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-text-secondary transition-colors hover:text-text"
            @click.stop="toggleDropdown(item.key)"
          >
            <svg
              v-if="item.icon === 'bookmark'"
              class="h-3.5 w-3.5 opacity-70 transition-opacity group-hover:opacity-100"
              viewBox="0 0 16 16" fill="none" aria-hidden="true"
            >
              <path d="M4 2 H12 V14 L8 11 L4 14 Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" />
            </svg>
            <span>{{ item.label }}</span>
            <svg
              :class="['h-3 w-3 opacity-70 transition-transform', openDropdown === item.key && 'rotate-180']"
              viewBox="0 0 16 16" fill="none" aria-hidden="true"
            >
              <path d="M4 6 L8 10 L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>

          <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-1"
          >
            <div
              v-if="item.hasDropdown && openDropdown === item.key"
              class="absolute right-0 top-full z-50 mt-2 w-[420px] rounded-2xl border border-border bg-bg p-3 shadow-[var(--shadow-lg)]"
              role="menu"
            >
              <div class="grid grid-cols-1 gap-1">
                <NuxtLink
                  v-for="entry in dropdownMap[item.key]"
                  :key="entry.to"
                  :to="entry.to"
                  class="group flex flex-col gap-0.5 rounded-xl p-3 transition-colors hover:bg-surface"
                  role="menuitem"
                >
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-semibold text-text group-hover:text-primary">
                      {{ entry.label }}
                    </span>
                    <span
                      class="text-text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                      aria-hidden="true"
                    >→</span>
                  </div>
                  <span class="text-xs text-text-secondary">{{ entry.desc }}</span>
                </NuxtLink>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Theme toggle + Right CTAs: greptile-style chevron-cut buttons -->
        <div class="ml-2 flex items-center gap-2">
          <ThemeToggle class="h-9 w-9" />
          <div class="flex items-center gap-0">
            <Btn href="/contact" variant="ink" size="md" chevron>
              Contact Sales
            </Btn>
            <Btn href="/contact" variant="primary" size="md" chevron>
              Start now
            </Btn>
          </div>
        </div>
      </nav>

      <!-- ============= MOBILE TRIGGER ============= -->
      <button
        type="button"
        class="ml-1 grid h-9 w-9 place-items-center rounded-full border border-border md:hidden"
        :aria-label="open ? 'Close menu' : 'Open menu'"
        :aria-expanded="open"
        @click="open = !open"
      >
        <svg
          v-if="!open"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M2 4 H14 M2 8 H14 M2 12 H14"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
        <svg
          v-else
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3 3 L13 13 M13 3 L3 13"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </Container>

    <!-- ============= MOBILE NAV ============= -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="open"
        class="border-t border-border bg-bg md:hidden"
      >
        <Container class="flex flex-col gap-1 py-4">
          <template v-for="group in [leftNav, rightNav]" :key="group.map(i => i.key).join('-')">
            <template v-for="item in group" :key="item.key">
              <NuxtLink
                v-if="!item.hasDropdown"
                :to="item.to"
                class="rounded-lg px-3 py-2.5 font-mono text-xs uppercase tracking-[0.14em] text-text-secondary hover:bg-surface hover:text-text"
                @click="open = false"
              >
                {{ item.label }}
              </NuxtLink>
              <div v-else class="flex flex-col gap-1">
                <div class="px-3 pt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted">
                  {{ item.label }}
                </div>
                <NuxtLink
                  v-for="entry in dropdownMap[item.key]"
                  :key="entry.to"
                  :to="entry.to"
                  class="rounded-lg px-3 py-2 text-sm text-text-secondary hover:bg-surface hover:text-text"
                  @click="open = false"
                >
                  {{ entry.label }}
                </NuxtLink>
              </div>
            </template>
          </template>
          <div class="my-2 h-px bg-border" />
          <div class="flex items-center gap-2">
            <span class="font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted">
              Theme
            </span>
            <ThemeToggle class="h-8 w-8" />
          </div>
          <div class="grid grid-cols-2 gap-2">
            <Btn href="/contact" variant="ink" size="sm" chevron>Contact Sales</Btn>
            <Btn href="/contact" variant="primary" size="sm" chevron>Start now</Btn>
          </div>
        </Container>
      </div>
    </Transition>
  </header>
</template>
