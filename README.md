# qtvue.com

Marketing website for **qtvue** — a robotics integration company that sells and programs robots for any business need.

Built with Nuxt 4, TypeScript, Tailwind v4, Nuxt Content, and deployed to Vercel.

## Requirements

- Node 20+
- pnpm 9+

## Setup

```bash
pnpm install
cp .env.example .env   # add RESEND_API_KEY for the contact form
```

## Development

```bash
pnpm dev         # dev server at http://localhost:3000
```

## Build / preview

```bash
pnpm build       # production build
pnpm generate    # static pre-render
pnpm preview     # serve the production build locally
```

## Tests

```bash
pnpm test        # Vitest unit tests
pnpm test:e2e    # Playwright e2e (builds + runs preview server)
```

## Content

All content lives in `content/en/` as Markdown files with typed frontmatter.
Schemas live in `app/content.schemas.ts`. Add a file, the page appears.

| Collection | Route template | Path |
|---|---|---|
| services | `/services/[slug]` | `content/en/services/*.md` |
| industries | `/industries/[slug]` | `content/en/industries/*.md` |
| work (case studies) | `/work/[slug]` | `content/en/work/*.md` |
| blog | `/blog/[slug]` | `content/en/blog/*.md` |
| careers | `/careers/[slug]` | `content/en/careers/*.md` |

## Adding a language

1. Add the locale to `nuxt.config.ts` → `i18n.locales`
2. Add a translation file at `i18n/locales/<code>.json`
3. Mirror content under `content/<code>/`
4. The `<LanguageSwitcher>` becomes visible automatically.

## Design system

- **Tokens:** `app/assets/css/tokens.css` — swap brand colors, fonts, or dark-mode variants here. Every component reads from tokens.
- **Logo:** three placeholder variants in `app/components/marketing/Logo.vue` (`wordmark` | `monogram` | `abstract`).
- **Components:** three-layer architecture — `ui/` (primitives) → `marketing/` + `layout/` (composites) → `pages/` (orchestration).

## Contact form

Submissions POST to `/api/contact`, validated with Zod, sent via [Resend](https://resend.com) to `hello@qtvue.com`. Includes a hidden honeypot field for spam control (no CAPTCHA).

Required environment variables (see `.env.example`):
- `RESEND_API_KEY`
- `CONTACT_EMAIL_TO` (defaults to `hello@qtvue.com`)

## Deployment

Push to `main` on GitHub → Vercel auto-builds and deploys. Preview deploys are generated per PR.

Route rules pre-render every route to static HTML today; specific routes can be flipped to dynamic SSR later (e.g. a client portal at `/portal/**`) with no re-platform.

## Project structure

```
app/
  components/{ui,layout,marketing,forms}/   # three-layer component architecture
  composables/        # useTheme, useContactForm
  pages/              # file-based routing
  schemas/            # Zod schemas (contact)
  utils/              # stemToRoute helper
  assets/css/         # tokens + Tailwind entry
  content.schemas.ts  # typed collection schemas
content/en/           # Markdown content collections
i18n/locales/         # translation files
server/api/           # /api/contact handler
server/utils/         # Resend client
```

See `docs/superpowers/specs/2026-06-21-qtvue-marketing-site-design.md` for the full design spec.
