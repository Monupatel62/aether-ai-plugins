# aether-ai-plugins

**Status:** Initial plugin manifest validation and capability grant primitives implemented on a feature branch. Plugin execution is not implemented.

## Implemented

- [Manifest validator](src/index.js): schema/version/identifier checks, capability allowlist, HTTPS-only endpoints, optional hostname allowlist, and duplicate endpoint rejection.
- Capability grants are the intersection of manifest requests and explicitly approved capabilities.
- [Unit tests](test/plugins.test.js): manifest validation, unsafe/untrusted URLs, capability filtering, and duplicate IDs.
- Dependency-free Node.js package with Node 20/22 CI.

## Limitations

This is not a plugin sandbox. It does not execute plugin code, verify signed manifests, manage approvals, enforce network egress at runtime, isolate secrets, or provide plugin lifecycle/rollback. Host allowlisting must be applied at the actual network boundary to prevent SSRF and DNS rebinding; manifest validation alone is insufficient.

## Documentation

- [Repository specification](docs/REPOSITORY_SPECIFICATION.md)
- [Project specification](docs/PROJECT_SPEC.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Dependencies and contracts](docs/DEPENDENCIES_AND_CONTRACTS.md)
- [Implementation plan](docs/IMPLEMENTATION_PLAN.md)
- [Security review](docs/SECURITY_REVIEW.md)
- [Master catalog](https://github.com/Monupatel62/aether-ai-platform/blob/main/docs/REPOSITORY_CATALOG.md)
