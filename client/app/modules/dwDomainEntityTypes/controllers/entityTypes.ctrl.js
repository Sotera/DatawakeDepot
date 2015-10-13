'use strict';
var app = angular.module('com.module.dwDomainEntityTypes');

app.controller('EntityTypesCtrl', function($scope, $state, $stateParams, EntityTypesService, gettextCatalog, AppAuth) {

  //Put the currentUser in $scope for convenience
  $scope.currentUser = AppAuth.currentUser;

  $scope.entityType = {};
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
      key: 'domainId',
      type: 'input',
      templateOptions: {
          label: gettextCatalog.getString('Domain'),
          disabled: true,
          required: false
      }
  }];


  $scope.delete = function(id) {
    EntityTypesService.deleteEntityType(id, function() {
      $scope.entityTypes = EntityTypesService.getEntityTypes();
      $state.go('^.list');
    });
  };

  $scope.onSubmit = function() {
    EntityTypesService.upsertEntityType($scope.entityType, function() {
      $scope.entityTypes = EntityTypesService.getEntityTypes();
      $state.go('^.list');
    });
  };

  $scope.entityTypes = EntityTypesService.getEntityTypes();

  if ($stateParams.id) {
    EntityTypesService.getEntityType($stateParams.id).$promise.then(function(result){
      $scope.entityType = result;})
  } else {
    $scope.entityType = {};
  }

  $scope.getDomains = function () {
    return [];
  }

});

