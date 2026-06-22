import { defineCollection, defineContentConfig } from '@nuxt/content'
import {
  serviceSchema,
  blogSchema,
  careerSchema,
  faqSchema,
  platformSchema,
} from './app/content.schemas'

export default defineContentConfig({
  collections: {
    services: defineCollection({
      type: 'page',
      source: 'en/services/**/*.md',
      schema: serviceSchema,
    }),
    blog: defineCollection({
      type: 'page',
      source: 'en/blog/**/*.md',
      schema: blogSchema,
    }),
    careers: defineCollection({
      type: 'page',
      source: 'en/careers/**/*.md',
      schema: careerSchema,
    }),
    faqs: defineCollection({
      type: 'page',
      source: 'en/faq/**/*.md',
      schema: faqSchema,
    }),
    platforms: defineCollection({
      type: 'page',
      source: 'en/platforms/**/*.md',
      schema: platformSchema,
    }),
  },
})
