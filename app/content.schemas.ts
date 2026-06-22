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
  /** short label for cards, e.g. "01 — Sell" */
  label: z.string().optional(),
  icon: z.string().default('Cog'),
  order: z.number().default(0),
  /** body markdown for the detail page */
  body: z.string().optional(),
  /** list of what's in scope */
  inScope: z.array(z.string()).default([]),
  /** list of what's not in scope */
  notInScope: z.array(z.string()).default([]),
  /** code snippet shown on the detail page */
  codeLanguage: z.string().default('python'),
  codeFilename: z.string().default('example.py'),
  codeSnippet: z.string().optional(),
  cta: z.object({ label: z.string(), to: z.string() }).optional(),
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
export const platformSchema = z.object({
  title: z.string(),
  summary: z.string(),
  slug: z.string(),
  type: z.string(),                    // "Quadruped" | "Humanoid" | "Manipulator" | "Industrial quadruped" | "Data/training platform"
  priceFrom: z.string(),                // "~$1,600 (Air)"
  whoItsFor: z.string(),
  oneLiner: z.string(),                 // short tagline for cards
  payload: z.string().optional(),       // "15 kg", "40 kg+", ""
  dof: z.string().optional(),           // "12 DoF", "23 base / up to 43"
  ipRating: z.string().optional(),      // "IP67", "indoor only"
  useCases: z.array(z.string()).default([]),
  specs: z.array(z.object({ k: z.string(), v: z.string() })).default([]),
  codeSnippet: z.string().optional(),   // a real SDK / ROS 2 snippet
  codeLanguage: z.string().default('python'),
  codeFilename: z.string().default('arm_control.py'),
  callouts: z.array(z.string()).default([]), // honest "marketing vs reality" notes
  /** Optional demo video. Path under /public, e.g. '/videos/g1-demo.mp4' */
  videoSrc: z.string().optional(),
  /** Poster image shown until the first frame paints. Path under /public. */
  videoPoster: z.string().optional(),
  /** Caption shown under the video (monospace, uppercase) */
  videoCaption: z.string().optional(),
  order: z.number().default(0),
})

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
