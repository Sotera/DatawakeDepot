let options = {
  tmpDir:  __dirname + '/../public/uploaded/tmp',
  uploadDir: __dirname + '/../public/uploaded/files',
  uploadUrl:  '/uploaded/files/',
  storage : {
    type : 'local'
  }
};

let uploader = require('../util/blueimp-file-upload-expressjs/fileupload')(options);

module.exports = function (router) {
  router.get('/upload', function (req, res) {
    uploader.get(req, res, function (err, obj) {
      res.send(JSON.stringify(obj, 2));
    });
  });
  router.post('/upload', function (req, res) {
    uploader.post(req, res, function (err, obj) {
        //Add domain item to DB
      res.send(JSON.stringify(obj, 2));
    });
  });
  router.delete('/uploaded/files/:name', function (req, res) {
    uploader.delete(req, res, function (err, obj) {
      res.send(JSON.stringify(obj, 2));
    });
  });
  return router;
};
