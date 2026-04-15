import * as vscode from 'vscode';
import { launchSession } from './session';

interface IDevProfileApi {
	getProfile(): unknown;
}

export function activate(context: vscode.ExtensionContext) {
	const profileExtension = vscode.extensions.getExtension<IDevProfileApi>('jesse-hall.devpulse-profile');

	context.subscriptions.push(
		vscode.commands.registerCommand('devpulse.antigravity.launch', () => {
			const profile = profileExtension?.isActive ? profileExtension.exports.getProfile() : null;
			launchSession(profile);
		}),
	);
}

export function deactivate() {}
