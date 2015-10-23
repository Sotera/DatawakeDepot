'use strict';
var app = angular.module('com.module.dwExtractors');

app.controller('ExtractorsCtrl', function($scope, $state, $stateParams, DwDomain, DwExtractor, DwServiceType, ExtractorsService, gettextCatalog, AppAuth) {

    //Put the currentUser in $scope for convenience
    $scope.currentUser = AppAuth.currentUser;
    $scope.protocols = [
        {"name": "ES","description": "Elastic Search"},
        {"name": "ReST","description": "ReSTful Url" },
        {"name": "Kafka","description": "Kafka Queue"}
    ];
    $scope.serviceTypes = [];
    $scope.domains = [];

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
        key: 'extractorUrl',
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
    }];


    $scope.delete = function(id) {
        ExtractorsService.deleteExtractor(id, function() {
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

    $scope.loading = true;
    DwExtractor.find({filter: {include: ['domains','serviceType']}}).$promise
        .then(function (allExtractors) {
            $scope.safeDisplayedextractors = allExtractors;
            $scope.displayedextractors = [].concat($scope.safeDisplayedextractors);
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

    if ($stateParams.id) {
        ExtractorsService.getExtractor($stateParams.id).$promise.then(function(result){
            $scope.extractor = result;})
    } else {
        $scope.extractor = {};
    };
});

