# DevPulse ↔ DevForge update channel

This document is the **contract** between **DevForge** (this repo’s releases) and **DevPulse** (host platform with a baked-in channel to pull editor bits during builds or at runtime).

Goals:

- **Latest DevForge** (or a pinned version) is always **importable** in a deterministic way.
- **Versioning** and **changelog** are visible to humans, CI, and AI agents.

---

## Versioning rules

| Source | Rule |
|--------|------|
| **Semantic product version** | Align with `package.json` `version` (for example `1.112.0`). |
| **Git tag** | `v` + same string, for example `v1.112.0`. |
| **GitHub Release** | One release per tag; release title includes version. |

Pre-releases use a suffix in `package.json` (for example `1.113.0-beta.1`) and tag `v1.113.0-beta.1`.

### GitHub Releases + `manifest.json` (CI-friendly)

Pushing a SemVer tag `v*.*.*` runs `.github/workflows/release-devforge.yml`, which publishes a **GitHub Release** with an attached **`manifest.json`** (version, source zip/tar URLs, release link).

Use these in DevPulse / build scripts:

| Use case | URL |
|----------|-----|
| **Always “latest” manifest** | `https://github.com/EonsofStupid/devforge/releases/latest/download/manifest.json` |
| **Pinned manifest** | `https://github.com/EonsofStupid/devforge/releases/download/<TAG>/manifest.json` (example: `.../download/v1.112.0/manifest.json`) |
| **Latest release JSON (API)** | `GET https://api.github.com/repos/EonsofStupid/devforge/releases/latest` |
| **Checkout this version (git)** | `git fetch origin tag v1.112.0 && git checkout v1.112.0` |
| **Source archive (no git)** | URLs inside `manifest.json` (`sourceZipUrl` / `sourceTarballUrl`) |

When you add prebuilt `vscode-reh-web-*` zips, attach them to the same release and extend `manifest.json` in the workflow to list `artifacts[]` with `sha256` (see below).

---

## Artifacts DevPulse should consume

**Primary (embed / server-web):** archived output of the **`vscode-reh-web-*`** gulp family (exact platform/arch chosen by DevPulse support matrix). Each release asset should include:

- Archive (`.zip` / `.tar.gz`) with **stable asset name** or **version in filename** (pick one convention and keep it).
- **Checksum file** (for example `SHA256SUMS`) for integrity during import.
- **Optional:** separate debug / non-minified channel for internal use only.

**Secondary (optional):** desktop installers from `vscode-*` gulp targets, if DevPulse ever bundles a desktop shell.

---

## Update manifest (required for “baked in channel”)

DevPulse should not scrape HTML. Define one JSON document per **channel**, served over HTTPS, for example:

- `https://releases.example.com/devforge/stable.json`
- `https://releases.example.com/devforge/beta.json`

Suggested shape (extend as needed):

```json
{
  "schema": 1,
  "channel": "stable",
  "product": "devforge",
  "version": "1.112.0",
  "releasedAt": "2026-04-14T12:00:00Z",
  "releaseNotesUrl": "https://github.com/EonsofStupid/devforge/releases/tag/v1.112.0",
  "artifacts": [
    {
      "platform": "win32",
      "arch": "x64",
      "kind": "reh-web-min",
      "url": "https://github.com/EonsofStupid/devforge/releases/download/v1.112.0/devforge-reh-web-win32-x64-1.112.0.zip",
      "sha256": "<hex>"
    }
  ],
  "minDevPulseVersion": "0.0.0"
}
```

**Rules:**

1. **CI / import** reads manifest, verifies `sha256`, downloads `url`, unpacks to a known layout DevPulse expects.
2. **“Latest”** for a channel = whatever version that manifest currently advertises (updated when you publish a release and refresh the JSON).
3. **Pinning:** DevPulse can pin `version` in config for enterprise builds; dogfood can float on `stable`.

Implementation options: static JSON in a **releases** branch, object storage + CDN, or a small release service. GitHub Releases API can backfill metadata but a **small manifest** you control is simpler for embed pipelines.

---

## Changelog

- Human-edited [CHANGELOG.md](../CHANGELOG.md) follows **Keep a Changelog** style where possible.
- Each GitHub Release body should either **copy** the relevant section or **link** to the tag’s `CHANGELOG.md` on GitHub for that version.

DevPulse UI can deep-link to `releaseNotesUrl` from the manifest.

---

## Responsibilities

| Owner | Responsibility |
|-------|----------------|
| **DevForge repo** | Tags, release assets, checksums, CHANGELOG, manifest JSON (or generator in CI). |
| **DevPulse** | Resolve manifest, verify hash, cache artifacts, enforce `minDevPulseVersion`, surface “update available” in product UI. |

---

## AI and team notes

When automating releases or DevPulse imports, agents should:

- Treat the **manifest** and **SHA256** as the source of truth, not informal filenames.
- Never commit **OAuth client secrets** or signing keys into this repo; inject via CI secrets or DevPulse’s secret store.
