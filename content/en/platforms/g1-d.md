---
title: "Unitree G1-D"
summary: "The dual-arm teleoperation rig for embodied-AI teams collecting training datasets — sub-100 ms latency."
slug: "g1-d"
type: "Data/training platform"
priceFrom: "Contact for pricing"
whoItsFor: "Embodied-AI teams"
oneLiner: "Dual-arm teleoperation rig, <100 ms latency, builds training datasets."
payload: "n/a (teleop + recording)"
dof: "Dual-arm + G1 base"
ipRating: "Indoor only"
useCases:
  - "Imitation learning dataset collection"
  - "Teleoperation research (shared autonomy, RLHF)"
  - "Embodied-AI training data at scale"
  - "VR/leader-follower manipulation studies"
specs:
  - { k: "Latency", v: "< 100 ms (operator -> robot)" }
  - { k: "Arms", v: "Dual dexterous arms (G1 EDU spec)" }
  - { k: "Base", v: "G1 humanoid base" }
  - { k: "Recording", v: "Synchronized RGB-D + joint state + timestamps" }
  - { k: "Output format", v: "ROS 2 bags, LeRobot-compatible datasets" }
  - { k: "Compute", v: "Onboard + workstation-grade offboard option" }
codeSnippet: |
  # G1-D — record a teleop episode
  from unitree_sdk2py.core.channel import ChannelFactoryInitialize
  from unitree_sdk2py.g1_d.teleop import TeleopRecorder

  ChannelFactoryInitialize(0, "eth0")
  rec = TeleopRecorder(out_dir="./episodes/2026-06-22/")

  rec.start_episode(task="pick_cube")
  while operator_active:
      rec.record_step({
        "rgb_left":  cam_left.frame(),
        "rgb_right": cam_right.frame(),
        "depth":     cam_depth.frame(),
        "joints":    arm.state(),
        "gripper":   gripper.state(),
      })
  rec.stop_episode()  # writes a LeRobot-compatible dataset
codeLanguage: "python"
codeFilename: "g1d_record.py"
callouts:
  - "Sub-100 ms latency is the working number for natural-feeling teleoperation. Marketing claims of <50 ms are under specific network conditions."
  - "Output is ROS 2 bags and LeRobot-compatible datasets — plug into any modern VLA training pipeline."
  - "Indoor only. The G1-D is built for the lab, not the field."
order: 7
---

# Unitree G1-D

The G1-D is the teleoperation rig: a G1 with dual dexterous arms, <100 ms
operator-to-robot latency, and a recording stack that writes LeRobot-compatible
datasets. It's the platform embodied-AI teams use to collect training data
at scale.

## Where the G1-D fits

If you're building a vision-language-action (VLA) model and you need
training data, the G1-D is the platform. The 100 ms latency is real
(we've measured it); the recording stack writes the format modern training
pipelines expect; the operator experience is good enough for sustained
collection sessions.

The output format is the key thing: **ROS 2 bags and LeRobot-compatible
datasets**. We integrate with whatever training stack you already have.

## Programming the G1-D

The G1-D uses the same `unitree_sdk2_python` as the G1, with an additional
`teleop` module for the recording stack. The example to the right shows
the minimal "record one episode" loop.
