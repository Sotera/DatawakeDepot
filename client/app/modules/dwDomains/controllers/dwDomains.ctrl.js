'use strict';
var app = angular.module('com.module.dwDomains');

app.controller('DomainsCtrl', function($scope, $state, $stateParams, DomainsService, gettextCatalog, AppAuth) {

    //Put the currentUser in $scope for convenience
    $scope.currentUser = AppAuth.currentUser;

    $scope.domain = {};
    $scope.formFields = [{
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
            required: true
        }
    }];


    $scope.delete = function(id) {
        DomainsService.deleteDomain(id, function() {
            $scope.domains = DomainsService.getDomains();
            $state.go('^.list');
        });
    };

    $scope.onSubmit = function() {
        DomainsService.upsertDomain($scope.domain, function() {
            $scope.domains = DomainsService.getDomains();
            $state.go('^.list');
        });
    };

    $scope.domains = DomainsService.getDomains();

    if ($stateParams.id) {
        DomainsService.getDomain($stateParams.id).$promise.then(function(result){
            $scope.domain = result;})
    } else {
        $scope.domain = {};
    }

});

