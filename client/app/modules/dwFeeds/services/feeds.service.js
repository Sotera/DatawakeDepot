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
    DwFeed.upsert(feed, function() {
      CoreService.toastSuccess(gettextCatalog.getString(
          'Feed saved'), gettextCatalog.getString(
          'Your feed is safe with us!'));
      cb();
    }, function(err) {
      CoreService.toastSuccess(gettextCatalog.getString(
          'Error saving feed '), gettextCatalog.getString(
              'This feed could no be saved: ') + err);
    });
  };

  this.deleteFeed = function(id, cb) {
    CoreService.confirm(gettextCatalog.getString('Are you sure?'),
        gettextCatalog.getString('Deleting this cannot be undone'),
        function() {
          DwFeed.deleteById(id, function() {
            CoreService.toastSuccess(gettextCatalog.getString(
                'Feed deleted'), gettextCatalog.getString(
                'Your feed is deleted!'));
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
