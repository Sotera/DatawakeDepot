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
    }

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
        $scope.loading = true;
        DwTransmission.findOne({
            filter: {
                where: {
                    id: $stateParams.id
                },
                fields:{},
                include: [
                    {relation:'feeds',
                        scope:{
                            fields:[
                                "name",
                                "feedUrl",
                                "protocol",
                                "dwServiceTypeId",
                                "id"
                            ]
                        }
                    }
                ]
            }
        }).$promise
            .then(function (transmission) {
                $scope.transmission = transmission;
            });
        $scope.loading = false;
    } else {
        $scope.transmission = {};
    }

});

