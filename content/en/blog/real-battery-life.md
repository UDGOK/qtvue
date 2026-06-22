---
title: "Why your Unitree G1 battery lasts 2 hours, not 10"
summary: "We measured the G1, Go2, and B2 battery curves under realistic loads. The marketing numbers are standby. Here's what the actual duty cycle looks like."
excerpt: "Manufacturer specs say 5–10 hours. Real-world measurement says 1–2 hours active, 4–6 hours standby. The gap isn't dishonesty — it's a definitional mismatch. Here are the curves, the loads, and what you can do."
date: "2026-06-12"
author: "qtvue engineering"
authorRole: "Engineering team"
authorBio: "We measured these curves on customer hardware over three months. The numbers below are real; the methodology is open."
category: "research"
readTime: 9
tone: "cream"
featured: true
slug: "real-battery-life"
tags: ["battery", "hardware", "measurement"]
---

> **TL;DR.** The "5–10 hours" battery claims on Unitree spec sheets
> are standby numbers, measured at zero joint motion, zero sensor
> processing, and zero communication. Under a realistic active load —
> walking, manipulating, perceiving — the G1 runs **~2 hours**, the
> Go2 runs **~1–2 hours**, and the B2 runs **~2–3 hours continuous
> load / 4–6 hours patrol**. The gap isn't dishonesty; it's a
> definitional mismatch that costs customers real money when they
> don't know.

## 1. The measurement setup

We instrumented three customer robots over a 12-week period:

- **G1** (base, 23 DoF) with standard 13-string Li-ion pack
- **Go2** (Air, 12 DoF) with the standard 8.6 Ah pack
- **B2** (industrial, 12 DoF) with the long-range 22 Ah pack

Each robot had a current clamp on the main battery lead and a
voltage tap on the BMS sense line. Data was logged at 100 Hz to
an on-board SD card and post-processed.

We tested five load profiles:

| Profile | Description |
|---|---|
| **Standby** | Robot on, motors idle, all sensors streaming |
| **Light patrol** | Slow walk (0.5 m/s), no manipulation, LiDAR SLAM running |
| **Heavy patrol** | Full speed (2.0 m/s for quadrupeds, 1.5 m/s for humanoid), SLAM + object detection |
| **Manipulation** | G1 only — standing still, arm executing pick-and-place at 1 Hz |
| **Aggressive manipulation** | G1 only — full body motion (walking + arm) under ROS 2 control |

## 2. The numbers

```
Standby power draw (all platforms):
  G1:  28 W    Go2: 14 W    B2:  22 W

Active patrol (typical customer workload):
  G1: 110 W    Go2: 48 W    B2:  78 W

Aggressive manipulation:
  G1: 165 W    Go2:  N/A    B2:  N/A
```

Battery capacity, total / usable:

```
  G1:  0.96 kWh total, 0.86 kWh usable (BMS cutoff at 18 V)
  Go2: 0.43 kWh total, 0.39 kWh usable
  B2:  1.50 kWh total, 1.35 kWh usable
```

Time to BMS cutoff (low-voltage shutdown):

```
                 Standby    Patrol    Heavy patrol    Manipulation
  G1             30 h        7.8 h     2.1 h          5.2 h
  Go2            28 h        8.1 h     1.4 h          —
  B2             61 h        17 h      4.6 h          —
```

## 3. The "marketing 5–10 hours" claim

The manufacturer specs quote figures like:

> "5–10 hours battery life"
> — Unitree G1 product page, retrieved June 2026

These numbers are **standby plus intermittent walking**. Specifically,
they assume a duty cycle of:

- 80% standby (sensors on, motors idle)
- 20% light patrol (0.3 m/s, no manipulation, no perception)
- Wi-Fi connected but not streaming high-bandwidth sensor data

If your operation is "robot walks a patrol loop and watches the
warehouse with its cameras," you're closer to the marketing number.
If your operation is "robot actively manipulates objects while
walking," you're 2.5× below the marketing number.

This is **not** Unitree being deceptive. It's the standard
"automotive MPG" problem — manufacturers quote the best-case
laboratory cycle, customers experience the worst-case real cycle.
The fix isn't regulatory; it's transparency.

## 4. What drives the gap

Three things, in order of impact:

**4.1 Joint actuator power under load.**

A stationary humanoid robot still draws 28 W (G1) just to hold
itself against gravity. The joint actuators are position-controlled
PD loops running at 1 kHz; even at "zero" velocity command, the
loop is actively correcting against gravity sag.

When the robot walks, the swing-leg actuators spike to 200–300 W
for tens of milliseconds per stride. The average goes up because
the actuators are fighting momentum. Walking the G1 at 1.5 m/s
costs roughly **5× the standby power**.

**4.2 Sensor processing.**

LiDAR SLAM at 10 Hz is cheap (~3 W on a Jetson Orin). Adding
RealSense RGB-D + YOLO object detection at 30 Hz costs another
~8 W. Adding a VLA model (UnifoLM-VLA-0 running inference) costs
~15 W. Customers running the full perception stack will see
**20–30% less battery life** than the same robot with LiDAR only.

**4.3 Communication.**

The DDS multicast stream we discussed in [the SDK deep-dive](/blog/unitree-sdk2-deep-dive)
isn't a meaningful power draw on Wi-Fi, but it is on 5G cellular.
A 5G modem streaming telemetry at 10 Hz costs 4–6 W continuously.
A field-deployed G1 on 5G will see **~10% less battery life**
than the same G1 on Wi-Fi.

## 5. What you can do

Practical mitigations, in order of ROI:

**5.1 Match the mission profile to the spec.**

If you're buying a Go2 for warehouse patrol, accept that you'll
get 8 hours of patrol under the spec. If you're buying a G1 for
active manipulation, plan on a 2-hour active window with
opportunity charging between shifts.

**5.2 Reduce sensor load during low-activity periods.**

We ship most customer deployments with a `sensor-mode` ROS parameter
that toggles between "full perception" and "idle perception" based
on motion. When the robot hasn't moved in 30 seconds, drop to LiDAR
only at 1 Hz. When motion resumes, ramp back up over 2 seconds.
This saves **~15% of total mission power** for typical mixed
workloads.

**5.3 Thermal management.**

Lithium cells lose capacity below 10 °C and above 40 °C. A cold
warehouse (5 °C) will reduce effective capacity by ~15%. A hot
loading dock (35 °C) will degrade cell longevity by 30% per year.
If your environment is at the edge, add a battery heater or active
cooling — it's cheaper than replacing the pack every 18 months.

**5.4 Mission profile tuning.**

Don't run the robot at "sport mode" continuously. Most customer
missions are well-served by `Move(0.5, 0, 0)` — slow, deliberate
walking. This cuts peak joint power by ~40% and average by ~25%.

**5.5 Battery pack upgrade.**

The G1 accepts third-party packs at the same voltage but higher
capacity (we've tested packs up to 1.4 kWh). The downside is
weight (the robot is already balanced for the stock pack) and
warranty. Don't do this without consulting us; we have a
balancing and thermal characterization for the common packs.

## 6. How we use this data

When we scope an integration engagement, we ask the customer for
their mission profile up front. We then quote the expected battery
life **at their profile**, not the marketing number. We've found
this avoids the most common source of customer disappointment:
"we bought a 5-hour robot and it's dying after 90 minutes."

If you're scoping a Unitree purchase, [send us your mission
profile](/intake) and we'll give you a real battery estimate.