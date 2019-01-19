const express   = require('express');
const helmet    = require('helmet');
const fs        = require('fs');

const Monolith  = require('./src/monolith.js');
const Ritual    = require('./src/ritual.js');
const Server    = require('./src/portal.js');

const sacrifice = require('./src/sacrifice.js');
const alter     = require('./src/alter.js');
const log       = require('./src/log.js');

const ports = { http_port: 3000, https_port: 3443 };
const sep   = (process.platform === 'win32' ? '\\' : '/');
function normalizePath(foldersAndFileArgs) {
	const sep = (process.platform === 'win32' ? '\\' : '/');
	return Array.from(arguments).join(sep);
};

const RootedMonolith = new Monolith({
	filepath:	`${__dirname}`,
	title: 		'test',
	...sacrifice(normalizePath(__dirname, 'src', 'dist', 'test.html'))
}, false, fs);
// RootedMonolith.read(normalizePath(__dirname, 'src', 'assets', 'main.css'), 'style', false, false);
// RootedMonolith.read(normalizePath(__dirname, 'src', 'assets', 'alter-style.css'), 'style', true, true);
const VirtualMonolith = new Monolith(RootedMonolith, true);

VirtualMonolith.reassign({ body: alter(VirtualMonolith) }, true, true);

const theUninitiated = new Ritual(
	[
		{
			path: '/', 	page: VirtualMonolith,
			post: [
				express.urlencoded({extended: false}),
				(req, res, next) => {

					const isAlpha = (str) => {
						for (let i = 0; i < str.length; i++) {
							let code = str.charCodeAt(i);
							if (!(code > 64 && code < 91) && !(code > 96 && code < 123)) return false;
						} return str.length < 24;
					};

					if (isAlpha(req.body.title)) {
						VirtualMonolith.reassign(req.body);
						RootedMonolith .reassign(req.body, false, true);
						RootedMonolith .write(sep);
						VirtualMonolith.reassign({ body: alter(VirtualMonolith) }, true, true);
						res.status(200).send(VirtualMonolith.payload);
					} else {
						log('You may only assign an alphabetic path.', 'red');
						res.end();
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
