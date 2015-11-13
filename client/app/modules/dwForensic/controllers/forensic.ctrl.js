'use strict';
var app = angular.module('com.module.dwForensic');
app.directive('ngDropdownMultiselectDisabled', function () {
    return {
        restrict: 'A',
        controller: function ($scope, $element, $attrs) {
            var $btn;
            $btn = $element.find('button');
            return $scope.$watch($attrs.ngDropdownMultiselectDisabled, function (newVal) {
                return $btn.attr('disabled', newVal);
            });
        }
    };
});

app.controller('ForensicCtrl', function ($scope, $state, $stateParams, AminoUser, DwTrail, DwDomainEntityType, ForensicService, gettextCatalog, AppAuth) {

    $scope.trail = {};
    //Put the currentUser in $scope for convenience
    $scope.currentUser = AppAuth.currentUser;
    $scope.teams = [];
    $scope.domains = [];
    $scope.trails = [];
    $scope.selectedTeam = null;
    $scope.selectedDomain = null;
    $scope.selectedTrail = null;
    $scope.selectedViews = [];

    //Setup the view dropdown menu
    $scope.views = [];
    $scope.viewSettings = {buttonClasses: 'btn btn-primary btn-sm', displayProp: 'name'};
    $scope.viewCustomText = {buttonDefaultText: 'Select Views'};

    //Setup the visited pages grid
    $scope.sortType = 'name'; // set the default sort type
    $scope.sortReverse = false;  // set the default sort order
    $scope.visitedSearch = '';     // set the default search/filter term


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
                            if (entityTypes.indexOf(type) === -1) {
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
                console.log("Getting trail");
                console.log(JSON.stringify(trail));

                var graph = ForensicService.getBrowsePathEdgesWithInfo(trail, $scope.selectedViews);
                change_graph(graph)
                $scope.visitedGrid = trail.trailUrls;
                $scope.entitiesGrid = ForensicService.getEntities(trail);
                console.log(JSON.stringify($scope.visitedGrid));
            })
            .catch(function (err) {
                console.log("Error getting trail: " + $scope.selectedTrail.id);
                console.log(err);
            });
    };

    var userFilter = {
        filter: {
            where: {
                id: AppAuth.currentUser.id
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
});
