'use strict';
// to enable these logs set `DEBUG=boot:02-load-users` or `DEBUG=boot:*`
var async = require('async');
var log = require('debug')('boot:02-load-users');
module.exports = function (app) {
  //JReeme sez: setMaxListeners so we don't have to see that ridiculous memory leak warning
  app.models.AminoUser.getDataSource().setMaxListeners(64);
  app.models.Role.getDataSource().setMaxListeners(64);
  app.models.RoleMapping.getDataSource().setMaxListeners(64);
  app.models.DwTeam.getDataSource().setMaxListeners(64);

  var AminoUser = app.models.AminoUser;
  var Role = app.models.Role;
  var DwTeam = app.models.DwTeam;
  var RoleMapping = app.models.RoleMapping;
  var adminUser = {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@admin.com',
    username: 'admin',
    password: 'admin'
  };
  var johnny = {
    firstName: 'John',
    lastName: 'Reeme',
    email: 'jreeme@gmail.com',
    username: 'jreeme',
    password: 'password'
  };
  async.parallel([
    createDefaultUserInfo
  ], function (err, result) {
    if (err) {
      log(err);
      return;
    }
    //Add admin to admins group
    Role.findOne({where: {name: 'admins'}}, function (err, role) {
      AminoUser.findOne({where: {username: 'admin'}}, function (err, user) {
        role.principals.create({
          principalType: RoleMapping.USER,
          principalId: user.id
        }, function (err, roleMapping) {
          if (err) {
            log('error creating rolePrincipal', err);
          }
        });
      });
    });
  });
  function createDefaultUserInfo(cb) {
    var roles = [{name: 'admins'}, {name: 'users'}, {name: 'guests'}];
    var teams = [{name: 'Team A'}, {name: 'Team B'}, {name: 'Team C'}];
    var users = [adminUser, johnny];
    var functionArray = [];
    roles.forEach(function (role) {
      functionArray.push(async.apply(findOrCreateObj, Role, {where: {name: role.name}}, role));
    });
    teams.forEach(function (team) {
      functionArray.push(async.apply(findOrCreateObj, DwTeam, {where: {name: team.name}}, team));
    });
    users.forEach(function (user) {
      functionArray.push(async.apply(findOrCreateObj, AminoUser, {where: {username: user.username}}, user));
    });
    async.parallel(functionArray, cb);
  }

  function findOrCreateObj(model, query, objToCreate, cb) {
    model.findOrCreate(
      query,
      objToCreate, // create
      function (err, createdObj) {
        if(err){
          log(err);
        }
        cb(err, createdObj);
      });
  }
};
