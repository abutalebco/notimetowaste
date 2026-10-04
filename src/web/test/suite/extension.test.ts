import * as assert from 'assert';
import { LEVELS, levelIndex, levelInfo } from '../../levels';
import { computeStats, dailyAverage, dailyGoal, DEFAULT_DAILY_GOAL } from '../../stats';

suite('Levels', () => {
	test('thresholds map to the right level', () => {
		assert.strictEqual(levelIndex(0), 0);
		assert.strictEqual(levelIndex(32), 0);
		assert.strictEqual(levelIndex(33), 1);
		assert.strictEqual(levelIndex(999), 3);
		assert.strictEqual(levelIndex(10_000_000), LEVELS.length - 1);
	});

	test('progress and remaining count', () => {
		const info = levelInfo(66); // Sprout 33 -> Blossom 100
		assert.strictEqual(info.name, 'Sprout');
		assert.strictEqual(info.toNext, 34);
		assert.ok(Math.abs(info.progress - 33 / 67) < 1e-9);
		const max = levelInfo(LEVELS[LEVELS.length - 1].min);
		assert.strictEqual(max.progress, 1);
		assert.strictEqual(max.toNext, 0);
	});
});

suite('Stats', () => {
	test('daily goal falls back without history', () => {
		assert.strictEqual(dailyAverage({}, '2026-10-04'), 0);
		assert.strictEqual(dailyGoal({ '2026-10-04': 500 }), DEFAULT_DAILY_GOAL);
	});

	test('average counts empty days and excludes today', () => {
		const daily = { '2026-10-01': 300, '2026-10-03': 300, '2026-10-04': 9999 };
		assert.strictEqual(dailyAverage(daily, '2026-10-04'), 200); // 600 over 3 days
	});

	test('streaks and last 7 days', () => {
		const now = new Date(2026, 9, 4); // 4 Oct 2026, local time
		const daily = { '2026-09-28': 10, '2026-09-29': 10, '2026-09-30': 10, '2026-10-02': 5, '2026-10-03': 5 };
		const s = computeStats(daily, { a: 3, b: 7 }, { w1: { name: 'A', total: 5 } }, 'w1', now);
		assert.strictEqual(s.currentStreak, 2); // today empty -> counts from yesterday
		assert.strictEqual(s.bestStreak, 3);
		assert.strictEqual(s.last7.length, 7);
		assert.strictEqual(s.last7[6].isToday, true);
		assert.deepStrictEqual(s.topAdhkar.map(t => t.id), ['b', 'a']);
		assert.strictEqual(s.sessions[0].current, true);
	});
});
