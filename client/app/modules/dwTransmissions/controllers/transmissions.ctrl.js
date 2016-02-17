'use strict';
var app = angular.module('com.module.dwTransmissions');

app.controller('TransmissionsCtrl', function($scope, $state, $stateParams, DwFeed, TransmissionsService, gettextCatalog, AppAuth) {

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
    },{
        key: 'timestamp',
        type: 'input',
        templateOptions: {
            label: gettextCatalog.getString('Timestamp'),
            disabled: true
        }

    }];

    $scope.set_color = function (transmission) {
        if (transmission.transmitStatus == "FAILED") {
            return {
                background: "red",
                color: "white"
            }
        }
    };

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

    $scope.loadPicklists = function () {
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
    };

    $scope.loading = true;
    AppAuth.getCurrentUser().then(function (currUser) {
        $scope.currentUser = currUser;
        $scope.loadPicklists();
        if ($stateParams.id) {
            TransmissionsService.getTransmission($stateParams.id).$promise.then(function(result){
                $scope.transmission = result;
                $scope.safeDisplayedtransmissions = {};
                $scope.displayedtransmissions = {};
                $scope.loading = false;
            })
        } else {
            TransmissionsService.getTransmissions().$promise.then(function(result){
                $scope.transmission = {};
                $scope.safeDisplayedtransmissions = result;
                $scope.displayedtransmissions = [].concat($scope.safeDisplayedtransmissions);
                $scope.loading = false;
            })
        }
    }, function (err) {
        console.log(err);
    });
});

