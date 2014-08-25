'use strict';

exports = module.exports = {
	install: install,
	publish: publish
};

require('colors');

var tar = require('tar-fs'),
	fs = require('fs');

function error() {
 	console.log(('Error').red.bold);
}

function install_success() {
 	console.log(('Successfully installed module').green.bold);
}

function publish_success() {
 	console.log(('Successfully published module').green.bold);
}

function install(packageName) {
	var qualifiedName = '/tmp/' + packageName + '.tar';
	console.log('Installing ' + qualifiedName);

	var readStream = fs.createReadStream(qualifiedName);
	readStream.pipe(tar.extract({ path: 'quick_modules' }));
	readStream.on('end', install_success).on('error', error);
}

function publish(path) {
	console.log('Publishing ' + path);
	var tarStream = tar.pack(path);
	tarStream.pipe(fs.createWriteStream('/tmp/package.tar'));
	tarStream.on('end', publish_success).on('error', error);
}