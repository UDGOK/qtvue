<script setup lang="ts">
/**
 * /unitree-security — UniPwn (2025) SEO landing page.
 *
 * Purpose: own the high-intent search traffic for "Unitree security",
 * "UniPwn fix", "Unitree Bluetooth vulnerability", "Unitree firmware
 * hardening". Three different intents in one funnel:
 *   - "Am I affected?"  → table at the top
 *   - "What do I do?"    → 1.5.2 breakdown + verify snippet
 *   - "Who can help?"    → CTA to /intake + link to advisory
 *
 * Different from:
 *   - /services/security  (conversion page — scope, pricing, intake)
 *   - /blog/post-unipwn-2025  (editorial advisory — research depth)
 *
 * This page is the SEARCH LANDING. It ranks, answers the literal
 * question, and routes to both the blog (trust) and /intake (conversion).
 *
 * Ticket 2 from the v2 brief. Spec values reconciled against the live
 * platform pages (Go2, B2, G1, H1 — all confirmed UniPwn-affected).
 */

const title = 'Unitree Security & UniPwn Hardening (2026) — qtvue'
const description =
  'Is your Unitree robot affected by UniPwn (2025)? What firmware 1.5.2 fixed, what it didn\'t, and how to harden Go2 / B2 / G1 / H1 fleets. Practitioner guide + hardening service.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

// Per-page structured data — FAQPage for rich results + WebPage context.
useSchemaOrg([
  defineWebPage({
    '@type': 'WebPage',
    name: 'Unitree Security & UniPwn Hardening',
    description:
      'Practitioner guide to Unitree security in 2026: the UniPwn (2025) Bluetooth disclosure, what firmware 1.5.2 closed, and what fleet operators still need to harden.',
    url: 'https://qtvue.com/unitree-security',
    inLanguage: 'en-US',
    isPartOf: { '@type': 'WebSite', url: 'https://qtvue.com', name: 'qtvue' },
    primaryImage: 'https://qtvue.com/og-default.svg',
  }),
  defineBreadcrumb({
    itemListElement: [
      { name: 'Home', item: 'https://qtvue.com/' },
      { name: 'Unitree Security', item: 'https://qtvue.com/unitree-security' },
    ],
  }),
])

// FAQ — schema.org/FAQPage expects question/answer pairs
const faqs = [
  {
    q: 'What is UniPwn?',
    a: 'UniPwn is a 2025 disclosure class affecting Unitree Go2, B2, G1, and H1 platforms over Bluetooth Classic. It let an attacker within radio range reach the robot\'s control surface. Unitree patched the core issue in firmware 1.5.2.',
  },
  {
    q: 'Is my Unitree robot still vulnerable in 2026?',
    a: 'If you are on firmware 1.5.2 or later and verified the signature, the original UniPwn vector is closed. Residual risk remains from unverified firmware, exposed radios, flat networks, and unsigned OTA updates — which is what fleet hardening addresses.',
  },
  {
    q: 'What did firmware 1.5.2 fix, and what did it not?',
    a: 'It closed the disclosed Bluetooth path. It does not isolate the robot on your network, lock down unused radios, enforce signed staged OTA, or give you per-device attestation — those are operator responsibilities.',
  },
  {
    q: 'What does hardening involve?',
    a: 'Firmware signature verification and version pinning, Bluetooth and unused-radio lockdown, network isolation (VLAN + firewall + monitoring), signed staged OTA policy, fleet inventory with per-device attestation, and an incident-response playbook.',
  },
  {
    q: 'Do you jailbreak or bypass Unitree firmware?',
    a: 'No. This is legitimate defensive hardening only — never circumvention, tier unlocks, or backdoors. Those violate partner terms and warranty and create liability.',
  },
]

