import * as vscode from 'vscode';

export function setupStatusBar(context: vscode.ExtensionContext) {
	const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	statusBarItem.text = '$(pulse) DevForge Platform';
	statusBarItem.tooltip = 'Powered by DevPulse ecosystem';
	statusBarItem.command = 'devpulse.openHub';
	statusBarItem.show();

	context.subscriptions.push(statusBarItem);
}
