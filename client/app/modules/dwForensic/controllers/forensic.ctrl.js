'use strict';
var app = angular.module('com.module.dwForensic');

app.controller('ForensicCtrl', function ($scope, $state, $stateParams, AminoUser, DwTrail, DwDomainEntityType, ForensicService, gettextCatalog, AppAuth) {
    $scope.trail = {};

    $scope.teams = [];
    $scope.domains = [];
    $scope.trails = [];
    $scope.selectedTeam = null;

    $scope.selectedDomain = null;
    $scope.selectedTrail = null;
    $scope.selectedViews = [];
    $scope.entitiesGrid = [];


    //Setup the view dropdown menu
    $scope.views = [];
    //$scope.viewSettings = {buttonClasses: 'btn btn-primary btn-sm', displayProp: 'name'};
    //$scope.viewCustomText = {buttonDefaultText: 'Select Views'};



    $scope.teamChanged = function (team) {
        $scope.selectedTeam = team;
        $scope.selectedDomain = null;
        $scope.selectedTrail = null;
        $scope.domains = team.domains;
    };

    $scope.domainChanged = function (domain) {
        $scope.selectedDomain = domain;
        $scope.selectedTrail = null;
        $scope.trails = domain.trails;
    };

    $scope.trailChanged = function (trail) {
        $scope.selectedTrail = trail;
        $scope.views = [];
        $scope.getEntityTypes(trail.id);
    };

    $scope.getEntityTypes = function (trailId) {
        var filter = {
            filter: {
                "where": {"id": trailId},
                "include": [{
                    "relation": "trailUrls",
                    "scope": {
                        "include": [{
                            "relation": "urlExtractions",
                            "scope": {"where": {"extractorTypes": {"neq": null}}}
                        }]
                    }
                }]
            }
        };
        var entityTypes = [];
        var entityObjects = [];

        DwTrail.findOne(filter).$promise.then(function (trail) {
            trail.trailUrls.forEach(function (trailUrl) {
                if (trailUrl.urlExtractions.length) {
                    trailUrl.urlExtractions.forEach(function (urlExtraction) {
                        urlExtraction.extractorTypes.forEach(function (type) {
                            if (entityTypes.indexOf(type) === -1 && type != "_Feature" && type != "owl#Thing" && type != "text") {
                                entityTypes.push(type);
                            }
                        });
                    })
                }
            });
            entityTypes.forEach(function (entity) {
                entityObjects.push({name: entity});
            });

            $scope.views = entityObjects;
        });
    };

    $scope.drawGraph = function () {
        if ($scope.selectedTrail) {

            var graphViews = ForensicService.buildGraphViews($scope.selectedViews);
            var filter = {
                filter: {
                    "where": {
                        "id": $scope.selectedTrail.id
                    },
                    "include": ["domain", "team", {
                        "relation": "trailUrls",
                        "scope": {
                            "include": [{
                                "relation": "urlExtractions",
                                "scope": {"where": {"extractorTypes": {"inq": graphViews}}}
                            }]
                        }
                    }]
                }
            };
            console.log("Trail Filter");
            console.log(JSON.stringify(filter));
            DwTrail.findOne(filter).$promise
                .then(function (trail) {
                    var graph = ForensicService.getBrowsePathEdgesWithInfo(trail, $scope.selectedViews);
                    try {
                        change_graph(graph);
                    } catch (e){
                        console.log(e);
                    }
                    $scope.visitedGrid = ForensicService.getSearchTerms(trail.trailUrls);
                    $scope.entitiesGrid = ForensicService.getEntities(trail, $scope.selectedViews);
                    $scope.words = ForensicService.getWords($scope.entitiesGrid);
                })
                .catch(function (err) {
                    console.log("Error getting trail: " + $scope.selectedTrail.id);
                    console.log(err);
                });
        }
    };

    $scope.loading = true;
    AppAuth.getCurrentUser().then(function (currUser) {

        var userFilter = {
            filter: {
                where: {
                    id: currUser.id
                },
                "include": [{
                    "relation": "teams",
                    "scope": {"include": [{"relation": "domains", "scope": {"include": [{"relation": "trails"}]}}]}
                }]
            }
        };
        console.log("userFilter");
        console.log(JSON.stringify(userFilter));
        AminoUser.findOne(userFilter).$promise
            .then(function (user) {
                $scope.teams = user.teams;

            })
            .catch(function (err) {
                console.log("Error getting trail: " + trailId);
                console.log(err);
            });
        $scope.loading = false;
    });
});
