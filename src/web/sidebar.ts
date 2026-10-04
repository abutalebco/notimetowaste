import * as vscode from 'vscode';
import { LevelInfo, levelInfo } from './levels';
import { currentDailyGoal, display, settings } from './settings';
import { computeStats, dailyAverage, Stats } from './stats';
import { Store } from './store';
import { ADHKAR, getZikr } from './zikr';

/** Everything the webview needs to render, sent on every change. */
export interface ViewState {
	adhkar: { id: string; label: string }[];
	selected: string;
	text: string;
	subtext: string;
	rtl: boolean;
	round: number;
	target: number;
	sessionName: string;
	sessionTotal: number;
	globalTotal: number;
	today: number;
	dailyGoal: number;
	goalMode: 'auto' | 'fixed';
	hasHistory: boolean;
	sessionLevel: LevelInfo;
	globalLevel: LevelInfo;
	stats: Stats & { topLabels: string[] };
}

export function buildViewState(store: Store): ViewState {
	const g = store.global;
	const s = store.session;
	const zikr = getZikr(g.selectedZikr);
	const lang = settings.language;
	const shown = display(zikr, lang);
	const stats = computeStats(g.daily, g.counts, g.sessions, store.sessionId);
	return {
		adhkar: ADHKAR.map(z => ({ id: z.id, label: display(z, lang).label })),
		selected: zikr.id,
		text: shown.text,
		subtext: shown.subtext,
		rtl: shown.rtl,
		round: store.round.count,
		target: zikr.target,
		sessionName: s.name,
		sessionTotal: s.total,
		globalTotal: g.total,
		today: store.today,
		dailyGoal: currentDailyGoal(g.daily),
		goalMode: settings.fixedDailyGoal ? 'fixed' : 'auto',
		hasHistory: dailyAverage(g.daily) > 0,
		sessionLevel: levelInfo(s.total),
		globalLevel: levelInfo(g.total),
		stats: { ...stats, topLabels: stats.topAdhkar.map(t => display(getZikr(t.id), lang).label) },
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
		vscode.workspace.onDidChangeConfiguration(e => e.affectsConfiguration('notimetowaste') && this.refresh());
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

	<details class="stats" id="stats">
		<summary>📊 Statistics</summary>
		<div class="tiles">
			<div class="tile"><b id="stStreak">0</b><span>🔥 Day streak</span></div>
			<div class="tile"><b id="stBest">0</b><span>🏆 Best streak</span></div>
			<div class="tile"><b id="stAvg">0</b><span>📈 Daily average</span></div>
			<div class="tile"><b id="stDays">0</b><span>📆 Active days</span></div>
		</div>
		<div id="stBestDay" class="stat-line"></div>
		<h4>Last 7 days</h4>
		<div id="chart" class="chart"></div>
		<h4>Most recited</h4>
		<ol id="stTop" class="stat-list" dir="rtl"></ol>
		<h4>Top sessions</h4>
		<ol id="stSessions" class="stat-list"></ol>
	</details>
	<div id="toast" class="toast" role="status" aria-live="polite"></div>

	<script nonce="${nonce}" src="${js}"></script>
</body>
</html>`;
	}
}
