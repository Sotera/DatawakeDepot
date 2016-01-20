'use strict';
var app = angular.module('com.module.dwUrlExtractions');

app.controller('UrlExtractionsCtrl', function($scope, $state, $stateParams, DomainItemsService, EntityTypesService, DwTrailUrl,
                                              UrlExtractionsService, gettextCatalog, AppAuth) {

  $scope.trailUrls = [];
  $scope.currentTrailId = '';
  $scope.currentTrailUrlId = '';
  $scope.urlExtraction = {};

  $scope.formFields = [{
    key: 'id',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('id'),
      disabled: true
    }
  }, {
      key: 'dwTrailUrlId',
      type: 'select',
      templateOptions: {
          label: gettextCatalog.getString('Trail Url'),
          options: $scope.trailUrls,
          valueProp: 'id',
          labelProp: 'name',
          required: true,
          disabled: false
      }
  },{
      key: 'extractorTypes',
      type: 'input',
      templateOptions: {
          label: gettextCatalog.getString('Extractor Types'),
          required: true
      }

  },{
    key: 'value',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Value'),
      required: true
    }
  },{
      key: 'occurrences',
      type: 'input',
      templateOptions: {
          label: gettextCatalog.getString('Occurrences'),
          required: true
      }
  }];

  $scope.delete = function(id) {
    UrlExtractionsService.deleteUrlExtraction(id, function() {
      $scope.safeDisplayedurlExtractions = UrlExtractionsService.getFilteredUrlExtractions($scope.currentTrailUrlId);
      $state.go('^.list');
    });
  };

  $scope.onSubmit = function() {
    UrlExtractionsService.upsertUrlExtraction($scope.urlExtraction, function() {
      $scope.safeDisplayedurlExtractions = UrlExtractionsService.getFilteredUrlExtractions($scope.currentTrailUrlId);
        $state.go('^.list');
    });
  };

  $scope.makeDomainEntityType = function(entType) {
      var newEntityType = {
          'name': entType.typeName,
          'description': entType.typeName,
          'dwDomainId': entType.domainId,
          'dwExtractorId': entType.extractorId,
          'source:': 'Converted'
      };

      EntityTypesService.upsertEntityType(newEntityType, function(){
        var x = 'success';
      });
  };

  $scope.makeDomainItem = function(domItem){
      var newDomainItem = {
          'id': domItem.id,
          'itemValue': domItem.itemValue,
          'type': domItem.itemType,
          'source': domItem.itemSource,
          'dwDomainId': domItem.domainId
      };

      DomainItemsService.upsertDomainItem(newDomainItem, function(){
          var x = 'success';
      });
  };

  $scope.loadPicklists = function () {
      DwTrailUrl.find({filter: {include: []}}).$promise
          .then(function (allTrailUrls) {
              for (var i = 0; i < allTrailUrls.length; ++i) {
                  $scope.trailUrls.push({
                      value: allTrailUrls[i].id,
                      name: allTrailUrls[i].url,
                      id: allTrailUrls[i].id
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
      $scope.loadPicklists();
      if ($stateParams.id && $stateParams.trailId && $stateParams.trailUrlId) {
        UrlExtractionsService.getUrlExtraction($stateParams.id).$promise.then(function(result){
          $scope.currentTrailId = $stateParams.trailId;
          $scope.currentTrailUrlId = $stateParams.trailUrlId;
          $scope.urlExtraction = result;
          $scope.safeDisplayedurlExtractions = {};
          $scope.displayedUrlExtractions = {};
          $scope.loading = false;
        })
      } else if ($stateParams.trailUrlId && $stateParams.trailId){
        UrlExtractionsService.getFilteredUrlExtractions($stateParams.trailUrlId).$promise.then(function(result){
          $scope.currentTrailId = $stateParams.trailId;
          $scope.currentTrailUrlId = $stateParams.trailUrlId;
          $scope.urlExtraction = {};
          $scope.safeDisplayedurlExtractions = result;
          $scope.displayedUrlExtractions = [].concat($scope.safeDisplayedurlExtractions);
          $scope.loading = false;
        })
      } else {
        UrlExtractionsService.getUrlExtractions().$promise.then(function(result) {
          $scope.currentTrailId = '';
          $scope.urlExtraction = {};
          $scope.safeDisplayedurlExtractions = result;
          $scope.displayedUrlExtractions = [].concat($scope.safeDisplayedurlExtractions);
          $scope.loading = false;
        });
      }
  }, function (err) {
      console.log(err);
  });

});

