
var defaultOptions = {
	x: 0,
	y: 0,
	button: 0,
	ctrlKey: false,
	altKey: false,
	shiftKey: false,
	metaKey: false,
	bubbles: true,
	cancelable: true
};


var eventMatchers = {
	'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|input|keydown|keyup|blur|resize|scroll)$/,
	'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
};


// Export
export default function (element, eventName, opts) {
	var options = $.extend({}, defaultOptions, opts || {});
	var oEvent, eventType = null;

	for (var name in eventMatchers) {
		if (eventMatchers[name].test(eventName)) {
			eventType = name;
			break;
		}
	}

	if (!eventType) {
		throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');
	}

	if (document.createEvent) {
		oEvent = document.createEvent(eventType);
		if (eventType == 'HTMLEvents') {
			oEvent.initEvent(eventName, options.bubbles, options.cancelable);
		}
		else {
			oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, window,
					options.button, options.x, options.y, options.x, options.y,
					options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
		}
		$.extend(oEvent, options);
		element.dispatchEvent(oEvent);
	}
	else {
		options.clientX = options.x;
		options.clientY = options.y;
		oEvent = $.extend(document.createEventObject(), options);
		element.fireEvent('on' + eventName, oEvent);
	}

	return element;
};
