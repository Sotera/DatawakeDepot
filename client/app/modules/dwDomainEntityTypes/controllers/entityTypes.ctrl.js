'use strict';
var app = angular.module('com.module.dwDomainEntityTypes');

app.controller('EntityTypesCtrl', function ($scope, $state, $stateParams, DwDomain, EntityTypesService, gettextCatalog, AppAuth) {

    $scope.domains = [];
    $scope.currentDomainId = '';

    $scope.entityType = {};
    $scope.formFields = [{
        key: 'id',
        type: 'input',
        templateOptions: {
            label: gettextCatalog.getString('id'),
            disabled: true
        }
    }, {
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
    }, {
        key: 'dwDomainId',
        type: 'select',
        templateOptions: {
            label: gettextCatalog.getString('Domain'),
            options: $scope.domains,
            valueProp: 'id',
            labelProp: 'name',
            required: true
        },
        expressionProperties: {
            'templateOptions.disabled': 'model.id'
        }
    }, {
        key: 'source',
        type: 'input',
        templateOptions: {
            label: gettextCatalog.getString('Source'),
            required: false
        }
    }];

    $scope.delete = function (id) {
        EntityTypesService.deleteEntityType(id, function () {
            $scope.safeDisplayedentityTypes = EntityTypesService.getFilteredEntityTypes($scope.currentDomainId);
            $state.go('^.list', { 'domainId': $scope.currentDomainId});
        });
    };

    $scope.onSubmit = function () {
        EntityTypesService.upsertEntityType($scope.entityType, function () {
            $scope.safeDisplayedentityTypes = EntityTypesService.getFilteredEntityTypes($scope.currentDomainId);
            $state.go('^.list', { 'domainId': $scope.currentDomainId});
        });
    };

    $scope.loadPicklists = function () {
        DwDomain.find({filter: {include: []}}).$promise
            .then(function (allDomains) {
                for (var i = 0; i < allDomains.length; ++i) {
                    $scope.domains.push({
                        value: allDomains[i].name,
                        name: allDomains[i].name + " - " + allDomains[i].description,
                        id: allDomains[i].id
                    });
                }
            })
            .catch(function (err) {
                console.log(err);
            })
            .then(function () {
            });
    };

    $scope.loading = true;
    AppAuth.getCurrentUser().then(function (currUser) {
        $scope.currentUser = currUser;
        $scope.loadPicklists(currUser);
        if ($stateParams.id && $stateParams.domainId) {
            EntityTypesService.getEntityType($stateParams.id).$promise.then(function (result) {
                $scope.currentDomainId = $stateParams.domainId;
                $scope.entityType = result;
                $scope.safeDisplayedentityTypes = {};
                $scope.displayedEntityTypes = {};
                $scope.loading = false;
            })
        } else if ($stateParams.domainId) {
            EntityTypesService.getFilteredEntityTypes($stateParams.domainId).$promise.then(function (result) {
                $scope.currentDomainId = $stateParams.domainId;
                $scope.entityType = {};
                $scope.safeDisplayedentityTypes = result;
                $scope.displayedEntityTypes = [].concat($scope.safeDisplayedentityTypes);
                $scope.loading = false;
            })
        } else {
            EntityTypesService.getEntityTypes().$promise.then(function (result) {
                $scope.currentDomainId = '';
                $scope.entityType = {};
                $scope.safeDisplayedentityTypes = result;
                $scope.displayedEntityTypes = [].concat($scope.safeDisplayedentityTypes);
                $scope.loading = false;
            });
        }
    }, function (err) {
        console.log(err);
    });
});

