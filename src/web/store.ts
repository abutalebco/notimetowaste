import * as vscode from 'vscode';
import { DEFAULT_ZIKR_ID, getZikr } from './zikr';

/** Progress of the current VS Code workspace (a "session"). */
export interface SessionData {
	name: string;
	total: number;
	counts: Record<string, number>;
	createdAt: number;
}

/** Lifetime progress across every workspace. */
export interface GlobalData {
	total: number;
	counts: Record<string, number>;
	/** Local date `YYYY-MM-DD` -> number of adhkar that day. */
	daily: Record<string, number>;
	/** Mirror of each session's name/total, keyed by workspace id, for statistics. */
	sessions: Record<string, { name: string; total: number }>;
	selectedZikr: string;
}

/** The current tally round (resets when the round target is reached or on reset). */
export interface RoundData {
	zikrId: string;
	count: number;
}

export interface IncrementResult {
	roundCompleted: boolean;
	prevSessionTotal: number;
	prevGlobalTotal: number;
}

const SESSION_KEY = 'ntw.session';
const ROUND_KEY = 'ntw.round';
const GLOBAL_KEY = 'ntw.global';

export function todayKey(d = new Date()): string {
	const pad = (n: number) => String(n).padStart(2, '0');
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function workspaceId(): string {
	const file = vscode.workspace.workspaceFile;
	if (file && file.scheme !== 'untitled') {
		return file.toString();
	}
	return vscode.workspace.workspaceFolders?.[0]?.uri.toString() ?? 'no-workspace';
}

function workspaceName(): string {
	return vscode.workspace.name ?? 'No folder';
}

export class Store {
	private readonly emitter = new vscode.EventEmitter<void>();
	readonly onDidChange = this.emitter.event;
	readonly sessionId = workspaceId();

	constructor(private readonly ctx: vscode.ExtensionContext) {
		// Sync the sessions mirror so a rename of the folder is reflected in stats.
		const g = this.global;
		const s = this.session;
		g.sessions[this.sessionId] = { name: s.name, total: s.total };
		void this.ctx.globalState.update(GLOBAL_KEY, g);
	}

	get session(): SessionData {
		const s = this.ctx.workspaceState.get<SessionData>(SESSION_KEY);
		return s
			? { ...s, name: workspaceName(), counts: { ...s.counts } }
			: { name: workspaceName(), total: 0, counts: {}, createdAt: Date.now() };
	}

	get global(): GlobalData {
		const g = this.ctx.globalState.get<GlobalData>(GLOBAL_KEY);
		return {
			total: g?.total ?? 0,
			counts: { ...g?.counts },
			daily: { ...g?.daily },
			sessions: { ...g?.sessions },
			selectedZikr: g?.selectedZikr ?? DEFAULT_ZIKR_ID,
		};
	}

	get round(): RoundData {
		const r = this.ctx.workspaceState.get<RoundData>(ROUND_KEY);
		const zikrId = this.global.selectedZikr;
		return r && r.zikrId === zikrId ? r : { zikrId, count: 0 };
	}

	get today(): number {
		return this.global.daily[todayKey()] ?? 0;
	}

	async select(zikrId: string): Promise<void> {
		const g = this.global;
		g.selectedZikr = getZikr(zikrId).id;
		await this.ctx.globalState.update(GLOBAL_KEY, g);
		await this.ctx.workspaceState.update(ROUND_KEY, { zikrId: g.selectedZikr, count: 0 });
		this.emitter.fire();
	}

	async increment(by = 1): Promise<IncrementResult> {
		const g = this.global;
		const s = this.session;
		const zikr = getZikr(g.selectedZikr);
		const round = this.round;
		const result: IncrementResult = {
			roundCompleted: false,
			prevSessionTotal: s.total,
			prevGlobalTotal: g.total,
		};

		s.total += by;
		s.counts[zikr.id] = (s.counts[zikr.id] ?? 0) + by;

		g.total += by;
		g.counts[zikr.id] = (g.counts[zikr.id] ?? 0) + by;
		const day = todayKey();
		g.daily[day] = (g.daily[day] ?? 0) + by;
		g.sessions[this.sessionId] = { name: s.name, total: s.total };

		round.count += by;
		if (round.count >= zikr.target) {
			result.roundCompleted = true;
			round.count = 0;
		}

		await Promise.all([
			this.ctx.workspaceState.update(SESSION_KEY, s),
			this.ctx.workspaceState.update(ROUND_KEY, round),
			this.ctx.globalState.update(GLOBAL_KEY, g),
		]);
		this.emitter.fire();
		return result;
	}

	/** Resets only the current round; lifetime progress is never lost. */
	async resetRound(): Promise<void> {
		await this.ctx.workspaceState.update(ROUND_KEY, { zikrId: this.global.selectedZikr, count: 0 });
		this.emitter.fire();
	}

	dispose(): void {
		this.emitter.dispose();
	}
}
