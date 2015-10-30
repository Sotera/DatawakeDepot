'use strict';
var app = angular.module('com.module.dwForensic');

app.controller('ForensicCtrl', function($scope, $state, $stateParams, DwTrail, DwDomainEntityType, ForensicService, gettextCatalog, AppAuth) {

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

    $scope.drawGraph = function() {
        //convert to a list of entity types
        var graphView = ForensicService.getGraphViews($scope.selectedViews);
        //var trail = ForensicService.getTrails($scope.selectedTrail.id);
        var trail = ForensicService.getTrail();
        console.log(JSON.stringify(trail));
        var graph = ForensicService.getBrowsePathEdgesWithInfo(trail, graphView);
        return ForensicService.processEdges(graph['edges'], graph['nodes'])
    };

});

