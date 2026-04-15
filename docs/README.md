# DevForge documentation

Canonical documentation for **[DevForge](https://github.com/EonsofStupid/devforge)** (VS Code OSS fork by DevPulse) lives **in this repository** under `docs/`. That keeps docs versioned with code, reviewable in PRs, and easy for humans and AI tools to read from a checkout.

## Index

| Document | Audience | Purpose |
|----------|----------|---------|
| [DEVFORGE.md](DEVFORGE.md) | Everyone | What DevForge is, relation to Code OSS, quick orientation |
| [ROADMAP.md](ROADMAP.md) | Team, PM | Phased plan: releases, CI, embed, marketplace |
| [DEVPULSE-UPDATES.md](DEVPULSE-UPDATES.md) | DevPulse + DevForge | **Update channel contract**: versions, artifacts, changelog, how builds import “latest DevForge” |
| [TEAM.md](TEAM.md) | Internal team | Conventions, branches, secrets, review expectations |
| [AI-CONTEXT.md](AI-CONTEXT.md) | AI coding agents | Repo-specific tasks, scripts, guardrails |
| [WIKI.md](WIKI.md) | Maintainer | How this folder maps to GitHub Wiki (optional mirror) |
| [RELEASE.md](RELEASE.md) | Maintainer | Push to `devforge`, first-time `--force-with-lease`, tags, release URLs |

## GitHub Wiki

GitHub Wiki is optional. Recommended approach:

1. **Primary:** this `docs/` tree (always in sync with the commit you build).
2. **Wiki:** either enable the wiki and add a single *Home* page that links here, or periodically copy high-traffic pages into wiki pages for discoverability.

See [WIKI.md](WIKI.md) for a starter Home page you can paste into the wiki.

## Other roots

- [CHANGELOG.md](../CHANGELOG.md) — user-facing release notes (keep in sync with GitHub Releases).
- [AGENTS.md](../AGENTS.md) — agent entrypoint; points to DevForge-specific notes.
