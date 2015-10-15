'use strict';
var app = angular.module('com.module.dwFeeds');

app.controller('FeedsCtrl', function($scope, $state, $stateParams, DwFeed, FeedsService, gettextCatalog, AppAuth) {

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
            disabled: false
        }
    }];


    $scope.delete = function(id) {
        FeedsService.deleteFeed(id, function() {
            $scope.safeDisplayedfeeds = FeedsService.getFeeds();
            $state.go('^.list');
        });
    };

    $scope.onSubmit = function() {
        FeedsService.upsertFeed($scope.feed, function() {
            $scope.safeDisplayedfeeds = FeedsService.getFeeds();
            $state.go('^.list');
        });
    };

    $scope.feeds = FeedsService.getFeeds();

    $scope.loading = true;
    DwFeed.find({filter: {include: []}}).$promise
        .then(function (allFeeds) {
            $scope.safeDisplayedfeeds = allFeeds;
            $scope.displayedfeeds = [].concat($scope.safeDisplayedfeeds);
        })
        .catch(function (err) {
            console.log(err);
        })
        .then(function () {
            $scope.loading = false;
        });

    if ($stateParams.id) {
        FeedsService.getFeed($stateParams.id).$promise.then(function(result){
            $scope.feed = result;})
    } else {
        $scope.feed = {};
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

