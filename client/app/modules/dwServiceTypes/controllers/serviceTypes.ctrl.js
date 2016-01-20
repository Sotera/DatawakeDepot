'use strict';
var app = angular.module('com.module.dwServiceTypes');

app.controller('ServiceTypesCtrl', function($scope, $state, $stateParams, ServiceTypesService, gettextCatalog, AppAuth) {

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
    AppAuth.getCurrentUser().then(function (currUser) {
        $scope.currentUser = currUser;
        if ($stateParams.id) {
            ServiceTypesService.getServiceType($stateParams.id).$promise.then(function(result){
                $scope.serviceType = result;
                $scope.safeDisplayedserviceTypes = {};
                $scope.displayedserviceTypes = {};
                $scope.loading = false;
            })
        } else {
            ServiceTypesService.getServiceTypes().$promise.then(function(result){
                $scope.serviceType = {};
                $scope.safeDisplayedserviceTypes = result;
                $scope.displayedserviceTypes = [].concat($scope.safeDisplayedserviceTypes);
                $scope.loading = false;
            })
        }
    }, function (err) {
        console.log(err);
    });

});

