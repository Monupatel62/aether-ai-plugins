import test from "node:test";
import assert from "node:assert/strict";
import { authorizePluginCapabilities, PluginManifestError, validatePluginManifest } from "../src/index.js";

const manifest = { schemaVersion: 1, id: "calendar-plugin", name: "Calendar", version: "1.2.3", description: "Read calendar events", capabilities: ["chat", "events.receive"], endpoints: [{ id: "events", url: "https://calendar.example.com/events" }] };

test("validates and freezes a well-formed plugin manifest", () => {
  const result = validatePluginManifest(manifest, { allowedHosts: new Set(["calendar.example.com"]) });
  assert.equal(result.id, "calendar-plugin");
  assert.equal(Object.isFrozen(result.capabilities), true);
});

test("rejects invalid version, duplicate capabilities, and unsupported capabilities", () => {
  assert.throws(() => validatePluginManifest({ ...manifest, version: "latest" }), PluginManifestError);
  assert.throws(() => validatePluginManifest({ ...manifest, capabilities: ["chat", "chat"] }), PluginManifestError);
  assert.throws(() => validatePluginManifest({ ...manifest, capabilities: ["admin.root"] }), PluginManifestError);
});

test("rejects insecure URLs and hosts outside allowlist", () => {
  assert.throws(() => validatePluginManifest({ ...manifest, endpoints: [{ id: "e", url: "http://calendar.example.com" }] }), PluginManifestError);
  assert.throws(() => validatePluginManifest(manifest, { allowedHosts: new Set(["other.example.com"]) }), (e) => e.code === "untrusted_endpoint_host");
  assert.throws(() => validatePluginManifest({ ...manifest, endpoints: [{ id: "e", url: "https://user:pass@calendar.example.com" }] }), PluginManifestError);
});

test("intersects requested capabilities with user-approved grants", () => {
  const result = authorizePluginCapabilities(validatePluginManifest(manifest), new Set(["chat"]));
  assert.deepEqual(result.approved, ["chat"]);
  assert.deepEqual(result.denied, ["events.receive"]);
});

test("rejects malformed endpoint identifiers and duplicate endpoint IDs", () => {
  assert.throws(() => validatePluginManifest({ ...manifest, endpoints: [{ id: "same", url: "https://a.example.com" }, { id: "same", url: "https://b.example.com" }] }), PluginManifestError);
});


test("rejects IP literals and local-only endpoint names", () => {
  for (const url of ["https://127.0.0.1/admin", "https://localhost/admin", "https://service.internal/api"]) {
    assert.throws(() => validatePluginManifest({ ...manifest, endpoints: [{ id: "e", url }] }), (e) => e.code === "unsafe_endpoint_url");
  }
});
