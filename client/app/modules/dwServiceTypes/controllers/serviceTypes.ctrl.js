'use strict';
var app = angular.module('com.module.dwServiceTypes');

app.controller('ServiceTypesCtrl', function($scope, $state, $stateParams, DwServiceType, ServiceTypesService, gettextCatalog, AppAuth) {

    //Put the currentUser in $scope for convenience
    $scope.currentUser = AppAuth.currentUser;

    $scope.serviceType = {};
    $scope.formFields = [{
        key: 'id',
        type: 'input',
        templateOptions: {
            label: gettextCatalog.getString('id'),
            disabled: true
        }
    },{
        key: 'name',
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
            required: false
        }
    }];

    $scope.delete = function(id) {
        ServiceTypesService.deleteServiceType(id, function() {
            $scope.safeDisplayedserviceTypes = ServiceTypesService.getServiceTypes();
            $state.go('^.list');
        });
    };

    $scope.onSubmit = function() {
        ServiceTypesService.upsertServiceType($scope.serviceType, function() {
            $scope.safeDisplayedserviceTypes = ServiceTypesService.getServiceTypes();
            $state.go('^.list');
        });
    };

    $scope.loading = true;
    DwServiceType.find({filter: {include: []}}).$promise
        .then(function (allserviceTypes) {
            $scope.safeDisplayedserviceTypes = allserviceTypes;
            $scope.displayedserviceTypes = [].concat($scope.safeDisplayedserviceTypes);
        })
        .catch(function (err) {
            console.log(err);
        })
        .then(function () {
            $scope.loading = false;
        });

    if ($stateParams.id) {
        ServiceTypesService.getServiceType($stateParams.id).$promise.then(function(result){
            $scope.serviceType = result;})
    } else {
        $scope.serviceType = {};
    }
});