// Affected-platform table — source: live platform pages (verified)
const affected = [
  { platform: 'Unitree Go2', status: 'Affected (Bluetooth)', action: 'Verify ≥ 1.5.2 · isolate network · lock BT' },
  { platform: 'Unitree B2',  status: 'Affected (Bluetooth)', action: 'Verify ≥ 1.5.2 · isolate network · attest fleet' },
  { platform: 'Unitree G1',  status: 'Affected (Bluetooth)', action: 'Verify ≥ 1.5.2 · lock radios · signed staged OTA' },
  { platform: 'Unitree H1 / H1-2', status: 'Affected (Bluetooth)', action: 'Verify ≥ 1.5.2 · attest fleet · incident playbook' },
  { platform: 'Unitree H2',  status: 'Verify firmware lineage', action: 'Confirm signed build · lock unused radios' },
  { platform: 'Unitree R1',  status: 'Verify firmware lineage', action: 'Confirm signed build · keep on isolated VLAN' },
]

// Firmware-verify snippet — reuses <CodeBlock> on /services/security.
const verifyCode = `# Firmware verification — pinned version + signature
# Runs on the operator's host before the robot is admitted to the
# production VLAN. Raises on bad signature, stale firmware, or
# missing network policy.
import hashlib
from unitree_sdk2py.firmware import read_firmware, verify_signature

PINNED_VERSION = ">=1.5.2"
EXPECTED_SHA = "a1b2c3d4..."  # pinned at deployment time, not in code

def harden(robot):
    fw = read_firmware(robot)
    assert fw.version >= PINNED_VERSION, f"Outdated firmware: {fw.version}"
    assert hashlib.sha256(fw.image).hexdigest() == EXPECTED_SHA, "Hash mismatch"
    verify_signature(fw)            # raises on bad signature

    robot.disable_bluetooth()
    robot.disable_undocumented_radios()
    robot.set_network_policy("isolated")
    log_attestation(robot, fw)      # ship to fleet inventory
`
</script>

