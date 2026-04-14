#!/usr/bin/env node
/* Sets DEVFORGE_VERBOSE=1 then runs devforge-serve (server --log trace). */
import * as path from 'path';
import * as url from 'url';
import { spawnSync } from 'child_process';

process.env.DEVFORGE_VERBOSE = '1';
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const repo = path.resolve(__dirname, '..');
const r = spawnSync(process.execPath, [path.join(__dirname, 'devforge-serve.mjs')], {
	cwd: repo,
	stdio: 'inherit',
	env: process.env,
});
process.exit(r.status ?? (r.signal ? 1 : 0));
