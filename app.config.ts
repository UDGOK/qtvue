// Runtime site-wide configuration (non-translatable data).
// Translatable UI strings live in i18n/locales/*.json; this is for values
// like the contact email that don't get translated.
export default defineAppConfig({
  site: {
    name: 'qtvue',
    url: 'https://qtvue.com',
    description:
      'Robotics integration, programming, sales, and consulting for industrial operations.',
    contactEmail: 'hello@qtvue.com',
    defaultOgImage: '/og-default.png',
  },
})
