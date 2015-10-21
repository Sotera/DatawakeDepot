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
  }, {
    firstName: 'John',
    lastName: 'Reeme',
    email: 'jreeme@gmail.com',
    username: 'jreeme',
    password: 'password'
  }];
  async.parallel([
      createAdminUsers
      , createAdminRoles
      , createTestTeams
      , createTestDomains
      , createTestUsers
    ], function (err, result) {
      if (err) {
        log(err);
        return;
      }
      var createdAdminUsers = result[0];
      var createdAdminRoles = result[1];
      var createdTestTeams = result[2];
      var createdTestDomains = result[3];
      var createdTestUsers = result[4];
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
      //Create test data relationships
      addItemsToObjects(createdTestUsers, 'teams', createdTestTeams);
      addItemsToObjects(createdTestTeams, 'domains', createdTestDomains);
      /*    AminoUser.find({filter: {include: ['roles']}}).$promise
       .then(function (allUsers) {});*/
    }
  );
  function addItemsToObjects(objectsToAddItemsToArray, listPropertyToAddTo, objectsToAddArray) {
    var numberOfItemsToAdd = 1;
    var itemsToAddOffset = 1;
    async.map(objectsToAddItemsToArray, function (objectToAddItemTo) {
      objectToAddItemTo[listPropertyToAddTo](function (err, listToAddTo) {
        if (err) {
          log(err);
          return;
        }
        if (listToAddTo.length) {
          return;
        }
        for (var i = 0; i < numberOfItemsToAdd; ++i) {
          var objectToAdd = objectsToAddArray[(i + itemsToAddOffset) % objectsToAddArray.length];
          objectToAddItemTo[listPropertyToAddTo].add(objectToAdd, function (err) {
            if (err) {
              log(err);
              return;
            }
          });
        }
        ++numberOfItemsToAdd;
        ++itemsToAddOffset;
      })
    });
  }

  function createTestTeams(cb) {
    var testTeamNames = [];
    alphabet.forEach(function (letter) {
      testTeamNames.push(letter);
    });
    var functionArray = [];
    testTeamNames.forEach(function (teamName) {
      functionArray.push(async.apply(findOrCreateObj, DwTeam, {where: {name: teamName}},
        {name: 'Team ' + teamName, description: 'The ' + teamName + ' Team'}));
    });
    async.parallel(functionArray, cb);
  }

  function createTestDomains(cb) {
    var testDomainNames = [];
    alphabet.forEach(function (letter) {
      testDomainNames.push(letter);
    });
    var functionArray = [];
    testDomainNames.forEach(function (domainName) {
      functionArray.push(async.apply(findOrCreateObj, DwDomain, {where: {name: domainName}},
        {name: 'Domain ' + domainName, description: 'The ' + domainName + ' Domain'}));
    });
    async.parallel(functionArray, cb);
  }

  function createTestUsers(cb) {
    var testUserNames = [];
    alphabet.forEach(function (letter) {
      testUserNames.push(letter);
    });
    var functionArray = [];
    testUserNames.forEach(function (userName) {
      var userMoniker = 'User' + userName;
      functionArray.push(async.apply(findOrCreateObj, AminoUser, {where: {username: userMoniker}},
        {
          firstName: userMoniker + '_first',
          lastName: userMoniker + '_last',
          email: userMoniker + '@user.com',
          username: userMoniker,
          password: userMoniker + '_password'
        }));
    });
    async.parallel(functionArray, cb);
  }

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
