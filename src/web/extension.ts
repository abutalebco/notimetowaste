import * as vscode from 'vscode';
import { Store } from './store';

/**
 * Entry point for "No Time To Waste".
 * Features are wired up here as they are added.
 */
export function activate(context: vscode.ExtensionContext) {
	const store = new Store(context);
	context.subscriptions.push(store);
}

export function deactivate() {}
