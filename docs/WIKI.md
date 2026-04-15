# GitHub Wiki mirror (optional)

The **source of truth** for DevForge prose docs is the **`docs/` folder in the git repository**. Wikis are a second UI; they can drift unless you maintain them.

## Recommended setup

1. Enable the **Wiki** tab on [github.com/EonsofStupid/devforge](https://github.com/EonsofStupid/devforge).
2. Create a **Home** page with this content (or a shortened variant):

---

### DevForge Wiki — Home

Welcome. **Canonical documentation** lives in the repo:

**[Documentation index (`docs/README.md`)](https://github.com/EonsofStupid/devforge/blob/main/docs/README.md)**

Key links:

- [DevForge overview](https://github.com/EonsofStupid/devforge/blob/main/docs/DEVFORGE.md)
- [Roadmap](https://github.com/EonsofStupid/devforge/blob/main/docs/ROADMAP.md)
- [DevPulse update channel](https://github.com/EonsofStupid/devforge/blob/main/docs/DEVPULSE-UPDATES.md)
- [Changelog](https://github.com/EonsofStupid/devforge/blob/main/CHANGELOG.md)
- [Releases](https://github.com/EonsofStupid/devforge/releases)

Please open **Issues** and **Pull Requests** on the main repo for changes. Edit `docs/` in PRs rather than relying on wiki-only edits long term.

---

## If you prefer wiki-first editing

You can copy sections from `docs/*.md` into wiki pages when explaining things to stakeholders, but periodically **sync back** into `docs/` so CI and AI agents see one truth.
