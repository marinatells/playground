
'use strict';

import $ from 'jquery';

// brace is wrapper around ace to work with webpack
import * as ace from 'brace';
// include theme in bundle
import 'brace/theme/monokai';
import 'brace/mode/javascript';

import output from './output';
import Sandbox from './sandbox';
import debounce from './debounce';
import email from './email';
import fb from './fb';


/**
 * @class App
 * @param {Object}  opts
 */
function App(opts) {
	output.el = $(opts.idOutput)[0];

	this.key = 'app';
	this.editor = this.initEditor(opts.idEditor);
	this.output = output;
	this.sandbox = new Sandbox();

	this.restore();

	email.onclick = function () {
		email.set(null, this.getCode())
			.then((codeRef) => {
				let hash = codeRef.split('/').pop();
				this.setHash(hash);
				this.save();
			});
	}.bind(this);
}


App.prototype = /** @lends App.prototype */ {
	initEditor: function (id) {
		var editor = ace.edit(id.substr(1));

		editor.setTheme('ace/theme/monokai');
		editor.getSession().setMode('ace/mode/javascript');

		editor.on('change', debounce(function () {
			console.clear();

			this.save();
			this.exec(this.getCode());
		}.bind(this), 500));

		return editor;
	},

	setHash: function (hash) {
		location.hash = hash;
	},

	exec: function (code) {
		this.output.clear();
		this.sandbox.set(code, this.html);
	},

	setCode: function (code, html) {
		this.html = html;

		this.editor.setValue(code);
		this.editor.clearSelection();
		this.editor.moveCursorTo(0, 0);
		this.editor.focus();
	},

	getCode: function () {
		return this.editor.getValue();
	},

	getKey: function () {
		return (location.hash.length ? location.hash.slice(1) : null) || this.key;
	},

	restore: function () {
		fb.get(this.getKey()).then((data) => {
			this.setCode(data.code || '');
		}, () => {
			this.setCode(localStorage.getItem(this.getKey()) || '');
		});
	},

	save: function () {
		localStorage.setItem(this.getKey(), this.getCode());
	}
};


export default App;