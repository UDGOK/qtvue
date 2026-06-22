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
      htmlAttrs: { lang: 'en', translate: 'no', class: 'no-js' },
      meta: [
        // Prevent Google Translate from rewriting the DOM. Auto-translation
        // walks the text nodes and replaces them with <font> wrappers, which
        // breaks Vue's reactivity (class-based dark mode, v-show, hydration),
        // corrupts SVG geometry, and triggers the nextSibling crash we saw
        // when Google injected nodes mid-hydration.
        { name: 'google', content: 'notranslate' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
      script: [
        // Strip the .no-js class as soon as the script executes, so the
        // `.no-js .qtvue-reveal { opacity:1; transform:none }` fallback in
        // main.css only kicks in when JS is genuinely unavailable. This
        // runs BEFORE the theme bootstrap so the cascade order is correct.
        {
          innerHTML: "document.documentElement.classList.remove('no-js')",
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
