import * as vscode from 'vscode';
import { setupDuckDB } from './duckdb';
import { setupLibSQL } from './libsql';
import { setupSurreal } from './surrealdb';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('devpulse.connectDB', async () => {
			const dbType = await vscode.window.showQuickPick(['SurrealDB', 'libSQL', 'DuckDB'], {
				placeHolder: 'Select Database to connect',
			});

			if (dbType === 'SurrealDB') {
				setupSurreal();
			}
			if (dbType === 'libSQL') {
				setupLibSQL();
			}
			if (dbType === 'DuckDB') {
				setupDuckDB();
			}
		}),
	);
}

export function deactivate() {}
