// @ts-check
(function () {
	// @ts-ignore acquireVsCodeApi is injected by VS Code
	const vscode = acquireVsCodeApi();
	const $ = (/** @type {string} */ id) => /** @type {HTMLElement} */ (document.getElementById(id));

	const select = /** @type {HTMLSelectElement} */ ($('zikr'));
	let optionsKey = '';

	/** @param {any} s */
	function render(s) {
		const key = s.adhkar.map((/** @type {any} */ z) => z.id + z.label).join('|');
		if (key !== optionsKey) {
			optionsKey = key;
			select.innerHTML = '';
			for (const z of s.adhkar) {
				const o = document.createElement('option');
				o.value = z.id;
				o.textContent = z.label;
				select.appendChild(o);
			}
		}
		select.value = s.selected;
		$('text').textContent = s.text;
		$('subtext').textContent = s.subtext;
		$('subtext').hidden = !s.subtext;
		$('round').textContent = String(s.round);
		$('target').textContent = '/ ' + s.target;
		$('sessionName').textContent = s.sessionName;
		$('sessionTotal').textContent = s.sessionTotal.toLocaleString();
		$('globalTotal').textContent = s.globalTotal.toLocaleString();
		renderLevel('s', s.sessionLevel);
		renderLevel('g', s.globalLevel);
		applyTheme(s.globalLevel);
		renderBars(s);
		renderStats(s.stats);
	}

	/** @param {HTMLElement} el @param {string[]} items */
	function fillList(el, items) {
		el.innerHTML = '';
		for (const text of items) {
			const li = document.createElement('li');
			li.textContent = text;
			el.appendChild(li);
		}
		if (!items.length) {
			const li = document.createElement('li');
			li.className = 'empty';
			li.textContent = '—';
			el.appendChild(li);
		}
	}

	/** @param {any} st */
	function renderStats(st) {
		$('stStreak').textContent = String(st.currentStreak);
		$('stBest').textContent = String(st.bestStreak);
		$('stAvg').textContent = Math.round(st.average).toLocaleString();
		$('stDays').textContent = String(st.activeDays);
		$('stBestDay').textContent = st.bestDay
			? `⭐ Best day: ${st.bestDay.count.toLocaleString()} on ${st.bestDay.date}`
			: '';

		const chart = $('chart');
		chart.innerHTML = '';
		const max = Math.max(1, ...st.last7.map((/** @type {any} */ d) => d.count));
		for (const d of st.last7) {
			const col = document.createElement('div');
			col.className = 'col' + (d.isToday ? ' today' : '');
			col.title = `${d.label}: ${d.count}`;
			const val = document.createElement('span');
			val.className = 'val';
			val.textContent = d.count ? String(d.count) : '';
			const bar = document.createElement('div');
			bar.className = 'colbar';
			bar.style.height = Math.max(2, (d.count / max) * 60) + 'px';
			const lab = document.createElement('span');
			lab.className = 'lab';
			lab.textContent = d.label;
			col.append(val, bar, lab);
			chart.appendChild(col);
		}

		fillList($('stTop'), st.topAdhkar.map((/** @type {any} */ t, /** @type {number} */ i) =>
			`${st.topLabels[i]} — ${t.count.toLocaleString()}`));
		fillList($('stSessions'), st.sessions.map((/** @type {any} */ x) =>
			`${x.current ? '👉 ' : ''}${x.name} — ${x.total.toLocaleString()}`));
	}

	const stats = /** @type {HTMLDetailsElement} */ ($('stats'));
	stats.open = !!(vscode.getState() || {}).statsOpen;
	stats.addEventListener('toggle', () => vscode.setState({ ...(vscode.getState() || {}), statsOpen: stats.open }));

	/** @param {string} id @param {number} ratio */
	function setBar(id, ratio) {
		const pct = Math.max(0, Math.min(1, ratio)) * 100;
		const el = $(id);
		el.style.width = pct.toFixed(1) + '%';
		/** @type {HTMLElement} */ (el.parentElement).setAttribute('aria-valuenow', String(Math.round(pct)));
	}

	/** @param {any} lvl */
	function levelLabel(lvl) {
		return lvl.next ? `${lvl.toNext.toLocaleString()} to ${lvl.next.badge} ${lvl.next.name}` : 'Max level 🎉';
	}

	/** @param {any} s */
	function renderBars(s) {
		setBar('todayBar', s.today / s.dailyGoal);
		$('todayLabel').textContent = `${s.today.toLocaleString()} / ${s.dailyGoal.toLocaleString()}`;
		$('todayBar').classList.toggle('done', s.today >= s.dailyGoal);
		$('todayHint').textContent = s.hasHistory
			? (s.today >= s.dailyGoal ? 'You beat your daily average! 🔥' : 'Goal = your daily average')
			: 'Starter goal — it adapts to your daily average';
		setBar('sBar', s.sessionLevel.progress);
		$('sLabel').textContent = levelLabel(s.sessionLevel);
		setBar('gBar', s.globalLevel.progress);
		$('gLabel').textContent = levelLabel(s.globalLevel);
	}

	/** @param {string} p @param {any} lvl */
	function renderLevel(p, lvl) {
		$(p + 'Badge').textContent = lvl.badge;
		$(p + 'Num').textContent = String(lvl.number);
		$(p + 'Name').textContent = lvl.name;
	}

	let themeLevel = 0;
	/** The overall level drives the whole panel's colours. */
	function applyTheme(/** @type {any} */ lvl) {
		const root = document.documentElement.style;
		root.setProperty('--primary', lvl.primary);
		root.setProperty('--primary-dark', lvl.dark);
		root.setProperty('--accent', lvl.accent);
		if (themeLevel && lvl.number > themeLevel) {
			document.body.classList.remove('level-up');
			void document.body.offsetWidth;
			document.body.classList.add('level-up');
		}
		themeLevel = lvl.number;
	}

	let toastTimer = 0;
	/** @param {string} text */
	function toast(text) {
		const t = $('toast');
		t.textContent = text;
		t.classList.add('show');
		clearTimeout(toastTimer);
		toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
	}

	function pulse() {
		const tap = $('tap');
		tap.classList.remove('pulse');
		void tap.offsetWidth; // restart animation
		tap.classList.add('pulse');
	}

	$('tap').addEventListener('click', () => { pulse(); vscode.postMessage({ type: 'increment' }); });
	$('reset').addEventListener('click', () => vscode.postMessage({ type: 'reset' }));
	select.addEventListener('change', () => vscode.postMessage({ type: 'select', id: select.value }));

	window.addEventListener('message', e => {
		const msg = e.data;
		switch (msg.type) {
			case 'state': render(msg.state); break;
			case 'roundComplete': toast('✨ Round complete — بارك الله فيك'); break;
			case 'dailyGoal': toast('🎯 Daily goal reached — keep going!'); break;
			case 'levelUp':
				toast(`${msg.badge} Level ${msg.number} · ${msg.name} ${msg.scope === 'session' ? '(session)' : '(overall)'}`);
				break;
		}
	});

	vscode.postMessage({ type: 'ready' });
})();
