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

    $scope.crawlTypes = CrawlTypesService.getCrawlTypes();

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

