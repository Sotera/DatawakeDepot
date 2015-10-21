'use strict';
var app = angular.module('com.module.dwUrlExtractions');

app.controller('UrlExtractionsCtrl', function($scope, $state, $stateParams, DwDomainEntityType, DwTrail, DwUrlExtraction, UrlExtractionsService, gettextCatalog, AppAuth) {

  //Put the currentUser in $scope for convenience
  $scope.currentUser = AppAuth.currentUser;
  $scope.trails = [];
  $scope.domainEntityTypes = [];

  $scope.formFields = [{
    key: 'id',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('id'),
      disabled: true
    }
  }, {
    key: 'domainEntityTypeId',
    type: 'select',
    templateOptions: {
      label: gettextCatalog.getString('EntityType'),
      options: $scope.domainEntityTypes,
      valueProp: 'id',
      labelProp: 'name',
      required: true,
      disabled: false
    }
  },{
    key: 'value',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Value'),
      required: true
    }
  }, {
    key: 'trailId',
    type: 'select',
    templateOptions: {
      label: gettextCatalog.getString('Trail'),
      options: $scope.trails,
      valueProp: 'id',
      labelProp: 'name',
      required: true,
      disabled: false
    }
  }];


  $scope.delete = function(id) {
    UrlExtractionsService.deleteUrlExtraction(id, function() {
      $scope.safeDisplayedurlExtractions = UrlExtractionsService.getUrlExtractions();
      $state.go('^.list');
    });
  };

  $scope.onSubmit = function() {
    UrlExtractionsService.upsertUrlExtraction($scope.urlExtraction, function() {
      $scope.safeDisplayedurlExtractions = UrlExtractionsService.getUrlExtractions();
      $state.go('^.list');
    });
  };

  $scope.loading = true;
  DwUrlExtraction.find({filter: {include: ['trailUrl']}}).$promise
      .then(function (allurlExtractions) {
        $scope.safeDisplayedurlExtractions = allurlExtractions;
        $scope.displayedUrlExtractions = [].concat($scope.safeDisplayedurlExtractions);
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {
        $scope.loading = false;
      }
  );

  DwTrail.find({filter: {include: []}}).$promise
      .then(function (allTrails) {
        for (var i = 0; i < allTrails.length; ++i) {
          $scope.trails.push({
            value: allTrails[i].name,
            name: allTrails[i].description,
            id: allTrails[i].id
          });
        }
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {
      }
  );

  DwDomainEntityType.find({filter: {include: []}}).$promise
      .then(function (allEntTypes) {
        for (var i = 0; i < allEntTypes.length; ++i) {
          $scope.domainEntityTypes.push({
            value: allEntTypes[i].name,
            name: allEntTypes[i].description,
            id: allEntTypes[i].id
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
    UrlExtractionsService.getUrlExtraction($stateParams.id).$promise.then(function(result){
      $scope.urlExtraction = result;})
  } else {
    $scope.urlExtraction = {};
  }

});

