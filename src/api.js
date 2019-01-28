module.exports = async (app, api) => {
	const sg = require('@waves/signature-generator');
	const StringWithLength = sg.StringWithLength;

	const bytesSchema = new sg.generate([
		new StringWithLength('prefix'),
		new StringWithLength('host'),
		new StringWithLength('data')
	]);

	async function authValidate(host, data, sign, publicKey) {
		const prefix = 'WavesWalletAuthentication';
		const bytes = await new bytesSchema({prefix, host, data}).getBytes();

		return sg.utils.crypto.isValidSignature(bytes, sign, publicKey);
	}

	api.on('auth status', (session) => {
		if (!session.auth) {
			session.auth = {
				token : app.tools.GUID(),
				authed: false
			};
			session.save();
		}
		return session.auth;
	});

	api.on('auth do', async (data, session) => {
		if (!session.auth || !session.auth.token) return null;

		let result = false;
		try {
			result = await authValidate(data.host, session.auth.token, data.signature, data.publicKey);
		} catch (e) {
			return false;
		}
		if (result) {
			session.auth.address = sg.utils.crypto.buildRawAddress(await (new sg.Base58()).process(data.publicKey));
		}
		session.auth.authed = result;
		session.save();
		return result;
	});

	api.on('form apply get', async (session) => {
		let res = await app.db.models.applies.findOne({
			where     : {owner: session.auth.address},
			attributes: ['email', 'link', 'tokenId', 'description', 'projectname', 'address', 'ticker', 'applied'],
			include   : [{model: app.db.models.uploads, required: false}]
		});
		return res ? res : false;
	});

	api.on('form apply update', async (form, session) => {
		form.owner = session.auth.address;
		await app.db.models.applies.upsert(form);
	});

	const nodemailer = require('nodemailer');

	async function sendMail(owner, state) {
		let res = await app.db.models.applies.findOne({
			where  : {owner},
			include: [{
				model   : app.db.models.uploads,
				required: false
			}]
		});
		if (!res) return;

		let mailTpl = `<h3>${state} from ${owner}</h3><hr>
			<p><ul>
			<li><b>Email:</b> ${res.email}</li>
			<li><b>Link:</b> ${res.link}</li>
			<li><b>TokenID:</b> ${res.tokenId}</li>
			<li><b>Description:</b> ${res.description}</li>
			<li><b>Project name:</b> ${res.projectname}		
			<li><b>Address:</b> ${res.address}</li>
			<li><b>Ticker:</b> ${res.address}</li>
			<li><b>Files:</b><ul>`;
		app.tools.iterate(res.uploads, (file) => {
			mailTpl += `<li><a href="https://bettertokens.org/apply/docs/${file.uid}">${file.fileName}</a></li>`;
		});
		mailTpl += `</ul></li></ul></p>`;

		let transporter = nodemailer.createTransport({
			host  : 'smtp.wavesplatform.com',
			port  : 25,
			secure: false,
			tls   : {
				rejectUnauthorized: false
			}
		});
		let mailOptions = {
			from   : '"bettertokens.org" <noreply@wavesplatform.com>', // sender address
			to     : 'sec@bettertokens.org',
			subject: state,
			html   : mailTpl
		};

		let mailRes = await new Promise(resolve => transporter.sendMail(mailOptions, (error, info) => resolve(error ? error : info)));
	}


	api.on('form apply apply', async (session) => {
		await app.db.models.applies.upsert({owner: session.auth.address, applied: true});
		await sendMail(session.auth.address, 'Apply');
	});
	api.on('form apply unapply', async (session) => {
		await app.db.models.applies.upsert({owner: session.auth.address, applied: false});
		await sendMail(session.auth.address, 'UnApply');
	});

	api.on('form apply upload remove', async (uid, session) => {
		let file = await app.db.models.uploads.findOne({where: {applyOwner: session.auth.address, uid}});
		if (!file) return false;

		await app.db.models.uploads.destroy({where: {uid}});
		try {
			await app.fs.unlink(`./storage/${uid}`);
		} catch (e) { }

		return true;
	});

	api.on('test', (a) => {
		return a + 1;
	});
};