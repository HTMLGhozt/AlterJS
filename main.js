/**
 * alterjs is a boilerplate cms comprised of three classes
 * payload for the users interface and content
 * router to manage apis
 * server to... serve
 *
 * this file as the main project file will hold an example
 * of the usage and hopefully inspire you to create yours
 * as I progressively decide on its direction
 */
const express  = require('express'); // I'm okay with this dependancy due to familiarity, I am certainly leaning on it. Popular, I should consider contribution or personal rewrite
const helmet   = require('helmet'); // I'm okay with this dependancy for now, reevaluate with time
const bodyParser = require('body-parser'); // I'm okay with this dependancy for now, reevaluate with time
const fs       = require('fs'); // This is exposed in two places, here, and inside of the monolith as a function pointer in the constructor

const Monolith = require('./src/monolith.js'); // Compose the html, consolidate the assets, we need auto-detection on types, consider an upper abstraction that composes the monoliths and applys the rituals
const Alter    = require('./src/alter.js');
const Ritual   = require('./src/ritual.js'); // Compose the apis, hotswappable, TODO use the fact that we can replace the .ritual, wraps an express router
const Server   = require('./src/portal.js'); // Needed a vaguely satanic name for the servers
const Log      = require('./src/log.js'); // Adds color coding for visual feedback on status of runtime

const sound    = require('./src/rituals/sound.js'); // Example of a packaged up api in a seperate file

/**
 * establish platform seperators, these should be used instead of guessing
 * ports
 * db is later handled in the alter
 */
const sep = process.platform === 'win32' ? '\\' : '/';

function pathHandler(foldersAndFileArgs) {
	let sep = (process.platform === 'win32' ? '\\' : '/');
	return [...arguments].join(sep);
};

const ports = {
	http_port: 3000,
	https_port: 3443
};

/**
 * Instantiating a rooted Monolith
 * takes a root path for absolute pathing
 * reads in two assets
 */
const RootedMonolith = new Monolith({
	filepath:	`${__dirname}`,
	title: 		'test',
}, false, fs);
// RootedMonolith.read(`${__dirname}${sep}src${sep}assets${sep}a.png`, 'images');
// RootedMonolith.read(`${__dirname}${sep}src${sep}assets${sep}form.html`, 'body', false);
RootedMonolith.read(pathHandler(__dirname,'src','assets','style.css'), 'styles', true);
// console.log(RootedMonolith.images);
/**
 * This will need to be wrapped into a simple container and styled.
 * I use url encoded because leveraging the natural mechanisms of
 * the browser are preferred to leveraging everything from the browser
 * maintainers to promote that as a responsibility of the community.
 *
 * review on potential vulnerabilities if any present themselves
 */
const VirtualMonolith = new Monolith(RootedMonolith, true);
VirtualMonolith.reassign({ body: Alter(VirtualMonolith) }, true);

const theUninitiated = new Ritual(
	[
		{
			path: '/', 	page: VirtualMonolith, // If we instead pass VirtualMonolith.payload we will create unique instances between each session.
			post: [
				bodyParser.urlencoded({extended: false}),
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
						// VirtualMonolith.initToHTML();
						// RootedMonolith.reassign(req.body, false, true); // These two lines commit the file to the location you provide.
						// RootedMonolith.write(sep); // This is left over from a test attempt to compile initial monolith from latest payload output
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

/** This was an example if using an external file scope,
 * just pass the arguments you need as parameters if needed.
 */
// let theDevoted = new Ritual(
// 	[
// 		sound
// 	],
// 	express.Router(),
// 	ports.https_port
// );

/**
 * As I have gleaned the effects of helmut are amazing for protecting ones users.
 * We basicly establish we only one an ack nack relationship with a single payload
 */
let client = express();
client.use(
	helmet(),
	helmet.permittedCrossDomainPolicies(),
	helmet.noCache(),
	helmet.referrerPolicy()
);

/**
 * link apis
 * These can be replaced by changing the content of .ritual
 * the instance of a ritual has the methods to overwrite its prior content
 * TODO: It doesnt have the methods anymore
 * consider securing this endpoint with validation
 *
 * perhaps we can flag some que and offer the Alter and signin Ritual over
 * everything as a middleware and overlay the page one is on.
 *
 * write to a rooted monolith is also going to have to be exposed
 */
// client.use((req, res, next) => { theDevoted.ritual(req, res, next); });
client.use((req, res, next) => { theUninitiated.ritual(req, res, next); });
Server(sep, client, ports);
