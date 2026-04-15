# Sprint 003: Purge Editor UI Anti-Patterns

**Sprint goal**: Eradicate the useless `public` visibility hacks placed on `setEditorVisible` across the VS Code UI inheritance chain, restoring strict Microsoft baseline and fixing the Mangler deadlock natively.

**Source**: Parking lot / Compiler deadlock recovery & Codebase Purge
**Ordered list of tasks**:
1. Delete `002-mangler-deadlock-fix.md` from the sprints ledger.
2. Revert `setEditorVisible` to `protected` in `src/vs/workbench/browser/parts/editor/editorPane.ts`.
3. Revert `setEditorVisible` to `protected override` across the 14 remaining VS Code core subclasses.

**Definition of done**: The codebase contains ZERO instances of `public setEditorVisible`, the anti-pattern is fully eliminated, and `npm run compile-build` succeeds natively.

---

## Task: Purge setEditorVisible Anti-Pattern

**Priority**: P0
**Spoke**: Subsystem (Editor UI / Core Purge)

### Files Affected

#### `src/vs/workbench/browser/parts/editor/editorPane.ts`
- **Lines**: 160-160
- **Current code**:
  ```typescript
  	public setEditorVisible(visible: boolean): void {
  ```
- **Target code**:
  ```typescript
  	protected setEditorVisible(visible: boolean): void {
  ```

#### Subclasses (e.g., `textCodeEditor.ts`, `textEditor.ts`, `sideBySideEditor.ts`, `chatEditor.ts`, etc.)
- **Lines**: (Variable)
- **Current code**:
  ```typescript
  	public override setEditorVisible(visible: boolean): void {
  ```
- **Target code**:
  ```typescript
  	protected override setEditorVisible(visible: boolean): void {
  ```

- **Rationale**: An AI-generated execution failure forcefully injected frontend `public` modifiers into backend inheritance abstractions, bricking the TS compiler's Mangler thread pool on the headless sidecar. This sprint surgically restores the pristine architectural baseline.
