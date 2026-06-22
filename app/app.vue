<script setup lang="ts">
/**
 * app.vue — root component.
 *
 * What lives here, and why:
 *   1. Global SEO defaults (og:site_name, twitter card, etc.)
 *   2. Global Organization schema (JSON-LD) for knowledge graphs
 *      — used by Google, Bing, ChatGPT, Claude, Perplexity to
 *      populate their entity cards
 *   3. Global WebSite schema with SearchAction (sitelinks search)
 *   4. Default og-image / twitter-image
 *
 * Per-page schemas (Product, Service, FAQPage, Person, ContactPage,
 * Article) are added in each page via useSchemaOrg(). The defineXxx
 * helpers come from nuxt-schema-org auto-import.
 */

useSeoMeta({
  ogSiteName: 'qtvue',
  twitterCard: 'summary_large_image',
  ogImage: 'https://qtvue.com/og-default.svg',
  twitterImage: 'https://qtvue.com/og-default.svg',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: 'qtvue — Unitree robotics specialist',
  ogType: 'website',
  ogLocale: 'en_US',
  themeColor: '#0e5c3a',
  applicationName: 'qtvue',
  generator: 'Nuxt 4 + @nuxtjs/seo',
  author: 'qtvue',
  rating: 'general',
  referrer: 'strict-origin-when-cross-origin',
  formatDetection: 'telephone=no',
  // LLM / AI engine hints
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
})

useHead({
  // Inline link hints for AI engines that fetch the HTML
  link: [
    { rel: 'license', href: 'https://creativecommons.org/licenses/by/4.0/', title: 'CC BY 4.0' },
    { rel: 'alternate', type: 'text/plain', href: '/llms.txt', title: 'LLM site index' },
    { rel: 'alternate', type: 'text/plain', href: '/llms-full.txt', title: 'LLM full content' },
    { rel: 'author', href: '/about' },
  ],
  meta: [
    { name: 'google-site-verification', content: 'pQfR9qMQanrE2WZvCoxIwf-BOrVq911GdWbESGJ0q5U' },
    { name: 'msvalidate.01', content: '' /* Bing webmaster — leave empty until token issued */ },
  ],
})

// Organization schema — knowledge graph anchor for Google, Bing,
// every AI engine that maintains a business entity graph.
useSchemaOrg([
  defineOrganization({
    '@type': 'Organization',
    name: 'qtvue',
    legalName: 'qtvue',
    alternateName: ['qtvue.com', 'qtvue robotics'],
    url: 'https://qtvue.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://qtvue.com/favicon.svg',
      width: 512,
      height: 512,
      caption: 'qtvue logo',
    },
    image: 'https://qtvue.com/og-default.svg',
    description: 'Unitree robotics specialist — sell, program, integrate, and harden Unitree platforms (Go2, B2, G1, R1, H1, H2, G1-D, Arms). Pre-launch.',
    foundingDate: '2026',
    slogan: 'A practitioner, not a reseller.',
    areaServed: [
      { '@type': 'Country', name: 'United States' },
      { '@type': 'Country', name: 'Germany' },
      { '@type': 'Country', name: 'Japan' },
      { '@type': 'Country', name: 'Singapore' },
      { '@type': 'AdministrativeArea', name: 'Worldwide' },
    ],
    knowsAbout: [
      'Unitree robotics',
      'Humanoid robots',
      'Quadruped robots',
      'Robotics SDK',
      'ROS 2',
      'Isaac Lab',
      'LeRobot',
      'Robot security',
      'UniPwn 2025',
      'unitree_sdk2',
      'unitree_ros2',
      'UnifoLM-VLA-0',
    ],
    sameAs: [
      'https://github.com/UDGOK',
      'https://github.com/UDGOK/qtvue',
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        url: 'https://qtvue.com/intake',
        availableLanguage: ['English'],
        areaServed: 'Worldwide',
      },
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        url: 'https://github.com/UDGOK/qtvue/issues',
        availableLanguage: ['English'],
      },
      {
        '@type': 'ContactPoint',
        contactType: 'security',
        email: 'security@qtvue.com',
        url: 'https://github.com/UDGOK/qtvue/security/advisories/new',
        availableLanguage: ['English'],
      },
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
      addressLocality: 'Distributed',
    },
    identifier: 'qtvue.com',
    naics: '541512', // Computer Systems Design Services
    isicV4: '62.02', // Computer consultancy activities
  }),

  // WebSite schema — gives AI engines the site's canonical name,
  // description, and (via SearchAction) a search endpoint.
  defineWebSite({
    '@type': 'WebSite',
    name: 'qtvue',
    alternateName: 'qtvue.com — Unitree robotics specialist',
    url: 'https://qtvue.com',
    description: 'We sell, program, integrate, and harden Unitree robots for your exact use case. Go2, B2, G1, R1, H1, H2, G1-D, and Arms. Single intake form for sell / program / integrate / security engagements.',
    inLanguage: 'en-US',
    copyrightHolder: { '@type': 'Organization', name: 'qtvue' },
    copyrightYear: 2026,
    publisher: { '@type': 'Organization', name: 'qtvue', url: 'https://qtvue.com' },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://qtvue.com/faq?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
    isAccessibleForFree: true,
    usageInfo: 'https://creativecommons.org/licenses/by/4.0/',
  }),

  // Site Navigation Element — helps Googlebot understand your nav
  // and surface sitelinks for branded queries.
  {
    '@type': 'ItemList',
    name: 'Primary navigation',
    itemListElement: [
      { '@type': 'SiteNavigationElement', name: 'Platforms', url: 'https://qtvue.com/platforms' },
      { '@type': 'SiteNavigationElement', name: 'Services', url: 'https://qtvue.com/services' },
      { '@type': 'SiteNavigationElement', name: 'How it works', url: 'https://qtvue.com/how-it-works' },
      { '@type': 'SiteNavigationElement', name: 'About', url: 'https://qtvue.com/about' },
      { '@type': 'SiteNavigationElement', name: 'Submit your use case', url: 'https://qtvue.com/intake' },
    ],
  },
])
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>