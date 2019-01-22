const app = {
	setCookie(name, value, days) {
		let expires = '';
		if (days) {
			let date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			expires = `; expires=${date.toUTCString()}`;
		}
		console.log(`${name}=${(value || '')}${expires}; path=/`);
		document.cookie = `${name}=${(value || '')}${expires}; path=/`;
	},
	getCookie(name) {
		let nameEQ = `${name}=`;
		let ca = document.cookie.split(';');
		for (let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) === ' ') c = c.substring(1, c.length);
			if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
		}
		return null;
	},
	map: require('./map')
};

import 'vue2-dropzone/dist/vue2Dropzone.min.css';
import App from './vue/App.vue';
import IO from 'socket.io-client';
import WebApi from 'osmium-webapi';
import tools from 'osmium-tools';

window.tools = tools;
window.webApi = new WebApi.WebApiClient(IO('/'));

app.initVueApp = () => {
	new app.Vue({

		el    : '#app',
		render: h => h(App),
		async mounted() {}
	});
};

module.exports = app;