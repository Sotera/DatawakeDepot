'use strict';
var app = angular.module('com.module.dwDomainItems');

app.controller('DomainItemsCtrl', function($scope, $state, $stateParams, DwDomain, DwDomainItem, DomainItemsService, gettextCatalog, AppAuth) {

    //Put the currentUser in $scope for convenience
    $scope.currentUser = AppAuth.currentUser;
    $scope.domains = [];

    $scope.currentDomainId= '';
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
            required: true
        }
        ,
        expressionProperties:{
            'templateOptions.disabled': 'model.id'
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

    $scope.delete = function(id) {
        DomainItemsService.deleteDomainItem(id, function() {
            $scope.safeDisplayeddomainItems = DomainItemsService.getFilteredDomainItems($scope.currentDomainId);
            $state.go('^.list');
        });
    };

    $scope.onSubmit = function() {
        DomainItemsService.upsertDomainItem($scope.domainItem, function() {
            $scope.safeDisplayeddomainItems = DomainItemsService.getFilteredDomainItems($scope.currentDomainId);
            $state.go('^.list');
        });
    };

    DwDomain.find({filter: {include: []}}).$promise
        .then(function (allDomains) {
            $scope.domains.length=0;
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
        }
    );

    $scope.loading = true;
    if ($stateParams.id && $stateParams.domainId) {
        DomainItemsService.getDomainItem($stateParams.id).$promise.then(function(result) {
            $scope.currentDomainId = $stateParams.domainId;
            $scope.domainItem = result;
            $scope.safeDisplayeddomainItems = {};
            $scope.displayedDomainItems = {};
            $scope.loading = false;
        })
    } else if ($stateParams.domainId){
        DomainItemsService.getFilteredDomainItems($stateParams.domainId).$promise.then(function(result){
            $scope.currentDomainId = $stateParams.domainId;
            $scope.domainItem = {};
            $scope.safeDisplayeddomainItems = result;
            $scope.displayedDomainItems = [].concat($scope.displayedDomainItems);
            $scope.loading = false;
        })
    } else {
        DomainItemsService.getDomainItems().$promise.then(function(result){
            $scope.currentDomainId = '';
            $scope.domainItem = {};
            $scope.safeDisplayeddomainItems = result;
            $scope.displayedDomainItems = [].concat($scope.displayedDomainItems);
            $scope.loading = false;
        });
    }
});

