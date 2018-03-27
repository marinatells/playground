
import $ from 'jquery';
import hljs from 'highlight.js/lib/index';

import output from './output';
import simulateEvent from './simulateEvent';



var Sandbox = function (silent) {
	this.silent = silent;
	this.htmlMode = false;
};


Sandbox.prototype = {
	reset: function (parent) {
		if (this.el && this.el.parentNode) {
			this.el.parentNode.removeChild(this.el);
		}

		var sandbox = (this.el = document.createElement('iframe'));

		parent = parent || document.body;

		parent.appendChild(sandbox);
		parent.appendChild($('<a class="showHtml"></a>')[0]);


		this.window = sandbox.contentWindow;
		this.document = this.window.document;

		this.$ = this.window.$ = function (selector) {
			return $(selector, this.document);
		};

		this.window.simulateEvent = simulateEvent;
		this.window.console = $.extend({}, output, this.silent ? { log: $.noop } : {});
		this.window.isolate = this.isolate.bind(this);
		this.window.triggerError = this.triggerError.bind(this);

		this.btn = this.el.nextSibling;
		this.btn.addEventListener('click', this.toggleHtml.bind(this, void 0));

		this.toggleHtml(this.htmlMode);
	},

	toggleHtml: function (state) {
		state = (state === void 0) ? !this.htmlMode : state;
		this.htmlMode = state;

		this.btn.innerText = state ? 'Hide HTML' : 'Show HTML';
		this.$html && this.$html.remove();

		if (state) {
			this.$html = $('<pre class="html"><code class="html"></code></pre>')
				.insertBefore(this.el)
				.find('code')
					.text(this.html.replace(/<style[\s\S]+<\/style>/g, '').trim())
					.end()
			;

			hljs.highlightBlock(this.$html.find('code')[0])
		}
	},

	triggerError: function (msg, file, line, column, err) {
		output.error(msg + '\n' + err.stack.split('\n').slice(0, -4).join('\n'));
	},

	isolate: function (callback) {
		var sandbox = new Sandbox(true);
		sandbox.set(this.code, this.html);
		sandbox.eval(callback.toString()+'()');
		return sandbox;
	},

	set: function (code, html) {
		this.reset(!this.silent && html && output.el);

		this.code = code;
		this.html = html;


		try {
			var document = this.document,
				loops = []
			;

			code = code.replace(/\b(for|while)\s*\(.*?\)\s*\{/g, function (begin) {
				var loop = '___loop' + loops.length;
				loops.push(loop);
				return begin + ' if (' + loop + '++ > 1500) throw "Infinite loop!";';
			});

			document.open();

			// Вставляем HTML
			html && document.write(html);

			// Определяем переменные для цикла
			loops.length && document.write('<script>var ' + loops.join(' = 0, ') + ' = 0;</script>');

			// Перехватываем ошибки
			document.write('<script>window.onerror = function () { ' +
				(this.silent ? 'return true' : 'window.triggerError.apply({}, arguments)') +
			'; };</script>');

			// Публикуем код
			document.write('<script>' + code + '</script>');

			document.close();
		} catch (err) {}
	},

	eval: function (code) {
		try {
			this.window.__result = null;
			this.window.eval('window.__result = (' + code.trim().replace(/;+$/, '') + ')');
		} catch (err) {
//				console.log('eval:', code, err);
		}
	},

	getResult: function () {
		return this.window.__result;
	}
};


export default Sandbox;

