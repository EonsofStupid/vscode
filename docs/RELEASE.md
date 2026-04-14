# Publishing DevForge to GitHub

## Remote

```bash
git remote add devforge https://github.com/EonsofStupid/devforge.git
# or verify:
git remote -v
```

## First push (replace GitHub “Initial commit”)

If `main` on GitHub only has the template **Initial commit**, your first push must **replace** that branch (unrelated histories).

```bash
git fetch devforge main
git push -u devforge dev:main --force-with-lease=refs/heads/main:$(git rev-parse devforge/main)
```

If you are sure nothing else landed on `main`:

```bash
git push -u devforge dev:main --force
```

**Note:** The full VS Code history is large; the first push can take **a long time** and needs stable auth (GitHub CLI, HTTPS credential manager, or SSH).

## Declare an official version (tag + release)

1. **Align versions** — `package.json` `version` must match the tag (without `v`).

2. **Create and push the tag** (from the commit you want to release):

```bash
git tag -a v1.112.0 -m "DevForge 1.112.0"
git push devforge v1.112.0
```

3. **GitHub Actions** — Pushing `v*.*.*` runs `.github/workflows/release-devforge.yml`, which creates a **GitHub Release** and attaches **`manifest.json`**.

4. **CHANGELOG** — Copy the section for that version into the release description if you want parity with [CHANGELOG.md](../CHANGELOG.md).

## URLs for DevPulse / CI (after the first tagged release)

| What | URL |
|------|-----|
| Latest release manifest | `https://github.com/EonsofStupid/devforge/releases/latest/download/manifest.json` |
| Pinned manifest | `https://github.com/EonsofStupid/devforge/releases/download/v1.112.0/manifest.json` |
| Latest release (API) | `https://api.github.com/repos/EonsofStupid/devforge/releases/latest` |
| Source zip (pinned tag) | `https://github.com/EonsofStupid/devforge/archive/refs/tags/v1.112.0.zip` |

`manifest.json` includes `sourceZipUrl` / `sourceTarballUrl` for scripts that do not use git.

## OAuth client secret (local only)

Do **not** commit `gitHubClientSecret` in `extensions/github-authentication/src/config.ts`. Set it locally when you need web sign-in, then run `npm run compile-web` in that extension. **Rotate** the secret in the GitHub OAuth app if it was ever committed or pasted into a ticket.