<template>
  <div class="bg-bg text-text">
    <!-- ============================================================
         HERO
         ============================================================ -->
    <section class="relative border-b border-dashed border-border">
      <Container class="py-20 sm:py-28">
        <Reveal>
          <p class="eyebrow">Security advisory · updated 2026</p>
          <h1 class="display-xl mt-4 max-w-4xl text-text">
            Unitree security &amp; <span class="hl">UniPwn hardening</span>.
          </h1>
          <p class="mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary sm:text-xl">
            Is your Unitree robot affected by UniPwn? Here's what the 2025
            Bluetooth exploit was, what firmware 1.5.2 actually fixed, and
            what fleet operators still need to do. Written by engineers who
            harden these platforms for a living — not a reseller checklist.
          </p>
          <div class="mt-10 flex flex-wrap items-center gap-3">
            <Btn href="/intake" variant="primary" size="lg" arrow>
              Get a hardening assessment
            </Btn>
            <NuxtLink
              to="/blog/post-unipwn-2025"
              class="inline-flex h-11 items-center rounded-none border border-border px-5 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-text-secondary transition-all hover:border-primary hover:text-primary"
            >
              Read the full technical advisory →
            </NuxtLink>
          </div>
        </Reveal>
      </Container>
    </section>

    <!-- ============================================================
         AM I AFFECTED?
         ============================================================ -->
    <Section eyebrow="Step 1" heading="Am I affected?">
      <Reveal>
        <p class="max-w-2xl text-text-secondary">
          UniPwn (2025) was disclosed against Unitree Go2, B2, G1, and H1
          over Bluetooth Classic. The H2 and R1 were not in the disclosed
          set but share firmware lineage — verify their signed build before
          deploying to any production network.
        </p>
      </Reveal>
      <Reveal :delay="100" class="mt-8">
        <div class="overflow-x-auto border border-dashed border-border bg-surface">
          <table class="w-full text-left text-sm">
            <thead class="bg-bg">
              <tr class="border-b border-border font-mono text-[10px] uppercase tracking-widest text-text-muted">
                <th class="px-5 py-3 font-semibold">Platform</th>
                <th class="px-5 py-3 font-semibold">Status</th>
                <th class="px-5 py-3 font-semibold">What to do</th>
              </tr>
            </thead>
            <tbody class="font-mono text-[13px]">
              <tr
                v-for="row in affected"
                :key="row.platform"
                class="border-b border-dashed border-border/60 last:border-0 transition-colors hover:bg-primary-50/30"
              >
                <td class="px-5 py-3 font-semibold text-text">
                  {{ row.platform }}
                </td>
                <td class="px-5 py-3 text-text-secondary">
                  {{ row.status }}
                </td>
                <td class="px-5 py-3 text-text-secondary">
                  {{ row.action }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="mt-4 font-mono text-xs text-text-muted">
          Affected status reflects the disclosed 2025 vector. Always confirm
          against Unitree's current advisories for your exact SKU + firmware.
        </p>
      </Reveal>
    </Section>

    <!-- ============================================================
         WHAT 1.5.2 FIXED / DIDN'T
         ============================================================ -->
    <Section
      tone="surface"
      eyebrow="Step 2"
      heading="What firmware 1.5.2 fixed — and what it didn't."
    >
      <div class="grid gap-6 md:grid-cols-2">
        <Reveal>
          <Card variant="default" pad="lg" class="h-full">
            <p class="eyebrow">Closed by Unitree</p>
            <ul class="mt-4 space-y-3 text-[15px] text-text">
              <li class="flex items-start gap-3">
                <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>The disclosed Bluetooth Classic attack path on Go2, B2, G1, H1</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>Pre-authentication firmware replacement within radio range</span>
              </li>
            </ul>
          </Card>
        </Reveal>
        <Reveal :delay="80">
          <Card variant="default" pad="lg" class="h-full">
            <p class="eyebrow">Still your responsibility</p>
            <ul class="mt-4 space-y-3 text-[15px] text-text">
              <li class="flex items-start gap-3">
                <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>Network isolation (VLAN, firewall, monitoring)</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>Bluetooth + unused-radio lockdown</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>Signed, staged OTA update policy</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>Per-device attestation across a fleet</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>Incident-response playbook</span>
              </li>
            </ul>
          </Card>
        </Reveal>
      </div>
    </Section>

    <!-- ============================================================
         VERIFY SNIPPET — uses real <CodeBlock> component
         ============================================================ -->
    <Section
      eyebrow="Step 3"
      heading="Verify firmware before you deploy."
    >
      <Reveal>
        <p class="max-w-2xl text-text-secondary">
          This is the same script our security service runs on every robot
          before we admit it to a customer network. It asserts a pinned
          firmware version, verifies the signed image, and locks the radios
          that don't belong on a production VLAN.
        </p>
      </Reveal>
      <Reveal :delay="100" class="mt-8">
        <CodeBlock
          filename="firmware_verify.py"
          language="python"
          :code="verifyCode"
        />
      </Reveal>
      <Reveal :delay="200" class="mt-6">
        <NuxtLink
          to="https://github.com/qtvue/unitree-fleet-hardening"
          target="_blank"
          rel="noopener"
          class="inline-flex items-center gap-2 border border-dashed border-border bg-bg px-4 py-2 font-mono text-xs uppercase tracking-wider text-text-secondary transition-all hover:border-primary hover:text-primary"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.5-.3-5.2-1.3-5.2-5.6 0-1.2.4-2.3 1.2-3.1-.1-.3-.5-1.5.1-3 0 0 1-.3 3.2 1.2.9-.3 1.9-.4 2.9-.4s2 .1 2.9.4c2.2-1.5 3.2-1.2 3.2-1.2.6 1.5.2 2.7.1 3 .7.8 1.2 1.9 1.2 3.1 0 4.4-2.7 5.4-5.2 5.6.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z"/>
          </svg>
          Full hardening scripts on GitHub →
        </NuxtLink>
      </Reveal>
    </Section>

    <!-- ============================================================
         FAQ — uses real <FaqView> component (emits FAQPage JSON-LD)
         ============================================================ -->
    <Section
      tone="surface"
      eyebrow="FAQ"
      heading="UniPwn questions, answered honestly."
    >
      <FaqView
        :questions="faqs"
        url="https://qtvue.com/unitree-security"
        title="Unitree Security & UniPwn Hardening"
        :description="description"
      />
    </Section>

    <!-- ============================================================
         INTERNAL LINKS — routes to existing surfaces
         ============================================================ -->
    <Section eyebrow="Related" heading="Keep reading.">
      <div class="grid gap-4 md:grid-cols-3">
        <Reveal>
          <NuxtLink
            to="/services/security"
            class="group block h-full border border-dashed border-border bg-surface p-5 transition-all hover:border-primary/60 hover:bg-primary-50/40"
          >
            <p class="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">Service</p>
            <h3 class="mt-2 text-base font-bold text-text group-hover:text-primary">
              Security &amp; Hardening
            </h3>
            <p class="mt-2 text-sm text-text-secondary">
              Our full security engagement scope — what's in, what's out, and how we deliver.
            </p>
            <p class="mt-3 font-mono text-[11px] uppercase tracking-wider text-text-muted">
              Service page →
            </p>
          </NuxtLink>
        </Reveal>
        <Reveal :delay="80">
          <NuxtLink
            to="/blog/post-unipwn-2025"
            class="group block h-full border border-dashed border-border bg-surface p-5 transition-all hover:border-primary/60 hover:bg-primary-50/40"
          >
            <p class="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">Editorial</p>
            <h3 class="mt-2 text-base font-bold text-text group-hover:text-primary">
              Post-UniPwn: what the 2025 disclosure revealed
            </h3>
            <p class="mt-2 text-sm text-text-secondary">
              The full technical walkthrough — CVE-style disclosure, attack surface, and what Unitree's patch actually does.
            </p>
            <p class="mt-3 font-mono text-[11px] uppercase tracking-wider text-text-muted">
              Read the advisory →
            </p>
          </NuxtLink>
        </Reveal>
        <Reveal :delay="160">
          <NuxtLink
            to="/robot-review-checklist"
            class="group block h-full border border-dashed border-border bg-surface p-5 transition-all hover:border-primary/60 hover:bg-primary-50/40"
          >
            <p class="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">Free tool</p>
            <h3 class="mt-2 text-base font-bold text-text group-hover:text-primary">
              Robot Review Checklist
            </h3>
            <p class="mt-2 text-sm text-text-secondary">
              47 checks across mechanical, structural, and narrative layers. Tick lines, progress saves locally.
            </p>
            <p class="mt-3 font-mono text-[11px] uppercase tracking-wider text-text-muted">
              Open the tool →
            </p>
          </NuxtLink>
        </Reveal>
      </div>
    </Section>

    <!-- ============================================================
         FINAL CTA — single, on-brand, matches site pattern
         ============================================================ -->
    <section class="bg-ink-bg text-ink-text">
      <div class="mx-auto max-w-3xl px-6 py-20 text-center md:py-28">
        <h2 class="font-display text-3xl font-extrabold leading-tight md:text-5xl">
          Harden your fleet before the next disclosure.
        </h2>
        <p class="mt-6 text-lg text-ink-text/80 max-w-2xl mx-auto">
          Submit your use case. We'll tell you exactly what your platforms
          need, free — and quote the hardening engagement only if it's a fit.
        </p>
        <div class="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <NuxtLink
            to="/intake"
            class="group relative inline-flex h-12 items-center font-mono text-xs font-semibold uppercase tracking-[0.12em] text-ink transition-all duration-200 bg-accent hover:opacity-90"
            style="clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 0 100%, 16px 50%); padding-left: 28px; padding-right: 32px;"
          >
            <span class="pl-3 sm:pl-4">Submit your use case</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="ml-2 transition-transform group-hover:translate-x-0.5">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>