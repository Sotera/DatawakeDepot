'use strict';
var app = angular.module('com.module.dwTeams');

app.service('TeamsService', ['$state', 'CoreService', 'DwTeam', 'gettextCatalog', function($state, CoreService, DwTeam, gettextCatalog) {

  this.getTeams = function() {
    return DwTeam.find();
  };

  this.getTeam = function(id) {
    return DwTeam.findById({
      id: id
    });
  };

  this.upsertTeam = function(team, cb) {
    DwTeam.upsert(team, function() {
      CoreService.toastSuccess(gettextCatalog.getString(
        'Team saved'), gettextCatalog.getString(
        'Your team is safe with us!'));
      cb();
    }, function(err) {
      CoreService.toastSuccess(gettextCatalog.getString(
        'Error saving team '), gettextCatalog.getString(
        'This team could no be saved: ') + err);
    });
  };

  this.deleteTeam = function(id, cb) {
    CoreService.confirm(gettextCatalog.getString('Are you sure?'),
      gettextCatalog.getString('Deleting this cannot be undone'),
      function() {
        DwTeam.deleteById(id, function() {
          CoreService.toastSuccess(gettextCatalog.getString(
            'Team deleted'), gettextCatalog.getString(
            'Your team is deleted!'));
          cb();
        }, function(err) {
          CoreService.toastError(gettextCatalog.getString(
            'Error deleting team'), gettextCatalog.getString(
            'Your team is not deleted! ') + err);
        });
      },
      function() {
        return false;
      });
  };

}]);
