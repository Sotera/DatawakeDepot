'use strict';
var app = angular.module('com.module.dwTeams');

app.controller('TeamsCtrl', function($scope, $state, $stateParams, TeamsService, gettextCatalog, AppAuth) {

  //Put the currentUser in $scope for convenience
  $scope.currentUser = AppAuth.currentUser;

  $scope.team = {};
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
  }];


  $scope.delete = function(id) {
    TeamsService.deleteTeam(id, function() {
      $scope.teams = TeamsService.getTeams();
      $state.go('^.list');
    });
  };

  $scope.onSubmit = function() {
    TeamsService.upsertTeam($scope.team, function() {
      $scope.teams = TeamsService.getTeams();
      $state.go('^.list');
    });
  };

  $scope.teams = TeamsService.getTeams();

  if ($stateParams.id) {
    TeamsService.getTeam($stateParams.id).$promise.then(function(result){
      $scope.team = result;})
  } else {
    $scope.team = {};
  }

  $scope.getDomains = function () {
    return [];
  }

});

