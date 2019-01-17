const express  = require('express');
const helmet   = require('helmet');
const fs       = require('fs');

const Monolith = require('./src/monolith.js');
const Alter    = require('./src/alter.js');
const Ritual   = require('./src/ritual.js');
const Sacrifice= require('./src/sacrifice.js');
const Server   = require('./src/portal.js');
const Log      = require('./src/log.js');

function pathHandler(foldersAndFileArgs) {
	let sep = (process.platform === 'win32' ? '\\' : '/');
	return [...arguments].join(sep);
};

const sep = process.platform === 'win32' ? '\\' : '/';
const ports = {
	http_port: 3000,
	https_port: 3443
};

const RootedMonolith = new Monolith({
	filepath:	`${__dirname}`,
	title: 		'test',
}, false, fs);
// RootedMonolith.read(pathHandler(__dirname,'src','assets','style.css'), 'styles', true);
// RootedMonolith.write(sep);
RootedMonolith.reassign(Sacrifice(`${__dirname}\\test.html`), false, true);
// RootedMonolith.initToHTML();
console.log(RootedMonolith);

const VirtualMonolith = new Monolith(RootedMonolith, true);
VirtualMonolith.reassign({ body: Alter(VirtualMonolith) }, true);

const theUninitiated = new Ritual(
	[
		{
			path: '/', 	page: VirtualMonolith, // If we instead pass VirtualMonolith.payload we will create unique instances between each session.
			post: [
				express.urlencoded({extended: false}),
				(req, res, next) => {

					function isAlpha(str) {
						for (let i = 0; i < str.length; i++) {
							let code = str.charCodeAt(i);
							if (!(code > 64 && code < 91) && !(code > 96 && code < 123)) return false;
						} return true;
					};

					if (isAlpha(req.body.title)) {
						VirtualMonolith.reassign(req.body);
						VirtualMonolith.reassign({ body: Alter(VirtualMonolith) }, true, true);
						res.status(200).send(VirtualMonolith.payload);
					} else {
						res.end();
						Log('You may only assign an alphabetic path.', 'red');
					};
				}
			]
		},
		{ path: '/sanity', page: RootedMonolith.payload },
		{ path: '/*', 		 page: 'nothing here bud' }
	],
	express.Router(),
	ports.https_port
);

let client = express();
client.use(
	helmet(),
	helmet.permittedCrossDomainPolicies(),
	helmet.noCache(),
	helmet.referrerPolicy()
);

client.use((req, res, next) => { theUninitiated.ritual(req, res, next); });
Server(sep, client, ports);
