---
title: "Post-UniPwn: What the 2025 Bluetooth exploit revealed about Unitree's security model"
summary: "A researcher's walk-through of CVE-style disclosure, the G1 attack surface, what Unitree patched in firmware 1.5.2, and what fleet operators should still do in 2026."
excerpt: "In mid-2025, security researchers disclosed a Bluetooth Classic attack surface on the Unitree G1 and H1. The patch shipped in firmware 1.5.2 — but the underlying supply-chain problems run deeper. Here is what we tell customers."
date: "2026-06-15"
updated: "2026-06-20"
author: "qtvue security team"
authorRole: "Security & hardening practice"
authorBio: "Our security team specializes in robotics firmware hardening, fleet policy, and incident response. We do not do jailbreaks or tier unlocks — only legitimate defensive work."
category: "security"
readTime: 11
tone: "ink"
featured: true
slug: "post-unipwn-2025"
tags: ["unipwn", "bluetooth", "firmware", "security"]
---

> **TL;DR.** In July 2025, an external researcher disclosed a
> pre-authentication Bluetooth Classic attack surface on the Unitree G1
> and H1 that allowed unauthenticated firmware replacement within radio
> range. Unitree patched it in firmware `1.5.2` (October 2025). The
> patch closes the immediate hole. The underlying supply-chain problem
> — debug firmware accessible from a wireless interface — is a pattern
> that will recur. This article is what we tell customers.

## 1. Timeline

- **April 2025** — Internal research discovers the attack surface
  during a red-team engagement for a warehouse customer.
- **May 2025** — Coordinated disclosure initiated with Unitree's
  security contact.
- **June 2025** — Independent researcher (alias `@unidrop`) publishes
  a similar finding on social media before the coordinated disclosure
  window closes.
- **July 2025** — Unitree acknowledges the issue publicly, assigns an
  internal tracking ID, and begins patch development.
- **October 2025** — Firmware `1.5.2` ships with the Bluetooth
  attack surface removed. Publicly labeled "UniPwn 2025" by the
  community.

The window between coordinated disclosure and the independent
researcher's publication was ~6 weeks. In retrospect, this is on
the fast side for robotics vendors and we credit Unitree for the
quick turnaround.

## 2. The attack surface

The G1 and H1 use a Bluetooth Classic (BR/EDR) radio for service
and debugging. Specifically:

```
┌────────────────────────────────────────────────────┐
│ G1 / H1 — Bluetooth stack (pre-1.5.2)              │
├────────────────────────────────────────────────────┤
│ 1. Pairing mode: 'Just Works' (no PIN, no confirm) │
│ 2. Paired device gets:                             │
│    - Read access to all telemetry (joints, IMU)    │
│    - Write access to motor commands                │
│    - **Firmware upload over the BT channel**       │
│ 3. Pairing requires: radio range only              │
└────────────────────────────────────────────────────┘
```

The "Just Works" pairing mode is a deliberate engineering choice
— it lets a field technician bring a phone or laptop within range
and quickly diagnose a robot without pairing workflows. The trade-off
is that any attacker within radio range (typically 10–30 m, longer
with a directional antenna) can pair without authentication.

The firmware upload path is the critical primitive. With it, an
attacker can flash a custom firmware that disables safety limits,
exfiltrates the on-board camera feed, or uses the robot as a
pivot into the corporate LAN.

## 3. Why it happened

We do not have visibility into Unitree's internal design review
process, but the underlying pattern is familiar from IoT and OT
security:

1. **Debug interfaces that survive into production.** The BT
   service is wired to the same SOC as the debug UART and JTAG.
   It was meant for factory calibration; no one removed it before
   shipping.
2. **Authentication that assumes physical proximity = trust.** Many
   robots use "anyone within range can pair" as the access control
   model. This works for a research lab; it doesn't work for a
   warehouse floor with shared LAN access.
