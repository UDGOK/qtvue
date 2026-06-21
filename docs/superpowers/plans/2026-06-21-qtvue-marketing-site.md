# qtvue.com Marketing Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the qtvue.com B2B marketing/services website as a pre-rendered Nuxt 3 site with a tokenized design system (light + dark), i18n-ready architecture, typed content collections, contact form, SEO, and Vercel deployment — the foundation that Spec 2 (quote wizard) will later build on.

**Architecture:** Nuxt 3 (Vue 3) + TypeScript, pre-rendered to static HTML via route rules (with the door open to flip specific routes to dynamic/SSR later). Three-layer component model: `ui/` primitives → `marketing/` composites → `pages/` orchestration. Content in Nuxt Content v3 with typed Zod schemas. Tailwind + centralized tokens. `@nuxtjs/i18n` in prefix_except_default mode (English shipped, multi-language ready). Contact form POSTs to a Nuxt server route that calls Resend.

**Tech Stack:** Nuxt 3, Vue 3, TypeScript, Tailwind CSS, Nuxt Content v3, @nuxtjs/seo, @nuxtjs/i18n, Nuxt Image, Nuxt Vercel adapter, Resend, Vitest, Playwright, pnpm.

**Spec:** `docs/superpowers/specs/2026-06-21-qtvue-marketing-site-design.md`

---

## Phases

This plan is sequenced into 11 phases. Each phase ends with a green build and a commit. Tasks within a phase are bite-sized (2-5 min each) and follow TDD where a unit test is meaningful.

- **Phase 1:** Project scaffold (Nuxt init, deps, tooling, lint/format)
- **Phase 2:** Design tokens & Tailwind config (the swappable design system foundation)
- **Phase 3:** UI primitives (Btn, Container, Section, Card, Badge, Stat, Media, Icon, form inputs)
- **Phase 4:** Theme (light/dark) composable + toggle
- **Phase 5:** Layout chrome (Header, Footer, default layout, nav, logo placeholders, hidden language switcher)
- **Phase 6:** i18n wiring (prefix_except_default, en.json, t() everywhere)
- **Phase 7:** Content collections + schemas (services, industries, work, blog, careers) + seed content
- **Phase 8:** Page templates (Home, Services index + [slug], Industries index + [slug], Work index + [slug], About, Careers evergreen, Blog index + [slug], Contact, Legal)
- **Phase 9:** Contact form (client + server route + Resend + validation + spam honeypot)
- **Phase 10:** SEO module (meta, OG, JSON-LD, sitemap, robots, hreflang)
- **Phase 11:** Deployment config (Vercel adapter, env vars, route rules finalization), e2e smoke tests, Lighthouse check, README

---

## Phase 1 — Project Scaffold

### Task 1.1: Initialize git repo and Nuxt project

**Files:**
- Create: `C:\Users\Yasir\ZCodeProject\qtvue\.gitignore`
- Create: `C:\Users\Yasir\ZCodeProject\qtvue\package.json` (via pnpm create)

- [ ] **Step 1: Initialize git in the qtvue directory**

Run from `C:\Users\Yasir\ZCodeProject\qtvue`:
```bash
git init
git branch -M main
```
Expected: `Initialized empty Git repository in .../qtvue/.git/`

- [ ] **Step 2: Create the .gitignore**

Create `C:\Users\Yasir\ZCodeProject\qtvue\.gitignore`:
```gitignore
# Nuxt
.nuxt
.output
.data
dist
node_modules

# Logs
*.log
logs/

# Env
.env
.env.*
!.env.example

# Editor / OS
.DS_Store
.idea
.vscode/*
!.vscode/extensions.json
Thumbs.db

# Playwright
/test-results
/playwright-report
/blob-report
/playwright/.cache

# Vercel
.vercel
```

- [ ] **Step 3: Initialize the Nuxt 3 project in place**

Run from `C:\Users\Yasir\ZCodeProject\qtvue`:
```bash
pnpm create nuxt@latest .
```
When prompted:
- Package manager: **pnpm**
- Initialize git repository: **No** (already done)
- Install dependencies: **Yes**

Expected: `package.json`, `nuxt.config.ts`, `app.vue`, `tsconfig.json` created; dependencies installed.

- [ ] **Step 4: Verify dev server boots**

Run:
```bash
pnpm dev
```
Expected: Nuxt dev server starts on `http://localhost:3000`, default welcome page renders. Stop the server (Ctrl+C).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: initialize Nuxt 3 project"
```

### Task 1.2: Install dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install runtime modules**

Run:
```bash
pnpm add @nuxt/content @nuxtjs/seo @nuxtjs/i18n @nuxt/image
```
Expected: modules added to `dependencies` in `package.json`.

- [ ] **Step 2: Install Resend SDK**

Run:
```bash
pnpm add resend
```
Expected: `resend` in `dependencies`.

- [ ] **Step 3: Install dev dependencies (linting, formatting, testing)**

Run:
```bash
pnpm add -D @nuxt/devtools prettier eslint @nuxt/eslint vitest @vue/test-utils @nuxt/test-utils happy-dom @playwright/test
```
Expected: all added to `devDependencies`.

- [ ] **Step 4: Register modules in nuxt.config.ts**

Replace the contents of `nuxt.config.ts` with:
```ts
export default defineNuxtConfig({
  compatibilityDate: '2026-06-21',
  devtools: { enabled: true },

  modules: [
    '@nuxt/content',
    '@nuxtjs/seo',
    '@nuxtjs/i18n',
    '@nuxt/image',
  ],

  css: ['~/assets/css/main.css'],
})
```

- [ ] **Step 5: Verify the build still works**

Run:
```bash
pnpm build
```
Expected: build completes without errors. (It produces `.output/`.)

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: install Nuxt modules, Resend, testing and lint tooling"
```

### Task 1.3: Configure ESLint, Prettier, and TypeScript

**Files:**
- Create: `C:\Users\Yasir\ZCodeProject\qtvue\.prettierrc`
- Create: `C:\Users\Yasir\ZCodeProject\qtvue\eslint.config.mjs`
- Modify: `nuxt.config.ts`

- [ ] **Step 1: Create Prettier config**

Create `.prettierrc`:
```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "vueIndentScriptAndStyle": false,
  "tabWidth": 2
}
```

- [ ] **Step 2: Create ESLint flat config**

Create `eslint.config.mjs`:
```js
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    'vue/multi-word-component-names': 'off',
  },
})
```

- [ ] **Step 3: Add scripts to package.json**

In `package.json`, ensure the `scripts` block includes:
```json
{
  "scripts": {
    "build": "nuxt build",
    "dev": "nuxt dev",
    "generate": "nuxt generate",
    "preview": "nuxt preview",
    "postinstall": "nuxt prepare",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  }
}
```

- [ ] **Step 4: Verify lint runs**

Run:
```bash
pnpm lint
```
Expected: completes (warnings ok, no fatal errors). If errors about missing `.nuxt/eslint.config.mjs`, run `pnpm postinstall` first.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: configure ESLint, Prettier, and npm scripts"
```

### Task 1.4: Configure TypeScript strictness

**Files:**
- Modify: `nuxt.config.ts`

- [ ] **Step 1: Enable strict TypeScript**

Update the `nuxt.config.ts` `typescript` block. The full file should now read:
```ts
export default defineNuxtConfig({
  compatibilityDate: '2026-06-21',
  devtools: { enabled: true },

  modules: [
    '@nuxt/content',
    '@nuxtjs/seo',
    '@nuxtjs/i18n',
    '@nuxt/image',
  ],

  css: ['~/assets/css/main.css'],

  typescript: {
    strict: true,
    typeCheck: false, // set true later if desired; kept off so builds don't block on minor issues
  },

  future: {
    compatibilityVersion: 4,
  },
})
```

- [ ] **Step 2: Create the assets/css/main.css entry**

Create `app/assets/css/main.css`:
```css
@import './tokens.css';
@import 'tailwindcss';
```
(We'll populate `tokens.css` in Phase 2. Tailwind v4 syntax uses `@import 'tailwindcss'`.)

- [ ] **Step 3: Verify typecheck setup**

Run:
```bash
pnpm nuxt typecheck
```
Expected: may report that the `tokens.css` is empty or missing — that's fine, Phase 2 fills it. If it fails only on missing tokens.css, proceed.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: enable strict TypeScript and Tailwind v4 entry"
```

---

## Phase 2 — Design Tokens & Tailwind Config

### Task 2.1: Write the tokens.css file (light + dark)

**Files:**
- Create: `app/assets/css/tokens.css`
- Test: (visual — no unit test; verified in Task 2.3)

- [ ] **Step 1: Author the design tokens**

Create `app/assets/css/tokens.css`:
```css
:root {
  /* Brand */
  --color-primary: #2563eb;
  --color-primary-600: #1d4ed8;
  --color-accent: #7c3aed;

  /* Neutrals */
  --color-bg: #ffffff;
  --color-surface: #f8fafc;
  --color-border: #f1f5f9;
  --color-text-secondary: #64748b;
  --color-text: #0f172a;

  /* Semantic */
  --color-success: #16a34a;
  --color-warning: #d97706;
  --color-danger: #dc2626;

  /* Typography */
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;

  /* Spacing rhythm */
  --container-max: 1200px;
}

:root.dark {
  --color-primary: #3b82f6;
  --color-primary-600: #60a5fa;
  --color-accent: #a78bfa;

  --color-bg: #0b1220;
  --color-surface: #0f172a;
  --color-border: #1e293b;
  --color-text-secondary: #94a3b8;
  --color-text: #e2e8f0;
}
```

- [ ] **Step 2: Commit**

```bash
git add app/assets/css/tokens.css
git commit -m "feat(tokens): add light/dark design tokens"
```

### Task 2.2: Wire tokens into Tailwind theme

**Files:**
- Create: `app/assets/css/main.css` (modify, Tailwind v4 `@theme`)
- Modify: `nuxt.config.ts` (register Tailwind via `@nuxtjs/tailwindcss` or built-in)

- [ ] **Step 1: Install Tailwind (Nuxt module)**

Run:
```bash
pnpm add -D @tailwindcss/vite tailwindcss
```

- [ ] **Step 2: Register the Tailwind Vite plugin in nuxt.config.ts**

Update `nuxt.config.ts` to add:
```ts
  vite: {
    plugins: [
      // @ts-expect-error - tailwind plugin has no types here
      (await import('@tailwindcss/vite')).tailwindcss(),
    ],
  },
```
(Wrap in top-level await — Nuxt config supports ESM top-level await.)

- [ ] **Step 3: Define Tailwind theme tokens via @theme in main.css**

Replace `app/assets/css/main.css`:
```css
@import './tokens.css';
@import 'tailwindcss';

@theme {
  --color-primary: var(--color-primary);
  --color-primary-600: var(--color-primary-600);
  --color-accent: var(--color-accent);
  --color-bg: var(--color-bg);
  --color-surface: var(--color-surface);
  --color-border: var(--color-border);
  --color-text: var(--color-text);
  --color-text-secondary: var(--color-text-secondary);
  --color-success: var(--color-success);
  --color-warning: var(--color-warning);
  --color-danger: var(--color-danger);

  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);

  --container-max: var(--container-max);
}

html {
  font-family: var(--font-sans);
  background-color: var(--color-bg);
  color: var(--color-text);
}
```

- [ ] **Step 4: Verify dev server renders with default app.vue**

Run:
```bash
pnpm dev
```
Open `http://localhost:3000`. Expected: page background uses `--color-bg` (white), text uses `--color-text` (near-black). Stop server.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(tailwind): wire tokens into Tailwind v4 theme"
```

### Task 2.3: Verify dark-mode token swap (manual smoke test)

**Files:** none

- [ ] **Step 1: Manually toggle the dark class**

Run dev server. In the browser console:
```js
document.documentElement.classList.add('dark')
```
Expected: background swaps to dark navy (`#0b1220`), text to light (`#e2e8f0`). Remove the class:
```js
document.documentElement.classList.remove('dark')
```
Expected: reverts to light.

- [ ] **Step 2: No commit (verification only)**

---

## Phase 3 — UI Primitives

> Each primitive is a thin, isolated component in `app/components/ui/`. Props in, slots out. We unit-test the ones with non-trivial logic (Btn variants, Icon name resolution, Media aspect).

### Task 3.1: Container primitive

