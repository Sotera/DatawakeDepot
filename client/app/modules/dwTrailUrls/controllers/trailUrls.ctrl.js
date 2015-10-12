'use strict';
var app = angular.module('com.module.dwTrailUrls');

app.controller('TrailUrlsCtrl', function($scope, $state, $stateParams, TrailUrlsService, gettextCatalog, AppAuth) {

  //Put the currentUser in $scope for convenience
  $scope.currentUser = AppAuth.currentUser;

  $scope.trailUrl = {};
  $scope.formFields = [{
    key: 'id',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('id'),
      disabled: true
    }
  },{
    key: 'url',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Url'),
      required: true
    }
  },{
    key: 'trailId',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Trail'),
      required: true
    }
  },{
    key: 'crawlType',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('CrawlType'),
      required: false
    }
  }, {
    key: 'timestamp',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Timestamp'),
      required: false,
      disabled: true
    }
  }, {
    key: 'comments',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Comments'),
      disabled: false,
      required: false
    }
  }];


  $scope.delete = function(id) {
    TrailUrlsService.deleteTrailUrl(id, function() {
      $scope.trailUrls = TrailUrlsService.getTrailUrls();
      $state.go('^.list');
    });
  };

  $scope.onSubmit = function() {
    TrailUrlsService.upsertTrailUrl($scope.trailUrl, function() {
      $scope.trailUrls = TrailUrlsService.getTrailUrls();
      $state.go('^.list');
    });
  };

  $scope.trailUrls = TrailUrlsService.getTrailUrls();

  if ($stateParams.id) {
    TrailUrlsService.getTrailUrl($stateParams.id).$promise.then(function(result){
      $scope.trailUrl = result;})
  } else {
    $scope.trailUrl = {};
  }

  $scope.getDomains = function () {
    return [];
  }

});

