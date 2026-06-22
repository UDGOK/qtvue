---
title: "Vision & Sensing — frequently asked questions"
summary: "Common questions about 2D/3D vision (Cognex, Keyence, Photoneo, Zivid), force/torque sensing, and conveyor tracking integration for industrial robots."
slug: "vision"
parent: "/features/vision"
topic: "Vision & Sensing"
description: "Common questions about 2D and 3D vision, force/torque sensing, and conveyor tracking for industrial robots."
order: 3
questions:
  - q: "Which vision brands does qtvue integrate?"
    a: "Cognex In-Sight and 3D-A5000, Keyence CV-X and XG-X, Photoneo PhoXi 3D, Zivid 2, SICK Ranger3, ifm O2D, and Basler ace. For force/torque: ATI, Robotiq, OnRobot. We pick the brand that matches your part, environment, and budget — not a single vendor we resell."
  - q: "When do I need 2D vs 3D vision?"
    a: "2D is enough for: parts on a flat conveyor with consistent orientation (pick-and-place, label inspection, presence checks). 3D is needed for: bin picking, randomly oriented totes, large parts with multiple features, automotive body-in-white, and any application where the part has 6 degrees of freedom of variance. We model your application during the design phase to know for sure."
  - q: "What's the typical accuracy of a 2D vision system?"
    a: "Sub-pixel repeatability for part localization under controlled lighting — typically ±0.2 mm at the part plane. 3D point-cloud systems: ±0.1–0.5 mm depending on stand-off distance and stereo baseline. We validate accuracy with a calibration plate in the actual cell before locking cycle time."
  - q: "Can you do vision-guided bin picking?"
    a: "Yes. We integrate 3D sensors (Photoneo, Zivid, Mech-Mind) with grasp-planning software (RoboDK, Photoneo Bin Picking Studio, Mech-Vision) to handle randomly oriented parts in totes or bins. Cycle time for typical 5–15 cm parts: 4–8 seconds per pick. Success rate: 99%+ on parts with consistent geometry."
  - q: "What about force/torque sensing for assembly?"
    a: "We integrate ATI, Robotiq, and OnRobot F/T sensors for assembly applications: peg-in-hole, snap-fit, threaded insertion, and compliance-critical joining. The robot program uses force feedback to search and align, dramatically reducing the precision required of mechanical fixturing."
  - q: "How does conveyor tracking work?"
    a: "The conveyor encoder publishes part position; the robot program reads it in real time and synchronizes motion. We tune the pick window, the tracking filter, and the release point. Typical accuracy: ±2 mm at conveyor speeds up to 0.5 m/s. Higher speeds require tighter encoder resolution or a vision-over-tracker combination."
  - q: "What about lighting? Do you supply it?"
    a: "Yes — lighting is 50% of any vision system. We specify and source the right LED bar, dome, or coaxial light for your part, including the strobe controller if the application is high-speed. We also build the mechanical mount, the polarizer, and the optical filter for ambient light rejection."
  - q: "What happens when the camera goes down on the line?"
    a: "The robot program enters a degraded mode: it stops picking, signals upstream, and the operator is paged. The cell can either go to manual mode (operator feeds parts) or stop. If you're on a 24/7 support contract, we get a remote alert within 60 seconds and start diagnosing."
  - q: "Can the vision system be calibrated by my maintenance team?"
    a: "Yes. We ship a calibration SOP with a target plate, a written procedure, and a one-page checklist. Re-calibration is typically a 10-minute job that maintenance does once a week. The vision software flags drift before it causes bad picks."
  - q: "What's the cost of a vision system?"
    a: "2D vision for a single station: $8K–$25K hardware + $5K–$15K integration. 3D bin picking: $40K–$120K hardware + $20K–$50K integration. The wide range reflects sensor choice, lighting complexity, and software stack. We size it to your part and takt — not the most expensive option."
---

# Vision & Sensing FAQ

Ten common questions about how qtvue integrates 2D and 3D vision,
force/torque sensing, and conveyor tracking for industrial robots.
See [/features/vision](/features/vision) for the full vision scope.
