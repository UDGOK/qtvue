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
  key: 'platforms' | 'services'
  layout: 'cards' | 'list'
  icon?: string
  /** title shown in the panel header */
  panelTitle?: string
  /** right-side link in the panel header */
  panelLink?: { label: string; to: string }
}
type MenuEntry = NavLink | NavDrop

const menu: MenuEntry[] = [
  {
    type: 'dropdown',
    label: 'Platforms',
    key: 'platforms',
    layout: 'cards',
    icon: 'Cpu',
    panelTitle: 'The Unitree range',
    panelLink: { label: 'Compare all platforms', to: '/platforms' },
  },
  {
    type: 'dropdown',
    label: 'Services',
    key: 'services',
    layout: 'list',
    icon: 'Wrench',
    panelTitle: 'How we can help',
    panelLink: { label: 'See the full stack', to: '/services' },
  },
  { type: 'link', label: 'How it works', to: '/how-it-works', icon: 'ListChecks' },
  { type: 'link', label: 'Pricing',     to: '/pricing',      icon: 'Tag' },
  { type: 'link', label: 'About',       to: '/about',         icon: 'User' },
]

/* ============================================================
   Dropdown content (real robotics content for qtvue)
   ============================================================ */

interface PlatformCard {
  label: string
  desc: string
  href: string
  badge?: string
  /** form-factor category for the icon tile: 'quadruped' | 'humanoid' | 'arm' | 'teleop' */
  thumb?: 'quadruped' | 'humanoid' | 'arm' | 'teleop'
  /** short price string, rendered as monospace badge (e.g. '~$13.5k') */
  price?: string
}
interface ServiceLine {
  label: string
  desc: string
  to: string
  icon: string
}

/**
 * Per the v2 brief: nav is exactly 5 items.
 *   Platforms  (dropdown, cards) — the 8 Unitree platforms
 *   Services   (dropdown, list)  — Sell, Program, Integrate, Security
 *   How it works
 *   About
 *   [Submit your use case]   (the single accent CTA)
 *
 * Each platform card has:
 *   icon    — Lucide icon name that visually communicates form factor
 *             (quadruped, humanoid, arm, teleop rig, etc.)
 *   shape   — SVG silhouette category used by the icon tile bg
 *             ('quadruped', 'humanoid', 'arm', 'teleop') — distinct
 *             halftone pattern per category so the user can scan
 *             form factors at a glance.
 *   price   — short price string rendered as monospace badge
 *   desc    — one-line description
 *   href    — target page
 *   badge   — optional label (Workhorse, Industrial, Pro, New)
 */

const platformsData: Record<'platforms', PlatformCard[]> = {
  platforms: [
    { label: 'Go2',     desc: '4D LiDAR quadruped, ~15 kg, IP67. Workhorse.',  href: '/platforms/go2',  thumb: 'quadruped', badge: 'Workhorse',   price: '~$1.6k' },
    { label: 'B2',      desc: 'Industrial quadruped. 40 kg payload, all-terrain.', href: '/platforms/b2',   thumb: 'quadruped', badge: 'Industrial',  price: '~$100k' },
    { label: 'G1',      desc: '23–43 DoF humanoid with dexterous hands. Indoor R&D.', href: '/platforms/g1',   thumb: 'humanoid',                                     price: '~$13.5–16k' },
    { label: 'R1',      desc: 'Lightweight, developer-friendly humanoid. STEM/HRI.', href: '/platforms/r1',   thumb: 'humanoid',                                     price: '~$4.3–4.9k' },
    { label: 'H1',      desc: 'Full-size, 1.78 m, 3.7 m/s — fastest production humanoid.', href: '/platforms/h1',   thumb: 'humanoid', badge: 'Pro',          price: '~$90k+' },
    { label: 'H2',      desc: 'Refined full-size: unified compute, stronger arms.',      href: '/platforms/h2',   thumb: 'humanoid', badge: 'New',          price: '~$30k' },
    { label: 'G1-D',    desc: 'Dual-arm teleop rig, <100 ms latency. For embodied-AI.',  href: '/platforms/g1-d', thumb: 'teleop',                                       price: 'Contact' },
    { label: 'Arms',    desc: '6+ DoF manipulators (Z1) for cells and benchtop.',       href: '/platforms/arms', thumb: 'arm',                                          price: '~$16k' },
  ],
}

