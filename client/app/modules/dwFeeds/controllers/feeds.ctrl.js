'use strict';
var app = angular.module('com.module.dwFeeds');

app.controller('FeedsCtrl', function($scope, $state, $stateParams, FeedsService, gettextCatalog, AppAuth) {

    //Put the currentUser in $scope for convenience
    $scope.currentUser = AppAuth.currentUser;

    $scope.feed = {};
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
        key: 'index',
        type: 'input',
        templateOptions: {
            label: gettextCatalog.getString('Index'),
            required: false
        }
    }, {
        key: 'feedUrl',
        type: 'input',
        templateOptions: {
            label: gettextCatalog.getString('Url'),
            required: true
        }
    }, {
        key: 'credentials',
        type: 'input',
        templateOptions: {
            label: gettextCatalog.getString('Credentials'),
            required: false
        }
    }, {
        key: 'protocol',
        type: 'input',
        templateOptions: {
            label: gettextCatalog.getString('Protocol'),
            required: false
        }
    }, {
        key: 'serviceTypeId',
        type: 'input',
        templateOptions: {
            label: gettextCatalog.getString('ServiceType'),
            required: false
        }
    }, {
        key: 'feedId',
        type: 'input',
        templateOptions: {
            label: gettextCatalog.getString('Feed'),
            required: true,
            disabled: true
        }
    }];


    $scope.delete = function(id) {
        FeedsService.deleteFeed(id, function() {
            $scope.feeds = FeedsService.getFeeds();
            $state.go('^.list');
        });
    };

    $scope.onSubmit = function() {
        FeedsService.upsertFeed($scope.feed, function() {
            $scope.feeds = FeedsService.getFeeds();
            $state.go('^.list');
        });
    };

    $scope.feeds = FeedsService.getFeeds();

    if ($stateParams.id) {
        FeedsService.getFeed($stateParams.id).$promise.then(function(result){
            $scope.feed = result;})
    } else {
        $scope.feed = {};
    }

    $scope.getDomains = function () {
        return [];
    }

});

