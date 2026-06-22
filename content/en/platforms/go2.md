---
title: "Unitree Go2"
summary: "The 4D LiDAR quadruped that's become the accessible workhorse for research, inspection, security, and education."
slug: "go2"
type: "Quadruped"
priceFrom: "~$1,600 (Air)"
whoItsFor: "Researchers, inspection teams, security, education"
oneLiner: "4D LiDAR robot dog, ~15 kg, 2.5 m/s, climbs 30° — the accessible workhorse."
payload: "≈ 8 kg (loadable)"
dof: "12 DoF"
ipRating: "IP67"
useCases:
  - "Autonomous inspection (factories, warehouses, perimeter)"
  - "Research platform for SLAM, navigation, RL"
  - "Education: entry-level legged robotics"
  - "Security patrol with payload sensor (thermal, gas, etc.)"
specs:
  - { k: "Weight (with battery)", v: "≈ 15 kg" }
  - { k: "Top speed", v: "≈ 2.5 m/s" }
  - { k: "Climb grade", v: "30°" }
  - { k: "Battery life (real)", v: "1–2 hours active, 5–10 hours standby" }
  - { k: "Sensors", v: "4D LiDAR (Unitree), depth cameras, optional RealSense" }
  - { k: "Compute", v: "Onboard NVIDIA Jetson Orin Nano (EDU variants)" }
codeSnippet: |
  # Go2 — basic SDK walk with obstacle stop
  from unitree_sdk2py.core.channel import ChannelFactoryInitialize
  from unitree_sdk2py.go2.sport.sport_client import SportClient

  ChannelFactoryInitialize(0, "eth0")
  sport = SportClient(); sport.SetTimeout(5.0); sport.Init()

  sport.Walk(true)             # stand + balance
  sport.Move(0.4, 0, 0)        # forward 0.4 m/s
  # Hook: if LiDAR reports < 0.5 m clearance, stop:
  if lidar.min_clearance < 0.5:
      sport.Move(0, 0, 0)
      sport.StopMove()
codeLanguage: "python"
codeFilename: "go2_walk.py"
callouts:
  - "IP67 means the Go2 survives puddles, dust, and rain — but not submersion."
  - "Real-world battery is 1–2 hours active; manufacturer claims of 5–10 hours are standby-only."
  - "4D LiDAR is wide-FOV (360° × 90°). Excellent for SLAM, less ideal for small-object detection at distance."
videoSrc: "/videos/go2-walk.mp4"
videoPoster: "/videos/go2-walk-poster.jpg"
videoCaption: "Stock-clipped · outdoor walk · 12s loop"
gallery:
  - { label: "Outdoor walk",   src: "/videos/go2-walk.mp4",      poster: "/videos/go2-walk-poster.jpg",      caption: "Park + lakeside · 8s" }
  - { label: "All-terrain",    src: "/videos/go2-terrain.mp4",   poster: "/videos/go2-terrain-poster.jpg",   caption: "Rocks + water · 5.4s" }
  - { label: "Payload + ride", src: "/videos/go2-lifestyle.mp4", poster: "/videos/go2-lifestyle-poster.jpg", caption: "Operator on top · 3.3s" }
order: 1
---

# Unitree Go2

The Go2 is the entry point to the Unitree quadruped family. It pairs a 4D LiDAR
with onboard compute and a real-world battery of 1–2 hours. For research labs,
inspection teams, and security operators, it's the workhorse.

## Where the Go2 fits

Most Go2 deployments we see are one of three:

- **Autonomous inspection** of a factory floor, warehouse aisle, or perimeter. The
  Go2 walks a recorded path, the onboard LiDAR keeps it inside a virtual fence,
  and the operator gets a daily pointcloud diff.
- **Research** for SLAM, navigation, RL, or multi-agent coordination. The Python
  and C++ SDKs cover the same DDS interface the rest of the Unitree range uses.
- **Security** with a payload sensor — thermal camera, gas sniffer, radiation probe.
  The 8 kg loadable payload is enough for a 360° camera rig plus a small compute
  box.

## Programming the Go2

The Go2 uses the same `unitree_sdk2_python` as the rest of the family. The example
to the right is a minimal "walk until something is close, then stop" pattern —
it's a starting point for the inspection case, not a finished product.

For the full sim-to-real workflow, see
[the Isaac Lab integration docs](https://github.com/unitreerobotics/unitree_sim_isaaclab).
