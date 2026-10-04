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
			case 'levelUp':
				toast(`${msg.badge} Level ${msg.number} · ${msg.name} ${msg.scope === 'session' ? '(session)' : '(overall)'}`);
				break;
		}
	});

	vscode.postMessage({ type: 'ready' });
})();
