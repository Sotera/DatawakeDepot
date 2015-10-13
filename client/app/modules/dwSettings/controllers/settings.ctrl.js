'use strict';
var app = angular.module('com.module.dwSettings');

app.controller('SettingsCtrl', function($scope, $state, $stateParams, SettingsService, gettextCatalog, AppAuth) {

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
      $scope.settings = SettingsService.getSettings();
      $state.go('^.list');
    });
  };

  $scope.onSubmit = function() {
    SettingsService.upsertSetting($scope.setting, function() {
      $scope.settings = SettingsService.getSettings();
      $state.go('^.list');
    });
  };

  $scope.settings = SettingsService.getSettings();

  if ($stateParams.id) {
    SettingsService.getSetting($stateParams.id).$promise.then(function(result){
      $scope.setting = result;})
  } else {
    $scope.setting = {};
  }

});

