import * as vscode from 'vscode';
import { ProfileCollector } from './collector';
import type { IDevProfile } from './types';

export function activate(context: vscode.ExtensionContext) {
	const config = vscode.workspace.getConfiguration('devpulse.profile');
	const enabled = config.get<boolean>('enabled', true);

	const collector = new ProfileCollector();

	if (enabled) {
		collector.start(context);
	}

	// Export the API for other DevPulse extensions (clyffy, antigravity)
	return {
		getProfile: (): IDevProfile => collector.getProfile(),
	};
}

export function deactivate() {}
