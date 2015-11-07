'use strict';
var app = angular.module('com.module.dwDomainItems');

app.controller('DomainItemsCtrl', function($scope, $state, $stateParams, DwDomain, DwDomainItem, DwDomainEntityType, DomainItemsService, gettextCatalog, AppAuth) {

    //Put the currentUser in $scope for convenience
    $scope.currentUser = AppAuth.currentUser;
    $scope.domains = [];
    $scope.entityTypes = [];

    $scope.domainItem = {};
    $scope.formFields = [{
        key: 'id',
        type: 'input',
        templateOptions: {
            label: gettextCatalog.getString('id'),
            disabled: true
        }
    }, {
        key: 'dwDomainId',
        type: 'select',
        templateOptions: {
            label: gettextCatalog.getString('Domain'),
            options: $scope.domains,
            valueProp: 'id',
            labelProp: 'name',
            required: true,
            disabled: false,
            onChange: function($viewValue){
                $scope.loadEntityTypes($viewValue);
            }
        }
    }, {
        key: 'dwDomainEntityTypeId',
        type: 'select',
        expressionProperties: {
            // This watches for form changes and enables/disables the entity type dropdown as necessary
            'templateOptions.disabled': function () {
                return $scope.entityTypes.length<=0;
            }
        },
        templateOptions: {
            label: gettextCatalog.getString('Domain Entity TYpe'),
            options: $scope.entityTypes,
            valueProp: 'id',
            labelProp: 'name',
            required: true,
            disabled: false
        }
    },{
        key: 'itemValue',
        type: 'input',
        templateOptions: {
            label: gettextCatalog.getString('Value'),
            required: true
        }
    },{
        key: 'coreItem',
        type: 'checkbox',
        templateOptions: {
            label: gettextCatalog.getString('Core Item?'),
            required: false
        }
    }];

    $scope.loadEntityTypes = function(domainId){
        //Populate entityTypes from the domains for the given domain
        $scope.entityTypes.length=0;
        $scope.domains.forEach(function (domain){
            if (domain.id == domainId){
                if( domain.domainEntityTypes) {
                    for (var i = 0; i < domain.domainEntityTypes.length; ++i) {
                        $scope.entityTypes.push({
                            value: domain.domainEntityTypes[i].name,
                            name: domain.domainEntityTypes[i].name,
                            id: domain.domainEntityTypes[i].id
                        });
                    }
                } else {
                    $scope.entityTypes.length =0;
                }
            }
        });
    };

    $scope.delete = function(id) {
        DomainItemsService.deleteDomainItem(id, function() {
            $scope.safeDisplayeddomainItems = DomainItemsService.getDomainItems();
            $state.go('^.list');
        });
    };

    $scope.onSubmit = function() {
        DomainItemsService.upsertDomainItem($scope.domainItem, function() {
            $scope.safeDisplayeddomainItems = DomainItemsService.getDomainItems();
            $state.go('^.list');
        });
    };

    $scope.loading = true;
    DwDomainItem.find({filter: {include: ['domain','domainEntityType']}}).$promise
        .then(function (allDomainItems) {
            $scope.safeDisplayeddomainItems = allDomainItems;
            $scope.displayedDomainItems = [].concat($scope.safeDisplayeddomainItems);
        })
        .catch(function (err) {
            console.log(err);
        })
        .then(function () {
            $scope.loading = false;
        });

    DwDomain.find({filter: {include: ['domainEntityTypes']}}).$promise
        .then(function (allDomains) {
            $scope.domains.length=0;
            for (var i = 0; i < allDomains.length; ++i) {
                $scope.domains.push({
                    value: allDomains[i].name,
                    name: allDomains[i].name + " - " + allDomains[i].description,
                    id: allDomains[i].id,
                    domainEntityTypes: allDomains[i].domainEntityTypes
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
        DwDomainItem.findOne({
            filter: {
                where: {
                    id: $stateParams.id
                },
                include: ['domain','domainEntityType']
            }
        }).$promise
            .then(function (domain) {
                $scope.domainItem = domain;

                $scope.entityTypes.push({
                    value: domain.domainEntityType.name,
                    name: domain.domainEntityType.name,
                    id: domain.domainEntityType.id
                });
            });
        $scope.loading = false;
    } else {
        $scope.domainItem = {};
    }

});

