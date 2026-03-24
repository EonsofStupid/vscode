import * as vscode from 'vscode';
import { triggerOverlay } from './overlay';
import { suggestLesson } from './lessons';

// Use an interface for the exported API from devpulse-profile
interface IDevProfileApi {
	getProfile(): any;
}

export function activate(context: vscode.ExtensionContext) {
	// Access the profile extension API
	const profileExtension = vscode.extensions.getExtension<IDevProfileApi>('jesse-hall.devpulse-profile');
	
	context.subscriptions.push(
		vscode.commands.registerCommand('devpulse.toggleOverlay', () => {
			const profile = profileExtension?.isActive ? profileExtension.exports.getProfile() : null;
			triggerOverlay(profile);
		}),
		vscode.commands.registerCommand('devpulse.clyffy.teach', () => {
			suggestLesson('git-commit-practices');
		})
	);
}

export function deactivate() {}
