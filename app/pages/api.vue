<script setup lang="ts">
useSeoMeta({
  title: 'API Reference — qtvue',
  description: 'REST API for the qtvue platform. Manage cells, programs, health, and alerts from your own tools.',
})
</script>

<template>
  <div>
    <section class="border-b border-border bg-bg">
      <Container class="py-20 sm:py-28">
        <Reveal>
          <p class="eyebrow">API reference</p>
          <h1 class="display-lg mt-4 max-w-4xl">
            Integrate with the <span class="hl">qtvue platform</span>.
          </h1>
          <p class="mt-6 max-w-2xl text-lg text-text-secondary sm:text-xl">
            REST API for managing your deployed cells: health, uptime, cycle counts, alerts,
            program versions, and remote hand-off. Authenticated with a per-cell bearer token.
          </p>
        </Reveal>
      </Container>
    </section>

    <Section>
      <Reveal>
        <div class="grid gap-6 lg:grid-cols-2">
          <Card pad="lg" class="flex flex-col">
            <div class="flex items-center gap-3">
              <span class="rounded-md bg-primary px-2 py-0.5 font-mono text-[10px] font-bold text-paper">GET</span>
              <h3 class="text-lg font-bold tracking-tight text-text">/v1/cells</h3>
            </div>
            <p class="mt-3 flex-1 text-sm text-text-secondary">
              List all cells you have access to. Returns cell ID, name, status, uptime,
              and last-seen timestamp.
            </p>
            <CodeBlock
              filename="curl"
              language="bash"
              :code="cellsCurl"
            />
          </Card>

          <Card pad="lg" class="flex flex-col">
            <div class="flex items-center gap-3">
              <span class="rounded-md bg-primary px-2 py-0.5 font-mono text-[10px] font-bold text-paper">GET</span>
              <h3 class="text-lg font-bold tracking-tight text-text">/v1/cells/:id</h3>
            </div>
            <p class="mt-3 flex-1 text-sm text-text-secondary">
              Get full health, cycle-time history, and active program for a single cell.
            </p>
            <CodeBlock
              filename="curl"
              language="bash"
              :code="cellCurl"
            />
          </Card>

          <Card pad="lg" class="flex flex-col">
            <div class="flex items-center gap-3">
              <span class="rounded-md bg-accent px-2 py-0.5 font-mono text-[10px] font-bold text-text">POST</span>
              <h3 class="text-lg font-bold tracking-tight text-text">/v1/cells/:id/reload</h3>
            </div>
            <p class="mt-3 flex-1 text-sm text-text-secondary">
              Push a new program version to a cell. Atomic swap with automatic rollback if
              the cell doesn't acknowledge within 30 seconds.
            </p>
            <CodeBlock
              filename="curl"
              language="bash"
              :code="reloadCurl"
            />
          </Card>

          <Card pad="lg" class="flex flex-col">
            <div class="flex items-center gap-3">
              <span class="rounded-md bg-primary px-2 py-0.5 font-mono text-[10px] font-bold text-paper">GET</span>
              <h3 class="text-lg font-bold tracking-tight text-text">/v1/cells/:id/alerts</h3>
            </div>
            <p class="mt-3 flex-1 text-sm text-text-secondary">
              Stream live alerts via SSE: errors, warnings, predictive-maintenance signals,
              and support-ticket updates.
            </p>
            <CodeBlock
              filename="curl"
              language="bash"
              :code="alertsCurl"
            />
          </Card>
        </div>
      </Reveal>
    </Section>

    <Section tone="ink">
      <Reveal>
        <div class="grid gap-8 lg:grid-cols-2">
          <div>
            <p class="eyebrow text-accent">Authentication</p>
            <h2 class="mt-3 display-md text-ink-text">Bearer token per cell.</h2>
            <p class="mt-4 text-ink-text/70">
              Every cell ships with a unique bearer token. Pass it in the
              <code class="rounded bg-ink-text/10 px-1.5 py-0.5 font-mono text-sm text-ink-text">Authorization</code>
              header. Tokens can be rotated from the dashboard without downtime.
            </p>
            <div class="mt-6 flex flex-col gap-3 sm:flex-row">
              <Btn href="/contact" variant="accent" size="md" arrow>Request API access</Btn>
              <Btn href="/docs" variant="secondary" size="md">Read the docs</Btn>
            </div>
          </div>
          <CodeBlock
            filename="auth-example.sh"
            language="bash"
            :code="authExample"
          />
        </div>
      </Reveal>
    </Section>
  </div>
</template>

<script lang="ts">
const cellsCurl = `curl -H "Authorization: Bearer $QTVUE_KEY" \\
  https://api.qtvue.com/v1/cells

# Response
{
  "cells": [
    { "id": "CELL-07", "name": "Weld line 7", "status": "online", "uptime_pct": 99.7 },
    { "id": "CELL-12", "name": "Pack line 1", "status": "online", "uptime_pct": 99.1 }
  ]
}`

const cellCurl = `curl -H "Authorization: Bearer $QTVUE_KEY" \\
  https://api.qtvue.com/v1/cells/CELL-07

# Response
{
  "id": "CELL-07",
  "name": "Weld line 7",
  "status": "online",
  "uptime_pct": 99.7,
  "cycle_time_s": 28.4,
  "active_program": "weld_v12.karel",
  "last_seen": "2026-06-22T00:30:00Z"
}`

const reloadCurl = `curl -X POST \\
  -H "Authorization: Bearer $QTVUE_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"program": "weld_v13.karel", "checksum": "sha256:..."}' \\
  https://api.qtvue.com/v1/cells/CELL-07/reload

# Response
{ "status": "applied", "version": 13, "applied_at": "2026-06-22T00:30:00Z" }`

const alertsCurl = `curl -N -H "Authorization: Bearer $QTVUE_KEY" \\
  https://api.qtvue.com/v1/cells/CELL-07/alerts

# SSE stream of alerts
event: alert
data: {"level":"warning","code":"W-203","message":"EOAT cycle count approaching threshold","ts":"..."}`

const authExample = `# Set your cell's API key
export QTVUE_KEY="qtv_••••••••••••"

# Test it
curl -H "Authorization: Bearer $QTVUE_KEY" \\
  https://api.qtvue.com/v1/ping

# Rotate (no downtime)
curl -X POST -H "Authorization: Bearer $QTVUE_KEY" \\
  https://api.qtvue.com/v1/cells/CELL-07/rotate-key`
</script>
