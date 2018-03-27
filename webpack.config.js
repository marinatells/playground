const path = require('path');

module.exports = {
	entry: './js/main.js',
	devServer: {
		contentBase: path.join(__dirname, '.'),
		port: 2018
	},
	output: {
		path: path.join(__dirname, 'build'),
		filename: 'main.js'
	}
};