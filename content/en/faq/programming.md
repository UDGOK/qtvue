---
title: "Robot Programming — frequently asked questions"
summary: "Common questions about FANUC KAREL, ABB RAPID, KUKA KRL, Yaskawa, and Universal Robots programming services — offline, on-floor, and cycle-time optimization."
slug: "programming"
parent: "/features/programming"
topic: "Robot Programming"
description: "Common questions about FANUC KAREL, ABB RAPID, KUKA KRL, Yaskawa, and Universal Robots programming for industrial robots."
order: 2
questions:
  - q: "Which robot languages and brands does qtvue program?"
    a: "FANUC (TP and KAREL), ABB (RAPID), KUKA (KRL), Yaskawa/Motoman (INFORM), Universal Robots (URScript), and Denso (PacScript). We are certified integrators for FANUC, ABB, KUKA, Yaskawa, and Universal Robots. If you have a different brand, ask — we've worked with most."
  - q: "Do you write programs offline (OLP) or only on the floor?"
    a: "Both. We write the bulk of the program offline in a simulation environment, then validate and tune on the floor with a sample of real parts. The offline phase is faster (no cell tie-up) and catches collision and reach issues before the robot moves. The on-floor phase handles real-world variation (lighting, part tolerance, conveyor drift)."
  - q: "How long does it take to program a typical cell?"
    a: "A standard pick-and-place with vision: 3–5 days offline + 1–2 days on-floor. A complex assembly with force feedback: 2–3 weeks offline + 1 week on-floor. Weld paths on a contoured part: 1–2 weeks offline + 2–3 days on-floor tuning. We always quote a fixed price after the design phase."
  - q: "Can you take over an existing program written by someone else?"
    a: "Yes. We do code reviews, refactoring, and rescue work for programs written by integrators who are no longer available, by your in-house team that has moved on, or by an OEM that won't release the source. We document the existing logic, identify bugs, and produce a clean version with a diff and changelog."
  - q: "How do you handle version control for robot programs?"
    a: "Every qtvue project is stored in a git repo with the cell design, simulation, program source, and operator docs as code. You get a private GitHub repo, branch-per-change, peer review on every commit, and a tagged release per acceptance milestone. Your team can diff, audit, and roll back at any time."
  - q: "Do you program collaborative robots (cobots) too?"
    a: "Yes — primarily Universal Robots (UR3, UR5, UR10, UR16, UR20) and FANUC CRX. Cobot programming is a different discipline from industrial: power-and-force limiting, speed-and-separation monitoring, and ISO/TS 15066 biomechanical limits are part of the scope, not a bolt-on. See /features/safety for the safety side."
  - q: "What about cycle-time optimization?"
    a: "We profile every program we ship, identify the top 3 cycle-time hotspots, and tune the motion profile (acceleration, blending, jerk, look-ahead) to shave milliseconds. Typical post-integration optimization: 8–18% cycle-time improvement on the same hardware. This is offered as a one-week engagement or as part of a long-term support contract."
  - q: "Can my team maintain the program after you ship it?"
    a: "Yes — and we expect them to. Every project ships with: a written program structure document, inline comments, an operator runbook, a maintenance SOP, and a 2-hour hand-off training session. We also offer a 90-day shadow period where your team sits alongside ours on remote support calls."
  - q: "What happens when the program breaks on the line?"
    a: "If you're on a 24/7 support contract, you call our hotline. Median time-to-remote-diagnosis is under 12 minutes. If the fix is a code change, we push it via your git repo, you pull, and the cell is back up. If it's a hardware issue, we dispatch a field tech with the right spare part."
  - q: "How do you handle vision-guided motion (Cognex, Keyence, Photoneo)?"
    a: "We integrate the vision system as a peripheral: the camera publishes part pose, the robot program reads it at runtime, and motion adapts. We write the vision job, the hand-shake protocol, the lighting recipe, and the fail-mode logic (rejection to a bad-part bin, re-trigger on low confidence). See /features/vision for the full vision scope."
---

# Robot Programming FAQ

Ten common questions about how qtvue programs industrial robots in
FANUC KAREL, ABB RAPID, KUKA KRL, Yaskawa INFORM, and Universal Robots
URScript. See [/features/programming](/features/programming) for the
broader programming service.
