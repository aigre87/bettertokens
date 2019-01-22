const session = require('express-session');
const sessionIo = require('express-socket.io-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const WebApiServer = require('osmium-webapi').WebApiServer;

module.exports = async (app) => {
	app.express.use(bodyParser.urlencoded({extended: false}));
	app.express.use(bodyParser.json());
	app.express.use(cookieParser());
	app.express.use(app.Express.static('dist'));
	app.express.set('trust proxy', 1);
	app.express.set('view engine', 'pug');
	app.express.set('views', './src/views');
	app.express.use(app.Express.static('public'));

	app.httpServer = require('http').Server(app.express);
	app.io = require('socket.io')(app.httpServer);

	app.sessionStore = new (require('connect-session-sequelize')(session.Store))({
		db                     : app.db,
		checkExpirationInterval: 900000,
		expiration             : 15552000000
	});

	const expressSession = session({
		store            : app.sessionStore,
		secret           : '0d2e6a3f5bdccb7948447ea5015600a8a0180d2d876284ad15607437adc1bca1',
		resave           : true,
		name             : 'bt.sid',
		proxy            : true,
		saveUninitialized: true,
		cookie           : {secure: false},
		maxAge           : Date.now() + (60 * 60 * 24 * 365 * 1000)
	});

	app.express.use(expressSession);
	app.io.use(sessionIo(expressSession, {autoSave: true}));
	app.sessionStore.sync();
	const server = new WebApiServer(app.io);

	await require('./routes')(app);

	server.registerMiddlewareInc((packet, socket, before) => {
		if (!before) return packet;
		let isOk = false;

		app.tools.iterate(['connect check', 'auth do', 'auth status'], (row) => {
			if (packet.name.toLocaleLowerCase() === row) isOk = true;
		});

		if (!isOk && (!socket.handshake.session || !socket.handshake.session.auth || !socket.handshake.session.auth.authed)) return null;
		packet.args.push(socket.handshake.session);
		packet.args.push(socket);
		return packet;
	});

	require('./api')(app, server);

	app.httpServer.listen(2000, () => console.log('Started'));
};