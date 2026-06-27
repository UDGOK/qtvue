<script setup lang="ts">
/**
 * OgImage — auto-rendered 1200x630 OG image used by every page on
 * the site. Picked up by nuxt-og-image (bundled with @nuxtjs/seo).
 *
 * Inputs come from defineOgImage() in each page (or the page's
 * useSeoMeta title/description as fallback). The component is
 * server-rendered by Satori (see nuxt.config.ts runtimeSatori: true)
 * and emitted as a PNG that social/AI scrapers can cache.
 *
 * Visual: forest-green header band, cream-paper body, monospace
 * eyebrow, large display heading, small subtitle. Matches the
 * site design system (forest / cream / mint accent).
 *
 * Why this matters for AIO: every major AI engine (ChatGPT,
 * Perplexity, Copilot, Gemini, Grok, Claude, DeepSeek, Kimi)
 * reads og:image when citing a URL. A branded, on-system card
 * massively improves citation CTR and trust signals.
 */
defineProps<{
  title?: string
  description?: string
  /** Optional eyebrow text rendered above the title */
  eyebrow?: string
}>()
</script>

<template>
  <div
    style="
      display: flex;
      flex-direction: column;
      width: 1200px;
      height: 630px;
      background: #faf6ec;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      color: #0a2018;
      position: relative;
      overflow: hidden;
    "
  >
    <!-- Forest-green header band -->
    <div
      style="
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 32px 56px;
        background: linear-gradient(135deg, #0e5c3a 0%, #0a3d27 100%);
        color: #faf6ec;
        border-bottom: 4px solid #3df5a3;
      "
    >
      <!-- qtvue logo mark -->
      <div
        style="
          width: 56px;
          height: 56px;
          border-radius: 0;
          background: #faf6ec;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        "
      >
        <div
          style="
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: #0e5c3a;
            position: relative;
          "
        >
          <div
            style="
              position: absolute;
              inset: 0;
              margin: auto;
              width: 10px;
              height: 10px;
              border-radius: 50%;
              background: #3df5a3;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            "
          />
        </div>
      </div>
      <div style="display: flex; flex-direction: column; line-height: 1;">
        <span style="font-size: 32px; font-weight: 800; letter-spacing: -0.5px;">
          <span style="color: #faf6ec;">qt</span><span style="color: #3df5a3;">v</span><span style="color: #faf6ec;">ue</span>
        </span>
        <span
          style="
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 2.4px;
            color: #b6e7cc;
            margin-top: 4px;
            font-family: 'JetBrains Mono', 'SF Mono', Menlo, monospace;
            text-transform: uppercase;
          "
        >
          Unitree Robotics Specialist
        </span>
      </div>
    </div>

    <!-- Body -->
    <div
      style="
        display: flex;
        flex-direction: column;
        flex: 1;
        padding: 56px;
        background:
          radial-gradient(circle at 90% 80%, rgba(61, 245, 163, 0.10) 0%, transparent 50%),
          #faf6ec;
        position: relative;
      "
    >
      <!-- Eyebrow -->
      <div
        v-if="eyebrow"
        style="
          font-family: 'JetBrains Mono', 'SF Mono', Menlo, monospace;
          font-size: 18px;
          font-weight: 600;
          letter-spacing: 3px;
          color: #0e5c3a;
          text-transform: uppercase;
          margin-bottom: 16px;
        "
      >
        {{ eyebrow }}
      </div>

      <!-- Title -->
      <div
        style="
          font-size: 60px;
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -1.5px;
          color: #0a2018;
          margin-bottom: 24px;
          max-width: 1080px;
        "
      >
        {{ title ?? 'qtvue — Unitree robotics, programmed and integrated' }}
      </div>

      <!-- Description -->
      <div
        v-if="description"
        style="
          font-size: 24px;
          font-weight: 500;
          line-height: 1.4;
          color: #3a4d40;
          max-width: 1000px;
        "
      >
        {{ description }}
      </div>

      <!-- Footer: URL + CTA pill -->
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 24px;
        "
      >
        <span
          style="
            font-family: 'JetBrains Mono', 'SF Mono', Menlo, monospace;
            font-size: 18px;
            font-weight: 600;
            color: #0e5c3a;
          "
        >
          qtvue.com
        </span>
        <div
          style="
            display: inline-flex;
            align-items: center;
            padding: 12px 24px;
            background: #0e5c3a;
            color: #faf6ec;
            border-radius: 999px;
            font-family: 'JetBrains Mono', 'SF Mono', Menlo, monospace;
            font-size: 16px;
            font-weight: 700;
            letter-spacing: 1.5px;
            text-transform: uppercase;
          "
        >
          Submit your use case →
        </div>
      </div>
    </div>
  </div>
</template>