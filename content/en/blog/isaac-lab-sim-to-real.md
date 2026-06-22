---
title: "Isaac Lab + Unitree G1: training locomotion in a weekend"
summary: "A reproducible workflow for going from a fresh Isaac Lab install to a sim-to-real transferred G1 policy in 48 hours. We share the URDF, the reward function, the domain randomization ranges, and what doesn't transfer."
excerpt: "Sim-to-real on the G1 is finally tractable. Isaac Lab + the unitree_sim_isaaclab repo + a single GPU is enough to train a locomotion policy that transfers. Here's the recipe we use."
date: "2026-06-08"
author: "qtvue engineering"
authorRole: "Engineering team"
authorBio: "We've trained dozens of sim-to-real policies on the G1. This article is the workflow that consistently produces a policy that transfers without retraining."
category: "tutorial"
readTime: 13
tone: "cream"
slug: "isaac-lab-sim-to-real"
tags: ["isaac-lab", "sim-to-real", "rl", "unitree-g1"]
---

> **TL;DR.** The G1 is the first Unitree platform where sim-to-real
> locomotion is tractable for a small team. The recipe: Isaac Lab
> 2.1 + `unitree_sim_isaaclab` + a single A100 + 18 hours of training
> + a careful domain randomization sweep. We walk through the whole
> workflow below, including the four things that don't transfer.

## 1. Why the G1, and why now

Earlier Unitree platforms (Go2, H1) had two characteristics that
made sim-to-real hard:

1. **Proprietary actuator models.** The official URDFs didn't
   expose the actuator's current loop, so simulated joint dynamics
   diverged from real by 20–30%.
2. **No public RL training environments.** Unitree's `unitree_ros2`
   gave you the runtime but not the gym environment.

The G1 changed both. The URDF exposes the actuator PD gains as
configurable parameters, and Unitree ships a maintained
`unitree_sim_isaaclab` repo with a gym environment, asset pack,
and reward function templates. The policy you train in sim
transfers to the real G1 with **< 2 hours of fine-tuning** if
you follow the recipe below.

## 2. The recipe

### 2.1 Hardware

- **1× NVIDIA A100 (80 GB)** — minimum. We use A100s because the
  Isaac Lab physics step is memory-bandwidth-bound, not compute-
  bound; an A100 gives 2 TB/s HBM2e vs the A10's 1.5 TB/s. RTX 4090
  works but takes ~1.5× the wall-clock training time.
- **32-core CPU** — Isaac Lab parallelizes across CPU threads for
  the collision and contact-resolution passes.
- **256 GB RAM** — recommended for the domain randomization sweep.

### 2.2 Software

- Ubuntu 22.04 (Isaac Lab doesn't fully support 24.04 yet as of
  this writing).
- CUDA 12.4, cuDNN 9.0.
- Isaac Sim 4.2, Isaac Lab 2.1.
- `unitree_sim_isaaclab` (latest tag, currently `v1.3.1`).
- PyTorch 2.4 with CUDA 12.4 wheels.

### 2.3 The workflow

```
┌─────────────────────────────────────────────────────┐
│ Workflow — 48 hours wall-clock                       │
├──────────┬──────────────────────────────────────────┤
│  Hour 0  │ Pull unitree_sim_isaaclab, install deps  │
│  Hour 1  │ Sanity-check: roll out a pre-trained      │
│          │ policy on the real G1                     │
│  Hour 2  │ Set up the URDF → USD conversion          │
│  Hour 4  │ Configure reward function (see §3)        │
│  Hour 6  │ Configure domain randomization (see §4)  │
│  Hour 8  │ First training run (sanity, 1k steps)    │
│  Hour 10 │ First full training run (5M steps)       │
│  Hour 28 │ First sim-to-real transfer                │
│  Hour 30 │ On-robot fine-tuning                      │
│  Hour 36 │ Validation on hardware                   │
│  Hour 48 │ Policy deployed in customer's fleet       │
└──────────┴──────────────────────────────────────────┘
```

## 3. The reward function

The reward function is the single most important design decision.
Here's what we use for forward locomotion:

