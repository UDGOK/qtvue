<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const { t } = useI18n()
const route = useRoute()

const scrolled = ref(false)
const open = ref(false)
const openDropdown = ref<string | null>(null)

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
}

const nav = computed<NavItem[]>(() => [
  { key: 'services', label: t('nav.services'), to: '/services', hasDropdown: true },
  { key: 'industries', label: t('nav.industries'), to: '/industries', hasDropdown: false },
  { key: 'work', label: t('nav.work'), to: '/work', hasDropdown: false },
  { key: 'about', label: t('nav.about'), to: '/about', hasDropdown: false },
  { key: 'resources', label: 'Resources', to: '#', hasDropdown: true },
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

// close dropdown when clicking outside
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
        ? 'border-b border-border bg-bg/80 backdrop-blur-xl supports-[backdrop-filter]:bg-bg/70'
        : 'bg-transparent',
    ]"
  >
    <Container class="flex h-16 items-center justify-between gap-4">
      <NuxtLink to="/" aria-label="qtvue home" @click="closeAll">
        <Logo />
      </NuxtLink>

      <!-- ============= DESKTOP NAV ============= -->
      <nav class="hidden items-center gap-1 md:flex" aria-label="Primary">
        <div
          v-for="item in nav"
          :key="item.key"
          class="relative"
          @mouseenter="item.hasDropdown ? (openDropdown = item.key) : null"
          @mouseleave="item.hasDropdown ? (openDropdown = null) : null"
        >
          <!-- Plain link -->
          <NuxtLink
            v-if="!item.hasDropdown"
            :to="item.to"
            class="inline-flex h-9 items-center rounded-full px-3 text-sm text-text-secondary transition-colors hover:text-text"
          >
            {{ item.label }}
          </NuxtLink>

          <!-- Dropdown trigger -->
          <button
            v-else
            type="button"
            :aria-expanded="openDropdown === item.key"
            aria-haspopup="true"
            class="inline-flex h-9 items-center gap-1 rounded-full px-3 text-sm text-text-secondary transition-colors hover:text-text"
            @click.stop="toggleDropdown(item.key)"
          >
            {{ item.label }}
            <svg
              :class="['h-3.5 w-3.5 transition-transform', openDropdown === item.key && 'rotate-180']"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4 6 L8 10 L12 6"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>

          <!-- DROPDOWN PANEL -->
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
              <div class="mt-2 flex items-center justify-between rounded-xl bg-surface-2 px-3 py-2.5">
                <span class="text-xs text-text-secondary">Not sure where to start?</span>
                <NuxtLink to="/contact" class="font-mono text-xs uppercase tracking-wider text-primary">
                  Talk to us →
                </NuxtLink>
              </div>
            </div>
          </Transition>
        </div>
      </nav>

      <!-- ============= RIGHT CTAs ============= -->
      <div class="flex items-center gap-2">
        <ThemeToggle class="hidden sm:inline-flex" />
        <Btn href="/contact" variant="secondary" size="sm" class="hidden sm:inline-flex">
          {{ t('nav.contact') }}
        </Btn>
        <Btn href="/contact" variant="primary" size="sm" arrow>
          Start a project
        </Btn>

        <!-- mobile menu trigger -->
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
      </div>
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
          <template v-for="item in nav" :key="item.key">
            <NuxtLink
              v-if="!item.hasDropdown"
              :to="item.to"
              class="rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface hover:text-text"
              @click="open = false"
            >
              {{ item.label }}
            </NuxtLink>
            <div v-else class="flex flex-col gap-1">
              <div class="px-3 pt-2 font-mono text-[10px] uppercase tracking-widest text-text-muted">
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
          <div class="my-2 h-px bg-border" />
          <Btn href="/contact" variant="primary" size="md" arrow class="w-full">
            Start a project
          </Btn>
        </Container>
      </div>
    </Transition>
  </header>
</template>
