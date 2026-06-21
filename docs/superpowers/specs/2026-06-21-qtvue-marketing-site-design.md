# qtvue.com Marketing Website — Design Spec

**Date:** 2026-06-21
**Status:** Approved (brainstorming complete)
**Spec scope:** Spec 1 of 2 — Core marketing site + foundation
**Project root:** `C:\Users\Yasir\ZCodeProject\qtvue`

---

## 1. Purpose & Context

**qtvue** is a robotics company that sells robots and programs them for any business need. This spec defines the marketing/services website at `qtvue.com`.

qtvue is positioned as a **full-service robotics integrator**:

- Full integration services: sales + programming + cell design + integration + commissioning + training + support
- Custom / consulting: feasibility studies, automation assessments, custom solutions engineering

**Audience:** International B2B buyers. Content ships in **English only** at launch, but the architecture is **i18n-ready** so additional languages can be added later with zero refactor.

This is **Spec 1 of 2**. Spec 2 (an interactive quote / project-intake wizard) is deferred and will be built on top of this foundation. Everything in this spec is designed so Spec 2 plugs in with no restructuring.

## 2. Scope

### In scope (Spec 1)

- Marketing site: Home, Services (+4 sub-pages), Industries (+template), Work / case studies (+template), About, Careers (+template), Blog (+template), Contact, Privacy, Terms
- Design system with light + dark mode
- i18n-ready architecture (English shipped, multi-language ready)
- Content collections with typed schemas (services, industries, work, blog, careers)
- Contact form with email delivery via Resend
- SEO: meta tags, OG/Twitter, JSON-LD, sitemap, robots, canonical, hreflang-ready
- Pre-rendered static output, deployed to Vercel
- Unit tests (Vitest) + e2e smoke tests (Playwright)

### Out of scope (deferred)

- Quote request / project intake wizard → **Spec 2**
- Client portal / authenticated areas → future
- Multi-language content (architecture ready, content not built) → future
- Google Analytics / marketing pixels (add later with consent banner if needed)
- Real case study content and photography (placeholders ship first; user provides over time)

## 3. Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | **Nuxt 3** (Vue 3) | Matches `qtvue` brand; hybrid rendering enables static now + dynamic later on same codebase |
| Language | **TypeScript** end-to-end | Type safety for content schemas, refactor safety as site grows toward portal |
| Styling | **Tailwind CSS** + token layer | Utility-first, tiny output; centralized tokens make palette/typography swappable |
| Content | **Nuxt Content v3** | Code-only content management (per user choice); Markdown files queried like a DB |
| SEO | **@nuxtjs/seo** | One module for sitemap, robots, OG, JSON-LD, canonical |
| i18n | **@nuxtjs/i18n** | Native Nuxt i18n with locale routing and hreflang |
| Images | **Nuxt Image** | Responsive `srcset` + AVIF/WebP auto-generation |
| Deployment | **Nuxt Vercel adapter** | Native Vercel integration; supports flipping routes to dynamic later |
| Testing | **Vitest** (unit) + **Playwright** (e2e) | Standard Nuxt testing stack |
| Forms | **Nuxt server routes + Resend** | No separate backend; transactional email to branded inbox |
| Package manager | **pnpm** | Fast, disk-efficient, Nuxt community default |

### Rendering strategy ("2030-ready, dynamic on same pages")

