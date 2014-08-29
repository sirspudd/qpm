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
    zlib = require('zlib'),
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

    var req = request.get('http://localhost:3000/api/module').query({
        name: packageName
    }).end(function(error, res) {
        if (error) console.log('Package fetch failed'.red);
    });

    var tarStream = tar.extract('quick_modules/' + packageName);

    req.pipe(zlib.createGunzip()).pipe(tarStream).on('end', function() {
        console.log('Installing ' + packageName);

        tarStream.on('end', install_success).on('error', error);
    });
}

function publish(packagePath) {
    if (packagePath === true) packagePath = '.';

    var resolvedPath = path.resolve(packagePath);

    var packageInfo = null;
    try {
        packageInfo = JSON.parse(fs.readFileSync(resolvedPath + '/package.json'));
    } catch (e) {
        if ('ENOENT' === e.code) console.log(('No valid package.json found under ' + packagePath).red);
        process.exit(-1);
    }

    if (!packageInfo.quickModule) {
        console.log('Attempting to package a non quick module for qpm');
        process.exit(-1);
    }

    console.log('Publishing ' + resolvedPath);

    var tarStream = tar.pack(resolvedPath, {
        ignore: function(name) {
            return name.indexOf('.git') !== -1;
        }
    });


    var transientFileName = '/tmp/qpm/' + path.basename(resolvedPath) + '.tar.gz';
    try {
        fs.mkdirSync('/tmp/qpm');
        fs.unlinkSync(transientFileName);
    } catch(e) {
        // no se proecupe
    }
    tarStream.pipe(zlib.createGzip()).pipe(fs.createWriteStream(transientFileName));
    tarStream.on('end', function(){
        request.post('http://localhost:3000/api/publish').attach('file', transientFileName).end(function(err, res) {
         if (err) console.log('Upload failed', err)
     });
    }).on('error', error);
}
