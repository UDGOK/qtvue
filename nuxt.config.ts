// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-06-21',
  devtools: { enabled: true },

  modules: ['@nuxt/content', '@nuxtjs/seo', '@nuxtjs/i18n', '@nuxt/image'],

  // Site config drives @nuxtjs/seo (sitemap, canonical URLs, OG defaults).
  site: {
    url: 'https://qtvue.com',
    name: 'qtvue',
  },

  seo: {
    redirectToCanonicalSiteUrl: true,
  },

  css: ['~/assets/css/main.css'],

  // Register components by filename only (no directory prefix) so
  // <Container>, <TheHeader>, <Logo> resolve regardless of which
  // subfolder of app/components/ they live in.
  components: [{ path: '~/components', pathPrefix: false }],

  // i18n: prefix_except_default means English is served at '/' (no /en/ prefix),
  // and any future locale (e.g. 'es') is served at '/es/'. Add a locale here
  // + a translation file to enable a new language with zero refactor.
  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'en',
    locales: [{ code: 'en', language: 'en-US', name: 'English', file: 'en.json' }],
    bundle: { optimizeTranslationDirective: false },
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  // Rendering strategy ("2030-ready, dynamic on same pages"):
  // Pre-render all routes at build time today (fast, cheap, perfect SEO).
  // Flip a specific route to { ssr: true } later (e.g. /portal/**, /quote)
  // to make it dynamic with zero migration — marketing pages stay static.
  routeRules: {
    // No caching on HTML — the theme toggle is client-side and we never
    // want Vercel or any browser cache to serve a stale bundle.
    '/**': {
      prerender: true,
      headers: { 'Cache-Control': 'public, max-age=0, must-revalidate' },
    },
    // Reserved for Spec 2 / future:
    // '/portal/**': { ssr: true },
    // '/quote': { ssr: true },
  },

  nitro: {
    // Vercel preset — Vercel auto-detects Nuxt, but setting the preset
    // explicitly ensures correct build output for the platform.
    preset: 'vercel',
    prerender: {
      crawlLinks: true,
      routes: ['/', '/sitemap.xml', '/robots.txt'],
    },
  },

  future: {
    compatibilityVersion: 4,
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en', translate: 'no' },
      meta: [
        // Disable Google auto-translate (see translate="no" above for why).
        { name: 'google', content: 'notranslate' },
        // Aggressively bust browser HTML cache. Without this, browsers can
        // hold onto an old index.html that references old hashed JS bundles,
        // which is exactly the "click does nothing, but refresh works"
        // failure mode. With these metas the browser revalidates every
        // page load so it always pulls the latest HTML and therefore the
        // latest JS hash.
        { 'http-equiv': 'Cache-Control', content: 'no-cache, no-store, must-revalidate' },
        { 'http-equiv': 'Pragma', content: 'no-cache' },
        { 'http-equiv': 'Expires', content: '0' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
      script: [
        // Build-version guard. Bumps BUILD_VERSION on every deploy.
        // The script compares localStorage.qtvue_build to the embedded
        // value; if they differ, the user is on a stale cached page
        // (browser served an old HTML that references an old JS hash
        // with the broken WebGL cleanup) and we force a hard reload
        // to pull the fresh HTML + JS. This is the belt-and-braces to
        // the http-equiv no-cache meta tags above.
        //
        // IMPORTANT: bump this string every single deploy. If you
        // don't, existing users whose localStorage already matches
        // the prior string will skip the guard and stay on whatever
        // stale cache their browser is holding.
        {
          innerHTML:
            "(function(){var V='qtvue_build_2026_06_22_v2_force_reload';try{var s=localStorage.getItem('qtvue_build');if(s&&s!==V){localStorage.setItem('qtvue_build',V);location.reload();return}localStorage.setItem('qtvue_build',V)}catch(e){}})();",
          tagPosition: 'head',
        },
        {
          // No-FOUC theme bootstrap. Runs synchronously in <head> so
          // the very first paint is already in the correct theme. This
          // is the source of truth for the first frame; the Vue
          // composable reconciles after hydration and follows the OS
          // preference from there on.
          innerHTML:
            "(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(t===null&&typeof matchMedia!=='undefined'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);if(t===null){try{localStorage.setItem('theme',d?'dark':'light')}catch(e){}}}catch(e){}})();",
          tagPosition: 'head',
        },
      ],
    },
  },
})
