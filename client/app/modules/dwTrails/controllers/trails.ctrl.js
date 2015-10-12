'use strict';
var app = angular.module('com.module.dwTrails');

app.controller('TrailsCtrl', function($scope, $state, $stateParams, TrailsService, gettextCatalog, AppAuth) {

  //Put the currentUser in $scope for convenience
  $scope.currentUser = AppAuth.currentUser;

  $scope.trail = {};
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
      key: 'timestamp',
      type: 'input',
      templateOptions: {
          label: gettextCatalog.getString('Timestamp'),
          disabled: true,
          required: false
      }
  }];


  $scope.delete = function(id) {
    TrailsService.deleteTrail(id, function() {
      $scope.trails = TrailsService.getTrails();
      $state.go('^.list');
    });
  };

  $scope.onSubmit = function() {
    TrailsService.upsertTrail($scope.trail, function() {
      $scope.trails = TrailsService.getTrails();
      $state.go('^.list');
    });
  };

  $scope.trails = TrailsService.getTrails();

  if ($stateParams.id) {
    TrailsService.getTrail($stateParams.id).$promise.then(function(result){
      $scope.trail = result;})
  } else {
    $scope.trail = {};
  }

  $scope.getDomains = function () {
    return [];
  }

});

