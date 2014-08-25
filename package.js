'use strict';

exports = module.exports = {
	install: install,
	publish: publish
};

require('colors');

var debug = require('debug')('qpm:package'),
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
		console.log('Supply a packge name to install');
		process.exit();
	}
    
	var qualifiedName = '/tmp/' + packageName + '.tar';
	debug('Installing ' + qualifiedName);

	var readStream = fs.createReadStream(qualifiedName);
	readStream.pipe(tar.extract('quick_modules/' + packageName));
	readStream.on('end', install_success).on('error', error);
}

function publish(packagePath) {
    if (packagePath === true) packagePath = '.';
    packagePath = '.';
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