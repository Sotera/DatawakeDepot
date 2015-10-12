'use strict';
var app = angular.module('com.module.dwSettings');
app.controller('DwSettingsCtrl', function ($scope, $stateParams, $state, CoreService, DwSetting, AppAuth, gettextCatalog) {


  //Setup formly fields for add & edit routes
  $scope.formFields = [{
    key: 'setting',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Setting Name'),
      type: 'input',
      required: true,
      disabled: false
    }
  }, {
    key: 'value',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Setting Value'),
      type: 'input',
      required: true
    }
  }];
  //if $stateParams.id is defined we will be editing an existing dwSetting.
  //Otherwise creating a new dwSetting
  if ($stateParams.id) {
    DwSetting.findOne({
      filter: {
        where: {
          id: $stateParams.id
        }
      }
    }, function (result) {
      $scope.dwSetting = result;
    }, function (err) {
      console.log(err);
    });
  }
  $scope.delete = function (id) {
    CoreService.confirm(gettextCatalog.getString('Are you sure?'),
      gettextCatalog.getString('Deleting this cannot be undone'),
      function () {
        DwSetting.deleteById(id, function () {
            CoreService.toastSuccess(gettextCatalog.getString(
              'Setting deleted'), gettextCatalog.getString(
              'Your Setting is deleted!'));
            $state.go('app.dwSettings.list');
          },
          function (err) {
            CoreService.toastError(gettextCatalog.getString(
              'Error deleting Setting'), gettextCatalog.getString(
              'Your Setting is not deleted:' + err));
          });
      },
      function () {
        return false;
      });
  };
  $scope.loading = true;
  DwSetting.find({filter: {}}).$promise
    .then(function (allSettings) {
      $scope.safeDisplayedSettings = allSettings;
      $scope.displayedSettings = [].concat($scope.safeDisplayedSettings);
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      $scope.loading = false;
    });
  return;
  $scope.safeDisplayedSettings = Setting.find({
    filter: {
      include: []
    }
  }, function () {
    $scope.loading = false;
  });
  $scope.displayedSettings = [].concat($scope.safeDisplayedSettings);
  $scope.onSubmit = function () {
    DwSetting.upsert($scope.dwSetting, function () {
      CoreService.toastSuccess(gettextCatalog.getString('Setting saved'),
        gettextCatalog.getString('This Setting is saved!'));
      $state.go('^.list');
    }, function (err) {
      CoreService.toastError(gettextCatalog.getString(
        'Error saving Setting: ', +err));
    });
  };
  return;
});