Nuxt route rules declare rendering mode per route:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    // Pre-render everything at build time today (fast, cheap, perfect SEO)
    '/**': { prerender: true },

    // Later, flip specific routes to dynamic/SSR — zero migration:
    // '/portal/**': { ssr: true },     // authenticated client portal
    // '/quote': { ssr: true },          // Spec 2 quote wizard
    // '/api/**': { cors: true },        // server API routes
  }
})
```

**Today:** `nuxt build` produces static HTML; deploy anywhere. Sub-second loads, perfect Lighthouse, pennies to host.
**Tomorrow:** Add a `/portal` route, flip one line, deploy to Vercel serverless. Marketing pages stay static. No re-platform.

## 4. Site Architecture & Page Inventory

### Route map

```
/                          Home
/services                  Services overview
/services/integration      Full integration (cell design → commissioning)
/services/programming      Robot programming & reprogramming
/services/sales            Robot & peripheral sales
/services/consulting       Feasibility & consulting
/industries                Industries overview
/industries/[industry]     Per-industry page (template-driven)
/work                      Case studies index
/work/[slug]               Case study detail
/about                     About / company / team
/careers                   Careers listing
/careers/[slug]            Role detail
/blog                       Resources / blog index
/blog/[slug]               Article detail
/contact                   Contact (form + direct contact details)
/legal/privacy             Privacy policy
/legal/terms               Terms
/sitemap.xml               Auto-generated
/robots.txt                Auto-generated
```

**Reserved (not built in Spec 1):** `/portal/*`, `/quote` (Spec 2)

### Page purposes

| Page | Job to be done |
|---|---|
| Home | 5-second value prop → establish credibility → route prospects to the right service |
| Services overview | "Here's everything we do" — the integration story end-to-end |
| Service sub-pages | Depth per capability; each is an SEO landing page |
| Industries | "We've done this in your world" — proves vertical fit |
| Work / Case studies | Proof — the #1 trust signal for B2B robotics buyers |
| About | Humanize the company; show expertise, location, history |
| Careers | Recruiting — real listing page |
| Blog / Resources | SEO + thought leadership |
| Contact | Primary conversion path (form + email + phone) |

### Architectural decisions

1. **Services as sub-routes**, not sections of one page. Each service gets a dedicated, SEO-indexable URL.
2. **Industries as a content collection** (not hand-built pages). Adding an industry = add one Markdown file, zero code.
3. **Case studies & blog use the `[slug]` pattern** — content collections with typed frontmatter.
4. **Careers is a content collection** — adding/removing roles is a data edit, not a code change.

## 5. Design System & Visual Identity

Aesthetic direction: **Modern Tech / Clean**. Ship **light + dark mode**.

### Color palette (tokenized)

```
Brand
  primary       #2563EB   electric blue   — CTAs, links, key accents
  primary-600   #1D4ED8   hover/active
  accent        #7C3AED   violet           — secondary highlights, gradients

Neutrals (cool gray)
  white         #FFFFFF   page background
  50            #F8FAFC   section bg, cards
  100           #F1F5F9   borders, dividers
  500           #64748B   secondary text
  900           #0F172A   primary text, headings

Semantic
  success       #16A34A
  warning       #D97706
  danger        #DC2626
```

All colors are defined as tokens in `app/assets/css/tokens.css`. Dark mode is a token-set swap. WCAG AA contrast on all text/body combinations in both modes.

### Typography

```
Headings / Body:   Inter (variable)        — geometric, confident, modern, legible
Technical accents: JetBrains Mono          — used sparingly for spec tables, process steps, data
```

Two families only. `font-display: swap` to avoid FOIT.

### Logo

No brand assets exist. Ship **three placeholder logo directions** as inline SVG components (crisp at any size, theme-able via tokens):

1. **Wordmark** — `qtvue` in Inter, tight tracking, with a small geometric mark (stylized robot joint / node) beside it
2. **Monogram** — `Q` in a rounded square, gradient fill
3. **Abstract mark** — minimal geometric "gripper/node" icon next to the wordmark

User picks one to refine or replace.

### Component system (three-layer architecture)

**Layer 1 — `components/ui/` (pure primitives):** No knowledge of pages or content. Props in, slots out. Reusable anywhere (including future portal).

- `Btn`, `Container`, `Section`, `Card`, `Badge`/`Tag`, `Stat`, `Hero`, `Media`, `Icon`, form primitives (`Input`, `Textarea`, `Select`, `Checkbox`)

**Layer 2 — `components/layout/`:** Global chrome.

- `TheHeader` (nav + logo + hidden language switcher + theme toggle), `TheFooter`, `ThemeToggle`

**Layer 3 — `components/marketing/`:** Composite sections built from `ui/` primitives. Knows content shapes (e.g., `CaseStudyCard` receives a case study object) but not routing.

- `HeroSection`, `FeatureGrid`, `ProcessSteps`, `CTAStrip`, `TestimonialCard`, `CaseStudyCard`, `ServiceCard`, `Logo`

**Forms:** `components/forms/ContactForm.vue`

### Motion & interaction

- Subtle, purposeful: fade-up on scroll (IntersectionObserver), hover lifts on cards, visible focus rings
- Respect `prefers-reduced-motion` (disable animations for users who opt out)
- No flashy animations — Modern Tech / Clean = restrained

### Accessibility baseline

- WCAG AA contrast on all text/body combos (both modes)
- Keyboard-navigable nav (visible focus, logical tab order)
- Semantic HTML (`<nav>`, `<main>`, `<article>`, heading hierarchy)
- All images have alt text; decorative images marked `alt=""`
- Forms have proper labels, error states, and ARIA where needed

## 6. Internationalization (i18n)

**Strategy:** English-only content at launch, architecture ready for additional languages.

### Routing

`@nuxtjs/i18n` in **prefix_except_default** mode:

```
qtvue.com/services    → English (default, no /en/ prefix)   ← shipped today
qtvue.com/es/services → Spanish (explicit prefix)            ← added later, no code change
```

### Future-proofing rules

1. **No hardcoded English strings in components.** Every user-facing string goes through `t()` or a content file.
2. **UI strings** (nav, buttons, headings, eyebrows) live in `i18n/locales/en.json`. Single source of truth.
3. **Content** organized by locale: `content/en/`, future `content/es/`, etc.
4. **`<LanguageSwitcher>`** component built but **hidden** until a second locale exists. No dead UI at launch.
5. **`hreflang` tags** generated automatically — when a second locale is added, Google indexes it correctly from day one.
6. **Per-locale date/number formatting** via Intl.

## 7. Content Model & Collections

### Collections

```
content/
  en/
    services/{integration,programming,sales,consulting}.md
    industries/{welding,packaging,material-handling,...}.md
    work/{case-study-slug}.md
    blog/{article-slug}.md
    careers/{role-slug}.md
```

### Typed schemas

Each collection gets a Zod-style schema in `content.config.ts`. Content errors are caught at build time, not in production. Example (case studies):

```ts
defineCollection('work', {
  type: 'page',
  source: 'en/work/**/*.md',
  schema: {
    title: z.string(),
    summary: z.string(),                  // cards / SEO description
    client: z.string().optional(),        // omit if NDA
    industry: z.string(),                 // links to /industries/[slug]
    services: z.array(z.string()),        // which services were used
    year: z.number(),
    metrics: z.array(z.object({           // proof points
      value: z.string(),                  // "40%"
      label: z.string()                   // "throughput increase"
    })).optional(),
    image: z.string(),                    // hero image
    gallery: z.array(z.string()).optional(),
    featured: z.boolean().default(false), // shown on home / work index
  }
})
```

Every collection: typed frontmatter + Markdown body. Body renders through Vue components (so interactive elements can be embedded if needed).

### Collection usage

| Collection | Index page | Detail page | Drives |
|---|---|---|---|
| services | `/services` | `/services/[slug]` | Home highlights, service CTAs |
| industries | `/industries` | `/industries/[slug]` | Case study filtering |
| work (case studies) | `/work` | `/work/[slug]` | Featured on home — trust engine |
| blog | `/blog` | `/blog/[slug]` | SEO, thought leadership |
| careers | `/careers` | `/careers/[slug]` | Recruiting |

### Content relationships

```
case study ──┬── belongs to → industry
             └── used services → [integration, programming, ...]

