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
	return Array.from(arguments).join(sep);
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

// RootedMonolith.write(sep);
RootedMonolith.reassign(Sacrifice(pathHandler(__dirname, 'src', 'dist', 'test.html')));
// RootedMonolith.read(pathHandler(__dirname,'src','assets','style.css'), 'style');
// RootedMonolith.read(pathHandler(__dirname,'src','assets','iframe.html'), 'body', true, false);
// Perform your reads first unless you want to overwrite your sacrifice
// RootedMonolith.write(sep);

// TODO Control structure to automate common interactions
// Reset button for reread from source
// Spawn input field to be ammended to scripts
// User levels
// Procedural Naming for urls and avoiding collisions
// as long as username is unique and leveleraged here either as a directory or subdomain or
// concatonation
// save by export
// warning one has not save in a while
// allowing drafts
// api updating
// frontend library and webpack endpoint or curated prebundled version of react
// in runtime monolith creation
// batch actions against many instances

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
						RootedMonolith.reassign(req.body, false, true);
						VirtualMonolith.reassign({ body: Alter(VirtualMonolith) }, true, true);
						res.status(200).send(VirtualMonolith.payload);
						RootedMonolith.write(sep);
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
