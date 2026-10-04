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
