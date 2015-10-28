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
    DwTrail.upsert(trail, function(newTrail) {
      CoreService.toastSuccess(gettextCatalog.getString('Trail saved'), gettextCatalog.getString('Your trail is safe with us!'));

      //For Many-To-Many relationships you MUST manually link the two models for INCLUDE to work in relationships
      if(trail.dwFeeds) {
          trail.dwFeeds.forEach(function (feed) {
              DwTrail.feeds.link({id: newTrail.id, fk: feed}, null, function (value, header) {
                  //success
              });
          });
      };

      if(trail.AminoUsers) {
          trail.AminoUsers.forEach(function (user) {
              DwTrail.users.link({id: newTrail.id, fk: user}, null, function (value, header) {
                  //success
              });
          });
      };

      cb();
    }, function(err) {
      CoreService.toastSuccess(gettextCatalog.getString(
        'Error saving trail '), gettextCatalog.getString(
        'This trail could no be saved: ') + err);
    });
  };

  this.deleteTrail = function(trail, cb) {
    CoreService.confirm(gettextCatalog.getString('Are you sure?'),
      gettextCatalog.getString('Deleting this cannot be undone'),
      function() {
        DwTrail.deleteById(trail.id, function() {
          CoreService.toastSuccess(gettextCatalog.getString('Trail deleted'), gettextCatalog.getString('Your trail is deleted!'));

          //For Many-To-Many relationships you MUST manually link the two models for INCLUDE to work in relationships
          if(trail.dwFeeds) {
              trail.dwFeeds.forEach(function (feed) {
                  DwTrail.feeds.unlink({id: trail.id, fk: feed}, null, function (value, header) {
                      //success
                  });
              });
          };

          if(trail.AminoUsers) {
              trail.AminoUsers.forEach(function (user) {
                  DwTrail.users.unlink({id: trail.id, fk: user}, null, function (value, header) {
                      //success
                  });
              });
          };
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
