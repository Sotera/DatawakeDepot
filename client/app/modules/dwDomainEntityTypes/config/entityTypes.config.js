'use strict';
var app = angular.module('com.module.dwDomainEntityTypes');

app.run(function($rootScope, DwDomainEntityType, gettextCatalog) {
  $rootScope.addMenu(gettextCatalog.getString('EntityTypes'), 'app.dwDomainEntityTypes.list', 'fa-cog');

  DwDomainEntityType.find(function(data) {
    $rootScope.addDashboardBox(gettextCatalog.getString('EntityTypes'), 'bg-yellow', 'ion-clipboard', data.length, 'app.dwDomainEntityTypes.list');
  });

});
