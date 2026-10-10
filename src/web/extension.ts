import * as vscode from 'vscode';
import { levelIndex, levelInfo } from './levels';
import { currentDailyGoal, settings } from './settings';
import { SidebarProvider } from './sidebar';
import { StatusBar } from './statusBar';
import { Store } from './store';

/**
 * Entry point for "Sabha".
 * Features are wired up here as they are added.
 */
export function activate(context: vscode.ExtensionContext) {
	const store = new Store(context);
	const sidebar = new SidebarProvider(context.extensionUri, store);

	context.subscriptions.push(
		store,
		new StatusBar(store),
		vscode.window.registerWebviewViewProvider(SidebarProvider.viewId, sidebar),
		vscode.commands.registerCommand('Sabha.increment', async () => {
			const goal = currentDailyGoal(store.global.daily);
			const todayBefore = store.today;
			const result = await store.increment();
			const notify = settings.notifications;
			if (result.roundCompleted) {
				sidebar.post({ type: 'roundComplete' });
			}
			if (todayBefore < goal && store.today >= goal) {
				sidebar.post({ type: 'dailyGoal' });
				if (notify) {
					void vscode.window.showInformationMessage(`🎯 Daily goal of ${goal} reached — keep going!`);
				}
			}
			const ups: { scope: 'session' | 'global'; before: number; after: number }[] = [
				{ scope: 'session', before: result.prevSessionTotal, after: store.session.total },
				{ scope: 'global', before: result.prevGlobalTotal, after: store.global.total },
			];
			for (const { scope, before, after } of ups) {
				if (levelIndex(after) > levelIndex(before)) {
					const lvl = levelInfo(after);
					sidebar.post({ type: 'levelUp', scope, badge: lvl.badge, name: lvl.name, number: lvl.number });
					if (notify) {
						const where = scope === 'session' ? `in ${store.session.name}` : 'overall';
						void vscode.window.showInformationMessage(`${lvl.badge} Level ${lvl.number} — ${lvl.name} ${where}! ما شاء الله`);
					}
				}
			}
		}),
		vscode.commands.registerCommand('Sabha.reset', () => store.resetRound()),
		vscode.commands.registerCommand('Sabha.openSettings', () =>
			vscode.commands.executeCommand('workbench.action.openSettings', 'Sabha.')),
		vscode.commands.registerCommand('Sabha.configureShortcut', async () => {
			await vscode.workspace.getConfiguration('Sabha')
				.update('shortcut', 'custom', vscode.ConfigurationTarget.Global);
			await vscode.commands.executeCommand('workbench.action.openGlobalKeybindings', 'Sabha.increment');
		}),
	);
}

export function deactivate() {}
