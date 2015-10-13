'use strict';
var app = angular.module('com.module.dwSettings');

app.run(function($rootScope, DwSetting, gettextCatalog) {
  $rootScope.addMenu(gettextCatalog.getString('Settings'), 'app.dwSettings.list', 'fa-cog');

  DwSetting.find(function(data) {
    $rootScope.addDashboardBox(gettextCatalog.getString('Settings'), 'bg-navy', 'ion-clipboard', data.length, 'app.dwSettings.list');
  });

});
