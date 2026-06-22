---
title: "Program"
summary: "We write the code that makes the platform do the job — unitree_sdk2, ROS 2, Isaac Lab, LeRobot. Same SDK the Unitree teams use."
label: "02 — Program"
icon: "Code2"
order: 2
inScope:
  - "Locomotion and manipulation programming (unitree_sdk2 / Python & C++)"
  - "ROS 2 integration via unitree_ros2"
  - "Sim-to-real workflows in Isaac Lab (unitree_sim_isaaclab)"
  - "Imitation learning and VLA training (LeRobot, UnifoLM-VLA-0)"
  - "Perception pipelines: LiDAR SLAM, RealSense, multi-sensor fusion"
  - "Teleoperation hooks and shared-autonomy controllers"
  - "Program rescue, refactoring, and code review"
notInScope:
  - "Hardware integration, mounts, or EOAT (see Integrate)"
  - "Networking or fleet management (we can recommend, but it's not our day job)"
  - "Manufacturing execution systems (MES) integration"
codeLanguage: "python"
codeFilename: "ros2_launch.py"
codeSnippet: |
  # ROS 2 launch — real robot + Isaac Lab sim with shared topology
  from launch import LaunchDescription
  from launch_ros.actions import Node
  from launch.actions import IncludeLaunchDescription

  return LaunchDescription([
      # The real G1 on the LAN
      Node(
          package='unitree_ros2',
          executable='g1_driver',
          name='g1_real',
          parameters=[{'robot_ip': '192.168.123.10', 'sim': False}],
      ),
      # The simulated G1 in Isaac Lab, same DDS namespace
      Node(
          package='unitree_ros2',
          executable='g1_driver',
          name='g1_sim',
          parameters=[{'sim': True, 'physics_dt': 0.001}],
      ),
      # Your app layer — same code, real OR sim
      Node(
          package='qtvue_app',
          executable='controller',
          name='controller',
      ),
  ])
cta:
  label: "Submit your use case"
  to: "/intake"
---

# Program

The second way we help, and the one we spend most of our time on: we
write the code that makes the platform actually do what you need it to do.
Same SDK the Unitree teams use, same ROS 2 layer, same Isaac Lab sim.

## What's in scope

- **Locomotion and manipulation** in `unitree_sdk2` (Python and C++).
- **ROS 2 integration** via `unitree_ros2` — including the same DDS
  topology in simulation and on real hardware.
- **Sim-to-real** in Isaac Lab using `unitree_sim_isaaclab`.
- **Imitation learning and VLA** with LeRobot and Unitree's open
  UnifoLM-VLA-0.
- **Perception**: LiDAR SLAM, RealSense pipelines, multi-sensor
  fusion.
- **Teleoperation and shared autonomy** for the G1-D and arm rigs.
- **Program rescue**: take over code written by someone else, refactor,
  document, and ship.

## What's not in scope

- Hardware integration, mounts, or EOAT — that's [Integrate](/services/integrate).
- Networking or fleet management at scale — we can recommend partners.
- MES or factory-software integration — different specialists.

## When to engage us for "program" alone

If you already own the platform and just need a programming team that
ships, "program" is the right engagement. We work in the same SDKs
the Unitree team publishes, which means your code is reviewable, your
hires can ramp quickly, and you own every line.

If you don't have the platform yet, see [Sell](/services/sell). If you
need both the platform and the integration work, see
[Integrate](/services/integrate).
