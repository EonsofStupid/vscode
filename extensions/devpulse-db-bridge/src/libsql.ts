import * as vscode from 'vscode';

export function setupLibSQL() {
	const config = vscode.workspace.getConfiguration('devpulse.libsql');
	const endpoint = config.get<string>('endpoint', 'http://localhost:8080');
	vscode.window.showInformationMessage(`DevPulse connected to libSQL at ${endpoint}`);
}
