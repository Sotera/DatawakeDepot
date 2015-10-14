'use strict';
var app = angular.module('com.module.dwTrails');

app.run(function($rootScope, DwTrail, gettextCatalog) {
  $rootScope.addMenu(gettextCatalog.getString('Trails'), 'app.dwTrails.list', 'fa-cog');

  DwTrail.find(function(data) {
    $rootScope.addDashboardBox(gettextCatalog.getString('Trails'), 'bg-blue', 'ion-android-share-alt', data.length, 'app.dwTrails.list');
  });

});
