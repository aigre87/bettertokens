const nodemailer = require("nodemailer");

module.exports = async (app) => {
	const upload = require('multer')({
		dest  : 'storage/',
		limits: {
			fieldSize: 1024 * 1024 * 50
		}
	});

	app.tools.iterate(['/images/*', '/js/*'], (path) => {
		app.express.get(path, (req, res) => res.status(404).send('Not found'));
	});


	app.express.post('/partner/send', async (req, res) => {
		console.log(req.body);
		res.redirect('/');
		let mailTpl = `
			<h3>New partner apply</h3>
			<p><ul>
			<li><b>Company</b>: ${req.body.company}</li>
			<li><b>Name</b>: ${req.body.name}</li>
			<li><b>Site</b>: ${req.body.site}</li>
			<li><b>Email</b>: ${req.body.email}</li>
			</ul></p>`;

		let transporter = nodemailer.createTransport({
			host  : 'smtp.wavesplatform.com',
			port  : 25,
			secure: false,
			tls   : {
				rejectUnauthorized: false
			}
		});
		let mailOptions = {
			from   : '"bettertokens.org" <noreply@wavesplatform.com>', // sender ƒaddressdress
			to     : 'sec@bettertokens.org',
			subject: 'New partner - ' + req.body.company,
			html   : mailTpl
		};

		let mailRes = await new Promise(resolve => transporter.sendMail(mailOptions, (error, info) => resolve(error ? error : info)));
		console.log(mailRes);
		res.end('');

		await app.db.models.partners.upsert({
			company			: req.body.company,
			name			: req.body.name,
			site			: req.body.site,
			email			: req.body.email
		});
	});

	app.express.get('/apply/logout', (req, res) => {
		req.session.destroy();
		res.redirect('/application-progress#apply');
	});

	app.express.get('/apply/docs/:id', async (req, res) => {
		let ret = await app.db.models.uploads.findOne({where: {uid: req.params.id}});
		if (!ret) res.status(404).end('');

		try {
			res.download(`./storage/${req.params.id}`, ret.fileName);
		} catch (e) {
			res.status(404).end(ret);
		}
	});

	app.express.post('/apply/upload', upload.any(), async (req, res) => {
		if (!req.session.auth || !req.session.auth.address) return res.end('error 17');
		if (!await app.db.models.applies.findOne({where: {owner: req.session.auth.address}})) return res.end('error 22');
		await app.db.models.uploads.create({
			uid       : req.files[0].filename,
			fileName  : req.files[0].originalname,
			size      : req.files[0].size,
			mimeType  : req.files[0].mimetype,
			applyOwner: req.session.auth.address
		});
		res.json({uid: req.files[0].filename});
	});


	app.tools.iterate({
		'/application-progress'    : 'application-progress',
		'/standarts'               : 'standarts',
		'/contacts'                : 'contacts',
		'/news'                    : 'news',
		'/team'                    : 'team',
		'/application-progress/faq': 'faq',
		'/*'                       : 'index'
	}, (viewName, path) => app.express.get(path, (req, res) => res.render(viewName, {})));
};