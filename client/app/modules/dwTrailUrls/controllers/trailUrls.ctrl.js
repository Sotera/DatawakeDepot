'use strict';
var app = angular.module('com.module.dwTrailUrls');

app.controller('TrailUrlsCtrl', function($scope, $state, $stateParams, DwCrawlType, DwTrailUrl, TrailUrlsService, gettextCatalog, AppAuth) {

  //Put the currentUser in $scope for convenience
  $scope.currentUser = AppAuth.currentUser;
  $scope.crawlTypes = [];

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
  }, {
    key: 'crawlTypeId',
    type: 'select',
    templateOptions: {
      label: gettextCatalog.getString('CrawlType'),
      options: $scope.crawlTypes,
      valueProp: 'id',
      labelProp: 'name',
      required: true,
      disabled: false
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
      $scope.safeDisplayedtrailUrls = TrailUrlsService.getTrailUrls();
      $state.go('^.list');
    });
  };

  $scope.onSubmit = function() {
    TrailUrlsService.upsertTrailUrl($scope.trailUrl, function() {
      $scope.safeDisplayedtrailUrls = TrailUrlsService.getTrailUrls();
      $state.go('^.list');
    });
  };

  $scope.loading = true;
  DwTrailUrl.find({filter: {include: ['trail','crawlType']}}).$promise
      .then(function (allTrailUrls) {
        $scope.safeDisplayedtrailUrls = allTrailUrls;
        $scope.displayedTrailUrls = [].concat($scope.safeDisplayedtrailUrls);
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {
        $scope.loading = false;
      }
  );

  DwCrawlType.find({filter: {include: []}}).$promise
      .then(function (allCrawlTypes) {
          for (var i = 0; i < allCrawlTypes.length; ++i) {
              $scope.crawlTypes.push({
                  value: allCrawlTypes[i].name,
                  name: allCrawlTypes[i].description,
                  id: allCrawlTypes[i].id
              });
          }
      })
      .catch(function (err) {
          console.log(err);
      })
      .then(function () {
      }
  );

  if ($stateParams.id) {
    TrailUrlsService.getTrailUrl($stateParams.id).$promise.then(function(result){
      $scope.trailUrl = result;})
  } else {
    $scope.trailUrl = {};
  }

});

