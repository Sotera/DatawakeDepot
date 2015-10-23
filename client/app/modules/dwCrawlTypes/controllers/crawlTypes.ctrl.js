'use strict';
var app = angular.module('com.module.dwCrawlTypes');

app.controller('CrawlTypesCtrl', function($scope, $state, $stateParams, DwCrawlType, CrawlTypesService, gettextCatalog, AppAuth) {

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
    }];


    $scope.delete = function(id) {
        CrawlTypesService.deleteCrawlType(id, function() {
            $scope.safeDisplayedcrawlTypes = CrawlTypesService.getCrawlTypes();
            $state.go('^.list');
        });
    };

    $scope.onSubmit = function() {
        CrawlTypesService.upsertCrawlType($scope.crawlType, function() {
            $scope.safeDisplayedcrawlTypes = CrawlTypesService.getCrawlTypes();
            $state.go('^.list');
        });
    };

    $scope.loading = true;
    DwCrawlType.find({filter: {include: []}}).$promise
        .then(function (allCrawlTypes) {
            $scope.safeDisplayedcrawlTypes = allCrawlTypes;
            $scope.displayedcrawlTypes = [].concat($scope.safeDisplayedcrawlTypes);
        })
        .catch(function (err) {
            console.log(err);
        })
        .then(function () {
            $scope.loading = false;
        });

    if ($stateParams.id) {
        CrawlTypesService.getCrawlType($stateParams.id).$promise.then(function(result){
            $scope.crawlType = result;})
    } else {
        $scope.crawlType = {};
    }
});

