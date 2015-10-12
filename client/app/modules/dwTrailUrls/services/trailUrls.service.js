'use strict';
var app = angular.module('com.module.dwTrailUrls');

app.service('TrailUrlsService', ['$state', 'CoreService', 'DwTrailUrl', 'gettextCatalog', function($state, CoreService, DwTrailUrl, gettextCatalog) {

  this.getTrailUrls = function() {
    return DwTrailUrl.find();
  };

  this.getTrailUrl = function(id) {
    return DwTrailUrl.findById({
      id: id
    });
  };

  this.upsertTrailUrl = function(trailUrl, cb) {
    DwTrailUrl.upsert(trailUrl, function() {
      CoreService.toastSuccess(gettextCatalog.getString(
        'TrailUrl saved'), gettextCatalog.getString(
        'Your trailUrl is safe with us!'));
      cb();
    }, function(err) {
      CoreService.toastSuccess(gettextCatalog.getString(
        'Error saving trailUrl '), gettextCatalog.getString(
        'This trailUrl could no be saved: ') + err);
    });
  };

  this.deleteTrailUrl = function(id, cb) {
    CoreService.confirm(gettextCatalog.getString('Are you sure?'),
      gettextCatalog.getString('Deleting this cannot be undone'),
      function() {
        DwTrailUrl.deleteById(id, function() {
          CoreService.toastSuccess(gettextCatalog.getString(
            'TrailUrl deleted'), gettextCatalog.getString(
            'Your trailUrl is deleted!'));
          cb();
        }, function(err) {
          CoreService.toastError(gettextCatalog.getString(
            'Error deleting trailUrl'), gettextCatalog.getString(
            'Your trailUrl is not deleted! ') + err);
        });
      },
      function() {
        return false;
      });
  };

}]);
