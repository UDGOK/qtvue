// Site-wide constants (non-translatable, non-secret).
// Kept as a plain typed module so it's explicit, tree-shakeable, and testable.
// Environment-specific values (API keys, etc.) belong in runtimeConfig, not here.
export const siteConfig = {
  name: 'qtvue',
  url: 'https://qtvue.com',
  description:
    'Robotics integration, programming, sales, and consulting for industrial operations.',
  contactEmail: 'hello@qtvue.com',
  defaultOgImage: '/og-default.svg',
} as const

export type SiteConfig = typeof siteConfig
