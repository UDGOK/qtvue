/**
 * /compare/* — data-driven head-to-head comparisons for buying-intent
 * SEO ("Unitree Go2 vs B2", "G1 vs H1", etc.).
 *
 * Source of truth: live platform pages in content/en/platforms/*.md.
 * Spec values were verified against those pages before commit:
 *
 *   go2.md  → priceFrom "~$1,600 (Air)" · payload "≈ 8 kg" · top speed 2.5 m/s
 *   b2.md   → priceFrom "~$100k" · payload "40 kg+ sustained" · top speed 1.6 m/s loaded
 *   g1.md   → priceFrom "~$13.5–16k (base)" · weight ≈ 35 kg · 23 DoF base
 *   r1.md   → priceFrom "~$4.3–4.9k" · height ~1.23 m
 *   h1.md   → priceFrom "~$90k+" · height 1.78 m · top speed ≈ 3.7 m/s · weight ≈ 47 kg
 *   h2.md   → priceFrom "~$30k base"
 *
 * B2 top speed: brief had "~6 m/s" but live page says "≈ 1.6 m/s (loaded)"
 * — we use the live page value (the source of truth).
 */

export interface SpecRow {
  label: string
  a: string
  b: string
  /** which side wins this row (visual emphasis) — 'a' / 'b' / 'tie' / undefined */
  winner?: 'a' | 'b' | 'tie'
}

export interface Comparison {
  slug: string
  /** display name for the "A" platform */
  a: string
  /** display name for the "B" platform */
  b: string
  /** route slug for the "A" platform page */
  aSlug: string
  /** route slug for the "B" platform page */
  bSlug: string
  /** title used for <title>, OG, twitter */
  title: string
  /** meta description + OG description */
  description: string
  /** short intro paragraph shown under the H1 */
  intro: string
  /** honest "pick A if… pick B if…" verdict shown after the table */
  verdict: string
  /** spec table rows */
  specs: SpecRow[]
  /** small label shown at the top of the page */
  eyebrow?: string
}

