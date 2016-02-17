'use strict';
// to enable these logs set `DEBUG=boot:02-load-users` or `DEBUG=boot:*`
var async = require('async');
var log = require('debug')('boot:02-load-users');
module.exports = function (app) {
  //JReeme sez: setMaxListeners so we don't have to see that ridiculous memory leak warning
  app.models.AminoUser.getDataSource().setMaxListeners(0);
  app.models.Role.getDataSource().setMaxListeners(0);
  app.models.RoleMapping.getDataSource().setMaxListeners(0);
  app.models.DwTeam.getDataSource().setMaxListeners(0);
  app.models.DwDomain.getDataSource().setMaxListeners(0);
  var AminoUser = app.models.AminoUser;
  var Role = app.models.Role;
  var DwTeam = app.models.DwTeam;
  var DwDomain = app.models.DwDomain;
  var RoleMapping = app.models.RoleMapping;
  var alphabet = 'ABCDEF'.split('');
  //var alphabet = 'ABCDEFGHIJKLM'.split('');
  //var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  var adminRoles = ['admins', 'users', 'guests'];
  var adminUsers = [{
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@admin.com',
    username: 'admin',
    password: 'admin'
  //}, {
  //  firstName: 'John',
  //  lastName: 'Reeme',
  //  email: 'jreeme@gmail.com',
  //  username: 'jreeme',
  //  password: 'password'
  }];
  async.parallel([
      createAdminUsers
      , createAdminRoles
    ], function (err, result) {
      if (err) {
        log(err);
        return;
      }
      var createdAdminUsers = result[0];
      var createdAdminRoles = result[1];
      //Add admin to admins group
      createdAdminRoles.filter(function (role) {
        return role.name === 'admins';
      }).forEach(function (adminRole) {
        async.map(createdAdminUsers, function (adminUser) {
          adminRole.principals(function (err, roleMappings) {
            if (roleMappings.length) {
              return;
            }
            adminRole.principals.create(
              {
                principalType: RoleMapping.USER,
                principalId: adminUser.id
              },
              function (err, roleMapping) {
                if (err) {
                  log('error creating rolePrincipal', err);
                } else {
                  log('created roleMapping: ' + roleMapping);
                }
              }
            );
          });
        });
      });
    }
  );

  //Create user cookies.  We don't currently use these but if/when we goto passport they are needed and should have already been here
  app.models.AminoUser.afterRemote('login', function(context, accessToken, next) {
    var res1 = context.res;
    var req1 = context.req;

    if (accessToken != null) {
      if (accessToken.id != null) {
        res1.cookie('access_token', accessToken.id, {
          signed: req1.signedCookies ? true : false,
          maxAge: 1000 * accessToken.ttl
        });
        res1.cookie('userId', accessToken.userId.toString(), {
          signed: req1.signedCookies ? true : false,
          maxAge: 1000 * accessToken.ttl
        });
      }
    }

    return next();
  });

  app.models.AminoUser.afterRemote('logout', function(context, result, next) {
    var res = context.result;
    res.clearCookie('access_token');
    res.clearCookie('userId');
    return next();
  });

  function createAdminRoles(cb) {
    var functionArray = [];
    adminRoles.forEach(function (roleName) {
      functionArray.push(async.apply(findOrCreateObj, Role, {where: {name: roleName}},
        {name: roleName}));
    });
    async.parallel(functionArray, cb);
  }

  function createAdminUsers(cb) {
    var functionArray = [];
    adminUsers.forEach(function (user) {
      functionArray.push(async.apply(findOrCreateObj, AminoUser, {where: {username: user.username}}, user));
    });
    async.parallel(functionArray, cb);
  }

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
};
