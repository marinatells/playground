import $ from 'jquery';
import App from './app';


var env = window;

if (env.FormData && env.Blob) {
	env.app = new App({
		idTasks: '#tasks',
		idEditor: '#editor',
		idSuite: '#suite',
		idOutput: '#output'
	});
} else {
	document.body.innerHTML = '<h1 class="error">Use Chrome, Luke!</h1>';
}
