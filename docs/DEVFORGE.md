# DevForge overview

**DevForge** is a product fork of [Visual Studio Code — Open Source (“Code - OSS”)](https://github.com/microsoft/vscode), branded and extended for **DevPulse** (embedded / sidecar editor, server-web workflows, and related tooling).

- **Upstream:** Microsoft’s `vscode` repository and MIT license (see `LICENSE.txt` and third-party notices in-tree).
- **Product identity:** `product.json` defines names such as `applicationName` `devforge`, `urlProtocol` `devforge`, server names, and data folders (for example `.devforge`).
- **Public home:** [github.com/EonsofStupid/devforge](https://github.com/EonsofStupid/devforge).

## What ships

| Surface | Typical artifact | Notes |
|---------|------------------|--------|
| **Web + server (embed)** | `vscode-reh-web-*` gulp output (layout matches upstream server-web) | Primary path for DevPulse iframe / remote web workbench. |
| **Desktop** | Platform `vscode-*` gulp outputs / installers | Optional; heavier build and different distribution story. |

Exact gulp task names and packaging steps belong in the roadmap and CI docs as they are implemented; they follow `build/gulpfile.reh.ts` and related gulpfiles in `build/`.

## Development helpers (this fork)

- `npm run devforge:serve` — local web server wrapper (`scripts/devforge-serve.mjs`).
- `npm run devforge:verify` — sanity checks (`scripts/devforge-orchestrator.mjs`).
- GitHub authentication in the **browser** requires `extensions/github-authentication/dist/browser/extension.js` (from `npm run compile-web` in that extension).

## Extensions and gallery

OSS builds do not automatically use Microsoft’s private marketplace the same way Visual Studio Code does. Plan for **Open VSX** (or your own gallery) in `product.json` / build configuration when you harden releases.

## Where to read next

- [ROADMAP.md](ROADMAP.md) — what “done professionally” means in phases.
- [DEVPULSE-UPDATES.md](DEVPULSE-UPDATES.md) — how DevPulse will consume versioned DevForge drops.
