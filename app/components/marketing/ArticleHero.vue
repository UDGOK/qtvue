<script setup lang="ts">
/**
 * ArticleHero — illustrated cover image for blog posts.
 *
 * Renders either:
 *   1. An <img> with the post's hero image, or
 *   2. A generated SVG illustration tuned to the post's tone and slug.
 *
 * The generated illustration is greptile-style: halftone dot field
 * over a colored background, with a glyph that hints at the topic
 * (robot arm for engineering, lock for security, chart for analysis,
 * etc.). The glyph is chosen from `slug` keywords — no fancy NLP, just
 * string matching on the post slug.
 *
 * Tones:
 *   - forest: forest-green gradient + mint accent (default for most)
 *   - ink:    very dark green + paper text (security, controversy)
 *   - cream:  cream paper + forest accent (default)
 */
const props = withDefaults(
  defineProps<{
    /** Path to a JPG/PNG/WebP to use as the cover. Optional. */
    src?: string
    /** Color tone of the background. */
    tone?: 'forest' | 'ink' | 'cream'
    /** Slug of the post — used to pick the glyph when no src is given. */
    slug?: string
  }>(),
  { tone: 'cream', src: '' },
)

/** Pick a glyph + label from the slug. Returns Lucide icon name + a tagline. */
function pickGlyph(slug?: string): { icon: string; label: string } {
  const s = (slug ?? '').toLowerCase()
  if (s.includes('security') || s.includes('unipwn') || s.includes('bt-') || s.includes('firmware')) {
    return { icon: 'ShieldAlert', label: 'Security advisory' }
  }
  if (s.includes('battery') || s.includes('power') || s.includes('thermal')) {
    return { icon: 'Battery', label: 'Hardware measurement' }
  }
  if (s.includes('isaac') || s.includes('sim-to-real') || s.includes('simulation') || s.includes('sim')) {
    return { icon: 'Boxes', label: 'Sim-to-real' }
  }
  if (s.includes('lerobot') || s.includes('learning') || s.includes('imitation') || s.includes('policy')) {
    return { icon: 'BrainCircuit', label: 'Imitation learning' }
  }
  if (s.includes('sdk') || s.includes('unitree_sdk') || s.includes('ros') || s.includes('ros2')) {
    return { icon: 'Code2', label: 'SDK deep-dive' }
  }
  if (s.includes('g1') || s.includes('humanoid')) {
    return { icon: 'PersonStanding', label: 'Humanoid platform' }
  }
  if (s.includes('go2') || s.includes('quadruped') || s.includes('dog')) {
    return { icon: 'PawPrint', label: 'Quadruped platform' }
  }
  return { icon: 'Cpu', label: 'Engineering note' }
}

const glyph = computed(() => pickGlyph(props.slug))

// Tone palette
const palette = computed(() => {
  switch (props.tone) {
    case 'forest':
      return {
        bg1: '#0e5c3a',
        bg2: '#0a3d27',
        dot: '#3df5a3',
        text: '#faf6ec',
        accent: '#3df5a3',
        eyebrowColor: '#b6e7cc',
        ring: 'rgba(61,245,163,0.25)',
      }
    case 'ink':
      return {
        bg1: '#0a2018',
        bg2: '#04140d',
        dot: '#3df5a3',
        text: '#e8f0e5',
        accent: '#3df5a3',
        eyebrowColor: '#9ab09a',
        ring: 'rgba(61,245,163,0.18)',
      }
    default:
      return {
        bg1: '#faf6ec',
        bg2: '#e8e3d2',
        dot: '#0e5c3a',
        text: '#0a2018',
        accent: '#0e5c3a',
        eyebrowColor: '#3a4d40',
        ring: 'rgba(14,92,58,0.18)',
      }
  }
})
</script>

<template>
  <div
    v-if="src"
    class="absolute inset-0 bg-cover bg-center"
    :style="{ backgroundImage: `url(${src})` }"
    role="img"
  />
  <div
    v-else
    class="absolute inset-0 overflow-hidden"
    :style="{
      background: `linear-gradient(135deg, ${palette.bg1} 0%, ${palette.bg2} 100%)`,
      color: palette.text,
    }"
  >
    <!-- halftone overlay -->
    <svg
      class="absolute inset-0 h-full w-full opacity-30"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="hero-halftone"
          x="0" y="0"
          width="14" height="14"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="7" cy="7" r="1.6" :fill="palette.dot" />
        </pattern>
        <radialGradient id="hero-fade" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stop-color="rgba(255,255,255,0)" />
          <stop offset="100%" stop-color="rgba(0,0,0,0.35)" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#hero-halftone)" />
      <rect width="100%" height="100%" fill="url(#hero-fade)" />
    </svg>

    <!-- big glyph, bottom-right -->
    <div class="absolute bottom-6 right-6 flex items-end gap-4">
      <div class="text-right">
        <p
          class="font-mono text-[10px] uppercase tracking-[0.2em]"
          :style="{ color: palette.eyebrowColor }"
        >
          qtvue · {{ glyph.label }}
        </p>
        <p
          class="mt-1 font-mono text-[11px] uppercase tracking-widest opacity-70"
          :style="{ color: palette.eyebrowColor }"
        >
          {{ slug ?? 'article' }}
        </p>
      </div>
      <div
        class="grid h-16 w-16 place-items-center rounded-none border"
        :style="{ borderColor: palette.ring, background: 'rgba(255,255,255,0.06)' }"
      >
        <Icon :name="glyph.icon" :size="30" :style="{ color: palette.accent }" />
      </div>
    </div>

    <!-- corner monogram top-left -->
    <div class="absolute left-5 top-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em]" :style="{ color: palette.eyebrowColor }">
      <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
        <rect x="2" y="2" width="12" height="12" rx="3" :fill="palette.accent" />
        <circle cx="8" cy="8" r="3" :fill="palette.bg1" />
      </svg>
      qtvue research
    </div>

    <!-- dashed border accent -->
    <div
      class="pointer-events-none absolute inset-3 rounded-none border border-dashed"
      :style="{ borderColor: palette.ring }"
    />
  </div>
</template>