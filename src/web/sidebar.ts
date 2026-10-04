import * as vscode from 'vscode';
import { LevelInfo, levelInfo } from './levels';
import { dailyAverage, dailyGoal } from './stats';
import { Store } from './store';
import { ADHKAR, getZikr } from './zikr';

/** Everything the webview needs to render, sent on every change. */
export interface ViewState {
	adhkar: { id: string; label: string }[];
	selected: string;
	text: string;
	subtext: string;
	round: number;
	target: number;
	sessionName: string;
	sessionTotal: number;
	globalTotal: number;
	today: number;
	dailyGoal: number;
	hasHistory: boolean;
	sessionLevel: LevelInfo;
	globalLevel: LevelInfo;
}

export function buildViewState(store: Store): ViewState {
	const g = store.global;
	const s = store.session;
	const zikr = getZikr(g.selectedZikr);
	return {
		adhkar: ADHKAR.map(z => ({ id: z.id, label: z.ar })),
		selected: zikr.id,
		text: zikr.ar,
		subtext: '',
		round: store.round.count,
		target: zikr.target,
		sessionName: s.name,
		sessionTotal: s.total,
		globalTotal: g.total,
		today: store.today,
		dailyGoal: dailyGoal(g.daily),
		hasHistory: dailyAverage(g.daily) > 0,
		sessionLevel: levelInfo(s.total),
		globalLevel: levelInfo(g.total),
	};
}

type InboundMessage =
	| { type: 'ready' }
	| { type: 'increment' }
	| { type: 'reset' }
	| { type: 'select'; id: string };

export class SidebarProvider implements vscode.WebviewViewProvider {
	static readonly viewId = 'notimetowaste.counter';
	private view?: vscode.WebviewView;

	constructor(private readonly extensionUri: vscode.Uri, private readonly store: Store) {
		store.onDidChange(() => this.refresh());
	}

	resolveWebviewView(view: vscode.WebviewView): void {
		this.view = view;
		const media = vscode.Uri.joinPath(this.extensionUri, 'media');
		view.webview.options = { enableScripts: true, localResourceRoots: [media] };
		view.webview.html = this.html(view.webview, media);
		view.webview.onDidReceiveMessage((msg: InboundMessage) => {
			switch (msg.type) {
				case 'ready': return this.refresh();
				case 'increment': return vscode.commands.executeCommand('notimetowaste.increment');
				case 'reset': return vscode.commands.executeCommand('notimetowaste.reset');
				case 'select': return this.store.select(msg.id);
			}
		});
		view.onDidChangeVisibility(() => view.visible && this.refresh());
	}

	refresh(): void {
		void this.view?.webview.postMessage({ type: 'state', state: buildViewState(this.store) });
	}

	/** Send a one-off event (e.g. celebration) to the webview. */
	post(message: unknown): void {
		void this.view?.webview.postMessage(message);
	}

	private html(webview: vscode.Webview, media: vscode.Uri): string {
		const nonce = Array.from({ length: 32 }, () => Math.floor(Math.random() * 36).toString(36)).join('');
		const css = webview.asWebviewUri(vscode.Uri.joinPath(media, 'sidebar.css'));
		const js = webview.asWebviewUri(vscode.Uri.joinPath(media, 'sidebar.js'));
		return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="${css}">
</head>
<body>
	<div class="levels">
		<div class="level-card" title="Level of this workspace">
			<span id="sBadge" class="badge">🌱</span>
			<div>
				<div class="level-scope">Session · <span id="sessionName"></span></div>
				<div class="level-name">Lv <span id="sNum">1</span> · <span id="sName"></span></div>
				<div class="level-count"><span id="sessionTotal">0</span> adhkar</div>
			</div>
		</div>
		<div class="level-card" title="Level across all workspaces">
			<span id="gBadge" class="badge">🌱</span>
			<div>
				<div class="level-scope">Overall</div>
				<div class="level-name">Lv <span id="gNum">1</span> · <span id="gName"></span></div>
				<div class="level-count"><span id="globalTotal">0</span> adhkar</div>
			</div>
		</div>
	</div>

	<select id="zikr" aria-label="Choose zikr"></select>
	<div id="text" class="zikr-text" dir="rtl" lang="ar"></div>
	<div id="subtext" class="zikr-subtext"></div>

	<button id="tap" class="tap" aria-label="Count">
		<span id="round" class="tap-count">0</span>
		<span id="target" class="tap-target">/ 33</span>
	</button>

	<button id="reset" class="link">↺ Reset round</button>

	<section class="progress">
		<div class="bar-label"><span>📅 Today</span><span id="todayLabel"></span></div>
		<div class="bar" role="progressbar" aria-label="Today"><div id="todayBar" class="fill"></div></div>
		<div id="todayHint" class="bar-hint"></div>

		<div class="bar-label"><span>🗂️ Session level</span><span id="sLabel"></span></div>
		<div class="bar" role="progressbar" aria-label="Session level"><div id="sBar" class="fill"></div></div>

		<div class="bar-label"><span>🌍 Overall level</span><span id="gLabel"></span></div>
		<div class="bar" role="progressbar" aria-label="Overall level"><div id="gBar" class="fill"></div></div>
	</section>
	<div id="toast" class="toast" role="status" aria-live="polite"></div>

	<script nonce="${nonce}" src="${js}"></script>
</body>
</html>`;
	}
}
