/*---------------------------------------------------------------------------------------------
 *  Shared DevForge dev logging (scripts only). Set DEVFORGE_LOG=0 to reduce noise.
 *--------------------------------------------------------------------------------------------*/

const quiet = process.env.DEVFORGE_LOG === '0';

/** @param {'INIT'|'PRECHECK'|'PRELAUNCH'|'SERVE'|'OAUTH'|'VERIFY'|'CAPTURE'|'DONE'|'WARN'} phase */
export function dlog(phase, message, detail) {
	if (quiet) {
		return;
	}
	const t = new Date().toISOString();
	let line = `[devforge ${t}] [${phase}] ${message}`;
	if (detail !== undefined) {
		line += typeof detail === 'string' ? ` ${detail}` : `\n${JSON.stringify(detail, null, 2)}`;
	}
	console.log(line);
}

export function dwarn(message, detail) {
	const t = new Date().toISOString();
	let line = `[devforge ${t}] [WARN] ${message}`;
	if (detail !== undefined) {
		line += typeof detail === 'string' ? ` ${detail}` : `\n${JSON.stringify(detail, null, 2)}`;
	}
	console.warn(line);
}

export function derr(message, detail) {
	const t = new Date().toISOString();
	let line = `[devforge ${t}] [ERROR] ${message}`;
	if (detail !== undefined) {
		line += typeof detail === 'string' ? ` ${detail}` : `\n${JSON.stringify(detail, null, 2)}`;
	}
	console.error(line);
}
