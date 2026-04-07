# Parking Lot: Mangler Thread Pool Tuning

## Topic: `renameWorkerPool` Concurrency vs Memory Stability

### Context
The Microsoft TS Mangler (`build/lib/mangle/index.ts`) natively spins up 4 parallel web workers to generate the TypeScript AST for renaming private/protected variables. Each worker instance locally spins up its own complete `ts.LanguageService` (`createLanguageService`), duplicating the entire VS Code codebase memory threshold across 4 concurrent Node.js processes. 

### Conflict / Decision Point
Running `maxWorkers: 4` on standard local hardware causes a rapid 8GB+ memory escalation and an infinite V8 garbage-collection `allocation failure;` loop, eventually OOMing the compiler entirely during `npm run compile-build-with-mangling`. 

**Option A (Proposed & Active)**
Restrict the pool to `maxWorkers: 1` and `minWorkers: 1`. 
- **Pros**: Physically prevents the recursive 8GB memory explosion. Guarantees 100% mathematical stability.
- **Cons**: Forces the mangler to parse the `renameWorker` queue sequentially, notably increasing the total build duration.

**Option B (Discarded Bypass)**
Skip the mangler entirely (`compile-build-without-mangling`).
- **Pros**: Instant compilation. 
- **Cons**: Creates drift from the Microsoft production baseline, which violates strict compilation standards.

**Option C (Anti-Pattern Hack)**
Change `protected` visibility to `public` to hide them from the mangler logic loop.
- **Pros**: Avoids mangler memory leaks.
- **Cons**: Destroys the integrity of the core abstraction layers and hallucinates false dependencies.

### Resolution Status
Pending user sign-off to formalize **Option A** into the permanent architecture.
