'use strict';
var app = angular.module('com.module.dwUrlExtractions');

app.controller('UrlExtractionsCtrl', function($scope, $state, $stateParams, DomainItemsService, EntityTypesService, DwTrailUrl,
                                              UrlExtractionsService, gettextCatalog, AppAuth) {

  $scope.trailUrls = [];
  $scope.currentTrailId = '';
  $scope.currentTrailUrlId = '';
  $scope.urlExtraction = {};

  $scope.itemIndex = 0;
  $scope.itemsPerPage = 15;

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

  $scope.setPageButtons = function(resultLen){
      var pageState =  '';
      var fwd = false;
      var back = false;

      //figure out if we have more than one page of results to see if we enable Fwd
      if(resultLen >= $scope.itemsPerPage){
          fwd = true;
      }
      //figure out if we're on page greater than page 1 to enable Back
      if($scope.itemIndex >= $scope.itemsPerPage){
          back = true;
      }
      if(fwd && back){
          pageState = 'both';
      }else if (!fwd && back){
          pageState = 'backwardOnly';
      }else if (fwd && !back){
          pageState = 'forwardOnly';
      }

      switch (pageState){
          case 'forwardOnly':
              $('#pageBack').attr('disabled', 'disabled');
              $('#pageFwd').removeAttr('disabled');
              break;
          case 'backwardOnly':
              $('#pageFwd').attr('disabled', 'disabled');
              $('#pageBack').removeAttr('disabled');
              break;
          case 'both':
              $('#pageBack').removeAttr('disabled');
              $('#pageFwd').removeAttr('disabled');
              break;
          default: //disabled
              $('#pageBack').attr('disabled', 'disabled');
              $('#pageFwd').attr('disabled', 'disabled');
      }
  };

  $scope.nextPage = function(){
      $scope.itemIndex = $scope.itemIndex + $scope.itemsPerPage;
      $scope.getFilteredPagedResults($scope.currentTrailUrlId, $scope.itemIndex,  $scope.itemsPerPage);
  };

  $scope.prevPage = function(){
      $scope.itemIndex = $scope.itemIndex - $scope.itemsPerPage;
      $scope.getFilteredPagedResults($scope.currentTrailUrlId, $scope.itemIndex,  $scope.itemsPerPage);
  };

  $scope.getFilteredPagedResults = function(trailUrlId, itemIndex, itemsPer) {
      $scope.loading = true;
      UrlExtractionsService.getFilteredPagedUrlExtractions(trailUrlId, itemIndex, itemsPer).$promise.then(function (result) {
          $scope.currentTrailUrlId = trailUrlId;
          $scope.urlExtraction = {};
          $scope.safeDisplayedurlExtractions = result;
          $scope.displayedUrlExtractions = [].concat($scope.safeDisplayedurlExtractions);

          $scope.setPageButtons(result.length);
          $scope.loading = false;
      });
  };

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
          $scope.currentTrailId = $stateParams.trailId;
          $scope.getFilteredPagedResults($stateParams.trailUrlId, $scope.itemIndex, $scope.itemsPerPage);
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

