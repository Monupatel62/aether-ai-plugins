# Engineering Standard — aether-ai-plugins

- Treat plugin code, manifests and outputs as untrusted.
- Version manifests and capability identifiers.
- Grant least privilege; a manifest cannot grant itself permission.
- Validate compatibility and provenance under the approved policy.
- Enforce isolation and bounded CPU, memory, time, network and output.
- Reauthorize side effects at the resource-owning boundary.
- Provide explicit enable, disable and revoke controls with audit events.
- Test privilege escalation, malicious output, incompatible versions and revocation.
- Keep credentials and protected context out of plugin output and ordinary logs.

Plugins are untrusted extensions. Require an explicit manifest, least-privilege capabilities, version compatibility checks, isolated execution where applicable, signed/provenanced artifacts where feasible, and revocation. A plugin manifest cannot grant itself permissions.
