import * as vscode from 'vscode';
import { sendIpcMessage } from './ipc';

export function launchSession(profile: any) {
	const config = vscode.workspace.getConfiguration('devpulse.antigravity');
	const endpoint = config.get<string>('endpoint', 'http://localhost:1520/ipc');
	
	// Payload modeling RRO workspace context snapshot
	const payload = {
		workspace: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath,
		profile,
		timestamp: Date.now()
	};

	sendIpcMessage(endpoint, payload);
	vscode.window.showInformationMessage(`Antigravity session launched via ${endpoint}`);
}
