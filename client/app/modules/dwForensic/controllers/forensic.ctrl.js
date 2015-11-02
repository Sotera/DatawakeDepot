'use strict';
var app = angular.module('com.module.dwForensic');

app.controller('ForensicCtrl', function($scope, $state, $stateParams, DwTrail, DwTrailUrl, DwDomainEntityType, ForensicService, gettextCatalog, AppAuth) {

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
    $scope.viewSettings = {buttonClasses: 'btn btn-primary btn-sm', displayProp: 'name', idProp: 'name'};
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


    $scope.drawGraph = function(trailId) {
        DwTrail.findOne({filter: {"where": {"id": trailId}, include: ['domain','team',{"relation": "trailUrls", "scope": {"include": "urlExtractions"}}]}}).$promise
            .then(function (trail) {
                console.log("Getting trail");
                console.log(JSON.stringify(trail));

                //TODO: This is only here for debugging.
                $scope.trail = trail;

                var graphViews = ForensicService.buildGraphViews($scope.selectedViews);
                var graph = ForensicService.getBrowsePathEdgesWithInfo(trail, graphViews);
                console.log("graph");
                console.log(JSON.stringify(graph));
                var fullGraph =  ForensicService.processEdges(graph['edges'], graph['nodes'])
                console.log("full graph");
                console.log(JSON.stringify(fullGraph));
                return fullGraph
            })
            .catch(function (err) {
                console.log("Error getting trail: " + trailId);
                console.log(err);
            });
    };
});

