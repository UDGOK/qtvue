/**
 * useNow — fetches the live "now" status from /public/now.json.
 *
 * Architecture:
 *   - /public/now.json is a static JSON file in the repo
 *   - It's served by Vercel as a regular static asset
 *   - When the user runs `now.sh "text" mood` from their PC,
 *     the script updates the file, commits, and pushes
 *   - Vercel auto-deploys in ~30s
 *   - The composable fetches /now.json client-side so updates
 *     appear instantly without a hard refresh
 *
 * Why client-side and not useAsyncData SSR?
 *   - If we read at SSR/build time, every change needs a full
 *     Vercel redeploy AND a hard refresh on the client. Client-
 *     side fetch gives instant updates with no deploy needed
 *     (the file just needs to be deployed, which happens auto).
 *   - Cache headers on /now.json: 60s browser cache + 5min CDN
 *     cache. Fresh updates appear within 5min on the average
 *     visitor; on hard refresh within 60s.
 *
 * The composable returns a reactive ref so components can
 * reactively render the pill / feed.
 */

export interface NowEntry {
  id: string
  text: string
  mood: 'shipping' | 'thinking' | 'investigating' | 'shipping-fast' | 'live' | 'reading' | string
  category: string
  link: string | null
  postedAt: string
  expiresAt?: string
}

export interface NowData {
  version: number
  updated: string
  current: NowEntry | null
  recent: NowEntry[]
}

const EMPTY: NowData = {
  version: 1,
  updated: '',
  current: null,
  recent: [],
}

// Module-level cache so multiple components don't re-fetch
let _cache: { data: NowData; fetchedAt: number } | null = null
const CACHE_MS = 60_000 // 60s in-memory cache

export const useNow = () => {
  // useState makes the result reactive across components without
  // re-fetching on each useNow() call.
  const data = useState<NowData>('qtvue-now', () => EMPTY)
  const loaded = useState<boolean>('qtvue-now-loaded', () => false)

  async function refresh(force = false) {
    if (!force && loaded.value && _cache && Date.now() - _cache.fetchedAt < CACHE_MS) {
      return _cache.data
    }
    try {
      const res = await $fetch<NowData>('/now.json', {
        // Let the browser cache /now.json normally; this only
        // forces a fetch on cold load.
        headers: { Accept: 'application/json' },
      })
      data.value = res
      loaded.value = true
      _cache = { data: res, fetchedAt: Date.now() }
      return res
    } catch {
      // File missing or malformed — fall back to empty so the
      // pill doesn't render.
      data.value = EMPTY
      loaded.value = true
      _cache = { data: EMPTY, fetchedAt: Date.now() }
      return EMPTY
    }
  }

  // Auto-refresh once on first call (client only).
  if (import.meta.client && !loaded.value) {
    refresh()
  }

  // Friendly computed helpers used by templates
  const hasCurrent = computed(() => !!data.value?.current)
  const currentText = computed(() => data.value?.current?.text ?? '')
  const currentMood = computed(() => data.value?.current?.mood ?? '')
  const currentLink = computed(() => data.value?.current?.link ?? null)
  const recent = computed(() => data.value?.recent ?? [])
  const updated = computed(() => data.value?.updated ?? '')

  return {
    data,
    loaded,
    refresh,
    hasCurrent,
    currentText,
    currentMood,
    currentLink,
    recent,
    updated,
  }
}