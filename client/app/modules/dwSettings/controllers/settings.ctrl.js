'use strict';
var app = angular.module('com.module.dwSettings');

app.controller('SettingsCtrl', function($scope, $state, $stateParams, DwSetting, SettingsService, gettextCatalog, AppAuth) {

  //Put the currentUser in $scope for convenience
  $scope.currentUser = AppAuth.currentUser;

  $scope.setting = {};
  $scope.formFields = [{
    key: 'setting',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Setting'),
      required: true
    }
  }, {
    key: 'value',
    type: 'input',
    templateOptions: {
      label: gettextCatalog.getString('Value'),
      required: true
    }
  }];

  $scope.delete = function(id) {
    SettingsService.deleteSetting(id, function() {
      $scope.safeDisplayedsettings = SettingsService.getSettings();
      $state.go('^.list');
    });
  };

  $scope.onSubmit = function() {
    SettingsService.upsertSetting($scope.setting, function() {
      $scope.safeDisplayedsettings = SettingsService.getSettings();
      $state.go('^.list');
    });
  };

  $scope.loading = true;
  DwSetting.find({filter: {include: []}}).$promise
      .then(function (allSettings) {
        $scope.safeDisplayedsettings = allSettings;
        $scope.displayedSettings = [].concat($scope.safeDisplayedsettings);
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {
        $scope.loading = false;
      });

  if ($stateParams.id) {
    SettingsService.getSetting($stateParams.id).$promise.then(function(result){
      $scope.setting = result;})
  } else {
    $scope.setting = {};
  }
});

