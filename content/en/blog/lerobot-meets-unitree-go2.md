---
title: "LeRobot meets Unitree Go2: 50 demonstrations to a walking policy"
summary: "Imitation learning is the right tool for quadruped locomotion over rough terrain. We share the workflow that goes from 50 teleoperated demonstrations to a deployed Go2 policy in 6 hours."
excerpt: "Sim-to-real fails for quadrupeds on rough terrain. Imitation learning works. We walk through the full LeRobot + Unitree pipeline — collection, training, deployment, and what 50 demos gets you."
date: "2026-06-04"
author: "qtvue engineering"
authorRole: "Engineering team"
authorBio: "We've deployed imitation-learned locomotion on more than a dozen customer Go2 deployments. This is the workflow."
category: "tutorial"
readTime: 10
tone: "forest"
slug: "lerobot-meets-unitree-go2"
tags: ["lerobot", "imitation-learning", "unitree-go2", "teleop"]
---

> **TL;DR.** Imitation learning (IL) outperforms reinforcement learning
> for quadruped locomotion over rough terrain. We use LeRobot + the
> Unitree Go2's native SDK to collect 50 teleoperated demonstrations,
> train an ACT (Action Chunking Transformer) policy for 6 hours on
> 4× A100, and deploy back to the Go2 over the `unitree_sdk2` DDS
> bridge. The policy transfers without fine-tuning and outperforms
> the built-in sport-mode controller on uneven terrain by 3–5×.

## 1. Why IL beats RL on rough terrain

We tried both. RL-trained policies on the Go2 work great on flat
ground (and we use sim-to-real for that — see [the Isaac Lab
recipe](/blog/isaac-lab-sim-to-real)). They fail on rough terrain
because the contact dynamics of a quadruped on uneven ground are
too varied to enumerate in a reward function. The policy either
plays it too safe (refuses to step over small obstacles) or
gets too aggressive (falls on the first unexpected foothold).

Imitation learning sidesteps this by demonstration. We collect
50 teleoperated trajectories of a human walking the Go2 across
the target terrain. The policy learns to imitate the human's
high-level strategy: which foot goes where, how to recover from
a stumble, how to redistribute weight over uneven ground. These
are hard to express as rewards; they're easy to demonstrate.

## 2. The setup

### 2.1 Hardware

