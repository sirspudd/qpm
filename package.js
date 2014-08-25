'use strict';

exports = module.exports = {
	install: install,
	publish: publish
};

require('colors');

var debug = require('debug')('qpm:package'),
    request = require('superagent'),
	path = require('path'),
    tar = require('tar-fs'),
	fs = require('fs');

function error() {
	debug('Error'.red.bold);
}

function install_success() {
	debug('Successfully installed module'.green.bold);
}

function publish_success() {
	debug('Successfully published module'.green.bold);
}

function install(packageName) {
	if (packageName === true) {
		console.log('Supply a package name to install');
		process.exit();
	}

    console.log('Fetching ' + packageName);

    var req = request.get('http://localhost:3000/api/module').query({ name: packageName }).end(function(error, res){
        if (error) console.log('Package fetch failed'.red);
    });

    var tarStream = tar.extract('quick_modules/' + packageName)

    req.pipe(tarStream).on('end', function() {
	   console.log('Installing ' + packageName);

	   tarStream.on('end', install_success).on('error', error);
    });
}

function publish(packagePath) {
    if (packagePath === true) packagePath = '.';

    var qualifiedPath = path.resolve(packagePath);

    console.log('Publishing ' + qualifiedPath);

    var tarStream = tar.pack(qualifiedPath, {
		ignore: function(name) {
			return path.extname(name) === '.git';
		}
	});

	tarStream.pipe(fs.createWriteStream('/tmp/' + path.basename(qualifiedPath) + '.tar'));
	tarStream.on('end', publish_success).on('error', error);
}
