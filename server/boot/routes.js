'use strict';
var async = require('async');
var log = require('debug')('routes');
var testDataLoaded = false;
module.exports = function (app) {
  app.get('/load-test-data', function (req, res) {
    if (testDataLoaded) {
      res.end('<h1>Test Data Created!</h2>');
      return;
    }
    testDataLoaded = true;
    var AminoUser = app.models.AminoUser;
    var DwTeam = app.models.DwTeam;
    var DwTrail = app.models.DwTrail;
    var DwDomain = app.models.DwDomain;
    var DwDomainEntityType = app.models.DwDomainEntityType;
    var DwDomainItem = app.models.DwDomainItem;
    var alphabet = 'ABCDEF'.split('');
    //var alphabet = 'ABCDEFGHIJKLM'.split('');
    //var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    async.parallel([
        createTestTeams
        , createTestDomains
        , createTestUsers
      ], function (err, result) {
        if (err) {
          log(err);
          res.end('<h1>Test Data Created!</h2>');
          return;
        }
        var createdTestTeams = result[0];
        var createdTestDomains = result[1];
        var createdTestUsers = result[2];
        //Create test data relationships
        async.parallel([
            async.apply(addItemsToObjects, createdTestUsers, 'teams', createdTestTeams)
            , async.apply(addItemsToObjects, createdTestTeams, 'domains', createdTestDomains)
          ],
          function (err, result) {
            if (err) {
              log(err);
              res.end('<h1>Test Data Created!</h2>');
              return;
            }
            var functionArray = [];
            functionArray.push(async.apply(createTestTrails, createdTestDomains));
            functionArray.push(async.apply(createTestDomainEntityTypes, createdTestDomains));
            async.parallel(functionArray, function (err, result) {
              createTestDomainItems(createdTestDomains, function (err, result) {
                res.end('<h1>Test Data Created!</h2>');
              });
            });
          });
      }
    );
    function addItemsToObjects(objectsToAddItemsToArray, listPropertyToAddTo, objectsToAddArray, cb) {
      var functionArray = [];
      objectsToAddItemsToArray.forEach(function (objectToAddItemTo) {
        var list = objectToAddItemTo[listPropertyToAddTo];
        functionArray.push(async.apply(getEmbeddedList, list, objectsToAddArray));
      });
      async.parallel(functionArray, cb);
    }

    function getEmbeddedList(list, objectsToAddArray, cb) {
      list(function (err, listToAddTo) {
        if (err) {
          cb(err, null);
          return;
        }
        if (listToAddTo.length) {
          cb(null, null);
          return;
        }
        var randomizedArray = shuffle(objectsToAddArray);
        var numberOfItemsToAdd = randomInt(0, randomizedArray.length);
        var functionArray = [];
        for (var i = 0; i < numberOfItemsToAdd; ++i) {
          functionArray.push(async.apply(addObjectToEmbeddedList, list, randomizedArray[i]));
        }
        async.parallel(functionArray, cb);
      })
    }

    function addObjectToEmbeddedList(list, obj, cb) {
      list.add(obj, function (err) {
        cb(err);
      });
    }

    function shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;
      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
      return array;
    }

    function randomInt(low, high) {
      return Math.floor(Math.random() * (high - low) + low);
    }

    function createTestDomainItems(testDomains, cb) {
      var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
      var testDomainItemNames = [];
      alphabet.forEach(function (letter) {
        testDomainItemNames.push(letter);
      });
      var functionArray = [];
      testDomainItemNames.forEach(function () {
        var domain = testDomains[randomInt(1, testDomains.length)];
        functionArray.push(async.apply(findOrCreateObj, DwDomain, {
          where: {name: domain.name},
          include: ['domainEntityTypes']
        }, {}));
      });
      async.parallel(functionArray, function (err, domains) {
        if (err) {
          log(err);
          return;
        }
        var functionArray = [];
        domains.forEach(function (domain) {
          functionArray.push(async.apply(domain.domainEntityTypes));
        });
        //Do this to load domain collections
        async.parallel(functionArray, function (err, domainEntityTypes) {
          if (err) {
            log(err);
            return;
          }
          //-->
          var functionArray = [];
          var arrayLength = testDomainItemNames.length;
          for (var i = 0; i < arrayLength; ++i) {
            var domainItemName = testDomainItemNames[i];
            var entityTypes = domainEntityTypes[i];
            var domain = domains[i];
            var domainEntityType = entityTypes[randomInt(0, entityTypes.length)];
            if(domainEntityType){
              var domainEntityTypeId = domainEntityType.id.toString();
              var domainId = domain.id.toString();
              var domainItemMoniker = 'DomainItem' + domainItemName;
              functionArray.push(async.apply(findOrCreateObj, DwDomainItem, {where: {name: domainItemMoniker}},
                {
                  name: domainItemMoniker,
                  coreItem: (randomInt(0, 2) === 0),
                  itemValue: 'The ' + domainItemName + ' Item Value',
                  dwDomainId: domainId,
                  dwDomainEntityTypeId: domainEntityTypeId
                }));
            }
          }
          async.parallel(functionArray, function (err, entities) {
            cb(err, entities);
          });
          //-->
        });
      });
    }

    function createTestDomainEntityTypes(testDomains, cb) {
      var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
      var testDomainEntityTypeNames = [];
      alphabet.forEach(function (letter) {
        testDomainEntityTypeNames.push(letter);
      });
      var functionArray = [];
      testDomainEntityTypeNames.forEach(function (domainEntityTypeName) {
        var domain = testDomains[randomInt(1, testDomains.length)];
        var domainId = domain.id.toString();
        var domainEntityTypeMoniker = 'DomainEntityType' + domainEntityTypeName;
        functionArray.push(async.apply(findOrCreateObj, DwDomainEntityType, {where: {name: domainEntityTypeMoniker}},
          {
            name: domainEntityTypeMoniker,
            description: 'The ' + domainEntityTypeName + ' DomainEntityType',
            dwDomainId: domainId
          }));
      });
      async.parallel(functionArray, cb);
    }

    function createTestTrails(testDomains, cb) {
      var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
      var testTrailNames = [];
      alphabet.forEach(function (letter) {
        testTrailNames.push(letter);
      });
      AminoUser.find({include: ['teams']}, function (err, myAminoUsers) {
        if (err) {
          log(err);
          return;
        }
        var functionArray = [];
        testTrailNames.forEach(function (trailName) {
          var myAminoUser = myAminoUsers[randomInt(0, myAminoUsers.length)];
          var teams = myAminoUser.teams();
          if (!teams || !teams.length) {
            return;
          }
          var team = teams[randomInt(0, teams.length)];
          var domain = testDomains[randomInt(0, testDomains.length)];
          var trailMoniker = 'Trail' + trailName;
          functionArray.push(async.apply(findOrCreateObj, DwTrail, {where: {name: trailMoniker}},
            {
              name: trailMoniker,
              description: 'The ' + trailName + ' Trail',
              //dwUserId: myAminoUser.id.toString(),
              dwTeamId: team.id.toString(),
              dwDomainId: domain.id.toString()
            }));
        });
        async.parallel(functionArray, cb);
      });
    }

    function createTestTeams(cb) {
      var testTeamNames = [];
      alphabet.forEach(function (letter) {
        testTeamNames.push(letter);
      });
      var functionArray = [];
      testTeamNames.forEach(function (teamName) {
        var teamMoniker = 'Team' + teamName;
        functionArray.push(async.apply(findOrCreateObj, DwTeam, {where: {name: teamMoniker}},
          {name: teamMoniker, description: 'The ' + teamName + ' Team'}));
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
        var domainMoniker = 'Domain' + domainName;
        functionArray.push(async.apply(findOrCreateObj, DwDomain, {where: {name: domainMoniker}},
          {name: domainMoniker, description: 'The ' + domainName + ' Domain'}));
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

    function findOrCreateObj(model, query, objToCreate, cb) {
      try {
        model.findOrCreate(
          query,
          objToCreate, // create
          function (err, createdObj, created) {
            if (err) {
              log(err);
            }
            cb(err, createdObj);
          });
      } catch (err) {
        log(err);
      }
    }
  });
};
