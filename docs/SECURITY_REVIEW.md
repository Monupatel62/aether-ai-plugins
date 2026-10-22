# Security Review — aether-ai-plugins

**Status:** Design checklist; no audit/certification claimed.

## Main risks
Malicious plugin code/output, manifest spoofing, capability escalation, dependency compromise, tenant data exfiltration, resource exhaustion and stale permissions after revocation.

## Required controls
Plugins are untrusted extensions. Require an explicit manifest, least-privilege capabilities, version compatibility checks, isolated execution where applicable, signed/provenanced artifacts where feasible, and revocation. A plugin manifest cannot grant itself permissions.
- A manifest never self-authorizes a capability.
- Use least-privilege grants, explicit enablement and revocation.
- Isolate execution and bound CPU, memory, time, network and output where applicable.
- Verify provenance/signature under the approved profile.
- Reauthorize every protected side effect at the owning boundary.

## Verification
Test invalid manifests, undeclared capabilities, permission escalation, revoked plugins, incompatible versions, malicious plugin output, timeout/resource limits, and audit events.

Before release, add unit tests, contract tests for direct dependencies, negative authorization/input tests, and failure/recovery tests for the behavior this component owns. Use synthetic or sanitized data only.
- [ ] Invalid manifest and unknown capability tests.
- [ ] Privilege escalation and revoked plugin tests.
- [ ] Malicious output and resource limit tests.
- [ ] Audit and secret-leak checks.
