/*jslint node: true */
var fs = require('fs');
var FileInfo = require('../fileinfo.js');
var path = require('path');
var async = require('async');

module.exports = function(opts) {

    var api = {
        options: opts,
        /**
         * get files
         */
        get: function(callback) {
            var files = [],
                options = this.options;
            // fix #41
            options.saveFile = false;
            fs.readdir(options.uploadDir, function(err, list) {
                list.forEach(function(name) {
                    var stats = fs.statSync(options.uploadDir + '/' + name);
                    if (stats.isFile() && name[0] !== '.') {
                        var fileInfo = new FileInfo({
                            name: name,
                            size: stats.size,
                            lastMod: stats.mtime
                        }, options);
                        fileInfo.initUrls();
                        files.push(fileInfo);
                    }
                });
                callback(null, {
                    files: files
                });
            });
        },
        proccessVersionFile: function(versionObj, cbk) {
            console.log("not supposed to be here");
            return null;
        },
        post: function(fileInfo, file, finish) {

            var me = this,
                options = this.options,
                versionFuncs = [];


            fs.renameSync(file.path, options.uploadDir + '/' + fileInfo.name);

            if ((!options.copyImgAsThumb) || (!options.imageTypes.test(fileInfo.name))) {
                fileInfo.initUrls();
                fileInfo.proccessed = true;
                return finish(null, fileInfo);
            }


            Object.keys(options.imageVersions).forEach(function(version) {

                versionFuncs.push({
                    version: version,
                    fileInfo: fileInfo
                });

            });


            async.map(versionFuncs, me.proccessVersionFile, function(err, results) {

                results.forEach(function(v, i) {
                    fileInfo.versions[v.version] = {
                        err: v.err,
                        width: v.width,
                        height: v.height
                    };
                });
                fileInfo.initUrls();
                fileInfo.proccessed = true;
                finish(err, fileInfo);

            });


        },
        delete: function(req, res, callback) {
            var options = this.options;
            var fileName = '';
            if (req.url.slice(0, options.uploadUrl.length) === options.uploadUrl) {
                fileName = path.basename(decodeURIComponent(req.url));
                if (fileName[0] !== '.') {
                    fs.unlink(options.uploadDir + '/' + fileName, function(ex) {
                        Object.keys(options.imageVersions).forEach(function(version) {
                            // TODO - Missing callback
                            fs.unlink(options.uploadDir + '/' + version + '/' + fileName);
                        });
                        callback(null, {
                            success: true
                        });
                    });
                    return;
                }
            }
            callback(new Error('File name invalid:' + fileName), null);
        }
    };

    return api;

};
