#!/usr/bin/env node

'use strict';

var program = require('commander');
var manifest = require('./package.json');

program
  .version(manifest.version)
  .option('-p, --publish', 'Publish to qpm repo')
  .option('-i, --install [module]', 'Install [module]')
  .parse(process.argv);

if (program.publish) console.log('  - publish');
if (program.install) console.log('  - install');

if (process.argv.length < 3) program.help();