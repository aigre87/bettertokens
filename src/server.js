const Express = require('express');
const Events = require('osmium-events');
process.on('unhandledRejection', (reason) => console.log('Error:\n', reason));

const app = {
	Express,
	events : new Events(),
	express: Express(),
	tools  : require('osmium-tools'),
	fs     : require('mz/fs'),
	event  : {
		DB_SYNC: 'db sync'
	}
};

(async () => {
	require('./db')(app);
	await require('./webserver')(app);

	await app.events.emit(app.event.DB_SYNC);
})();