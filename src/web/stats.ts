import { todayKey } from './store';

/** Fallback daily goal before there is any history. */
export const DEFAULT_DAILY_GOAL = 100;

function dayDiff(a: string, b: string): number {
	const [ay, am, ad] = a.split('-').map(Number);
	const [by, bm, bd] = b.split('-').map(Number);
	return Math.round((Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad)) / 86_400_000);
}

/**
 * Mean adhkar per day, from the first recorded day up to *yesterday*
 * (days with zero count included). Today is excluded so the goal stays
 * fixed for the whole day. Returns 0 when there is no past history.
 */
export function dailyAverage(daily: Record<string, number>, today = todayKey()): number {
	const past = Object.keys(daily).filter(d => d < today).sort();
	if (!past.length) {
		return 0;
	}
	const days = dayDiff(past[0], today);
	const sum = past.reduce((acc, d) => acc + daily[d], 0);
	return sum / days;
}

/** Today's target: the user's own daily average (at least 33), or the default. */
export function dailyGoal(daily: Record<string, number>): number {
	const avg = dailyAverage(daily);
	return avg > 0 ? Math.max(33, Math.round(avg)) : DEFAULT_DAILY_GOAL;
}

export interface Stats {
	average: number;
	activeDays: number;
	currentStreak: number;
	bestStreak: number;
	bestDay: { date: string; count: number } | undefined;
	last7: { label: string; count: number; isToday: boolean }[];
	topAdhkar: { id: string; count: number }[];
	sessions: { name: string; total: number; current: boolean }[];
}

function addDays(d: Date, n: number): Date {
	const x = new Date(d);
	x.setDate(x.getDate() + n);
	return x;
}

export function computeStats(
	daily: Record<string, number>,
	counts: Record<string, number>,
	sessions: Record<string, { name: string; total: number }>,
	currentSessionId: string,
	now = new Date(),
): Stats {
	const active = Object.keys(daily).filter(d => daily[d] > 0).sort();

	// Current streak: consecutive active days ending today (or yesterday if today is still empty).
	let currentStreak = 0;
	let cursor = daily[todayKey(now)] ? now : addDays(now, -1);
	while (daily[todayKey(cursor)]) {
		currentStreak++;
		cursor = addDays(cursor, -1);
	}

	let bestStreak = 0;
	let run = 0;
	let prev: string | undefined;
	for (const d of active) {
		run = prev && dayDiff(prev, d) === 1 ? run + 1 : 1;
		bestStreak = Math.max(bestStreak, run);
		prev = d;
	}

	let bestDay: Stats['bestDay'];
	for (const d of active) {
		if (!bestDay || daily[d] > bestDay.count) {
			bestDay = { date: d, count: daily[d] };
		}
	}

	const last7: Stats['last7'] = [];
	for (let i = 6; i >= 0; i--) {
		const day = addDays(now, -i);
		last7.push({
			label: day.toLocaleDateString(undefined, { weekday: 'short' }),
			count: daily[todayKey(day)] ?? 0,
			isToday: i === 0,
		});
	}

	return {
		average: dailyAverage(daily),
		activeDays: active.length,
		currentStreak,
		bestStreak,
		bestDay,
		last7,
		topAdhkar: Object.entries(counts)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 3)
			.map(([id, count]) => ({ id, count })),
		sessions: Object.entries(sessions)
			.filter(([, s]) => s.total > 0)
			.sort((a, b) => b[1].total - a[1].total)
			.slice(0, 5)
			.map(([id, s]) => ({ name: s.name, total: s.total, current: id === currentSessionId })),
	};
}
