---
title: "Unitree Arms (Z1, etc.)"
summary: "The 6+ DoF manipulators — for manufacturing cells, benchtop automation, and as a complement to a mobile base."
slug: "arms"
type: "Manipulator"
priceFrom: "~$16k"
whoItsFor: "Manufacturing, integration"
oneLiner: "6+ DoF arms for cells and benchtop automation."
payload: "Varies by model"
dof: "6+ DoF"
ipRating: "Varies by model"
useCases:
  - "Manufacturing cells (machine tending, light assembly)"
  - "Benchtop automation (lab, testing, R&D)"
  - "Mobile manipulation when paired with a B2 or Go2 base"
  - "Light-payload pick-and-place"
specs:
  - { k: "DoF", v: "6+ (model-dependent)" }
  - { k: "Payload", v: "Model-dependent" }
  - { k: "Reach", v: "Model-dependent" }
  - { k: "Compute", v: "Onboard controller + offboard SDK" }
  - { k: "SDK", v: "unitree_sdk2 (Z1 family)" }
  - { k: "ROS 2", v: "Yes (unitree_ros2)" }
codeSnippet: |
  # Z1 arm — Cartesian trajectory to a target pose
  from unitree_sdk2py.core.channel import ChannelFactoryInitialize
  from unitree_sdk2py.z1.arm import Z1Arm

  ChannelFactoryInitialize(0, "eth0")
  arm = Z1Arm()

  arm.start()
  arm.MoveL(p=[0.4, 0.0, 0.3], r=[0, 0, 0], duration=2.0)
  arm.gripper.close(force=20)
  arm.MoveL(p=[0.2, 0.2, 0.4], r=[0, 0, 0], duration=1.5)
  arm.gripper.open()
  arm.stop()
codeLanguage: "python"
codeFilename: "z1_pick.py"
callouts:
  - "Arm specs (payload, reach, IP) vary significantly by model. Get the datasheet for the specific SKU before specifying."
  - "The Z1 family is the most common Unitree arm in our integrations."
  - "Pairing an arm with a B2 or Go2 base gives you a mobile manipulator — useful for inspection tasks that need interaction."
order: 8
---

# Unitree Arms (Z1, etc.)

The Unitree arm family is the manipulator side of the catalogue. The Z1 is
the most common SKU in our integrations; other models exist with different
payload/reach/IP specs. The arms are designed to be either standalone (cells,
benchtop) or paired with a mobile base (B2, Go2) for mobile manipulation.

## Where the arms fit

- **Manufacturing cells** — light assembly, machine tending, pick-and-place
  where a full industrial arm (FANUC, ABB) is over-spec'd.
- **Benchtop automation** — lab, R&D, testing, and demo work.
- **Mobile manipulation** — when paired with a B2 or Go2, the arm turns
  the mobile base into a manipulator that can do real work, not just
  inspection.

## Programming the arms

The Z1 uses the same `unitree_sdk2_python` as the rest of the Unitree
family. The motion primitives are linear (`MoveL`) and joint-space
(`MoveJ`); the gripper is a separate module. The example to the right is
a minimal "pick from A, place at B" sequence.
