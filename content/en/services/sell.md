---
title: "Sell"
summary: "We supply the right Unitree platform, configured for your application, with the spares and accessories to actually use it."
label: "01 — Sell"
icon: "Package"
order: 1
inScope:
  - "Source the right Unitree platform for your use case"
  - "Configure hardware variants (EDU, IP-rated, compute)"
  - "Provide sensors, batteries, mounts, and accessories"
  - "Handle customs, import, and warranty registration"
  - "Optional pre-staging and acceptance test before shipping"
notInScope:
  - "Non-Unitree platforms (we can recommend partners, but don't resell)"
  - "Firmware jailbreaks or tier unlocks (violates partner terms and warranty)"
  - "Long-term spares contracts — that's part of ongoing support"
codeLanguage: "python"
codeFilename: "platform_chooser.py"
codeSnippet: |
  # Pseudo-code: how we choose a platform
  def recommend(use_case: UseCase) -> Platform:
      if use_case.outdoor and use_case.heavy_payload:
          return Platform("B2")     # 40 kg+ IP67 quadruped
      if use_case.indoor and use_case.manipulation:
          return Platform("G1", edu=True)  # 43 DoF humanoid with hands
      if use_case.embodied_ai_data:
          return Platform("G1-D")   # teleop + recording
      if use_case.entry_level_research:
          return Platform("R1")     # lightweight humanoid
      if use_case.full_size_demonstration:
          return Platform("H2")     # refined full-size
      if use_case.speed_research:
          return Platform("H1")     # fastest
      if use_case.mobile_manipulation:
          return Platform("B2") + Platform("Z1")  # base + arm
      if use_case.benchtop:
          return Platform("Z1")     # standalone arm
      return Platform("Go2")        # accessible workhorse
cta:
  label: "Submit your use case"
  to: "/intake"
---

# Sell

The first way we help: we supply the right Unitree platform for the job.
Not the most expensive one, not the one that happens to be in stock — the
one that meets your use case at the price you can justify.

## What "sell" means in our context

We are a pre-launch Unitree specialist. We don't resell other platforms.
We don't upsell you to a more expensive SKU. We will tell you when the
Go2 is enough and the H1 is overkill.

What you get when you buy through us:

- **Right platform, right config.** We pick the variant (EDU, IP-rated,
  compute spec) based on your use case, not the margin.
- **Sensors and accessories** that actually work with the platform —
  RealSense, batteries, mounts, charger, payload sensors.
- **Customs and import** handled end-to-end.
- **Pre-staging and acceptance test** at our facility before shipping
  to your site, so you don't open a box and find surprises.
- **Warranty registration** with Unitree on your behalf.

## What "sell" does NOT mean

We do not:

- Resell non-Unitree platforms. (We can recommend partners.)
- Offer firmware jailbreaks or tier unlocks. These violate Unitree
  partner terms and void warranty. Security hardening is fine;
  circumvention is not.
- Lock you in. You own the hardware, the accessories, and the
  configuration from day one.

## When to engage us for "sell" alone

If you know exactly what you want and just need a reliable supplier with
pre-staging and import handled, the "sell" engagement is right. Most
clients combine it with **Program** or **Integrate** — see those
service pages.
