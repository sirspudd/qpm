'use strict';

exports = module.exports = {
	install: install,
	publish: publish
};

var tar = require('tar')
  , fstream = require('fstream')
  , fs = require('fs');

function install(packageName) {
	console.log('Installing ' + packageName);
}

function publish(path, callback) {
	var packageFileName = fs.createWriteStream('/tmp/' + 'fuckit.tar');
	console.log('Publishing your package');
	fstream.Reader({ path: path, type: 'Directory' })
		.pipe(tar.Pack({ noProprietary: true }))
		.pipe(packageFileName)
		.end(callback);
}