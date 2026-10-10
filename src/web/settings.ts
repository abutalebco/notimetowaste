import * as vscode from 'vscode';
import { dailyGoal } from './stats';
import { Zikr } from './zikr';

export type Language = 'arabic' | 'arabic-transliteration' | 'arabic-english' | 'english';

function cfg() {
	return vscode.workspace.getConfiguration('Sabha');
}

export const settings = {
	get language(): Language {
		return cfg().get<Language>('language', 'arabic');
	},
	/** 0 = automatic (your daily average). */
	get fixedDailyGoal(): number {
		return Math.max(0, Math.floor(cfg().get<number>('dailyGoal', 0)));
	},
	get showStatusBar(): boolean {
		return cfg().get<boolean>('showStatusBar', true);
	},
	get notifications(): boolean {
		return cfg().get<boolean>('notifications', true);
	},
};

/** Today's goal honouring the fixed-goal setting. */
export function currentDailyGoal(daily: Record<string, number>): number {
	return settings.fixedDailyGoal || dailyGoal(daily);
}

/** How a zikr is displayed for the chosen language. */
export function display(z: Zikr, lang = settings.language): { label: string; text: string; subtext: string; rtl: boolean } {
	switch (lang) {
		case 'arabic-transliteration': return { label: z.ar, text: z.ar, subtext: z.translit, rtl: true };
		case 'arabic-english': return { label: z.ar, text: z.ar, subtext: z.en, rtl: true };
		case 'english': return { label: z.translit, text: z.translit, subtext: z.en, rtl: false };
		default: return { label: z.ar, text: z.ar, subtext: '', rtl: true };
	}
}
