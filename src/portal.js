// const mongoose = require('mongoose');

module.exports = (sep, expressClient, ports = { http_port: 3000, https_port: 3443, db_port: null }) => {
	const {
		http_port 	= 3000,
		https_port 	= 3443,
		// db_port 	= 27017
	} = ports;

	// const mongoose  = require('mongoose');
	const fs    = require('fs');
	const Log   = require('./log.js');
	const http 	= require('http');
	const https = require('https');
	const creds = require('../creds/creds.js')(sep, fs.readFileSync);
	const httpServer  = http.createServer (expressClient);
	const httpsServer = https.createServer(creds, expressClient);
	const announce 		= (port) => { Log(`accepting requests on port: ${port}`, 'blue'); };

	httpServer.listen (http_port,  () => { announce(http_port);  });
	httpsServer.listen(https_port, () => { announce(https_port); });

	// Insert DB of choice, or just remove this
	// mongoose.connect(
	// 	`mongodb://localhost:${ports.db_port}/testdb`,
	// 	{ useNewUrlParser: true, useCreateIndex: true },
	// 	(e) => { Log(!!e ? e : `database online on port: ${db_port}`, 'blue') } // TODO
	// );
};
