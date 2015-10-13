'use strict';
var app = angular.module('com.module.dwDomainItems');

app.controller('DomainItemsCtrl', function($scope, $state, $stateParams, DomainItemsService, gettextCatalog, AppAuth) {

    //Put the currentUser in $scope for convenience
    $scope.currentUser = AppAuth.currentUser;

    $scope.domainItem = {};
    $scope.formFields = [{
        key: 'id',
        type: 'input',
        templateOptions: {
            label: gettextCatalog.getString('id'),
            disabled: true
        }
    },{
        key: 'itemValue',
        type: 'input',
        templateOptions: {
            label: gettextCatalog.getString('Value'),
            required: true
        }
    }, {
        key: 'domainId',
        type: 'input',
        templateOptions: {
            label: gettextCatalog.getString('Domain'),
            required: false
        }
    }, {
        key: 'itemType',
        type: 'input',
        templateOptions: {
            label: gettextCatalog.getString('Item Type'),
            disabled: true,
            required: false
        }
    }];


    $scope.delete = function(id) {
        DomainItemsService.deleteDomainItem(id, function() {
            $scope.domainItems = DomainItemsService.getDomainItems();
            $state.go('^.list');
        });
    };

    $scope.onSubmit = function() {
        DomainItemsService.upsertDomainItem($scope.domainItem, function() {
            $scope.domainItems = DomainItemsService.getDomainItems();
            $state.go('^.list');
        });
    };

    $scope.domainItems = DomainItemsService.getDomainItems();

    if ($stateParams.id) {
        DomainItemsService.getDomainItem($stateParams.id).$promise.then(function(result){
            $scope.domainItem = result;})
    } else {
        $scope.domainItem = {};
    }

    $scope.getDomains = function () {
        return [];
    }

});

