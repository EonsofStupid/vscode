# DevForge — team notes

Internal conventions for people working on DevForge at DevPulse.

## Communication

- **Product / release discussion:** GitHub Issues and Discussions on [EonsofStupid/devforge](https://github.com/EonsofStupid/devforge) (or your internal tracker with links back to public issues where appropriate).
- **Docs:** Prefer changes in `docs/` via PR so history stays with the code.

## Branches (suggested)

| Branch | Use |
|--------|-----|
| `main` | Always buildable; matches what you want contributors to use. |
| `release/*` | Optional stabilization before tagging. |
| Tags `v*` | Immutable releases; only hotfix forward if you must. |

Adjust to match your org’s GitFlow or trunk-based preference.

## Secrets

- **GitHub OAuth** client secret for `github-authentication` must **not** live in `product.json` / committed `config.ts` for public repos. Use local env, CI secrets, or DevPulse-injected config at build/runtime.
- Rotate credentials if anything was ever pushed to a public remote.

## Review checklist (short)

- Does `product.json` still reflect DevForge branding where the PR touches identity?
- For web auth changes: is `extensions/github-authentication/dist/browser/extension.js` produced in CI or documented for release builds?
- Release impact: does [CHANGELOG.md](../CHANGELOG.md) need an entry?

## Onboarding new engineers

1. Read [DEVFORGE.md](DEVFORGE.md) and [ROADMAP.md](ROADMAP.md).
2. Follow upstream [How to Contribute](https://github.com/microsoft/vscode/wiki/How-to-Contribute) for generic VS Code build prerequisites unless superseded by DevForge-specific docs.
3. Run local verify/serve scripts once the tree compiles.
