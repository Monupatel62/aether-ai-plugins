# Architecture — aether-ai-plugins

**Status:** Proposed; not implemented.

## Mission
Plugin manifest, discovery, versioning, enable/disable lifecycle, and compatibility policy.

## Ownership
Manifest schema, permissions/capabilities, trust levels, compatibility matrix, isolation strategy, signed/verified artifacts if needed.

## Dependencies
- Tools: tool manifest and invocation contract.
- Auth: principal/session context only; not a substitute for resource authorization.
- Security: capability policy, trust and isolation guidance.
- Admin is not a direct dependency. Operator-facing workflows may use the owning API/domain contract; plugins must not import admin UI or internal implementation.

## Trust boundaries
Plugins are untrusted extensions. A manifest declares requested capabilities but cannot grant them. Validate manifests and artifacts, enforce allowlisted capabilities at runtime, isolate execution, and support disable/revocation. Never let plugin output directly change policy or privileged configuration.

## Failure behavior
Reject malformed or incompatible manifests, deny undeclared capabilities, and enforce bounded execution time/resources. Plugin failure must not bypass authorization or leak protected context.
