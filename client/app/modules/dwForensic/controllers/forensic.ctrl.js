'use strict';
var app = angular.module('com.module.dwForensic');

app.controller('ForensicCtrl', function($scope, $state, $stateParams, DwTrail, ForensicService, gettextCatalog, AppAuth) {

    $scope.trail = {};
    //Put the currentUser in $scope for convenience
    $scope.currentUser = AppAuth.currentUser;
    $scope.trails = [];
    $scope.currentTrail = [];

    $scope.loading = true;
    DwTrail.find({filter: {include: []}}).$promise
        .then(function (alltrails) {
            if(alltrails) {
                $scope.trails = alltrails;
            }
        })
        .catch(function (err) {
            console.log(err);
        })
        .then(function () {
            $scope.loading = false;
        });

    if ($stateParams.id) {
        ForensicService.getTrail($stateParams.id).$promise.then(function(result){
            $scope.trail = result;})
    } else {
        $scope.trail = {};
    }
});

