import { z } from 'zod'

export const workSchema = z.object({
  title: z.string(),
  summary: z.string(),
  client: z.string().optional(),
  industry: z.string(),
  services: z.array(z.string()),
  year: z.number(),
  metrics: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
  image: z.string(),
  gallery: z.array(z.string()).optional(),
  featured: z.boolean().default(false),
})

export const serviceSchema = z.object({
  title: z.string(),
  summary: z.string(),
  icon: z.string().default('Cog'),
  order: z.number().default(0),
})

export const industrySchema = z.object({
  title: z.string(),
  summary: z.string(),
  image: z.string().optional(),
  order: z.number().default(0),
})

export const blogSchema = z.object({
  title: z.string(),
  summary: z.string(),
  date: z.string(),
  author: z.string().default('qtvue'),
  tags: z.array(z.string()).default([]),
  image: z.string().optional(),
})

export const careerSchema = z.object({
  title: z.string(),
  summary: z.string(),
  location: z.string().default('Remote'),
  type: z.string().default('Full-time'),
  department: z.string().optional(),
})

export const featureSchema = z.object({
  title: z.string(),
  summary: z.string(),
  icon: z.string().default('Sparkles'),
  thumb: z.string().optional(),
  badge: z.string().optional(),
  capabilities: z.array(z.string()).default([]),
  brands: z.array(z.string()).default([]),
  metrics: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
  order: z.number().default(0),
})

/**
 * FAQ schema — one markdown file per topic (cell-design, programming, vision…).
 * Questions/answers are explicit JSON so the rendered page AND the
 * application/ld+json schema.org FAQPage markup stay in lockstep.
 */
export const faqSchema = z.object({
  title: z.string(),
  summary: z.string(),
  /** matching route slug, e.g. "cell-design" → /faq/cell-design */
  slug: z.string(),
  /** the primary parent page this FAQ relates to, for the 'back to' link */
  parent: z.string().optional(),
  /** short label shown in the hub page card, e.g. "Cell Design" */
  topic: z.string(),
  /** one-line description used in schema.org and <meta> tags */
  description: z.string(),
  order: z.number().default(0),
  questions: z.array(
    z.object({
      q: z.string(),
      a: z.string(),
    }),
  ),
})
