'use strict';
var app = angular.module('com.module.dwDomains');

app.controller('DomainsCtrl', function($scope, $state, $stateParams, DwFeed, DwDomain, DwTeam, DwExtractor, DomainsService, gettextCatalog, AppAuth) {
    //Put the currentUser in $scope for convenience
    $scope.currentUser = AppAuth.currentUser;
    $scope.plExtractors = [];
    $scope.plFeeds = [];
    $scope.plTeams=[];
    //$scope.domainList = [];

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
        key: 'dwTeams',
        type: 'multiCheckbox',
        templateOptions: {
            label: 'Teams',
            options: $scope.plTeams,
            valueProp: 'id'
        }
    }, {
        key: 'dwFeeds',
        type: 'multiCheckbox',
        templateOptions: {
            label: 'Feeds',
            options: $scope.plFeeds,
            valueProp: 'id'
        }
    }, {
        key: 'dwExtractors',
        type: 'multiCheckbox',
        templateOptions: {
            label: 'Extractors',
            options: $scope.plExtractors,
            valueProp: 'id'
        }
    }];

    $scope.delete = function(domain) {
        DomainsService.deleteDomain(domain, function() {
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
    if($scope.currentUser.isAdmin){
        DwDomain.find({filter: {include: ['domainEntityTypes','domainItems','extractors','trails','feeds','teams']}}).$promise
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
    }else{
        if($scope.currentUser.teams){
            $scope.userDomains = [];
            for (var i = 0; i < $scope.currentUser.teams.length; ++i) {
                $scope.userDomains.push.apply($scope.userDomains,$scope.currentUser.teams[i].domains);
            }
            $scope.safeDisplayedDomains = $scope.userDomains;
            $scope.displayedDomains = [].concat($scope.safeDisplayedDomains);
        }
        $scope.loading = false;
    }

    DwExtractor.find({filter: {include: []}}).$promise
        .then(function (allExtractors) {
            for (var i = 0; i < allExtractors.length; ++i) {
                $scope.plExtractors.push({
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

    DwFeed.find({filter: {include: []}}).$promise
        .then(function (allFeeds) {
            for (var i = 0; i < allFeeds.length; ++i) {
                $scope.plFeeds.push({
                    value: allFeeds[i].name,
                    name: allFeeds[i].name,
                    id: allFeeds[i].id
                });
            }
        })
        .catch(function (err) {
            console.log(err);
        })
        .then(function () {
        }
    );

    DwTeam.find({filter: {include: []}}).$promise
        .then(function (allTeams) {
            for (var i = 0; i < allTeams.length; ++i) {
                $scope.plTeams.push({
                    value: allTeams[i].name,
                    name: allTeams[i].name,
                    id: allTeams[i].id
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

