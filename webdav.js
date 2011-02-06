var	http = require('http'),
	fs = require('fs'),
	Controller = require('./lib/controller').Controller,
	Resource = require('./lib/resource').Resource,
	STATUS = require('./lib/utils').HTTP_STATUS_MESSAGES;

// TODO: get the options from the command line
var options = {};
options.Resource = require('./lib/fileresource').FileResource;
options.root = process.cwd();

http.createServer(function (request, response) {
	console.log('> ' + request.method + ' ' + request.url);
	try {
		controller = new Controller(request, response, options);

		var method = request.method.toUpperCase(); // use uppercase thanks to "delete"
		var status = STATUS['OK'];
		controller.headers = {};

		if (controller[method]) {
			controller[method]();
		} else {
			status = STATUS['Method Not Allowed'];
		}
	} catch (error) {
		if (typeof error === 'number')
			status = error;
		else
			throw error;
	}
	response.writeHead(status, controller.headers);
	response.end();
}).listen(8080);
console.log('WebDAV server running at http://127.0.0.1:8080/');

process.addListener('uncaughtException', function (err) {
  console.log(err.stack);
});
