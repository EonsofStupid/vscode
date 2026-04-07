# Sprint 002: TypeScript Mangler Memory Deadlock Resolution

**Sprint goal**: Bypass the extreme `max-old-space-size` memory escalation resulting from cloned TS `LanguageService` instances looping inside the internal Microsoft compiler.

**Source**: Pipeline blocker (OOM crash)
**Ordered list of tasks**:
1. Throttle the `workerpool.pool` max concurrency down to 1 inside the typescript mangler bootstrap script.

**Definition of done**: `npm run compile-build-with-mangling` completes the AST traversal for `renameWorker` properties without causing a recursive GARBAGE COLLECTION out-of-memory loop.

---

## Task: Throttling Rename Worker Pooling

**Priority**: P0
**Spoke**: Toolchain (TSC / Gulp)

### Files Affected

#### `build/lib/mangle/index.ts`
- **Lines**: 432-435
- **Current code**:
  ```typescript
  		this.renameWorkerPool = workerpool.pool(path.join(import.meta.dirname, 'renameWorker.ts'), {
  			maxWorkers: 4,
  			minWorkers: 'max'
  		});
  ```
- **Target code**:
  ```typescript
  		this.renameWorkerPool = workerpool.pool(path.join(import.meta.dirname, 'renameWorker.ts'), {
  			maxWorkers: 1,
  			minWorkers: 1
  		});
  ```

- **Rationale**: Setting `maxWorkers: 1` natively prevents the mangler pool from executing exponential 2GB memory spikes on local machines during Server pipeline execution.
