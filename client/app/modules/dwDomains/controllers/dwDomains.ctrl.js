'use strict';
var app = angular.module('com.module.dwDomains');

app.controller('DwDomainsCtrl', function($scope, $state, $stateParams, DomainsService, gettextCatalog) {

    $scope.domain = {};
    $scope.formFields = [{
        key: 'name',
        type: 'input',
        templateOptions: {
            label: gettextCatalog.getString('Domain Name'),
            required: true
        }
    }, {
        key: 'description',
        type: 'input',
        templateOptions: {
            label: gettextCatalog.getString('Domain Description'),
            required: true
        }
    }];

    //$scope.formOptions = {
    //  uniqueFormId: true,
    //  hideSubmit: false,
    //  submitCopy: 'Save'
    //};

    $scope.delete = function(id) {
        DomainsService.deleteDomain(id, function() {
            $scope.domains = DomainsService.getDomains();
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
            $scope.domain = result;
        })
    } else {
        $scope.domain = {};
    }

});