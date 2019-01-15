// const mongoose = require('mongoose');
const fs       = require('fs');
const Log      = require('./log.js');

module.exports = (sep, expressClient, ports = { http_port: 3000, https_port: 3443, db_port: null }) => {
	// This shouldnt need any explaination
	const {
		http_port 	= 3000,
		https_port 	= 3443,
		// db_port 	= 27017
	} = ports;

	const http 			= require('http');
	const https 		= require('https');
	// const mongoose  = require('mongoose');
	// I remove this for pushes so my particular function and files are atleast up to interpretation
	const creds			= require('../creds/creds.js')(sep, fs.readFileSync);
	// This is mainly what we're after, spawning the two servers
	const httpServer  = http.createServer (expressClient);
	const httpsServer = https.createServer(creds, expressClient);
	const announce 		= (port) => { Log(`accepting requests on port: ${port}`, 'blue'); };
	// Start listenning
	httpServer.listen (http_port,  () => { announce(http_port);  });
	httpsServer.listen(https_port, () => { announce(https_port); });
	// Insert DB of choice, or just remove this
	// mongoose.connect(
	// 	`mongodb://localhost:${ports.db_port}/testdb`,
	// 	{ useNewUrlParser: true, useCreateIndex: true },
	// 	(e) => { Log(!!e ? e : `database online on port: ${db_port}`, 'blue') } // TODO
	// );
};
