#!/usr/bin/env node
/*---------------------------------------------------------------------------------------------
 *  DevForge web: one Node process serves API + workbench (same shape as vscode-reh-web / DevPulse embed).
 *
 *  Logging: timestamped phases on stderr-friendly console. Set DEVFORGE_LOG=0 to quiet script banners.
 *  Set DEVFORGE_VERBOSE=1 to pass --log trace to server-main for maximum server-side logging.
 *
 *  Default: runs preLaunch (unless VSCODE_SKIP_PRELAUNCH=1), then:
 *    node scripts/code-server.js --connection-token dev-token --port 8080 --launch
 *
 *  Matches .vscode launch "VS Code Server (Web, Chrome)" task URL:
 *    http://localhost:8080?tkn=dev-token
 *
 *  Chat / Copilot: upstream hides Copilot setup on plain web (no remoteAuthority). DevForge uses
 *  urlProtocol "devforge" so chat setup is allowed — you still need GitHub Copilot VSIXes or a
 *  gallery that serves them, plus a GitHub OAuth app whose callback URL matches your origin (e.g.
 *  http://localhost:8080/callback) for account sign-in.
 *
 *  Usage:
 *    npm run devforge:serve
 *    npm run devforge:serve -- --no-launch          # do not open system browser
 *    npm run devforge:serve -- --port 9000        # extra args pass through to server-main
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';
import { spawn, spawnSync } from 'child_process';
import { dlog, dwarn, derr } from './devforge-logger.mjs';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');

function readProduct() {
	try {
		return JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'product.json'), 'utf8'));
	} catch {
		return {};
	}
}

function parseArgValue(argv, name, fallback) {
	const i = argv.indexOf(name);
	if (i !== -1 && argv[i + 1] && !argv[i + 1].startsWith('-')) {
		return argv[i + 1];
	}
	return fallback;
}

const userArgs = process.argv.slice(2).filter(a => a !== '--no-launch');
const openBrowser = !process.argv.includes('--no-launch');

const noToken = userArgs.includes('--without-connection-token');
const defaultToken = 'dev-token';
const defaultPort = '8080';

let serverArgs = [...userArgs];
const hasConnToken = userArgs.some((a, i) => a === '--connection-token' && userArgs[i + 1]);
if (!noToken && !hasConnToken) {
	serverArgs.unshift(defaultToken, '--connection-token');
}
const hasPort = userArgs.some((a, i) => a === '--port' && userArgs[i + 1]);
if (!hasPort) {
	serverArgs.unshift(defaultPort, '--port');
}

if (openBrowser) {
	serverArgs.push('--launch');
}

const port = parseArgValue(serverArgs, '--port', defaultPort);
const host = parseArgValue(serverArgs, '--host', 'localhost');
const serverBasePathRaw = parseArgValue(serverArgs, '--server-base-path', '') || '';
const serverBasePath = serverBasePathRaw.startsWith('/') ? serverBasePathRaw : (serverBasePathRaw ? `/${serverBasePathRaw}` : '');
const token = noToken ? null : parseArgValue(serverArgs, '--connection-token', defaultToken);

if (process.env.DEVFORGE_VERBOSE === '1') {
	serverArgs.push('--log', 'trace');
	dlog('SERVE', 'DEVFORGE_VERBOSE=1 → server gets --log trace');
}

const serverMain = path.join(REPO_ROOT, 'out', 'server-main.js');
const product = readProduct();

dlog('INIT', 'DevForge dev server wrapper', {
	repo: REPO_ROOT,
	node: process.version,
	product: product.nameLong ?? product.nameShort,
	applicationName: product.applicationName,
	serverApplicationName: product.serverApplicationName,
	urlProtocol: product.urlProtocol,
});

if (!fs.existsSync(serverMain)) {
	derr('PRECHECK', 'Missing out/server-main.js — run: npm run compile');
	process.exit(1);
}

const sm = fs.statSync(serverMain);
dlog('PRECHECK', `server-main.js present (${sm.size} bytes)`);

const mainJs = path.join(REPO_ROOT, 'out', 'main.js');
if (fs.existsSync(mainJs)) {
	dlog('PRECHECK', `out/main.js present (${fs.statSync(mainJs).size} bytes) — desktop client build OK`);
} else {
	dwarn('PRECHECK', 'out/main.js missing — desktop Electron path not built (web-only is still OK)');
}

const ghAuth = path.join(REPO_ROOT, 'extensions', 'github-authentication', 'package.json');
const ghAuthWeb = path.join(REPO_ROOT, 'extensions', 'github-authentication', 'dist', 'browser', 'extension.js');
dlog('PRECHECK', fs.existsSync(ghAuth) ? 'extensions/github-authentication present' : 'extensions/github-authentication missing');
if (!fs.existsSync(ghAuthWeb)) {
	derr('PRECHECK', 'GitHub sign-in will NOT work in web: missing extensions/github-authentication/dist/browser/extension.js', {
		fix: 'cd extensions/github-authentication && npm run compile-web   OR   npm run gulp compile-web',
	});
	process.exit(1);
}
dlog('PRECHECK', `github-authentication web entry (${fs.statSync(ghAuthWeb).size} bytes) — sign-in / Accounts menu can register`);

if (!process.env.VSCODE_SKIP_PRELAUNCH) {
	dlog('PRELAUNCH', 'Running build/lib/preLaunch.ts (set VSCODE_SKIP_PRELAUNCH=1 to skip)');
	const pre = spawnSync(process.execPath, [path.join(REPO_ROOT, 'build', 'lib', 'preLaunch.ts')], {
		cwd: REPO_ROOT,
		stdio: 'inherit',
	});
	if (pre.status !== 0 && pre.status !== null) {
		derr('PRELAUNCH', `preLaunch exited ${pre.status}`);
		process.exit(pre.status);
	}
	dlog('PRELAUNCH', 'preLaunch finished OK');
} else {
	dlog('PRELAUNCH', 'Skipped (VSCODE_SKIP_PRELAUNCH set)');
}

const origin = `http://${host}:${port}`;
const originBase = serverBasePath ? `${origin}${serverBasePath}` : origin;
const callbackUrl = `${originBase}/callback`;
const workbenchUrl = noToken
	? `${originBase}/`
	: `${originBase}/?tkn=${encodeURIComponent(token)}`;

dlog('OAUTH', 'GitHub OAuth / DevPulse–DevForge bridge (register these on your GitHub OAuth App)', {
	homepageUrl: originBase,
	authorizationCallbackUrl: callbackUrl,
	note: 'Path must match what the browser hits after sign-in. If you use --server-base-path, include it in the callback URL above.',
	extension: 'github-authentication ships in-repo; ensure product extensionsGallery or VSIX install allows users to sign in.',
});

dlog('SERVE', 'Starting code-server.js (server + web workbench in one process)', { argv: ['node', 'scripts/code-server.js', ...serverArgs] });
dlog('SERVE', 'Open workbench', { workbenchUrl });
if (!noToken) {
	dlog('SERVE', 'Connection token query name is typically `tkn` — keep ?tkn=... on first load');
}

console.log('\n' + '='.repeat(72));
console.log(' DevForge WEB — listen for: Web UI available at …  (then browser opens if --launch)');
console.log('='.repeat(72) + '\n');

const codeServerJs = path.join(REPO_ROOT, 'scripts', 'code-server.js');
const child = spawn(process.execPath, [codeServerJs, ...serverArgs], {
	cwd: REPO_ROOT,
	stdio: 'inherit',
	env: { ...process.env, NODE_ENV: 'development', VSCODE_DEV: '1' },
});

const die = (sig) => {
	dlog('SERVE', `Received ${sig}, stopping child`);
	child.kill('SIGTERM');
	process.exit(128 + 2);
};
process.on('SIGINT', () => die('SIGINT'));
process.on('SIGTERM', () => die('SIGTERM'));
child.on('exit', (code, signal) => {
	if (signal) {
		dwarn('DONE', `child signal ${signal}`);
		process.exit(1);
	}
	dlog('DONE', `code-server exited code ${code ?? 0}`);
	process.exit(code ?? 0);
});
