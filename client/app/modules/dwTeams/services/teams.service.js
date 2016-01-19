'use strict';
var app = angular.module('com.module.dwTeams');

app.service('TeamsService', ['$state', 'CoreService', 'DwTeam', 'gettextCatalog', function($state, CoreService, DwTeam, gettextCatalog) {

  this.getTeams = function() {
    return DwTeam.find({
        filter: {
            include: [
                'trails',
                {relation:'domains',
                    scope:{
                        fields:[
                            "name",
                            "description",
                            "id"
                        ]
                    }
                },
                'users'
            ]
        }
    });
  };

  this.getTeam = function(id) {
    return DwTeam.findById({
      id: id
    });
  };

  this.getUserTeams = function(aminoUser) {
      return DwTeam.find({
          filter: {
              include: [
                  'trails',
                  {relation:'domains',
                      scope:{
                          fields:[
                              "name",
                              "description",
                              "id"
                          ]
                      }
                  },
                  {relation:'users',
                  scope:{
                      where:{
                          id: aminoUser.id
                      }
                  }}
              ]
          }
      });
  };

  this.upsertTeam = function(team, cb) {
    DwTeam.upsert(team, function(newTeam) {
      CoreService.toastSuccess(gettextCatalog.getString('Team saved'), gettextCatalog.getString('Your team is safe with us!'));

      //TODO: We must first remove all linked items before adding them, otherwise we can't account for removed links

      //For Many-To-Many relationships you MUST manually link the two models for INCLUDE to work in relationships
      if(team.dwDomains) {
          team.dwDomains.forEach(function (domain) {
              DwTeam.domains.link({id: newTeam.id, fk: domain}, null, function (value, header) {
                  //success
              });
          });
      };

      if(team.users) {
          team.users.forEach(function (user) {
              DwTeam.users.link({id: newTeam.id, fk: user}, null, function (value, header) {
                  //success
              });
          });
      };

      if(team.dwFeeds) {
          team.dwFeeds.forEach(function (feed) {
              DwTeam.feeds.link({id: newTeam.id, fk: feed}, null, function (value, header) {
                  //success
              });
          });
      }
      cb();
    }, function(err) {
      CoreService.toastSuccess(gettextCatalog.getString(
        'Error saving team '), gettextCatalog.getString(
        'This team could not be saved: ') + err);
    });
  };

  this.deleteTeam = function(team, cb) {
    CoreService.confirm(gettextCatalog.getString('Are you sure?'),
      gettextCatalog.getString('Deleting this cannot be undone'),
      function() {
        DwTeam.deleteById(team.id, function() {
          CoreService.toastSuccess(gettextCatalog.getString('Team deleted'), gettextCatalog.getString('Your team is deleted!'));

          //For Many-To-Many relationships you MUST manually link the two models for INCLUDE to work in relationships
          if(team.dwDomains) {
              team.dwDomains.forEach(function (domain) {
                  DwTeam.domains.unlink({id: team.id, fk: domain}, null, function (value, header) {
                      //success
                  });
              });
          };

          if(team.users) {
              team.users.forEach(function (user) {
                  DwTeam.users.unlink({id: team.id, fk: user}, null, function (value, header) {
                      //success
                  });
              });
          };

          if(team.dwFeeds) {
              team.dwFeeds.forEach(function (feed) {
                  DwTeam.feeds.unlink({id: team.id, fk: feed}, null, function (value, header) {
                      //success
                  });
              });
          };
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
