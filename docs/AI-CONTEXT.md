# AI context — DevForge fork

Use this file **together with** [AGENTS.md](../AGENTS.md) and [.github/copilot-instructions.md](../.github/copilot-instructions.md) (upstream VS Code guidance).

## Repository identity

- **Product:** DevForge by DevPulse (`product.json`: `applicationName` `devforge`, `urlProtocol` `devforge`, etc.).
- **Public remote:** [github.com/EonsofStupid/devforge](https://github.com/EonsofStupid/devforge).
- **Purpose:** Code OSS fork for embedded web workbench / server workflows integrated with DevPulse.

## High-value paths

| Area | Path |
|------|------|
| Product metadata | `product.json` |
| DevForge dev scripts | `scripts/devforge-serve.mjs`, `scripts/devforge-orchestrator.mjs`, `scripts/devforge-logger.mjs` |
| Root npm scripts | `package.json` → `devforge:*` |
| Server-web packaging (upstream) | `build/gulpfile.reh.ts` (`reh-web` targets) |
| Web GitHub sign-in extension | `extensions/github-authentication/` — **browser** entry: `dist/browser/extension.js` |

## Common mistakes to avoid

- Assuming `gulp compile-extension:github-authentication` alone enables **web** sign-in; the **browser** bundle needs `compile-web` in that extension.
- Treating `npm run compile` as a full **release** build; production artifacts are gulp **vscode-reh-web-*** (and optionally desktop) tasks.
- Committing OAuth **client secrets** or per-customer keys.

## Docs for humans

- [docs/README.md](README.md) — index.
- [docs/DEVPULSE-UPDATES.md](DEVPULSE-UPDATES.md) — update channel and manifest contract.

When asked for “what to ship” or “how DevPulse updates,” prefer **DEVPULSE-UPDATES.md** over guessing.