service page ── references → related case studies (query by service tag)
industry page ── references → case studies in that industry
```

Queries are typed. E.g., a service page auto-shows related case studies with no manual linking.

### Content the user will provide vs. placeholders

- **Services, industries, About, Home copy:** User provides real copy. Implementation ships clearly-marked placeholder text (`[PLACEHOLDER — replace with real copy]`) to be replaced.
- **Case studies:** Ship 2-3 clearly-labeled placeholder case studies (marked as samples) in `/work`. User swaps with real ones over time.
- **Blog:** Ship index + article template + 1 starter article.
- **Careers:** Ship listing page in **evergreen CTA mode at launch** — no open roles, no placeholder roles. Show "We're always looking for talent — send us your resume" CTA with a link to contact, rather than an empty or fake-populated list. When real roles exist, they're added as content files and the page auto-switches to listing mode.

### Image handling

- All content images live in `public/images/` (referenced by path in frontmatter)
- Nuxt Image module auto-generates responsive variants + AVIF/WebP
- Placeholder imagery sourced from Unsplash (robotics/automation, royalty-free) until real facility/robot photography is provided

## 8. SEO, Performance, Analytics, Deployment

### SEO (via @nuxtjs/seo)

| Concern | Implementation |
|---|---|
| Meta tags | Per-page `<title>` + meta description, driven by content frontmatter; defaults via `app.config.ts` |
| Open Graph / Twitter cards | Auto-generated per page from title/description/image |
| Sitemap | `@nuxtjs/sitemap` auto-generates `/sitemap.xml` from routes + content |
| robots.txt | `@nuxtjs/robots` — allow all, point to sitemap |
| hreflang | Auto-generated by i18n module (future multi-language SEO) |
| Schema.org / JSON-LD | `Organization`, `Service`, `BreadcrumbList`, `Article` (blog) |
| Canonical URLs | Auto-set per route |
| Semantic HTML | Handled by component system |

### Performance targets

| Metric | Target | How |
|---|---|---|
| Lighthouse Performance | ≥ 95 | Pre-rendered HTML, minimal JS, optimized images |
| LCP | < 2.0s | Static HTML, lazy-loaded below-fold, AVIF/WebP |
| CLS | < 0.1 | Fixed aspect ratios on all media, `font-display: swap` |
| JS shipped | < 100KB gzipped per route | Nuxt payload extraction, no heavy client libraries |

### Analytics

- **Vercel Analytics** — privacy-friendly, zero-config pageview tracking. Deploys with the site.
- **No Google Analytics at launch** — heavy, requires cookie banner, hurts Lighthouse. Add later only if specifically needed.

### Privacy

- **Cookieless at launch** (no analytics cookies, only essential functionality)
- **No cookie banner needed** — cleaner UX, better Lighthouse
- GDPR/CCPA-compliant by default
- Privacy policy reflects this accurately
- When/if GA or marketing pixels added later, consent banner is added then

### Deployment pipeline

```
Local dev → git push to GitHub (main)
         → Vercel auto-builds (pnpm build + Vercel adapter)
         → Pre-renders all routes
         → Deploys to global edge CDN
         → qtvue.com live