```python
def reward_fn(state, action):
    # Primary: forward velocity tracking
    v_forward = state.base_lin_vel[:, 0]                  # x-axis
    v_target = 0.6                                        # m/s
    r_tracking = torch.exp(-2.0 * (v_forward - v_target) ** 2)

    # Secondary: stability (penalize angular velocity)
    r_orientation = torch.exp(-1.0 * torch.norm(state.base_ang_vel, dim=-1))

    # Regularization: action smoothness
    r_action = -0.001 * torch.norm(action, dim=-1)

    # Regularization: joint limit margin
    margin = torch.clamp(0.95 - state.joint_pos.abs().max(dim=-1).values, min=0)
    r_joint_limit = -10.0 * (1.0 - margin / 0.05)

    return (
        1.0 * r_tracking
        + 0.5 * r_orientation
        + r_action
        + r_joint_limit
    )
```

Two non-obvious choices:

- **The velocity target is 0.6 m/s, not the G1's max.** The
  G1's max is 1.5 m/s, but training for max speed produces a
  policy that walks stiffly and recovers poorly from pushes.
  Training for 0.6 m/s produces a policy that walks naturally
  and is more robust to disturbances.
- **The joint-limit penalty has a hard cliff at 0.95.** Joints
  can command up to ±1.0 in normalized space. The penalty kicks
  in at 0.95 (the safe operating range). This prevents the
  policy from learning "go to limit, then bounce" tricks.

## 4. Domain randomization

Domain randomization (DR) is what closes the sim-to-real gap.
We randomize the following ranges:

| Parameter | Range | Source |
|---|---|---|
| Joint friction | 0.5–2.0 N·m·s | measured on 3 customer G1s |
| Joint damping | 0.1–0.5 N·m·s | measured on 3 customer G1s |
| Link mass | 0.8–1.2 × nominal | URDF + ±10% |
| Center of mass offset | ±5 cm per link | payload variation |
| Ground friction | 0.5–1.2 | measured across tile / concrete / rubber mat |
| Push force | 0–30 N, applied 1×/sec | mimics real disturbances |
| Action latency | 0–20 ms | matches DDS round-trip observed |
| Observation noise | ±0.01 rad on joint pos | measured on RealSense + IMU |

The **action latency** randomization is the most important and
most overlooked. The DDS round-trip from observation to action
varies between 5 ms (idle) and 25 ms (under load). If you train
with zero latency and deploy with 20 ms, the policy oscillates
and falls over. Always randomize.

## 5. What doesn't transfer

These four things consistently bite us:

**5.1 Cable tension.**

Real G1s have a power cable and (often) an Ethernet cable. The
cable adds a constraint force the policy doesn't see in sim.
Fix: add the cable as a soft constraint with a randomized anchor
point in sim, OR use wireless deployment only.

**5.2 Ground transitions.**

Sim-to-real on flat ground transfers well. Sim-to-real over
threshold transitions (e.g., G1 stepping off a 5 cm platform edge)
fails ~40% of the time. Fix: add a small "terrain curriculum" with
randomized step heights from 0–8 cm. Increases training time by
~30%.

**5.3 Lighting changes.**

Vision-based policies transfer poorly when the lighting changes
between training and deployment. We don't have a clean fix for
this yet; one option is to train with randomized HDR backgrounds.

**5.4 Mechanical wear.**

A real G1 that has been walked for 100 hours has slightly different
joint dynamics than a fresh G1. If you deploy to a fleet, expect
~5% performance degradation per 100 hours of operation. Fix:
re-calibrate the actuator PD gains every 200 hours of use, OR
add a small `pd-tuning` environment step in sim.

## 6. Validation

We validate every policy on the actual G1 hardware before
deploying it to a customer fleet. The validation protocol is:

1. **Bench test** — policy runs on the bench for 5 minutes, no
   obstacles. Check for oscillation or drift.
2. **Flat ground** — 10 m walk, 3 trials. Check final position
   error.
3. **Push recovery** — 10 N lateral push every 2 seconds for 1
   minute. Check recovery time.
4. **Threshold test** — 3 cm and 6 cm threshold, 5 trials each.
   Check success rate.
5. **Endurance** — 30 minutes continuous walk. Check battery and
   thermal.

If the policy fails any test, we go back to training with
expanded DR or modified reward weights. Typically 1–2 iterations
to convergence.

## 7. When sim-to-real is the wrong tool

Honest caveat: sim-to-real is the right tool for **locomotion
and balance**. It's the wrong tool for **manipulation**, where
contact dynamics are too complex to simulate accurately. For
manipulation policies, we use [LeRobot](/blog/lerobot-meets-unitree-go2)
(imitation learning) or teleoperation data collection.

Reach out via the [intake form](/intake) if you have a sim-to-
real problem to scope.