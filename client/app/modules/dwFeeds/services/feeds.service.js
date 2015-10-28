'use strict';
var app = angular.module('com.module.dwFeeds');

app.service('FeedsService', ['$state', 'CoreService', 'DwFeed', 'gettextCatalog', function($state, CoreService, DwFeed, gettextCatalog) {

  this.getFeeds = function() {
    return DwFeed.find();
  };

  this.getFeed = function(id) {
    return DwFeed.findById({
      id: id
    });
  };

  this.upsertFeed = function(feed, cb) {
    DwFeed.upsert(feed, function(newFeedId) {
      CoreService.toastSuccess(gettextCatalog.getString('Feed saved'), gettextCatalog.getString('Your feed is safe with us!'));

      //TODO: We must first remove all linked items before adding them, otherwise we can't account for removed links

      //For Many-To-Many relationships you MUST manually link the two models for INCLUDE to work in relationships
      if(feed.dwDomains) {
          feed.dwDomains.forEach(function (domain) {
              DwFeed.domains.link({id: newFeedId.id, fk: domain}, null, function (value, header) {
                  //success
              });
          });
      };

      if(feed.dwTrails) {
          feed.dwTrails.forEach(function (trail) {
              DwFeed.trails.link({id: newFeedId.id, fk: trail}, null, function (value, header) {
                  //success
              });
          });
      };

      if(feed.dwTeams) {
          feed.dwTeams.forEach(function (team) {
              DwFeed.teams.link({id: newFeedId.id, fk: team}, null, function (value, header) {
                  //success
              });
          });
      };
      cb();
    }, function(err) {
      CoreService.toastSuccess(gettextCatalog.getString(
          'Error saving feed '), gettextCatalog.getString(
              'This feed could no be saved: ') + err);
    });
  };

  this.deleteFeed = function(feed, cb) {
    CoreService.confirm(gettextCatalog.getString('Are you sure?'),
        gettextCatalog.getString('Deleting this cannot be undone'),
        function() {
          DwFeed.deleteById(feed.id, function() {
            CoreService.toastSuccess(gettextCatalog.getString('Feed deleted'), gettextCatalog.getString('Your feed is deleted!'));

            //For Many-To-Many relationships you MUST manually link the two models for INCLUDE to work in relationships
            if(feed.dwDomains) {
                feed.dwDomains.forEach(function (domain) {
                    DwFeed.domains.unlink({id: feed.id, fk: domain}, null, function (value, header) {
                        //success
                    });
                });
            };

            if(feed.dwTrails) {
                feed.dwTrails.forEach(function (trail) {
                    DwFeed.trails.unlink({id: feed.id, fk: trail}, null, function (value, header) {
                        //success
                    });
                });
            };

            if(feed.dwTeams) {
                feed.dwTeams.forEach(function (team) {
                    DwFeed.teams.unlink({id: feed.id, fk: team}, null, function (value, header) {
                        //success
                    });
                });
            };
            cb();
          }, function(err) {
            CoreService.toastError(gettextCatalog.getString(
                'Error deleting feed'), gettextCatalog.getString(
                    'Your feed is not deleted! ') + err);
          });
        },
        function() {
          return false;
        });
  };

}]);
