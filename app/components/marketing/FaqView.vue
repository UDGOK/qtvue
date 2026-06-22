<script setup lang="ts">
/**
 * FaqView — renders a list of Q&A as a styled accordion with optional
 * schema.org FAQPage JSON-LD for LLM and search-engine consumption.
 *
 * Why this exists:
 *  Modern crawlers (Google SGE, GPTBot, ClaudeBot, PerplexityBot, Bing
 *  Copilot) look for the schema.org/FAQPage structured-data type to
 *  extract question/answer pairs verbatim. Having both the visible
 *  HTML AND the JSON-LD means humans see the greptile-style UI AND
 *  every AI system gets clean, machine-readable Q&A.
 *
 * The component is intentionally minimal — it just renders the
 * questions/answers from the content collection and emits the JSON-LD
 * into a <script type="application/ld+json"> tag in the head.
 */
import { computed } from 'vue'

interface QA {
  q: string
  a: string
}
const props = withDefaults(
  defineProps<{
    questions: QA[]
    /** Page URL for the schema.org `mainEntity` context. */
    url?: string
    /** Page title used in schema.org. */
    title?: string
    /** Description for schema.org. */
    description?: string
  }>(),
  { url: '', title: '', description: '' },
)

const open = ref<number | null>(0)

function toggle(i: number) {
  open.value = open.value === i ? null : i
}

const jsonLd = computed(() => {
  const entity = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    ...(props.url ? { url: props.url } : {}),
    ...(props.title ? { name: props.title } : {}),
    ...(props.description ? { description: props.description } : {}),
    mainEntity: props.questions.map((qa) => ({
      '@type': 'Question',
      name: qa.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: qa.a,
      },
    })),
  }
  return JSON.stringify(entity)
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: jsonLd,
    },
  ],
})
</script>

<template>
  <div class="not-prose">
    <ol class="divide-y divide-border rounded-2xl border border-dashed border-border bg-surface">
      <li v-for="(qa, i) in questions" :key="i" class="group">
        <button
          type="button"
          :aria-expanded="open === i ? 'true' : 'false'"
          :aria-controls="`faq-panel-${i}`"
          :id="`faq-trigger-${i}`"
          @click="toggle(i)"
          class="flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-bg sm:px-6 sm:py-5"
        >
          <span class="flex items-start gap-3 sm:gap-4">
            <span
              class="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-dashed border-border bg-bg font-mono text-[10px] text-text-muted transition-colors group-hover:border-primary group-hover:text-primary sm:h-8 sm:w-8"
            >
              {{ String(i + 1).padStart(2, '0') }}
            </span>
            <span class="text-base font-semibold tracking-tight text-text sm:text-lg">
              {{ qa.q }}
            </span>
          </span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            class="mt-1 shrink-0 text-text-muted transition-transform duration-200"
            :class="open === i ? 'rotate-45' : ''"
          >
            <path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </button>
        <div
          :id="`faq-panel-${i}`"
          role="region"
          :aria-labelledby="`faq-trigger-${i}`"
          :hidden="open !== i"
          class="overflow-hidden transition-all"
        >
          <div class="px-5 pb-5 pl-[60px] pr-6 text-sm leading-relaxed text-text-secondary sm:pl-[72px] sm:text-base">
            {{ qa.a }}
          </div>
        </div>
      </li>
    </ol>
  </div>
</template>
