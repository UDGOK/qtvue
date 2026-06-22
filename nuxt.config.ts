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
    '/**': { prerender: true },
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
      htmlAttrs: { lang: 'en' },
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
      script: [
        {
          // No-FOUC: apply stored/prefers-color-scheme dark class before paint.
          innerHTML:
            "(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();",
          tagPosition: 'head',
        },
      ],
    },
  },
})
