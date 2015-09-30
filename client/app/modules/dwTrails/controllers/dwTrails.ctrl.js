'use strict';
var app = angular.module('com.module.dwTrails');
app.controller('DwTrailsCtrl', function ($scope, $stateParams, $state, CoreService, DwTrail, AppAuth, gettextCatalog) {

  //Put the currentTrail in $scope for convenience
  //$scope.currentUser = AppAuth.currentUser;
  //Setup formly fields for add & edit routes
  $scope.formFields = [{
    key: 'name',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Trail Name'),
      type: 'input',
      required: true,
      disabled: false
    }
  }, {
    key: 'description',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Trail Description'),
      type: 'input',
      required: true
    }
  }];
  //if $stateParams.id is defined we will be editing an existing trail.
  //Otherwise creating a new trail
  if ($stateParams.id) {
    DwTrail.findOne({
      filter: {
        where: {
          id: $stateParams.id
        }
      }
    }, function (result) {
      $scope.trail = result;
    }, function (err) {
      console.log(err);
    });
  }
  $scope.delete = function (id) {
    CoreService.confirm(gettextCatalog.getString('Are you sure?'),
      gettextCatalog.getString('Deleting this cannot be undone'),
      function () {
        DwTrail.deleteById(id, function () {
            CoreService.toastSuccess(gettextCatalog.getString(
              'Trail deleted'), gettextCatalog.getString(
              'Your trail is deleted!'));
            $state.go('app.dwTrails.list');
          },
          function (err) {
            CoreService.toastError(gettextCatalog.getString(
              'Error deleting trail'), gettextCatalog.getString(
              'Your trail is not deleted:' + err));
          });
      },
      function () {
        return false;
      });
  };
  $scope.loading = true;
  DwTrail.find({filter: {}}).$promise
    .then(function (allTrails) {
      $scope.safeDisplayedTrails = allTrails;
      $scope.displayedTails = [].concat($scope.safeDisplayedTrails);
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      $scope.loading = false;
    });
  $scope.onSubmit = function () {
    DwTrail.upsert($scope.trail).$promise
      .then(function () {
        CoreService.toastSuccess(gettextCatalog.getString('Trail saved'),
          gettextCatalog.getString('This trail is saved!'));
        $state.go('^.list');
      })
      .catch(function (err) {
        CoreService.toastError('Error saving trail: ' + err);
      });
  };
});
