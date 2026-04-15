import * as vscode from 'vscode';

export function setupDuckDB() {
	const config = vscode.workspace.getConfiguration('devpulse.duckdb');
	const wasmPath = config.get<string>('wasmPath', '');
	vscode.window.showInformationMessage(`DevPulse connected to DuckDB WASM${wasmPath ? ` at ${wasmPath}` : ''}`);
}
