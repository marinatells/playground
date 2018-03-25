
import $ from 'jquery';

var output = {};
var console = window.console;

// Extend
'error info warn assert'.split(' ').forEach(function (name) {
	output[name] = function () {
		return console[name].apply(console, arguments);
	};
});


output.append = function (el, attrs) {
	if (typeof el == 'string') {
		el = document.createElement(el);

		if(attrs) {
			$.extend(el, attrs);
		}
	}

	this.el.appendChild(el);
	return el;
};


output.clear = function () {
	this.el.innerHTML = '';
};


output.log = function () {
	var text = $.map(arguments, function (val) {
		return val && val.nodeType
			? ('&lt;' + val.nodeName.toLowerCase() + '/&gt;')
			: (val === void 0
				? "undefined"
				: JSON.stringify(val)
			)
		;
	}).join(' ');

	this.append('div', { innerText: text, className: 'log' });
	console.log.apply(console, arguments);
};


output.error = function (msg) {
	this.append('div', { innerText: msg, className: 'log' }).style.color = 'red';
};


output.htmlBlock = function (el) {
	this.append(el);
};


// Export
export default output;

