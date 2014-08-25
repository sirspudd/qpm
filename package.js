'use strict';

exports = module.exports = {
	install: install,
	publish: publish
};

require('colors');

var path = require('path'),
    tar = require('tar-fs'),
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
	readStream.pipe(tar.extract('quick_modules/' + packageName));
	//readStream.on('end', install_success).on('error', error);
}

function publish(packagePath) {
	var qualifiedPath = path.resolve(packagePath);
	console.log('Publishing ' + qualifiedPath);
	var tarStream = tar.pack(qualifiedPath, {
    ignore: function(name) {
        return path.extname(name) === '.git'; // ignore .bin files when packing
    }
});
	tarStream.pipe(fs.createWriteStream('/tmp/' + path.basename(qualifiedPath) + '.tar'));
	tarStream.on('end', publish_success).on('error', error);
}