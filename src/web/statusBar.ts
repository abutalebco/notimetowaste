import * as vscode from 'vscode';
import { levelInfo } from './levels';
import { Store } from './store';
import { getZikr } from './zikr';

/** Live counter in the status bar; clicking it counts once. */
export class StatusBar implements vscode.Disposable {
	private readonly item = vscode.window.createStatusBarItem('notimetowaste.status', vscode.StatusBarAlignment.Right, 100);

	constructor(private readonly store: Store) {
		this.item.name = 'No Time To Waste';
		this.item.command = 'notimetowaste.increment';
		store.onDidChange(() => this.update());
		this.update();
		this.item.show();
	}

	update(): void {
		const zikr = getZikr(this.store.global.selectedZikr);
		const round = this.store.round.count;
		const lvl = levelInfo(this.store.global.total);
		const sLvl = levelInfo(this.store.session.total);
		this.item.text = `${lvl.badge} ${zikr.ar}  ${round}/${zikr.target}`;

		const md = new vscode.MarkdownString();
		md.appendMarkdown(`**No Time To Waste**\n\n`);
		md.appendMarkdown(`${lvl.badge} Overall: Level ${lvl.number} — ${lvl.name}  \n`);
		md.appendMarkdown(`${sLvl.badge} This session: Level ${sLvl.number} — ${sLvl.name}\n\n`);
		md.appendMarkdown(`Today: **${this.store.today.toLocaleString()}**  \n`);
		md.appendMarkdown(`This session: **${this.store.session.total.toLocaleString()}**  \n`);
		md.appendMarkdown(`All time: **${this.store.global.total.toLocaleString()}**\n\n`);
		md.appendMarkdown(`_Click to count +1_`);
		this.item.tooltip = md;
	}

	dispose(): void {
		this.item.dispose();
	}
}
