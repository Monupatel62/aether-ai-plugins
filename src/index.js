const ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const VERSION = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;
const CAPABILITIES = new Set(["chat", "tools", "files.read", "files.write", "knowledge.read", "events.receive"]);
export class PluginManifestError extends Error {
  constructor(code, message = "Plugin manifest is invalid") { super(message); this.name = "PluginManifestError"; this.code = code; }
}
function isRecord(value) { return value !== null && typeof value === "object" && !Array.isArray(value); }
function validId(value) { return typeof value === "string" && ID.test(value) && value.trim() === value; }

export function validatePluginManifest(input, { allowedHosts } = {}) {
  if (!isRecord(input) || input.schemaVersion !== 1) throw new PluginManifestError("invalid_schema");
  if (!validId(input.id) || typeof input.name !== "string" || !input.name.trim() || input.name.length > 120) throw new PluginManifestError("invalid_identity");
  if (typeof input.version !== "string" || !VERSION.test(input.version)) throw new PluginManifestError("invalid_version");
  if (typeof input.description !== "string" || input.description.length > 1000) throw new PluginManifestError("invalid_description");
  if (!Array.isArray(input.capabilities) || input.capabilities.length > CAPABILITIES.size || input.capabilities.some((c) => !CAPABILITIES.has(c)) || new Set(input.capabilities).size !== input.capabilities.length) {
    throw new PluginManifestError("invalid_capabilities");
  }
  if (!Array.isArray(input.endpoints) || input.endpoints.length > 20) throw new PluginManifestError("invalid_endpoints");
  const hosts = allowedHosts === undefined ? null : allowedHosts;
  if (hosts !== null && (!(hosts instanceof Set) || [...hosts].some((h) => typeof h !== "string"))) throw new TypeError("allowedHosts must be a Set");
  const endpoints = input.endpoints.map((endpoint) => {
    if (!isRecord(endpoint) || !validId(endpoint.id) || typeof endpoint.url !== "string") throw new PluginManifestError("invalid_endpoint");
    let url;
    try { url = new URL(endpoint.url); } catch { throw new PluginManifestError("invalid_endpoint_url"); }
    if (url.protocol !== "https:" || url.username || url.password || url.hash || url.search) throw new PluginManifestError("unsafe_endpoint_url");
    if (hosts && !hosts.has(url.hostname)) throw new PluginManifestError("untrusted_endpoint_host");
    return Object.freeze({ id: endpoint.id, url: url.toString() });
  });
  if (new Set(endpoints.map((e) => e.id)).size !== endpoints.length) throw new PluginManifestError("duplicate_endpoint_id");
  return Object.freeze({
    schemaVersion: 1, id: input.id, name: input.name.trim(), version: input.version,
    description: input.description, capabilities: Object.freeze([...input.capabilities]),
    endpoints: Object.freeze(endpoints),
  });
}

/** Intersect requested capabilities with user-approved capabilities. */
export function authorizePluginCapabilities(manifest, approvedCapabilities) {
  if (!manifest || !Array.isArray(manifest.capabilities) || !(approvedCapabilities instanceof Set)) throw new PluginManifestError("invalid_capability_grant");
  const approved = manifest.capabilities.filter((capability) => approvedCapabilities.has(capability));
  return Object.freeze({ pluginId: manifest.id, approved: Object.freeze(approved), denied: Object.freeze(manifest.capabilities.filter((c) => !approvedCapabilities.has(c))) });
}
