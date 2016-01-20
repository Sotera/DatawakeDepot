'use strict';
var app = angular.module('com.module.dwExtractors');

app.controller('ExtractorsCtrl', function($scope, $state, $stateParams, DwDomain, DwServiceType, ExtractorsService, gettextCatalog, AppAuth) {

    $scope.plProtocols = [
        {"name": "http","description": "http://"},
        {"name": "https","description": "https://" }
    ];
    $scope.plServiceTypes = [];
    $scope.plDomains = [];

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
        key: 'extractorHost',
        type: 'input',
        templateOptions: {
            label: gettextCatalog.getString('Host Name'),
            required: true
        }
    },{
        key: 'extractorUrl',
        type: 'input',
        templateOptions: {
            label: gettextCatalog.getString('Url'),
            required: false
        }
    }, {
        key: 'port',
        type: 'input',
        templateOptions: {
            label: gettextCatalog.getString('Port'),
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
        key: 'credentials',
        type: 'input',
        templateOptions: {
            label: gettextCatalog.getString('Credentials'),
            required: false
        }
    }, {
        key: 'dwDomains',
        type: 'multiCheckbox',
        templateOptions: {
            label: 'Domains',
            options: $scope.plDomains,
            valueProp: 'id',
            required: false,
            disabled: false
        }
    }];

    $scope.delete = function(extractor) {
        ExtractorsService.deleteExtractor(extractor, function() {
            $scope.safeDisplayedextractors = ExtractorsService.getExtractors();
            $state.go('^.list');
        });
    };

    $scope.onSubmit = function() {
        ExtractorsService.upsertExtractor($scope.extractor, function() {
            $scope.safeDisplayedextractors = ExtractorsService.getExtractors();
            $state.go('^.list');
        });
    };

    $scope.loadPicklists = function () {
        DwServiceType.find({filter: {include: []}}).$promise
            .then(function (allServiceTypes) {
                for (var i = 0; i < allServiceTypes.length; ++i) {
                    $scope.plServiceTypes.push({
                        value: allServiceTypes[i].name,
                        name: allServiceTypes[i].name + " - " + allServiceTypes[i].description,
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
    };

    $scope.loading = true;
    AppAuth.getCurrentUser().then(function (currUser) {
        $scope.currentUser = currUser;
        $scope.loadPicklists();
        if ($stateParams.id) {
            ExtractorsService.getExtractor($stateParams.id).$promise.then(function(result){
                $scope.extractor = result;
                $scope.safeDisplayedextractors = {};
                $scope.displayedextractors = {};
                $scope.loading = false;
            })
        } else {
            ExtractorsService.getExtractors().$promise.then(function(result) {
                $scope.extractor = {};
                $scope.safeDisplayedextractors = result;
                $scope.displayedextractors = [].concat($scope.safeDisplayedextractors);
                $scope.loading = false;
            })
        }
    }, function (err) {
        console.log(err);
    });

});

