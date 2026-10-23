export type PluginTrustTier = "untrusted" | "verified";

export interface PluginManifestV1 {
  readonly schemaVersion: "1";
  readonly pluginId: string;
  readonly version: string;
  readonly publisherId: string;
  readonly displayName: string;
  readonly description: string;
  readonly apiCompatibility: { readonly min: string; readonly max: string };
  readonly artifactSha256: string;
  readonly trustTier: PluginTrustTier;
  /** Capabilities requested by the plugin; these are not grants. */
  readonly requestedCapabilities: readonly string[];
}

export type PluginManifestIssueCode =
  | "unsupported_schema"
  | "invalid_identifier"
  | "invalid_version"
  | "invalid_display_name"
  | "invalid_description"
  | "invalid_compatibility_range"
  | "invalid_artifact_digest"
  | "invalid_trust_tier"
  | "invalid_capability"
  | "duplicate_capability";

export interface PluginManifestIssue {
  readonly code: PluginManifestIssueCode;
  readonly path: string;
}

const IDENTIFIER = /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$/;
const SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

export function validatePluginManifest(manifest: PluginManifestV1): readonly PluginManifestIssue[] {
  const issues: PluginManifestIssue[] = [];
  if (manifest.schemaVersion !== "1") issues.push({ code: "unsupported_schema", path: "/schemaVersion" });
  if (!IDENTIFIER.test(manifest.pluginId)) issues.push({ code: "invalid_identifier", path: "/pluginId" });
  if (!IDENTIFIER.test(manifest.publisherId)) issues.push({ code: "invalid_identifier", path: "/publisherId" });
  if (!SEMVER.test(manifest.version)) issues.push({ code: "invalid_version", path: "/version" });
  if (typeof manifest.displayName !== "string" || manifest.displayName.trim().length < 1 || manifest.displayName.length > 120) {
    issues.push({ code: "invalid_display_name", path: "/displayName" });
  }
  if (typeof manifest.description !== "string" || manifest.description.trim().length < 1 || manifest.description.length > 1000) {
    issues.push({ code: "invalid_description", path: "/description" });
  }
  if (!SEMVER.test(manifest.apiCompatibility.min) || !SEMVER.test(manifest.apiCompatibility.max) ||
      compareVersion(manifest.apiCompatibility.min, manifest.apiCompatibility.max) > 0) {
    issues.push({ code: "invalid_compatibility_range", path: "/apiCompatibility" });
  }
  if (!/^[a-f0-9]{64}$/.test(manifest.artifactSha256)) issues.push({ code: "invalid_artifact_digest", path: "/artifactSha256" });
  if (!["untrusted", "verified"].includes(manifest.trustTier)) issues.push({ code: "invalid_trust_tier", path: "/trustTier" });

  const seen = new Set<string>();
  manifest.requestedCapabilities.forEach((capability, index) => {
    if (!/^[a-z][a-z0-9._:-]{0,95}$/.test(capability)) {
      issues.push({ code: "invalid_capability", path: `/requestedCapabilities/${index}` });
    }
    if (seen.has(capability)) issues.push({ code: "duplicate_capability", path: `/requestedCapabilities/${index}` });
    seen.add(capability);
  });
  return issues;
}

export function isApiVersionCompatible(manifest: PluginManifestV1, apiVersion: string): boolean {
  if (!SEMVER.test(apiVersion) || validatePluginManifest(manifest).length > 0) return false;
  return compareVersion(apiVersion, manifest.apiCompatibility.min) >= 0 &&
    compareVersion(apiVersion, manifest.apiCompatibility.max) <= 0;
}

function compareVersion(left: string, right: string): number {
  const parse = (value: string): [number, number, number] => {
    const match = SEMVER.exec(value);
    if (!match) return [0, 0, 0];
    return [Number(match[1]), Number(match[2]), Number(match[3])];
  };
  const a = parse(left);
  const b = parse(right);
  for (let i = 0; i < 3; i++) {
    if (a[i]! < b[i]!) return -1;
    if (a[i]! > b[i]!) return 1;
  }
  return 0;
}
