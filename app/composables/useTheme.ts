import { ref } from 'vue'

// Single shared reactive ref so all consumers stay in sync.
const isDark = ref(false)

function apply(dark: boolean) {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('dark', dark)
}

function persist(dark: boolean) {
  if (typeof window === 'undefined') return
  localStorage.setItem('theme', dark ? 'dark' : 'light')
  apply(dark)
}

function readStoredPreference(): boolean {
  if (typeof window === 'undefined') return false
  const stored = localStorage.getItem('theme')
  if (stored === 'dark' || stored === 'light') {
    return stored === 'dark'
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function useTheme() {
  // Re-read stored preference on every call so the composable reflects
  // the current storage state (useful in tests and after SSR hydration).
  isDark.value = readStoredPreference()
  apply(isDark.value)

  const toggle = () => {
    isDark.value = !isDark.value
    persist(isDark.value)
  }
  const set = (v: boolean) => {
    isDark.value = v
    persist(isDark.value)
  }
  return { isDark, toggle, set }
}
