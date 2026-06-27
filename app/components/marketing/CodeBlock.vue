<script setup lang="ts">
/**
 * CodeBlock — terminal/IDE-style code panel used in feature sections.
 *
 * Usage:
 *   <CodeBlock filename="cell.kineo" language="yaml" :code="someString" />
 *
 * The `code` prop is a plain string (newlines preserved). A tiny tokenizer
 * wraps a handful of common tokens in spans for the greptile-style look.
 */
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    filename?: string
    language?: string
    code?: string
    compact?: boolean
  }>(),
  { compact: false },
)

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/**
 * Tokenize the source line-by-line, wrapping matches in span tags.
 * We never apply regex to the output HTML (which would re-match inside
 * class names), so the result is safe to feed to v-html.
 */
const highlighted = computed(() => {
  const src = props.code ?? ''
  // Apply highlighting to the escaped source, ONE regex at a time, but
  // match against tokens (whole words) rather than the HTML we produce.
  // The order of replacements:
  //   1. comments
  //   2. yaml keys
  //   3. KAREL-style keywords
  //   4. values (numbers, quoted strings)
  const keywordKarel =
    '(MOVE TO|WAIT FOR|CLOSE|OPEN|LOOP|END PROGRAM|PROGRAM|FORCE|SPEED)'
  const keywordYaml =
    '(robot|reach|payload|cycle_time|uptime_sla|commissioned)'

  let s = escapeHtml(src)
  // comments: # to end of line
  s = s.replace(/(#[^\n]*)/g, '<c>$1</c>')
  // karel keywords (word boundaries)
  s = s.replace(
    new RegExp(`\\b${keywordKarel}\\b`, 'g'),
    '<k>$1</k>',
  )
  // yaml keys
  s = s.replace(
    new RegExp(`\\b${keywordYaml}\\b(\\s*[:=])`, 'g'),
    '<k>$1</k>$2',
  )
  // numbers + units
  s = s.replace(
    /\b(\d+(?:\.\d+)?(?:mm\/s|s|m|t|wk|yr|%|×)?)\b/g,
    '<v>$1</v>',
  )
  // turn our placeholders into real spans
  s = s
    .replace(/<c>/g, '<span class="text-[#6a7a6a]">')
    .replace(/<\/c>/g, '</span>')
    .replace(/<k>/g, '<span class="text-[#c6f432]">')
    .replace(/<\/k>/g, '</span>')
    .replace(/<v>/g, '<span class="text-[#e8f0e5]">')
    .replace(/<\/v>/g, '</span>')
  return s
})
</script>

<template>
  <div
    class="overflow-hidden rounded-none border border-[#1f2a22] bg-[#0a0f0a] text-[#e8f0e5] shadow-[var(--shadow-lg)]"
  >
    <div class="flex items-center gap-3 border-b border-[#1f2a22] bg-[#101510] px-4 py-2.5">
      <div class="flex items-center gap-1.5" aria-hidden="true">
        <span class="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span class="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span class="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
      </div>
      <div class="flex-1 text-center font-mono text-xs text-[#9ab09a]">
        {{ filename ?? 'untitled' }}
      </div>
      <span class="font-mono text-[10px] uppercase tracking-wider text-[#6a7a6a]">
        {{ language ?? '' }}
      </span>
    </div>
    <pre
      :class="[
        'm-0 overflow-x-auto font-mono leading-relaxed whitespace-pre',
        compact ? 'p-4 text-xs' : 'p-6 text-sm',
      ]"
      v-html="highlighted"
    />
  </div>
</template>

<style scoped>
.whitespace-pre {
  white-space: pre;
}
</style>
