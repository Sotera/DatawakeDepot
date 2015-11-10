'use strict';
var app = angular.module('com.module.dwTrails');

app.run(function($rootScope, DwTrail, gettextCatalog) {
  $rootScope.addMenu(gettextCatalog.getString('Trails'), 'app.dwTrails.list', 'ion-pull-request');
  $rootScope.addMenu(gettextCatalog.getString('Trail Import'), 'app.dwTrails.import', 'ion-log-in');

  DwTrail.find(function(data) {
    $rootScope.addDashboardBox(gettextCatalog.getString('Trails'), 'bg-blue10', 'ion-android-share-alt', data.length, 'app.dwTrails.list');
  });
});