Preview deploys → every PR gets a unique preview URL for review
```

**Vercel config:**
- Framework preset: Nuxt 3 (auto-detected)
- Build command: `pnpm build`
- Environment variables: `RESEND_API_KEY`, `CONTACT_EMAIL_TO` (= `hello@qtvue.com`), public site URL
- Custom domain: `qtvue.com` apex primary; `www.qtvue.com` redirects to apex

### Contact form flow

```
User submits /contact
  → POST /api/contact (Nuxt server route)
  → Validates input (Zod schema)
  → Resend API sends email to hello@qtvue.com
  → User sees success state
  → On error: graceful failure with retry guidance
```

**Spam protection:** honeypot field + rate limiting. **No CAPTCHA at launch** (hurts UX and Lighthouse); add only if spam becomes a problem.

## 9. Project Structure

```
qtvue/
├── app/
│   ├── components/
│   │   ├── ui/                      # design system primitives (isolated, reusable)
│   │   │   ├── Btn.vue
│   │   │   ├── Container.vue
│   │   │   ├── Section.vue
│   │   │   ├── Card.vue
│   │   │   ├── Badge.vue
│   │   │   ├── Input.vue
│   │   │   ├── Textarea.vue
│   │   │   ├── Select.vue
│   │   │   ├── Stat.vue
│   │   │   ├── Icon.vue
│   │   │   └── Media.vue
│   │   ├── layout/
│   │   │   ├── TheHeader.vue
│   │   │   ├── TheFooter.vue
│   │   │   └── ThemeToggle.vue
│   │   ├── marketing/
│   │   │   ├── HeroSection.vue
│   │   │   ├── FeatureGrid.vue
│   │   │   ├── ProcessSteps.vue
│   │   │   ├── CTAStrip.vue
│   │   │   ├── TestimonialCard.vue
│   │   │   ├── CaseStudyCard.vue
│   │   │   ├── ServiceCard.vue
│   │   │   └── Logo.vue             # 3 placeholder variants
│   │   └── forms/
│   │       └── ContactForm.vue
│   ├── composables/
│   │   ├── useTheme.ts              # light/dark persistence
│   │   ├── useSeo.ts                # per-page meta helpers
│   │   └── useContactForm.ts        # form state + submission logic
│   ├── pages/
│   │   ├── index.vue
│   │   ├── about.vue
│   │   ├── contact.vue
│   │   ├── services/{index.vue, [slug].vue}
│   │   ├── industries/{index.vue, [slug].vue}
│   │   ├── work/{index.vue, [slug].vue}
│   │   ├── blog/{index.vue, [slug].vue}
│   │   ├── careers/{index.vue, [slug].vue}
│   │   └── legal/{privacy.vue, terms.vue}
│   ├── layouts/
│   │   └── default.vue              # header + <slot/> + footer
│   └── assets/css/
│       ├── main.css                 # Tailwind entry + base styles
│       └── tokens.css               # design tokens (colors, type, spacing)
├── content/
│   └── en/{services,industries,work,blog,careers}/
├── i18n/
│   └── locales/en.json
├── public/
│   ├── images/
│   ├── favicon.svg
│   └── og-default.png
├── server/
│   └── api/
│       └── contact.post.ts          # POST handler, Resend integration
├── content.config.ts                # collection schemas (typed)
├── nuxt.config.ts                   # modules, route rules, Vercel adapter
├── tailwind.config.ts
├── app.config.ts                    # runtime-safe site config (nav, contact)
├── tsconfig.json
├── package.json
└── README.md
```

### Why this structure

**Three layers, no mixing:**

1. `components/ui/` — pure design system. Props in, slots out. Zero knowledge of pages or content. Reusable anywhere, including the future portal.
2. `components/marketing/` — composite sections built from `ui/` primitives. Knows about content queries but not routing.
3. `pages/` — orchestration only. Compose marketing sections, wire data from content queries. No business logic here.

**Isolation guarantees:**

- A `ui/Btn` change can't break a page — it only affects button rendering.
- A content schema change is caught at build time (`content.config.ts`), never in production.
- Form logic lives in `composables/useContactForm.ts` — testable in isolation, swappable when Spec 2 quote wizard needs similar patterns.

**Spec 2 plug-in points (zero restructuring):**

- New pages: `app/pages/quote/`
- New server route: `server/api/quote.post.ts`
- Reuses `ui/` form primitives and `composables/` patterns
- Flip route rule for `/quote` if it needs SSR

### Naming conventions

- **PascalCase** for Vue components (`Btn.vue`, `CaseStudyCard.vue`)
- **camelCase** for composables (`useTheme.ts`)
- **kebab-case** for content files and routes (`material-handling.md`)
- **`The`** prefix for singleton layout components (`TheHeader`, `TheFooter`)
- **Bracketed** dynamic routes follow Nuxt convention (`[slug].vue`)

### Git strategy

- Single `main` branch; feature branches per work item (`feat/contact-form`, `feat/design-system`)
- PRs trigger Vercel preview deploys
- Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`)
- No monorepo — one repo, one site

