'use strict';
var async = require('async');
var deepExtend = require('deep-extend');
var log = require('debug')('routes');
var testDataLoaded = false;
var createdTestTeams = null;
var createdTestDomains = null;
var createdTestUsers = null;
var createdTestTrails = null;
var createdTestTrailUrls = null;
var createdTestTrailUrlExtractions = null;
var createdTestDomainEntityTypes = null;
module.exports = function (app) {
  app.get('/test', function (req, res) {
    res.end(generateHtml());
  });
  app.get('/load-test-data', function (req, res) {
    if (testDataLoaded) {
      res.end('<h1>Test Data Created!</h2>');
      return;
    }
    testDataLoaded = true;
    var AminoUser = app.models.AminoUser;
    var DwTeam = app.models.DwTeam;
    var DwTrail = app.models.DwTrail;
    var DwTrailUrl = app.models.DwTrailUrl;
    var DwDomain = app.models.DwDomain;
    var DwUrlExtraction = app.models.DwUrlExtraction;
    var DwDomainEntityType = app.models.DwDomainEntityType;
    var DwDomainItem = app.models.DwDomainItem;
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
        createdTestTeams = result[0];
        createdTestDomains = result[1];
        createdTestUsers = result[2];
        //Create test data relationships
        async.parallel([
            async.apply(linkSomeHasAndBelongsToMany, createdTestUsers, 'teams', createdTestTeams, 'users')
            //, async.apply(addItemsToObjects, createdTestTeams, 'domains', createdTestDomains)
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
                createTestTrailUrls(createdTestTrails, function (err, result) {
                  createdTestTrailUrls = result;
                  createTestUrlExtractions(createdTestTrailUrls, createdTestDomainEntityTypes, function (err, result) {
                    res.end('<h1>Test Data Created!</h2>');
                  });
                });
              });
            });
          });
      }
    );
    function createTestUrlExtractions(trailUrls, domainEntityTypes, cb) {
      var cheerio = require('cheerio');
      var numberOfTrailUrlExtractions = randomInt(25, 75);
      var functionArray = [];
      for (var i = 0; i < numberOfTrailUrlExtractions; ++i) {
        var trailUrl = trailUrls[randomInt(0, trailUrls.length)];
        var trailUrlId = trailUrl.id.toString();
        var domainEntityTypeId = domainEntityTypes[randomInt(0, domainEntityTypes.length)].id.toString();
        var numberOfExtractionTerms = randomInt(25, 75);
        var scrapedContent = trailUrl.scrapedContent;
        var $ = cheerio.load(scrapedContent);
        var body = $('body');
        var bodyWords = body.html().split(/\W+/);
        for (var j = 0; j < numberOfExtractionTerms; ++j) {
          var value = bodyWords[randomInt(0, bodyWords.length)];
          if (value.length < 4) {
            continue;
          }
          functionArray.push(async.apply(findOrCreateObj, DwUrlExtraction, {where: {value: value}},
            {
              value: value,
              dwDomainEntityTypeId: domainEntityTypeId,
              dwTrailUrlId: trailUrlId.toString()
            }));
        }
      }
      async.parallel(functionArray, function (err, trailUrlExtractions) {
        cb(err, trailUrlExtractions);
      });
    }

    function createTestTrailUrls(testTrails, cb) {
      var numberOfTrailUrls = 100;
      var words = getWords(numberOfTrailUrls);
      var functionArray = [];
      for (var i = 0; i < numberOfTrailUrls; ++i) {
        var trailUrl = 'http://www.' + words[i] + '.net';
        var trailId = testTrails[randomInt(0, testTrails.length)].id.toString();
        functionArray.push(async.apply(findOrCreateObj, DwTrailUrl, {where: {url: trailUrl}},
          {
            url: trailUrl,
            scrapedContent: generateHtml(),
            comments: getSentence(50),
            dwTrailId: trailId.toString()
          }));
      }
      async.parallel(functionArray, function (err, trailUrls) {
        cb(err, trailUrls);
      });
    }

    function linkSomeHasAndBelongsToMany(firstArray, firstProperty, secondArray, secondProperty, cb) {
      firstArray.forEach(function (firstArrayElement) {
        //Get random half of the second array
        var randomHalfSecondArray = shuffle(secondArray).slice(0, secondArray.length / 2);
        //Add each second array element to firstArray[firstProperty]
        randomHalfSecondArray.forEach(function (randomHalfSecondArrayElement) {
          firstArrayElement[firstProperty].add(randomHalfSecondArrayElement, function (err, result) {
            var r = result;
          });
        });
      });
    }

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

    function createTestDomainItems(testDomains, cb) {
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
            if (domainEntityType) {
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
      async.parallel(functionArray, function (err, result) {
        createdTestDomainEntityTypes = result;
        cb(err, result);
      });
    }

    function createTestTrails(testDomains, cb) {
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
        async.parallel(functionArray, function (err, result) {
          createdTestTrails = result;
          cb(err, result);
        });
      });
    }

    function createCollectionEntry(objectTemplate, collection, minCount, maxCount, cb) {
      var numberOfEntries = randomInt(minCount, maxCount);
      var words = getWords(numberOfEntries);
      var functionArray = [];
      for (var i = 0; i < words.length; ++i) {
        //var moniker = 'fripper';
        var moniker = words[i];
        var searchProperty = '';
        var searchPropertyValue = '';
        var objectToInsert = {};
        deepExtend(objectToInsert, objectTemplate);
        for (var property in objectToInsert) {
          if (objectToInsert[property].indexOf('__search-moniker__') != -1) {
            objectToInsert[property] = objectToInsert[property].replace('__search-moniker__', moniker);
            searchProperty = property;
            searchPropertyValue = objectToInsert[property];
          }
          else {
            objectToInsert[property] = objectToInsert[property].replace('__moniker__', moniker);
          }
        }
        var filter = {};
        filter['where'] = {};
        filter['where'][searchProperty] = searchPropertyValue;
        functionArray.push(async.apply(findOrCreateObj, collection, filter, objectToInsert));
      }
      async.series(functionArray, function (err, results) {
        var retVal = [];
        results.forEach(function (result) {
          if (result) {
            retVal.push(result);
          }
        });
        cb(err, retVal);
      });
    }

    function createTestTeams(cb) {
      createCollectionEntry({
        name: 'Team___search-moniker__',
        description: 'The __moniker__ Team'
      }, DwTeam, 10, 30, function (err, result) {
        cb(err, result);
      });
    }

    function createTestDomains(cb) {
      createCollectionEntry({
        name: 'Domain___search-moniker__',
        description: 'The __moniker__ Domain'
      }, DwDomain, 10, 30, function (err, result) {
        cb(err, result);
      });
    }

    function createTestUsers(cb) {
      createCollectionEntry({
        firstName: '__moniker___first',
        lastName: '__moniker___last',
        email: '__moniker__@user.com',
        username: '__moniker__@user.com',
        password: 'password'
      }, AminoUser, 10, 30, function (err, result) {
        cb(err, result);
      });
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
            cb(err, created ? createdObj : null);
          });
      } catch (err) {
        log(err);
      }
    }
  });
};
function getSentence(numberOfWords, minWordLength, maxWordLength) {
  return getWords(numberOfWords, minWordLength, maxWordLength).join(' ') + '.';
}
function getWords(numberOfWords, minWordLength, maxWordLength) {
  numberOfWords = numberOfWords || 250;
  minWordLength = minWordLength || 5;
  maxWordLength = maxWordLength || 7;
  var wordList = require('word-list-json');
  var wordListCursor = 0;
  while (wordList[++wordListCursor].length < minWordLength);
  var startWordIdx = wordListCursor;
  while (wordList[++wordListCursor].length <= maxWordLength);
  var endWordIdx = wordListCursor;
  var words = [];
  for (var i = 0; i < numberOfWords; ++i) {
    words.push(wordList[randomInt(startWordIdx, endWordIdx)]);
  }
  return words;
}
function sometimes(howOftenOneToFifty) {
  howOftenOneToFifty = howOftenOneToFifty || 100;
  for (var i = 0; i < howOftenOneToFifty; ++i) {
    if (randomInt(0, 100) === 0) {
      return true;
    }
  }
  return false;
}
function randomInt(low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}
function generateHtml(wordCount) {
  wordCount = wordCount || 1000;
  var words = getWords(wordCount);
  var html = '<html><head><h1>'
  html += getSentence(randomInt(4, 8));
  html += '</h1></head><body>';
  var para = '';
  for (var i = 0; i < wordCount; ++i) {
    para += words[i] + ' ';
    if (sometimes(2)) {
      html += '<p>' + para + '</p>';
      para = '';
    }
  }
  html += '</body></html>';
  return html;
}
