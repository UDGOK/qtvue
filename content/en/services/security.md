---
title: "Security & Firmware Hardening"
summary: "Post-UniPwn (2025) — verified firmware, Bluetooth lockdown, isolated networks, and continuous monitoring. Legitimate hardening, never circumvention."
label: "04 — Security & Hardening"
icon: "Shield"
order: 4
inScope:
  - "Firmware verification (signature check, version pin)"
  - "Bluetooth and unused radio lockdown"
  - "Network isolation (VLAN, firewall, monitoring)"
  - "OTA update policy (signed updates, staged rollout)"
  - "Fleet inventory and per-device attestations"
  - "Incident response playbook (what to do if a robot is compromised)"
  - "Compliance documentation for enterprise security teams"
notInScope:
  - "Firmware jailbreaks, tier unlocks, or feature bypass (violates partner terms and warranty)"
  - "Custom backdoors or undocumented access paths (security liability)"
  - "Penetration testing of the Unitree platform itself (coordinate with Unitree)"
codeLanguage: "python"
codeFilename: "firmware_verify.py"
codeSnippet: |
  # Firmware verification — pinned version + signature
  import hashlib
  from unitree_sdk2py.firmware import verify_signature

  PINNED_VERSION = ">=1.4.2"
  EXPECTED_SHA = "a1b2c3d4..."  # pinned at deployment time

  def harden(robot):
      fw = robot.read_firmware()
      assert fw.version >= PINNED_VERSION, f"Outdated firmware: {fw.version}"
      assert hashlib.sha256(fw.image).hexdigest() == EXPECTED_SHA, "Hash mismatch"
      verify_signature(fw)  # raises on bad signature
      robot.disable_bluetooth()
      robot.disable_undocumented_radios()
      robot.set_network_policy("isolated")
      log_attestation(robot, fw)
cta:
  label: "Submit your use case"
  to: "/intake"
---

# Security & Firmware Hardening

The fourth way we help, and the one that matters most post-UniPwn (2025).
Every Unitree platform we deploy is hardened, every network is isolated,
every firmware is verified. This is a legitimate enterprise need; it's
also a hard line on what we will and won't do.

## What "Security & Hardening" means

This is the service line we built in response to the
[UniPwn disclosure of 2025](https://unitree.com), which affects Go2, B2,
G1, and H1 over Bluetooth. The service is:

- **Firmware verification** — signature check, version pin, and a
  pinned hash for every device in your fleet.
- **Radio lockdown** — Bluetooth disabled by default, undocumented
  radios disabled, network policy set to isolated.
- **Network segmentation** — dedicated VLAN, outbound-only firewall
  rules, monitoring.
- **OTA policy** — signed updates, staged rollout, and a documented
  process for when to roll forward vs. pin to a known-good.
- **Fleet inventory** — per-device attestations stored in your SIEM
  so a security team can see the fleet posture in real time.
- **Incident response** — a written playbook for what to do if a
  device is compromised.

## What this service does NOT include

There is a line between hardening and circumvention. We will not cross it.

- **No firmware jailbreaks, tier unlocks, or feature bypasses.** These
  violate Unitree partner terms and void warranty.
- **No custom backdoors or undocumented access paths.** Even if a
  customer asks. The security liability is too large and the partner
  relationship would end.
- **No penetration testing of the Unitree platform itself.** That
  coordination has to go through Unitree directly.

If you need something that crosses those lines, we will say no. The
Unitree security team is the right contact for vulnerability disclosure
and coordinated testing.

## When to engage us

If you're deploying any Unitree platform into a connected environment
— a factory floor, a research network, a public-facing demo — you
need this service. The UniPwn disclosure is real, the affected devices
are widespread, and the standard deployment is not secure by default.
