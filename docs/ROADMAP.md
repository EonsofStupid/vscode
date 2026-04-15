# DevForge roadmap

Living plan for turning [github.com/EonsofStupid/devforge](https://github.com/EonsofStupid/devforge) into a **professionally built, versioned product** with a clear story for DevPulse embeds and updates.

Status labels: **Planned** · **In progress** · **Done** (edit this file as you go).

---

## Phase 0 — Repository hygiene

- **Done / ongoing:** Public repo created; source push strategy agreed (full history vs squash).
- Align `product.json` links (issue URLs, license pointers) with DevForge vs Microsoft where appropriate.
- Root [CHANGELOG.md](../CHANGELOG.md) and GitHub **Releases** discipline: tag = `package.json` version.

## Phase 1 — “Known good” local build

- Document one **gold path** per platform for developers (dependencies, Node version, `npm ci`, compile order).
- Ensure `github-authentication` **web** bundle is part of documented steps for web sign-in.
- `devforge:verify` / `devforge:serve` documented and stable for local demos.

## Phase 2 — Release artifacts

- Define **minimum** release matrix (for example: `vscode-reh-web-win32-x64-min` only first, then Linux).
- Produce **zipped / archived** server-web bundles with predictable names and checksums (SHA256 files alongside zips).
- Optional: Electron desktop builds later (separate milestone).

## Phase 3 — CI and automation

- Tag-driven workflow (e.g. `v*`) that builds selected gulp targets and attaches artifacts to GitHub Releases.
- Honest runner strategy: full VS Code-style builds are heavy; use larger runners or self-hosted where needed.
- Optional: nightly **latest** prerelease channel for DevPulse dogfooding.

## Phase 4 — DevPulse update channel (product integration)

- Publish a **machine-readable manifest** (JSON) per channel (`stable`, `beta`, `nightly`) listing: version, release notes URL, artifact URLs, SHA256, min DevPulse version.
- DevPulse build/import pipeline reads manifest and pins or floats version per environment.
- Document contract in [DEVPULSE-UPDATES.md](DEVPULSE-UPDATES.md); implement endpoints or storage (CDN, GitHub Releases API, org bucket).

## Phase 5 — Hardening

- Security policy (`SECURITY.md`), supported versions, dependency update policy.
- Extension gallery strategy (Open VSX / private gallery).
- Smoke tests for embed: load workbench, auth callback, token query param.

## Phase 6 — Team scale

- Issue templates, contribution guide for external contributors (if desired).
- Training doc for support: “how to collect logs,” known limitations vs Microsoft VS Code.

---

## How to use this roadmap

1. Turn phases into **GitHub Issues** or **Projects** columns with owners.
2. After each **release**, update [CHANGELOG.md](../CHANGELOG.md) and bump `package.json` / tag.
3. Link each GitHub Release to the manifest entry DevPulse consumes.
