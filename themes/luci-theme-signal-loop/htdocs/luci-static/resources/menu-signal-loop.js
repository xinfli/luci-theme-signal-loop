/*
 * luci-theme-signal-loop
 * Main menu / mode menu / tab menu renderer.
 *
 * Derived from the official LuCI Bootstrap theme (luci-theme-bootstrap),
 * licensed under the Apache License 2.0.
 *
 * In addition to the official renderer, the current top-level menu entry and
 * the current submenu entry receive an `active` class so the DD-WRT inspired
 * blue/orange navigation can highlight them. Dropdown buttons are also handled
 * explicitly so that a touch tap only opens the menu instead of following the
 * first entry that appears underneath the finger.
 */
'use strict';
'require baseclass';
'require ui';

return baseclass.extend({
	__init__() {
		ui.menu.load().then((tree) => this.render(tree));
		document.addEventListener('click', L.bind(this.handleMenuClick, this));
	},

	/* On touch screens a tap on a dropdown button must only open the menu.
	 * Without this handler the browser applies the CSS hover state first, the
	 * menu appears under the finger and the same tap activates its first item. */
	handleMenuClick(ev) {
		const topmenu = document.querySelector('#topmenu');

		if (!topmenu)
			return;

		const toggle = ev.target.closest ? ev.target.closest('#topmenu a.menu') : null;

		if (toggle) {
			ev.preventDefault();
			ev.stopPropagation();

			const item = toggle.parentNode;
			const open = item.classList.contains('open');

			topmenu.querySelectorAll('li.dropdown.open').forEach(li => li.classList.remove('open'));

			if (!open)
				item.classList.add('open');

			return;
		}

		if (!ev.target.closest || !ev.target.closest('#topmenu .dropdown-menu'))
			topmenu.querySelectorAll('li.dropdown.open').forEach(li => li.classList.remove('open'));
	},

	render(tree) {
		let node = tree;
		let url = '';

		this.renderModeMenu(tree);

		if (L.env.dispatchpath.length >= 3) {
			for (var i = 0; i < 3 && node; i++) {
				node = node.children[L.env.dispatchpath[i]];
				url = url + (url ? '/' : '') + L.env.dispatchpath[i];
			}

			if (node)
				this.renderTabMenu(node, url);
		}
	},

	renderMainMenu(tree, url, level) {
		const l = (level || 0) + 1;
		const ul = l == 1 ? document.querySelector('#topmenu')
			: E('ul', { 'class': 'dropdown-menu' });
		const children = ui.menu.getChildren(tree);

		if (children.length == 0 || l > 2)
			return E([]);

		children.forEach(child => {
			const isActive = (L.env.dispatchpath[l] == child.name);
			const submenu = this.renderMainMenu(child, url + '/' + child.name, l);
			const subclass = [];

			if (!level && submenu.firstElementChild)
				subclass.push('dropdown');
			if (isActive)
				subclass.push('active');

			const linkclass = (!level && submenu.firstElementChild) ? 'menu' : '';
			const linkurl = submenu.firstElementChild ? '#' : L.url(url, child.name);

			const li = E('li', { 'class': subclass.join(' ') }, [
				E('a', { 'class': linkclass, 'href': linkurl }, [
					_(child.title),
				]),
				submenu
			]);

			ul.appendChild(li);
		});

		ul.style.display = '';

		return ul;
	},

	renderTabMenu(tree, url, level) {
		const container = document.querySelector('#tabmenu');
		const ul = E('ul', { 'class': 'tabs' });
		const children = ui.menu.getChildren(tree);
		let activeNode = null;

		children.forEach(child => {
			const isActive = (L.env.dispatchpath[3 + (level || 0)] == child.name);
			const activeClass = isActive ? ' active' : '';
			const className = 'tabmenu-item-%s %s'.format(child.name, activeClass);

			ul.appendChild(E('li', { 'class': className }, [
				E('a', { 'href': L.url(url, child.name) }, [ _(child.title) ] )]));

			if (isActive)
				activeNode = child;
		});

		if (ul.children.length == 0)
			return E([]);

		container.appendChild(ul);
		container.style.display = '';

		if (activeNode)
			this.renderTabMenu(activeNode, url + '/' + activeNode.name, (level || 0) + 1);

		return ul;
	},

	renderModeMenu(tree) {
		const ul = document.querySelector('#modemenu');
		const children = ui.menu.getChildren(tree);

		children.forEach((child, index) => {
			const isActive = L.env.requestpath.length
				? child.name === L.env.requestpath[0]
				: index === 0;

			ul.appendChild(E('li', { 'class': isActive ? 'active' : '' }, [
				E('a', { 'href': L.url(child.name) }, [ _(child.title) ])
			]));

			if (isActive)
				this.renderMainMenu(child, child.name);
		});

		if (ul.children.length > 1)
			ul.style.display = '';
	}
});
