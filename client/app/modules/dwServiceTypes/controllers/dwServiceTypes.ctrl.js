'use strict';
var app = angular.module('com.module.dwServiceTypes');
app.controller('DwServiceTypesCtrl', function ($scope, $stateParams, $state, CoreService, DwServiceType, AppAuth, gettextCatalog) {


    //Setup formly fields for add & edit routes
    $scope.formFields = [{
        key: 'name',
        type: 'input',
        templateOptions: {
            label: gettextCatalog.getString('Service Type Name'),
            type: 'input',
            required: true,
            disabled: false
        }
    }, {
        key: 'description',
        type: 'input',
        templateOptions: {
            label: gettextCatalog.getString('Service Type Value'),
            type: 'input',
            required: true
        }
    }];

    //if $stateParams.id is defined we will be editing an existing dwServiceType.
    //Otherwise creating a new dwServiceType
    if ($stateParams.id) {
        DwServiceType.findOne({
            filter: {
                where: {
                    id: $stateParams.id
                }
            }
        }, function (result) {
            $scope.dwServiceType = result;
        }, function (err) {
            console.log(err);
        });
    }

    $scope.delete = function (id) {
        CoreService.confirm(gettextCatalog.getString('Are you sure?'),
            gettextCatalog.getString('Deleting this cannot be undone'),
            function () {
                DwServiceType.deleteById(id, function () {
                        CoreService.toastSuccess(gettextCatalog.getString(
                            'Service Type deleted'), gettextCatalog.getString(
                            'Your Service Type is deleted!'));
                        $state.go('app.dwServiceTypes.list');
                    },
                    function (err) {
                        CoreService.toastError(gettextCatalog.getString(
                            'Error deleting Service Type'), gettextCatalog.getString(
                            'Your Service Type is not deleted:' + err));
                    });
            },
            function () {
                return false;
            });
    };

    $scope.loading = true;
    DwServiceType.find({filter:{}}).$promise
        .then(function(allServiceTypes){
            $scope.safeDisplayedServiceTypes = allServiceTypes;
            $scope.displayedServiceTypes = [].concat($scope.safeDisplayedServiceTypes);
        })
        .catch(function (err) {
            console.log(err);
        })
        .then(function(){
            $scope.loading = false;
        });
    return;

    $scope.safeDisplayedServiceTypes = DwServiceType.find({
        filter: {
            include: []
        }
    }, function () {
        $scope.loading = false;
    });

    $scope.displayedServiceTypes = [].concat($scope.safeDisplayedServiceTypes);
    $scope.onSubmit = function () {
        DwServiceType.upsert($scope.dwServiceType, function () {
            CoreService.toastSuccess(gettextCatalog.getString('Service Type saved'),
                gettextCatalog.getString('This Service Type is saved!'));
            $state.go('^.list');
        }, function (err) {
            CoreService.toastError(gettextCatalog.getString(
                'Error saving Service Type: ', +err));
        });
    };
    return;

});