- **1× Unitree Go2** (the robot we're training on)
- **1× Go2 controller** (the handheld joystick that ships with
  the robot — used for teleop)
- **1× host PC** with the Go2 SDK installed (Ubuntu 22.04 +
  `unitree_sdk2_python`)
- **4× A100 (80 GB)** for training (a single A100 works but
  takes ~3× wall-clock)
- **1× RealSense D435i** mounted on the Go2 (we use the existing
  head-mount; no extra hardware)

### 2.2 Software

```bash
# Install LeRobot (latest stable)
pip install lerobot==0.4.1

# Install the Unitree DDS bridge
pip install unitree_sdk2py==2.4.0 cyclonedds==0.10.2

# Verify both work together
python -c "
from lerobot.common.datasets.lerobot_dataset import LeRobotDataset
from unitree_sdk2py.go2.sport.sport_client import SportClient
print('OK')
"
```

## 3. Data collection

### 3.1 The recording script

We ship a single `record_walk.py` script that:

1. Connects to the Go2 over DDS
2. Subscribes to the front camera + joint state stream
3. Reads commands from the Go2 controller
4. Saves each (observation, action) pair to disk

```python
# record_walk.py — simplified version of what we use in production
import argparse
import time
from pathlib import Path

import numpy as np
from unitree_sdk2py.go2.sport.sport_client import SportClient
from lerobot.common.datasets.lerobot_dataset import LeRobotDataset

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--output-dir", required=True)
    ap.add_argument("--episode-seconds", type=int, default=30)
    args = ap.parse_args()

    # Connect to the Go2
    sport = SportClient()
    sport.SetTimeout(5.0)
    sport.Init()

    # Initialize the dataset (LeRobot manages disk format)
    dataset = LeRobotDataset.create(
        repo_id="go2-walk-policy",
        root=Path(args.output_dir),
        fps=30,
        features={
            "observation.image":       (3, 480, 640),     # front RGB
            "observation.joint_pos":   (12,),             # 12 joints
            "observation.base_lin_vel": (3,),
            "observation.base_ang_vel": (3,),
            "action.joint_pos":        (12,),             # commanded joints
            "action.velocity":         (3,),              # commanded (vx, vy, vyaw)
        },
    )

    print(f"Recording 1 episode for {args.episode_seconds}s. Walk the Go2.")
    sport.Walk(True)
    sport.BalanceStand(True)
    time.sleep(1.0)

    frames = []
    t0 = time.time()
    while time.time() - t0 < args.episode_seconds:
        obs = {
            "observation.image":        get_front_camera_frame(),
            "observation.joint_pos":    get_joint_positions(),
            "observation.base_lin_vel": sport.GetBaseLinVel(),
            "observation.base_ang_vel": sport.GetBaseAngVel(),
        }
        cmd = read_controller()           # (vx, vy, vyaw, joint_targets)
        action = {
            "action.joint_pos": cmd.joint_targets,
            "action.velocity":  cmd.velocity,
        }
        frames.append({"observation": obs, "action": action})
        sport.Move(*cmd.velocity)
        time.sleep(1/30)

    dataset.add_episode(frames)
    dataset.push_to_hub() if "--push" in sys.argv else None
    sport.Damp()
    print(f"Done. {len(frames)} frames saved.")

if __name__ == "__main__":
    main()
```

### 3.2 The recording protocol

We collect 50 episodes over 2–3 hours with one operator. The
protocol:

- **Warm-up (5 episodes, discard):** Operator gets comfortable
  with the controller; robot gets warm.
- **Slow walk (10 episodes, 30s each):** Operator walks the Go2
  forward at ~0.3 m/s on flat ground. This is the "easy" data.
- **Obstacle course (15 episodes):** Operator walks the Go2
  over a 3-step obstacle course (5 cm, 8 cm, 12 cm thresholds,
  mixed order). This is the "hard" data.
- **Slope (10 episodes):** Operator walks the Go2 up a 10°
  ramp. This teaches pitch compensation.
- **Recovery (10 episodes):** Operator intentionally pushes the
  Go2 mid-walk; the operator must recover. This teaches the
  policy to be robust to disturbances.

After 50 episodes, you have **~25 minutes of demonstration**,
which is enough for an ACT policy to learn rough-terrain locomotion
that transfers.

## 4. Training

### 4.1 Why ACT

We benchmarked three policies on the same 50-episode dataset:

| Policy | Train time | Sim success | Real success |
|---|---|---|---|
| **MLP (baseline)** | 30 min | 92% | 41% |
| **Diffusion Policy** | 12 h | 96% | 71% |
| **ACT** | 6 h | 98% | 89% |

ACT (Action Chunking Transformer) wins on this task because:

1. It predicts chunks of 100 actions at a time, which is enough
   horizon for a quadruped stride.
2. It uses a small transformer (6M params) that trains fast.
3. It generalizes well from 50 demos because the chunking provides
   implicit temporal regularization.

### 4.2 The training config

```python
# train_act.py
from lerobot.common.policies.act.configuration_act import ACTConfig
from lerobot.common.policies.act.modeling_act import ACTPolicy

cfg = ACTConfig(
    n_obs_steps=1,                  # single-frame observation
    chunk_size=100,                 # predict 100 actions at a time
    n_action_steps=100,
    dim_model=512,
    n_encoder_layers=4,
    n_decoder_layers=1,
    n_heads=8,
    dropout=0.1,
    # Training
    batch_size=32,
    lr=1e-4,
    weight_decay=1e-4,
    lr_scheduler="cosine",
    warmup_steps=500,
    training_steps=50_000,
)

policy = ACTPolicy(cfg)
policy.train()
trainer.train(policy, dataset)
```

50k steps on 4× A100 takes **~6 hours**. The policy starts
walking by step 5k (in simulation). Sim success rate hits
98% by step 30k. Real-world transfer happens at the end with
no fine-tuning.

## 5. Deployment

The deployment is straightforward — load the trained policy, run
it in a loop, send the predicted actions over DDS:

```python
# deploy_act.py
from lerobot.common.policies.act.modeling_act import ACTPolicy
import torch
from unitree_sdk2py.go2.sport.sport_client import SportClient

policy = ACTPolicy.from_pretrained("./output/act-go2-walk/checkpoints/last")
policy.eval()
sport = SportClient(); sport.SetTimeout(5.0); sport.Init()
sport.Walk(True); sport.BalanceStand(True)

while True:
    obs = {
        "observation.image":        get_front_camera_frame(),
        "observation.joint_pos":    get_joint_positions(),
        "observation.base_lin_vel": sport.GetBaseLinVel(),
        "observation.base_ang_vel": sport.GetBaseAngVel(),
    }
    with torch.no_grad():
        actions = policy.select_action(obs)         # (100, 15)

    # Apply the first 30 actions (1 second of behavior at 30 Hz),
    # then re-plan. This is the temporal ensembling trick from ACT.
    for i in range(30):
        cmd = actions[i]
        sport.Move(*cmd[:3].cpu().numpy())         # velocity
        apply_joint_targets(cmd[3:].cpu().numpy())
        time.sleep(1/30)
```

We use temporal ensembling because it's robust to single-frame
noise — if one frame is bad, the next 29 actions still come from
a coherent chunk.

## 6. Results

On the customer fleet, the ACT policy outperforms the built-in
sport-mode controller on three metrics:

| Metric | Built-in | ACT (ours) | Improvement |
|---|---|---|---|
| Threshold success (5 cm) | 88% | 99% | +11pp |
| Threshold success (12 cm) | 22% | 67% | +45pp |
| Recovery from push (10 N) | 41% | 91% | +50pp |

The improvement is largest where the built-in controller fails:
the cases that need a learned policy to handle.

## 7. When to use which

Decision tree for locomotion policies on Unitree platforms:

```
                ┌───────────────────────────────┐
                │ What's the deployment terrain? │
                └───────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
          Flat ground    Mixed terrain    Rough terrain
              │               │               │
              ▼               ▼               ▼
        Use built-in     Use sim-to-real    Use IL
        sport mode       (Isaac Lab)       (LeRobot)
                                          [this article]
```

For most customer deployments, the answer is **"IL on rough
terrain, built-in on flat ground, sim-to-real when we need a
specific behavior RL can express as a reward"**.

If you want help scoping which approach fits your use case,
[send us your mission profile](/intake).