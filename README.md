# aether-ai-plugins

Plugin manifest, discovery, versioning, enable/disable lifecycle, and compatibility policy.

**Status:** Initial plugin manifest validation and compatibility helpers are in review; no plugin execution runtime is implemented.

## Documentation
- [Project specification](docs/PROJECT_SPEC.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Dependencies and contracts](docs/DEPENDENCIES_AND_CONTRACTS.md)
- [Implementation plan](docs/IMPLEMENTATION_PLAN.md)
- [Technical design](docs/TECHNICAL_DESIGN.md)
- [Security review](docs/SECURITY_REVIEW.md)
- [Research and licenses](docs/RESEARCH_AND_LICENSES.md)
- [Engineering standard](docs/ENGINEERING_STANDARD.md)
- [Work log](docs/WORKLOG.md)

## Initial implementation

The draft package validates versioned plugin metadata, artifact SHA-256 digest shape, requested capabilities, and stable semantic-version compatibility bounds. Requested capabilities are not permission grants. This does not verify artifact signatures, enable plugins, enforce policy, isolate execution, or implement revocation.

[Master catalog](https://github.com/Monupatel62/aether-ai-platform/blob/main/docs/REPOSITORY_CATALOG.md)
