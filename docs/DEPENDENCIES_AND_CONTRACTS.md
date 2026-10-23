# Dependencies and Contracts — aether-ai-plugins

**Status:** Proposed; manifest schema and isolation technology remain to be approved.

## Direct dependencies

- `aether-ai-tools`: public tool manifest, invocation and policy-enforcement boundary.
- `aether-ai-auth`: principal and plugin enablement context.
- `aether-ai-security`: capability grants and policy contracts.

## Explicit non-dependency: Admin

`aether-ai-plugins` MUST NOT depend on or import `aether-ai-admin`. Admin is a privileged UI/client; it consumes public domain APIs/contracts. Plugin authorization and lifecycle rules belong in the owning domain contracts and must be enforced server-side.

## Owned capabilities

Manifest schema, permissions/capabilities, trust levels, compatibility matrix, isolation strategy, signed/verified artifacts if needed.

## Contract requirements

- Version public schemas and message envelopes.
- Document limits, timeouts, retry behavior, idempotency, cancellation, and error handling where relevant.
- Preserve correlation IDs across API, agent, tool, queue, and provider operations.
- Document operational signals and failure recovery, not only the happy path.
- Version plugin manifests and capability names.
- Bind each invocation to a specific plugin/version and declared capabilities.
- Require least-privilege permission grants and explicit enable/disable lifecycle.
- Define compatibility, timeout, output-size, failure and revocation behavior.
- Verify any approval against the exact action, resource and arguments before side effects.
