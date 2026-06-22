<script setup lang="ts">
useSeoMeta({
  title: 'Documentation — qtvue',
  description: 'Cell design guides, KAREL cheatsheet, OLP tutorials, integration recipes, and the qtvue platform reference.',
})
</script>

<template>
  <div>
    <section class="border-b border-border bg-bg">
      <Container class="py-20 sm:py-28">
        <Reveal>
          <p class="eyebrow">Documentation</p>
          <h1 class="display-lg mt-4 max-w-4xl">
            Everything you need to <span class="hl">run the cell</span>.
          </h1>
          <p class="mt-6 max-w-2xl text-lg text-text-secondary sm:text-xl">
            Cell design guides, programming references, integration recipes, and the qtvue
            platform docs. Written by the engineers who built the cells.
          </p>
        </Reveal>
      </Container>
    </section>

    <Section>
      <Reveal>
        <div class="grid gap-6 md:grid-cols-2">
          <Card pad="lg" class="flex flex-col">
            <p class="eyebrow text-primary">Cell design</p>
            <h3 class="mt-2 text-xl font-bold tracking-tight text-text">Cell design guides</h3>
            <p class="mt-3 flex-1 text-sm text-text-secondary">
              Layout, reach, cycle-time, safety envelope — how to spec a cell from scratch
              and how to spec a retrofit. Includes our 30-page checklist.
            </p>
            <CodeBlock
              filename="cell-checklist.md"
              language="markdown"
              :code="cellChecklist"
            />
          </Card>

          <Card pad="lg" class="flex flex-col">
            <p class="eyebrow text-primary">Programming</p>
            <h3 class="mt-2 text-xl font-bold tracking-tight text-text">KAREL cheatsheet</h3>
            <p class="mt-3 flex-1 text-sm text-text-secondary">
              The patterns we use every day: motion profiling, I/O maps, error handling,
              vision calls, and the 12 utility routines we copy into every program.
            </p>
            <CodeBlock
              filename="pick.karel"
              language="karel"
              :code="karelCheat"
            />
          </Card>

          <Card pad="lg" class="flex flex-col">
            <p class="eyebrow text-primary">Integration</p>
            <h3 class="mt-2 text-xl font-bold tracking-tight text-text">Recipes</h3>
            <p class="mt-3 flex-1 text-sm text-text-secondary">
              Step-by-step recipes for the integrations you do most: FANUC + Cognex,
              ABB + Keyence, UR + Robotiq, KUKA + SICK safety scanner.
            </p>
            <CodeBlock
              filename="integration.yaml"
              language="yaml"
              :code="integrationYaml"
            />
          </Card>

          <Card pad="lg" class="flex flex-col">
            <p class="eyebrow text-primary">Platform</p>
            <h3 class="mt-2 text-xl font-bold tracking-tight text-text">qtvue platform reference</h3>
            <p class="mt-3 flex-1 text-sm text-text-secondary">
              The API and dashboard for managing your deployed cells: health, uptime,
              cycle counts, alerts, program versions, and remote hand-off.
            </p>
            <CodeBlock
              filename="api.sh"
              language="bash"
              :code="apiBash"
            />
          </Card>
        </div>
      </Reveal>
    </Section>
  </div>
</template>

<script lang="ts">
const cellChecklist = `# qtvue cell design checklist
reach_check: pass
collision_check: pass
cycle_time_target: 28.4s
uptime_sla: 99.4%
operator_safety: iso_10218
eoat_cycles_bench: 10000
commissioned_by: qtvue`

const karelCheat = `PROGRAM pick_place
  -- Standard qtvue pick pattern
  MOVE TO home SPEED 100%
  WAIT FOR dio[fixt_ready] = ON
  MOVE TO pick[1] SPEED 800mm/s FINE
  CLOSE gripper FORCE 40N
  MOVE TO place[1] SPEED 1200mm/s FINE
  OPEN gripper
  RETRY ON dio[miss] MAX 3
END PROGRAM`

const integrationYaml = `# FANUC + Cognex integration
robot: fanuc-m-2000
vision: cognex-in-sight-9912
protocol: tcp
port: 2000
trigger: dio[24]
result_register: r[100]
cycle_timeout_ms: 1500
retry_on_miss: 3
fallback: place_reject`

const apiBash = `# Get live cell health
curl -H "Authorization: Bearer $QTVUE_KEY" \\
  https://api.qtvue.com/v1/cells

# Trigger a remote program reload
curl -X POST -H "Authorization: Bearer $QTVUE_KEY" \\
  -d '{"program": "pick_v3.karel"}' \\
  https://api.qtvue.com/v1/cells/CELL-07/reload`
</script>
