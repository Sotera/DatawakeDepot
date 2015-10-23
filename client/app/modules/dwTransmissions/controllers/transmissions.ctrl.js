'use strict';
var app = angular.module('com.module.dwTransmissions');

app.controller('TransmissionsCtrl', function($scope, $state, $stateParams, DwFeed, DwTransmission, DwServiceType, TransmissionsService, gettextCatalog, AppAuth) {

    //Put the currentUser in $scope for convenience
    $scope.currentUser = AppAuth.currentUser;
    $scope.feeds = [];
    $scope.statuses = [
        {"name": "SUCCEEDED","description": "Succeeded" },
        {"name": "FAILED","description": "Failed"}
    ];

    $scope.formFields = [{
        key: 'id',
        type: 'input',
        templateOptions: {
            label: gettextCatalog.getString('id'),
            disabled: true
        }
    },{
        key: 'timestamp',
        type: 'input',
        templateOptions: {
            label: gettextCatalog.getString('Timestamp'),
            disabled: true
        }
    },{
        key: 'transmission',
        type: 'input',
        templateOptions: {
            label: gettextCatalog.getString('Transmission'),
            required: true
        }
    }, {
        key: 'transmitStatus',
        type: 'select',
        templateOptions: {
            label: gettextCatalog.getString('Status'),
            options: $scope.statuses,
            valueProp: 'name',
            labelProp: 'name',
            required: true,
            disabled: false
        }
    }, {
        key: 'dwFeedId',
        type: 'select',
        templateOptions: {
            label: gettextCatalog.getString('Feed'),
            options: $scope.feeds,
            valueProp: 'id',
            labelProp: 'name',
            required: true,
            disabled: false
        }
    }];


    $scope.delete = function(id) {
        TransmissionsService.deleteTransmission(id, function() {
            $scope.safeDisplayedtransmissions = TransmissionsService.getTransmissions();
            $state.go('^.list');
        });
    };

    $scope.onSubmit = function() {
        TransmissionsService.upsertTransmission($scope.transmission, function() {
            $scope.safeDisplayedtransmissions = TransmissionsService.getTransmissions();
            $state.go('^.list');
        });
    };

    $scope.loading = true;
    DwTransmission.find({filter: {include: ['feeds']}}).$promise
        .then(function (allTransmissions) {
            $scope.safeDisplayedtransmissions = allTransmissions;
            $scope.displayedtransmissions = [].concat($scope.safeDisplayedtransmissions);
        })
        .catch(function (err) {
            console.log(err);
        })
        .then(function () {
            $scope.loading = false;
        }
    );

    DwFeed.find({filter: {include: []}}).$promise
        .then(function (allFeeds) {
            for (var i = 0; i < allFeeds.length; ++i) {
                $scope.feeds.push({
                    value: allFeeds[i].name,
                    name: allFeeds[i].name,
                    id: allFeeds[i].id
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
        TransmissionsService.getTransmission($stateParams.id).$promise.then(function(result){
            $scope.transmission = result;})
    } else {
        $scope.transmission = {};
    }
});

