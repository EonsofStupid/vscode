import * as vscode from 'vscode';

export function triggerOverlay(profile: any) {
	const config = vscode.workspace.getConfiguration('devpulse.overlay');
	const url = config.get<string>('url', 'http://localhost:1420');

	vscode.window.showInformationMessage(`Clyffy Overlay triggered at ${url} context: ${profile ? 'With Profile' : 'No Profile'}`);
}
