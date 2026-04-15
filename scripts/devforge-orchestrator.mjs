#!/usr/bin/env node
/*---------------------------------------------------------------------------------------------
 *  DevForge orchestrator: verify branding assets, build outputs, optional server launch + screenshots.
 *  Usage:
 *    node scripts/devforge-orchestrator.mjs              # verify only (exit 1 on failure)
 *    node scripts/devforge-orchestrator.mjs --capture    # verify + start code-server + screenshots
 *    node scripts/devforge-orchestrator.mjs --electron-hint  # print command to launch with CDP for agent-browser
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';
import { spawn } from 'child_process';
import { dlog, dwarn as logWarn } from './devforge-logger.mjs';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');

const args = new Set(process.argv.slice(2));
const wantCapture = args.has('--capture');
const wantElectronHint = args.has('--electron-hint');

function fail(msg) {
	console.error(`[devforge] ${msg}`);
	process.exit(1);
}

function ok(msg) {
	console.log(`[devforge] OK  ${msg}`);
}

function warn(msg) {
	logWarn(msg);
}

function readJson(p) {
	return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function verify() {
	let errors = 0;
	const productPath = path.join(REPO_ROOT, 'product.json');
	if (!fs.existsSync(productPath)) {
		console.error('[devforge] missing product.json');
		return 1;
	}
	const product = readJson(productPath);
	if (product.applicationName !== 'devforge') {
		console.error(`[devforge] product.applicationName expected "devforge", got "${product.applicationName}"`);
		errors++;
	} else {
		ok(`product.applicationName = devforge (${product.nameLong ?? product.nameShort ?? ''})`);
	}

	const checks = [
		['Workbench chrome icon', path.join(REPO_ROOT, 'src/vs/workbench/browser/media/code-icon.png')],
		['Windows dev window icon', path.join(REPO_ROOT, 'resources/win32/code_150x150.png')],
		['Canonical DevForge lockup', path.join(REPO_ROOT, 'resources/devforge/icon-lockup.png')],
		['Electron main (desktop)', path.join(REPO_ROOT, 'out/main.js')],
		['Server main (web / sidecar)', path.join(REPO_ROOT, 'out/server-main.js')],
		['GitHub auth web bundle (sign-in / repo access in browser)', path.join(REPO_ROOT, 'extensions/github-authentication/dist/browser/extension.js')],
	];
	for (const [label, p] of checks) {
		if (!fs.existsSync(p)) {
			console.error(`[devforge] missing ${label}: ${path.relative(REPO_ROOT, p)}`);
			errors++;
		} else {
			const st = fs.statSync(p);
			ok(`${label}: ${path.relative(REPO_ROOT, p)} (${st.size} bytes)`);
		}
	}

	const webPng192 = path.join(REPO_ROOT, 'resources/server/code-192.png');
	if (fs.existsSync(webPng192) && fs.statSync(webPng192).size > 5000) {
		ok('Web tab icon resources/server/code-192.png present');
	} else {
		warn('resources/server/code-192.png missing or tiny — browser tab may look generic');
	}

	if (errors) {
		console.error(`[devforge] ${errors} verification error(s).`);
		console.error('[devforge] If GitHub auth bundle is missing:  cd extensions/github-authentication && npm run compile-web');
		console.error('[devforge] Or from repo root:  npm run gulp compile-web');
		console.error('[devforge] Then:  npm run compile   (if server/workbench out/ is missing)');
		return errors;
	}
	return 0;
}

async function sleep(ms) {
	return new Promise(r => setTimeout(r, ms));
}

async function captureScreenshots() {
	dlog('CAPTURE', 'Starting headless capture (server + Playwright)');
	const outDir = path.join(REPO_ROOT, '.vscode', 'devforge-verify', new Date().toISOString().replace(/[:.]/g, '-'));
	fs.mkdirSync(outDir, { recursive: true });
	dlog('CAPTURE', `Output dir: ${path.relative(REPO_ROOT, outDir)}`);

	const serverJs = path.join(REPO_ROOT, 'scripts', 'code-server.js');
	const proc = spawn(process.execPath, [serverJs], {
		cwd: REPO_ROOT,
		env: { ...process.env, VSCODE_SERVER_PORT: '9888' },
		stdio: ['ignore', 'pipe', 'pipe'],
	});

	let webUrl;
	const onData = (buf, stream) => {
		const s = buf.toString();
		process.stderr.write(s);
		const m = s.match(/Web UI available at (https?:\/\/[^\s]+)/);
		if (m) {
			webUrl = m[1];
		}
	};
	proc.stdout.on('data', d => onData(d, 'stdout'));
	proc.stderr.on('data', d => onData(d, 'stderr'));

	const deadline = Date.now() + 180_000;
	while (!webUrl && Date.now() < deadline) {
		await sleep(250);
	}
	if (!webUrl) {
		proc.kill('SIGTERM');
		fail('Timed out waiting for "Web UI available at ..." from code-server. Is the compile complete?');
	}

	dlog('CAPTURE', 'Workbench URL resolved from server stdout', { webUrl });

	let chromium;
	try {
		chromium = await import('playwright-core');
	} catch {
		proc.kill('SIGTERM');
		fail('playwright-core not found. Run npm install from repo root.');
	}

	const launchOpts = [
		{ channel: 'msedge', name: 'Microsoft Edge' },
		{ channel: 'chrome', name: 'Google Chrome' },
		{ channel: undefined, name: 'Playwright bundled Chromium' },
	];
	let browser;
	for (const { channel, name } of launchOpts) {
		try {
			const opts = { headless: true };
			if (channel) {
				opts.channel = channel;
			}
			browser = await chromium.chromium.launch(opts);
			console.log(`[devforge] Launched ${name} (headless) for capture`);
			break;
		} catch (e) {
			warn(`${name} not available (${e.message?.slice(0, 120) ?? e})`);
		}
	}
	if (!browser) {
		proc.kill('SIGTERM');
		fail('Could not launch Playwright Chromium. Install Edge or Chrome, run: npm run playwright-install, or use --electron-hint for agent-browser.');
	}

	const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
	try {
		await page.goto(webUrl, { waitUntil: 'domcontentloaded', timeout: 120_000 });
		await page.waitForSelector('.monaco-workbench', { timeout: 120_000 }).catch(() => { });
		await sleep(2000);
		await page.screenshot({ path: path.join(outDir, '01-workbench.png'), fullPage: false });

		const appIcon = page.locator('.window-appicon').first();
		if (await appIcon.count()) {
			await appIcon.screenshot({ path: path.join(outDir, '02-titlebar-appicon.png') });
			ok('Captured .window-appicon region');
		} else {
			warn('No .window-appicon (expected on Windows/Linux custom title bar); full workbench shot only');
		}
	} finally {
		await browser.close();
		proc.kill('SIGTERM');
		await sleep(500);
	}

	dlog('CAPTURE', 'Screenshots complete', { outDir });
}

function printElectronHint() {
	const bat = path.join(REPO_ROOT, 'scripts', 'code.bat');
	console.log(`
[devforge] Desktop (Electron) + agent-browser:

  1. Build if needed:  npm run compile
  2. In one terminal:
       "${bat}" --remote-debugging-port=9224
  3. Wait for the window, then:
       npx agent-browser connect 9224
       npx agent-browser screenshot ./.vscode/devforge-verify/manual.png

  Or use the Launch config "VS Code Server (Web, Chrome)" + Playwright against http://localhost:8080
`);
}

async function main() {
	dlog('INIT', 'DevForge orchestrator', { repo: REPO_ROOT, argv: process.argv.slice(2) });
	const verifyErrors = verify();
	if (verifyErrors) {
		process.exit(1);
	}

	if (wantElectronHint) {
		printElectronHint();
	}

	if (wantCapture) {
		await captureScreenshots();
	}

	console.log(`
[devforge] Run web server + workbench (same stack as vscode-reh-web for DevPulse):
    npm run devforge:serve
  (Browser: http://localhost:8080?tkn=dev-token — use --no-launch to skip opening a tab)

[devforge] Official repo checklist (suggested remote: github.com/EonsofStupid/devforge)
  - Ensure verify + devforge:serve + optional --capture pass on a clean clone
  - Tag releases (e.g. v1.112.0-devforge.1) from package.json version + your suffix
  - Publish server bundle: gulp vscode-reh-web-<platform>-<arch> (see build/gulpfile.reh.ts)
  - Point DevPulse at release artifacts + commit SHA
`);
}

main().catch(e => {
	console.error(e);
	process.exit(1);
});
