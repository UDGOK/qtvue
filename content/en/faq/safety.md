---
title: "Safety & Compliance — frequently asked questions"
summary: "Common questions about ISO 10218, ISO/TS 15066 (cobots), ANSI/RIA R15.06, risk assessments, and safety-scoped cell design for industrial robots."
slug: "safety"
parent: "/features/safety"
topic: "Safety & Compliance"
description: "Common questions about ISO 10218, ISO/TS 15066, ANSI/RIA R15.06, risk assessments, and safety-scoped robotic cell design."
order: 5
questions:
  - q: "Which safety standards does qtvue work to?"
    a: "ISO 10218-1 (robot requirements) and ISO 10218-2 (cell/integration requirements) for industrial robots. ISO/TS 15066 for collaborative robot applications (power-and-force limiting, speed-and-separation monitoring). ANSI/RIA R15.06 for North American deployments. EN ISO 13849-1 for safety-related control systems (PLd, Cat 3 minimum on every cell)."
  - q: "Do you provide a written risk assessment?"
    a: "Yes — every qtvue cell ships with a documented risk assessment per ISO 12100, including hazard identification, risk estimation, risk evaluation, and the measures taken to reduce each risk to acceptable level. The RA is signed off by our lead safety engineer and counter-signed by your EHS lead."
  - q: "What's the difference between a cobot and an industrial robot in safety terms?"
    a: "A cobot (collaborative robot) is an industrial robot that meets ISO/TS 15066 — it can operate in a shared workspace with a human under specific conditions. Power-and-force limiting (PFL) is the most common mode: the cobot stops on contact, and contact forces are biomechanically limited. Industrial robots (FANUC, ABB, KUKA) cannot operate in a shared workspace without additional safety measures (scanners, fencing, interlocks)."
  - q: "Do I need a safety scanner or a fence?"
    a: "Depends on the application. Fence is right for high-payload (>35 kg) and high-speed (>250 mm/s) industrial robots. Safety scanners (SICK, Keyence, Banner) are right for AGV-style cells or where operators need frequent access. We always recommend the option that protects the operator, not the option that's cheapest. The risk assessment drives the call."
  - q: "How long does a risk assessment take?"
    a: "1–2 weeks for a single cell, 3–6 weeks for a multi-cell line. The output is a written report (typically 30–80 pages), a marked-up layout drawing showing every safety zone, and a bill of materials for the safety hardware (scanners, E-stops, safety PLC, light curtains)."
  - q: "Do you handle the safety PLC programming?"
    a: "Yes — we program Allen-Bradley GuardLogix, Siemens S7 F-CPU, and Omron NX-Safety. We use certified safety function blocks, follow the application software requirements of ISO 13849-2, and validate the safety functions end-to-end. The validated program and the validation report are part of the cell deliverable."
  - q: "What about CE marking for European deployments?"
    a: "Every qtvue cell shipped to Europe is CE marked. The technical file includes the declaration of conformity, the risk assessment, the design drawings, the bills of materials, the validation reports, and the operating instructions. We have a CE-marking checklist that our project engineers run before sign-off."
  - q: "What if we already have a risk assessment from another integrator?"
    a: "We review it. About 60% of the time, the existing assessment is sound and we adopt it. About 40% of the time, it has gaps (missing zones, undersized scanners, missing muting logic) and we re-issue a corrected version. The review is a fixed-price engagement (typically 1 week)."
  - q: "How do you validate the safety functions after integration?"
    a: "Every safety function (E-stop, scanner muting, gate interlock, light curtain) is functionally tested before sign-off. We use a documented test plan with pass/fail criteria, the test results are recorded with timestamps, and the test report is part of the cell documentation. The acceptance test is signed by both qtvue and your EHS lead."
  - q: "Do you offer ongoing safety compliance support?"
    a: "Yes — typically under a 24/7 support contract. We re-validate the safety functions annually, update the risk assessment when the cell changes, and respond to any incident with a root-cause analysis. Many of our customers also retain us for new-product introduction into an existing cell, which requires a re-RA."
---

# Safety & Compliance FAQ

Ten common questions about ISO 10218, ISO/TS 15066, ANSI/RIA R15.06,
risk assessments, and safety-scoped robotic cell design. See
[/features/safety](/features/safety) for the full safety service.
