---
title: "Integrate"
summary: "End-to-end integration — hardware, mounting, networking, perception stack, on-site commissioning, and operator training."
label: "03 — Integrate"
icon: "Wrench"
order: 3
inScope:
  - "Mechanical mounting and EOAT design"
  - "Network deployment (isolated VLAN, firewall, monitoring)"
  - "Perception stack integration (cameras, LiDAR, sensors)"
  - "On-site commissioning and acceptance test"
  - "Operator and maintenance training"
  - "Runbook and SOPs for the handoff"
  - "30-day on-site warranty window"
notInScope:
  - "Long-term support contracts (separate engagement)"
  - "Custom robot manufacturing (we integrate off-the-shelf Unitree)"
  - "Code writing for novel autonomy (see Program)"
codeLanguage: "yaml"
codeFilename: "network_segmentation.yaml"
codeSnippet: |
  # Network isolation — UniPwn-aware deployment
  vlans:
    robots:
      vlan_id: 40
      cidr: 10.40.0.0/24
      members: [g1, b2, go2_1, go2_2]
      firewall:
        inbound: deny_all
        outbound:
          - to: control_plane
            port: 8443
            proto: tls
          - to: telemetry_collector
            port: 9090
            proto: grpc
    control_plane:
      vlan_id: 41
      cidr: 10.41.0.0/24
      members: [qtvue_dashboard, customer_hmi]
  bluetooth:
    enabled: false          # post-UniPwn 2025
    firmware:
      verified: required    # before first power-on
      pinned_version: ">=1.4.2"
cta:
  label: "Submit your use case"
  to: "/intake"
---

# Integrate

The third way we help: end-to-end integration. Hardware, mounting,
networking, perception stack, on-site commissioning, and operator
training. You get a working system, not a box of parts.

## What's in scope

- **Mechanical mounting** — floor mounts, ceiling rails, charging
  docks, payload brackets.
- **EOAT design** — grippers, weld guns, custom tools when the
  standard catalog doesn't cover your part.
- **Network deployment** — isolated VLAN, firewall, monitoring, and
  a network diagram your IT team can review.
- **Perception stack** — cameras, LiDAR, sensors, calibration, and
  the SLAM/mapping pipeline.
- **On-site commissioning** — physical install, wiring, acceptance
  test, and sign-off.
- **Operator and maintenance training** — written SOPs, recorded
  walkthroughs, and a 2-hour hands-on session with your team.
- **30-day on-site warranty** window after sign-off.

## What's not in scope

- Long-term support — separate engagement, quoted after the warranty
  window.
- Custom robot manufacturing — we integrate off-the-shelf Unitree,
  not custom builds.
- Writing novel autonomy code — see [Program](/services/program).

## The network piece matters

After the [UniPwn disclosure of 2025](https://unitree.com), we don't
deploy any Unitree platform on a flat network. Every integration
ships with:

- Bluetooth disabled (the disclosed attack vector)
- Firmware verified and pinned to a known-good version
- Robot network isolated from the corporate LAN
- Outbound-only firewall rules to the control plane

The example to the right is a representative VLAN config. We tune
this for your environment in the scoping call.
