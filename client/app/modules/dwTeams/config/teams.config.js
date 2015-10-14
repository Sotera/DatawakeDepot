'use strict';
var app = angular.module('com.module.dwTeams');

app.run(function($rootScope, DwTeam, gettextCatalog) {
  $rootScope.addMenu(gettextCatalog.getString('Teams'), 'app.dwTeams.list', 'fa-group');

  DwTeam.find(function(data) {
    $rootScope.addDashboardBox(gettextCatalog.getString('Teams'), 'bg-teal', 'ion-clipboard', data.length, 'app.dwTeams.list');
  });

});
