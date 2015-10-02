'use strict';
var app = angular.module('com.module.dwDomainEntityTypes');
app.controller('DwDomainEntityTypesCtrl', function ($scope, $stateParams, $state, CoreService, DwDomainEntityType, AppAuth, gettextCatalog) {


  //Setup formly fields for add & edit routes
  $scope.formFields = [{
    key: 'name',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('DomainEntity Type Name'),
      type: 'input',
      required: true,
      disabled: false
    }
  }, {
    key: 'description',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('DomainEntity Type Value'),
      type: 'input',
      required: true
    }
  }];

  //if $stateParams.id is defined we will be editing an existing dwDomainEntityType.
  //Otherwise creating a new dwDomainEntityType
  if ($stateParams.id) {
    DwDomainEntityType.findOne({
      filter: {
        where: {
          id: $stateParams.id
        }
      }
    }, function (result) {
      $scope.dwDomainEntityType = result;
    }, function (err) {
      console.log(err);
    });
  }

  $scope.delete = function (id) {
    CoreService.confirm(gettextCatalog.getString('Are you sure?'),
        gettextCatalog.getString('Deleting this cannot be undone'),
        function () {
          DwDomainEntityType.deleteById(id, function () {
                CoreService.toastSuccess(gettextCatalog.getString(
                    'DomainEntity Type deleted'), gettextCatalog.getString(
                    'Your DomainEntity Type is deleted!'));
                $state.go('app.dwDomainEntityTypes.list');
              },
              function (err) {
                CoreService.toastError(gettextCatalog.getString(
                    'Error deleting DomainEntity Type'), gettextCatalog.getString(
                    'Your DomainEntity Type is not deleted:' + err));
              });
        },
        function () {
          return false;
        });
  };

  $scope.loading = true;
  DwDomainEntityType.find({filter:{}}).$promise
      .then(function(allDomainEntityTypes){
        $scope.safeDisplayedDomainEntityTypes = allDomainEntityTypes;
        $scope.displayedDomainEntityTypes = [].concat($scope.safeDisplayedDomainEntityTypes);
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function(){
        $scope.loading = false;
      });
  return;

  $scope.safeDisplayedDomainEntityTypes = DwDomainEntityType.find({
    filter: {
      include: []
    }
  }, function () {
    $scope.loading = false;
  });

  $scope.displayedDomainEntityTypes = [].concat($scope.safeDisplayedDomainEntityTypes);
  $scope.onSubmit = function () {
    DwDomainEntityType.upsert($scope.dwDomainEntityType, function () {
      CoreService.toastSuccess(gettextCatalog.getString('DomainEntity Type saved'),
          gettextCatalog.getString('This DomainEntity Type is saved!'));
      $state.go('^.list');
    }, function (err) {
      CoreService.toastError(gettextCatalog.getString(
          'Error saving DomainEntity Type: ', +err));
    });
  };
  return;

});
