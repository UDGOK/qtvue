# qtvue — visual redesign changelog

A from-the-ground-up visual redesign of the qtvue marketing site, modeled on
greptile.com's design language. The Nuxt 4 + Tailwind v4 + @nuxt/content
+ i18n architecture is preserved; only the design system and content
surface changed.

## What changed

### Design system

- **Palette** — cream paper bg `#faf6ec` + forest green primary `#0e5c3a` +
  limelight accent `#c6f432` in light mode; near-black bg with bright
  green `#2dd47a` in dark mode. Fixed "ink" tokens (`--color-ink-bg`,
  `--color-ink-text`) so dark sections stay dark in both modes.
- **Typography** — chunky display headlines with tight tracking, mono
  uppercase eyebrows, JetBrains Mono for telemetry/code.
- **Halftone** — radial-gradient dot pattern utility, used for the
  background of the hero, case-study cards, and the new robot mascot.
- **Tokens** — every component reads from CSS custom properties in
  `app/assets/css/tokens.css`. Swap a token, the whole site moves.

### New components (marketing/)

- `RoboCanvas.client.vue` — Three.js hero scene. A 6-axis robotic arm
  built from jointed icosahedrons + cylinders, suspended in an instanced
  particle field with a perspective grid floor. Mouse parallax,
  idle-motion articulation, glow pulse on the joints, auto-pause on
  `document.hidden`, full `prefers-reduced-motion` support. Client-only
  (`.client.vue` suffix + `<ClientOnly>` wrapper for SSR fallback).
- `AmbientField.client.vue` — lighter Three.js particle field for
  section backgrounds (CTA strip, etc.). One draw call, 600 instanced
  points, slow drift.
- `RobotMascot.vue` — halftone SVG illustration of a 6-axis robotic arm
  + a robot head variant, used as the hero's right-column art and
  as the placeholder for missing case-study images.
- `Marquee.vue` — seamless horizontal logo strip (greptile pattern).
- `Ticker.vue` — slow auto-scrolling telemetry strip, monospace
  uppercase, separator dots.
- `CodeBlock.vue` — terminal/IDE-style code panel with traffic-light
  dots, filename, language label, and a small regex-based highlighter
  for YAML / KAREL / numbers / comments.
- `StatusPill.vue` — `● Now booking Q3 2026` style pill, with live
  ping animation.
- `LogoCloud.vue` — greptile-style logo grid with eyebrow + CTA link.
- `LogoMark.vue` — placeholder wordmark for the logo cloud (square,
  circle, diamond, triangle, bars shape variants).
- `BarChart.vue` — minimal greptile-style bar chart with dashed grid
  lines, a "highlighted" bar with a `✓ us` badge.
- `Reveal.vue` — scroll-triggered fade/slide-in. SSR-safe (renders
  visible on first paint; only animates offscreen sections after
  hydration). Respects `prefers-reduced-motion`.
- `SectionDivider.vue` — thin line + mono label, premium section break.
- `Highlight.vue` — display heading wrapper with `.hl` (primary
  word + limelight underline).

### Refreshed components (ui/, layout/)

- `Btn.vue` — pill shape, greptile-style `→` arrow that slides on
  hover, four variants: `primary` (green), `secondary` (outlined),
  `ghost` (text + animated underline), `accent` (limelight).
- `Card.vue` — four variants, four pad sizes, optional `interactive`
  (hover lift + glow).
- `Section.vue` — three tones: `paper` (default), `ink` (always-dark
  band with always-light text), `surface` (warm cream).
- `Container.vue` — `narrow` and `bleed` modifiers.
- `Badge.vue` — `live` variant with ping-animated dot, `accent`
  variant with limelight.
- `Stat.vue` — inherits section text color so it reads in both
  paper and ink contexts.
- `Media.vue` — graceful fallback to `RobotMascot` placeholder when
  the image is missing or fails to load.
- `Logo.vue` — greptile-style wordmark with halftone robot mark +
  accent dot. Four variants: `wordmark`, `monogram`, `abstract`, `full`.
- `TheHeader.vue` — sticky glass header that blurs on scroll.
  Greptile-style nav: `Services ▾` and `Resources ▾` dropdowns with
  per-entry descriptions + CTA strip, plus flat links. Right side:
  theme toggle, outlined "Contact" (Sign In), filled green
  "Start a project" (Start Now) with `→` arrow.
- `TheFooter.vue` — multi-column nav (Services / Work / Company /
  Legal), newsletter sign-up with status pill ("Robots don't sleep.
  Neither do we."), social icons, brand lockup with "ROBOTICS" tag,
  and a "v2.0 · built with Nuxt & Three.js" legal line.
- `ThemeToggle.vue` — custom sun/moon icons.
- `Input/Textarea/Select.vue` — mono uppercase labels, focused
  primary ring, rounded-xl fields.
- `ContactForm.vue` — mono eyebrow labels, refined layout.

### Pages

Every page rebuilt on the new design system. Highlights:

- `index.vue` — WebGL hero with halftone robot + display headline
  ("The **robotics** company for ambitious operators." with
  `.hl` highlight), partner ticker, 10-logo cloud, 4 feature cards
  with embedded code mockups (YAML, KAREL, brand grid, gantt),
  ink-tone bar chart (qtvue 92% vs others 54–68%), selected work
  with halftone covers, 3 testimonials, 3-step process, ink CTA
  with limelight button.
- `services/index.vue`, `work/index.vue`, `industries/index.vue`,
  `blog/index.vue`, `careers/index.vue` — greptile-style display
  headlines with `.hl` highlight words, big section headings,
  consistent card grids.
- `services/[slug].vue`, `work/[slug].vue`, `industries/[slug].vue`,
  `blog/[slug].vue` — back-link, eyebrow, big display title,
  content body.
- `about.vue` — stat band in ink tone, principles grid, CTA.
- `contact.vue` — info card with status pill + new form.
- `legal/{privacy,terms}.vue`, `error.vue` — same hero pattern.

### Configuration

- `package.json` — added `three@^0.171.0` and `@types/three`.
- All build/route rules, i18n, and module config unchanged.

## How to run

```bash
pnpm install
pnpm generate   # prerender 55 routes to .vercel/output/static
pnpm preview    # serve the production build
# or
pnpm dev        # dev server at http://localhost:3000
```

The site is fully static (`routeRules: { '/**': { prerender: true } }`).
No server runtime needed. Deploy `.vercel/output/static/` to any
static host (Vercel, Netlify, Cloudflare Pages, S3, etc.).

## Known notes

- The Reveal wrapper renders visible on first paint for SEO and
  full-page screenshots. It only animates sections that are below the
  fold on hydration. This means a full-page screenshot taken without
  scrolling will show all sections (great for SEO crawlers), and
  scrolling into a section triggers a fade/slide-in for users.
- WebGL components are client-only. The SSR fallback is a static
  halftone wash so the layout doesn't shift on hydration.
- `prefers-reduced-motion` is respected everywhere: the canvas
  pauses, the reveal snaps visible, transitions are disabled.
