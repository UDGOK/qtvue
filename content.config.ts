import { defineCollection, defineContentConfig } from '@nuxt/content'
import {
  workSchema,
  serviceSchema,
  industrySchema,
  blogSchema,
  careerSchema,
  featureSchema,
} from './app/content.schemas'

export default defineContentConfig({
  collections: {
    services: defineCollection({
      type: 'page',
      source: 'en/services/**/*.md',
      schema: serviceSchema,
    }),
    industries: defineCollection({
      type: 'page',
      source: 'en/industries/**/*.md',
      schema: industrySchema,
    }),
    work: defineCollection({
      type: 'page',
      source: 'en/work/**/*.md',
      schema: workSchema,
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
    features: defineCollection({
      type: 'page',
      source: 'en/features/**/*.md',
      schema: featureSchema,
    }),
  },
})
