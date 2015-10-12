'use strict';
var app = angular.module('com.module.dwTrails');

app.service('TrailsService', ['$state', 'CoreService', 'DwTrail', 'gettextCatalog', function($state, CoreService, DwTrail, gettextCatalog) {

  this.getTrails = function() {
    return DwTrail.find();
  };

  this.getTrail = function(id) {
    return DwTrail.findById({
      id: id
    });
  };

  this.upsertTrail = function(trail, cb) {
    DwTrail.upsert(trail, function() {
      CoreService.toastSuccess(gettextCatalog.getString(
        'Trail saved'), gettextCatalog.getString(
        'Your trail is safe with us!'));
      cb();
    }, function(err) {
      CoreService.toastSuccess(gettextCatalog.getString(
        'Error saving trail '), gettextCatalog.getString(
        'This trail could no be saved: ') + err);
    });
  };

  this.deleteTrail = function(id, cb) {
    CoreService.confirm(gettextCatalog.getString('Are you sure?'),
      gettextCatalog.getString('Deleting this cannot be undone'),
      function() {
        DwTrail.deleteById(id, function() {
          CoreService.toastSuccess(gettextCatalog.getString(
            'Trail deleted'), gettextCatalog.getString(
            'Your trail is deleted!'));
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
