import * as vscode from 'vscode';
import { setupStatusBar } from './statusBar';

export function activate(context: vscode.ExtensionContext) {
	// Register commands
	context.subscriptions.push(
		vscode.commands.registerCommand('devpulse.openHub', () => {
			vscode.commands.executeCommand('workbench.action.openWalkthrough', 'jesse-hall.devpulse-hub#devforgeWelcome');
		})
	);

	// Setup status bar
	setupStatusBar(context);

	// Show layman welcoming popup
	const hasSeenWelcome = context.globalState.get('hasSeenDevForgeWelcome');
	if (!hasSeenWelcome) {
		vscode.window.showInformationMessage(
			'Welcome to DevForge! Ready to vibe-code like a pro with Clyffy?',
			'Get Started'
		).then(selection => {
			if (selection === 'Get Started') {
				vscode.commands.executeCommand('workbench.action.openWalkthrough', 'jesse-hall.devpulse-hub#devforgeWelcome');
			}
		});
		context.globalState.update('hasSeenDevForgeWelcome', true);
	}
}

export function deactivate() {}
