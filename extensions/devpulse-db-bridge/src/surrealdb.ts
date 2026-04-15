import * as vscode from 'vscode';

export function setupSurreal() {
	const config = vscode.workspace.getConfiguration('devpulse.surrealdb');
	const endpoint = config.get<string>('endpoint', 'ws://localhost:8000/rpc');
	vscode.window.showInformationMessage(`DevPulse connected to SurrealDB at ${endpoint}`);
}
