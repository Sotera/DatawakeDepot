'use strict';
var app = angular.module('com.module.dwTrailUrls');
app.controller('DwTrailUrlsCtrl', function ($scope, $stateParams, $state, CoreService, DwTrailUrl, AppAuth, gettextCatalog) {

  //Put the currentTrailUrl in $scope for convenience
  //$scope.currentUser = AppAuth.currentUser;
  //Setup formly fields for add & edit routes
  $scope.formFields = [{
    key: 'name',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('TrailUrl Name'),
      type: 'input',
      required: true,
      disabled: false
    }
  }, {
    key: 'description',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('TrailUrl Description'),
      type: 'input',
      required: true
    }
  }];
  //if $stateParams.id is defined we will be editing an existing trailUrl.
  //Otherwise creating a new trailUrl
  if ($stateParams.id) {
    DwTrailUrl.findOne({
      filter: {
        where: {
          id: $stateParams.id
        }
      }
    }, function (result) {
      $scope.trailUrl = result;
    }, function (err) {
      console.log(err);
    });
  }
  $scope.delete = function (id) {
    CoreService.confirm(gettextCatalog.getString('Are you sure?'),
      gettextCatalog.getString('Deleting this cannot be undone'),
      function () {
        DwTrailUrl.deleteById(id, function () {
            CoreService.toastSuccess(gettextCatalog.getString(
              'TrailUrl deleted'), gettextCatalog.getString(
              'Your Trail Url is deleted!'));
            $state.go('app.dwTrailUrls.list');
          },
          function (err) {
            CoreService.toastError(gettextCatalog.getString(
              'Error deleting Ttrail Url'), gettextCatalog.getString(
              'Your trail Url is not deleted:' + err));
          });
      },
      function () {
        return false;
      });
  };
  $scope.loading = true;
  DwTrailUrl.find({filter: {}}).$promise
    .then(function (allTrailUrls) {
      $scope.safeDisplayedTrailUrls = allTrailUrls;
      $scope.displayedTails = [].concat($scope.safeDisplayedTrailUrls);
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      $scope.loading = false;
    });
  $scope.onSubmit = function () {
    DwTrailUrl.upsert($scope.trailUrl).$promise
      .then(function () {
        CoreService.toastSuccess(gettextCatalog.getString('TrailUrl saved'),
          gettextCatalog.getString('This Trail Url is saved!'));
        $state.go('^.list');
      })
      .catch(function (err) {
        CoreService.toastError('Error saving Trail Url: ' + err);
      });
  };
});
