<script setup lang="ts">
/**
 * TheHeader — qtvue marketing site mega-menu.
 *
 * Final, greptile-accurate version. Anatomy:
 *  - Top announcement bar (mint bg, dismissable)
 *  - Sticky glass header below it
 *  - Logo on the LEFT (geometric "Q" mark + "qtvue" wordmark)
 *  - Center: 6 nav items, UPPERCASE mono with icons. Active/hovered
 *    items get a mint green background pill (greptile's signature look).
 *  - Right: ThemeToggle + chevron-cut Contact Sales / Start now CTAs
 *  - Mega-panels: data-driven `cards` (Features) and `list` (Resources)
 *    layouts. v-show for SEO + animatable. Hover-intent 140ms close.
 *  - Full keyboard a11y (Escape + focus return), outside-click,
 *    route-change reset, prefers-reduced-motion override.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'

const route = useRoute()

const scrolled = ref(false)
const showAnnouncement = ref(true)
const active = ref<string | null>(null)
const mobileOpen = ref(false)
const mobileExpanded = ref<string | null>(null)
let closeTimer: number | null = null
const HOVER_CLOSE_MS = 140

/* ============================================================
   Menu config — edit this, the rest regenerates automatically.
   Each link is { type: 'link', label, to, icon }
   Each dropdown is { type: 'dropdown', label, key, layout: 'cards' | 'list' }
   ============================================================ */

interface NavLink {
  type: 'link'
  label: string
  to: string
  icon?: string
  /** optional badge ("NEW", "BETA", etc.) */
  badge?: string
}
interface NavDrop {
  type: 'dropdown'
  label: string
  key: 'features' | 'resources' | 'industries' | 'company'
  layout: 'cards' | 'list'
  icon?: string
  /** title shown in the panel header */
  panelTitle?: string
  /** right-side link in the panel header */
  panelLink?: { label: string; to: string }
}
type MenuEntry = NavLink | NavDrop

const menu: MenuEntry[] = [
  { type: 'link', label: 'Examples',  to: '/work',       icon: 'Briefcase' },
  { type: 'link', label: 'Pricing',   to: '/services',   icon: 'Tag' },
  {
    type: 'dropdown',
    label: 'Features',
    key: 'features',
    layout: 'cards',
    icon: 'Sparkles',
    panelTitle: 'Everything you need to automate',
    panelLink: { label: 'View all services', to: '/services' },
  },
  { type: 'link', label: 'Industries', to: '/industries', icon: 'Factory' },
  { type: 'link', label: 'Enterprise', to: '/contact',    icon: 'Building2' },
  { type: 'link', label: 'Blog',       to: '/blog',       icon: 'BookOpen' },
  {
    type: 'dropdown',
    label: 'Resources',
    key: 'resources',
    layout: 'list',
    icon: 'Bookmark',
    panelTitle: 'Learn & explore',
    panelLink: { label: 'Talk to our team', to: '/contact' },
  },
]

/* ============================================================
   Dropdown content (real robotics content for qtvue)
   ============================================================ */

interface FeatureCard {
  label: string
  desc: string
  href: string
  badge?: string
  /** keyword that picks the thumbnail from /public/menu/ */
  thumb?: string
}
interface ResourceItem {
  label: string
  desc: string
  to: string
  icon: string
}

const featuresData: Record<'features', FeatureCard[]> = {
  features: [
    {
      label: 'Cell Design & Simulation',
      desc: '3D cell layout with cycle-time, reach, and collision analysis',
      href: '/features/cell-design',
      thumb: 'cell-design',
      badge: 'Core',
    },
    {
      label: 'Robot Programming',
      desc: 'FANUC KAREL, ABB RAPID, KUKA KRL, Yaskawa, UR — offline + on-floor',
      href: '/features/programming',
      thumb: 'programming',
    },
    {
      label: 'Vision & Sensing',
      desc: '2D/3D vision, force/torque, laser, and proximity sensor integration',
      href: '/features/vision',
      thumb: 'vision',
    },
    {
      label: 'End-of-Arm Tooling',
      desc: 'Pneumatic & electric grippers, welders, dispensers, custom EOAT',
      href: '/features/eoat',
      thumb: 'eoat',
    },
    {
      label: 'Safety & Compliance',
      desc: 'ISO 10218, ISO/TS 15066, ANSI/RIA R15.06 risk assessments',
      href: '/features/safety',
      thumb: 'safety',
    },
    {
      label: '24/7 Global Support',
      desc: 'Remote monitoring, on-site service, spare parts in 14 countries',
      href: '/features/support',
      thumb: 'support',
      badge: 'Always on',
    },
  ],
}

