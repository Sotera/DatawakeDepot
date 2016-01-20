'use strict';
var app = angular.module('com.module.dwTeams');

app.controller('TeamsCtrl', function($scope, $state, $stateParams, AminoUser, DwDomain, TeamsService, gettextCatalog, AppAuth) {

  $scope.users = [];
  $scope.domains = [];

  $scope.formFields = [{
      key: 'id',
      type: 'input',
      templateOptions: {
          label: gettextCatalog.getString('id'),
          disabled: true
      }
  },{
    key: 'name',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Name'),
      required: true
    }
  }, {
    key: 'description',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Description'),
      required: false
    }
  }, {
    key: 'teamDomains',
    type: 'multiCheckbox',
    templateOptions: {
      label: 'Domains',
      options: $scope.domains,
      disabled: !$scope.currentUser.isAdmin
    }
  }, {
      key: 'users',
      type: 'multiCheckbox',
      templateOptions: {
          label: 'Users',
          options: $scope.users,
          valueProp: 'id',
          labelProp: 'name',
          disabled: !$scope.currentUser.isAdmin
      }
  }];

  $scope.delete = function(team) {
    TeamsService.deleteTeam(team, function() {
      $scope.safeDisplayedTeams = TeamsService.getTeams();
      $state.go('^.list');
    });
  };

  $scope.onSubmit = function() {
    TeamsService.upsertTeam($scope.team, function() {
      $scope.safeDisplayedTeams = TeamsService.getTeams();
      $state.go('^.list');
    });
  };

  $scope.loadPicklists = function () {
      AminoUser.find({filter: {include: []}}).$promise
          .then(function (allUsers) {
              for (var i = 0; i < allUsers.length; ++i) {
                  $scope.users.push({
                      value: allUsers[i].username,
                      name: allUsers[i].username,
                      id: allUsers[i].id
                  });
              }
          })
          .catch(function (err) {
              console.log(err);
          })
          .then(function () {
          }
      );

      DwDomain.find({filter: {include: []}}).$promise
          .then(function (allDomains) {
              for (var i = 0; i < allDomains.length; ++i) {
                  $scope.domains.push({
                      value: allDomains[i].name,
                      name: allDomains[i].name,
                      id: allDomains[i].id
                  });
              }
          })
          .catch(function (err) {
              console.log(err);
          })
          .then(function () {
          }
      );
  };

  $scope.loading = true;
  AppAuth.getCurrentUser().then(function (currUser) {
      $scope.currentUser = currUser;
      $scope.loadPicklists(currUser);
      if ($stateParams.id) {
          TeamsService.getTeam($stateParams.id).$promise.then(function (result) {
              $scope.team = result[0];
              $scope.safeDisplayedTeams = {};
              $scope.displayedTeams = {};
              $scope.loading = false;
          })
      } else {
          if(currUser.isAdmin){
              TeamsService.getTeams().$promise.then(function (result) {
                  $scope.team = {};
                  $scope.safeDisplayedTeams = result;
                  $scope.displayedTeams = [].concat($scope.safeDisplayedTeams);
                  $scope.loading = false;
              });
          }else {
              TeamsService.getUserTeams(currUser).$promise.then(function (result) {
                  $scope.team = {};
                  $scope.safeDisplayedTeams = result;
                  $scope.displayedTeams = [].concat($scope.safeDisplayedTeams);
                  $scope.loading = false;
              });
          }
      }
  }, function (err) {
      console.log(err);
  });

});

