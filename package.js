'use strict';

exports = module.exports = {
	install: install,
	publish: publish
};

function install(packageName) {
	console.log('Installing ' + packageName);
}

function publish() {
	console.log('Publishing your package');
}