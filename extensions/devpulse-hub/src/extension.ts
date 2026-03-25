import * as vscode from 'vscode';
import { setupStatusBar } from './statusBar';

export function activate(context: vscode.ExtensionContext) {
	// Register commands
	context.subscriptions.push(
		vscode.commands.registerCommand('devpulse.openHub', () => {
			vscode.window.showInformationMessage('Welcome to the DevPulse Hub (stub).');
		}),
	);

	// Setup status bar
	setupStatusBar(context);
}

export function deactivate() {}
