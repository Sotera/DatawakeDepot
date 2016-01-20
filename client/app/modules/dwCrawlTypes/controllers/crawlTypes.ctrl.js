'use strict';
var app = angular.module('com.module.dwCrawlTypes');

app.controller('CrawlTypesCtrl', function($scope, $state, $stateParams, CrawlTypesService, gettextCatalog, AppAuth) {

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
    AppAuth.getCurrentUser().then(function (currUser) {
        $scope.currentUser = currUser;
        if ($stateParams.id) {
            CrawlTypesService.getCrawlType($stateParams.id).$promise.then(function(result){
                $scope.crawlType = result;
                $scope.safeDisplayedcrawlTypes = {};
                $scope.displayedcrawlTypes = {};
                $scope.loading = false;
            })
        } else {
            CrawlTypesService.getCrawlTypes().$promise.then(function(result){
                $scope.crawlType = {};
                $scope.safeDisplayedcrawlTypes = result;
                $scope.displayedcrawlTypes = [].concat($scope.safeDisplayedcrawlTypes);
                $scope.loading = false;
            })
        }
    }, function (err) {
        console.log(err);
    });
});
