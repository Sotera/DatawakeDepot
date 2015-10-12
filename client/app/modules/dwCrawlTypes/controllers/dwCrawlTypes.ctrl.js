'use strict';
var app = angular.module('com.module.dwCrawlTypes');

app.controller('CrawlTypesCtrl', function($scope, $state, $stateParams, CrawlTypesService, gettextCatalog, AppAuth) {

    //Put the currentUser in $scope for convenience
    $scope.currentUser = AppAuth.currentUser;

    $scope.crawlType = {};
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
        CrawlTypesService.deleteCrawlType(id, function() {
            $scope.crawlTypes = CrawlTypesService.getCrawlTypes();
            $state.go('^.list');
        });
    };

    $scope.onSubmit = function() {
        CrawlTypesService.upsertCrawlType($scope.crawlType, function() {
            $scope.crawlTypes = CrawlTypesService.getCrawlTypes();
            $state.go('^.list');
        });
    };

    $scope.crawlTypes = CrawlTypesService.getCrawlTypes();

    if ($stateParams.id) {
        CrawlTypesService.getCrawlType($stateParams.id).$promise.then(function(result){
            $scope.crawlType = result;})
    } else {
        $scope.crawlType = {};
    }

    $scope.getDomains = function () {
        return [];
    }

});

