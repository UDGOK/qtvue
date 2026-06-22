import { ref, onMounted, onBeforeUnmount } from 'vue'

/**
 * Theme composable.
 *
 * Why this is bulletproof:
 *  - The actual source of truth is the `dark` class on <html>. We never
 *    trust a cached `isDark` ref over what the DOM says.
 *  - The FOUC script in nuxt.config.ts sets the class BEFORE Vue hydrates,
 *    so the first paint is always correct. The composable then reconciles
 *    the reactive ref with the DOM state.
 *  - We listen to system-preference changes so the theme follows the OS
 *    when the user hasn't explicitly picked one.
 *  - All storage / DOM access is wrapped in try/catch so a blocked
 *    localStorage or missing document never throws.
 *  - A single shared module-level `isDark` ref keeps every consumer in
 *    sync, but we also re-read from the DOM on each `useTheme()` call
 *    so the ref is always authoritative.
 */

// Module-level shared state.
const isDark = ref(false)
let initialized = false
let mediaQuery: MediaQueryList | null = null
let onSystemChange: ((e: MediaQueryListEvent) => void) | null = null

function isBrowser() {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

function readDomState(): boolean {
  if (!isBrowser()) return false
  return document.documentElement.classList.contains('dark')
}

function readStoredPreference(): boolean | null {
  if (!isBrowser()) return null
  try {
    const stored = localStorage.getItem('theme')
    if (stored === 'dark') return true
    if (stored === 'light') return false
  } catch {
    /* localStorage may be blocked */
  }
  return null
}

function readSystemPreference(): boolean {
  if (!isBrowser() || !window.matchMedia) return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function applyToDom(dark: boolean) {
  if (!isBrowser()) return
  document.documentElement.classList.toggle('dark', dark)
}

function persist(dark: boolean) {
  if (!isBrowser()) return
  try {
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  } catch {
    /* localStorage may be blocked — toggle still works for the session */
  }
  applyToDom(dark)
}

function syncFromStorage() {
  // Priority: explicit storage > system preference > current DOM state.
  const stored = readStoredPreference()
  const next = stored !== null ? stored : readSystemPreference()
  isDark.value = next
  applyToDom(next)
  return next
}

export function useTheme() {
  if (!initialized && isBrowser()) {
    initialized = true
    // Reconcile on first call (post-hydration).
    syncFromStorage()

    // Follow OS changes only when the user hasn't picked explicitly.
    if (window.matchMedia) {
      mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      onSystemChange = (e: MediaQueryListEvent) => {
        if (readStoredPreference() === null) {
          isDark.value = e.matches
          applyToDom(e.matches)
        }
      }
      // addEventListener is the modern API; addListener is the legacy one.
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', onSystemChange)
      } else {
        // @ts-expect-error legacy Safari
        mediaQuery.addListener(onSystemChange)
      }
    }
  }

  // Always re-read on each call so the ref is in sync with reality.
  if (isBrowser()) {
    const dom = readDomState()
    isDark.value = dom
  }

  const toggle = () => {
    const next = !isDark.value
    isDark.value = next
    persist(next)
  }

  const set = (v: boolean) => {
    isDark.value = v
    persist(v)
  }

  return { isDark, toggle, set }
}

/**
 * Lifecycle helper for the ThemeToggle component. Auto-cleans up the
 * system-preference listener on unmount.
 */
export function useThemeWithLifecycle() {
  const theme = useTheme()
  onMounted(() => {
    if (!isBrowser()) return
    // One more sync after mount in case the FOUC script set the class
    // but our ref is stale.
    const dom = readDomState()
    if (dom !== theme.isDark.value) theme.isDark.value = dom
  })
  onBeforeUnmount(() => {
    if (mediaQuery && onSystemChange) {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', onSystemChange)
      }
      // @ts-expect-error legacy Safari
      else if (mediaQuery.removeListener) {
        mediaQuery.removeListener(onSystemChange)
      }
    }
  })
  return theme
}