const servicesData: Record<'services', ServiceLine[]> = {
  services: [
    { label: 'Sell',                    desc: 'Source the right Unitree platform, configured for your application.', to: '/services/sell',      icon: 'Package' },
    { label: 'Program',                 desc: 'Write the SDK / ROS 2 / Isaac Lab code that makes it do the job.',     to: '/services/program',   icon: 'Code2' },
    { label: 'Integrate',               desc: 'End-to-end integration: hardware, networking, perception, training.',  to: '/services/integrate', icon: 'Wrench' },
    { label: 'Security & Hardening',    desc: 'Post-UniPwn (2025): firmware verify, network isolation, fleet policy.', to: '/services/security',   icon: 'Shield' },
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
       When a "now" status exists, it preempts the pre-launch copy
       (but the Submit CTA stays). The pill is a self-contained
       NowPill component that fetches /now.json client-side.
       ============================================================ -->
  <div
    v-if="showAnnouncement"
    class="relative z-50 border-b border-accent/30 bg-accent text-text"
  >
    <Container class="flex h-9 flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[12px] sm:text-[13px]">
      <!-- Pre-launch CTA (always) -->
      <span class="font-mono uppercase tracking-[0.18em] text-text/70">Pre-launch</span>
      <span class="hidden h-3 w-px bg-text/20 sm:block" />
      <NuxtLink
        to="/intake"
        class="inline-flex items-center gap-1 font-medium underline-offset-2 hover:underline"
      >
        Submit your use case
        <span aria-hidden="true">→</span>
      </NuxtLink>

      <!-- Now status (dynamic, hides itself if no current entry) -->
      <span v-if="$slots.now" class="hidden h-3 w-px bg-text/20 sm:block" />
      <slot name="now" />

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
              class="inline-flex h-9 items-center gap-1.5 rounded-none px-3 font-mono text-[11px] uppercase tracking-[0.14em] text-text-secondary transition-all hover:bg-accent/25 hover:text-text"
            >
              <span>{{ entry.label }}</span>
              <span
                v-if="(entry as NavLink).badge"
                class="rounded-none bg-primary px-1.5 py-0.5 text-[9px] font-bold text-paper"
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
                'inline-flex h-9 items-center gap-1.5 rounded-none px-3 font-mono text-[11px] uppercase tracking-[0.14em] transition-all',
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

      <!-- ============= RIGHT: theme + single CTA per brief ============= -->
      <div class="ml-auto hidden items-center gap-2 lg:flex">
        <ThemeToggle class="h-9 w-9" />
        <NuxtLink
          to="/intake"
          class="group relative inline-flex items-center justify-center font-semibold uppercase tracking-[0.12em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg whitespace-nowrap h-10 px-5 text-xs bg-primary text-[#faf6ec] hover:bg-primary-600 shadow-sm hover:shadow-[var(--shadow-glow)]"
          style="clip-path:polygon(0 0, calc(100% - 13px) 0, 100% 50%, calc(100% - 13px) 100%, 0 100%, 13px 50%);"
        >
          <span class="pl-3 sm:pl-4">Submit your use case</span>
        </NuxtLink>
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
          <!-- ====== CARDS layout (Platforms) — compact 2-col grid ====== -->
          <!--
            Each card has a 56px icon tile (distinct per form factor:
            quadruped / humanoid / arm / teleop), name + price row,
            one-line description. No 16:9 SVG thumbnails — those made
            the panel 1092px tall and showed identical mascots for
            every platform. Compact list fits 8 platforms in ~340px.
          -->
          <div v-if="entry.layout === 'cards' && entry.key === 'platforms'">
            <div class="mb-4 flex items-baseline justify-between">
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
            <ul class="grid gap-1.5 sm:grid-cols-2">
              <li v-for="card in platformsData.platforms" :key="card.label">
                <NuxtLink
                  :to="card.href"
                  @click="closeNow"
                  class="group flex items-center gap-3 rounded-none p-2.5 transition-all hover:bg-surface"
                >
                  <!-- icon tile — distinct per form factor -->
                  <div
                    :class="[
                      'grid h-12 w-12 shrink-0 place-items-center rounded-none border border-dashed border-border halftone-bg transition-colors',
                      card.thumb === 'quadruped' && 'bg-surface-2 text-primary group-hover:bg-primary-50',
                      card.thumb === 'humanoid' && 'bg-surface-2 text-primary group-hover:bg-primary-50',
                      card.thumb === 'arm' && 'bg-surface-2 text-primary group-hover:bg-primary-50',
                      card.thumb === 'teleop' && 'bg-surface-2 text-primary group-hover:bg-primary-50',
                    ]"
                    aria-hidden="true"
                  >
                    <Icon
                      :name="
                        card.thumb === 'quadruped' ? 'PawPrint' :
                        card.thumb === 'humanoid' ? 'PersonStanding' :
                        card.thumb === 'arm' ? 'Cable' :
                        card.thumb === 'teleop' ? 'Gamepad2' :
                        'Bot'
                      "
                      :size="22"
                    />
                  </div>
                  <!-- text -->
                  <div class="flex flex-1 flex-col gap-0.5 min-w-0">
                    <div class="flex items-baseline justify-between gap-2">
                      <h3 class="text-sm font-bold tracking-tight text-text group-hover:text-primary truncate">
                        Unitree {{ card.label }}
                      </h3>
                      <span
                        v-if="card.price"
                        class="shrink-0 font-mono text-[10px] uppercase tracking-widest text-text-muted"
                      >
                        {{ card.price }}
                      </span>
                    </div>
                    <p class="text-xs leading-snug text-text-secondary line-clamp-1">{{ card.desc }}</p>
                  </div>
                  <span
                    v-if="card.badge"
                    class="shrink-0 rounded-none bg-primary/10 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-widest text-primary"
                  >
                    {{ card.badge }}
                  </span>
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- ====== LIST layout (Services) ====== -->
          <div v-else-if="entry.layout === 'list' && entry.key === 'services'">
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
              <li v-for="r in servicesData.services" :key="r.to">
                <NuxtLink
                  :to="r.to"
                  @click="closeNow"
                  class="group flex items-start gap-3 rounded-none p-3 transition-colors hover:bg-surface"
                >
                  <div class="grid h-9 w-9 shrink-0 place-items-center rounded-none bg-surface-2 text-text-secondary group-hover:bg-primary-50 group-hover:text-primary">
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
                <template v-if="entry.key === 'platforms'">
                  <li v-for="card in platformsData.platforms" :key="`mf-${card.label}`">
                    <NuxtLink
                      :to="card.href"
                      class="flex items-center gap-2 py-2 text-sm text-text-secondary"
                      @click="mobileOpen = false"
                    >
                      <Icon
                        :name="
                          card.thumb === 'quadruped' ? 'PawPrint' :
                          card.thumb === 'humanoid' ? 'PersonStanding' :
                          card.thumb === 'arm' ? 'Cable' :
                          card.thumb === 'teleop' ? 'Gamepad2' :
                          'Bot'
                        "
                        :size="14"
                      />
                      <span class="font-medium">Unitree {{ card.label }}</span>
                      <span
                        v-if="card.price"
                        class="ml-auto font-mono text-[10px] uppercase tracking-widest text-text-muted"
                      >
                        {{ card.price }}
                      </span>
                    </NuxtLink>
                  </li>
                </template>
                <template v-else-if="entry.key === 'services'">
                  <li v-for="r in servicesData.services" :key="`mr-${r.to}`">
                    <NuxtLink
                      :to="r.to"
                      class="flex items-center gap-2 py-2 text-sm text-text-secondary"
                      @click="mobileOpen = false"
                    >
                      <Icon :name="r.icon" :size="14" />
                      {{ r.label }}
                    </NuxtLink>
                  </li>
                </template>
              </ul>
            </div>
          </li>
        </ul>

        <div class="my-2 h-px bg-border" />

        <div class="flex items-center justify-between">
          <span class="font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted">Theme</span>
          <ThemeToggle class="h-8 w-8" />
        </div>

        <div class="grid grid-cols-1 gap-2">
          <NuxtLink
            to="/intake"
            @click="mobileOpen = false"
            class="inline-flex h-10 items-center justify-center rounded-none bg-primary font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-bg"
          >
            Submit your use case
          </NuxtLink>
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