export const comparisons: Comparison[] = [
  {
    slug: 'go2-vs-b2',
    a: 'Unitree Go2',
    b: 'Unitree B2',
    aSlug: 'go2',
    bSlug: 'b2',
    title: 'Unitree Go2 vs B2 — which quadruped? (2026)',
    description:
      'Go2 (~$1.6k, ~15 kg, IP67) vs B2 (~$100k, 40 kg+ payload, industrial). Honest spec-by-spec comparison for real deployments.',
    intro:
      'Both are Unitree quadrupeds, but they are not in the same league — one is an accessible developer workhorse, the other an industrial payload platform at ~60× the price. Here is where each actually fits.',
    verdict:
      'Pick the Go2 for R&D, inspection, education, and light field work where ~15 kg and IP67 are enough. Pick the B2 only when you genuinely need 40 kg+ sustained payload, IP-rated industrial endurance, and have the budget to match.',
    specs: [
      { label: 'Price (approx)',     a: '~$1,600 (Air)',           b: '~$100,000',                          winner: 'a' },
      { label: 'Payload',             a: '≈ 8 kg (loadable)',       b: '40 kg+ sustained, 120 kg static max', winner: 'b' },
      { label: 'Weight',              a: '≈ 15 kg',                 b: '≈ 60 kg' },
      { label: 'Top speed',           a: '≈ 2.5 m/s',               b: '≈ 1.6 m/s (loaded)',                winner: 'a' },
      { label: 'Battery (active)',    a: '1–2 hr real, 5–10 standby', b: '4–6 hr under work',                 winner: 'b' },
      { label: 'Ingress protection',  a: 'IP67',                    b: 'IP-rated industrial',               winner: 'tie' },
      { label: 'Best for',            a: 'R&D, inspection, education', b: 'Industrial payload, all-terrain' },
      { label: 'SDK',                 a: 'unitree_sdk2',            b: 'unitree_sdk2',                       winner: 'tie' },
    ],
  },

  {
    slug: 'g1-vs-h1',
    a: 'Unitree G1',
    b: 'Unitree H1',
    aSlug: 'g1',
    bSlug: 'h1',
    title: 'Unitree G1 vs H1 — which humanoid? (2026)',
    description:
      'G1 (~$13.5–16k, 23–43 DoF, indoor R&D) vs H1 (~$90k+, 1.78 m, fastest production humanoid). Honest comparison for research and integration teams.',
    intro:
      'The G1 is a benchtop-to-lab humanoid; the H1 is a full-size, high-torque platform. The gap is size, speed, torque — and a 6× price step.',
    verdict:
      'Pick the G1 for indoor R&D, manipulation research, and HRI where its 23–43 DoF and dexterous hands shine — just plan around ~2 hr real battery and no IP rating. Pick the H1 when you need full human scale, ~3.7 m/s locomotion, and high torque, and can support a heavier, pricier platform.',
    specs: [
      { label: 'Price (approx)',     a: '~$13.5–16k (base/EDU)',    b: '~$90k+',                              winner: 'a' },
      { label: 'Height',              a: '~1.27 m',                 b: '1.78 m',                              winner: 'b' },
      { label: 'Weight',              a: '~35 kg (base)',           b: '~47 kg',                              winner: 'a' },
      { label: 'DoF',                 a: '23 base / up to 43 EDU',   b: 'High-DoF full-size',                  winner: 'b' },
      { label: 'Top speed',           a: 'Modest, indoor',          b: '~3.7 m/s (fastest production)',      winner: 'b' },
      { label: 'Battery (real)',      a: '~2 hr under load',        b: 'Platform-dependent' },
      { label: 'Environment',         a: 'Indoor only, no IP',      b: 'Full-size, higher torque',            winner: 'b' },
      { label: 'Best for',            a: 'Manipulation / HRI research', b: 'Locomotion, full-scale tasks' },
    ],
  },

  {
    slug: 'r1-vs-g1',
    a: 'Unitree R1',
    b: 'Unitree G1',
    aSlug: 'r1',
    bSlug: 'g1',
    title: 'Unitree R1 vs G1 — entry humanoid vs research humanoid (2026)',
    description:
      'R1 (~$4.3–4.9k, lightweight, developer-friendly) vs G1 (~$13.5–16k, 23–43 DoF, dexterous hands). Which entry point into Unitree humanoids?',
    intro:
      'Both are sub-$20k humanoids, but the R1 is an accessible entry/STEM platform and the G1 is a serious R&D platform with far more DoF and dexterous hands.',
    verdict:
      'Pick the R1 for education, HRI demos, and budget-constrained first projects. Step up to the G1 when you need real manipulation, more DoF, and a platform you can push toward deployment-grade research.',
    specs: [
      { label: 'Price (approx)',     a: '~$4.3–4.9k',              b: '~$13.5–16k',                          winner: 'a' },
      { label: 'Height',              a: '~1.23 m',                 b: '~1.27 m',                             winner: 'tie' },
      { label: 'Weight',              a: 'Lightweight (≈ 30 kg)',    b: '~35 kg (base)',                       winner: 'a' },
      { label: 'Dexterous hands',    a: 'Limited',                  b: 'Yes',                                 winner: 'b' },
      { label: 'DoF',                 a: 'Lower',                    b: '23–43',                               winner: 'b' },
      { label: 'Best for',            a: 'STEM, HRI, entry',         b: 'Manipulation R&D',                    winner: 'b' },
    ],
  },

  {
    slug: 'h1-vs-h2',
    a: 'Unitree H1',
    b: 'Unitree H2',
    aSlug: 'h1',
    bSlug: 'h2',
    title: 'Unitree H1 vs H2 — should you wait for H2? (2026)',
    description:
      'H1 / H1-2 (~$90k+) vs the new H2 (~$30k base): unified compute, stronger arms, longer battery. What changed and which to buy.',
    intro:
      'The H2 refines the H1-2 line: unified compute, stronger arms, longer battery — at a notably different price point. Here is the honest delta.',
    verdict:
      "If you need a proven full-size platform today and budget is secondary, the H1/H1-2 is shipping and fast. If you can align with the H2 timeline, the unified compute and stronger arms make it the better long-term integration target.",
    specs: [
      { label: 'Price (approx)',     a: '~$90k+',                   b: '~$30k base',                          winner: 'b' },
      { label: 'Compute',             a: 'Multi-unit',               b: 'Unified',                             winner: 'b' },
      { label: 'Arms',                a: 'Strong',                   b: 'Stronger',                            winner: 'b' },
      { label: 'Battery',             a: 'Baseline',                 b: 'Longer',                              winner: 'b' },
      { label: 'Top speed',           a: '~3.7 m/s',                 b: 'Full-size (lower top speed)' },
      { label: 'Maturity',            a: 'Shipping now',             b: 'Newer',                               winner: 'a' },
    ],
  },

  {
    slug: 'go2-vs-g1',
    a: 'Unitree Go2',
    b: 'Unitree G1',
    aSlug: 'go2',
    bSlug: 'g1',
    title: 'Unitree Go2 vs G1 — quadruped or humanoid for your use case? (2026)',
    description:
      'Go2 quadruped (~$1.6k, IP67, field-deployable) vs G1 humanoid (~$13.5–16k, indoor R&D). Different form factors — here is how to choose.',
    intro:
      'This is a form-factor decision, not a spec race. A quadruped and a humanoid solve different problems; the right answer is dictated by the task, not the price.',
    verdict:
      'Pick the Go2 for inspection, patrol, and field work where four legs, IP67, and low cost win. Pick the G1 when the task needs human-like manipulation, two arms, and operating in human-built indoor spaces.',
    specs: [
      { label: 'Form factor',         a: 'Quadruped',                b: 'Humanoid' },
      { label: 'Price (approx)',     a: '~$1,600',                  b: '~$13.5–16k',                          winner: 'a' },
      { label: 'Field-deployable',   a: 'Yes (IP67)',               b: 'Indoor only',                          winner: 'a' },
      { label: 'Payload',             a: '≈ 8 kg (loadable)',        b: 'Native dual-arm + hands',              winner: 'b' },
      { label: 'Best for',            a: 'Inspection, patrol, field', b: 'Manipulation, HRI, indoor' },
    ],
  },
]

/** Slug list — used by nuxt.config.ts prerender + sitemap */
export const comparisonSlugs = comparisons.map((c) => c.slug)

/** Lookup helper for the [slug].vue page */
export function findComparison(slug: string): Comparison | undefined {
  return comparisons.find((c) => c.slug === slug)
}