import { describe, expect, it } from "vitest";
import { isApiVersionCompatible, validatePluginManifest } from "../src/index.js";
import type { PluginManifestV1 } from "../src/index.js";

const manifest: PluginManifestV1 = {
  schemaVersion: "1",
  pluginId: "calendar-connector",
  version: "1.2.0",
  publisherId: "aether-team",
  displayName: "Calendar Connector",
  description: "Provides calendar integration capabilities.",
  apiCompatibility: { min: "1.0.0", max: "2.0.0" },
  artifactSha256: "a".repeat(64),
  trustTier: "untrusted",
  requestedCapabilities: ["calendar.read", "calendar.events.list"]
};

describe("plugin manifest validation", () => {
  it("accepts a valid manifest and keeps requested capabilities separate from grants", () => {
    expect(validatePluginManifest(manifest)).toEqual([]);
    expect(manifest.requestedCapabilities).toContain("calendar.read");
  });

  it("checks API compatibility bounds", () => {
    expect(isApiVersionCompatible(manifest, "1.5.0")).toBe(true);
    expect(isApiVersionCompatible(manifest, "2.1.0")).toBe(false);
    expect(isApiVersionCompatible(manifest, "not-semver")).toBe(false);
  });

  it("rejects duplicate capabilities, invalid digest, and reversed compatibility range", () => {
    const invalid = {
      ...manifest,
      artifactSha256: "not-a-digest",
      apiCompatibility: { min: "2.0.0", max: "1.0.0" },
      requestedCapabilities: ["calendar.read", "calendar.read"]
    };
    const codes = validatePluginManifest(invalid).map(issue => issue.code);
    expect(codes).toContain("invalid_artifact_digest");
    expect(codes).toContain("invalid_compatibility_range");
    expect(codes).toContain("duplicate_capability");
  });
});
