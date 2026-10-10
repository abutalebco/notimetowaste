import * as vscode from 'vscode';
import { levelInfo } from './levels';
import { currentDailyGoal, display, settings } from './settings';
import { Store } from './store';
import { getZikr } from './zikr';

const MAX_LABEL = 28;

/** Live counter in the status bar; clicking it counts once. */
export class StatusBar implements vscode.Disposable {
	private readonly item = vscode.window.createStatusBarItem('Sabha.status', vscode.StatusBarAlignment.Right, 100);
	private readonly configListener: vscode.Disposable;

	constructor(private readonly store: Store) {
		this.item.name = 'Sabha';
		this.item.command = 'Sabha.increment';
		store.onDidChange(() => this.update());
		this.configListener = vscode.workspace.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('Sabha')) {
				this.update();
			}
		});
		this.update();
	}

	update(): void {
		if (!settings.showStatusBar) {
			this.item.hide();
			return;
		}
		const zikr = getZikr(this.store.global.selectedZikr);
		const round = this.store.round.count;
		const lvl = levelInfo(this.store.global.total);
		const sLvl = levelInfo(this.store.session.total);
		const label = display(zikr).label;
		const short = label.length > MAX_LABEL ? label.slice(0, MAX_LABEL - 1) + '…' : label;
		this.item.text = `${lvl.badge} ${short}  ${round}/${zikr.target}`;

		const md = new vscode.MarkdownString();
		md.appendMarkdown(`**Sabha**\n\n`);
		md.appendMarkdown(`${lvl.badge} Overall: Level ${lvl.number} — ${lvl.name}  \n`);
		md.appendMarkdown(`${sLvl.badge} This session: Level ${sLvl.number} — ${sLvl.name}\n\n`);
		md.appendMarkdown(`Today: **${this.store.today.toLocaleString()}** / ${currentDailyGoal(this.store.global.daily).toLocaleString()}  \n`);
		md.appendMarkdown(`This session: **${this.store.session.total.toLocaleString()}**  \n`);
		md.appendMarkdown(`All time: **${this.store.global.total.toLocaleString()}**\n\n`);
		md.appendMarkdown(`_Click to count +1_`);
		this.item.tooltip = md;
		this.item.show();
	}

	dispose(): void {
		this.configListener.dispose();
		this.item.dispose();
	}
}
