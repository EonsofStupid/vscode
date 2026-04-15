# Sprint 001: Native Compilation Spectre Mitigation Bypass

**Sprint goal**: Remove the `@vscode/deviceid` underlying hardware telemetry dependency to bypass the `MSB8040` MSVC build error thrown during the server compilation pipeline on Spectre-mitigated environments.

**Source**: Pipeline blocker (MSBuild)
**Ordered list of tasks**:
1. Remove `@vscode/deviceid` dependency block inside `package.json` and `remote/package.json`.
2. Mock `getDevDeviceId` resolution inside `src/vs/base/node/id.ts` to skip the missing C++ module.

**Definition of done**: `vscode-reh` server dependencies map cleanly and `node-gyp` compiles the core Native Modules without searching for `deviceid` MSVC objects.

---

## Task: Retarget `getDevDeviceId` Module Binding

**Priority**: P0
**Spoke**: Toolchain (MSB8040 Blocker)

### Files Affected

#### `src/vs/base/node/id.ts`
- **Lines**: 118-126
- **Current code**:
  ```typescript
  export async function getDevDeviceId(errorLogger: (error: Error) => void): Promise<string> {
  	try {
  		const deviceIdPackage = await import('@vscode/deviceid');
  		const id = await deviceIdPackage.getDeviceId();
  		return id;
  	} catch (err) {
  		errorLogger(err);
  		return uuid.generateUuid();
  	}
  }
  ```
- **Target code**:
  ```typescript
  export async function getDevDeviceId(errorLogger: (error: Error) => void): Promise<string> {
  	return uuid.generateUuid();
  }
  ```

- **Rationale**: Erasing the dynamic `import()` prevents the runtime and MSVC from attempting to hook the deleted telemetry package. We route the device hook natively to a UUID fallback.
