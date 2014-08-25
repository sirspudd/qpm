'use strict';

exports = module.exports = {
	install: install,
	publish: publish
};

var tar = require('tar-fs'),
	fs = require('fs');

function install(packageName) {
	console.log('Installing ' + packageName);
}

function publish(path, callback) {
	console.log('Publishing ' + path);
	tar.pack(path).pipe(fs.createWriteStream('/tmp/package.tar')).end(callback);
}