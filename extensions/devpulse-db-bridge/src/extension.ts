import * as vscode from 'vscode';
import { setupSurreal } from './surrealdb';
import { setupLibSQL } from './libsql';
import { setupDuckDB } from './duckdb';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('devpulse.connectDB', async () => {
			const dbType = await vscode.window.showQuickPick(['SurrealDB', 'libSQL', 'DuckDB'], {
				placeHolder: 'Select Database to connect'
			});

			if (dbType === 'SurrealDB') { setupSurreal(); }
			if (dbType === 'libSQL') { setupLibSQL(); }
			if (dbType === 'DuckDB') { setupDuckDB(); }
		})
	);
}

export function deactivate() {}
