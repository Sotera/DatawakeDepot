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

  $scope.settings = SettingsService.getSettings();

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

  //Search Functionality
  function arrayObjectIndexOf(myArray, searchTerm, property) {
    for (var i = 0, len = myArray.length; i < len; i++) {
      if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
  }
  $scope.aToB = function () {
    for (var i in $scope.selectedA) {
      var moveId = arrayObjectIndexOf($scope.items, $scope.selectedA[i], "id");
      $scope.listB.push($scope.items[moveId]);
      var delId = arrayObjectIndexOf($scope.listA, $scope.selectedA[i], "id");
      $scope.listA.splice(delId, 1);
    }
    reset();
  };
  $scope.bToA = function () {
    for (var i in $scope.selectedB) {
      var moveId = arrayObjectIndexOf($scope.items, $scope.selectedB[i], "id");
      $scope.listA.push($scope.items[moveId]);
      var delId = arrayObjectIndexOf($scope.listB, $scope.selectedB[i], "id");
      $scope.listB.splice(delId, 1);
    }
    reset();
  };
  function reset() {
    $scope.selectedA = [];
    $scope.selectedB = [];
    $scope.toggle = 0;
  }

  $scope.toggleA = function () {
    if ($scope.selectedA.length > 0) {
      $scope.selectedA = [];
    }
    else {
      for (var i in $scope.listA) {
        $scope.selectedA.push($scope.listA[i].id);
      }
    }
  }
  $scope.toggleB = function () {
    if ($scope.selectedB.length > 0) {
      $scope.selectedB = [];
    }
    else {
      for (var i in $scope.listB) {
        $scope.selectedB.push($scope.listB[i].id);
      }
    }
  }
  $scope.selectA = function (i) {
    $scope.selectedA.push(i);
  };
  $scope.selectB = function (i) {
    $scope.selectedB.push(i);
  };
});

