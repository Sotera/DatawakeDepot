'use strict';
var app = angular.module('com.module.dwForensic');

app.controller('ForensicCtrl', function($scope, $state, $stateParams, DwTrail, ForensicService, gettextCatalog, AppAuth) {

    $scope.trail = {};
    //Put the currentUser in $scope for convenience
    $scope.currentUser = AppAuth.currentUser;
    $scope.domains = [];
    $scope.trails = [];
    $scope.selectedTeam = null;
    $scope.selectedDomain = null;
    $scope.selectedTrail = null;
    $scope.views =[ {id: 1, label: "phone"}, {id: 2, label: "email"},{id: 3, label: "bitcoin"}, {id: 4, label: "PERSON"},{id: 5, label: "ORGANIZATION"}, {id: 6, label: "MISC"}];
    $scope.selectedViews = [];

    $scope.getTrails = function() {
        return $scope.currentUser.trails;
    }

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
    }

    $scope.trailChanged = function (trail) {
        $scope.selectedTrail = trail;
    }
    
});

