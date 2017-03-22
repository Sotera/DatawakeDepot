let path = require('path');
let fs = require('fs');
let jsonFile = require('jsonfile');
let async = require('async');
let options = {
  tmpDir: __dirname + '/../public/uploaded/tmp',
  uploadDir: __dirname + '/../public/uploaded/files',
  uploadUrl: '/uploaded/files/',
  storage: {
    type: 'local'
  }
};

let uploader = require('../util/blueimp-file-upload-expressjs/fileupload')(options);

module.exports = function (app) {
  app.get('/upload', function (req, res) {
    uploader.get(req, res, function (err, obj) {
      res.send(JSON.stringify(obj, 2));
    });
  });
  //TODO: Check for errors ...
  app.post('/upload', function (req, res) {
    uploader.post(req, res, function (err, obj) {
      async.each(obj.files,
        (fileInfo, cb) => {
          let filePath = path.resolve(fileInfo.options.uploadDir, fileInfo.name);
          jsonFile.readFile(filePath, (err, domainItems) => {
            fs.unlink(filePath);
            //Add domain items to DB
            app.models.DwDomain.find({where: {id: fileInfo.fields.domainId}}, (err, dwDomains) => {
              app.models.AminoUser.find({where: {id: fileInfo.fields.userId}}, (err, aminoUsers) => {
                let aminoUser = aminoUsers[0];
                async.each(domainItems,
                  (domainItem, cb) => {
                    dwDomains[0].domainItems.create({itemValue: domainItem}, (err, domainItem) => {
                      domainItem.user(aminoUser);
                      domainItem.save(cb);
                    });
                  }, cb);
              });
            });
          });
        },
        (err) => {
          return res.status(200).json(err);
        });
    });
  });
  app.delete('/uploaded/files/:name', function (req, res) {
    uploader.delete(req, res, function (err, obj) {
      res.send(JSON.stringify(obj, 2));
    });
  });
  return app;
};

function findOrCreateObj(model, query, objToCreate, cb) {
  try {
    model.findOrCreate(
      query,
      objToCreate, // create
      function (err, createdObj) {
        if (err) {
          log(err);
        }
        cb(err, createdObj);
      });
  } catch (err) {
    log(err);
  }
}
