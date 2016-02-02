'use strict';
var app = angular.module('com.module.dwTrails');

app.service('TrailsService', ['$state', 'CoreService', 'DwDomain','DwTrail', 'DwTrailUrl', 'DwUrlExtraction', 'DwCrawlType', 'DwDomainEntityType','DwDomainItem', 'DwTeam','gettextCatalog', function($state, CoreService, DwDomain, DwTrail, DwTrailUrl, DwUrlExtraction, DwCrawlType, DwDomainEntityType, DwDomainItem, DwTeam, gettextCatalog) {

  this.getTrail = function(id) {
      //return DwTrail.findById({
      //    id: id
      //});

      var whereClause = {
          id: id,

          filter:{
              include:
                  [
                      {relation: 'domain',
                          scope:{
                              fields:['name','description','id'],
                              include:[
                                  'domainItems',
                                  'domainEntityTypes'
                              ]
                          }
                      },
                      {relation:'trailUrls',
                          scope:{
                              fields: [
                                  'url',
                                  'searchTerms',
                                  'comments',
                                  'timestamp',
                                  'id',
                                  'dwTrailId',
                                  'dwTrailUrlId'
                              ],
                              include:['urlExtractions']
                          }
                      }
                  ]
              }
      };

      return (DwTrail.findById(whereClause));
  };

  this.getTrails = function() {
    return DwTrail.find({
        filter:
            {include:
                [
                    'domain',
                    'users',
                    'trailUrls'
                ]
            }
    });
  };

  this.getUserTrails = function(domainList) {
      return DwTrail.find({
          filter:{
            where:{
                dwDomainId:{inq:domainList}
            },
            include:
              [
                  'domain',
                  'users',
                  'trailUrls'
              ]
          }
      });
  };

  this.getUserTeamTrails = function(teamList) {
      var userTeams = [];
      teamList.forEach(function (team) {
          userTeams.push(team.id);
      });
      return DwTrail.find({
          filter:{
              where:{
                  dwTeamId:{inq:userTeams}
              },
              include:
                  [
                      'domain',
                      'users',
                      'trailUrls'
                  ]
          }
      });
  };

  this.upsertTrail = function(trail, cb) {

      //TODO: I think we can create the team and domain first, then use the object reference of each to replace the
      //dwDomainId and dwTeamId on the trail object so that we get bidirectional lookup
      DwTrail.upsert(trail, function (newTrail) {
          CoreService.toastSuccess(gettextCatalog.getString('Trail saved'), gettextCatalog.getString('Your trail is safe with us!'));

          //For Many-To-Many relationships you MUST manually link the two models for INCLUDE to work in relationships
          if (trail.dwFeeds) {
              trail.dwFeeds.forEach(function (feed) {
                  DwTrail.feeds.link({id: newTrail.id, fk: feed}, null, function (value, header) {
                      //success
                  });
              });
          }

          if (trail.AminoUsers) {
              trail.AminoUsers.forEach(function (user) {
                  DwTrail.users.link({id: newTrail.id, fk: user}, null, function (value, header) {
                      //success
                  });
              });
          }

          //For other relationships you MUST manually add the items
          if (trail.team) {
              DwTeam.upsert(trail.team, function () {
                  //success
              })
          }

          if (trail.domain) {
              DwDomain.upsert(trail.domain, function () {
                  //Link this domain to the team
                  DwTeam.domains.link({id: trail.team.id, fk: trail.domain}, null, function (value, header) {
                      //success
                      //alert('domain/team linked');
                  });
                  if (trail.domain.domainEntityTypes) {
                      trail.domain.domainEntityTypes.forEach(function (det) {
                          DwDomainEntityType.upsert(det, function () {
                              //success
                          }, function (err) {
                          });
                      });
                  }
                  if (trail.domain.domainItems) {
                      trail.domain.domainItems.forEach(function (di) {
                          DwDomainItem.upsert(di, function () {
                              //success
                          }, function (err) {
                          });
                      });
                  }
              })
          }

          if (trail.trailUrls) {
              trail.trailUrls.forEach(function (tu) {
                  DwTrailUrl.upsert(tu, function () {
                      //success
                      if (tu.urlExtractions) {
                          tu.urlExtractions.forEach(function (ex) {
                              DwUrlExtraction.upsert(ex, function () {
                                  //success
                              }, function (err) {
                              });
                          });
                      }
                      if (trail.crawlType) {
                          DwCrawlType.upsert(trail.crawlType, function () {
                              //success
                          });
                      }
                  });
              });
          }
          cb();
      }, function (err) {
          CoreService.toastSuccess(gettextCatalog.getString(
              'Error saving trail '), gettextCatalog.getString(
                  'This trail could not be saved: ') + err);
      });
  };

  this.deleteTrail = function(trail, cb) {
    CoreService.confirm(gettextCatalog.getString('Are you sure?'),
      gettextCatalog.getString('Deleting this cannot be undone'),
      function() {
        //For Many-To-Many relationships you MUST manually unlink the entities before deleting the trail
        if(trail.id.AminoUsers) {
            trail.id.AminoUsers.forEach(function (user) {
                DwTrail.users.unlink({id: trail.id.id, fk: user}, null, function (value, header) {
                    //success
                });
            });
        }
        if(trail.id.feeds) {
            trail.id.feeds.forEach(function (feed) {
                DwTrail.feeds.unlink({id: trail.id, fk: feed}, null, function (value, header) {
                    //success
                });
            });
        }

        //Now delete the Trail
        DwTrail.deleteById(trail.id, function() {
          CoreService.toastSuccess(gettextCatalog.getString('Trail deleted'), gettextCatalog.getString('Your trail is deleted!'));
          if(trail.id.trailUrls) {
              trail.id.trailUrls.forEach(function (tu) {
                  DwTrailUrl.delete(tu, function() {
                      //success
                      if (tu.urlExtractions) {
                          tu.urlExtractions.forEach(function (ex) {
                              DwUrlExtraction.delete(ex, function () {
                                  //success
                              }, function (err) {
                              });
                          });
                      }
                  });
              });
          }

          cb();
        }, function(err) {
          CoreService.toastError(gettextCatalog.getString(
            'Error deleting trail'), gettextCatalog.getString(
            'Your trail is not deleted! ') + err);
        });
      },
      function() {
        return false;
      });
  };

}]);
