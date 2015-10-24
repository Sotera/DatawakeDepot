'use strict';
var app = angular.module('com.module.dwFeeds');

app.controller('FeedsCtrl', function($scope, $state, $stateParams, DwDomain, DwTrail, AminoUser, DwFeed, DwServiceType, FeedsService, gettextCatalog, AppAuth) {

    //Put the currentUser in $scope for convenience
    $scope.currentUser = AppAuth.currentUser;
    $scope.feed = {};
    $scope.protocols = [
        {"name": "ES","description": "Elastic Search"},
        {"name": "ReST","description": "ReSTful Url" },
        {"name": "Kafka","description": "Kafka Queue"}
    ];
    $scope.serviceTypes = [];
    $scope.domains = [];
    $scope.trails = [];
    $scope.users = [];

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
            options: $scope.protocols,
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
            options: $scope.serviceTypes,
            valueProp: 'id',
            labelProp: 'name',
            required: true,
            disabled: false
        }
    }, {
        key: 'dwDomains',
        type: 'multiCheckbox',
        templateOptions: {
            label: 'Domains',
            options: $scope.domains
        }
    }, {
        key: 'dwTrails',
        type: 'multiCheckbox',
        templateOptions: {
            label: 'Trails',
            options: $scope.trails
        }
    }, {
        key: 'AminoUsers',
        type: 'multiCheckbox',
        templateOptions: {
            label: 'Users',
            options: $scope.users
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
                $scope.serviceTypes.push({
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
                $scope.domains.push({
                    value: allDomains[i].name,
                    name: allDomains[i].name,
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
                $scope.trails.push({
                    value: allTrails[i].id,
                    name: allTrails[i].name,
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

    AminoUser.find({filter: {include: []}}).$promise
        .then(function (allUsers) {
            for (var i = 0; i < allUsers.length; ++i) {
                $scope.users.push({
                    value: allUsers[i].email,
                    name: allUsers[i].firstName,
                    id: allUsers[i].id
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

