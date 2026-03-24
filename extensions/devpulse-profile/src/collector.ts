import * as vscode from 'vscode';
import { IDevProfile } from './types';

export class ProfileCollector {
	private profile: IDevProfile;

	constructor() {
		this.profile = {
			featureUsage: {},
			languageDistribution: {},
			learningVelocity: 0,
			preferences: {
				isRusher: false,
				usesMindMaps: true,
				readsDocs: false
			}
		};
	}

	public start(context: vscode.ExtensionContext) {
		// Mock telemetry collection
		context.subscriptions.push(
			vscode.window.onDidChangeActiveTextEditor(e => {
				if (e && e.document) {
					const lang = e.document.languageId;
					this.profile.languageDistribution[lang] = (this.profile.languageDistribution[lang] || 0) + 1;
				}
			})
		);
	}

	public getProfile(): IDevProfile {
		return this.profile;
	}
}
