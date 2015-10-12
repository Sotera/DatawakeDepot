'use strict';
var app = angular.module('com.module.dwUrlExtractions');

app.controller('UrlExtractionsCtrl', function($scope, $state, $stateParams, UrlExtractionsService, gettextCatalog, AppAuth) {

  //Put the currentUser in $scope for convenience
  $scope.currentUser = AppAuth.currentUser;

  $scope.urlExtraction = {};
  $scope.formFields = [{
    key: 'id',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('id'),
      disabled: true
    }
  },{
    key: 'domainEntityTypeId',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Domain EntityType'),
      required: true
    }
  },{
    key: 'value',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('value'),
      required: true
    }
  },{
    key: 'trailId',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Trail'),
      required: false
    }
  }];


  $scope.delete = function(id) {
    UrlExtractionsService.deleteUrlExtraction(id, function() {
      $scope.urlExtractions = UrlExtractionsService.getUrlExtractions();
      $state.go('^.list');
    });
  };

  $scope.onSubmit = function() {
    UrlExtractionsService.upsertUrlExtraction($scope.urlExtraction, function() {
      $scope.urlExtractions = UrlExtractionsService.getUrlExtractions();
      $state.go('^.list');
    });
  };

  $scope.urlExtractions = UrlExtractionsService.getUrlExtractions();

  if ($stateParams.id) {
    UrlExtractionsService.getUrlExtraction($stateParams.id).$promise.then(function(result){
      $scope.urlExtraction = result;})
  } else {
    $scope.urlExtraction = {};
  }

  $scope.getDomains = function () {
    return [];
  }

});

