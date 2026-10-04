/**
 * Duolingo-style levels. Each level has its own badge and colour theme.
 * Thresholds follow the tasbih numbers 33 / 100 / 333 ...
 */
export interface Level {
	min: number;
	name: string;
	badge: string;
	/** Main button / bar colour. */
	primary: string;
	/** Darker shade used for the 3D button edge. */
	dark: string;
	/** Text colour on top of `primary`. */
	accent: string;
}

export const LEVELS: readonly Level[] = [
	{ min: 0, name: 'Seed', badge: '🌱', primary: '#58cc02', dark: '#46a302', accent: '#ffffff' },
	{ min: 33, name: 'Sprout', badge: '🌿', primary: '#1cb0f6', dark: '#1899d6', accent: '#ffffff' },
	{ min: 100, name: 'Blossom', badge: '🌸', primary: '#ff86d0', dark: '#d961ad', accent: '#ffffff' },
	{ min: 333, name: 'Flame', badge: '🔥', primary: '#ff9600', dark: '#d97f00', accent: '#ffffff' },
	{ min: 1000, name: 'Star', badge: '⭐', primary: '#ffc800', dark: '#d9a600', accent: '#4b3b00' },
	{ min: 3333, name: 'Moon', badge: '🌙', primary: '#ce82ff', dark: '#a560d6', accent: '#ffffff' },
	{ min: 10000, name: 'Diamond', badge: '💎', primary: '#00cd9c', dark: '#00a57e', accent: '#ffffff' },
	{ min: 33333, name: 'Lantern', badge: '🏮', primary: '#ff4b4b', dark: '#d63131', accent: '#ffffff' },
	{ min: 100000, name: 'Crown', badge: '👑', primary: '#ffd900', dark: '#c79a00', accent: '#3c2a00' },
	{ min: 333333, name: 'Legend', badge: '🕌', primary: '#2b4acb', dark: '#1c3399', accent: '#ffd900' },
];

export interface LevelInfo extends Level {
	/** 1-based level number. */
	number: number;
	next?: Level;
	/** 0..1 progress towards the next level (1 at max level). */
	progress: number;
	/** Remaining count to reach the next level (0 at max level). */
	toNext: number;
}

export function levelIndex(total: number): number {
	let i = 0;
	while (i + 1 < LEVELS.length && total >= LEVELS[i + 1].min) {
		i++;
	}
	return i;
}

export function levelInfo(total: number): LevelInfo {
	const i = levelIndex(total);
	const level = LEVELS[i];
	const next = LEVELS[i + 1];
	const progress = next ? (total - level.min) / (next.min - level.min) : 1;
	return {
		...level,
		number: i + 1,
		next,
		progress,
		toNext: next ? next.min - total : 0,
	};
}
