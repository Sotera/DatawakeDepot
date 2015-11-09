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
var wordList = require('word-list-json');
var htmlToText = require('html-to-text');
var JSZip = require('jszip');
for (var i = 0; i < wordList.length; ++i) {
  wordList[i] = wordList[i].charAt(0).toUpperCase() + wordList[i].slice(1);
}
module.exports = function (app) {
  app.post('/textToHtml', function (req, res) {
    try {
      var zippedScrapePackage = req.body;
      res.status(200).end();
      var zip = new JSZip();
      zip.load(zippedScrapePackage.scrapedContent);
      var html = zip.file('zipped-html-body.zip').asText();
      var textFromHtml = htmlToText.fromString(html, {
        tables: true,
        wordwrap: null,
        linkHrefBaseUrl: zippedScrapePackage.url,
        ignoreHref: true,
        ignoreImage: true
      });
      log(textFromHtml);
    }
    catch (err) {
      log(err);
    }
  });
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
    async.series([
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
        //Create data relationships amongst users, teams & domains
        async.series([
            async.apply(linkSomeHasAndBelongsToMany, createdTestUsers, 'teams', createdTestTeams)
            , async.apply(linkSomeHasAndBelongsToMany, createdTestTeams, 'domains', createdTestDomains)
          ],
          function (err, result) {
            if (err) {
              log(err);
              res.end('<h1>Test Data Created!</h2>');
              return;
            }
            //Now swap in a createdTestTeams that has the domains property filled out
            //And swap in a createdTestUsers that has the teams property filled out
            AminoUser.find({include: ['teams']}, function (err, testUsers) {
              async.map(testUsers, function (testUser, cb) {
                testUser.teams({include: ['domains']}, function (err, teams) {
                  async.map(teams, function (team, cb) {
                    team.deepDomains = [];
                    team.domains(function (err, domains) {
                      domains.forEach(function (domain) {
                        team.deepDomains.push(domain);
                      });
                      cb(err, domains);
                    });
                  }, function (err, domains) {
                    cb(err, teams);
                  });
                });
              }, function (err, results) {
                if (err) {
                  log(err);
                  res.end('<h1>Test Data Created!</h2>');
                  return;
                }
                createdTestUsers = [];
                for (var i = 0; i < testUsers.length; ++i) {
                  if (results[i] && results[i].length) {
                    testUsers[i].deepTeams = results[i];
                    createdTestUsers.push(testUsers[i]);
                  }
                }
                //Now we can create some trails
                async.series([
                    createTestTrails,
                    createTestDomainEntityTypes,
                    createTestDomainItems,
                    createTestTrailUrls,
                    createTestUrlExtractions
                  ], function (err, results) {
                    res.end('<h1>Test Data Created!</h2>');
                  }
                );
              });
            });
          });
      }
    );
    function createTestTrailUrls(cb) {
      createCollectionEntry({
        url: 'http://www.__moniker__.net',
        scrapedContent: '__htmlContent__',
        comments: '__commentsContent__',
        dwTrailId: '__trailId__'
      }, DwTrailUrl, 5, 10, function (err, results) {
        createdTestTrailUrls = results;
        cb(err, results);
      });
    }

    function createTestDomainItems(cb) {
      createCollectionEntry({
        name: 'DomainItem___search-moniker__',
        coreItem: randomInt(0, 2),
        dwDomainEntityTypeId: '__domainEntityTypeId__',
        description: 'The __moniker__ DomainItem',
        itemValue: '__aWord__',
        users: '__hasAndBelongsToManyUsers__',
        dwDomainId: '__domainId__'
      }, DwDomainItem, 100, 200, function (err, result) {
        cb(err, result);
      });
    }

    function createTestDomainEntityTypes(cb) {
      createCollectionEntry({
        name: 'DomainEntityType___search-moniker__',
        description: 'The __moniker__ DomainEntityType',
        users: '__hasAndBelongsToManyUsers__',
        dwDomainId: '__domainId__'
      }, DwDomainEntityType, 5, 10, function (err, results) {
        createdTestDomainEntityTypes = results;
        cb(err, results);
      });
    }

    function createTestTrails(cb) {
      createCollectionEntry({
        name: 'Trail___search-moniker__',
        description: 'The __moniker__ Trail',
        users: '__hasAndBelongsToManyUsers__',
        dwTeamId: '__teamId__',
        dwDomainId: '__domainId__'
      }, DwTrail, 5, 10, function (err, results) {
        createdTestTrails = results;
        cb(err, results);
      });
    }

    function createTestUrlExtractions(cb) {
      var cheerio = require('cheerio');
      var numberOfTrailUrlExtractions = randomInt(25, 75);
      var functionArray = [];
      for (var i = 0; i < numberOfTrailUrlExtractions; ++i) {
        var trailUrl = shuffle(createdTestTrailUrls)[0];
        var trailUrlId = trailUrl.id.toString();
        var domainEntityType = shuffle(createdTestDomainEntityTypes)[0];
        var domainEntityTypeId = domainEntityType.id.toString();
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
              dwTrailUrlId: trailUrlId
            }));
        }
      }
      async.series(functionArray, function (err, trailUrlExtractions) {
        cb(err, trailUrlExtractions);
      });
    }

    function createCollectionEntry(objectTemplate, collection, minCount, maxCount, cb) {
      var numberOfEntries = randomInt(minCount, maxCount);
      var words = getWords(numberOfEntries);
      var users = [];
      var teamId = '';
      var domainId = '';
      var functionArray = [];
      for (var i = 0; i < words.length; ++i) {
        var moniker = words[i];
        var searchProperty = '';
        var searchPropertyValue = '';
        var objectToInsert = {};
        deepExtend(objectToInsert, objectTemplate);
        for (var property in objectToInsert) {
          if (typeof objectToInsert[property] == 'string') {
            if (objectToInsert[property].indexOf('__search-moniker__') != -1) {
              objectToInsert[property] = objectToInsert[property].replace('__search-moniker__', moniker);
              searchProperty = property;
              searchPropertyValue = objectToInsert[property];
            } else if (objectToInsert[property].indexOf('__teamId__') != -1) {
              objectToInsert[property] = teamId;
            } else if (objectToInsert[property].indexOf('__domainEntityTypeId__') != -1) {
              var domainEntityTypeId = shuffle(createdTestDomainEntityTypes)[0].id.toString();
              objectToInsert[property] = domainEntityTypeId;
            } else if (objectToInsert[property].indexOf('__trailId__') != -1) {
              var trailId = shuffle(createdTestTrails)[0].id.toString();
              objectToInsert[property] = trailId;
            } else if (objectToInsert[property].indexOf('__aWord__') != -1) {
              objectToInsert[property] = getWords(10)[5];
            } else if (objectToInsert[property].indexOf('__domainId__') != -1) {
              objectToInsert[property] = domainId;
            } else if (objectToInsert[property].indexOf('__htmlContent__') != -1) {
              objectToInsert[property] = generateHtml();
            } else if (objectToInsert[property].indexOf('__commentsContent__') != -1) {
              objectToInsert[property] = getSentence(40);
            } else if (objectToInsert[property].indexOf('__hasAndBelongsToManyUsers__') != -1) {
              users = shuffle(createdTestUsers).slice(1, 3);
              var team = shuffle(users[0].deepTeams)[0];
              teamId = team.id.toString();
              var domain = shuffle(team.deepDomains)[0];
              domainId = domain.id.toString();
            } else {
              objectToInsert[property] = objectToInsert[property].replace('__moniker__', moniker);
            }
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

    function linkSomeHasAndBelongsToMany(firstArray, firstProperty, secondArray, cb) {
      var functionArray = [];
      firstArray.forEach(function (firstArrayElement) {
        //Get random half of the second array
        var randomHalfSecondArray = shuffle(secondArray).slice(0, secondArray.length / 2);
        //Add each second array element to firstArray[firstProperty]
        randomHalfSecondArray.forEach(function (randomHalfSecondArrayElement) {
          functionArray.push(async.apply(addObjectToEmbeddedList,
            firstArrayElement[firstProperty],
            randomHalfSecondArrayElement));
        });
      });
      async.series(functionArray, function (err, results) {
        cb(err, results);
      });
    }

    function addObjectToEmbeddedList(list, obj, cb) {
      list.add(obj, function (err, results) {
        cb(err, results);
      });
    }

    function createTestTeams(cb) {
      createCollectionEntry({
        name: 'Team___search-moniker__',
        description: 'The __moniker__ Team'
      }, DwTeam, 5, 10, function (err, result) {
        cb(err, result);
      });
    }

    function createTestDomains(cb) {
      createCollectionEntry({
        name: 'Domain___search-moniker__',
        description: 'The __moniker__ Domain'
      }, DwDomain, 5, 10, function (err, result) {
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
      }, AminoUser, 5, 10, function (err, result) {
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
var thousandSixLetterWords = [];
function getWords(numberOfWords, minWordLength, maxWordLength) {
  if (!thousandSixLetterWords.length) {
    var wordListCursor = 0;
    while (wordList[++wordListCursor].length < 6);
    var startWordIdx = wordListCursor;
    while (wordList[++wordListCursor].length <= 6);
    var endWordIdx = wordListCursor;
    thousandSixLetterWords = shuffle(wordList.slice(startWordIdx, endWordIdx)).slice(0, 1000);
  }
  return shuffle(thousandSixLetterWords).slice(0, numberOfWords);
  //Use them all
  /*  numberOfWords = numberOfWords || 250;
   minWordLength = minWordLength || 5;
   maxWordLength = maxWordLength || 7;
   var wordListCursor = 0;
   while (wordList[++wordListCursor].length < minWordLength);
   var startWordIdx = wordListCursor;
   while (wordList[++wordListCursor].length <= maxWordLength);
   var endWordIdx = wordListCursor;
   var words = [];
   for (var i = 0; i < numberOfWords; ++i) {
   words.push(wordList[randomInt(startWordIdx, endWordIdx)]);
   }
   return words;*/
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
  wordCount = wordCount || 900;
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

