#!/usr/bin/env node

'use strict';

var program = require('commander'),
	manifest = require('./package.json'),
	packageInterface = require('./package.js');

program
  .version(manifest.version)
  .option('-p, --publish', 'Publish to qpm repo')
  .option('-i, --install [module]', 'Install [module]')
  .parse(process.argv);

if (program.publish) packageInterface.publish();
if (program.install) packageInterface.install(program.install);

if (process.argv.length < 3) program.help();