3. **No firmware signature verification.** The bootloader accepts
   any signed firmware, but "signed" means "signed by Unitree's
   development key" — there is no chain of trust back to a per-
   device key. If you can flash firmware, you can flash any firmware.

This is not unique to Unitree. We've seen equivalent patterns on
Boston Dynamics Spot (early firmware), Clearpath Husky, and most
agricultural robot platforms. The robotics industry is roughly
where Windows was in 2003 from a security-model perspective.

## 4. What firmware 1.5.2 patches

The patch addresses all three of the underlying issues:

- Bluetooth pairing requires a physical button press on the robot
  to authorize a new device (a 5-second hold of the side button).
- Firmware uploads now require a per-device signature tied to the
  robot's serial number; firmware signed by Unitree's master key
  is no longer accepted on a different robot without re-signing.
- The BT service is no longer bridged to the motor-control
  subprocess; it can read telemetry for diagnostics but cannot
  issue motor commands.

These are good fixes. They don't address every related risk (see
below) but they close the specific UniPwn attack chain.

## 5. What fleet operators should still do

If you're operating a fleet of G1, H1, or any Unitree platform
post-UniPwn, the firmware 1.5.2 patch is the floor, not the
ceiling. We recommend the following as a baseline:

### 5.1 Verify you're on the patched firmware

```
$ ssh unitree@<robot-ip> 'cat /etc/unitree/firmware.version'
1.5.2
```

If you see anything before `1.5.2`, schedule a maintenance window
to reflash. The 1.5.2 patch is non-breaking for normal operation.

### 5.2 Isolate the robot network

Put robots on a dedicated VLAN with no route to the corporate LAN.
This single change defeats the "robot as a pivot" attack class
regardless of firmware status. We use a small managed switch
(UniFi, Mikrotik, or Cisco) with the robot ports in their own VLAN
and an explicit "no inter-VLAN routing" ACL.

### 5.3 Disable Bluetooth when not in service

For most production deployments, Bluetooth is only needed during
commissioning and field service. We ship our customer deployments
with a systemd unit that disables the BT service on boot and a
physical button + 5-second hold to re-enable it for service
windows. This is the operational equivalent of the firmware patch.

### 5.4 Verify firmware signatures on every boot

The 1.5.2 patch enables per-device firmware signatures, but
nothing prevents an attacker from disabling the signature check
in the bootloader (a different attack, but worth defending
against). We add a `secure-boot-verifier` systemd unit that
re-checks the signature on every boot and refuses to start
motor-control if the check fails.

### 5.5 Continuous firmware monitoring

Subscribe to Unitree's security advisories. If you can't get
RMA-grade response time from the vendor, set up an internal
advisory mirror.

## 6. The deeper pattern

UniPwn 2025 is not an isolated incident. It's the first widely-
publicized instance of a class of vulnerability — "debug interface
left in production firmware" — that will recur across the robotics
industry for the next decade. The economic pressure on robot
manufacturers to ship features fast is real, and security review
boards for firmware are still rare.

What we tell our customers is this: **assume every shipped robot
has at least one wireless or physical debug interface left in
production firmware**. Treat the robot as compromised from day one.
Network isolate it. Verify firmware on every boot. Disable wireless
when not in service. This is the operational discipline that turns
"vendor will patch eventually" into "we're safe right now."

## 7. What qtvue ships

For customers who engage us on the Security & Hardening service, we
deliver:

- A fleet-wide firmware audit (which platforms, which firmware
  versions, which are missing the patch).
- A network isolation design for the robot VLAN.
- A signed-firmware-verification unit (`secure-boot-verifier`).
- A continuous-monitoring unit that watches for anomalous DDS
  traffic patterns from each robot.
- An incident-response retainer: if you suspect compromise, we
  are on a 4-hour response window.

We do not do jailbreaks or tier unlocks. We do not bypass the
Unitree partner terms. The work is purely defensive.

Reach out via the [intake form](/intake) if you want a hardening
engagement scoped.