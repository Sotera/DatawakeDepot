'use strict';
var app = angular.module('com.module.dwDomains');

app.controller('DomainsCtrl', function($scope, $state, $stateParams, DwDomain, DwExtractor, DomainsService, gettextCatalog, AppAuth) {
    //Put the currentUser in $scope for convenience
    $scope.currentUser = AppAuth.currentUser;
    $scope.extractors = [];

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
    }, {
        key: 'extractors',
        type: 'multiCheckbox',
        templateOptions: {
            label: 'Extractors',
            options: $scope.extractors
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
    DwDomain.find({filter: {include: ['domainEntityTypes','domainItems','extractors']}}).$promise
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

    DwExtractor.find({filter: {include: []}}).$promise
        .then(function (allExtractors) {
            for (var i = 0; i < allExtractors.length; ++i) {
                $scope.extractors.push({
                    value: allExtractors[i].name,
                    name: allExtractors[i].name,
                    id: allExtractors[i].id
                });
            }
        })
        .catch(function (err) {
            console.log(err);
        })
        .then(function () {
        }
    );
});

