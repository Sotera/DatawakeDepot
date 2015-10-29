'use strict';
var app = angular.module('com.module.dwForensic');

app.controller('ForensicCtrl', function($scope, $state, $stateParams, DwTrail, ForensicService, gettextCatalog, AppAuth) {

    $scope.trail = {};
    //Put the currentUser in $scope for convenience
    $scope.currentUser = AppAuth.currentUser;
    $scope.userTeams = [];


    //Load the currentUser's Teams into a local array
    if(AppAuth.currentUser.teams) {
        $scope.loading = true;

       for (var i = 0; i < $scope.currentUser.teams.length; ++i) {
           $scope.userTeams.push({
               value: $scope.currentUser.teams[i].name,
               name: $scope.currentUser.teams[i].name,
               id: $scope.currentUser.teams[i].id,
               domains: $scope.currentUser.teams[i].domains
           });
        }
        $scope.loading = false;
    }

});

