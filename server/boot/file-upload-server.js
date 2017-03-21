let path = require('path');
let fs = require('fs');
let jsonFile = require('jsonfile');
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
  app.post('/upload', function (req, res) {
    uploader.post(req, res, function (err, obj) {
      let fileInfo = obj.files[0];
      let filePath = path.resolve(fileInfo.options.uploadDir, fileInfo.name);
      jsonFile.readFile(filePath, (err, domainItemArray) => {
        fs.unlink(filePath);
        if (err) {
          return res.status(200).json(err);
        }
        //Add domain item to DB
        app.models.DwDomain.find({where: {id: fileInfo.fields.domainId}}, (err, dwDomains) => {
          dwDomains[0].domainItems.create({itemValue: domainItemArray[0]}, (err, domainItem)=>{
            app.models.AminoUser.find({where:{id:fileInfo.fields.userId}},(err,aminoUsers)=>{
              domainItem.user(aminoUsers[0]);
              domainItem.save((err,instance)=>{
                var e = err;
              });
            });
          });
        });
        return res.status(200).json(obj);
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
