define(function (require) {
	'use strict';
	const FIREBASE_URL = 'https://js-code-playground.firebaseio.com/';
	var firebase = require('firebase');

	var myFirebaseRef = new Firebase(FIREBASE_URL);

	return {
		set: function (key, code) {
			var codeRef = myFirebaseRef.push();
			key = key || '_' + Math.round(Math.random() * 100000);

			codeRef.set({
				key: key,
				code: code
			});
			// We've appended a new message to the message_list location.

			return codeRef.toString();
		},

		get: function (key) {
			var restoreFirebaseRef = new Firebase(FIREBASE_URL + key);

			return new Promise((resolve, reject) => {
				restoreFirebaseRef.on('value', function (ref) {
					var data = ref.val();

					if (data != null) {
						resolve(data);
					} else {
						reject();
					}
					
				});
			});

		}
	}
});