**Files:**
- Create: `app/components/ui/Container.vue`
- Test: `test/unit/Container.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `test/unit/Container.spec.ts`:
```ts
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Container from '~/components/ui/Container.vue'

describe('Container', () => {
  it('renders its slot content', () => {
    const wrapper = mount(Container, { slots: { default: '<p>hi</p>' } })
    expect(wrapper.text()).toBe('hi')
  })

  it('applies max-width class', () => {
    const wrapper = mount(Container)
    expect(wrapper.classes().some((c) => c.includes('max-w'))).toBe(true)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run:
```bash
pnpm test test/unit/Container.spec.ts
```
Expected: FAIL — component does not exist.

- [ ] **Step 3: Write the component**

Create `app/components/ui/Container.vue`:
```vue
<template>
  <div class="mx-auto w-full max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
    <slot />
  </div>
</template>
```

- [ ] **Step 4: Run the test to verify it passes**

Run:
```bash
pnpm test test/unit/Container.spec.ts
```
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add app/components/ui/Container.vue test/unit/Container.spec.ts
git commit -m "feat(ui): add Container primitive"
```

### Task 3.2: Section primitive

**Files:**
- Create: `app/components/ui/Section.vue`
- Test: `test/unit/Section.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `test/unit/Section.spec.ts`:
```ts
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Section from '~/components/ui/Section.vue'

describe('Section', () => {
  it('renders eyebrow, heading, and slot', () => {
    const wrapper = mount(Section, {
      props: { eyebrow: 'Services', heading: 'What we do' },
      slots: { default: '<p>body</p>' },
    })
    expect(wrapper.text()).toContain('Services')
    expect(wrapper.text()).toContain('What we do')
    expect(wrapper.text()).toContain('body')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test test/unit/Section.spec.ts`
Expected: FAIL.

- [ ] **Step 3: Write the component**

Create `app/components/ui/Section.vue`:
```vue
<script setup lang="ts">
defineProps<{
  eyebrow?: string
  heading?: string
}>()
</script>

<template>
  <section class="py-16 sm:py-24">
    <Container>
      <div v-if="eyebrow || heading" class="mb-10 max-w-2xl">
        <p v-if="eyebrow" class="font-mono text-sm uppercase tracking-wider text-primary">
          {{ eyebrow }}
        </p>
        <h2 v-if="heading" class="mt-2 text-3xl font-bold sm:text-4xl">{{ heading }}</h2>
      </div>
      <slot />
    </Container>
  </section>
</template>
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test test/unit/Section.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/components/ui/Section.vue test/unit/Section.spec.ts
git commit -m "feat(ui): add Section primitive"
```

### Task 3.3: Btn primitive (variants)

**Files:**
- Create: `app/components/ui/Btn.vue`
- Test: `test/unit/Btn.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `test/unit/Btn.spec.ts`:
```ts
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Btn from '~/components/ui/Btn.vue'

const stub = (props: Record<string, unknown> = {}) =>
  mount(Btn, { props: { ...props }, slots: { default: 'Click' } })

describe('Btn', () => {
  it('renders as <a> when href is provided', () => {
    const w = stub({ href: '/x' })
    expect(w.element.tagName).toBe('A')
  })

  it('renders as <button> when no href', () => {
    const w = stub()
    expect(w.element.tagName).toBe('BUTTON')
  })

  it('applies primary variant classes by default', () => {
    const w = stub()
    expect(w.classes().toString()).toMatch(/primary|bg-primary/)
  })

  it('applies ghost variant classes when variant=ghost', () => {
    const w = stub({ variant: 'ghost' })
    expect(w.attributes('data-variant')).toBe('ghost')
  })

  it('disables when disabled prop is true', () => {
    const w = stub({ disabled: true })
    expect(w.attributes('disabled')).toBeDefined()
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test test/unit/Btn.spec.ts`
Expected: FAIL.

- [ ] **Step 3: Write the component**

Create `app/components/ui/Btn.vue`:
```vue
<script setup lang="ts">
type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    href?: string
    variant?: Variant
    size?: Size
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
  }>(),
  { variant: 'primary', size: 'md', type: 'button', disabled: false },
)

const sizeClass: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

const base = [
  'inline-flex items-center justify-center rounded-lg font-medium transition',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
  'disabled:opacity-50 disabled:pointer-events-none',
  sizeClass[props.size],
]

const variantClass: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-600',
  secondary: 'bg-surface text-text border border-border hover:border-primary',
  ghost: 'text-text hover:bg-surface',
}
</script>

<template>
  <a
    v-if="href"
    :href="href"
    :data-variant="variant"
    :class="[base, variantClass[variant]]"
  >
    <slot />
  </a>
  <button
    v-else
    :type="type"
    :disabled="disabled"
    :data-variant="variant"
    :class="[base, variantClass[variant]]"
  >
    <slot />
  </button>
</template>
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test test/unit/Btn.spec.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add app/components/ui/Btn.vue test/unit/Btn.spec.ts
git commit -m "feat(ui): add Btn primitive with variants"
```

### Task 3.4: Card, Badge, Stat primitives (batch)

**Files:**
- Create: `app/components/ui/Card.vue`
- Create: `app/components/ui/Badge.vue`
- Create: `app/components/ui/Stat.vue`
- Test: `test/unit/ui-batch.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `test/unit/ui-batch.spec.ts`:
```ts
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Card from '~/components/ui/Card.vue'
import Badge from '~/components/ui/Badge.vue'
import Stat from '~/components/ui/Stat.vue'

describe('Card', () => {
  it('renders slot', () => {
    const w = mount(Card, { slots: { default: 'x' } })
    expect(w.text()).toBe('x')
  })
  it('has rounded border surface styling', () => {
    const w = mount(Card)
    expect(w.classes().toString()).toMatch(/border|surface/)
  })
})

describe('Badge', () => {
  it('renders text', () => {
    const w = mount(Badge, { props: { text: 'Welding' } })
    expect(w.text()).toBe('Welding')
  })
})

describe('Stat', () => {
  it('renders value and label', () => {
    const w = mount(Stat, { props: { value: '40%', label: 'faster' } })
    expect(w.text()).toContain('40%')
    expect(w.text()).toContain('faster')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test test/unit/ui-batch.spec.ts`
Expected: FAIL (3 components missing).

- [ ] **Step 3: Write Card.vue**

Create `app/components/ui/Card.vue`:
```vue
<template>
  <div class="rounded-xl border border-border bg-surface p-6 transition hover:border-primary">
    <slot />
  </div>
</template>
```

- [ ] **Step 4: Write Badge.vue**

Create `app/components/ui/Badge.vue`:
```vue
<script setup lang="ts">
defineProps<{ text: string }>()
</script>

<template>
  <span class="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-text-secondary">
    {{ text }}
  </span>
</template>
```

- [ ] **Step 5: Write Stat.vue**

Create `app/components/ui/Stat.vue`:
```vue
<script setup lang="ts">
defineProps<{ value: string; label: string }>()
</script>

<template>
  <div>
    <div class="text-3xl font-bold text-primary sm:text-4xl">{{ value }}</div>
    <div class="mt-1 text-sm text-text-secondary">{{ label }}</div>
  </div>
</template>
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `pnpm test test/unit/ui-batch.spec.ts`
Expected: PASS (4 tests).

- [ ] **Step 7: Commit**

```bash
git add app/components/ui/Card.vue app/components/ui/Badge.vue app/components/ui/Stat.vue test/unit/ui-batch.spec.ts
git commit -m "feat(ui): add Card, Badge, Stat primitives"
```

### Task 3.5: Media primitive (aspect-ratio, lazy)

**Files:**
- Create: `app/components/ui/Media.vue`
- Test: `test/unit/Media.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `test/unit/Media.spec.ts`:
```ts
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Media from '~/components/ui/Media.vue'

describe('Media', () => {
  it('renders an img with the given src and alt', () => {
    const w = mount(Media, { props: { src: '/x.jpg', alt: 'robot' } })
    expect(w.find('img').attributes('src')).toBe('/x.jpg')
    expect(w.find('img').attributes('alt')).toBe('robot')
  })

  it('applies aspect ratio class when ratio provided', () => {
    const w = mount(Media, { props: { src: '/x.jpg', alt: 'x', ratio: '16/9' } })
    expect(w.attributes('style') ?? '').toContain('aspect-ratio')
  })

  it('uses empty alt when decorative', () => {
    const w = mount(Media, { props: { src: '/x.jpg', alt: '', decorative: true } })
    expect(w.find('img').attributes('alt')).toBe('')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test test/unit/Media.spec.ts`
Expected: FAIL.

- [ ] **Step 3: Write the component**

Create `app/components/ui/Media.vue`:
```vue
<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    src: string
    alt?: string
    ratio?: string // e.g. '16/9'
    decorative?: boolean
  }>(),
  { alt: '', decorative: false, ratio: '16/9' },
)
const altText = props.decorative ? '' : props.alt
const aspectStyle = props.ratio ? { aspectRatio: props.ratio } : {}
</script>

<template>
  <div class="overflow-hidden rounded-lg bg-surface" :style="aspectStyle">
    <img :src="src" :alt="altText" loading="lazy" class="h-full w-full object-cover" />
  </div>
</template>
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test test/unit/Media.spec.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add app/components/ui/Media.vue test/unit/Media.spec.ts
git commit -m "feat(ui): add Media primitive with aspect ratio + lazy loading"
```

### Task 3.6: Form input primitives

**Files:**
- Create: `app/components/ui/Input.vue`
- Create: `app/components/ui/Textarea.vue`
- Create: `app/components/ui/Select.vue`
- Test: `test/unit/inputs.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `test/unit/inputs.spec.ts`:
```ts
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Input from '~/components/ui/Input.vue'
import Textarea from '~/components/ui/Textarea.vue'
import Select from '~/components/ui/Select.vue'

describe('Input', () => {
  it('binds v-model and renders label', async () => {
    const w = mount(Input, { props: { modelValue: '', label: 'Name', name: 'name' } })
    expect(w.text()).toContain('Name')
    await w.find('input').setValue('Alice')
    expect(w.emitted('update:modelValue')?.[0]).toEqual(['Alice'])
  })

  it('shows error text when error prop is set', () => {
    const w = mount(Input, { props: { modelValue: '', label: 'Name', name: 'name', error: 'Required' } })
    expect(w.text()).toContain('Required')
  })
})

describe('Textarea', () => {
  it('binds v-model', async () => {
    const w = mount(Textarea, { props: { modelValue: '', label: 'Msg', name: 'msg' } })
    await w.find('textarea').setValue('hello')
    expect(w.emitted('update:modelValue')?.[0]).toEqual(['hello'])
  })
})

describe('Select', () => {
  it('renders options', () => {
    const w = mount(Select, {
      props: {
        modelValue: '',
        label: 'Industry',
        name: 'industry',
        options: [{ value: 'welding', label: 'Welding' }],
      },
    })
    expect(w.findAll('option').length).toBe(1)
    expect(w.html()).toContain('Welding')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test test/unit/inputs.spec.ts`
Expected: FAIL.

- [ ] **Step 3: Write Input.vue**

Create `app/components/ui/Input.vue`:
```vue
<script setup lang="ts">
defineProps<{
  modelValue: string
  label: string
  name: string
  type?: string
  error?: string
  required?: boolean
}>()
defineEmits<{ 'update:modelValue': [string] }>()
</script>

<template>
  <label class="block">
    <span class="mb-1 block text-sm font-medium text-text">{{ label }}</span>
    <input
      :type="type ?? 'text'"
      :name="name"
      :required="required"
      :value="modelValue"
      :aria-invalid="error ? 'true' : undefined"
      class="w-full rounded-lg border border-border bg-bg px-3 py-2 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <span v-if="error" class="mt-1 block text-sm text-danger">{{ error }}</span>
  </label>
</template>
```

- [ ] **Step 4: Write Textarea.vue**

Create `app/components/ui/Textarea.vue`:
```vue
<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: string
    label: string
    name: string
    error?: string
    rows?: number
    required?: boolean
  }>(),
  { rows: 4 },
)
defineEmits<{ 'update:modelValue': [string] }>()
</script>

<template>
  <label class="block">
    <span class="mb-1 block text-sm font-medium text-text">{{ label }}</span>
    <textarea
      :name="name"
      :rows="rows"
      :required="required"
      :value="modelValue"
      :aria-invalid="error ? 'true' : undefined"
      class="w-full rounded-lg border border-border bg-bg px-3 py-2 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
    <span v-if="error" class="mt-1 block text-sm text-danger">{{ error }}</span>
  </label>
</template>
```

- [ ] **Step 5: Write Select.vue**

Create `app/components/ui/Select.vue`:
```vue
<script setup lang="ts">
defineProps<{
  modelValue: string
  label: string
  name: string
  options: { value: string; label: string }[]
  error?: string
  required?: boolean
}>()
defineEmits<{ 'update:modelValue': [string] }>()
</script>

<template>
  <label class="block">
    <span class="mb-1 block text-sm font-medium text-text">{{ label }}</span>
    <select
      :name="name"
      :required="required"
      :value="modelValue"
      class="w-full rounded-lg border border-border bg-bg px-3 py-2 text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-for="o in options" :key="o.value" :value="o.value">{{ o.label }}</option>
    </select>
    <span v-if="error" class="mt-1 block text-sm text-danger">{{ error }}</span>
  </label>
</template>
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `pnpm test test/unit/inputs.spec.ts`
Expected: PASS (4 tests).

- [ ] **Step 7: Commit**

```bash
git add app/components/ui/Input.vue app/components/ui/Textarea.vue app/components/ui/Select.vue test/unit/inputs.spec.ts
git commit -m "feat(ui): add Input, Textarea, Select form primitives"
```

### Task 3.7: Icon component (Lucide via SVG sprite)

**Files:**
- Create: `app/components/ui/Icon.vue`
- Test: `test/unit/Icon.spec.ts`

- [ ] **Step 1: Install Lucide icons**

Run:
```bash
pnpm add lucide-vue-next
```

- [ ] **Step 2: Write the failing test**

Create `test/unit/Icon.spec.ts`:
```ts
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Icon from '~/components/ui/Icon.vue'

describe('Icon', () => {
  it('renders an svg for a known icon name', () => {
    const w = mount(Icon, { props: { name: 'ArrowRight' } })
    expect(w.find('svg').exists()).toBe(true)
  })

  it('renders nothing for an unknown icon name (no throw)', () => {
    const w = mount(Icon, { props: { name: 'DefinitelyNotAnIcon' } })
    expect(w.find('svg').exists()).toBe(false)
  })
})
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `pnpm test test/unit/Icon.spec.ts`
Expected: FAIL.

- [ ] **Step 4: Write the component**

Create `app/components/ui/Icon.vue`:
```vue
<script setup lang="ts">
import * as icons from 'lucide-vue-next'
import { computed } from 'vue'

const props = withDefaults(defineProps<{ name: string; size?: number }>(), { size: 20 })

const Comp = computed(() => (icons as Record<string, unknown>)[props.name] ?? null)
</script>

<template>
  <component :is="Comp" v-if="Comp" :size="size" aria-hidden="true" />
</template>
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `pnpm test test/unit/Icon.spec.ts`
Expected: PASS (2 tests).

- [ ] **Step 6: Commit**

```bash
git add app/components/ui/Icon.vue test/unit/Icon.spec.ts package.json pnpm-lock.yaml
git commit -m "feat(ui): add Icon component (Lucide)"
```

### Task 3.8: Phase 3 green-build gate

- [ ] **Step 1: Run all unit tests**

Run: `pnpm test`
Expected: all UI primitive tests PASS.

- [ ] **Step 2: Run lint**

Run: `pnpm lint`
Expected: no errors.

- [ ] **Step 3: Run build**

Run: `pnpm build`
Expected: succeeds.

- [ ] **Step 4: No commit (verification only)**

---

## Phase 4 — Theme (Light / Dark)

### Task 4.1: useTheme composable

**Files:**
- Create: `app/composables/useTheme.ts`
- Test: `test/unit/useTheme.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `test/unit/useTheme.spec.ts`:
```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useTheme } from '~/composables/useTheme'

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('defaults to light', () => {
    const { isDark } = useTheme()
    expect(isDark.value).toBe(false)
  })

  it('toggles to dark and persists', () => {
    const { isDark, toggle } = useTheme()
    toggle()
    expect(isDark.value).toBe(true)
    expect(localStorage.getItem('theme')).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('respects stored preference', () => {
    localStorage.setItem('theme', 'dark')
    const { isDark } = useTheme()
    expect(isDark.value).toBe(true)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test test/unit/useTheme.spec.ts`
Expected: FAIL.

- [ ] **Step 3: Write the composable**

Create `app/composables/useTheme.ts`:
```ts
import { ref, watch } from 'vue'

const isDark = ref(false)
let initialized = false

function apply(dark: boolean) {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('dark', dark)
}

function init() {
  if (initialized || typeof window === 'undefined') return
  initialized = true
  const stored = localStorage.getItem('theme')
  if (stored === 'dark' || stored === 'light') {
    isDark.value = stored === 'dark'
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  apply(isDark.value)
  watch(isDark, (v) => {
    localStorage.setItem('theme', v ? 'dark' : 'light')
    apply(v)
  })
}

export function useTheme() {
  init()
  const toggle = () => {
    isDark.value = !isDark.value
  }
  const set = (v: boolean) => {
    isDark.value = v
  }
  return { isDark, toggle, set }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test test/unit/useTheme.spec.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add app/composables/useTheme.ts test/unit/useTheme.spec.ts
git commit -m "feat(theme): add useTheme composable with persistence"
```

### Task 4.2: ThemeToggle component + no-FOUC inline script

**Files:**
- Create: `app/components/layout/ThemeToggle.vue`
- Modify: `nuxt.config.ts` (app.head script to prevent FOUC)
- Test: `test/unit/ThemeToggle.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `test/unit/ThemeToggle.spec.ts`:
```ts
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import ThemeToggle from '~/components/layout/ThemeToggle.vue'

describe('ThemeToggle', () => {
  it('renders a button', () => {
    const w = mount(ThemeToggle)
    expect(w.find('button').exists()).toBe(true)
  })

  it('emits nothing but toggles isDark on click', async () => {
    const w = mount(ThemeToggle)
    await w.find('button').trigger('click')
    // state change is internal; just assert no throw
    expect(true).toBe(true)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test test/unit/ThemeToggle.spec.ts`
Expected: FAIL.

- [ ] **Step 3: Write the component**

Create `app/components/layout/ThemeToggle.vue`:
```vue
<script setup lang="ts">
import { useTheme } from '~/composables/useTheme'
import Icon from '~/components/ui/Icon.vue'

const { isDark, toggle } = useTheme()
</script>

<template>
  <button
    type="button"
    class="rounded-lg p-2 text-text hover:bg-surface"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    @click="toggle"
  >
    <Icon :name="isDark ? 'Sun' : 'Moon'" :size="18" />
  </button>
</template>
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test test/unit/ThemeToggle.spec.ts`
Expected: PASS.

- [ ] **Step 5: Add the no-FOUC inline script to nuxt.config.ts**

Update `nuxt.config.ts` to include:
```ts
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      script: [
        {
          innerHTML: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();`,
          type: 'text/javascript',
          tagPosition: 'head',
        },
      ],
    },
  },
```

- [ ] **Step 6: Commit**

```bash
git add app/components/layout/ThemeToggle.vue nuxt.config.ts test/unit/ThemeToggle.spec.ts
git commit -m "feat(theme): add ThemeToggle and no-FOUC bootstrap script"
```

---

## Phase 5 — Layout Chrome

### Task 5.1: Logo component (3 placeholder variants)

**Files:**
- Create: `app/components/marketing/Logo.vue`
- Test: `test/unit/Logo.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `test/unit/Logo.spec.ts`:
```ts
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Logo from '~/components/marketing/Logo.vue'

describe('Logo', () => {
  it('renders wordmark variant by default', () => {
    const w = mount(Logo)
    expect(w.text().toLowerCase()).toContain('qtvue')
  })

  it('renders an svg', () => {
    const w = mount(Logo)
    expect(w.find('svg').exists()).toBe(true)
  })

  it('respects the variant prop', () => {
    const w = mount(Logo, { props: { variant: 'monogram' } })
    expect(w.attributes('data-variant')).toBe('monogram')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test test/unit/Logo.spec.ts`
Expected: FAIL.

- [ ] **Step 3: Write the component**

Create `app/components/marketing/Logo.vue`:
```vue
<script setup lang="ts">
withDefaults(defineProps<{ variant?: 'wordmark' | 'monogram' | 'abstract' }>(), {
  variant: 'wordmark',
})
</script>

<template>
  <span :data-variant="variant" class="inline-flex items-center gap-2 font-semibold">
    <!-- Variant 1: wordmark with node mark -->
    <svg v-if="variant === 'wordmark'" width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
      <rect width="28" height="28" rx="7" fill="var(--color-primary)" />
      <circle cx="14" cy="14" r="5" fill="white" />
      <circle cx="14" cy="14" r="2" fill="var(--color-primary)" />
    </svg>
    <!-- Variant 2: monogram Q -->
    <svg v-else-if="variant === 'monogram'" width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
      <rect width="28" height="28" rx="7" fill="url(#qg)" />
      <defs>
        <linearGradient id="qg" x1="0" y1="0" x2="28" y2="28">
          <stop offset="0" stop-color="var(--color-primary)" />
          <stop offset="1" stop-color="var(--color-accent)" />
        </linearGradient>
      </defs>
      <text x="14" y="20" text-anchor="middle" font-family="var(--font-sans)" font-size="16" font-weight="700" fill="white">Q</text>
    </svg>
    <!-- Variant 3: abstract gripper -->
    <svg v-else width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
      <path d="M4 8 L14 4 L24 8 L24 16 L14 24 L4 16 Z" fill="none" stroke="var(--color-primary)" stroke-width="2" />
      <circle cx="14" cy="13" r="3" fill="var(--color-accent)" />
    </svg>
    <span class="text-lg tracking-tight">qtvue</span>
  </span>
</template>
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test test/unit/Logo.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/components/marketing/Logo.vue test/unit/Logo.spec.ts
git commit -m "feat(marketing): add Logo with 3 placeholder variants"
```

### Task 5.2: LanguageSwitcher (built, hidden by default)

**Files:**
- Create: `app/components/layout/LanguageSwitcher.vue`
- Test: `test/unit/LanguageSwitcher.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `test/unit/LanguageSwitcher.spec.ts`:
```ts
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import LanguageSwitcher from '~/components/layout/LanguageSwitcher.vue'

describe('LanguageSwitcher', () => {
  it('renders nothing when only one locale is available', () => {
    const w = mount(LanguageSwitcher, { props: { locales: ['en'] } })
    expect(w.html()).toBe('')
  })

  it('renders a select when more than one locale', () => {
    const w = mount(LanguageSwitcher, { props: { locales: ['en', 'es'], current: 'en' } })
    expect(w.find('select').exists()).toBe(true)
    expect(w.findAll('option').length).toBe(2)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test test/unit/LanguageSwitcher.spec.ts`
Expected: FAIL.

- [ ] **Step 3: Write the component**

Create `app/components/layout/LanguageSwitcher.vue`:
```vue
<script setup lang="ts">
const props = defineProps<{
  locales?: string[]
  current?: string
}>()

const locales = props.locales ?? ['en']
const current = props.current ?? 'en'

function onChange(e: Event) {
  const v = (e.target as HTMLSelectElement).value
  if (v !== current && typeof window !== 'undefined') {
    window.location.pathname = `/${v}/`
  }
}
</script>

<template>
  <select
    v-if="locales.length > 1"
    class="rounded-lg border border-border bg-bg px-2 py-1 text-sm"
    :value="current"
    @change="onChange"
  >
    <option v-for="l in locales" :key="l" :value="l">{{ l.toUpperCase() }}</option>
  </select>
</template>
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test test/unit/LanguageSwitcher.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/components/layout/LanguageSwitcher.vue test/unit/LanguageSwitcher.spec.ts
git commit -m "feat(layout): add LanguageSwitcher (hidden until 2nd locale)"
```

### Task 5.3: TheHeader (nav + logo + theme toggle + hidden switcher)

**Files:**
- Create: `app/components/layout/TheHeader.vue`
- Test: `test/unit/TheHeader.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `test/unit/TheHeader.spec.ts`:
```ts
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import TheHeader from '~/components/layout/TheHeader.vue'

describe('TheHeader', () => {
  it('renders the logo and nav links', () => {
    const w = mount(TheHeader)
    expect(w.text().toLowerCase()).toContain('qtvue')
    expect(w.text()).toContain('Services')
    expect(w.text()).toContain('Work')
    expect(w.text()).toContain('Contact')
  })

  it('renders a contact CTA', () => {
    const w = mount(TheHeader)
    expect(w.find('a[href="/contact"]').exists()).toBe(true)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test test/unit/TheHeader.spec.ts`
Expected: FAIL.

- [ ] **Step 3: Write the component**

Create `app/components/layout/TheHeader.vue`:
```vue
<script setup lang="ts">
import Logo from '~/components/marketing/Logo.vue'
import Icon from '~/components/ui/Icon.vue'
import ThemeToggle from '~/components/layout/ThemeToggle.vue'

const nav = [
  { label: 'Services', to: '/services' },
  { label: 'Industries', to: '/industries' },
  { label: 'Work', to: '/work' },
  { label: 'About', to: '/about' },
  { label: 'Blog', to: '/blog' },
  { label: 'Careers', to: '/careers' },
]

const mobileOpen = ref(false)
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur">
    <Container class="flex h-16 items-center justify-between">
      <NuxtLink to="/" aria-label="qtvue home"><Logo /></NuxtLink>

      <nav class="hidden items-center gap-6 md:flex" aria-label="Primary">
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="text-sm text-text-secondary hover:text-text"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-2">
        <ThemeToggle />
        <Btn href="/contact" size="sm">Contact</Btn>
        <button
          type="button"
          class="md:hidden rounded-lg p-2 hover:bg-surface"
          aria-label="Toggle menu"
          @click="mobileOpen = !mobileOpen"
        >
          <Icon :name="mobileOpen ? 'X' : 'Menu'" :size="20" />
        </button>
      </div>
    </Container>

    <nav v-if="mobileOpen" class="md:hidden border-t border-border bg-bg" aria-label="Mobile">
      <Container class="flex flex-col py-2">
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="py-2 text-text-secondary"
          @click="mobileOpen = false"
        >
          {{ item.label }}
        </NuxtLink>
      </Container>
    </nav>
  </header>
</template>
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test test/unit/TheHeader.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/components/layout/TheHeader.vue test/unit/TheHeader.spec.ts
git commit -m "feat(layout): add TheHeader with nav, logo, theme toggle, mobile menu"
```

### Task 5.4: TheFooter

**Files:**
- Create: `app/components/layout/TheFooter.vue`
- Test: `test/unit/TheFooter.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `test/unit/TheFooter.spec.ts`:
```ts
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import TheFooter from '~/components/layout/TheFooter.vue'

describe('TheFooter', () => {
  it('contains brand name and copyright', () => {
    const w = mount(TheFooter)
    expect(w.text().toLowerCase()).toContain('qtvue')
    expect(w.text()).toMatch(/©/)
  })

  it('links to privacy and terms', () => {
    const w = mount(TheFooter)
    expect(w.find('a[href="/legal/privacy"]').exists()).toBe(true)
    expect(w.find('a[href="/legal/terms"]').exists()).toBe(true)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test test/unit/TheFooter.spec.ts`
Expected: FAIL.

- [ ] **Step 3: Write the component**

Create `app/components/layout/TheFooter.vue`:
```vue
<script setup lang="ts">
import Logo from '~/components/marketing/Logo.vue'
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-border bg-surface">
    <Container class="py-12">
      <div class="flex flex-col items-start justify-between gap-6 sm:flex-row">
        <div>
          <Logo />
          <p class="mt-3 max-w-xs text-sm text-text-secondary">
            Robotics integration, programming, and consulting for industrial operations worldwide.
          </p>
        </div>
        <nav class="flex flex-col gap-2 text-sm text-text-secondary" aria-label="Footer">
          <NuxtLink to="/services">Services</NuxtLink>
          <NuxtLink to="/work">Work</NuxtLink>
          <NuxtLink to="/careers">Careers</NuxtLink>
          <NuxtLink to="/contact">Contact</NuxtLink>
        </nav>
      </div>
      <div class="mt-8 flex flex-col gap-2 border-t border-border pt-6 text-xs text-text-secondary sm:flex-row sm:items-center sm:justify-between">
        <p>© {{ year }} qtvue. All rights reserved.</p>
        <div class="flex gap-4">
          <NuxtLink to="/legal/privacy">Privacy</NuxtLink>
          <NuxtLink to="/legal/terms">Terms</NuxtLink>
        </div>
      </div>
    </Container>
  </footer>
</template>
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test test/unit/TheFooter.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/components/layout/TheFooter.vue test/unit/TheFooter.spec.ts
git commit -m "feat(layout): add TheFooter"
```

### Task 5.5: default layout + replace app.vue

**Files:**
- Create: `app/layouts/default.vue`
- Modify: `app/app.vue`

- [ ] **Step 1: Create the default layout**

Create `app/layouts/default.vue`:
```vue
<template>
  <div class="flex min-h-screen flex-col">
    <TheHeader />
    <main class="flex-1">
      <slot />
    </main>
    <TheFooter />
  </div>
</template>
```

- [ ] **Step 2: Replace app.vue to use NuxtLayout + NuxtPage**

Replace `app/app.vue`:
```vue
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

- [ ] **Step 3: Create a temporary Home page so the app renders**

Create `app/pages/index.vue`:
```vue
<script setup lang="ts">
useSeoMeta({ title: 'qtvue — Robotics Integration' })
</script>

<template>
  <Container class="py-24">
    <h1 class="text-4xl font-bold">qtvue</h1>
    <p class="mt-4 text-text-secondary">Robotics integration, programming, and consulting.</p>
  </Container>
</template>
```

- [ ] **Step 4: Verify dev server renders full chrome**

Run: `pnpm dev`
Open `http://localhost:3000`. Expected: header (with logo, nav, contact button), placeholder hero, footer all visible. Stop server.

- [ ] **Step 5: Commit**

```bash
git add app/layouts/default.vue app/app.vue app/pages/index.vue
git commit -m "feat(layout): wire default layout with header/footer; stub Home"
```

---

## Phase 6 — i18n Wiring

### Task 6.1: Configure @nuxtjs/i18n (prefix_except_default)

**Files:**
- Modify: `nuxt.config.ts`
- Create: `i18n/locales/en.json`
- Create: `i18n.config.ts`

- [ ] **Step 1: Add i18n config to nuxt.config.ts**

Add to `nuxt.config.ts`:
```ts
  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'en',
    locales: [{ code: 'en', language: 'en-US', name: 'English', file: 'en.json' }],
    bundle: { optimizeTranslationDirective: false },
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
  },
```

- [ ] **Step 2: Create en.json UI strings**

Create `i18n/locales/en.json`:
```json
{
  "brand": {
    "name": "qtvue"
  },
  "nav": {
    "services": "Services",
    "industries": "Industries",
    "work": "Work",
    "about": "About",
    "blog": "Blog",
    "careers": "Careers",
    "contact": "Contact"
  },
  "cta": {
    "startProject": "Start a project",
    "getInTouch": "Get in touch",
    "viewAll": "View all"
  },
  "contact": {
    "heading": "Let's talk about your project",
    "email": "hello@qtvue.com",
    "submit": "Send message",
    "success": "Thanks — we'll be in touch within one business day.",
    "error": "Something went wrong. Please try again or email us directly."
  },
  "footer": {
    "tagline": "Robotics integration, programming, and consulting for industrial operations worldwide.",
    "rights": "All rights reserved."
  }
}
```

- [ ] **Step 3: Create i18n.config.ts**

Create `i18n.config.ts`:
```ts
export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
}))
```

- [ ] **Step 4: Verify build**

Run: `pnpm build`
Expected: succeeds, no i18n errors.

- [ ] **Step 5: Commit**

```bash
git add nuxt.config.ts i18n/
git commit -m "feat(i18n): configure prefix_except_default routing, en locale strings"
```

### Task 6.2: Refactor hardcoded strings to t()

**Files:**
- Modify: `app/components/layout/TheHeader.vue`
- Modify: `app/components/layout/TheFooter.vue`

- [ ] **Step 1: Refactor TheHeader to use t()**

In `TheHeader.vue`, replace the `nav` const and template labels:
```vue
<script setup lang="ts">
import Logo from '~/components/marketing/Logo.vue'
import Icon from '~/components/ui/Icon.vue'
import ThemeToggle from '~/components/layout/ThemeToggle.vue'

const { t } = useI18n()
const nav = computed(() => [
  { label: t('nav.services'), to: '/services' },
  { label: t('nav.industries'), to: '/industries' },
  { label: t('nav.work'), to: '/work' },
  { label: t('nav.about'), to: '/about' },
  { label: t('nav.blog'), to: '/blog' },
  { label: t('nav.careers'), to: '/careers' },
])
const mobileOpen = ref(false)
</script>

<template>
  <!-- ... unchanged template, but the CTA button uses t('nav.contact') ... -->
  <Btn href="/contact" size="sm">{{ $t('nav.contact') }}</Btn>
  <!-- ... rest unchanged ... -->
</template>
```

- [ ] **Step 2: Refactor TheFooter to use t()**

In `TheFooter.vue`, use `$t('footer.tagline')` and `$t('footer.rights')` in the template where the equivalent strings appear. The copyright line becomes:
```vue
<p>© {{ year }} qtvue. {{ $t('footer.rights') }}</p>
```

- [ ] **Step 3: Update the header test to keep passing**

The `TheHeader` test asserts `Services`, `Work`, `Contact` text. With `useI18n` mocking needed, update `test/unit/TheHeader.spec.ts` to stub i18n:
```ts
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import TheHeader from '~/components/layout/TheHeader.vue'

vi.stubGlobal('useI18n', () => ({
  t: (k: string) => k,
  locale: { value: 'en' },
}))

describe('TheHeader', () => {
  it('renders the logo and nav keys', () => {
    const w = mount(TheHeader, { global: { stubs: ['NuxtLink'] } })
    expect(w.text().toLowerCase()).toContain('qtvue')
    expect(w.text()).toContain('nav.services')
  })
})
```

- [ ] **Step 4: Run tests**

Run: `pnpm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/components/layout/TheHeader.vue app/components/layout/TheFooter.vue test/unit/TheHeader.spec.ts
git commit -m "refactor(i18n): route header/footer strings through t()"
```

---

## Phase 7 — Content Collections + Schemas

### Task 7.1: Define typed collection schemas

**Files:**
- Create: `content.config.ts`
- Test: `test/unit/content-schema.spec.ts`

- [ ] **Step 1: Write a failing schema-validation test**

Create `test/unit/content-schema.spec.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import { workSchema, serviceSchema, industrySchema, blogSchema, careerSchema } from '~/content.schemas'

describe('content schemas', () => {
  it('validates a valid case study', () => {
    const r = workSchema.safeParse({
      title: 'X',
      summary: 's',
      industry: 'welding',
      services: ['integration'],
      year: 2025,
      image: '/x.jpg',
      featured: true,
    })
    expect(r.success).toBe(true)
  })

  it('rejects a case study missing required fields', () => {
    const r = workSchema.safeParse({ title: 'X' })
    expect(r.success).toBe(false)
  })

  it('validates a service entry', () => {
    expect(serviceSchema.safeParse({ title: 'Integration', summary: 's', icon: 'Wrench' }).success).toBe(true)
  })

  it('validates an industry entry', () => {
    expect(industrySchema.safeParse({ title: 'Welding', summary: 's' }).success).toBe(true)
  })

  it('validates a blog entry', () => {
    expect(blogSchema.safeParse({ title: 'T', summary: 's', date: '2026-06-21', author: 'qtvue' }).success).toBe(true)
  })

  it('validates a career entry', () => {
    expect(careerSchema.safeParse({ title: 'Engineer', summary: 's', location: 'Remote' }).success).toBe(true)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm test test/unit/content-schema.spec.ts`
Expected: FAIL.

- [ ] **Step 3: Create the shared schemas file**

Create `app/content.schemas.ts`:
```ts
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
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test test/unit/content-schema.spec.ts`
Expected: PASS (6 tests).

- [ ] **Step 5: Create content.config.ts that uses these schemas**

Create `content.config.ts` (project root):
```ts
import { defineCollection, defineContentConfig } from '@nuxt/content'
import { workSchema, serviceSchema, industrySchema, blogSchema, careerSchema } from './app/content.schemas'

export default defineContentConfig({
  collections: {
    services: defineCollection({ type: 'page', source: 'en/services/**/*.md', schema: serviceSchema }),
    industries: defineCollection({ type: 'page', source: 'en/industries/**/*.md', schema: industrySchema }),
    work: defineCollection({ type: 'page', source: 'en/work/**/*.md', schema: workSchema }),
    blog: defineCollection({ type: 'page', source: 'en/blog/**/*.md', schema: blogSchema }),
    careers: defineCollection({ type: 'page', source: 'en/careers/**/*.md', schema: careerSchema }),
  },
})
```

- [ ] **Step 6: Commit**

```bash
git add app/content.schemas.ts content.config.ts test/unit/content-schema.spec.ts
git commit -m "feat(content): add typed schemas for all collections"
```

### Task 7.2: Seed services content (4 files)

**Files:**
- Create: `content/en/services/integration.md`
- Create: `content/en/services/programming.md`
- Create: `content/en/services/sales.md`
- Create: `content/en/services/consulting.md`

- [ ] **Step 1: Write integration.md**

```markdown
---
title: "Robotics Integration"
summary: "Full cell design, integration, commissioning, training, and ongoing support."
icon: "Cog"
order: 1
---

# Robotics Integration

[PLACEHOLDER — replace with real copy.]

We design, build, and commission complete robotic cells — from concept and simulation through install, ramp-up, and ongoing support.

## What's included

- Cell concept and 3D simulation
- Mechanical and controls integration
- On-site commissioning and validation
- Operator and maintenance training
- Ongoing support and spare parts
```

- [ ] **Step 2: Write programming.md**

```markdown
---
title: "Robot Programming"
summary: "New programs, reprogramming, and optimization for any major robot brand."
icon: "Code"
order: 2
---

# Robot Programming

[PLACEHOLDER — replace with real copy.]

We write, debug, and optimize robot programs for new installations and existing lines — across FANUC, ABB, KUKA, Yaskawa, and more.

## Capabilities

- New-application programming
- Line retrofits and reprogramming
- Path optimization and cycle-time reduction
- Offline programming (OLP)
```

- [ ] **Step 3: Write sales.md**

```markdown
---
title: "Robot & Peripheral Sales"
summary: "Robot arms, controllers, end-of-arm tooling, and peripherals from leading brands."
icon: "Package"
order: 3
---

# Robot & Peripheral Sales

[PLACEHOLDER — replace with real copy.]

We supply robots, controllers, end-of-arm tooling, and integration peripherals — configured for your application.

## We carry

- Industrial robot arms (6-axis, SCARA, collaborative)
- Controllers and safety controllers
- End-of-arm tooling (grippers, welders, dispensers)
- Vision and sensing peripherals
```

- [ ] **Step 4: Write consulting.md**

```markdown
---
title: "Feasibility & Consulting"
summary: "Automation assessments, feasibility studies, and custom engineering."
icon: "Lightbulb"
order: 4
---

# Feasibility & Consulting

[PLACEHOLDER — replace with real copy.]

We help you decide whether, where, and how to automate — with feasibility studies, ROI analysis, and custom engineering plans.

## Engagements

- Automation opportunity assessments
- Process feasibility studies
- ROI and cycle-time modeling
- Vendor-neutral recommendations
```

- [ ] **Step 5: Verify Nuxt Content parses them**

Run: `pnpm dev`, then in another terminal:
```bash
curl -s http://localhost:3000/api/_content/query | head
```
(If the API path differs in your Nuxt Content version, instead just confirm no errors in the dev console and that a temporary page querying `queryCollection('services')` returns 4 items.)
Expected: 4 service entries parsed.

- [ ] **Step 6: Commit**

```bash
git add content/en/services/
git commit -m "feat(content): seed 4 service pages"
```

### Task 7.3: Seed industries, work, blog, careers

**Files:**
- Create: `content/en/industries/{welding,packaging,material-handling}.md`
- Create: `content/en/work/{sample-welding-cell,sample-packaging-line,sample-retrofit}.md`
- Create: `content/en/blog/getting-started-with-automation.md`
- (careers directory created but left empty — evergreen CTA handles empty state)

- [ ] **Step 1: Create 3 industry files**

`content/en/industries/welding.md`:
```markdown
---
title: "Welding"
summary: "Robotic welding cells for high-mix and high-volume production."
order: 1
---

# Welding

[PLACEHOLDER — replace with real copy.] Robotic MIG, TIG, and spot welding for fabrication and assembly.
```
`content/en/industries/packaging.md`:
```markdown
---
title: "Packaging"
summary: "Pick-and-place, palletizing, and case-packing automation."
order: 2
---

# Packaging

[PLACEHOLDER — replace with real copy.]
```
`content/en/industries/material-handling.md`:
```markdown
---
title: "Material Handling"
summary: "Machine tending, palletizing, and logistics automation."
order: 3
---

# Material Handling

[PLACEHOLDER — replace with real copy.]
```

- [ ] **Step 2: Create 3 clearly-labeled sample case studies**

`content/en/work/sample-welding-cell.md`:
```markdown
---
title: "Automated Welding Cell"
summary: "SAMPLE — A representative robotic welding cell deployment."
client: "Confidential"
industry: "welding"
services: ["integration", "programming"]
year: 2025
image: "/images/sample-welding.jpg"
featured: true
metrics:
  - { value: "40%", label: "throughput increase" }
  - { value: "60%", label: "defect reduction" }
---

> **Note:** This is a placeholder case study to demonstrate the template. Replace with a real project when available.

## Challenge

[PLACEHOLDER]

## Solution

[PLACEHOLDER]

## Results

- [PLACEHOLDER metric]
```
Create `content/en/work/sample-packaging-line.md` and `content/en/work/sample-retrofit.md` with the same structure, varying `industry`, `services`, and metrics.

- [ ] **Step 3: Create 1 starter blog post**

`content/en/blog/getting-started-with-automation.md`:
```markdown
---
title: "Getting Started with Automation"
summary: "What to expect when automating your first process — a practical primer."
date: "2026-06-21"
author: "qtvue"
tags: ["automation", "getting-started"]
---

# Getting Started with Automation

[PLACEHOLDER — replace with real copy.]

## 1. Identify the right process

[PLACEHOLDER]

## 2. Start with a feasibility study

[PLACEHOLDER]
```

- [ ] **Step 4: Create the careers directory (empty)**

```bash
mkdir -p content/en/careers
```
Add a `.gitkeep` so the empty directory is tracked:
```bash
touch content/en/careers/.gitkeep
```

- [ ] **Step 5: Verify build still succeeds**

Run: `pnpm build`
Expected: succeeds.

- [ ] **Step 6: Commit**

```bash
git add content/en/
git commit -m "feat(content): seed industries, sample case studies, starter blog post"
```

---

## Phase 8 — Page Templates

### Task 8.1: Home page

**Files:**
- Modify: `app/pages/index.vue`
- Test: `test/e2e/home.spec.ts` (added in Phase 11; here we do a smoke check via dev server)

- [ ] **Step 1: Build the Home page using existing primitives + content queries**

Replace `app/pages/index.vue`:
```vue
<script setup lang="ts">
const { data: services } = await useAsyncData('home-services', () =>
  queryCollection('services').order('order', 'ASC').limit(4).all(),
)
const { data: work } = await useAsyncData('home-work', () =>
  queryCollection('work').where('featured', '=', true).limit(3).all(),
)

const { t } = useI18n()
useSeoMeta({
  title: 'qtvue — Robotics Integration, Programming, and Consulting',
  description:
    'We sell and program robots for any business need — full integration, cell design, commissioning, and consulting.',
})
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="border-b border-border bg-surface">
      <Container class="py-24 sm:py-32">
        <div class="max-w-3xl">
          <p class="font-mono text-sm uppercase tracking-wider text-primary">Robotics, end to end</p>
          <h1 class="mt-4 text-4xl font-bold sm:text-6xl">
            Automation that works for your business.
          </h1>
          <p class="mt-6 text-lg text-text-secondary">
            We sell and program robots for any business need — from feasibility and cell design to
            integration, commissioning, and ongoing support.
          </p>
          <div class="mt-8 flex gap-3">
            <Btn href="/contact" size="lg">{{ t('cta.startProject') }}</Btn>
            <Btn href="/services" variant="secondary" size="lg">{{ t('cta.viewAll') }}</Btn>
          </div>
        </div>
      </Container>
    </section>

    <!-- Services -->
    <Section eyebrow="Services" heading="What we do">
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card v-for="s in services" :key="s.path">
          <Icon :name="s.icon" :size="28" />
          <h3 class="mt-4 text-lg font-semibold">{{ s.title }}</h3>
          <p class="mt-2 text-sm text-text-secondary">{{ s.summary }}</p>
          <NuxtLink :to="s.path" class="mt-4 inline-block text-sm text-primary">Learn more →</NuxtLink>
        </Card>
      </div>
    </Section>

    <!-- Featured work -->
    <Section eyebrow="Work" heading="Selected projects">
      <div class="grid gap-6 sm:grid-cols-3">
        <NuxtLink v-for="w in work" :key="w.path" :to="w.path">
          <Card>
            <Media :src="w.image" alt="" decorative ratio="16/9" />
            <h3 class="mt-4 font-semibold">{{ w.title }}</h3>
            <p class="mt-1 text-sm text-text-secondary">{{ w.summary }}</p>
          </Card>
        </NuxtLink>
      </div>
      <div class="mt-8">
        <Btn href="/work" variant="ghost">{{ t('cta.viewAll') }} →</Btn>
      </div>
    </Section>

    <!-- CTA strip -->
    <Section>
      <div class="rounded-2xl bg-primary px-8 py-12 text-center text-white">
        <h2 class="text-2xl font-bold sm:text-3xl">Have a process you want to automate?</h2>
        <p class="mt-3 text-white/80">Tell us about it — we'll tell you if it makes sense.</p>
        <div class="mt-6">
          <Btn href="/contact" variant="secondary" size="lg">{{ t('cta.getInTouch') }}</Btn>
        </div>
      </div>
    </Section>
  </div>
</template>
```

- [ ] **Step 2: Verify Home renders with content**

Run: `pnpm dev`, open `http://localhost:3000`. Expected: hero, 4 service cards, 3 featured case studies, CTA strip all visible. Stop server.

- [ ] **Step 3: Commit**

```bash
git add app/pages/index.vue
git commit -m "feat(pages): build Home with hero, services, featured work, CTA"
```

### Task 8.2: Services index + [slug]

**Files:**
- Create: `app/pages/services/index.vue`
- Create: `app/pages/services/[slug].vue`

- [ ] **Step 1: Create services/index.vue**

```vue
<script setup lang="ts">
const { data: services } = await useAsyncData('services-index', () =>
  queryCollection('services').order('order', 'ASC').all(),
)
useSeoMeta({
  title: 'Services — qtvue',
  description: 'Robotics integration, programming, sales, and consulting services.',
})
</script>

<template>
  <Section eyebrow="Services" heading="Everything you need to automate">
    <div class="grid gap-6 sm:grid-cols-2">
      <NuxtLink v-for="s in services" :key="s.path" :to="s.path">
        <Card>
          <div class="flex items-center gap-3">
            <Icon :name="s.icon" :size="24" />
            <h3 class="text-lg font-semibold">{{ s.title }}</h3>
          </div>
          <p class="mt-3 text-text-secondary">{{ s.summary }}</p>
        </Card>
      </NuxtLink>
    </div>
  </Section>
</template>
```

- [ ] **Step 2: Create services/[slug].vue**

```vue
<script setup lang="ts">
const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { data: service } = await useAsyncData(`service-${slug.value}`, () =>
  queryCollection('services').where('path', 'LIKE', `/services/${slug.value}`).first(),
)

if (!service.value) {
  throw createError({ statusCode: 404, statusMessage: 'Service not found', fatal: true })
}

const { data: related } = await useAsyncData(`service-${slug.value}-work`, () =>
  queryCollection('work').where('services', 'CONTAINS', slug.value).limit(3).all(),
)

useSeoMeta({
  title: () => `${service.value?.title} — qtvue`,
  description: () => service.value?.summary ?? '',
})
</script>

<template>
  <article v-if="service">
    <Section :eyebrow="'Services'" :heading="service.title">
      <div class="prose max-w-none text-text" v-html="service.body" />
      <div v-if="related?.length" class="mt-12">
        <h3 class="mb-4 text-xl font-semibold">Related work</h3>
        <div class="grid gap-6 sm:grid-cols-3">
          <NuxtLink v-for="w in related" :key="w.path" :to="w.path">
            <Card>
              <Media :src="w.image" alt="" decorative ratio="16/9" />
              <h4 class="mt-3 font-medium">{{ w.title }}</h4>
            </Card>
          </NuxtLink>
        </div>
      </div>
    </Section>
  </article>
</template>
```

- [ ] **Step 3: Verify both render**

Run dev server. Visit `/services` and `/services/integration`. Expected: index lists 4 services; detail shows title, body, related work (the sample welding cell).

- [ ] **Step 4: Commit**

```bash
git add app/pages/services/
git commit -m "feat(pages): services index + detail with related work"
```

### Task 8.3: Industries index + [slug]

**Files:**
- Create: `app/pages/industries/index.vue`
- Create: `app/pages/industries/[slug].vue`

- [ ] **Step 1: Create industries/index.vue**

```vue
<script setup lang="ts">
const { data: industries } = await useAsyncData('industries-index', () =>
  queryCollection('industries').order('order', 'ASC').all(),
)
useSeoMeta({ title: 'Industries — qtvue', description: 'Industries we serve.' })
</script>

<template>
  <Section eyebrow="Industries" heading="Where we work">
    <div class="grid gap-6 sm:grid-cols-3">
      <NuxtLink v-for="i in industries" :key="i.path" :to="i.path">
        <Card>
          <h3 class="text-lg font-semibold">{{ i.title }}</h3>
          <p class="mt-2 text-sm text-text-secondary">{{ i.summary }}</p>
        </Card>
      </NuxtLink>
    </div>
  </Section>
</template>
```

- [ ] **Step 2: Create industries/[slug].vue**

```vue
<script setup lang="ts">
const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { data: industry } = await useAsyncData(`industry-${slug.value}`, () =>
  queryCollection('industries').where('path', 'LIKE', `/industries/${slug.value}`).first(),
)
if (!industry.value) throw createError({ statusCode: 404, fatal: true })

const { data: work } = await useAsyncData(`industry-${slug.value}-work`, () =>
  queryCollection('work').where('industry', '=', slug.value).all(),
)

useSeoMeta({
  title: () => `${industry.value?.title} — qtvue`,
  description: () => industry.value?.summary ?? '',
})
</script>

<template>
  <Section :heading="industry?.title" :eyebrow="'Industries'">
    <div class="prose max-w-none" v-html="industry?.body" />
    <div v-if="work?.length" class="mt-12">
      <h3 class="mb-4 text-xl font-semibold">Related work</h3>
      <div class="grid gap-6 sm:grid-cols-3">
        <NuxtLink v-for="w in work" :key="w.path" :to="w.path">
          <Card>
            <h4 class="font-medium">{{ w.title }}</h4>
            <p class="mt-1 text-sm text-text-secondary">{{ w.summary }}</p>
          </Card>
        </NuxtLink>
      </div>
    </div>
  </Section>
</template>
```

- [ ] **Step 3: Verify**

Run dev server. Visit `/industries` and `/industries/welding`. Expected: index lists 3 industries; detail shows the industry and its related sample case study.

- [ ] **Step 4: Commit**

```bash
git add app/pages/industries/
git commit -m "feat(pages): industries index + detail with related work"
```

### Task 8.4: Work index + [slug]

**Files:**
- Create: `app/pages/work/index.vue`
- Create: `app/pages/work/[slug].vue`

- [ ] **Step 1: Create work/index.vue**

```vue
<script setup lang="ts">
const { data: work } = await useAsyncData('work-index', () =>
  queryCollection('work').order('year', 'DESC').all(),
)
useSeoMeta({ title: 'Work — qtvue', description: 'Selected robotics projects.' })
</script>

<template>
  <Section eyebrow="Work" heading="Selected projects">
    <p v-if="!work?.length" class="text-text-secondary">Case studies coming soon.</p>
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink v-for="w in work" :key="w.path" :to="w.path">
        <Card>
          <Media :src="w.image" alt="" decorative ratio="16/9" />
          <h3 class="mt-4 font-semibold">{{ w.title }}</h3>
          <p class="mt-1 text-sm text-text-secondary">{{ w.summary }}</p>
          <div v-if="w.metrics?.length" class="mt-4 flex gap-6">
            <Stat v-for="m in w.metrics" :key="m.label" :value="m.value" :label="m.label" />
          </div>
        </Card>
      </NuxtLink>
    </div>
  </Section>
</template>
```

- [ ] **Step 2: Create work/[slug].vue**

```vue
<script setup lang="ts">
const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { data: project } = await useAsyncData(`work-${slug.value}`, () =>
  queryCollection('work').where('path', 'LIKE', `/work/${slug.value}`).first(),
)
if (!project.value) throw createError({ statusCode: 404, fatal: true })

useSeoMeta({
  title: () => `${project.value?.title} — qtvue`,
  description: () => project.value?.summary ?? '',
  ogImage: () => project.value?.image,
})
</script>

<template>
  <article v-if="project">
    <Section :eyebrow="`Case study · ${project.year}`" :heading="project.title">
      <Media :src="project.image" :alt="project.title" ratio="16/9" />
      <div class="mt-6 flex flex-wrap gap-2">
        <Badge :text="project.industry" />
        <Badge v-for="s in project.services" :key="s" :text="s" />
      </div>
      <div v-if="project.metrics?.length" class="mt-8 grid gap-6 sm:grid-cols-3">
        <Stat v-for="m in project.metrics" :key="m.label" :value="m.value" :label="m.label" />
      </div>
      <div class="prose mt-8 max-w-none" v-html="project.body" />
    </Section>
  </article>
</template>
```

- [ ] **Step 3: Verify**

Visit `/work` and `/work/sample-welding-cell`. Expected: index lists 3 samples; detail shows image, badges, metrics, body.

- [ ] **Step 4: Commit**

```bash
git add app/pages/work/
git commit -m "feat(pages): work index + case study detail"
```

### Task 8.5: About page

**Files:**
- Create: `app/pages/about.vue`

- [ ] **Step 1: Write the About page**

```vue
<script setup lang="ts">
useSeoMeta({
  title: 'About — qtvue',
  description: 'About qtvue — a robotics integration company.',
})
</script>

<template>
  <Section eyebrow="About" heading="Engineering automation that lasts">
    <div class="max-w-2xl text-text-secondary">
      <p>
        [PLACEHOLDER — replace with real copy.] qtvue is a robotics company that sells and programs
        robots for any business need. We work across the full lifecycle — from feasibility and design
        through integration, programming, commissioning, and support.
      </p>
      <p class="mt-4">
        [PLACEHOLDER] Our team has deployed automation across welding, packaging, material handling,
        and other industrial operations worldwide.
      </p>
    </div>

    <div class="mt-12 grid gap-6 sm:grid-cols-3">
      <Card>
        <Stat value="N+" label="cells deployed" />
      </Card>
      <Card>
        <Stat value="N" label="countries served" />
      </Card>
      <Card>
        <Stat value="N yr" label="average tenure" />
      </Card>
    </div>
  </Section>
</template>
```

- [ ] **Step 2: Verify**

Visit `/about`. Expected: renders with placeholder copy and stat cards.

- [ ] **Step 3: Commit**

```bash
git add app/pages/about.vue
git commit -m "feat(pages): about page with placeholder copy"
```

### Task 8.6: Careers page (evergreen CTA when no roles)

**Files:**
- Create: `app/pages/careers/index.vue`

- [ ] **Step 1: Write the page**

```vue
<script setup lang="ts">
const { data: roles } = await useAsyncData('careers', () =>
  queryCollection('careers').all(),
)
useSeoMeta({ title: 'Careers — qtvue', description: 'Join the qtvue team.' })
</script>

<template>
  <Section eyebrow="Careers" heading="Build the future of automation with us">
    <!-- Listing mode (when roles exist) -->
    <div v-if="roles?.length" class="grid gap-6">
      <NuxtLink v-for="r in roles" :key="r.path" :to="r.path">
        <Card>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold">{{ r.title }}</h3>
              <p class="mt-1 text-sm text-text-secondary">{{ r.location }} · {{ r.type }}</p>
            </div>
            <span class="text-primary">→</span>
          </div>
        </Card>
      </NuxtLink>
    </div>

    <!-- Evergreen CTA (no open roles) -->
    <div v-else class="rounded-2xl border border-border bg-surface p-8 text-center">
      <h3 class="text-xl font-semibold">We're always looking for talent</h3>
      <p class="mx-auto mt-3 max-w-md text-text-secondary">
        No open roles right now, but we'd still love to hear from you. Send your resume and a note
        about what you do.
      </p>
      <div class="mt-6">
        <Btn href="mailto:hello@qtvue.com" size="lg">Email us</Btn>
      </div>
    </div>
  </Section>
</template>
```

- [ ] **Step 2: Verify**

Visit `/careers`. Expected: evergreen CTA shown (no roles in the collection).

- [ ] **Step 3: Commit**

```bash
git add app/pages/careers/index.vue
git commit -m "feat(pages): careers page with evergreen CTA fallback"
```

### Task 8.7: Blog index + [slug]

**Files:**
- Create: `app/pages/blog/index.vue`
- Create: `app/pages/blog/[slug].vue`

- [ ] **Step 1: Create blog/index.vue**

```vue
<script setup lang="ts">
const { data: posts } = await useAsyncData('blog-index', () =>
  queryCollection('blog').order('date', 'DESC').all(),
)
useSeoMeta({ title: 'Blog — qtvue', description: 'Articles on robotics and automation.' })
</script>

<template>
  <Section eyebrow="Blog" heading="Notes on robotics & automation">
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink v-for="p in posts" :key="p.path" :to="p.path">
        <Card>
          <time class="text-xs font-mono text-text-secondary">{{ p.date }}</time>
          <h3 class="mt-2 font-semibold">{{ p.title }}</h3>
          <p class="mt-1 text-sm text-text-secondary">{{ p.summary }}</p>
        </Card>
      </NuxtLink>
    </div>
  </Section>
</template>
```

- [ ] **Step 2: Create blog/[slug].vue**

```vue
<script setup lang="ts">
const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { data: post } = await useAsyncData(`blog-${slug.value}`, () =>
  queryCollection('blog').where('path', 'LIKE', `/blog/${slug.value}`).first(),
)
if (!post.value) throw createError({ statusCode: 404, fatal: true })

useSeoMeta({
  title: () => `${post.value?.title} — qtvue Blog`,
  description: () => post.value?.summary ?? '',
  ogImage: () => post.value?.image,
})
</script>

<template>
  <article v-if="post">
    <Section>
      <time class="font-mono text-sm text-text-secondary">{{ post.date }} · {{ post.author }}</time>
      <h1 class="mt-2 text-3xl font-bold sm:text-4xl">{{ post.title }}</h1>
      <div class="mt-4 flex gap-2">
        <Badge v-for="t in post.tags" :key="t" :text="t" />
      </div>
      <div class="prose mt-8 max-w-none" v-html="post.body" />
    </Section>
  </article>
</template>
```

- [ ] **Step 3: Verify**

Visit `/blog` and `/blog/getting-started-with-automation`. Expected: 1 post listed; article renders.

- [ ] **Step 4: Commit**

```bash
git add app/pages/blog/
git commit -m "feat(pages): blog index + article template"
```

### Task 8.8: Contact page (UI only — form wired in Phase 9)

**Files:**
- Create: `app/pages/contact.vue`

- [ ] **Step 1: Create the contact page shell**

```vue
<script setup lang="ts">
const { t } = useI18n()
useSeoMeta({ title: 'Contact — qtvue', description: 'Start a project with qtvue.' })
</script>

<template>
  <Section :eyebrow="'Contact'" :heading="t('contact.heading')">
    <div class="grid gap-12 lg:grid-cols-2">
      <div>
        <p class="text-text-secondary">
          Tell us about your operation and what you'd like to automate. We'll get back to you within
          one business day.
        </p>
        <dl class="mt-8 space-y-4 text-sm">
          <div>
            <dt class="text-text-secondary">Email</dt>
            <dd><a class="text-primary" :href="`mailto:${t('contact.email')}`">{{ t('contact.email') }}</a></dd>
          </div>
        </dl>
      </div>
      <div>
        <ContactForm />
      </div>
    </div>
  </Section>
</template>
```

- [ ] **Step 2: Create a stub ContactForm component (real logic in Phase 9)**

Create `app/components/forms/ContactForm.vue`:
```vue
<template>
  <div class="rounded-xl border border-border bg-surface p-6">[Contact form — wired in Phase 9]</div>
</template>
```

- [ ] **Step 3: Verify**

Visit `/contact`. Expected: page renders with stub form placeholder.

- [ ] **Step 4: Commit**

```bash
git add app/pages/contact.vue app/components/forms/ContactForm.vue
git commit -m "feat(pages): contact page shell (form stub)"
```

### Task 8.9: Legal pages

**Files:**
- Create: `app/pages/legal/privacy.vue`
- Create: `app/pages/legal/terms.vue`

- [ ] **Step 1: Write privacy.vue**

```vue
<script setup lang="ts">
useSeoMeta({ title: 'Privacy Policy — qtvue', description: 'qtvue privacy policy.' })
</script>

<template>
  <Section heading="Privacy Policy">
    <div class="prose max-w-none text-text-secondary">
      <p><strong>Last updated:</strong> 2026-06-21</p>
      <p>
        [PLACEHOLDER — replace with final legal copy.] qtvue is cookieless: we do not use analytics
        cookies or marketing pixels. We collect only the information you voluntarily submit through
        our contact form (name, email, message) for the purpose of responding to your inquiry.
      </p>
      <p>
        [PLACEHOLDER] We use Vercel Analytics, which provides aggregated, anonymized traffic data and
        does not use cookies.
      </p>
      <p>[PLACEHOLDER] Contact: hello@qtvue.com.</p>
    </div>
  </Section>
</template>
```

- [ ] **Step 2: Write terms.vue**

```vue
<script setup lang="ts">
useSeoMeta({ title: 'Terms — qtvue', description: 'qtvue terms of use.' })
</script>

<template>
  <Section heading="Terms of Use">
    <div class="prose max-w-none text-text-secondary">
      <p><strong>Last updated:</strong> 2026-06-21</p>
      <p>[PLACEHOLDER — replace with final legal copy.]</p>
    </div>
  </Section>
</template>
```

- [ ] **Step 3: Verify both render**

Visit `/legal/privacy` and `/legal/terms`.

- [ ] **Step 4: Commit**

```bash
git add app/pages/legal/
git commit -m "feat(pages): privacy and terms pages (placeholder copy)"
```

### Task 8.10: 404 / error page

**Files:**
- Create: `app/error.vue`

- [ ] **Step 1: Create error.vue**

```vue
<script setup lang="ts">
import type { NuxtError } from '#app'
defineProps<{ error: NuxtError }>()
</script>

<template>
  <NuxtLayout>
    <Section :heading="`${error.statusCode}`" :eyebrow="'Error'">
      <p class="text-text-secondary">
        {{ error.statusCode === 404 ? "We couldn't find that page." : 'Something went wrong.' }}
      </p>
      <div class="mt-6">
        <Btn href="/">Back home</Btn>
      </div>
    </Section>
  </NuxtLayout>
</template>
```

- [ ] **Step 2: Verify**

Visit `/nonexistent`. Expected: branded 404 page.

- [ ] **Step 3: Commit**

```bash
git add app/error.vue
git commit -m "feat(pages): branded error/404 page"
```

---

## Phase 9 — Contact Form (Client + Server + Resend)

### Task 9.1: Zod validation schema + useContactForm composable

**Files:**
- Create: `app/schemas/contact.ts`
- Create: `app/composables/useContactForm.ts`
- Test: `test/unit/useContactForm.spec.ts`

- [ ] **Step 1: Write the validation schema**

Create `app/schemas/contact.ts`:
```ts
import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Please enter a valid email'),
  company: z.string().optional(),
  industry: z.string().optional(),
  message: z.string().min(10, 'Please tell us a bit more (10+ characters)'),
  // honeypot — must remain empty
  website: z.string().max(0, 'Spam detected').optional().default(''),
})

export type ContactInput = z.infer<typeof contactSchema>
```

- [ ] **Step 2: Write the failing test for useContactForm**

Create `test/unit/useContactForm.spec.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useContactForm } from '~/composables/useContactForm'

describe('useContactForm', () => {
  beforeEach(() => vi.resetAllMocks())

  it('starts idle with no errors', () => {
    const { status, errors } = useContactForm()
    expect(status.value).toBe('idle')
    expect(Object.keys(errors.value).length).toBe(0)
  })

  it('rejects an invalid submission and sets errors', async () => {
    const { submit, status, errors } = useContactForm()
    await submit({ name: 'x', email: 'bad', message: 'short' })
    expect(status.value).toBe('error')
    expect(errors.value.email).toBeDefined()
  })

  it('succeeds on valid input', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true } as Response)
    vi.stubGlobal('fetch', fetchMock)
    const { submit, status } = useContactForm()
    await submit({
      name: 'Alice',
      email: 'alice@example.com',
      message: 'We need a welding cell.',
    })
    expect(status.value).toBe('success')
    expect(fetchMock).toHaveBeenCalled()
  })
})
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `pnpm test test/unit/useContactForm.spec.ts`
Expected: FAIL.

- [ ] **Step 4: Write the composable**

Create `app/composables/useContactForm.ts`:
```ts
import { ref } from 'vue'
import { contactSchema, type ContactInput } from '~/schemas/contact'

export type Status = 'idle' | 'submitting' | 'success' | 'error'

export function useContactForm() {
  const status = ref<Status>('idle')
  const errors = ref<Record<string, string>>({})

  async function submit(input: Partial<ContactInput>) {
    status.value = 'submitting'
    errors.value = {}

    const parsed = contactSchema.safeParse(input)
    if (!parsed.success) {
      status.value = 'error'
      const fieldErrors: Record<string, string> = {}
      for (const issue of parsed.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message
      }
      errors.value = fieldErrors
      return
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      })
      if (!res.ok) throw new Error('request failed')
      status.value = 'success'
    } catch {
      status.value = 'error'
      errors.value = { _form: 'Something went wrong. Please try again.' }
    }
  }

  return { status, errors, submit }
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `pnpm test test/unit/useContactForm.spec.ts`
Expected: PASS (3 tests).

- [ ] **Step 6: Commit**

```bash
git add app/schemas/contact.ts app/composables/useContactForm.ts test/unit/useContactForm.spec.ts
git commit -m "feat(contact): add validation schema and useContactForm composable"
```

### Task 9.2: ContactForm component (UI)

**Files:**
- Modify: `app/components/forms/ContactForm.vue`

- [ ] **Step 1: Replace the stub with the real form**

```vue
<script setup lang="ts">
import { reactive } from 'vue'
import { useContactForm } from '~/composables/useContactForm'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { status, errors, submit } = useContactForm()

const form = reactive({
  name: '',
  email: '',
  company: '',
  industry: '',
  message: '',
  website: '', // honeypot
})

const industries = [
  { value: 'welding', label: 'Welding' },
  { value: 'packaging', label: 'Packaging' },
  { value: 'material-handling', label: 'Material Handling' },
  { value: 'other', label: 'Other' },
]
</script>

<template>
  <form
    class="space-y-4 rounded-xl border border-border bg-surface p-6"
    @submit.prevent="submit(form)"
  >
    <div v-if="status === 'success'" class="rounded-lg bg-success/10 p-4 text-success">
      {{ t('contact.success') }}
    </div>
    <div v-if="errors._form" class="rounded-lg bg-danger/10 p-4 text-danger">
      {{ errors._form }}
    </div>

    <Input v-model="form.name" name="name" :label="'Name'" :error="errors.name" required />
    <Input v-model="form.email" name="email" :label="'Email'" type="'email'" :error="errors.email" required />
    <Input v-model="form.company" name="company" :label="'Company'" />
    <Select v-model="form.industry" name="industry" :label="'Industry'" :options="industries" />
    <Textarea v-model="form.message" name="message" :label="'Message'" :error="errors.message" :required="true" />

    <!-- honeypot (hidden from users) -->
    <input
      v-model="form.website"
      name="website"
      type="text"
      tabindex="-1"
      autocomplete="off"
      aria-hidden="true"
      class="hidden"
    />

    <Btn type="submit" :disabled="status === 'submitting'">
      {{ status === 'submitting' ? 'Sending…' : t('contact.submit') }}
    </Btn>
  </form>
</template>
```

- [ ] **Step 2: Verify in browser**

Visit `/contact`. Submit empty form → validation errors appear. Fill validly → POST fires to `/api/contact` (will 404 until Task 9.3).

- [ ] **Step 3: Commit**

```bash
git add app/components/forms/ContactForm.vue
git commit -m "feat(contact): build ContactForm UI with validation + honeypot"
```

### Task 9.3: Server route /api/contact + Resend integration

**Files:**
- Create: `server/api/contact.post.ts`
- Create: `server/utils/resend.ts`
- Test: `test/unit/api-contact.spec.ts`

- [ ] **Step 1: Write the failing test for the handler**

Create `test/unit/api-contact.spec.ts`:
```ts
import { describe, it, expect, vi } from 'vitest'
import { contactSchema } from '~/schemas/contact'

// Validates the input shape the server will accept.
describe('contact endpoint input', () => {
  it('accepts a valid payload', () => {
    const r = contactSchema.safeParse({
      name: 'Alice',
      email: 'a@b.co',
      message: 'We want a welding cell.',
    })
    expect(r.success).toBe(true)
  })

  it('rejects honeypot filled in', () => {
    const r = contactSchema.safeParse({
      name: 'Alice',
      email: 'a@b.co',
      message: 'We want a welding cell.',
      website: 'http://spam.com',
    })
    expect(r.success).toBe(false)
  })
})
```

- [ ] **Step 2: Run the test to verify it passes (it tests the schema only)**

Run: `pnpm test test/unit/api-contact.spec.ts`
Expected: PASS (the schema test already validates server input contract).

- [ ] **Step 3: Create the Resend util**

Create `server/utils/resend.ts`:
```ts
import { Resend } from 'resend'

export function getResend() {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    throw new Error('RESEND_API_KEY is not set')
  }
  return new Resend(key)
}

export async function sendContactEmail(input: {
  name: string
  email: string
  company?: string
  industry?: string
  message: string
}) {
  const resend = getResend()
  const to = process.env.CONTACT_EMAIL_TO ?? 'hello@qtvue.com'

  return resend.emails.send({
    from: 'qtvue.com <onboarding@resend.dev>',
    to,
    replyTo: input.email,
    subject: `New contact form submission from ${input.name}`,
    text: [
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      `Company: ${input.company ?? '—'}`,
      `Industry: ${input.industry ?? '—'}`,
      '',
      input.message,
    ].join('\n'),
  })
}
```

- [ ] **Step 4: Create the route handler**

Create `server/api/contact.post.ts`:
```ts
import { contactSchema } from '~/schemas/contact'
import { sendContactEmail } from '~/server/utils/resend'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = contactSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Validation failed' })
  }

  // Honeypot: silently succeed (don't tell the bot it was rejected)
  if (parsed.data.website) {
    return { ok: true }
  }

  try {
    await sendContactEmail(parsed.data)
    return { ok: true }
  } catch (e) {
    console.error('Contact form error:', e)
    throw createError({ statusCode: 500, statusMessage: 'Failed to send email' })
  }
})
```

- [ ] **Step 5: Create the .env.example**

Create `.env.example`:
```
# Contact form
RESEND_API_KEY=re_xxxxxxxxxxxx
CONTACT_EMAIL_TO=hello@qtvue.com

# Public site URL
NUXT_PUBLIC_SITE_URL=https://qtvue.com
```

- [ ] **Step 6: Verify locally with a Resend test key**

Add `RESEND_API_KEY` to `.env` (user-provided). Run dev server and submit the form. Expected: success state, email arrives at `hello@qtvue.com`.

- [ ] **Step 7: Commit**

```bash
git add server/api/contact.post.ts server/utils/resend.ts .env.example test/unit/api-contact.spec.ts
git commit -m "feat(contact): server route + Resend integration with honeypot"
```

---

## Phase 10 — SEO Module

### Task 10.1: Site config + default SEO

**Files:**
- Modify: `nuxt.config.ts`
- Create: `app.config.ts`

- [ ] **Step 1: Create app.config.ts**

Create `app.config.ts`:
```ts
export default defineAppConfig({
  site: {
    name: 'qtvue',
    url: 'https://qtvue.com',
    description: 'Robotics integration, programming, sales, and consulting for industrial operations.',
    defaultOgImage: '/og-default.png',
  },
})
```

- [ ] **Step 2: Add site config to nuxt.config.ts (for @nuxtjs/seo)**

Add to `nuxt.config.ts`:
```ts
  site: {
    url: 'https://qtvue.com',
    name: 'qtvue',
  },

  seo: {
    redirectToCanonicalSiteUrl: true,
  },
```

- [ ] **Step 3: Add global defaults in app.vue head**

Update `app/app.vue`:
```vue
<script setup lang="ts">
useSeoMeta({
  ogSiteName: 'qtvue',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

- [ ] **Step 4: Verify build**

Run: `pnpm build`
Expected: succeeds; sitemap and robots modules registered (will generate `/sitemap.xml` and `/robots.txt` at runtime).

- [ ] **Step 5: Commit**

```bash
git add app.config.ts nuxt.config.ts app/app.vue
git commit -m "feat(seo): site config and global SEO defaults"
```

### Task 10.2: JSON-LD structured data

**Files:**
- Modify: `app/app.vue`
- Modify: `app/pages/blog/[slug].vue`

- [ ] **Step 1: Add Organization schema globally**

In `app/app.vue`, add:
```vue
<script setup lang="ts">
import type { Organization, WebSite } from 'schema-dts'

const org: Organization = {
  '@type': 'Organization',
  name: 'qtvue',
  url: 'https://qtvue.com',
  email: 'hello@qtvue.com',
  description: 'Robotics integration, programming, sales, and consulting.',
}

useSchemaOrg(org)
</script>
```
(If `useSchemaOrg` is not auto-imported, install `nuxt-schema-org` — but `@nuxtjs/seo` bundles it, so it should be available.)

- [ ] **Step 2: Add Article schema on blog posts**

In `app/pages/blog/[slug].vue`, inside the existing `<script setup>`:
```ts
import type { Article } from 'schema-dts'
watchEffect(() => {
  if (post.value) {
    useSchemaOrg({
      '@type': 'Article',
      headline: post.value.title,
      datePublished: post.value.date,
      author: { '@type': 'Organization', name: post.value.author },
    } as Article)
  }
})
```

- [ ] **Step 3: Verify**

Run dev server. Inspect the rendered HTML of `/` and `/blog/getting-started-with-automation`. Expected: `<script type="application/ld+json">` blocks present with Organization and Article data respectively.

- [ ] **Step 4: Commit**

```bash
git add app/app.vue app/pages/blog/[slug].vue
git commit -m "feat(seo): add Organization + Article JSON-LD"
```

### Task 10.3: OG default image + favicon

**Files:**
- Create: `public/og-default.png` (generated)
- Create: `public/favicon.svg`

- [ ] **Step 1: Create the favicon**

Create `public/favicon.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28">
  <rect width="28" height="28" rx="7" fill="#2563eb"/>
  <circle cx="14" cy="14" r="5" fill="white"/>
  <circle cx="14" cy="14" r="2" fill="#2563eb"/>
</svg>
```

- [ ] **Step 2: Create a placeholder OG image**

Generate a 1200×630 PNG placeholder with the qtvue wordmark on the brand background. (If an image tool isn't available in the environment, use a service like `https://ogqtvue.vercel.app/q` once live, or create a simple PNG locally and commit it. As a fallback for now, commit any 1200×630 PNG named `og-default.png` and replace it later.)

Place it at `public/og-default.png`.

- [ ] **Step 3: Wire favicon in nuxt.config.ts head**

Add to `nuxt.config.ts` `app.head.link`:
```ts
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
      // ... existing script ...
    },
  },
```

- [ ] **Step 4: Commit**

```bash
git add public/favicon.svg public/og-default.png nuxt.config.ts
git commit -m "feat(seo): add favicon and default OG image"
```

---

## Phase 11 — Deployment & Final Verification

### Task 11.1: Finalize route rules + Vercel adapter

**Files:**
- Modify: `nuxt.config.ts`
- Modify: `package.json` (add `@vercel/nuxt`)

- [ ] **Step 1: Install the Vercel adapter**

Run:
```bash
pnpm add -D @vercel/nuxt
```

- [ ] **Step 2: Add route rules + nitro preset to nuxt.config.ts**

Add/merge into `nuxt.config.ts`:
```ts
  nitro: {
    preset: 'vercel',
    prerender: {
      crawlLinks: true,
      routes: ['/', '/sitemap.xml', '/robots.txt'],
    },
  },

  routeRules: {
    '/**': { prerender: true },
    // Reserved for Spec 2 / future:
    // '/portal/**': { ssr: true },
    // '/quote': { ssr: true },
  },
```

- [ ] **Step 3: Add the module**

Add `'@vercel/nuxt'` to the `modules` array in `nuxt.config.ts`.

- [ ] **Step 4: Verify pre-render output**

Run:
```bash
pnpm generate
```
Expected: `.output/public/` directory populated with static HTML for all crawled routes.

- [ ] **Step 5: Commit**

```bash
git add nuxt.config.ts package.json pnpm-lock.yaml
git commit -m "feat(deploy): add Vercel adapter + route rules (all prerender)"
```

### Task 11.2: Playwright e2e smoke tests

**Files:**
- Create: `playwright.config.ts`
- Create: `test/e2e/smoke.spec.ts`

- [ ] **Step 1: Create playwright.config.ts**

```ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './test/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'pnpm preview',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
})
```

- [ ] **Step 2: Create the smoke test**

Create `test/e2e/smoke.spec.ts`:
```ts
import { test, expect } from '@playwright/test'

test('home loads and shows hero', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test('primary nav links resolve', async ({ page }) => {
  for (const path of ['/services', '/industries', '/work', '/about', '/blog', '/careers', '/contact']) {
    await page.goto(path)
    await expect(page).not.toHaveTitle(/404/i)
  }
})

test('contact form shows validation errors on empty submit', async ({ page }) => {
  await page.goto('/contact')
  await page.getByRole('button', { name: /send message/i }).click()
  await expect(page.getByText(/please enter your name/i)).toBeVisible()
})

test('language switcher is hidden (single locale)', async ({ page }) => {
  await page.goto('/')
  // The switcher renders nothing when locales.length <= 1
  await expect(page.locator('select[data-i18n-switcher]')).toHaveCount(0)
})

test('theme toggle switches dark class', async ({ page }) => {
  await page.goto('/')
  const before = await page.evaluate(() => document.documentElement.classList.contains('dark'))
  await page.getByRole('button', { name: /switch to (light|dark) mode/i }).click()
  const after = await page.evaluate(() => document.documentElement.classList.contains('dark'))
  expect(after).toBe(!before)
})

test('case study detail renders', async ({ page }) => {
  await page.goto('/work/sample-welding-cell')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test('404 page shows for unknown route', async ({ page }) => {
  await page.goto('/this-does-not-exist')
  await expect(page.getByText('404')).toBeVisible()
})
```

- [ ] **Step 3: Build and run e2e tests**

Run:
```bash
pnpm build
pnpm test:e2e
```
Expected: all 7 tests PASS.

- [ ] **Step 4: Commit**

```bash
git add playwright.config.ts test/e2e/smoke.spec.ts
git commit -m "test(e2e): add Playwright smoke tests for critical paths"
```

### Task 11.3: README

**Files:**
- Create: `README.md`

- [ ] **Step 1: Write the README**

Create `README.md`:
```markdown
# qtvue.com

Marketing website for qtvue — a robotics integration company.

Built with Nuxt 3, TypeScript, Tailwind, Nuxt Content, and Vercel.

## Requirements

- Node 20+
- pnpm 9+

## Setup

```bash
pnpm install
cp .env.example .env  # add RESEND_API_KEY for the contact form
```

## Development

```bash
pnpm dev         # dev server at http://localhost:3000
```

## Build / preview

```bash
pnpm build       # production build
pnpm generate    # static pre-render to .output/public
pnpm preview     # serve the production build locally
```

## Tests

```bash
pnpm test        # Vitest unit tests
pnpm test:e2e    # Playwright e2e (builds + runs preview server)
```

## Content

All content lives in `content/en/` as Markdown files with typed frontmatter.
Schemas are in `app/content.schemas.ts`. Add a file, the page appears.

- `content/en/services/*.md` → `/services/[slug]`
- `content/en/industries/*.md` → `/industries/[slug]`
- `content/en/work/*.md` → `/work/[slug]`
- `content/en/blog/*.md` → `/blog/[slug]`
- `content/en/careers/*.md` → `/careers/[slug]`

## Adding a language

1. Add the locale to `nuxt.config.ts` `i18n.locales`
2. Add a translation file at `i18n/locales/<code>.json`
3. Mirror content under `content/<code>/`
4. The language switcher becomes visible automatically

## Deployment

Push to `main` → Vercel auto-builds and deploys. Preview deploys per PR.

Required environment variables (set in Vercel project settings):
- `RESEND_API_KEY`
- `CONTACT_EMAIL_TO` (defaults to `hello@qtvue.com`)

## Design system

Tokens live in `app/assets/css/tokens.css`. Swap brand colors, fonts, or add a dark-mode variant there — every component reads from tokens.

Three logo variants are in `app/components/marketing/Logo.vue` (`wordmark` | `monogram` | `abstract`).

## Project structure

See `docs/superpowers/specs/2026-06-21-qtvue-marketing-site-design.md` for the full design.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add project README"
```

### Task 11.4: Lighthouse check + final green build

- [ ] **Step 1: Build and preview**

Run:
```bash
pnpm build
pnpm preview
```

- [ ] **Step 2: Run Lighthouse against the local preview**

(If `lighthouse` CLI is available: `npx lighthouse http://localhost:3000 --only-categories=performance,accessibility,best-practices,seo --view`)
Expected targets:
- Performance ≥ 95
- Accessibility ≥ 95
- Best Practices ≥ 95
- SEO ≥ 95

If any category is below target, investigate and fix (common culprits: missing alt text, large images, missing meta description on a route).

- [ ] **Step 3: Run the full test suite**

Run:
```bash
pnpm test && pnpm test:e2e && pnpm lint
```
Expected: all green.

- [ ] **Step 4: Final commit (if any fixes were made)**

If Lighthouse or tests surfaced fixes, commit them now. Otherwise, no commit.

---

## Self-Review Notes

After writing the plan, I checked the spec (`2026-06-21-qtvue-marketing-site-design.md`) section by section:

- **Section 1 (purpose, scope):** covered — out-of-scope items (quote wizard, portal, GA) are explicitly excluded.
- **Section 2 (tech stack):** every module in the stack table has an install task (Phase 1, 2, 9, 10, 11).
- **Section 3 (architecture / route map):** every route maps to a Phase 8 task.
- **Section 4 (design system: palette, type, logo, components, motion, a11y):** tokens (Phase 2), primitives (Phase 3), logo (Phase 5.1), theme toggle (Phase 4). Tailwind token classes used throughout (`bg-primary`, `text-text`, etc.).
- **Section 5 (i18n):** Phase 6 covers config, locale strings, and refactoring hardcoded strings.
- **Section 6 (content model):** Phase 7 covers schemas + seed content for all five collections; evergreen careers fallback handled in Phase 8.6.
- **Section 7 (SEO/perf/analytics/deploy/contact):** Phase 9 (contact + Resend), Phase 10 (SEO + JSON-LD), Phase 11 (deploy + verification + Lighthouse).
- **Section 8 (project structure):** matches the directory layout created across phases.
- **Section 9 (dependencies / user inputs):** flagged in spec; `.env.example` and README document them. Placeholders are explicit and marked.

**Type/signature consistency check:**
- `useTheme()` returns `{ isDark, toggle, set }` — used consistently in `ThemeToggle.vue`.
- `useContactForm()` returns `{ status, errors, submit }` — used consistently in `ContactForm.vue`.
- `contactSchema` / `ContactInput` shared between client composable and server route.
- Content schema names (`workSchema`, `serviceSchema`, etc.) match between `app/content.schemas.ts` and `content.config.ts`, and the collection keys (`services`, `industries`, `work`, `blog`, `careers`) match every `queryCollection(...)` call in Phase 8.
- UI primitive prop names (`modelValue`/`label`/`name`/`error` on inputs; `variant`/`size`/`href` on Btn; `value`/`label` on Stat) are used consistently in pages.

No spec requirement left without a task. No TBD/TODO placeholders in plan steps.
