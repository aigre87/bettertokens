module.exports = async (app) => {
	app.DB = require('osmium-db');
	app.db = new app.DB('bt', null, null, {
		dialect: 'sqlite',
		storage: './db/db.sqlite'
	});

	app.db.defineSchema({
		applies: {
			'*owner'   : 'string',
			sid        : 'string',
			ip         : 'string',
			browser    : 'text',
			email      : 'string',
			link       : 'string',
			tokenId    : 'string',
			description: 'text',
			projectname: 'string',
			address    : 'string',
			ticker     : 'string',
			applied    : 'boolean',
			'>uploads' : {
				'*uid'  : 'string',
				fileName: 'string',
				size    : 'integer',
				mimeType: 'string'
			},
		},
		partners: {
			company			: 'string',
			name			: 'string',
			site			: 'string',
			email			: 'string'
		}
	});

	await app.events.wait(app.event.DB_SYNC);
	await app.db.sync({force: false});
};