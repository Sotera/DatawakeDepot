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
  app.get('/modules/dwSettings/views/main', function (req, res) {
    res.render('dwSettings/views/main', {title: 'Datwake Settings'});
  });
  app.get('/modules/dwSettings/views/list', function (req, res) {
    res.render('dwSettings/views/list', {title: 'Datwake Settings'});
  });
  app.get('/modules/dwSettings/views/form', function (req, res) {
    res.render('dwSettings/views/form', {title: 'Datwake Settings'});
  });
  app.get('/modules/dwTrails/views/main', function (req, res) {
    res.render('dwTrails/views/main', {title: 'Datawake Trails'});
  });
  app.get('/modules/dwTrails/views/list', function (req, res) {
    res.render('dwTrails/views/list', {title: 'Datawake Trails'});
  });
  app.get('/modules/dwTrails/views/form', function (req, res) {
    res.render('dwTrails/views/form', {title: 'Datawake Trails'});
  });

};
