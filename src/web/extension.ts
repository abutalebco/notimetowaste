import * as vscode from 'vscode';
import { SidebarProvider } from './sidebar';
import { StatusBar } from './statusBar';
import { Store } from './store';

/**
 * Entry point for "No Time To Waste".
 * Features are wired up here as they are added.
 */
export function activate(context: vscode.ExtensionContext) {
	const store = new Store(context);
	const sidebar = new SidebarProvider(context.extensionUri, store);

	context.subscriptions.push(
		store,
		new StatusBar(store),
		vscode.window.registerWebviewViewProvider(SidebarProvider.viewId, sidebar),
		vscode.commands.registerCommand('notimetowaste.increment', async () => {
			const result = await store.increment();
			if (result.roundCompleted) {
				sidebar.post({ type: 'roundComplete' });
			}
		}),
		vscode.commands.registerCommand('notimetowaste.reset', () => store.resetRound()),
	);
}

export function deactivate() {}