const resourcesData: Record<'resources', ResourceItem[]> = {
  resources: [
    { label: 'Case studies',   desc: 'Real deployments, real numbers',   to: '/work',       icon: 'Briefcase' },
    { label: 'Industries',     desc: 'Welding, packaging, material handling', to: '/industries', icon: 'Factory' },
    { label: 'Engineering blog', desc: 'Notes from our team on the line', to: '/blog',       icon: 'BookOpen' },
    { label: 'Careers',        desc: 'Build the future of automation with us', to: '/careers',   icon: 'Users' },
    { label: 'Documentation',  desc: 'Cell design guides, KAREL cheatsheet',  to: '/docs',      icon: 'FileText' },
    { label: 'API Reference',  desc: 'Integrate with the qtvue platform',     to: '/api',       icon: 'Terminal' },
    { label: 'FAQ',            desc: '120+ answered questions, schema.org structured', to: '/faq', icon: 'HelpCircle' },
  ],
}

/* ============================================================
   Hover-intent + keyboard + outside-click + reduced-motion
   ============================================================ */
function open(key: string) {
  if (closeTimer) { window.clearTimeout(closeTimer); closeTimer = null }
  active.value = key
}
function scheduleClose() {
  if (closeTimer) window.clearTimeout(closeTimer)
  closeTimer = window.setTimeout(() => { active.value = null }, HOVER_CLOSE_MS)
}
function closeNow() {
  if (closeTimer) window.clearTimeout(closeTimer)
  active.value = null
}
function toggleClick(key: string, e?: MouseEvent) {
  // On a mouse device, hover already owns open/close. A real mouse
  // click (e.detail > 0) on a trigger that's already open from hover
  // would close it, fighting the user's intent. On touch + keyboard
  // (e.detail === 0) the click is the only way to toggle, so let it
  // through.
  if (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(hover: hover)').matches &&
    e && e.detail !== 0
  ) {
    e.stopPropagation()
    return
  }
  e?.stopPropagation()
  if (active.value === key) closeNow()
  else open(key)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    const prev = active.value
    if (mobileOpen.value) { mobileOpen.value = false; mobileExpanded.value = null; return }
    if (prev) { closeNow(); document.getElementById(`trigger-${prev}`)?.focus() }
  }
}
function onDocClick(e: MouseEvent) {
  // Anything inside the guarded header is NOT "outside" — so the
  // click that opened a panel/drawer can never close it. Both desktop
  // mega-panels and the mobile drawer live inside data-menu-root.
  if (e.target instanceof Element && e.target.closest('[data-menu-root]')) return
  closeNow()
  mobileOpen.value = false
  mobileExpanded.value = null
}
function handleScroll() { scrolled.value = window.scrollY > 8 }

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
  <!-- ============================================================
       ANNOUNCEMENT BAR (greptile pattern — mint bg, single line)
       ============================================================ -->
  <div
    v-if="showAnnouncement"
    class="relative z-50 border-b border-accent/30 bg-accent text-text"
  >
    <Container class="flex h-9 items-center justify-center gap-3 text-[12px] sm:text-[13px]">
      <span class="font-mono uppercase tracking-[0.18em] text-text/70">New</span>
      <span class="hidden h-3 w-px bg-text/20 sm:block" />
      <span class="font-medium">
        <span class="hidden sm:inline">Now booking Q3 2026 — </span>cell commissioning in
        <span class="font-bold">under 6 weeks</span>.
      </span>
      <NuxtLink
        to="/contact"
        class="inline-flex items-center gap-1 font-semibold underline-offset-2 hover:underline"
      >
        Book a call
        <span aria-hidden="true">→</span>
      </NuxtLink>
      <button
        type="button"
        class="absolute right-3 top-1/2 -translate-y-1/2 grid h-6 w-6 place-items-center rounded-full text-text/60 hover:bg-text/10"
        aria-label="Dismiss announcement"
        @click="showAnnouncement = false"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path d="M1 1 L9 9 M9 1 L1 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </button>
    </Container>
  </div>

  <!-- ============================================================
       HEADER
       ============================================================ -->
  <header
    class="sticky top-0 z-40 w-full border-b border-border/60 bg-bg/85 backdrop-blur-xl supports-[backdrop-filter]:bg-bg/70 transition-shadow"
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
              class="inline-flex h-9 items-center gap-1.5 rounded-full px-3 font-mono text-[11px] uppercase tracking-[0.14em] text-text-secondary transition-all hover:bg-accent/25 hover:text-text"
            >
              <span>{{ entry.label }}</span>
              <span
                v-if="(entry as NavLink).badge"
                class="rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-bold text-paper"
              >
                {{ (entry as NavLink).badge }}
              </span>
            </NuxtLink>

            <!-- Dropdown trigger -->
            <button
              v-else
              :id="`trigger-${entry.key}`"
              type="button"
              :aria-expanded="active === entry.key"
              aria-haspopup="true"
              :aria-controls="`panel-${entry.key}`"
              :class="[
                'inline-flex h-9 items-center gap-1.5 rounded-full px-3 font-mono text-[11px] uppercase tracking-[0.14em] transition-all',
                active === entry.key
                  ? 'bg-accent text-text'
                  : 'text-text-secondary hover:bg-accent/25 hover:text-text',
              ]"
              @click="toggleClick(entry.key, $event)"
            >
              <span>{{ entry.label }}</span>
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
        class="ml-auto grid h-9 w-9 place-items-center rounded-full border border-border lg:hidden"
        :aria-label="mobileOpen ? 'Close menu' : 'Open menu'"
        :aria-expanded="mobileOpen"
        data-mobile-trigger
        @click.stop="mobileOpen = !mobileOpen"
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

    <!-- ============================================================
         MEGA PANELS (desktop) — full-width, greptile-style
         ============================================================ -->
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
          <!-- ====== CARDS layout (Features) ====== -->
          <div v-if="entry.layout === 'cards' && entry.key === 'features'">
            <div class="mb-5 flex items-baseline justify-between">
              <p class="font-mono text-[10px] uppercase tracking-[0.18em] text-text-secondary">
                {{ (entry as NavDrop).panelTitle }}
              </p>
              <NuxtLink
                v-if="(entry as NavDrop).panelLink"
                :to="(entry as NavDrop).panelLink!.to"
                class="font-mono text-[11px] uppercase tracking-[0.14em] text-text-secondary hover:text-primary"
                @click="closeNow"
              >
                {{ (entry as NavDrop).panelLink!.label }} →
              </NuxtLink>
            </div>
            <ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <li v-for="card in featuresData.features" :key="card.label">
                <NuxtLink
                  :to="card.href"
                  @click="closeNow"
                  class="group flex h-full flex-col overflow-hidden rounded-2xl border border-dashed border-border bg-bg transition-all hover:border-primary/40 hover:shadow-[var(--shadow-lg)]"
                >
                  <!-- thumbnail (16:9) -->
                  <div class="relative aspect-[16/9] w-full overflow-hidden bg-surface-2 halftone-bg">
                    <div class="absolute inset-0 grid place-items-center">
                      <div class="h-3/5 w-3/5 transition-transform duration-500 group-hover:scale-105">
                        <RobotMascot :variant="card.thumb === 'cell-design' || card.thumb === 'programming' || card.thumb === 'eoat' ? 'arm' : (card.thumb === 'vision' ? 'head' : 'arm')" />
                      </div>
                    </div>
                    <span
                      v-if="card.badge"
                      class="absolute left-3 top-3 rounded-full bg-bg/90 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-primary backdrop-blur"
                    >
                      {{ card.badge }}
                    </span>
                  </div>
                  <!-- text -->
                  <div class="flex flex-1 flex-col gap-1.5 p-4">
                    <div class="flex items-center justify-between gap-2">
                      <h3 class="text-sm font-bold tracking-tight text-text group-hover:text-primary">
                        {{ card.label }}
                      </h3>
                      <span
                        class="text-text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                        aria-hidden="true"
      >→</span>
                    </div>
                    <p class="text-xs leading-relaxed text-text-secondary">{{ card.desc }}</p>
                  </div>
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- ====== LIST layout (Resources) ====== -->
          <div v-else-if="entry.layout === 'list' && entry.key === 'resources'">
            <div class="mb-5 flex items-baseline justify-between">
              <p class="font-mono text-[10px] uppercase tracking-[0.18em] text-text-secondary">
                {{ (entry as NavDrop).panelTitle }}
              </p>
              <NuxtLink
                v-if="(entry as NavDrop).panelLink"
                :to="(entry as NavDrop).panelLink!.to"
                class="font-mono text-[11px] uppercase tracking-[0.14em] text-text-secondary hover:text-primary"
                @click="closeNow"
              >
                {{ (entry as NavDrop).panelLink!.label }} →
              </NuxtLink>
            </div>
            <ul class="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
              <li v-for="r in resourcesData.resources" :key="r.to">
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
                      <span class="text-sm font-semibold text-text group-hover:text-primary">
                        {{ r.label }}
                      </span>
                      <span
                        class="text-text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                        aria-hidden="true"
      >→</span>
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

    <!-- ============================================================
         MOBILE DRAWER
         ============================================================ -->
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
                <li v-for="card in featuresData.features" :key="`mf-${card.label}`" v-if="entry.key === 'features'">
                  <NuxtLink
                    :to="card.href"
                    class="flex items-center gap-2 py-2 text-sm text-text-secondary"
                    @click="mobileOpen = false"
                  >
                    <span class="font-medium">{{ card.label }}</span>
                  </NuxtLink>
                </li>
                <li v-for="r in resourcesData.resources" :key="`mr-${r.to}`" v-if="entry.key === 'resources'">
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
