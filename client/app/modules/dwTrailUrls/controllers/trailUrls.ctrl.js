'use strict';
var app = angular.module('com.module.dwTrailUrls');

app.controller('TrailUrlsCtrl', function($scope, $state, $stateParams, DwTrailUrl, TrailUrlsService, gettextCatalog, AppAuth) {

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

  $scope.trailUrls = TrailUrlsService.getTrailUrls();

  $scope.loading = true;
  DwTrailUrl.find({filter: {include: []}}).$promise
      .then(function (allTrailUrls) {
        $scope.safeDisplayedtrailUrls = allTrailUrls;
        $scope.displayedTrailUrls = [].concat($scope.safeDisplayedtrailUrls);
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {
        $scope.loading = false;
      });

  if ($stateParams.id) {
    TrailUrlsService.getTrailUrl($stateParams.id).$promise.then(function(result){
      $scope.trailUrl = result;})
  } else {
    $scope.trailUrl = {};
  }

  $scope.getDomains = function () {
    return [];
  }

  //Search Functionality
  function arrayObjectIndexOf(myArray, searchTerm, property) {
    for (var i = 0, len = myArray.length; i < len; i++) {
      if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
  }
  $scope.aToB = function () {
    for (var i in $scope.selectedA) {
      var moveId = arrayObjectIndexOf($scope.items, $scope.selectedA[i], "id");
      $scope.listB.push($scope.items[moveId]);
      var delId = arrayObjectIndexOf($scope.listA, $scope.selectedA[i], "id");
      $scope.listA.splice(delId, 1);
    }
    reset();
  };
  $scope.bToA = function () {
    for (var i in $scope.selectedB) {
      var moveId = arrayObjectIndexOf($scope.items, $scope.selectedB[i], "id");
      $scope.listA.push($scope.items[moveId]);
      var delId = arrayObjectIndexOf($scope.listB, $scope.selectedB[i], "id");
      $scope.listB.splice(delId, 1);
    }
    reset();
  };
  function reset() {
    $scope.selectedA = [];
    $scope.selectedB = [];
    $scope.toggle = 0;
  }

  $scope.toggleA = function () {
    if ($scope.selectedA.length > 0) {
      $scope.selectedA = [];
    }
    else {
      for (var i in $scope.listA) {
        $scope.selectedA.push($scope.listA[i].id);
      }
    }
  }
  $scope.toggleB = function () {
    if ($scope.selectedB.length > 0) {
      $scope.selectedB = [];
    }
    else {
      for (var i in $scope.listB) {
        $scope.selectedB.push($scope.listB[i].id);
      }
    }
  }
  $scope.selectA = function (i) {
    $scope.selectedA.push(i);
  };
  $scope.selectB = function (i) {
    $scope.selectedB.push(i);
  };

});

