import * as vscode from 'vscode';

export function suggestLesson(topic: string) {
	const config = vscode.workspace.getConfiguration('devpulse.clyffy');
	const mode = config.get<string>('mode', 'beginner');

	vscode.window.showInformationMessage(`Clyffy (${mode} mode): Let's learn about ${topic}.`);
}