## 10. Dependencies & User-Provided Inputs

These are flagged dependencies — implementation proceeds with placeholders/sensible defaults until provided:

| Dependency | Owner | Status at launch |
|---|---|---|
| Marketing copy (services, industries, about, home) | User | Placeholder text ships; user replaces |
| Logo preference (pick from 3 placeholders) | User | All 3 ship; user picks during/after design system phase |
| Real case studies | User | 2-3 labeled placeholders ship; user swaps |
| Real photography | User | Unsplash placeholders ship; user replaces |
| Resend API key | User | Wired via env var; works locally with test key, prod needs real key |
| Vercel project + DNS access for qtvue.com | User | Needed to go live; build works without it |

## 11. Testing & Verification

- **Vitest** unit tests for composables (`useTheme`, `useContactForm`) and content schema validation
- **Playwright** e2e smoke tests:
  - Home loads
  - Primary nav works
  - Contact form submits (success + validation error states)
  - Language switcher is present (hidden, but in DOM)
  - Dark/light theme toggle persists
  - A `[slug]` route renders (e.g., a case study)
- **Lighthouse CI** on preview deploys (target ≥ 95)
- **Build-time content schema validation** catches frontmatter errors before deploy

## 12. Glossary

- **SSG / pre-rendering** — Static Site Generation. HTML is built once at build time, served as plain files. Fast, cheap, SEO-perfect.
- **SSR** — Server-Side Rendering. HTML is built per-request on a server. Needed for dynamic/authenticated content.
- **Route rules** — Nuxt 3's per-route rendering mode configuration. Lets different routes use different strategies (static vs. dynamic) in one app.
- **Nuxt Content** — File-based CMS for Nuxt. Markdown files with typed frontmatter, queryable like a database.
- **Hreflang** — HTML attribute telling search engines which language/region a page targets. Essential for multi-language SEO.
- **i18n** — Internationalization. Architecture for supporting multiple languages.
- **Token (design)** — A named value (color, spacing, font) centralizing a design decision. Swappable in one place.

---

**Next step:** Invoke the writing-plans skill to produce a phased implementation plan.
