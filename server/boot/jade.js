'use strict';
module.exports = function (app) {
  var path = require('path');
  app.set('view engine', 'jade');
  app.set('views', path.join(__dirname, '../../client/app/modules'));
  app.get('/modules/sandbox/views/grid', function (req, res) {
    res.render('sandbox/views/grid', {title: 'Grid'});
  });
  app.get('/modules/users/views/main', function (req, res) {
    res.render('users/views/main', {title: 'Main'});
  });
  app.get('/modules/users/views/list', function (req, res) {
    res.render('users/views/list', {title: 'List'});
  });
  app.get('/modules/users/views/form', function (req, res) {
    res.render('users/views/form', {title: 'Form'});
  });
  app.get('/modules/users/views/login', function (req, res) {
    res.render('users/views/login', {title: 'Login'});
  });
  app.get('/modules/users/views/register', function (req, res) {
    res.render('users/views/register', {title: 'Login'});
  });
};
