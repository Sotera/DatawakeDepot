'use strict';
var app = angular.module('com.module.dwDomains');

app.controller('DomainsCtrl', function($scope, $state, $stateParams, DwDomain, DomainsService, gettextCatalog, AppAuth) {
    //Put the currentUser in $scope for convenience
    $scope.currentUser = AppAuth.currentUser;

    $scope.formFields = [{
        key: 'id',
        type: 'input',
        templateOptions: {
            label: gettextCatalog.getString('Id'),
            disabled: true
        }
    }, {key: 'name',
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
            $scope.safeDisplayedDomains = DomainsService.getDomains();
            $state.go('^.list');
        });
    };

    $scope.onSubmit = function() {
        DomainsService.upsertDomain($scope.domain, function() {
            $scope.safeDisplayedDomains = DomainsService.getDomains();
            $state.go('^.list');
        });
    };

    $scope.loading = true;
    DwDomain.find({filter: {include: ['domainItems','domainEntTypes','extractors']}}).$promise
        .then(function (allDomains) {
            $scope.safeDisplayedDomains = allDomains;
            $scope.displayedDomains = [].concat($scope.safeDisplayedDomains);
        })
        .catch(function (err) {
            console.log(err);
        })
        .then(function () {
            $scope.loading = false;
        });

    if ($stateParams.id) {
        DomainsService.getDomain($stateParams.id).$promise.then(function(result){
            $scope.domain = result;
        })
    } else {
        $scope.domain = {};
    }
});

