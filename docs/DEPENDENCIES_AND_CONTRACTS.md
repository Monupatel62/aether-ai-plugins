# Dependencies and Contracts — aether-ai-plugins

**Status:** Proposed; manifest schema and isolation technology remain to be approved.

## Dependencies

Tools, auth, and security. The plugin domain must not depend directly on the admin UI/application. Administrative workflows call authorized API contracts, which in turn invoke the plugin domain through its public contract.

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
- Treat plugin metadata and output as untrusted; a plugin cannot self-grant permissions.
