'use strict';
var app = angular.module('com.module.dwForensic');

app.controller('ForensicCtrl', function ($scope, $state, $stateParams, DwTrail, DwTrailUrl, DwDomainEntityType, ForensicService, gettextCatalog, AppAuth) {

    $scope.trail = {};
    //Put the currentUser in $scope for convenience
    $scope.currentUser = AppAuth.currentUser;
    $scope.domains = [];
    $scope.trails = [];
    $scope.selectedTeam = null;
    $scope.selectedDomain = null;
    $scope.selectedTrail = null;
    $scope.selectedViews = [];

    //Setup the view dropdown menu
    $scope.views = ForensicService.getDomainEntityTypes();
    $scope.viewSettings = {buttonClasses: 'btn btn-primary btn-sm', displayProp: 'name'};
    $scope.viewCustomText = {buttonDefaultText: 'Select Views'};

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
        $scope.views = ForensicService.getDomainEntityTypes();
    };

    $scope.drawGraph = function (trailId) {
        var graphViews = ForensicService.buildGraphViews($scope.selectedViews);
        DwTrail.findOne({
            filter: {
                "where": {
                    "id": trailId
                },
                "include": ["domain", "team", {
                    "relation": "trailUrls",
                    "scope": {
                        "include": [{
                            "relation": "urlExtractions",
                            "scope": {
                                "where": {
                                    "dwDomainEntityTypeId": {
                                        "inq": graphViews
                                    }
                                },
                                "include": "domainEntityType"
                            }
                        }]
                    }
                }]
            }
        }).$promise
            .then(function (trail) {
                console.log("Getting trail");
                console.log(JSON.stringify(trail));

                var graph = ForensicService.getBrowsePathEdgesWithInfo(trail);
                change_graph(graph)
            })
            .catch(function (err) {
                console.log("Error getting trail: " + trailId);
                console.log(err);
            });
    };
});

