'use strict';
var app = angular.module('com.module.dwSettings');

app.run(function($rootScope, DwSetting, gettextCatalog) {
  $rootScope.addMenu(gettextCatalog.getString('Settings'), 'app.dwSettings.list', 'ion-settings');

  //DwSetting.find(function(data) {
  //  $rootScope.addDashboardBox(gettextCatalog.getString('Settings'), 'bg-blue', 'ion-settings', data.length, 'app.dwSettings.list');
  //});

});
