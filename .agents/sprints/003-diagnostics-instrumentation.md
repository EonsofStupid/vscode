# Sprint: DevForge V8 Diagnostic Instrumentation

**Sprint goal**: Establish rigorous Node.js V8 execution telemetry to natively capture garbage collection thrashing and trigger automatic `.heapsnapshot` memory dumps if the production compiler (`mangler`) deadlocks or exhausts the 8GB heap.

**Source**: Parking lot / Compiler deadlock recovery & Diagnostics
**Ordered list of tasks**:
1. Inject V8 memory profiling flags (`--trace-gc`, `--heapsnapshot-near-heap-limit=1`) directly into the root `gulp` execution wrapper.

**Definition of done**: `npm run compile-build` actively emits GC logs to stdout and automatically writes a `node.heapsnapshot` file to the root directory if the mangler hits an OOM boundary.

---

## Task: Instrument native gulp execution harness

**Priority**: P0
**Spoke**: Diagnostics / Root Toolchain

### Files Affected

#### `package.json`
- **Lines**: 41-43
- **Current code**:
  ```json
      "precommit": "node --experimental-strip-types build/hygiene.ts",
      "gulp": "node --max-old-space-size=8192 ./node_modules/gulp/bin/gulp.js",
      "electron": "node build/lib/electron.ts",
  ```
- **Target code**:
  ```json
      "precommit": "node --experimental-strip-types build/hygiene.ts",
      "gulp": "node --max-old-space-size=8192 --trace-gc --heapsnapshot-near-heap-limit=1 ./node_modules/gulp/bin/gulp.js",
      "electron": "node build/lib/electron.ts",
  ```

- **Rationale**: Bypassing an unknown crash is structurally invalid. Instrumenting the Node execution binary directly ensures that if V8 deadlocks or exhausts memory inside the mangler tree, the event loop will dump the active AST heap state instantly. This allows us to load the `.heapsnapshot` in Chrome DevTools and isolate the exact TypeScript symbol that is recursing infinitely.
