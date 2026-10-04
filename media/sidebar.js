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
		if (msg.type === 'state') { render(msg.state); }
	});

	vscode.postMessage({ type: 'ready' });
})();
