'use strict';
var app = angular.module('com.module.dwFeeds');

app.controller('FeedsCtrl', function($scope, $state, $stateParams, DwDomain, DwTrail, DwTeam, DwFeed, DwServiceType, FeedsService, gettextCatalog, AppAuth) {

    //Put the currentUser in $scope for convenience
    $scope.currentUser = AppAuth.currentUser;
    $scope.feed = {};
    $scope.plProtocols = [
        {"name": "HTTP","description": "HTTP://"},
        {"name": "HTTPS","description": "HTTPS://" }
    ];
    $scope.plServiceTypes = [];
    $scope.plDomains = [];
    $scope.plTrails = [];
    $scope.plTeams = [];

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
        type: 'select',
        templateOptions: {
            label: gettextCatalog.getString('Protocol'),
            options: $scope.plProtocols,
            valueProp: 'name',
            labelProp: 'name',
            required: true,
            disabled: false
        }
    }, {
        key: 'dwServiceTypeId',
        type: 'select',
        templateOptions: {
            label: gettextCatalog.getString('ServiceType'),
            options: $scope.plServiceTypes,
            valueProp: 'id',
            labelProp: 'name',
            required: true,
            disabled: false
        }
    }, {
        key: 'dwTeams',
        type: 'multiCheckbox',
        templateOptions: {
            label: 'Teams',
            options: $scope.plTeams,
            valueProp: 'id'
        }
    }, {
        key: 'dwDomains',
        type: 'multiCheckbox',
        templateOptions: {
            label: 'Domains',
            options: $scope.plDomains,
            valueProp: 'id'
        }
    }, {
        key: 'dwTrails',
        type: 'multiCheckbox',
        templateOptions: {
            label: 'Trails',
            options: $scope.plTrails,
            valueProp: 'id'
        }
    }];


    $scope.delete = function(feed) {
        FeedsService.deleteFeed(feed, function() {
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

    $scope.loading = true;
    DwFeed.find({filter: {include: ['transmissions','teams','trails','domains','serviceType']}}).$promise
        .then(function (allFeeds) {
            $scope.safeDisplayedfeeds = allFeeds;
            $scope.displayedfeeds = [].concat($scope.safeDisplayedfeeds);
        })
        .catch(function (err) {
            console.log(err);
        })
        .then(function () {
            $scope.loading = false;
        }
    );

    DwServiceType.find({filter: {include: []}}).$promise
        .then(function (allServiceTypes) {
            for (var i = 0; i < allServiceTypes.length; ++i) {
                $scope.plServiceTypes.push({
                    value: allServiceTypes[i].name,
                    name: allServiceTypes[i].description,
                    id: allServiceTypes[i].id
                });
            }
        })
        .catch(function (err) {
            console.log(err);
        })
        .then(function () {
        }
    );

    DwDomain.find({filter: {include: []}}).$promise
        .then(function (allDomains) {
            for (var i = 0; i < allDomains.length; ++i) {
                $scope.plDomains.push({
                    value: allDomains[i].name,
                    name: allDomains[i].description,
                    id: allDomains[i].id
                });
            }
        })
        .catch(function (err) {
            console.log(err);
        })
        .then(function () {
        }
    );

    DwTrail.find({filter: {include: []}}).$promise
        .then(function (allTrails) {
            for (var i = 0; i < allTrails.length; ++i) {
                $scope.plTrails.push({
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

    DwTeam.find({filter: {include: []}}).$promise
        .then(function (allTeams) {
            for (var i = 0; i < allTeams.length; ++i) {
                $scope.plTeams.push({
                    value: allTeams[i].name,
                    name: allTeams[i].description,
                    id: allTeams[i].id
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
        FeedsService.getFeed($stateParams.id).$promise.then(function(result){
            $scope.feed = result;})
    } else {
        $scope.feed = {};
    }
});

